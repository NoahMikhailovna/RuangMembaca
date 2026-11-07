<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\ReadingProgress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReaderController extends Controller
{
    public function show(Request $request, Book $book): Response
    {
        $progress = ReadingProgress::firstOrCreate(
            ['user_id' => $request->user()->id, 'book_id' => $book->id],
            ['current_page' => 1, 'total_pages' => $book->page_count]
        );

        $book->increment('reader_count');
        $request->user()->readingHistories()->create([
            'book_id' => $book->id,
            'page' => $progress->current_page,
            'read_at' => now(),
        ]);

        return Inertia::render('Reader/Show', [
            'book' => $book->load('author'),
            'progress' => $progress,
            'bookmarks' => $request->user()->bookmarks()->where('book_id', $book->id)->orderBy('page')->get(),
            'pdfUrl' => $book->pdf_path ? route('books.pdf', $book) : null,
        ]);
    }

    public function streamPdf(Book $book): StreamedResponse
    {
        abort_unless($book->pdf_path && Storage::disk('local')->exists($book->pdf_path), 404);

        return Storage::disk('local')->response($book->pdf_path, $book->slug.'.pdf', [
            'Content-Type' => 'application/pdf',
        ]);
    }

    public function download(Book $book): StreamedResponse|RedirectResponse
    {
        if (! $book->pdf_path || ! Storage::disk('local')->exists($book->pdf_path)) {
            return back()->with('error', 'File PDF belum tersedia untuk buku ini. Admin dapat mengunggahnya melalui Filament.');
        }

        $book->increment('download_count');

        return Storage::disk('local')->download($book->pdf_path, $book->slug.'.pdf');
    }
}
