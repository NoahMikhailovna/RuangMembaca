<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReadingProgressController extends Controller
{
    public function history(Request $request): Response
    {
        $progress = $request->user()->readingProgress()->with('book.author')->orderByDesc('last_read_at')->get();

        return Inertia::render('Library/History', [
            'currentlyReading' => $progress->where('is_finished', false),
            'finished' => $progress->where('is_finished', true),
            'histories' => $request->user()->readingHistories()->with('book.author')->latest('read_at')->limit(50)->get(),
        ]);
    }

    public function update(Request $request, Book $book): JsonResponse|RedirectResponse
    {
        $data = $request->validate([
            'current_page' => ['required', 'integer', 'min:1'],
            'total_pages' => ['nullable', 'integer', 'min:1'],
        ]);

        $total = $data['total_pages'] ?? $book->page_count;
        $percent = $total > 0 ? round(min(100, $data['current_page'] / $total * 100), 2) : 0;

        $progress = $request->user()->readingProgress()->updateOrCreate(
            ['book_id' => $book->id],
            [
                'current_page' => $data['current_page'],
                'total_pages' => $total,
                'progress_percent' => $percent,
                'is_finished' => $percent >= 100,
                'last_read_at' => now(),
            ]
        );

        $request->user()->readingHistories()->create([
            'book_id' => $book->id,
            'page' => $data['current_page'],
            'read_at' => now(),
        ]);

        if ($request->expectsJson()) {
            return response()->json(['progress' => $progress]);
        }

        return back();
    }
}
