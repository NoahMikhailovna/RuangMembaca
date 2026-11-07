<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

/**
 * Mengisi cover_path untuk 4 buku klasik yang sebelumnya hanya
 * mendapat PDF dari AttachClassicPdfsSeeder (cover masih kosong
 * sehingga katalog menampilkan placeholder).
 *
 * File cover fisiknya ikut dalam patch ini dan harus berada di
 * storage/app/public/covers/ (disk "public", folder yang sama
 * dengan upload cover pada BookResource Filament), dengan nama
 * classic-<slug>.jpg. Frontend menampilkannya lewat /storage/.
 * Aman dijalankan berulang kali.
 */
class UpdateClassicCoversSeeder extends Seeder
{
    /**
     * Slug buku klasik => nama file cover di folder covers/.
     */
    private array $covers = [
        'max-havelaar' => 'classic-max-havelaar.jpg',
        'habis-gelap-terbitlah-terang' => 'classic-habis-gelap-terbitlah-terang.jpg',
        'azab-dan-sengsara' => 'classic-azab-dan-sengsara.jpg',
        'sengsara-membawa-nikmat' => 'classic-sengsara-membawa-nikmat.jpg',
    ];

    public function run(): void
    {
        $updated = 0;
        $skipped = 0;

        foreach ($this->covers as $slug => $filename) {
            $coverPath = 'covers/'.$filename;

            if (! Storage::disk('public')->exists($coverPath)) {
                $this->command?->warn('File cover belum ada, dilewati: '.$coverPath.' (pastikan patch diekstrak lengkap)');

                $skipped++;

                continue;
            }

            $book = Book::where('slug', $slug)->first();

            if (! $book) {
                $this->command?->warn('Buku tidak ditemukan, dilewati: '.$slug.' (jalankan AttachClassicPdfsSeeder dulu bila perlu)');

                $skipped++;

                continue;
            }

            $book->cover_path = $coverPath;
            $book->save();

            $updated++;

            $this->command?->info('Cover terpasang: '.$book->title.' -> '.$coverPath);
        }

        $this->command?->info("Selesai. {$updated} cover diperbarui, {$skipped} dilewati.");
    }
}
