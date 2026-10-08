# Naskah Presentasi — MilestoneMapperService

Deck: `backend-milestone-mapper.pptx` (9 slide) • Durasi: 8–9 menit

---

## Kalimat kunci — hafalkan ini

> "Saya membuat satu service backend yang mengubah data mentah pengiriman dari database
> menjadi empat tahap milestone dan estimasi tiba dalam WIB, supaya bisa langsung
> ditampilkan ke pelanggan."

Kalau kamu lupa semua hal lain, kalimat ini cukup untuk menjawab "kamu presentasi apa?"

---

## Urutan ngomong

### Slide 1 — Pembuka (30 detik)

> "Selamat pagi. Saya Asep. Dari seluruh backend proyek ini, saya memilih membahas satu
> fitur: `MilestoneMapperService`, method `map()`. Alasan saya pilih ini karena output-nya
> langsung terlihat di widget — stepper empat tahap dan badge ETA."

### Slide 2 — Masalahnya apa (1 menit)

Tunjuk kartu 01, 02, 03 satu per satu.

> "Sebelum fitur ini ada, ada tiga masalah.
> Pertama, database menyimpan kode teknis seperti `OUT_FOR_DELIVERY` — itu istilah internal,
> tidak bisa saya tampilkan langsung ke pelanggan.
> Kedua, timestamp tersebar di dua tempat: sebagian di kolom tabel `tracking_summary`,
> sebagian di tabel `tracking_events`.
> Ketiga, data mentahnya berformat UTC, padahal ETA harus WIB dan harus ikut
> mempertimbangkan keterlambatan."

### Slide 3 — Solusinya (1 menit)

> "Solusi saya: satu class dengan satu method publik, `map()`. Input-nya array shipment dari
> database, output-nya array yang sudah siap dirender UI. Method ini tidak menyentuh database
> dan tidak memanggil jaringan — satu-satunya dependensi adalah Carbon untuk konversi waktu.
> Dipanggil di `TrackingController` baris 42."

### Slide 4 — Sebelum vs sesudah (1 menit)

Tunjuk kotak kiri, lalu kotak kanan.

> "Ini perbandingannya. Di kiri data mentah: status `in_transit`, timestamp UTC,
> `waiting_time_minutes` 30. Di kanan hasilnya: `current_milestone_stage` menjadi
> `IN_TRANSIT`, `formatted_eta` menjadi 02 Oktober 2026, 18:30 WIB, plus array empat milestone."
>
> "Angka 18:30 itu berasal dari jam 18:00 ditambah 30 menit waktu tunggu."

### Slide 5 — Bagian kode 1 (1,5 menit)

> "Kodenya saya bagi dua bagian. Bagian pertama: saya punya kamus empat tahap —
> ORDER_CREATED, PICKUP_READY, IN_TRANSIT, DELIVERED — masing-masing dengan label bahasa
> pelanggan, seperti 'Pesanan Dibuat' dan 'Tiba di Tujuan'."
>
> "Lalu saya tentukan tahap mana yang aktif memakai `match(true)`. Ini bagian pentingnya:
> `match(true)` dibaca dari atas ke bawah, jadi saya taruh kondisi paling akhir lebih dulu.
> Kalau paket sudah tiba, langsung DELIVERED. Kalau belum, cek apakah sedang di jalan.
> Kalau belum, cek apakah sudah diambil kurir. Kalau tidak ada semuanya, berarti baru
> ORDER_CREATED. Hasilnya: paket yang sudah tiba tidak akan pernah salah terbaca sebagai
> 'dalam perjalanan'."

### Slide 6 — Bagian kode 2 (1 menit)

> "Bagian kedua: menghitung ETA. Saya ambil tanggal estimasi, set timezone ke Asia/Jakarta,
> set jam 18:00, lalu tambahkan `waiting_time_minutes`. Output-nya saya format ke bahasa
> Indonesia: 02 Oktober 2026, 18:30 WIB."
>
> "Lalu `has_delay`. Keterlambatan saya anggap nyata kalau alasan delay terisi selain 'None',
> ATAU status lalu lintasnya 'heavy' atau 'detour'. Jadi saya memeriksa dua sumber, bukan satu."

### Slide 7 — Demo (2 menit)

Demo ada dua bagian: **A** lewat aplikasi React, lalu **B** lewat terminal.
Langkah lengkapnya ada di **Playbook Demo** di bawah.

Ringkasnya, jalankan di terminal:

```bash
python3 docs/presentations/demo-backend.py tampil
```

> "Saya coba tiga nomor resi. Yang pertama statusnya `processing`, tahapnya `PICKUP_READY`,
> ETA 07 Oktober 2026. Yang kedua `in_transit` menjadi `IN_TRANSIT`. Yang ketiga `delivered`
> menjadi `DELIVERED`. Tiga resi, tiga tahap berbeda — dan hasilnya persis seperti tabel ini."
>
> "Perhatikan juga `[x]`, `[>]`, dan `[ ]` — itu bentuk `completed` dan `current` yang
> dihasilkan mapper, yang dirender jadi stepper di aplikasi React tadi."

Opsional, kalau ingin menyebut performa:

> "Di bawah ada `waktu proses`. Kalau angkanya di bawah 5 ms, itu artinya responsnya
> dilayani dari cache Redis, bukan query ulang ke database."

### Slide 8 — Bukti & kesimpulan (1 menit)

> "Saya sertakan test untuk fitur ini. Test pertama memverifikasi pemetaan milestone, ETA, dan
> caching. Test kedua memverifikasi deteksi lalu lintas padat. Keduanya lulus."
>
> "Karena ini pure function — tanpa database dan tanpa jaringan — hasilnya deterministik dan
> mudah diuji."
>
> "Saya juga jujur soal batasannya: aturan empat tahap masih hardcoded, dan ETA-nya masih
> formula sederhana, bukan model prediktif. Ini yang akan saya kembangkan berikutnya:
> memindahkannya ke file konfigurasi."

### Slide 9 — Penutup (15 detik)

> "Saya siap kalau ada pertanyaan."

---

## Kalau demo-nya gagal

Jangan panik, dan jangan minta maaf berlebihan. Slide 7 sudah memuat hasilnya dalam tabel.

> "Sepertinya server lokalnya tidak aktif. Tapi hasilnya sudah saya catat di tabel ini —
> ini respons asli saat saya mengujinya."

---

## Yang JANGAN dilakukan

- Jangan membaca kode baris per baris. Cukup jelaskan dua bagian seperti di atas.
- Jangan bilang "ini simple banget" atau minta maaf. Kalau kamu menyebutnya sederhana,
  penguji akan menganggap tidak ada yang layak ditanyakan.
- Jangan mengarang jawaban kalau tidak tahu. Pakai kalimat ini:
  **"Itu batasan yang saya sadari, dan sudah saya catat di slide 8 sebagai pengembangan berikutnya."**

---

## Tiga pertanyaan yang hampir pasti muncul

Semua jawabannya sudah ada di slide 9:

1. Kenapa tidak dikerjakan di frontend saja?
2. Apa bedanya dengan `statusRamah()`?
3. Kenapa memakai `match(true)`?

---

## Latihan

1. Buka deck, baca naskah ini sekali sambil memindah slide.
2. Ulangi sekali lagi tanpa membaca naskah, hanya lihat slide.
3. Jalankan `python3 docs/presentations/demo-backend.py` untuk cek kesiapan.
4. Siapkan terminal dengan perintah demo sudah tertulis, jangan mengetik saat presentasi.

---

# Playbook Demo

Demo memakai halaman **`/lacak`**, dan halaman itu sekarang tersambung ke API backend
dan database. Halaman `/smart-widget` juga masih tersambung ke API dengan tampilan yang
sama. Halaman status mock lama (tracking-normal, tracking-live, dan seterusnya) masih ada
di aplikasi, tetapi tidak dipakai untuk demo ini.

## Data untuk demo

Empat nomor resi ini ada di database. Tiga menghasilkan tahap berbeda, satu menghasilkan
kasus keterlambatan — pakai yang keempat kalau ingin menunjukkan deteksi delay.

| Nomor resi | Yang muncul |
| --- | --- |
| `44444444444444444444444444444444` | PICKUP_READY — Diproses Kurir |
| `00010242fe8c5a6d1ba2dd792cb16214` | IN_TRANSIT — Dalam Perjalanan |
| `0008288aa423d2a3f00fcb17cd7d8719` | IN_TRANSIT + banner keterlambatan, ETA 18:45 WIB |
| `11111111111111111111111111111111` | DELIVERED — Tiba di Tujuan |

Kamu **tidak perlu mengetik atau meng-copy** nomor ini. Di halaman `/lacak` sudah ada
tombol "Resi contoh — data asli dari database". Klik saja salah satunya.

## Bagian A — Demo lewat aplikasi (1,5 menit)

Ini yang paling meyakinkan karena penguji melihat hasilnya, bukan kodenya.

1. Buka `http://localhost:5173/lacak`
2. Di bagian bawah kotak pencarian, klik tombol resi contoh
   `#44444444444444444444444444444444`

Sambil menunggu (sekitar 1,4 detik kalau cache kosong), katakan:

> "Ini memanggil endpoint backend saya, dan hasilnya dirender jadi beberapa komponen."

Setelah muncul, tunjuk berurutan:

> "Ini badge estimasi tiba — 07 Oktober 2026. Ini narasi Satria. Dan ini stepper empat
> tahap, dengan 'Diproses Kurir' sedang aktif."

3. Klik resi contoh `#00010242fe8c5a6d1ba2dd792cb16214` → stepper pindah ke "Dalam Perjalanan"
4. Klik resi contoh `#0008288aa423d2a3f00fcb17cd7d8719` → muncul banner keterlambatan,
   dan ETA bergeser jadi **18:45 WIB**
5. Klik resi contoh `#11111111111111111111111111111111` → stepper pindah ke "Tiba di Tujuan"

> "Empat resi, tahap berbeda-beda — dan tahap itu ditentukan `match(true)` yang saya
> jelaskan di slide 5. Jadi perpindahan stepper ini hasil kerja backend, bukan animasi."

Untuk resi keempat, ini momen terbaikmu menghubungkan ke slide 6:

> "Resi ini alasan delay-nya 'Traffic Jam' dan lalu lintasnya 'Heavy', jadi `has_delay`
> bernilai true. Dan lihat ETA-nya: 18:45, bukan 18:00 — itu karena `waiting_time_minutes`
> bernilai 45 menit, persis seperti rumus `addMinutes` di slide 6."

## Bagian B — Demo lewat terminal (1 menit)

Ini yang membuktikan presentasimu memang **backend**, bukan sekadar UI.

Sudah disiapkan, tinggal jalankan:

```bash
python3 docs/presentations/demo-backend.py tampil
```

Tunjuk bagian `current_milestone_stage`, baris `[terlambat: Traffic Jam]`, dan blok `[x] [>] [ ]`:

> "Ini data mentah dari API-nya. Perhatikan `current_milestone_stage` bernilai IN_TRANSIT,
> dan setiap tahap punya penanda completed atau current — inilah output asli dari method
> `map()` yang saya bahas. Halaman React tadi hanya merender ini."

## Bagian C — Kalau ada waktu: bukti caching (30 detik, opsional)

Klik resi contoh yang sama dua kali berturut-turut, lalu tunjuk `waktu proses` di terminal:

> "Panggilan pertama sekitar 1,4 detik karena query ke database. Yang kedua di bawah 5
> milidetik karena sudah ada di cache Redis. Cache-nya saya pasang di controller, jadi
> service yang saya bahas tetap murni tanpa cache."

## Cek kesiapan — jalankan 5 menit sebelum tampil

```bash
python3 docs/presentations/demo-backend.py
```

Kalau semua baris `OK`, kamu siap. Kalau ada `GAGAL`, script-nya langsung memberi tahu
perintah yang harus dijalankan:

- Laravel mati → `cd backend && php artisan serve`
- Vite mati → `cd frontend && npm run dev`

## Rencana cadangan

Kalau di tengah demo aplikasinya error atau server mati:

> "Sepertinya server lokalnya tidak aktif. Tapi hasilnya sudah saya catat di tabel ini —
> ini respons asli saat saya mengujinya."

Lalu lanjutkan dengan tabel di slide 7. **Jangan** mencoba memperbaiki server di depan
penguji. Jangan mengetik perintah baru. Cukup pindah ke slide 7 dan lanjutkan.

## Yang harus sudah siap sebelum masuk ruangan

- [ ] Laravel dan Vite sudah jalan (hasil `cek` semua OK)
- [ ] Tab browser sudah terbuka di `/lacak`
- [ ] Terminal sudah terbuka dengan perintah `tampil` siap
- [ ] Deck sudah terbuka di slide 1

