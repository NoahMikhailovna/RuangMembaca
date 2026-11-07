# Ruang Membaca — Perpustakaan Digital

Website perpustakaan online modern: katalog buku, baca PDF langsung di browser (PDF.js), progres & bookmark bacaan, catatan pribadi, rating/ulasan/diskusi antar pembaca, plus panel admin. Dilengkapi landing page dengan carousel quotes tokoh (auto-slide 5 detik) dan koleksi **20 buku klasik/domain publik yang sudah ada isi PDF-nya** (Chairil Anwar, Amir Hamzah, Tan Malaka, Sejarah Melayu, dll).

## Fitur Utama

**Pengguna**
- Registrasi, login, logout, lupa password, login dengan Google (opsional), edit profil + foto, ubah password
- Landing page (`/`) dengan hero, statistik koleksi, quotes tokoh tentang membaca, dan CTA ke Beranda (`/beranda`)
- Katalog: pencarian, filter kategori, sorting (terbaru/terpopuler/rating), tampilan grid/list, pagination
- Detail buku: cover, penulis, kategori, sinopsis, rating rata-rata, jumlah pembaca
- Reader PDF online: zoom, mode malam, navigasi halaman, fullscreen, ingat halaman terakhir, progres %, bookmark halaman, catatan pribadi
- Rating bintang 1–5, ulasan, komentar berbalas + notifikasi
- Perpustakaan pribadi: favorit, wishlist, riwayat bacaan, rekomendasi
- Dark mode

**Admin (Filament di `/admin`)**
- CRUD buku (upload cover + PDF), kategori, penulis, pengguna
- Moderasi ulasan dan komentar
- Widget statistik & buku terpopuler
- Impor metadata buku dari Google Books API

## Teknologi

- **Laravel 12** (PHP) + **Inertia.js 2 + React** (frontend satu project, bukan API terpisah)
- **Filament 4** (panel admin), **Tailwind CSS**, **MySQL**
- PDF.js untuk reader, Laravel Socialite untuk login Google
- Paket ini menyertakan `composer.lock` yang sudah final — install cukup `composer install`, **jangan** `composer update`

## Syarat (Penting — Baca Dulu)

- **PHP 8.2 atau lebih baru**, dengan ekstensi **`intl` dan `zip` AKTIF**.
  Ini sumber error paling umum kemarin: kalau kedua ekstensi ini belum aktif, `composer install` akan gagal. Cara mengaktifkan di XAMPP: buka `C:\xampp\php\php.ini`, cari baris `;extension=intl` dan `;extension=zip`, hapus tanda `;` di depannya, simpan, lalu tutup & buka lagi terminalnya. Cek dengan `php -m` — harus ada `intl` dan `zip` di daftar.
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

# 7. Pasang 20 buku klasik yang file PDF & cover-nya sudah ikut di repo ini
php artisan db:seed --class=AttachClassicPdfsSeeder
php artisan db:seed --class=UpdateClassicCoversSeeder
php artisan db:seed --class=AttachPopularBooksSeeder

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

> Jangan pernah commit file `.env` ke GitHub — file itu sudah masuk `.gitignore`. Yang boleh dibagikan hanya `.env.example`.

## Troubleshooting Singkat

| Gejala | Penyebab & Solusi |
|---|---|
| `composer install` error soal `ext-intl` / `ext-zip` | Ekstensi belum aktif — aktifkan di `php.ini` (lihat bagian Syarat), lalu ulangi `composer install` |
| `composer install` error soal versi PHP (mis. paket minta PHP ^8.3) | Pastikan PHP yang aktif di terminal adalah 8.2.x: cek `php -v`. Paket ini sudah dikunci untuk PHP 8.2.12 lewat `composer.lock` + `config.platform` |
| Error `Unsupported cipher or incorrect key length` | `APP_KEY` di `.env` kosong/salah — jalankan `php artisan key:generate` |
| Halaman admin Filament tampil tanpa gaya/CSS | Jalankan `php artisan filament:assets`, lalu hard-refresh browser (Ctrl+F5) |
| Cover buku tidak tampil (gambar rusak) | Belum menjalankan `php artisan storage:link` |
| Buku klasik belum ada isinya | Belum menjalankan tiga seeder di langkah 7 |
| Error `Table 'users' already exists` saat `migrate` | Folder project tercampur project Laravel lain — clone ke folder yang benar-benar kosong |
| Login Google error `invalid_client` | Client ID/Secret di `.env` salah salin atau masih placeholder — salin ulang pakai tombol copy di Google Cloud Console, lalu `php artisan config:clear` |

## Catatan Koleksi Buku

20 buku klasik pada repo ini adalah karya domain publik (penulis wafat >70 tahun lalu) yang teks lengkapnya dihimpun dari sumber legal (Wikisumber, Internet Archive, Marxists Internet Archive, Project Gutenberg), lengkap dengan halaman atribusi di dalam tiap PDF. File PDF tersimpan di `storage/app/private/books/pdf/` dan cover di `storage/app/public/covers/` — keduanya sengaja ikut ter-commit agar koleksi langsung lengkap setelah install.
