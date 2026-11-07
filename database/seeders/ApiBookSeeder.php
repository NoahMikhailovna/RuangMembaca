<?php

namespace Database\Seeders;

use App\Services\GoogleBooksService;
use Illuminate\Database\Seeder;

/**
 * Mengisi katalog awal dari dataset buku hasil tangkapan API
 * (database/seeders/data/google_books_id.json).
 *
 * Jalankan: php artisan db:seed --class=ApiBookSeeder
 *
 * Aman dijalankan berulang — impor memakai firstOrCreate berdasarkan
 * ISBN (fallback slug) lewat GoogleBooksService, jadi tidak ada duplikat.
 * Cover diunduh ke storage/app/public/covers/ saat pertama kali diimpor;
 * jalankan "php artisan storage:link" agar cover tampil di web.
 */
class ApiBookSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/google_books_id.json');

        if (! file_exists($path)) {
            $this->command?->warn('File dataset tidak ditemukan: '.$path);

            return;
        }

        $books = json_decode((string) file_get_contents($path), true);

        if (! is_array($books)) {
            $this->command?->warn('Dataset tidak valid (bukan JSON array).');

            return;
        }

        $service = app(GoogleBooksService::class);
        $imported = 0;
        $failed = 0;

        foreach ($books as $data) {
            try {
                $service->importNormalized($data);
                $imported++;
            } catch (\Throwable $e) {
                $failed++;
                $this->command?->warn('Gagal impor "'.($data['title'] ?? '?').'": '.$e->getMessage());
            }
        }

        $this->command?->info("ApiBookSeeder selesai: {$imported} buku diproses, {$failed} gagal.");
    }
}
