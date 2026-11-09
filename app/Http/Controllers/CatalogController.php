<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Book::published()->with(['author', 'categories'])->withAvg('ratings', 'score');

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('author', fn ($a) => $a->where('name', 'like', "%{$search}%"));
            });
        }

        if ($category = $request->string('category')->toString()) {
            $query->whereHas('categories', fn ($q) => $q->where('categories.slug', $category));
        }

        match ($request->string('sort', 'latest')->toString()) {
            'popular' => $query->orderByDesc('reader_count'),
            'rating' => $query->orderByDesc('ratings_avg_score'),
            default => $query->latest(),
        };

        return Inertia::render('Catalog/Index', [
            'books' => $query->paginate(12)->withQueryString(),
            'categories' => Category::withCount('books')->get(),
            'filters' => $request->only(['search', 'category', 'sort']),
            'totalBooks' => Book::published()->count(),
        ]);
    }

    public function show(Book $book): Response
    {
        abort_unless($book->status === 'published' || (auth()->check() && auth()->user()->isAdmin()), 404);
        $book->increment('view_count');
        $book->load(['author', 'categories', 'reviews.user', 'comments.user', 'comments.replies.user'])
            ->loadAvg('ratings', 'score')
            ->loadCount('ratings');

        $user = auth()->user();

        return Inertia::render('Books/Show', [
            'book' => $book,
            'userState' => $user ? [
                'isFavorite' => $user->favorites()->where('book_id', $book->id)->exists(),
                'isWishlist' => $user->wishlists()->where('book_id', $book->id)->exists(),
                'myRating' => optional($user->ratings()->where('book_id', $book->id)->first())->score,
                'myReview' => $user->reviews()->where('book_id', $book->id)->first(['id', 'body']),
                'progress' => $user->readingProgress()->where('book_id', $book->id)->first(),
            ] : null,
            'related' => Book::published()->with(['author', 'categories'])
                ->where('id', '!=', $book->id)
                ->whereHas('categories', fn ($q) => $q->whereIn('categories.id', $book->categories->pluck('id')))
                ->limit(4)->get(),
        ]);
    }
}
