# PHP API — Modul Asep

Backend ini mengerjakan bagian Asep pada modul: penerjemah status teknis resi, `TrackingWidget` berbasis class, endpoint JSON, dan pencatatan feedback sederhana.

## File

- `fungsi.php` — function `statusRamah()` untuk menerjemahkan kode status.
- `kelas.php` — class `TrackingWidget` dan method `dataWidget()`.
- `shipment-history.php` — endpoint GET daftar riwayat dengan pesan ramah.
- `tracking-widget.php?resi=...` — endpoint GET widget tracking per resi.
- `tracking.php?resi=...` — endpoint GET standar untuk dipanggil komponen React.
- `ping.php` — tes koneksi API dan header CORS.
- `feedback.php` — endpoint POST untuk feedback pelanggan.
- `tracking-download.php?resi=...` — unduhan riwayat tracking sebagai `.txt`.
- `cors.php` — header CORS dan respons JSON bersama.

## Menjalankan dengan PHP built-in server

Jalankan dari root proyek:

```bash
php -S localhost:8000 -t php-api
```

Lalu buka:

```text
http://localhost:8000/shipment-history.php
http://localhost:8000/tracking-widget.php?resi=1000849201994
```

Untuk menyambungkan React, isi `.env` di root proyek:

```env
VITE_API_URL=http://localhost:8000
```

Setelah mengubah `.env`, jalankan ulang `npm run dev`. XAMPP juga dapat dipakai dengan menyalin folder ini ke `htdocs/php-api`, lalu gunakan `VITE_API_URL=http://localhost/php-api`.
