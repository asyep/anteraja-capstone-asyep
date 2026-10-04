<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Anteraja Tracking API

This backend is the existing Laravel 13 application and requires PHP 8.3 or newer.

### Local Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Configure PostgreSQL/Supabase, Redis, and `GEMINI_API_KEY` in `.env`. Apply the tracking schema from the repository root, then run the feedback migration and API:

```bash
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_DATABASE" -f ../database/schema.sql
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

Start a queue worker to process negative-feedback jobs:

```bash
php artisan queue:work
```

Gemini narratives use a 1.2-second timeout and fall back to local status-based text when the key is unset, a request times out, or the provider returns an error. Feedback jobs retry three times with 10-second and 60-second backoffs; they write a warning to the Laravel log for operations review.

### API

- `GET /api/v1/tracking/{waybill_number}` accepts a 32-character alphanumeric waybill, returns four tracking milestones, WIB ETA, delay state, and narrative; cached for five minutes and limited to 60 requests per minute per IP.
- `POST /api/v1/feedback` accepts `{ "resi": "<32 chars>", "membantu": true|false, "catatan": "optional" }` and persists the feedback.
- API responses include the `X-Waktu-Ms` request duration header. Tracking responses also receive public cache headers.
- CORS permits Vite development origins on port 5173. Set frontend `VITE_API_URL=http://localhost:8000/api/v1`.

## Day 13 - CRUD pengiriman dan kurir

Modul latihan Day 13 berada di aplikasi Laravel yang sama, tanpa membuat project Laravel kedua. Buka `/shipments` untuk mengelola data pengiriman (daftar, detail, tambah, edit, dan hapus) dan `/couriers` untuk mengelola data kurir. Nomor resi mengikuti format 32 karakter alfanumerik pada FRD. Status menggunakan kamus status yang sudah dipakai oleh schema tracking project.

Migration Day 13 menambahkan tabel `couriers` dan `shipments`; relasi `shipments.courier_id` wajib menunjuk ke kurir yang ada. Kedua migration ini bersifat tambahan dan tidak mengubah tabel `orders` maupun view `tracking_summary` yang digunakan API tracking. Data contoh memakai empat waybill sintetis yang sudah ada di `database/sample_data.sql`, dengan berat dan assignment kurir untuk kebutuhan CRUD latihan.

Jalankan migration dan data contoh pada database yang dikonfigurasi untuk Laravel:

```bash
cd backend
php artisan migrate
php artisan db:seed --class=CourierSeeder
php artisan db:seed --class=ShipmentSeeder
php artisan serve
```

Untuk instalasi lokal baru, `.env.example` menggunakan SQLite. Project yang `.env`-nya sudah diarahkan ke Supabase tetap memakai koneksi itu. Perintah `migrate` menjalankan semua migration Laravel yang belum tercatat; migration Day 13 sendiri hanya menambah dua tabel latihan dan tidak memuat ulang `database/schema.sql`. Jangan menimpa `.env` yang sudah berisi konfigurasi koneksi lokal Anda.

Run the backend tests with `php artisan test`.

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
