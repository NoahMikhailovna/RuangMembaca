<?php

namespace App\Filament\Widgets;

use App\Models\ReadingHistory;
use Filament\Widgets\ChartWidget;

class ReadingActivityChart extends ChartWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    protected ?string $heading = 'Aktivitas Membaca 14 Hari Terakhir';

    protected function getData(): array
    {
        $days = collect(range(13, 0))->map(fn (int $i) => now()->subDays($i)->format('Y-m-d'));
        $counts = ReadingHistory::selectRaw('DATE(read_at) as d, COUNT(*) as total')
            ->where('read_at', '>=', now()->subDays(14))
            ->groupBy('d')->pluck('total', 'd');

        return [
            'datasets' => [[
                'label' => 'Sesi membaca',
                'data' => $days->map(fn (string $d) => (int) ($counts[$d] ?? 0))->all(),
                'borderColor' => '#DC2626',
                'backgroundColor' => 'rgba(220, 38, 38, 0.15)',
                'fill' => true,
            ]],
            'labels' => $days->map(fn (string $d) => substr($d, 5))->all(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
