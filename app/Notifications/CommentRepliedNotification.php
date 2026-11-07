<?php

namespace App\Notifications;

use App\Models\Comment;
use App\Models\CommentReply;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommentRepliedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Comment $comment,
        public CommentReply $reply,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Komentar Anda dibalas di Ruang Membaca')
            ->greeting('Halo '.$notifiable->name.',')
            ->line($this->reply->user->name.' membalas komentar Anda:')
            ->line($this->reply->body)
            ->action('Lihat buku', route('books.show', $this->comment->book));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'comment_replied',
            'comment_id' => $this->comment->id,
            'reply_id' => $this->reply->id,
            'book_id' => $this->comment->book_id,
            'actor_name' => $this->reply->user->name,
            'message' => $this->reply->user->name.' membalas komentar Anda.',
        ];
    }
}
