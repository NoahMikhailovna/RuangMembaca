<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Comment;
use App\Models\ReadingHistory;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ModerationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Moderation', [
            'comments' => Comment::with(['user', 'book'])->latest()->paginate(20, ['*'], 'comments_page'),
            'reviews' => Review::with(['user', 'book'])->latest()->paginate(20, ['*'], 'reviews_page'),
            'stats' => [
                'books' => Book::count(),
                'users' => User::count(),
                'readers' => (int) Book::sum('reader_count'),
                'readingActivity' => ReadingHistory::selectRaw('DATE(read_at) as date, COUNT(*) as total')
                    ->groupBy('date')->orderBy('date')->limit(30)->get(),
                'popularBooks' => Book::orderByDesc('reader_count')->limit(5)->get(['id', 'title', 'reader_count']),
            ],
        ]);
    }

    public function moderateComment(Request $request, Comment $comment): RedirectResponse
    {
        $data = $request->validate(['status' => ['required', 'in:approved,rejected,pending']]);
        $comment->update($data);

        return back()->with('success', 'Status komentar diperbarui.');
    }

    public function moderateReview(Request $request, Review $review): RedirectResponse
    {
        $data = $request->validate(['status' => ['required', 'in:approved,rejected,pending']]);
        $review->update($data);

        return back()->with('success', 'Status ulasan diperbarui.');
    }
}
