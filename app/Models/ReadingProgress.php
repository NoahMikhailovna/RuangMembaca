<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReadingProgress extends Model
{
    use HasFactory;

    protected $table = 'reading_progress';
    protected $fillable = ['user_id', 'book_id', 'current_page', 'total_pages', 'progress_percent', 'is_finished', 'last_read_at'];

    protected $casts = ['is_finished' => 'boolean', 'last_read_at' => 'datetime', 'progress_percent' => 'decimal:2'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

}
