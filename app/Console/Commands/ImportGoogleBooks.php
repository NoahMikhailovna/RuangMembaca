<?php

namespace App\Console\Commands;

use App\Models\Book;
use App\Services\GoogleBooksService;
use Illuminate\Console\Command;

class ImportGoogleBooks extends Command
{
    protected $signature = 'books:import-google {query : Kata kunci pencarian buku} {--limit=20 : Jumlah maksimum hasil yang diambil (maks 40)}';

    protected $description = 'Impor buku dari Google Books API ke katalog Ruang Membaca';

    public function handle(GoogleBooksService $service): int
    {
        $query = (string) $this->argument('query');
        $limit = max(1, min((int) $this->option('limit'), 40));

        $this->info("Mencari buku \"{$query}\" di Google Books API...");

        $items = $service->search($query, $limit);

        if ($items === []) {
            $this->warn('Tidak ada hasil valid dari API (atau API tidak dapat dijangkau). Tidak ada buku yang diimpor.');

            return self::SUCCESS;
        }

        $imported = 0;
        $skipped = 0;
        $failed = 0;

        foreach ($items as $item) {
            try {
                $exists = false;
                if (! empty($item['isbn'])) {
                    $exists = Book::where('isbn', $item['isbn'])->exists();
                }

                $book = $service->importFromApiItem($item);

                if ($exists) {
                    $skipped++;
                    $this->line("  [skip] {$book->title} (sudah ada)");
                } else {
                    $imported++;
                    $this->line("  [ok]   {$book->title}");
                }
            } catch (\Throwable $e) {
                $failed++;
                $this->line('  [gagal] '.($item['title'] ?? '?').' — '.$e->getMessage());
            }
        }

        $this->newLine();
        $this->info("Selesai. Berhasil impor: {$imported}, dilewati (sudah ada): {$skipped}, gagal: {$failed}.");

        return self::SUCCESS;
    }
}
