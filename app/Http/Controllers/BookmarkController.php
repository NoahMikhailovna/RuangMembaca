<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Bookmark;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookmarkController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Library/Bookmarks', [
            'bookmarks' => $request->user()->bookmarks()->with('book.author')->orderByDesc('updated_at')->get(),
        ]);
    }

    public function store(Request $request, Book $book): RedirectResponse
    {
        $data = $request->validate([
            'page' => ['required', 'integer', 'min:1'],
            'label' => ['nullable', 'string', 'max:255'],
        ]);

        $request->user()->bookmarks()->updateOrCreate(
            ['book_id' => $book->id, 'page' => $data['page']],
            ['label' => $data['label'] ?? null]
        );

        return back()->with('success', 'Bookmark halaman tersimpan.');
    }

    public function destroy(Request $request, Bookmark $bookmark): RedirectResponse
    {
        abort_unless($bookmark->user_id === $request->user()->id, 403);
        $bookmark->delete();

        return back()->with('success', 'Bookmark dihapus.');
    }
}
