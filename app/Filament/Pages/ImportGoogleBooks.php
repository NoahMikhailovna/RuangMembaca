<?php

namespace App\Filament\Pages;

use App\Services\GoogleBooksService;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Schema;

class ImportGoogleBooks extends Page
{
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-cloud-arrow-down';

    protected static string | \UnitEnum | null $navigationGroup = 'Katalog';

    protected static ?string $navigationLabel = 'Impor Google Books';

    protected static ?string $title = 'Impor Buku dari Google Books';

    protected static ?int $navigationSort = 90;

    protected string $view = 'filament.pages.import-google-books';

    public ?array $data = [];

    /**
     * Hasil pencarian terakhir (bentuk datar dari GoogleBooksService).
     *
     * @var array<int, array>
     */
    public array $results = [];

    public function mount(): void
    {
        $this->form->fill();
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Forms\Components\TextInput::make('keyword')
                    ->label('Kata Kunci')
                    ->placeholder('mis. novel indonesia, Laskar Pelangi, sejarah indonesia')
                    ->required()
                    ->maxLength(100),
                Forms\Components\TextInput::make('limit')
                    ->label('Jumlah Hasil')
                    ->numeric()
                    ->default(20)
                    ->minValue(1)
                    ->maxValue(40),
            ])
            ->statePath('data');
    }

    public function searchBooks(GoogleBooksService $service): void
    {
        $state = $this->form->getState();

        $this->results = $service->search(
            (string) ($state['keyword'] ?? ''),
            (int) ($state['limit'] ?? 20)
        );

        if ($this->results === []) {
            Notification::make()
                ->title('Tidak ada hasil')
                ->body('Tidak ditemukan buku valid untuk kata kunci itu, atau Google Books API tidak dapat dijangkau.')
                ->warning()
                ->send();

            return;
        }

        Notification::make()
            ->title(count($this->results).' buku ditemukan')
            ->body('Klik tombol "Impor" pada buku yang ingin ditambahkan ke katalog.')
            ->success()
            ->send();
    }

    public function importBook(int $index, GoogleBooksService $service): void
    {
        $item = $this->results[$index] ?? null;

        if ($item === null) {
            return;
        }

        try {
            $book = $service->importFromApiItem($item);
            $this->results[$index]['imported'] = true;

            Notification::make()
                ->title('Buku diimpor')
                ->body('"'.$book->title.'" sudah masuk katalog Ruang Membaca.')
                ->success()
                ->send();
        } catch (\Throwable $e) {
            Notification::make()
                ->title('Gagal mengimpor buku')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }
}
