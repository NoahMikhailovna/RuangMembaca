<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookResource\Pages;
use App\Models\Book;
use Filament\Forms;
use Filament\Actions;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class BookResource extends Resource
{
    protected static ?string $model = Book::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-book-open';

    protected static string | \UnitEnum | null $navigationGroup = 'Katalog';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
                Forms\Components\Select::make('author_id')->relationship('author', 'name')->searchable()->preload()->required(),
                Forms\Components\TextInput::make('title')->required()->maxLength(255)->live(onBlur: true)
                    ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', \Illuminate\Support\Str::slug((string) $state))),
                Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true),
                Forms\Components\Textarea::make('synopsis')->rows(4)->columnSpanFull(),
                Forms\Components\FileUpload::make('cover_path')->label('Cover')->image()->disk('public')->directory('covers'),
                Forms\Components\FileUpload::make('pdf_path')->label('File PDF')->acceptedFileTypes(['application/pdf'])->disk('local')->directory('books/pdf'),
                Forms\Components\TextInput::make('isbn')->maxLength(20),
                Forms\Components\TextInput::make('publisher'),
                Forms\Components\TextInput::make('published_year')->numeric(),
                Forms\Components\TextInput::make('page_count')->numeric()->default(0),
                Forms\Components\Select::make('categories')->relationship('categories', 'name')->multiple()->preload(),
                Forms\Components\Toggle::make('is_featured')->label('Pilihan'),
                Forms\Components\Select::make('status')->options(['published' => 'Published', 'draft' => 'Draft'])->default('published')->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->searchable()->sortable(), Tables\Columns\TextColumn::make('author.name')->searchable(), Tables\Columns\TextColumn::make('reader_count')->numeric()->sortable(), Tables\Columns\TextColumn::make('download_count')->numeric(), Tables\Columns\BadgeColumn::make('status'),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->toolbarActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBooks::route('/'),
            'create' => Pages\CreateBook::route('/create'),
            'edit' => Pages\EditBook::route('/{record}/edit'),
        ];
    }
}
