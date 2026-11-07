<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\HasMany;

class Author extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'slug', 'bio', 'photo', 'birth_place', 'birth_year'];

    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }

}
