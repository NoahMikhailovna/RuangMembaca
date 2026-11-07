<?php

namespace App\Filament\Widgets;

use App\Models\Book;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class PopularBooksWidget extends BaseWidget
{
    protected static ?string $heading = 'Buku Terpopuler';

    public function table(Table $table): Table
    {
        return $table
            ->query(Book::query()->orderByDesc('reader_count')->limit(5))
            ->columns([
                Tables\Columns\TextColumn::make('title')->label('Judul'),
                Tables\Columns\TextColumn::make('author.name')->label('Penulis'),
                Tables\Columns\TextColumn::make('reader_count')->label('Pembaca')->numeric(),
                Tables\Columns\TextColumn::make('download_count')->label('Unduhan')->numeric(),
            ])
            ->paginated(false);
    }
}
