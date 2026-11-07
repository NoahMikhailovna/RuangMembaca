<?php

namespace App\Filament\Widgets;

use App\Models\Book;
use App\Models\Comment;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Buku', Book::count())->icon('heroicon-o-book-open')->color('danger'),
            Stat::make('Total Pengguna', User::count())->icon('heroicon-o-users')->color('danger'),
            Stat::make('Total Pembaca', (int) Book::sum('reader_count'))->icon('heroicon-o-eye')->color('gray'),
            Stat::make('Komentar Menunggu Moderasi', Comment::where('status', 'pending')->count())->icon('heroicon-o-chat-bubble-left-right')->color('warning'),
        ];
    }
}
