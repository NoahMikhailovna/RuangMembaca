<x-filament-panels::page>
    <div class="space-y-6">
        <form wire:submit="searchBooks" class="space-y-4">
            {{ $this->form }}

            <x-filament::button type="submit" wire:loading.attr="disabled" wire:target="searchBooks">
                <span wire:loading.remove wire:target="searchBooks">Cari Buku</span>
                <span wire:loading wire:target="searchBooks">Mencari...</span>
            </x-filament::button>
        </form>

        @if ($results !== [])
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                @foreach ($results as $index => $book)
                    <div class="flex gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-950/5 dark:bg-white/5 dark:ring-white/10">
                        <img src="{{ $book['cover_url'] }}" alt="{{ $book['title'] }}"
                             class="h-36 w-24 shrink-0 rounded-md object-cover ring-1 ring-gray-950/10"
                             loading="lazy">
                        <div class="min-w-0 flex-1 space-y-1">
                            <p class="font-semibold leading-snug text-gray-950 dark:text-white">{{ $book['title'] }}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">{{ implode(', ', $book['authors']) }}</p>
                            <p class="text-xs text-gray-400">
                                {{ $book['published_year'] ?? '—' }}
                                @if (! empty($book['publisher']))
                                    &middot; {{ $book['publisher'] }}
                                @endif
                                @if (! empty($book['isbn']))
                                    &middot; ISBN {{ $book['isbn'] }}
                                @endif
                            </p>
                            @if (! empty($book['categories']))
                                <p class="text-xs text-gray-400">{{ implode(', ', $book['categories']) }}</p>
                            @endif

                            <div class="pt-2">
                                @if (! empty($book['imported']))
                                    <span class="inline-flex items-center rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-700 ring-1 ring-success-600/20 dark:bg-success-400/10 dark:text-success-400">
                                        Sudah diimpor
                                    </span>
                                @else
                                    <x-filament::button size="sm" wire:click="importBook({{ $index }})"
                                                        wire:loading.attr="disabled" wire:target="importBook({{ $index }})">
                                        Impor
                                    </x-filament::button>
                                @endif
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</x-filament-panels::page>
