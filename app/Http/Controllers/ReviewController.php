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
        $review = $request->user()->reviews()->updateOrCreate(
            ['book_id' => $book->id],
            ['body' => $request->string('body')->toString()]
        );

        return back()->with('success', $review->wasRecentlyCreated ? 'Ulasan terkirim.' : 'Ulasan diperbarui.');
    }

    public function destroy(Review $review): RedirectResponse
    {
        $this->authorize('delete', $review);
        $review->delete();

        return back()->with('success', 'Ulasan dihapus.');
    }
}
