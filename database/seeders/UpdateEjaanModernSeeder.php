<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

/**
 * Memperbarui metadata 30 buku yang isi PDF-nya sudah dibangun ulang
 * dalam EDISI EJAAN MODERN (ejaan Van Ophuijsen -> ejaan Indonesia
 * sekarang). Isi dan cerita buku TIDAK berubah, hanya penulisannya.
 *
 * Seeder ini hanya menyelaraskan kolom title, synopsis, dan
 * page_count dengan PDF edisi modern yang ikut dalam patch ini.
 * (Tabel books memang tidak memiliki kolom word_count.)
 * Slug, nama file PDF, cover, dan pengarang tidak disentuh.
 * Data dibaca dari database/seeders/data/ejaan_modern.json.
 * Aman dijalankan berulang kali.
 */
class UpdateEjaanModernSeeder extends Seeder
{
    public function run(): void
    {
        $manifestPath = database_path('seeders/data/ejaan_modern.json');
        $entries = json_decode(file_get_contents($manifestPath), true);

        $updated = 0;
        $skipped = 0;

        foreach ($entries as $entry) {
            $book = Book::where('slug', $entry['slug'])->first();

            if ($book === null) {
                $this->command?->warn('Buku tidak ditemukan, dilewati: '.$entry['slug']);

                $skipped++;

                continue;
            }

            $book->update([
                'title' => $entry['title'],
                'synopsis' => $entry['synopsis'],
                'page_count' => $entry['page_count'],
            ]);

            $updated++;
        }

        $this->command?->info("Ejaan modern: {$updated} buku diperbarui, {$skipped} dilewati.");
    }
}
