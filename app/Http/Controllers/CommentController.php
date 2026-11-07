<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Models\Book;
use App\Models\Comment;
use App\Notifications\CommentRepliedNotification;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    public function store(StoreCommentRequest $request, Book $book): RedirectResponse
    {
        $request->user()->comments()->create([
            'book_id' => $book->id,
            'body' => $request->string('body')->toString(),
        ]);

        return back()->with('success', 'Komentar terkirim.');
    }

    public function reply(StoreCommentRequest $request, Comment $comment): RedirectResponse
    {
        $reply = $comment->replies()->create([
            'user_id' => $request->user()->id,
            'body' => $request->string('body')->toString(),
        ]);

        if ($comment->user_id !== $request->user()->id) {
            $comment->user->notify(new CommentRepliedNotification($comment, $reply));
        }

        return back()->with('success', 'Balasan terkirim.');
    }

    public function destroy(Comment $comment): RedirectResponse
    {
        $this->authorize('delete', $comment);
        $comment->delete();

        return back()->with('success', 'Komentar dihapus.');
    }
}
