# Ruang Membaca — Perpustakaan Digital

Website perpustakaan online modern: katalog buku, baca PDF langsung di browser (PDF.js), progres & bookmark bacaan, catatan pribadi, rating/ulasan/diskusi antar pembaca, plus panel admin. Dilengkapi landing page dengan carousel quotes tokoh (auto-slide 5 detik) dan koleksi **58 buku klasik/domain publik berbahasa Indonesia yang sudah ada isi PDF-nya** (Chairil Anwar, Amir Hamzah, Tan Malaka, Merari Siregar, sastra peranakan, dll). Sebanyak **30 buku di antaranya adalah edisi ejaan modern** (ejaan lama Van Ophuijsen sudah dimodernkan ke ejaan sekarang, isi cerita tidak berubah). Di luar itu ada 5 buku contoh bawaan seeder dasar (metadata saja, PDF menyusul dari admin).

## Fitur Utama

**Pengguna**
- Registrasi, login, logout, lupa password, login dengan Google (opsional — selalu menampilkan pemilih akun Google), edit profil + foto (ada ikon kamera di foto profil, foto juga tampil di navbar), ubah password, hapus akun
- Landing page (`/`) dengan hero, statistik koleksi, quotes tokoh tentang membaca, dan CTA ke Beranda (`/beranda`)
- Katalog: pencarian, filter kategori, sorting (terbaru/terpopuler/rating), tampilan grid/list, pagination
- Detail buku: cover, penulis, kategori, sinopsis, rating rata-rata, jumlah pembaca; daftar ulasan bisa dibaca tamu
- Reader PDF online dengan **dua mode baca: "1 Halaman" atau "Scroll Semua"** (semua halaman menurun, tinggal gulir), **lompat langsung ke halaman tertentu**, zoom, mode malam, fullscreen, ingat halaman terakhir, progres %, bookmark halaman (klik bookmark melompat ke halamannya), catatan pribadi yang tampil lagi di reader & terkumpul di halaman Catatan Saya
- Rating bintang 1–5, ulasan (1 pengguna = 1 ulasan per buku, bisa diubah), komentar berbalas + notifikasi, bisa menghapus ulasan/komentar sendiri
- Perpustakaan pribadi: favorit, wishlist, bookmark, riwayat bacaan (termasuk 10 aktivitas membaca terakhir)
- Dark mode

**Admin (Filament di `/admin`)**
- CRUD buku (upload cover + PDF), kategori, penulis, pengguna
- Moderasi ulasan dan komentar (ada tautannya di navbar khusus admin) + statistik aktivitas membaca
- Widget statistik & buku terpopuler
- Impor metadata buku dari Google Books API

## Teknologi

- **Laravel 12** (PHP) + **Inertia.js 2 + React** (frontend satu project, bukan API terpisah)
- **Filament 4** (panel admin), **Tailwind CSS**, **MySQL**
- PDF.js untuk reader, Laravel Socialite untuk login Google
- Paket ini menyertakan `composer.lock` yang sudah final — install cukup `composer install`, **jangan** `composer update`

## Syarat (Penting — Baca Dulu)

- **PHP 8.2 atau lebih baru**, dengan ekstensi **`intl` dan `zip` AKTIF**.
  Ini sumber error paling umum: kalau kedua ekstensi ini belum aktif, `composer install` akan gagal. Cara mengaktifkan di XAMPP: buka `C:\xampp\php\php.ini`, cari baris `;extension=intl` dan `;extension=zip`, hapus tanda `;` di depannya, simpan, lalu tutup & buka lagi terminalnya. Cek dengan `php -m` — harus ada `intl` dan `zip` di daftar.
- **Composer** (versi terbaru)
- **Node.js & npm** (untuk build frontend)
- **MySQL** (lewat XAMPP/phpMyAdmin juga boleh)

## Langkah Install

```bash
# 1. Clone repo ini, lalu masuk ke foldernya
git clone <url-repo-ini>
cd ruang-membaca

# 2. Install dependensi PHP (memakai composer.lock, bukan update)
composer install

# 3. Siapkan file .env
copy .env.example .env        # Windows (CMD/PowerShell)
# cp .env.example .env        # Mac/Linux
```

Edit `.env`, sesuaikan bagian database:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ruang_membaca
DB_USERNAME=root
DB_PASSWORD=
```

Lanjutkan:

```bash
# 4. Generate application key
php artisan key:generate

# 5. Buat database MySQL kosong bernama ruang_membaca
#    (lewat phpMyAdmin, atau: mysql -u root -e "CREATE DATABASE ruang_membaca;")

# 6. Migrasi + data awal (akun admin, kategori, buku contoh)
php artisan migrate --seed

# 7. Pasang 58 buku yang file PDF & cover-nya sudah ikut di repo ini.
#    Jalankan BERURUTAN — seeder ejaan modern WAJIB terakhir,
#    supaya judul & jumlah halaman yang terpasang adalah versi ejaan modern.
php artisan db:seed --class=AttachClassicPdfsSeeder
php artisan db:seed --class=UpdateClassicCoversSeeder
php artisan db:seed --class=AttachPopularBooksSeeder
php artisan db:seed --class=AttachBukuBaruSeeder
php artisan db:seed --class=AttachBukuLagiSeeder
php artisan db:seed --class=UpdateEjaanModernSeeder

# 8. Link storage agar cover buku bisa tampil
php artisan storage:link

# 9. Install & build frontend
npm install
npm run build

# 10. Jalankan server
php artisan serve
```

Buka **http://127.0.0.1:8000** — kamu akan masuk ke landing page; klik **Mulai Membaca** untuk ke Beranda.

### Akun Hasil Seeder

| Peran | Email | Password |
|---|---|---|
| Admin | `admin@ruangmembaca.id` | `password` |
| Pembaca demo | `demo@ruangmembaca.id` | `password` |

Panel admin Filament ada di **http://127.0.0.1:8000/admin** (login pakai akun admin di atas).

## Login dengan Google (Opsional)

Tombol "Masuk dengan Google" di halaman login **tidak wajib** diaktifkan — tanpa ini pun login biasa tetap jalan. Kalau mau mengaktifkan:

1. Buka [Google Cloud Console](https://console.cloud.google.com) → buat project baru
2. **Google Auth Platform / APIs & Services → OAuth consent screen**: mode External, isi nama aplikasi & email
3. **Credentials → Create OAuth client ID → Web application**, isi **Authorized redirect URI** persis: `http://127.0.0.1:8000/auth/google/callback`
4. Salin Client ID & Client Secret ke `.env`:
   ```ini
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/auth/google/callback
   ```
5. Jalankan `php artisan config:clear`
6. Catatan: selama status aplikasi Google masih "Testing", hanya Gmail yang kamu daftarkan sebagai **Test users** (menu Audience) yang bisa login.
7. Setiap klik "Masuk dengan Google" akan menampilkan pemilih akun, jadi bisa berganti akun Google tanpa harus logout dari browser.

> Jangan pernah commit file `.env` ke GitHub — file itu sudah masuk `.gitignore`. Yang boleh dibagikan hanya `.env.example`.

## Troubleshooting Singkat

| Gejala | Penyebab & Solusi |
|---|---|
| `composer install` error soal `ext-intl` / `ext-zip` | Ekstensi belum aktif — aktifkan di `php.ini` (lihat bagian Syarat), lalu ulangi `composer install` |
| `composer install` error soal versi PHP (mis. paket minta PHP ^8.3) | Pastikan PHP yang aktif di terminal adalah 8.2.x: cek `php -v`. Paket ini sudah dikunci untuk PHP 8.2.12 lewat `composer.lock` + `config.platform` |
| Error `Unsupported cipher or incorrect key length` | `APP_KEY` di `.env` kosong/salah — jalankan `php artisan key:generate` |
| Halaman admin Filament tampil tanpa gaya/CSS | Jalankan `php artisan filament:assets`, lalu hard-refresh browser (Ctrl+F5) |
| Cover buku tidak tampil (gambar rusak) | Belum menjalankan `php artisan storage:link` |
| Buku-buku belum ada isinya / judul masih ejaan lama | Belum menjalankan enam seeder di langkah 7 secara berurutan (terutama `UpdateEjaanModernSeeder` di paling akhir) |
| Error `Table 'users' already exists` saat `migrate` | Folder project tercampur project Laravel lain — clone ke folder yang benar-benar kosong |
| Login Google error `invalid_client` | Client ID/Secret di `.env` salah salin atau masih placeholder — salin ulang pakai tombol copy di Google Cloud Console, lalu `php artisan config:clear` |
| Tombol "Simpan Profil" tidak merespons | Sudah diperbaiki di versi ini (dulu ada bug pada kode submit form profil). Pastikan kamu memakai kode terbaru & sudah `npm run build` |
| Error `Unknown column 'word_count'` saat `UpdateEjaanModernSeeder` | Tidak akan muncul di versi ini — seeder ejaan sudah diperbaiki (tabel `books` memang tidak punya kolom itu) |
| Perintah seeder error "Target class ... does not exist" | Cek nama class-nya — biasanya ada karakter ekstra (mis. titik) yang ikut terketik di akhir perintah |

## Catatan Koleksi Buku

58 buku ber-PDF pada repo ini adalah karya domain publik (penulis wafat >70 tahun lalu) berbahasa Indonesia yang teks lengkapnya dihimpun dari sumber legal (Wikisumber, Internet Archive, Wikimedia Commons, Marxists Internet Archive), lengkap dengan halaman atribusi di dalam tiap PDF. 30 judul diterbitkan ulang sebagai **edisi ejaan modern**. File PDF tersimpan di `storage/app/private/books/pdf/` dan cover di `storage/app/public/covers/` — keduanya sengaja ikut ter-commit agar koleksi langsung lengkap setelah install.
