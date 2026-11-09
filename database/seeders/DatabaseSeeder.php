<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@ruangmembaca.id'],
            [
                'name' => 'Admin Ruang Membaca',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'demo@ruangmembaca.id'],
            [
                'name' => 'Pembaca Demo',
                'password' => Hash::make('password'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        $categories = collect(['Sastra Klasik', 'Fiksi', 'Nonfiksi', 'Sejarah', 'Teknologi', 'Pendidikan'])
            ->mapWithKeys(function (string $name) {
                $category = Category::updateOrCreate(
                    ['slug' => Str::slug($name)],
                    ['name' => $name, 'description' => 'Koleksi buku kategori '.$name.'.']
                );

                return [$name => $category];
            });

        $marahRusli = Author::updateOrCreate(['slug' => 'marah-rusli'], ['name' => 'Marah Rusli', 'bio' => 'Sastrawan Indonesia, penulis Sitti Nurbaya (1922).', 'birth_year' => 1889]);
        $abdulMuis = Author::updateOrCreate(['slug' => 'abdul-muis'], ['name' => 'Abdul Muis', 'bio' => 'Sastrawan dan pahlawan nasional, penulis Salah Asuhan (1928).', 'birth_year' => 1883]);
        $stAlisjahbana = Author::updateOrCreate(['slug' => 'sutan-takdir-alisjahbana'], ['name' => 'Sutan Takdir Alisjahbana', 'bio' => 'Sastrawan Indonesia, penulis Layar Terkembang (1936).', 'birth_year' => 1908]);
        $timRuangMembaca = Author::updateOrCreate(['slug' => 'tim-ruang-membaca'], ['name' => 'Tim Ruang Membaca', 'bio' => 'Penulis contoh orisinal Ruang Membaca.']);

        $books = [
            [
                'author' => $marahRusli, 'title' => 'Sitti Nurbaya', 'year' => 1922, 'pages' => 320,
                'cats' => ['Sastra Klasik', 'Fiksi'],
                'synopsis' => 'Roman klasik domain publik (1922) tentang Sitti Nurbaya dan Samsulbahri di Padang. File PDF belum disertakan; admin dapat mengunggah PDF domain publik melalui Filament.',
            ],
            [
                'author' => $abdulMuis, 'title' => 'Salah Asuhan', 'year' => 1928, 'pages' => 280,
                'cats' => ['Sastra Klasik', 'Fiksi'],
                'synopsis' => 'Novel domain publik (1928) tentang Hanafi dan benturan budaya Timur-Barat. File PDF belum disertakan.',
            ],
            [
                'author' => $stAlisjahbana, 'title' => 'Layar Terkembang', 'year' => 1936, 'pages' => 220,
                'cats' => ['Sastra Klasik', 'Fiksi'],
                'synopsis' => 'Novel domain publik (1936) tentang Tuti dan Maria serta emansipasi perempuan. File PDF belum disertakan.',
            ],
            [
                'author' => $timRuangMembaca, 'title' => 'Panduan Membaca Digital', 'year' => 2026, 'pages' => 48,
                'cats' => ['Teknologi', 'Pendidikan'],
                'synopsis' => 'Buku contoh orisinal Ruang Membaca tentang kebiasaan membaca digital yang efektif. File PDF belum disertakan; admin mengunggah melalui Filament.',
            ],
            [
                'author' => $timRuangMembaca, 'title' => 'Jejak di Ruang Baca', 'year' => 2026, 'pages' => 96,
                'cats' => ['Fiksi', 'Nonfiksi'],
                'synopsis' => 'Kumpulan cerita pendek orisinal contoh untuk Ruang Membaca. File PDF belum disertakan; admin mengunggah melalui Filament.',
            ],
        ];

        foreach ($books as $data) {
            $book = Book::updateOrCreate(
                ['slug' => Str::slug($data['title'])],
                [
                    'author_id' => $data['author']->id,
                    'title' => $data['title'],
                    'synopsis' => $data['synopsis'],
                    'published_year' => $data['year'],
                    'page_count' => $data['pages'],
                    'language' => 'id',
                    'status' => 'published',
                    'is_featured' => in_array($data['title'], ['Sitti Nurbaya'], true),
                    'pdf_path' => null,
                    'cover_path' => null,
                ]
            );

            $book->categories()->sync(
                collect($data['cats'])->map(fn (string $name) => $categories[$name]->id)->all()
            );
        }
    }
}
