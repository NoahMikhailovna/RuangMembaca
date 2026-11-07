<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\Book;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request, Book $book): RedirectResponse
    {
        $request->user()->reviews()->create([
            'book_id' => $book->id,
            'body' => $request->string('body')->toString(),
        ]);

        return back()->with('success', 'Ulasan terkirim.');
    }

    public function destroy(Review $review): RedirectResponse
    {
        $this->authorize('delete', $review);
        $review->delete();

        return back()->with('success', 'Ulasan dihapus.');
    }
}
