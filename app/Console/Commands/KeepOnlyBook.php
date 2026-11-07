<?php

namespace App\Console\Commands;

use App\Models\Book;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class KeepOnlyBook extends Command
{
    protected $signature = 'books:keep-only {slug : Slug buku yang dipertahankan} {--force : Jalankan tanpa konfirmasi}';

    protected $description = 'Hapus semua buku kecuali satu slug, beserta data terkaitnya (rating, ulasan, komentar, favorit, wishlist, bookmark, progres, riwayat, catatan)';

    public function handle(): int
    {
        $slug = $this->argument('slug');

        $keep = Book::where('slug', $slug)->first();

        if (! $keep) {
            $this->error("Buku dengan slug '{$slug}' tidak ditemukan. Tidak ada yang dihapus.");

            return self::FAILURE;
        }

        $ids = Book::where('id', '!=', $keep->id)->pluck('id');

        if ($ids->isEmpty()) {
            $this->info("Hanya ada satu buku ({$keep->title}), tidak ada yang perlu dihapus.");

            return self::SUCCESS;
        }

        $this->warn("Akan menghapus {$ids->count()} buku beserta seluruh data terkaitnya.");
        $this->info("Yang dipertahankan: {$keep->title} (slug: {$keep->slug})");

        if (! $this->option('force') && ! $this->confirm('Lanjutkan penghapusan?')) {
            $this->info('Dibatalkan.');

            return self::SUCCESS;
        }

        DB::transaction(function () use ($ids) {
            $commentIds = DB::table('comments')->whereIn('book_id', $ids)->pluck('id');

            if ($commentIds->isNotEmpty()) {
                DB::table('comment_replies')->whereIn('comment_id', $commentIds)->delete();
            }

            foreach (['book_category', 'ratings', 'reviews', 'comments', 'bookmarks', 'favorites', 'wishlists', 'reading_progress', 'reading_histories', 'personal_notes'] as $table) {
                DB::table($table)->whereIn('book_id', $ids)->delete();
            }

            Book::whereIn('id', $ids)->delete();
        });

        $this->info('Selesai. Buku yang tersisa sekarang: '.Book::count().'.');

        return self::SUCCESS;
    }
}
