<?php

namespace App\Console\Commands;

use App\Models\Category;
use Illuminate\Console\Command;

class PruneEmptyCategories extends Command
{
    protected $signature = 'categories:prune-empty {--force : Jalankan tanpa konfirmasi}';

    protected $description = 'Hapus semua kategori yang tidak memiliki buku sama sekali';

    public function handle(): int
    {
        $empty = Category::doesntHave('books')->orderBy('name')->get();

        if ($empty->isEmpty()) {
            $this->info('Tidak ada kategori kosong. Semua kategori punya buku.');

            return self::SUCCESS;
        }

        $this->warn("Ditemukan {$empty->count()} kategori kosong:");
        $this->line($empty->pluck('name')->implode(', '));

        if (! $this->option('force') && ! $this->confirm('Hapus semua kategori kosong di atas?')) {
            $this->info('Dibatalkan.');

            return self::SUCCESS;
        }

        Category::whereIn('id', $empty->pluck('id'))->delete();

        $this->info('Selesai. Kategori yang tersisa: '.Category::count().'.');

        return self::SUCCESS;
    }
}
