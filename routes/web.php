<?php

use App\Http\Controllers\Admin\ModerationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PersonalNoteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\ReaderController;
use App\Http\Controllers\ReadingProgressController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('landing');
Route::get('/beranda', [HomeController::class, 'index'])->name('home');
Route::get('/katalog', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('/buku/{book:slug}', [CatalogController::class, 'show'])->name('books.show');
Route::get('/buku/{book:slug}/unduh', [ReaderController::class, 'download'])->middleware('auth')->name('books.download');

Route::middleware('guest')->group(function () {
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/auth/google', [AuthController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
    Route::get('/lupa-password', [AuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/lupa-password', [AuthController::class, 'sendResetLink'])->name('password.email');
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/baca/{book:slug}', [ReaderController::class, 'show'])->name('reader.show');
    Route::get('/baca/{book:slug}/pdf', [ReaderController::class, 'streamPdf'])->name('books.pdf');
    Route::post('/buku/{book}/rating', [RatingController::class, 'store'])->name('books.rating');
    Route::post('/buku/{book}/ulasan', [ReviewController::class, 'store'])->name('books.reviews.store');
    Route::delete('/ulasan/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
    Route::post('/buku/{book}/komentar', [CommentController::class, 'store'])->name('books.comments.store');
    Route::post('/komentar/{comment}/balas', [CommentController::class, 'reply'])->name('comments.reply');
    Route::delete('/komentar/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    Route::get('/favorit', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('/buku/{book}/favorit', [FavoriteController::class, 'toggle'])->name('books.favorite');
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/buku/{book}/wishlist', [WishlistController::class, 'toggle'])->name('books.wishlist');

    Route::get('/bookmark', [BookmarkController::class, 'index'])->name('bookmarks.index');
    Route::post('/buku/{book}/bookmark', [BookmarkController::class, 'store'])->name('books.bookmark');
    Route::delete('/bookmark/{bookmark}', [BookmarkController::class, 'destroy'])->name('bookmarks.destroy');

    Route::get('/riwayat', [ReadingProgressController::class, 'history'])->name('history.index');
    Route::post('/buku/{book}/progress', [ReadingProgressController::class, 'update'])->name('books.progress');

    Route::get('/catatan', [PersonalNoteController::class, 'index'])->name('notes.index');
    Route::post('/buku/{book}/catatan', [PersonalNoteController::class, 'store'])->name('books.notes.store');
    Route::delete('/catatan/{note}', [PersonalNoteController::class, 'destroy'])->name('notes.destroy');

    Route::get('/notifikasi', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifikasi/baca-semua', [NotificationController::class, 'markAllRead'])->name('notifications.readAll');
    Route::post('/notifikasi/{id}/baca', [NotificationController::class, 'markRead'])->name('notifications.read');

    Route::get('/profil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profil', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profil/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::delete('/profil', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware('admin')->prefix('moderasi')->group(function () {
        Route::get('/', [ModerationController::class, 'index'])->name('admin.moderation');
        Route::patch('/komentar/{comment}', [ModerationController::class, 'moderateComment'])->name('admin.moderation.comment');
        Route::patch('/ulasan/{review}', [ModerationController::class, 'moderateReview'])->name('admin.moderation.review');
    });
});
