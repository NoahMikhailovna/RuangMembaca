<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRatingRequest;
use App\Models\Book;
use Illuminate\Http\RedirectResponse;

class RatingController extends Controller
{
    public function store(StoreRatingRequest $request, Book $book): RedirectResponse
    {
        $request->user()->ratings()->updateOrCreate(
            ['book_id' => $book->id],
            ['score' => $request->integer('score')]
        );

        return back()->with('success', 'Rating tersimpan.');
    }
}
