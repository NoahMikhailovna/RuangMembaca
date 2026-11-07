<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Menempelkan file PDF buku klasik domain publik ke katalog.
 *
 * File PDF fisiknya ikut dalam patch ini dan harus berada di
 * storage/app/private/books/pdf/ (disk "local", folder yang sama
 * dengan upload PDF pada BookResource Filament). Seeder ini
 * membaca manifest database/seeders/data/classic_pdfs.json,
 * membuat buku bila belum ada (fallback cari berdasarkan judul),
 * lalu mengisi pdf_path dan page_count sesuai file aslinya.
 * Aman dijalankan berulang kali.
 */
class AttachClassicPdfsSeeder extends Seeder
{
    public function run(): void
    {
        $manifestPath = database_path('seeders/data/classic_pdfs.json');

        if (! file_exists($manifestPath)) {
            $this->command?->error('Manifest classic_pdfs.json tidak ditemukan: '.$manifestPath);

            return;
        }

        $entries = json_decode((string) file_get_contents($manifestPath), true) ?: [];

        $category = Category::updateOrCreate(
            ['slug' => Str::slug('Sastra Klasik')],
            ['name' => 'Sastra Klasik', 'description' => 'Koleksi buku kategori Sastra Klasik.']
        );

        foreach ($entries as $entry) {
            $pdfPath = 'books/pdf/'.$entry['pdf_filename'];

            if (! Storage::disk('local')->exists($pdfPath)) {
                $this->command?->warn('File PDF belum ada, dilewati: '.$pdfPath.' (pastikan patch diekstrak lengkap)');

                continue;
            }

            $author = Author::updateOrCreate(
                ['slug' => $entry['author_slug'] ?? Str::slug($entry['author'])],
                [
                    'name' => $entry['author'],
                    'bio' => $entry['author_bio'] ?? null,
                    'birth_year' => $entry['author_birth_year'] ?? null,
                ]
            );

            $book = Book::where('slug', $entry['slug'])
                ->orWhere('title', $entry['title'])
                ->first() ?? new Book;

            $book->fill([
                'author_id' => $author->id,
                'title' => $entry['title'],
                'slug' => $entry['slug'],
                'synopsis' => $entry['synopsis'] ?? null,
                'pdf_path' => $pdfPath,
                'publisher' => $entry['publisher'] ?? null,
                'published_year' => $entry['year'] ?? null,
                'page_count' => $entry['page_count'] ?? 0,
                'language' => $entry['language'] ?? 'id',
                'status' => 'published',
                'is_featured' => true,
            ]);
            $book->save();

            $book->categories()->syncWithoutDetaching([$category->id]);

            $this->command?->info('PDF terpasang: '.$entry['title'].' -> '.$pdfPath.' ('.($entry['page_count'] ?? 0).' halaman)');
        }
    }
}
