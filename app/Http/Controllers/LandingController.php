<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Landing', [
            'featuredBooks' => Book::published()->with(['author', 'categories'])->withAvg('ratings', 'score')
                ->orderByDesc('reader_count')->limit(6)->get(),
            'categories' => Category::withCount('books')->get(),
            'stats' => [
                'books' => Book::published()->count(),
                'authors' => Author::count(),
                'categories' => Category::count(),
                'users' => User::count(),
                'readers' => (int) Book::sum('reader_count'),
            ],
        ]);
    }
}
