<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_id', 'title', 'slug', 'synopsis', 'cover_path', 'pdf_path', 'isbn',
        'publisher', 'published_year', 'page_count', 'language', 'view_count',
        'reader_count', 'download_count', 'is_featured', 'status',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'published_year' => 'integer',
        'page_count' => 'integer',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'book_category');
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class);
    }

    public function readingProgress(): HasMany
    {
        return $this->hasMany(ReadingProgress::class);
    }

    public function getAverageRatingAttribute(): float
    {
        return round((float) $this->ratings()->avg('score'), 1);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
