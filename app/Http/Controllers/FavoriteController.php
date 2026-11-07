<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Library/Favorites', [
            'books' => $request->user()->favorites()->with('book.author', 'book.categories')->latest()->get()->pluck('book'),
        ]);
    }

    public function toggle(Request $request, Book $book): RedirectResponse
    {
        $favorite = $request->user()->favorites()->where('book_id', $book->id)->first();
        if ($favorite) {
            $favorite->delete();
            return back()->with('success', 'Dihapus dari favorit.');
        }
        $request->user()->favorites()->create(['book_id' => $book->id]);

        return back()->with('success', 'Ditambahkan ke favorit.');
    }
}
