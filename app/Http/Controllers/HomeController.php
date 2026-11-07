<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $recommendations = Book::published()->with(['author', 'categories'])->withAvg('ratings', 'score')
            ->when($user, function ($query) use ($user) {
                $categoryIds = $user->readingHistories()->with('book.categories')
                    ->latest()->limit(20)->get()
                    ->flatMap(fn ($history) => $history->book->categories->pluck('id'))
                    ->unique();
                if ($categoryIds->isNotEmpty()) {
                    $query->whereHas('categories', fn ($q) => $q->whereIn('categories.id', $categoryIds));
                }
            })
            ->latest()->limit(8)->get();

        return Inertia::render('Home', [
            'latestBooks' => Book::published()->with(['author', 'categories'])->withAvg('ratings', 'score')->latest()->limit(8)->get(),
            'popularBooks' => Book::published()->with(['author', 'categories'])->withAvg('ratings', 'score')->orderByDesc('reader_count')->limit(8)->get(),
            'featuredBooks' => Book::published()->with(['author', 'categories'])->withAvg('ratings', 'score')->where('is_featured', true)->limit(4)->get(),
            'recommendations' => $recommendations,
            'categories' => Category::withCount('books')->get(),
            'stats' => [
                'books' => Book::published()->count(),
                'authors' => Author::count(),
                'users' => User::count(),
                'readers' => (int) Book::sum('reader_count'),
            ],
        ]);
    }
}
