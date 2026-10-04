# PHP API — Modul Asep

Backend ini mengerjakan bagian PHP yang relevan dengan proyek Asep: penerjemah status teknis resi, class widget, endpoint JSON, dan pencatatan feedback.

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
- `hari1.php` — POST JSON menghitung berat volumetrik, perbandingan tarif/margin, label termurah/tercepat/margin terbaik, serta menyediakan unduhan CSV.
- `hari2.php` — POST JSON memilih layanan berdasarkan margin minimum, batas ongkir, dan prioritas kecepatan/tarif/margin.
- `ShipmentRequest.php` — class Day 12 dengan resi, berat, jarak, tier jarak, dan method `calculateCost()`.
- `shipment-form.html` dan `submit-request.php` — formulir HTML dan validasi server-side; permintaan valid disimpan sebagai objek di session PHP.
- `request-history.php` — menampilkan semua permintaan dari session dan total biayanya.
- `clear-history.php` — menghapus riwayat permintaan pada session aktif.

## Menjalankan dengan PHP built-in server

Jalankan dari root proyek:

```bash
php -S localhost:8000 -t php-api
```

Lalu buka:

```text
http://localhost:8000/shipment-history.php
http://localhost:8000/tracking-widget.php?resi=1000849201994
http://localhost:8000/shipment-form.html
```

## Menjalankan melalui XAMPP di macOS

Salin atau tautkan `php-api` ke document root XAMPP:

```bash
cp -R /Users/asep/Developer/Projects/anteraja-capstone-asyep/php-api /Applications/XAMPP/xamppfiles/htdocs/php-api
```

Kemudian set `VITE_PHP_API_URL=http://localhost/php-api` pada `frontend/.env` dan jalankan frontend dengan `npm run dev` dari folder `frontend`. Contoh endpoint langsung:

```text
http://localhost/php-api/shipment-history.php
http://localhost/php-api/tracking.php?resi=1000849201994
http://localhost/php-api/shipment-form.html
http://localhost/php-api/request-history.php
```

API kalkulator menggunakan `POST http://localhost/php-api/hari1.php` untuk perbandingan dan `POST http://localhost/php-api/hari2.php` untuk rekomendasi. Set `VITE_PHP_API_URL=http://localhost/php-api` di `frontend/.env`, lalu restart Vite.

Contoh body POST `hari1.php` / `hari2.php` (semua harga/tarif adalah angka simulasi dari modul, bukan tarif operasional Anteraja):

```json
{"berat":1.2,"p":30,"l":20,"t":15,"harga":120000,"modal":70000,"marginMin":15,"batasOngkir":50000,"preferensi":"tercepat","asuransiPersen":0,"biayaTambahan":0,"pembagiVolume":6000}
```

Riwayat kalkulasi demo disimpan lokal di browser (maksimal 20 entri) dan dapat dihapus dari halaman lab. CSV diunduh dari endpoint PHP; tautan WhatsApp hanya membuka draft pesan yang bisa ditinjau sebelum dibagikan.

### Day 12 — OOP, Form, dan Session

Buka `shipment-form.html`, kirim nomor resi, berat positif, dan jarak positif. Validasi dilakukan lagi di PHP; request valid disimpan sebagai objek `ShipmentRequest` dalam `$_SESSION['shipment_requests']`. Halaman `request-history.php` menghitung total biaya dan menyediakan tautan `Clear History` untuk sesi tersebut. Session PHP perlu diaktifkan pada XAMPP/PHP. Tarif per kg berdasarkan jarak (hingga 10 km: Rp 9.000; 10–25 km: Rp 15.000; 25–50 km: Rp 28.000; di atas 50 km: Rp 35.000) adalah nilai latihan, bukan tarif resmi Anteraja.

Pastikan Apache aktif dan folder `storage` di dalam `php-api` dapat ditulis oleh Apache.

Untuk server PHP built-in (tanpa XAMPP), isi `.env` frontend dengan:

```env
VITE_PHP_API_URL=http://localhost:8000
```

Setelah mengubah `.env`, jalankan ulang `npm run dev`.
