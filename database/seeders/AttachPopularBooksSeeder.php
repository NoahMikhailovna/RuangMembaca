<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Menempelkan PDF 16 buku populer domain publik ke katalog Ruang Membaca:
 * membuat buku bila belum ada (beserta pengarang dan kategorinya),
 * lalu mengisi pdf_path, cover_path, dan page_count asli dari file PDF.
 * Data buku dibaca dari database/seeders/data/popular_pdfs.json.
 * Buku "madilog" tidak disentuh. Aman dijalankan berulang kali.
 */
class AttachPopularBooksSeeder extends Seeder
{
    public function run(): void
    {
        $manifestPath = database_path('seeders/data/popular_pdfs.json');
        $entries = json_decode(file_get_contents($manifestPath), true);

        $attached = 0;
        $created = 0;
        $skipped = 0;

        foreach ($entries as $entry) {
            $pdfPath = 'books/pdf/'.$entry['pdf_filename'];

            if (! Storage::disk('local')->exists($pdfPath)) {
                $this->command?->warn('File PDF belum ada, dilewati: '.$pdfPath.' (pastikan patch diekstrak lengkap)');

                $skipped++;

                continue;
            }

            $category = Category::updateOrCreate(
                ['slug' => Str::slug($entry['category'])],
                ['name' => $entry['category']]
            );

            $author = Author::updateOrCreate(
                ['slug' => $entry['author_slug']],
                [
                    'name' => $entry['author'],
                    'bio' => $entry['author_bio'] ?? null,
                    'birth_year' => $entry['author_birth_year'] ?? null,
                ]
            );

            $book = Book::where('slug', $entry['slug'])->first()
                ?? Book::where('title', $entry['title'])->first();

            if (! $book) {
                $book = new Book;
                $created++;
            }

            $book->author_id = $author->id;
            $book->title = $entry['title'];
            $book->slug = $entry['slug'];
            $book->synopsis = $entry['synopsis'] ?? null;
            $book->pdf_path = $pdfPath;
            $book->publisher = $entry['publisher'] ?? null;
            $book->published_year = $entry['year'] ?? null;
            $book->page_count = $entry['page_count'];
            $book->language = $entry['language'] ?? 'id';
            $book->status = 'published';
            $book->is_featured = true;

            if (! empty($entry['cover_filename'])) {
                $coverPath = 'covers/'.$entry['cover_filename'];

                if (Storage::disk('public')->exists($coverPath)) {
                    $book->cover_path = $coverPath;
                }
            }

            $book->save();
            $book->categories()->syncWithoutDetaching([$category->id]);

            $attached++;
            $this->command?->info('Terpasang: '.$book->title.' ('.$entry['page_count'].' halaman)');
        }

        $this->command?->info("Selesai. {$attached} buku terpasang ({$created} baru dibuat), {$skipped} dilewati.");
    }
}
