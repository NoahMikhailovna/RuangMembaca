<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')->constrained('authors')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('synopsis')->nullable();
            $table->string('cover_path')->nullable();
            $table->string('pdf_path')->nullable();
            $table->string('isbn', 20)->nullable();
            $table->string('publisher')->nullable();
            $table->smallInteger('published_year')->nullable();
            $table->unsignedInteger('page_count')->default(0);
            $table->string('language', 10)->default('id');
            $table->unsignedBigInteger('view_count')->default(0);
            $table->unsignedBigInteger('reader_count')->default(0);
            $table->unsignedBigInteger('download_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['published', 'draft'])->default('published');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
