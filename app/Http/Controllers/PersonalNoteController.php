<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePersonalNoteRequest;
use App\Models\Book;
use App\Models\PersonalNote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PersonalNoteController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Library/Notes', [
            'notes' => $request->user()->personalNotes()->with('book.author')->latest()->get(),
        ]);
    }

    public function store(StorePersonalNoteRequest $request, Book $book): RedirectResponse
    {
        $request->user()->personalNotes()->updateOrCreate(
            ['book_id' => $book->id, 'page' => $request->input('page')],
            [
                'title' => $request->input('title'),
                'body' => $request->string('body')->toString(),
            ]
        );

        return back()->with('success', 'Catatan tersimpan.');
    }

    public function destroy(Request $request, PersonalNote $note): RedirectResponse
    {
        abort_unless($note->user_id === $request->user()->id, 403);
        $note->delete();

        return back()->with('success', 'Catatan dihapus.');
    }
}
