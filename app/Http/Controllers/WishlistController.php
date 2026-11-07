<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Library/Wishlist', [
            'books' => $request->user()->wishlists()->with('book.author', 'book.categories')->latest()->get()->pluck('book'),
        ]);
    }

    public function toggle(Request $request, Book $book): RedirectResponse
    {
        $item = $request->user()->wishlists()->where('book_id', $book->id)->first();
        if ($item) {
            $item->delete();
            return back()->with('success', 'Dihapus dari wishlist.');
        }
        $request->user()->wishlists()->create(['book_id' => $book->id]);

        return back()->with('success', 'Ditambahkan ke wishlist.');
    }
}
