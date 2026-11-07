<?php

namespace App\Services;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Impor buku dari Google Books API.
 *
 * Data mentah diambil dari https://www.googleapis.com/books/v1/volumes
 * (API key opsional lewat env GOOGLE_BOOKS_API_KEY). Cover diunduh ke
 * disk "public" folder covers/ karena kolom books.cover_path menyimpan
 * path storage (frontend menampilkan /storage/<cover_path>), bukan URL.
 */
class GoogleBooksService
{
    /**
     * Peta kategori Google Books -> kategori lokal Ruang Membaca.
     * Kategori yang tidak ada di peta dibuat apa adanya.
     */
    protected array $categoryMap = [
        'fiction' => 'Fiksi',
        'juvenile fiction' => 'Fiksi',
        'young adult fiction' => 'Fiksi',
        'literary fiction' => 'Fiksi',
        'history' => 'Sejarah',
        'technology' => 'Teknologi',
        'computers' => 'Teknologi',
        'education' => 'Pendidikan',
        'study aids' => 'Pendidikan',
        'biography & autobiography' => 'Nonfiksi',
        'self-help' => 'Nonfiksi',
        'business & economics' => 'Nonfiksi',
        'psychology' => 'Nonfiksi',
        'religion' => 'Nonfiksi',
        'science' => 'Nonfiksi',
        'literary collections' => 'Sastra Klasik',
        'poetry' => 'Sastra Klasik',
        'drama' => 'Sastra Klasik',
    ];

    /**
     * Cari buku ke Google Books API.
     *
     * @return array<int, array> daftar item yang sudah dinormalisasi
     *                           (lihat normalizeItem()).
     */
    public function search(string $query, int $limit = 20): array
    {
        $params = [
            'q' => $query,
            'maxResults' => max(1, min($limit, 40)),
            'langRestrict' => 'id',
            'printType' => 'books',
        ];

        $apiKey = env('GOOGLE_BOOKS_API_KEY');
        if (! empty($apiKey)) {
            $params['key'] = $apiKey;
        }

        $response = Http::timeout(20)
            ->acceptJson()
            ->get('https://www.googleapis.com/books/v1/volumes', $params);

        if (! $response->successful()) {
            return [];
        }

        $results = [];
        foreach ($response->json('items', []) as $item) {
            $normalized = $this->normalizeItem($item);
            if ($normalized !== null) {
                $results[] = $normalized;
            }
        }

        return $results;
    }

    /**
     * Normalisasi satu item mentah Google Books menjadi bentuk datar.
     * Mengembalikan null bila item tidak valid (wajib ada judul,
     * penulis, dan thumbnail cover).
     */
    public function normalizeItem(array $item): ?array
    {
        $info = $item['volumeInfo'] ?? [];

        $title = trim((string) ($info['title'] ?? ''));
        $authors = collect($info['authors'] ?? [])
            ->map(fn ($name) => trim((string) $name))
            ->filter()
            ->values()
            ->all();
        $thumbnail = (string) ($info['imageLinks']['thumbnail'] ?? $info['imageLinks']['smallThumbnail'] ?? '');

        if ($title === '' || $authors === [] || $thumbnail === '') {
            return null;
        }

        $isbn = null;
        foreach ($info['industryIdentifiers'] ?? [] as $identifier) {
            if (($identifier['type'] ?? '') === 'ISBN_13') {
                $isbn = $identifier['identifier'] ?? null;
                break;
            }
        }
        if ($isbn === null) {
            foreach ($info['industryIdentifiers'] ?? [] as $identifier) {
                $isbn = $identifier['identifier'] ?? null;
                if ($isbn !== null) {
                    break;
                }
            }
        }

        $publishedYear = null;
        if (! empty($info['publishedDate']) && preg_match('/(\d{4})/', (string) $info['publishedDate'], $m)) {
            $publishedYear = (int) $m[1];
        }

        $coverUrl = str_replace('http://', 'https://', $thumbnail);
        $coverUrl = preg_replace('/zoom=\d/', 'zoom=1', $coverUrl);

        return [
            'title' => $title,
            'authors' => $authors,
            'publisher' => $info['publisher'] ?? null,
            'published_year' => $publishedYear,
            'isbn' => $isbn !== null ? substr(str_replace('-', '', (string) $isbn), 0, 20) : null,
            'page_count' => (int) ($info['pageCount'] ?? 0),
            'language' => substr((string) ($info['language'] ?? 'id'), 0, 10),
            'description' => ! empty($info['description'])
                ? Str::limit(trim(strip_tags((string) $info['description'])), 1500, '')
                : null,
            'cover_url' => $coverUrl,
            'categories' => collect($info['categories'] ?? [])
                ->map(fn ($c) => trim((string) $c))
                ->filter()
                ->values()
                ->all(),
            'google_books_id' => $item['id'] ?? null,
        ];
    }

    /**
     * Impor satu item (mentah Google Books atau hasil normalizeItem())
     * menjadi record Book. Aman dipanggil berulang: buku yang sudah ada
     * (berdasarkan ISBN, fallback slug) tidak diduplikasi.
     */
    public function importFromApiItem(array $item): Book
    {
        $data = isset($item['volumeInfo'])
            ? $this->normalizeItem($item)
            : $item;

        if ($data === null || empty($data['title']) || empty($data['authors'])) {
            throw new \InvalidArgumentException('Item buku tidak valid: judul dan penulis wajib ada.');
        }

        return $this->importNormalized($data);
    }

    /**
     * Impor dari bentuk datar (dipakai juga oleh ApiBookSeeder untuk
     * data yang sudah disimpan sebagai JSON).
     */
    public function importNormalized(array $data): Book
    {
        $authorName = trim((string) $data['authors'][0]);
        $author = Author::firstOrCreate(
            ['slug' => Str::slug($authorName)],
            ['name' => $authorName]
        );

        $isbn = ! empty($data['isbn'])
            ? substr(str_replace('-', '', (string) $data['isbn']), 0, 20)
            : null;

        $slug = $this->uniqueSlug((string) $data['title'], $isbn);

        $attributes = [
            'author_id' => $author->id,
            'title' => (string) $data['title'],
            'synopsis' => ! empty($data['description'])
                ? Str::limit(trim(strip_tags((string) $data['description'])), 1500, '')
                : null,
            'publisher' => $data['publisher'] ?? null,
            'published_year' => ! empty($data['published_year']) ? (int) $data['published_year'] : null,
            'page_count' => (int) ($data['page_count'] ?? 0),
            'language' => substr((string) ($data['language'] ?? 'id'), 0, 10),
            'status' => 'published',
            'view_count' => 0,
            'reader_count' => 0,
            'download_count' => 0,
        ];

        if ($isbn !== null) {
            $book = Book::firstOrCreate(['isbn' => $isbn], $attributes + ['slug' => $slug]);
        } else {
            $book = Book::firstOrCreate(['slug' => $slug], $attributes);
        }

        // Cover: unduh sekali saja bila buku belum punya cover.
        if (empty($book->cover_path) && ! empty($data['cover_url'])) {
            $coverPath = $this->downloadCover((string) $data['cover_url'], $book->slug);
            if ($coverPath !== null) {
                $book->forceFill(['cover_path' => $coverPath])->save();
            }
        }

        // Kategori (maks 2) — dipetakan ke kategori lokal atau dibuat baru.
        $categoryIds = [];
        foreach (array_slice($data['categories'] ?? [], 0, 2) as $apiCategory) {
            $topLevel = trim(explode('/', (string) $apiCategory)[0]);
            if ($topLevel === '') {
                continue;
            }
            $name = $this->categoryMap[strtolower($topLevel)] ?? Str::title($topLevel);
            $category = Category::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'description' => 'Koleksi buku kategori '.$name.'.']
            );
            $categoryIds[] = $category->id;
        }
        if ($categoryIds !== []) {
            $book->categories()->syncWithoutDetaching($categoryIds);
        }

        return $book;
    }

    /**
     * Buat slug unik untuk buku baru.
     */
    protected function uniqueSlug(string $title, ?string $isbn): string
    {
        $base = Str::slug($title) ?: 'buku';
        $slug = $base;

        if (Book::where('slug', $slug)->exists()) {
            $slug = $isbn !== null ? $base.'-'.$isbn : $base.'-'.Str::lower(Str::random(5));
        }

        return substr($slug, 0, 255);
    }

    /**
     * Unduh cover ke disk public folder covers/.
     * Mengembalikan path relatif (mis. "covers/google-books-....jpg")
     * atau null bila unduhan gagal (impor tetap lanjut tanpa cover).
     */
    protected function downloadCover(string $url, string $slug): ?string
    {
        try {
            $response = Http::timeout(20)->get($url);
            if (! $response->successful() || empty($response->body())) {
                return null;
            }

            $contentType = strtolower((string) $response->header('Content-Type', ''));
            $extension = str_contains($contentType, 'png') ? 'png' : 'jpg';
            $path = 'covers/google-books-'.$slug.'.'.$extension;

            Storage::disk('public')->put($path, $response->body());

            return $path;
        } catch (\Throwable $e) {
            return null;
        }
    }
}
