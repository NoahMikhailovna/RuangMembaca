<?php

namespace App\Console\Commands;

use App\Models\Author;
use Illuminate\Console\Command;

class PruneEmptyAuthors extends Command
{
    protected $signature = 'authors:prune-empty {--force : Jalankan tanpa konfirmasi}';

    protected $description = 'Hapus semua penulis yang tidak memiliki buku sama sekali';

    public function handle(): int
    {
        $empty = Author::doesntHave('books')->orderBy('name')->get();

        if ($empty->isEmpty()) {
            $this->info('Tidak ada penulis kosong. Semua penulis punya buku.');

            return self::SUCCESS;
        }

        $this->warn("Ditemukan {$empty->count()} penulis tanpa buku:");
        $this->line($empty->pluck('name')->implode(', '));

        if (! $this->option('force') && ! $this->confirm('Hapus semua penulis kosong di atas?')) {
            $this->info('Dibatalkan.');

            return self::SUCCESS;
        }

        Author::whereIn('id', $empty->pluck('id'))->delete();

        $this->info('Selesai. Penulis yang tersisa: '.Author::count().'.');

        return self::SUCCESS;
    }
}
