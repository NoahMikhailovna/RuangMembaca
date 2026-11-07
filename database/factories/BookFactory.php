<?php

namespace Database\Factories;

use App\Models\Author;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BookFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(3);

        return [
            'author_id' => Author::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(1, 99999),
            'synopsis' => fake()->paragraph(),
            'page_count' => fake()->numberBetween(50, 500),
            'language' => 'id',
            'status' => 'published',
        ];
    }
}
