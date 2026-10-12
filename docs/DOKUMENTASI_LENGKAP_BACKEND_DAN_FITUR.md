# 📖 BUKU DOKUMENTASI LENGKAP: ARSITEKTUR BACKEND, CARA KERJA FITUR, & BEDAH KODE
### Proyek Capstone: Anteraja Smart AI Tracking (Satria Assistant)

> **Catatan untuk Anda:**  
> Dokumen ini disusun khusus agar Anda yang belum terbiasa dengan backend dapat **memahami setiap jengkal kode**, **mengerti alur kerja setiap fitur**, dan **mampu menjelaskan semuanya dengan tenang, percaya diri, dan memukau** di hadapan dosen penguji. Semua konsep teknis dijelaskan dengan **analogi kehidupan sehari-hari** yang sangat mudah dipahami.

---

## 📑 DAFTAR ISI BESAR

1. [Bab 1: Konsep Dasar & Analogi Besar Arsitektur ("Restoran Mewah Bintang 5")](#bab-1-konsep-dasar--analogi-besar-arsitektur-restoran-mewah-bintang-5)
2. [Bab 2: Cara Kerja Lengkap Setiap Fitur (Dari Layar hingga Jeroan Server)](#bab-2-cara-kerja-lengkap-setiap-fitur-dari-layar-hingga-jeroan-server)
   - [Fitur 1: Pencarian & Validasi Resi 14 Digit](#fitur-1-pencarian--validasi-resi-14-digit)
   - [Fitur 2: Asisten AI "Satria" (Narasi Realistis & Menenangkan Pikiran)](#fitur-2-asisten-ai-satria-narasi-realistis--menenangkan-pikiran)
   - [Fitur 3: Tombol Refresh / Regenerasi Narasi AI Real-Time](#fitur-3-tombol-refresh--regenerasi-narasi-ai-real-time)
   - [Fitur 4: Radar Posisi & Peta IoT Telemetri (GPS, Cuaca, Kecepatan)](#fitur-4-radar-posisi--peta-iot-telemetri-gps-cuaca-kecepatan)
   - [Fitur 5: Operational Warning Banner (F-04) — Deteksi Hambatan Rute](#fitur-5-operational-warning-banner-f-04--deteksi-hambatan-rute)
   - [Fitur 6: Stepper 5 Milestone & Catatan Perjalanan Detil (Journey Notes)](#fitur-6-stepper-5-milestone--catatan-perjalanan-detil-journey-notes)
   - [Fitur 7: Kartu Profil Kurir Satria & Direct WhatsApp](#fitur-7-kartu-profil-kurir-satria--direct-whatsapp)
   - [Fitur 8: Kotak Feedback CSAT (Umpan Balik Kepuasan Pengguna)](#fitur-8-kotak-feedback-csat-umpan-balik-kepuasan-pengguna)
   - [Fitur 9: Quick Demo Chips (Sampel Resi Skenario Pengujian)](#fitur-9-quick-demo-chips-sampel-resi-skenario-pengujian)
   - [Fitur 10: Riwayat Pencarian Berbasis Sesi (Session Privacy Lifecycle)](#fitur-10-riwayat-pencarian-berbasis-sesi-session-privacy-lifecycle)
3. [Bab 3: Bedah Tuntas Kode Backend — File demi File, Fungsi demi Fungsi](#bab-3-bedah-tuntas-kode-backend--file-demi-file-fungsi-demi-fungsi)
   - [3.1 Rute & Gerbang Masuk: `routes/api.php`](#31-rute--gerbang-masuk-routesapiphp)
   - [3.2 Controller Pelacakan: `TrackingController.php`](#32-controller-pelacakan-trackingcontrollerphp)
   - [3.3 Controller Data Kiriman & Demo: `ShipmentController.php`](#33-controller-data-kiriman--demo-shipmentcontrollerphp)
   - [3.4 Controller Umpan Balik: `FeedbackController.php`](#34-controller-umpan-balik-feedbackcontrollerphp)
   - [3.5 Otak Integrasi AI & Fallback: `GeminiAIService.php`](#35-otak-integrasi-ai--fallback-geminiaiservicephp)
   - [3.6 Model Database (Eloquent ORM): Folder `app/Models/`](#36-model-database-eloquent-orm-folder-appmodels)
   - [3.7 Penyaji Data Terstandar: Folder `app/Http/Resources/`](#37-penyaji-data-terstandar-folder-apphttpresources)
   - [3.8 Arsitek Basis Data: Berkas Migrasi Database & SQL View](#38-arsitek-basis-data-berkas-migrasi-database--sql-view)
   - [3.9 Pengisi Data Awal Otomatis: `DatasetSeeder.php`](#39-pengisi-data-awal-otomatis-datasetseederphp)
4. [Bab 4: Tabel Hubungan Antara Backend dan Frontend (Jembatan Sistem)](#bab-4-tabel-hubungan-antara-backend-dan-frontend-jembatan-sistem)
5. [Bab 5: Alur Siklus Hidup Data (Apa yang Terjadi Saat Pengguna Klik Tombol?)](#bab-5-alur-siklus-hidup-data-apa-yang-terjadi-saat-pengguna-klik-tombol)
6. [Bab 6: Kamus Istilah Teknis & Analogi Sederhana](#bab-6-kamus-istilah-teknis--analogi-sederhana)
7. [Bab 7: Cheatsheet Presentasi & Ujian (Kisi-Kisi Tanya Jawab Dosen)](#bab-7-cheatsheet-presentasi--ujian-kisi-kisi-tanya-jawab-dosen)

---

## BAB 1: KONSEP DASAR & ANALOGI BESAR ARSITEKTUR ("RESTORAN MEWAH BINTANG 5")

Untuk memahami proyek ini dengan sangat mudah, bayangkan seluruh aplikasi ini bekerja persis seperti sebuah **Restoran Mewah Bintang 5**:

```
 [ PELANGGAN / USER ]
       │  (Duduk di meja, membaca buku menu, mengetik resi)
       ▼
 [ FRONTEND: React 19 + Tailwind CSS ]
   = MEJA MAKAN & BUKU MENU YANG INDAH
       │
       │  (Pelayan mengantar pesanan ke dapur lewat sambungan telepon/HTTP)
       ▼
 [ MIDDLEWARE THROTTLE: Rate Limiter ]
   = SATPAM DI DEPAN PINTU DAPUR
       │  (Memastikan tidak ada orang usil yang spam 1000 pesanan per detik)
       ▼
 [ CONTROLLER: TrackingController, dll ]
   = KOKI UTAMA (HEAD CHEF)
   - Mengambil pesanan, membagi tugas, mengontrol kualitas
       │
       ├─── Mengambil bahan mentah ──► [ DATABASE POSTGRESQL via ELOQUENT ORM ]
       │                               = KULKAS PENYIMPAN BAHAN MAKANAN SEGAR
       │
       ├─── Meracik bumbu pintar ────► [ GOOGLE GEMINI AI SERVICE ]
       │                               = KONSULTAN RASA INTERNASIONAL (AI)
       │                                 (Jika konsultan offline, koki pakai Resep Rahasia / Fallback)
       │
       ▼
 [ API RESOURCE: ShipmentTrackingResource ]
   = PLATING / TATA CARA PENYAJIAN DI ATAS PIRING BERSIH
       │  (Membuang sampah kulit bawang, hanya menyajikan makanan lezat berstandar)
       ▼
 [ JSON RESPONSE ] ──► Dikirim balik ke Pelanggan di Meja Makan (Frontend)
```

### Peran Setiap Komponen:
1. **Frontend (React 19)**: Apa yang dilihat oleh mata pengguna—warna gradasi merah khas Anteraja, kartu status, peta jalan kurir, dan balon ucapan AI.
2. **Backend (Laravel 11)**: Dapur yang tersembunyi di balik dinding. Tempat logika dihitung, data divalidasi, dan instruksi keamanan dijalankan.
3. **Database (PostgreSQL / Supabase)**: Gudang penyimpanan data tempat 70 data resi, riwayat checkpoint, identitas kurir, dan sensor IoT tersimpan rapi.
4. **Google Gemini LLM**: Pabrik kecerdasan buatan dari Google yang bertugas mengubah deretan data angka mentah (status: IN_TRANSIT, speed: 78 km/h, delay: Macet) menjadi kalimat ramah dan menenangkan seperti *"Halo Kak! Paketmu sedang dalam perjalanan lancar..."*.

---

## BAB 2: CARA KERJA LENGKAP SETIAP FITUR (DARI LAYAR HINGGA JEROAN SERVER)

Berikut adalah penjelasan mendalam tentang **10 Fitur Utama** aplikasi ini. Setiap fitur dijelaskan dari apa yang dirasakan pengguna, apa yang terjadi di frontend, hingga kode apa yang berputar di backend.

---

### FITUR 1: PENCARIAN & VALIDASI RESI 14 DIGIT
- **Apa yang Dilihat Pengguna?**
  Pengguna mengetikkan nomor resi (misal `10006947530309`) di kotak pencarian beranda atau halaman Lacak Kiriman, lalu menekan tombol "Lacak".
- **Apa yang Dilakukan Frontend?**
  - Berkas: [`TrackingSearchBar.jsx`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/frontend/src/components/tracking/TrackingSearchBar.jsx)
  - Sebelum mengirim ke server, frontend membersihkan input dari spasi atau huruf aneh menggunakan fungsi `cleanWaybillInput()`.
  - Frontend memeriksa apakah panjangnya sudah sesuai. Jika pengguna mengetik huruf atau kurang dari 14 digit, sistem langsung memberi peringatan di bawah kotak input tanpa membebani server.
- **Apa yang Terjadi di Backend?**
  - Berkas: [`TrackingController.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Http/Controllers/TrackingController.php) pada method `show()`
  - Backend menjalankan pengamanan lapis kedua menggunakan Regular Expression: `preg_match('/^\d{14}$/', $waybill)`.
  - Jika format salah, backend langsung menolak dengan status **HTTP 422 (Unprocessable Entity)**.
  - Jika format benar, backend mencari nomor resi tersebut di tabel `shipments`. Jika tidak ada, dikembalikan status **HTTP 404 (Not Found)**.
- **Analogi Kehidupan Nyata:**
  Seperti satpam bandara yang memeriksa tiket pesawat. Jika tiket Anda cuma robekan kertas tanpa cap resmi (bukan 14 digit), Anda langsung ditolak di pintu gerbang sebelum sempat masuk ruang tunggu.

---

### FITUR 2: ASISTEN AI "SATRIA" (NARASI REALISTIS & MENENANGKAN PIKIRAN)
- **Apa yang Dilihat Pengguna?**
  Sebuah kartu elegan dengan ikon robot Satria, menampilkan teks ramah berbahasa Indonesia:  
  *"Halo Kak! Paketmu saat ini sedang dalam perjalanan dari Jakarta Pusat menuju Surabaya. Cuaca cerah dan diproyeksikan tiba tepat waktu. Tetap tenang ya Kak!"*
- **Mengapa Fitur Ini Diciptakan? (Tujuan Bisnis)**
  Di dunia logistik, pelanggan sering cemas saat melihat kode sistem pelacakan kuno seperti *"MANIFESTED"* atau *"LINEHAUL DEPARTED HUB_JKT_01"*. Pelanggan tidak paham istilah itu dan akhirnya membanjiri call center CS untuk bertanya *"Paket saya di mana?"* (fenomena **WISMO: Where Is My Order**). Fitur ini hadir untuk menerjemahkan status sistem menjadi bahasa manusia yang santun dan menenangkan.
- **Apa yang Terjadi di Backend?**
  - Berkas: [`GeminiAIService.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Services/GeminiAIService.php)
  - Backend mengumpulkan fakta-fakta paket: kota asal, kota tujuan, nama kurir yang bertugas, koordinat GPS, kondisi cuaca, hingga kendala jalan.
  - Fakta-fakta ini dimasukkan ke dalam kerangka instruksi (**Prompt Engineering**) khusus bernama Persona "Satria Assistant".
  - Backend mengirim data ini ke server Google Gemini (`gemini-3.5-flash-lite`).
  - Google Gemini membalas dengan teks narasi pendek (150–250 karakter) tanpa istilah gudang rumit. Teks ini disimpan ke tabel database `ai_narratives`.
- **Analogi Kehidupan Nyata:**
  Seperti dokter yang ramah. Alih-alih membacakan istilah latin medis yang membuat pasien panik (*"Anda mengalami sindrom cephalea akut akibat spasme servikal"*), dokter dengan tenang berkata: *"Bapak cuma pusing kecapekan karena kurang tidur, minum air hangat dan istirahat ya."*

---

### FITUR 3: TOMBOL REFRESH / REGENERASI NARASI AI REAL-TIME
- **Apa yang Dilihat Pengguna?**
  Pengguna menekan tombol "Lacak Paket" berulang kali di halaman detail. Balon ucapan AI berputar sejenak (*loading state*), lalu teks narasinya diperbarui dengan variasi kalimat baru yang tetap akurat.
- **Apa yang Dilakukan Frontend?**
  - Berkas: [`AssistantNarrative.jsx`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/frontend/src/components/tracking/AssistantNarrative.jsx)
  - Mengirimkan permintaan HTTP `POST /api/v1/tracking/{waybill}/regenerate-ai`.
  - Menampilkan animasi loading skeleton selama beberapa ratus milidetik agar pengguna tahu AI sedang berpikir.
- **Apa yang Terjadi di Backend?**
  - Berkas: [`TrackingController.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Http/Controllers/TrackingController.php) pada method `regenerateAi()`
  - Mengambil data telemetri terkini dari armada kurir.
  - Memanggil `GeminiAIService::generateAndSaveNarrative()` untuk meracik narasi baru.
  - Menyimpan narasi baru tersebut ke tabel `ai_narratives` sebagai riwayat generasi terbaru, lalu mengirimkannya kembali ke browser dalam bentuk JSON.
- **Analogi Kehidupan Nyata:**
  Seperti Anda menekan tombol interkom di pesawat untuk bertanya ke pramugari: *"Mbak, cuaca di depan masih mendung ya?"* Pramugari mengecek radar terbaru di kokpit dan langsung memberikan jawaban segar terkini.

---

### FITUR 4: RADAR POSISI & PETA IOT TELEMETRI (GPS, CUACA, KECEPATAN)
- **Apa yang Dilihat Pengguna?**
  Peta jalan interaktif (OpenStreetMap / Leaflet) yang menampilkan posisi pin kendaraan kurir di peta, lengkap dengan kartu indikator:
  - Kecepatan armada (contoh: `78 km/jam`)
  - Status lalu lintas (contoh: `Lancar` atau `Padat`)
  - Cuaca terkini di lokasi (contoh: `Hujan Ringan` atau `Cerah`)
  - Akurasi sinyal satelit GPS (contoh: `98%`)
- **Apa yang Terjadi di Backend?**
  - Berkas: Model [`TelemetryData.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Models/TelemetryData.php)
  - Data ini berasal dari sensor IoT pada kendaraan pengiriman yang dicatat ke tabel database `telemetry_data`.
  - Kolom `latitude` dan `longitude` dikonversi menjadi angka desimal presisi (`float`) agar koordinat peta di frontend tepat menunjuk ke ruas jalan yang sebenarnya.
- **Analogi Kehidupan Nyata:**
  Seperti Anda memesan ojek online (Gojek / Grab) dan melihat ikon motor kurir bergerak di peta jalan raya menuju rumah Anda.

---

### FITUR 5: OPERATIONAL WARNING BANNER (F-04) — DETEKSI HAMBATAN RUTE
- **Apa yang Dilihat Pengguna?**
  Jika paket mengalami kendala (misalnya jalanan tergenang banjir atau pohon tumbang), sebuah pita peringatan berwarna oranye/merah muncul di bagian atas layar:
  *"Peringatan Operasional: Perjalanan paket mengalami penyesuaian waktu akibat banjir lokal di jalur Karawang. Kurir Satria sedang mengambil rute alternatif yang aman."*
- **Bagaimana Logika di Balik Layar Bekerja?**
  - Backend: Di model `Shipment.php`, terdapat fungsi khusus bernama `hasDelay()`:
    ```php
    public function hasDelay(): bool {
        return $this->telemetry !== null && 
               (filled($this->telemetry->logistics_delay_reason) || $this->telemetry->traffic_status === 'Heavy');
    }
    ```
  - Jika paket belum selesai diantar (`DELIVERED`) dan terdeteksi ada alasan kendala di telemetri atau lalu lintas bertuliskan `'Heavy'`, backend akan mengirimkan flag `has_delay: true`.
  - Frontend: Berkas [`OperationalWarningBanner.jsx`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/frontend/src/components/tracking/OperationalWarningBanner.jsx) membaca flag ini dan otomatis memunculkan kotak peringatan secara transparan dan jujur kepada pelanggan.
- **Analogi Kehidupan Nyata:**
  Seperti papan display digital LED kuning di jalan tol yang bertuliskan: *"Hati-hati, KM 52 ada perbaikan jalan, gunakan lajur kanan"*.

---

### FITUR 6: STEPPER 5 MILESTONE & CATATAN PERJALANAN DETIL (JOURNEY NOTES)
- **Apa yang Dilihat Pengguna?**
  - **Milestone Stepper**: Garis waktu 5 lingkaran status (*Pesanan Dibuat -> Siap Dijemput -> Dalam Perjalanan -> Sedang Diantar -> Terkirim*). Lingkaran yang sudah lewat berwarna hijau, yang sedang berlangsung menyala aktif, dan yang belum dilewati berwarna abu-abu.
  - **Catatan Perjalanan Detil**: Daftar riwayat checkpoint dari jam ke jam, dari gudang asal hingga tiba di tangan penerima.
- **Apa yang Terjadi di Backend?**
  - Berkas: [`ShipmentTrackingResource.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Http/Resources/ShipmentTrackingResource.php) pada method `milestones()`.
  - Backend membandingkan status paket saat ini dengan urutan 5 milestone resmi Anteraja.
  - Setiap tahap otomatis diberi label: `'completed'` (selesai), `'current'` (sedang berjalan), atau `'pending'` (menunggu giliran).
  - Backend juga mengambil data dari tabel `tracking_events`, mengurutkannya dari yang paling baru ke yang paling lama (`orderByDesc('event_at')`), sehingga riwayat paling atas selalu merupakan update terkini.
- **Analogi Kehidupan Nyata:**
  Seperti buku paspor yang dicap di setiap pos imigrasi bandara. Setiap kali Anda melewati pos pemeriksaan, tanggal dan stempel baru dibubuhkan secara berurutan.

---

### FITUR 7: KARTU PROFIL KURIR SATRIA & DIRECT WHATSAPP
- **Apa yang Dilihat Pengguna?**
  Saat paket berada pada tahap `OUT_FOR_DELIVERY`, kartu informasi kurir muncul menampilkan:
  - Foto kurir Satria
  - Nama lengkap kurir (contoh: *Eko Yulianto*)
  - Jenis armada dan plat nomor (contoh: *Honda Beat - B 4821 KDA*)
  - Tombol hijau *"Hubungi via WhatsApp"*
- **Apa yang Terjadi di Backend?**
  - Berkas: [`ShipmentTrackingResource.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Http/Resources/ShipmentTrackingResource.php) pada method `courier()`
  - Backend mengambil data kurir dari tabel `couriers` yang terhubung via tabel pivot `shipment_couriers`.
  - Backend membersihkan nomor HP kurir (menghilangkan tanda strip dan spasi) lalu menyusun tautan otomatis:  
    `https://wa.me/6281288392100`
  - Begitu tombol di layar diklik oleh pelanggan, aplikasi WhatsApp di ponsel pelanggan langsung terbuka dan siap mengirim pesan ke kurir bersangkutan.
- **Analogi Kehidupan Nyata:**
  Seperti kartu nama pengantar barang yang diselipkan di paket Anda, lengkap dengan nomor telepon yang bisa langsung ditelepon jika rumah Anda terkunci.

---

### FITUR 8: KOTAK FEEDBACK CSAT (UMPAN BALIK KEPUASAN PENGGUNA)
- **Apa yang Dilihat Pengguna?**
  Di bawah balon ucapan AI Satria, terdapat pertanyaan: *"Apakah penjelasan Satria membantu?"* disertai dua tombol jempol (Jempol Atas = Ya, Jempol Bawah = Tidak). Jika diklik, muncul ucapan *"Terima kasih atas umpan balik Anda!"*.
- **Apa yang Terjadi di Backend?**
  - Berkas: [`FeedbackController.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Http/Controllers/FeedbackController.php) pada method `store()`
  - Frontend mengirim HTTP `POST /api/v1/feedback` dengan data:
    ```json
    { "resi": "10006947530309", "membantu": true, "catatan": "Sangat jelas infonya" }
    ```
  - Backend memvalidasi bahwa nomor resi tersebut benar-benar ada di database (`exists:shipments,waybill_number`).
  - Data disimpan ke tabel `feedback`. Nilai kepuasan ini menjadi metrik analitik **CSAT (Customer Satisfaction)** untuk membuktikan bahwa AI sukses memangkas keluhan pelanggan.
- **Analogi Kehidupan Nyata:**
  Seperti tombol emoji (Puas / Tidak Puas) di loket imigrasi atau kasir supermarket setelah Anda selesai bertransaksi.

---

### FITUR 9: QUICK DEMO CHIPS (SAMPEL RESI SKENARIO PENGUJIAN)
- **Apa yang Dilihat Pengguna?**
  Di halaman pencarian, tersedia tombol-tombol chip cepat:
  `[ Normal ]` `[ Live GPS ]` `[ Kendala Rute (Warning) ]` `[ Selesai (Delivered) ]` `[ Resi Salah (Not Found) ]`
  Jika salah satu tombol diklik, nomor resi otomatis terisi di kotak input dan langsung dilacak.
- **Mengapa Fitur Ini Sangat Disukai Penguji/Dosen?**
  Dosen penguji tidak perlu repot membuka catatan atau mengetik 14 digit angka berkali-kali. Cukup 1 kali klik, sistem langsung mendemonstrasikan variasi tampilan yang berbeda secara instan.
- **Apa yang Terjadi di Backend?**
  - Berkas: [`ShipmentController.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Http/Controllers/ShipmentController.php) pada method `samples()`
  - Backend memindai seluruh data di database dan otomatis memilih **1 resi terbaik** yang mewakili masing-masing skenario:
    1. Skenario `normal`: Paket sedang bergerak normal di jalan.
    2. Skenario `live`: Paket dengan telemetri GPS aktif.
    3. Skenario `warning`: Paket yang memiliki catatan kendala cuaca/hambatan jalan.
    4. Skenario `delivered`: Paket yang sudah sampai di tujuan.
    5. Skenario `not_found`: Contoh resi yang sengaja dibuat salah untuk menguji proteksi error 404.
- **Analogi Kehidupan Nyata:**
  Seperti nampan tester makanan gratis di etalase toko kue. Anda bisa mencicipi masing-masing varian rasa kue tanpa harus membeli seluruh toples.

---

### FITUR 10: RIWAYAT PENCARIAN BERBASIS SESI (SESSION PRIVACY LIFECYCLE)
- **Apa yang Dilihat Pengguna?**
  Nomor resi yang pernah dicari akan muncul di daftar *"Pencarian Terakhir"*. Namun, begitu tab browser atau aplikasi ditutup dan dibuka kembali di perangkat lain, riwayat tersebut otomatis bersih kembali. Selain itu, jika riwayat masih kosong, tulisan *"Pencarian Terakhir"* di halaman Lacak Kiriman disembunyikan agar tampilan tetap rapi.
- **Bagaimana Cara Kerjanya?**
  - Berkas: [`useRecentSearches.js`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/frontend/src/hooks/useRecentSearches.js)
  - Data tidak disimpan di `localStorage` (yang bersifat permanen selamanya), melainkan disimpan di **`sessionStorage`**.
  - `sessionStorage` memiliki siklus hidup yang terikat dengan tab browser. Begitu tab ditutup, memori browser langsung membersihkannya secara otomatis demi menjaga privasi resi pelanggan.
- **Analogi Kehidupan Nyata:**
  Seperti kertas nomor antrean di bank. Selama Anda masih berada di dalam ruangan bank, kertas itu berlaku. Begitu Anda pulang ke rumah, nomor antrean itu sudah tidak terpakai lagi.

---

## BAB 3: BEDAH TUNTAS KODE BACKEND — FILE DEMI FILE, FUNGSI DEMI FUNGSI

Di bab ini, kita akan membongkar setiap baris kode penting di backend Laravel. Jangan khawatir, setiap fungsi memiliki penjelasan tujuannya dalam bahasa santai.

---

### 3.1 RUTE & GERBANG MASUK: `routes/api.php`
Berkas ini bertindak sebagai **Buku Tamu Resepsionis**: menentukan URL mana yang boleh dikunjungi dan siapa saja yang boleh masuk.

```php
Route::prefix('v1')->middleware('throttle:60,1')->group(function () {
    Route::get('/tracking/{waybill}', [TrackingController::class, 'show']);
    Route::post('/tracking/{waybill}/regenerate-ai', [TrackingController::class, 'regenerateAi']);
    Route::get('/shipments/samples', [ShipmentController::class, 'samples']);
    Route::get('/shipments', [ShipmentController::class, 'index']);
    Route::post('/feedback', [FeedbackController::class, 'store'])->middleware('throttle:10,1');
});
```

#### Bedah Kode:
1. **`prefix('v1')`**
   - **Artinya:** Semua URL diawali dengan `/api/v1/...`.
   - **Fungsinya:** Versioning API. Jika 2 tahun lagi aplikasi diperbarui total ke versi 2, kita tinggal membuat `/api/v2/...` tanpa merusak aplikasi versi lama yang masih dipakai pengguna.
2. **`middleware('throttle:60,1')` (Rate Limiter / Bouncer Satpam)**
   - **Artinya:** Setiap alamat IP pengguna dibatasi maksimal **60 permintaan per 1 menit**.
   - **Fungsinya:** Mencegah serangan bot peretas atau orang iseng yang menembak ribuan permintaan per detik (serangan DDoS / Brute Force) yang bisa membuat server mati.
3. **`middleware('throttle:10,1')` pada Feedback**
   - **Artinya:** Pengiriman umpan balik dibatasi maksimal **10 kali per menit**.
   - **Fungsinya:** Mencegah bot membanjiri tabel database feedback dengan klik jempol palsu.
4. **Daftar 5 Endpoint Resmi:**
   - `GET /tracking/{waybill}` &rarr; Mengambil data lengkap 1 nomor resi.
   - `POST /tracking/{waybill}/regenerate-ai` &rarr; Meminta narasi AI versi terbaru.
   - `GET /shipments/samples` &rarr; Mengambil 5 sampel resi demo.
   - `GET /shipments` &rarr; Mengambil daftar seluruh resi dengan paginasi dan fitur pencarian.
   - `POST /feedback` &rarr; Menyimpan respon penilaian pengguna.

---

### 3.2 CONTROLLER PELACAKAN: `TrackingController.php`
Berkas ini adalah **Manajer Utama Operasional Pelacakan**. Berada di `backend/app/Http/Controllers/TrackingController.php`.

Controller ini memiliki dua fungsi (method) utama:

#### A. Method `show(string $waybill, GeminiAIService $geminiService)`
Fungsi ini berjalan saat pengguna melacak paket:

```php
public function show(string $waybill, GeminiAIService $geminiService): JsonResponse
{
    $waybill = trim($waybill);

    // Langkah 1: Validasi Format Resi Resmi Anteraja
    if (! preg_match(self::WAYBILL_PATTERN, $waybill)) {
        return response()->json([
            'ok' => false,
            'code' => 'INVALID_WAYBILL',
            'message' => 'Format nomor resi tidak valid. Nomor resi Anteraja terdiri dari 14 digit angka.',
        ], 422);
    }

    // Langkah 2: Query ke Database dengan Eager Loading
    $shipment = Shipment::query()
        ->with(['trackingEvents', 'telemetry', 'latestNarrative', 'couriers'])
        ->find($waybill);

    // Langkah 3: Verifikasi Apakah Resi Ada di Database
    if (! $shipment || $shipment->shipment_status === Shipment::STATUS_NOT_FOUND) {
        return response()->json([
            'ok' => false,
            'code' => 'NOT_FOUND',
            'message' => 'Nomor resi tidak ditemukan, mohon periksa kembali input Anda.',
        ], 404);
    }

    // Langkah 4: Auto-Generate Narasi AI jika Belum Pernah Ada
    if (! $shipment->latestNarrative) {
        $geminiService->generateAndSaveNarrative($shipment);
        $shipment->load('latestNarrative');
    }

    // Langkah 5: Kembalikan Data dalam Format Terstandar
    return response()->json([
        'ok' => true,
        'data' => new ShipmentTrackingResource($shipment),
    ]);
}
```

> **Sorotan Teknis Penting untuk Dijelaskan ke Dosen:**
> - **Eager Loading (`->with([...])`)**:  
>   *Apa ini?* Alih-alih memanggil data paket dulu, lalu query lagi untuk ambil kurir, lalu query lagi untuk ambil riwayat, dan query lagi untuk ambil koordinat GPS (yang menyebabkan database mengeksekusi 4-5 query berturut-turut), Eager Loading mengambil induk dan seluruh anak relasinya dalam satu rangkaian query cepat. Ini menyembuhkan penyakit klasik database bernama **N+1 Query Problem**.
> - **Kode Status HTTP Standar Industri:**
>   - `422`: Input pengguna tidak sesuai format.
>   - `404`: Nomor resi tidak ada di catatan database.
>   - `200`: Berhasil menemukan data.

#### B. Method `regenerateAi(string $waybill, GeminiAIService $geminiService)`
Fungsi ini berjalan saat pengguna menekan tombol untuk memperbarui narasi AI secara live:

```php
public function regenerateAi(string $waybill, GeminiAIService $geminiService): JsonResponse
{
    $waybill = trim($waybill);

    // 1. Validasi regex 14 digit
    if (! preg_match(self::WAYBILL_PATTERN, $waybill)) {
        return response()->json(['ok' => false, 'code' => 'INVALID_WAYBILL'], 422);
    }

    // 2. Cari paket beserta telemetri sensor
    $shipment = Shipment::query()->with(['telemetry', 'couriers'])->find($waybill);
    if (! $shipment) {
        return response()->json(['ok' => false, 'code' => 'NOT_FOUND'], 404);
    }

    // 3. Panggil Gemini AI Service untuk meracik narasi baru
    $newNarrative = $geminiService->generateAndSaveNarrative($shipment);

    // 4. Kirim balik teks narasi baru ke antarmuka pengguna
    return response()->json([
        'ok' => true,
        'message' => 'Narasi AI berhasil diperbarui secara live.',
        'data' => [
            'title' => $newNarrative->ai_title,
            'subtitle' => $newNarrative->ai_subtitle,
            'text' => $newNarrative->narrative_text,
            'is_fallback' => (bool) $newNarrative->is_fallback,
            'provider' => $newNarrative->provider,
            'generation_status' => $newNarrative->generation_status,
            'generated_at' => $newNarrative->generated_at?->toIso8601String(),
        ],
    ]);
}
```

---

### 3.3 CONTROLLER DATA KIRIMAN & DEMO: `ShipmentController.php`
Berkas ini bertugas **Menyediakan Data Banyak Paket** untuk keperluan daftar pencarian dan tombol sampel uji coba.

#### A. Method `index(Request $request)`
- **Fungsi:** Menampilkan daftar paket dengan paginasi (15 per halaman), dilengkapi pencarian multi-kolom yang cerdas.
- **Logika Kunci:**
  ```php
  $q->where('waybill_number', 'like', "%{$search}%")
    ->orWhere('receiver_name', 'ilike', "%{$search}%")
    ->orWhere('sender_name', 'ilike', "%{$search}%");
  ```
  Artinya: Pengguna tidak hanya bisa mencari berdasarkan nomor resi, tetapi juga bisa mengetikkan nama pengirim (*"Budi"*) atau nama penerima (*"Siti"*), dan sistem akan menemukannya secara *case-insensitive* (`ilike` di PostgreSQL, tidak membedakan huruf besar/kecil).

#### B. Method `samples()`
- **Fungsi:** Mengambil tepat 1 resi perwakilan untuk setiap variasi skenario visual:
  - 1 resi untuk skenario `normal`
  - 1 resi untuk skenario `live` (ada koordinat GPS bergerak)
  - 1 resi untuk skenario `warning` (ada kendala cuaca/delay F-04)
  - 1 resi untuk skenario `delivered` (sudah selesai diantar)
  - 1 resi contoh `not_found` (untuk uji coba pesan error)
- **Fungsi untuk UI:** Data inilah yang dipakai oleh tombol-tombol chip demo di frontend agar dosen penguji bisa langsung mengklik tanpa mengetik manual.

---

### 3.4 CONTROLLER UMPAN BALIK: `FeedbackController.php`
Berkas ini bertugas sebagai **Kotak Saran Evaluasi Kepuasan Pengguna**.

#### Method `store(Request $request)`
```php
public function store(Request $request): JsonResponse
{
    $validated = $request->validate([
        'resi' => ['required', 'string', 'regex:/^\d{14}$/', 'exists:shipments,waybill_number'],
        'membantu' => ['required', 'boolean'],
        'catatan' => ['nullable', 'string', 'max:255'],
    ]);

    $feedback = Feedback::create($validated);

    return response()->json([
        'ok' => true,
        'message' => 'Terima kasih, feedback Anda tersimpan.',
        'data' => $feedback->only(['id', 'resi', 'membantu', 'catatan', 'created_at']),
    ], 201);
}
```
> **Detail Kunci:**  
> Aturan `'exists:shipments,waybill_number'` memastikan bahwa umpan balik yang masuk hanya sah jika nomor resinya benar-benar ada di tabel paket. Jika seseorang mencoba mengirim feedback untuk nomor resi fiktif, database langsung melindunginya. Status yang dikembalikan adalah **HTTP 201 (Created)** sesuai standar internasional REST API untuk data baru yang berhasil disimpan.

---

### 3.5 OTAK INTEGRASI AI & FALLBACK: `GeminiAIService.php`
Berkas ini adalah **Jantung Inovasi AI** di dalam sistem. Berada di `backend/app/Services/GeminiAIService.php`.

Berkas ini mengimplementasikan 5 fungsi vital:

#### 1. Method `__construct()`
Mempersiapkan konfigurasi saat service dinyalakan:
- Membaca `GEMINI_API_KEY` dari environment file (`.env`).
- Memilih model LLM: `gemini-3.5-flash-lite` (model Google terbaru yang terkenal sangat cepat dan hemat kuota).
- Menentukan batas waktu tunggu (**HTTP Timeout**): `5.0 detik`. Jika Google tidak membalas dalam 5 detik, sistem tidak akan menggantung (*hang*), melainkan langsung beralih ke Fallback.

#### 2. Method `generateAndSaveNarrative(Shipment $shipment)`
Memicu proses pembuatan teks, lalu langsung menyimpannya ke tabel database `ai_narratives` agar tersimpan rapi sebagai riwayat.

#### 3. Method `generateNarrativeText(Shipment $shipment)`
Fungsi utama yang menentukan apakah sistem akan menghubungi Google Gemini atau menggunakan Fallback Engine:
- **Cek 1:** Jika API Key belum diisi, langsung gunakan Rule-Based Fallback.
- **Cek 2:** Jika API Key ada, bangun prompt dan kirim permintaan HTTP POST ke Google Generative Language API.
- **Cek 3:** Jika terjadi error jaringan, kuota habis, atau timeout, blok `try-catch` menangkap error tersebut dan secara otomatis membelokkan alur ke `buildFallbackNarrative()`.

#### 4. Method `buildPrompt(...)` (Rekayasa Prompt Khusus)
Fungsi ini menyusun teks instruksi untuk Google Gemini agar kecerdasan buatan tersebut mematuhi aturan bisnis Anteraja:
```text
Anda adalah "Satria Assistant", asisten AI resmi dari ekspedisi Anteraja.
Tugas Anda: Buat narasi status pengiriman paket yang ramah, sopan, dan menenangkan hati pelanggan.

Data Pengiriman:
- Nomor Resi: 10006947530309
- Status Saat Ini: IN_TRANSIT
- Kota Pengirim: Jakarta Pusat
- Kota Penerima: Surabaya
- Nama Kurir/Armada: Satria Eko Yulianto
- Posisi Terakhir: Jl. Raya Karawang KM 52
- Kondisi Cuaca: Hujan Sedang
- Kondisi Lalu Lintas: Padat Merayap
- Kendala Operasional: Kepadatan jalur logistik akibat genangan air

Aturan Penulisan (Wajib Dipatuhi):
1. Gunakan Bahasa Indonesia santai, ramah, dan profesional (sapaan: "Halo Kak!").
2. Panjang teks harus ringkas antara 150 sampai 250 karakter (sekitar 2-3 kalimat).
3. Sebutkan kota tujuan atau posisi paket secara natural.
4. JANGAN gunakan istilah kode teknis internal logistik (misal: "HUB_JKT_01" atau "MANIFESTED").
5. Jika ada kendala, jelaskan dengan tenang dan sampaikan bahwa kurir terus berupaya mengantarkan paket dengan aman.
6. Berikan HANYA teks narasi langsung, tanpa pembuka/penutup tambahan seperti "Berikut narasinya:" atau tanda kutip.
```

#### 5. Method `buildFallbackNarrative(...)` (Sekoci Penyelamat / Graceful Degradation)
Ini adalah jawaban terbaik saat dosen bertanya: *"Bagaimana kalau pas demo internet mati atau kuota API Google habis?"*
- Sistem memiliki **Rule-Based Fallback Engine** yang sangat kaya.
- Berdasarkan status paket dan kondisi sensor, sistem memilih variasi kalimat yang sangat alami:
  - Jika `DELIVERED`: Mengambil secara acak dari kumpulan kalimat ucapan selamat tiba.
  - Jika `OUT_FOR_DELIVERY`: Mengingatkan pelanggan agar nomor HP aktif menyambut kurir.
  - Jika ada `Kendala / Macet`: Menjelaskan dengan tenang bahwa kurir sedang menyesuaikan laju kendaraan demi keselamatan barang.
  - Jika `Lancar`: Menyampaikan bahwa paket melaju aman di koridor logistik.
- Hasil fallback ini ditandai dengan `is_fallback: true`, sehingga pengguna di layar **tetap melihat teks yang indah tanpa pernah mendapati error 500**.

---

### 3.6 MODEL DATABASE (ELOQUENT ORM): FOLDER `app/Models/`
Laravel menggunakan sistem **Eloquent ORM (Object Relational Mapping)**, di mana setiap tabel di database memiliki kembaran berupa kelas objek PHP.

Berikut adalah 6 Model Inti dan perannya:

#### 1. `Shipment.php` (Model Utama Paket)
- **Primary Key Unik**: Menggunakan `waybill_number` (string 14 digit), bukan angka id 1, 2, 3 biasa (`public $incrementing = false; protected $keyType = 'string';`).
- **Relasi Database:**
  - `trackingEvents()` &rarr; `hasMany(TrackingEvent::class)`: 1 paket memiliki banyak riwayat kejadian checkpoint.
  - `telemetry()` &rarr; `hasOne(TelemetryData::class)`: 1 paket memiliki 1 rekaman sensor telemetri aktif.
  - `aiNarratives()` &rarr; `hasMany(AiNarrative::class)`: 1 paket memiliki riwayat narasi AI.
  - `latestNarrative()` &rarr; `hasOne(AiNarrative::class)->latestOfMany()`: Mengambil 1 narasi AI yang paling mutakhir.
  - `couriers()` &rarr; `belongsToMany(Courier::class, 'shipment_couriers')`: 1 paket dapat ditangani kurir penjemput dan kurir pengantar.
- **Fungsi Cerdas:**
  - `activeCourier()`: Memindai tabel pivot untuk menemukan kurir yang sedang aktif membawa paket saat ini.
  - `hasDelay()`: Otomatis mendeteksi apakah paket terhambat kemacetan atau kendala cuaca.
  - `scenario()`: Menghitung status tampilan antarmuka (`delivered`, `warning`, `live`, atau `normal`).
  - `cityFromAddress()`: Memotong string alamat (misal *"Jl. Merdeka No 5, Jakarta Pusat"* menjadi *"Jakarta Pusat"*).

#### 2. `Courier.php` (Model Profil Kurir Satria)
- Menyimpan identitas kurir: `courier_id`, nama, nomor HP WhatsApp, jenis kendaraan (Motor / Van), dan plat nomor kendaraan.
- Berelasi dengan `Shipment` via tabel pivot penugasan `shipment_couriers`.

#### 3. `ShipmentCourier.php` (Model Pivot Penugasan)
- Menghubungkan paket dengan kurir.
- Menyimpan atribut penting: `assigned_at` (kapan kurir ditugaskan) dan `is_active` (apakah kurir ini yang sedang memegang paket di jalan).

#### 4. `TrackingEvent.php` (Model Log Checkpoint)
- Menyimpan setiap peristiwa yang terjadi pada paket: waktu (`event_at`), tahapan (`milestone_stage`), nama gudang/hub transit (`facility_name`), dan judul status.

#### 5. `TelemetryData.php` (Model Sensor IoT Armada)
- Menyimpan data telemetri fisik: koordinat GPS (`latitude`, `longitude`), kecepatan kendaraan (`speed_kmh`), kondisi cuaca, kepadatan lalu lintas, dan alasan hambatan logistik.

#### 6. `AiNarrative.php` (Model Arsip Narasi AI)
- Menyimpan teks narasi yang sudah dibuat, nama provider (`gemini`), timestamp waktu pembuatan, serta penanda apakah narasi tersebut berasal dari LLM live atau Fallback Engine (`is_fallback`).

#### 7. `Feedback.php` (Model Penilaian Pengguna)
- Menyimpan feedback rating kepuasan pelanggan: nomor resi (`resi`), nilai biner kepuasan (`membantu = true/false`), dan catatan opsional pengguna.

---

### 3.7 PENYAJI DATA TERSTANDAR: FOLDER `app/Http/Resources/`
Di Laravel, **API Resource** bertindak sebagai **Koki Penata Piring (Plating)**.

Mengapa kita butuh API Resource?
Jika model database langsung di-return apa adanya ke browser, semua nama kolom mentah database akan terlihat oleh publik (kurang rapi dan rawan keamanan). Dengan API Resource, data ditransformasikan menjadi format JSON yang indah, bersih, dan konsisten.

#### A. `ShipmentTrackingResource.php`
Mengubah data model `Shipment` menjadi format JSON lengkap yang siap dimakan oleh seluruh komponen kartu di frontend:
1. **Helper `service()`**: Mengubah kode mentah `"AR-REG Reguler"` menjadi objek terstruktur:
   `{ "code": "AR-REG", "label": "Reguler", "sla": "2-3 Hari Kerja" }`
2. **Helper `courier()`**: Mengambil data kurir aktif dan otomatis merakit URL WhatsApp:
   `{ "name": "Eko Yulianto", "whatsapp_url": "https://wa.me/6281288392100", ... }`
3. **Helper `milestones()`**: Menghitung otomatis status ke-5 lingkaran milestone stepper (`'completed'`, `'current'`, atau `'pending'`).

#### B. `ShipmentSummaryResource.php`
Menyajikan versi data yang jauh lebih ringan dan ringkas. Digunakan untuk daftar pencarian resi dan chip demo, sehingga transfer data lewat internet berlangsung secepat kilat (menghemat kuota dan memori).

---

### 3.8 ARSITEK BASIS DATA: BERKAS MIGRASI DATABASE & SQL VIEW
Berkas migrasi berada di `backend/database/migrations/2026_10_08_070433_create_tracking_tables.php`.

Migrasi ini bertanggung jawab membangun 6 tabel database dan 1 virtual view:
1. **`shipments`**: Tabel utama dengan Primary Key `waybill_number` (VARCHAR 32).
2. **`couriers`**: Tabel profil kurir dengan Primary Key `courier_id`.
3. **`shipment_couriers`**: Tabel pivot penugasan dengan relasi Foreign Key `onDelete('cascade')`. Artinya, jika sebuah paket dihapus, data relasi penugasannya otomatis ikut dibersihkan tanpa meninggalkan sampah data (*orphan records*).
4. **`tracking_events`**: Memiliki Composite Index pada `['waybill_number', 'event_at']`. Indeks ini membuat pencarian riwayat paket berlangsung dalam hitungan mikrodetik meskipun terdapat jutaan data di database.
5. **`telemetry_data`**: Menyimpan koordinat GPS presisi tinggi (`decimal(10, 6)`) dan sensor lingkungan.
6. **`ai_narratives`**: Menyimpan riwayat narasi AI.
7. **`feedback`**: Menyimpan penilaian rating kepuasan.
8. **Virtual SQL VIEW `tracking_summary`**:  
   Di akhir migrasi, dibuat sebuah view komposit dengan perintah SQL:
   ```sql
   CREATE OR REPLACE VIEW tracking_summary AS
   SELECT s.waybill_number, s.shipment_status, s.service_type, 
          s.sender_name, s.receiver_name, s.estimated_delivery_date,
          t.latitude, t.longitude, t.speed_kmh, t.location_name,
          t.traffic_status, t.weather_condition, t.logistics_delay_reason,
          a.narrative_text
   FROM shipments s
   LEFT JOIN telemetry_data t ON t.waybill_number = s.waybill_number
   LEFT JOIN ai_narratives a ON a.waybill_number = s.waybill_number;
   ```
   *Keuntungan View ini:* Menggabungkan 3 tabel sekaligus secara virtual di dalam PostgreSQL, sehingga tim analitik internal bisa menarik laporan lengkap pengiriman cukup dengan 1 query sederhana `SELECT * FROM tracking_summary` tanpa perlu menulis perintah JOIN yang rumit.

---

### 3.9 PENGISI DATA AWAL OTOMATIS: `DatasetSeeder.php`
Berkas ini berada di `backend/database/seeders/DatasetSeeder.php`.

Tugasnya adalah mengimpor 70 data benchmark Anteraja dari 6 file CSV di folder `docs/` ke dalam tabel database.
- **`TRUNCATE CASCADE`**: Sebelum mengisi data, seeder mengosongkan seluruh tabel secara aman agar tidak terjadi error duplikasi Primary Key saat seeder dijalankan berulang kali.
- **`array_chunk(..., 200)`**: Data dimasukkan ke dalam database per kelompok 200 baris sekaligus (*batch insert*). Cara ini 10 kali lipat lebih cepat dan jauh lebih hemat memori RAM server daripada memasukkan data satu per satu.

---

## BAB 4: TABEL HUBUNGAN ANTARA BACKEND DAN FRONTEND (JEMBATAN SISTEM)

Berikut adalah peta korelasi lengkap yang memperlihatkan bagaimana setiap file di backend terhubung langsung dengan komponen di layar browser pengguna:

| No | Elemen / Fitur di Layar Frontend | Komponen UI React (Frontend) | Fungsi Panggilan di Frontend | Endpoint URL API Backend | Controller & Method di Backend | Tabel Database Terkait |
|:---:|:---|:---|:---|:---|:---|:---|
| **1** | Kotak Pencarian Nomor Resi | `TrackingSearchBar.jsx` | `fetchTrackingData()` di `api.js` | `GET /api/v1/tracking/{waybill}` | `TrackingController@show` | `shipments`, `tracking_events`, `telemetry_data` |
| **2** | Kartu Balon Ucapan AI Satria | `AssistantNarrative.jsx` | Menerima objek `ai_narrative` | `GET /api/v1/tracking/{waybill}` | `TrackingController@show` & `GeminiAIService` | `ai_narratives` |
| **3** | Tombol Refresh / Regenerasi AI | Tombol di `AssistantNarrative.jsx` | `regenerateAiNarrative()` | `POST /api/v1/tracking/{waybill}/regenerate-ai` | `TrackingController@regenerateAi` | `ai_narratives` |
| **4** | Peta Radar Posisi & Sensor IoT | `LivePositionCard.jsx` (Leaflet Map) | Membaca prop `telemetry` | `GET /api/v1/tracking/{waybill}` | Resource `ShipmentTrackingResource` | `telemetry_data` |
| **5** | Banner Kendala Operasional (F-04) | `OperationalWarningBanner.jsx` | Membaca prop `has_delay` & `logistics_delay_reason` | `GET /api/v1/tracking/{waybill}` | Method `Shipment::hasDelay()` | `telemetry_data` |
| **6** | Stepper 5 Garis Waktu Milestone | `MilestoneTracker.jsx` | Membaca array `milestone_stages` | `GET /api/v1/tracking/{waybill}` | Method `milestones()` di Resource | `tracking_events` |
| **7** | Catatan Perjalanan Detil | `JourneyNotes.jsx` | Membaca array `tracking_events` | `GET /api/v1/tracking/{waybill}` | Relasi `trackingEvents()` | `tracking_events` |
| **8** | Kartu Profil & WhatsApp Kurir | `CourierCard.jsx` | Membaca prop `courier` & `whatsapp_url` | `GET /api/v1/tracking/{waybill}` | Method `courier()` di Resource | `couriers`, `shipment_couriers` |
| **9** | Jempol Feedback (CSAT) | Tombol di `AssistantNarrative.jsx` | `sendFeedback()` di `api.js` | `POST /api/v1/feedback` | `FeedbackController@store` | `feedback` |
| **10** | Tombol Chip Sampel Demo | `SearchPod.jsx` | `fetchShipmentSamples()` | `GET /api/v1/shipments/samples` | `ShipmentController@samples` | `shipments`, `telemetry_data` |
| **11** | Riwayat Pencarian Terakhir | `RecentSearchList.jsx` | Hook `useRecentSearches.js` | Disimpan di `sessionStorage` browser | Lifecycle Client Session (Otomatis Reset Saat Tutup Tab) | Browser RAM / SessionStorage |

---

## BAB 5: ALUR SIKLUS HIDUP DATA (APA YANG TERJADI SAAT PENGGUNA KLIK TOMBOL?)

Jika penguji meminta Anda: *"Coba jelaskan apa yang terjadi dari awal sampai akhir saat nomor resi dicari!"*, sampaikan alur 5 detik berikut:

```
[ PENGGUNA ]
    │  1. Mengetik "10006947530309" lalu klik "Lacak Paket"
    ▼
[ FRONTEND ]
    │  2. Memeriksa format resi secara instan di browser.
    │  3. Menampilkan status indikator memuat (loading spinner).
    │  4. Mengirimkan sinyal HTTP GET ke server: /api/v1/tracking/10006947530309
    ▼
[ BACKEND (LARAVEL) ]
    │  5. Satpam Throttle memeriksa: "Apakah IP ini mengirim request wajar?" (Maks 60 req/menit).
    │  6. TrackingController memvalidasi format regex 14 digit angka.
    │  7. Menjalankan Eager Loading Query ke Database PostgreSQL untuk menarik paket,
    │     sensor GPS, kurir aktif, dan log kronologis sekaligus.
    │  8. Memeriksa keberadaan narasi AI:
    │     - Jika belum ada, hubungi Google Gemini LLM API (timeout 5 detik).
    │     - Jika Google merespons, simpan teks ramah pelanggan ke tabel ai_narratives.
    │     - Jika Google timeout / internet terputus, gunakan Rule-Based Fallback Engine.
    │  9. Menyusun seluruh data rapi ke dalam ShipmentTrackingResource.
    │  10. Mengirimkan respon data kembali ke browser berformat JSON dengan status HTTP 200 OK.
    ▼
[ FRONTEND ]
    │  11. Menerima payload JSON.
    │  12. Menyimpan data ke dalam Cache RAM dan SessionStorage.
    │  13. Merender komponen visual di layar:
    │      - Balon AI Satria berbicara ramah.
    │      - Stepper milestone menyala hijau.
    │      - Peta Leaflet memplot koordinat kurir.
    │      - Kartu kurir menampilkan tombol chat WhatsApp.
```

---

## BAB 6: KAMUS ISTILAH TEKNIS & ANALOGI SEDERHANA

Gunakan analogi-analogi ini saat menjelaskan istilah teknis kepada siapa saja:

1. **RESTful API**
   - *Penjelasan Teknis:* Standar arsitektur komunikasi data antara antarmuka web dan server menggunakan metode HTTP (GET, POST).
   - *Analogi:* Seperti pelayan restoran yang membawa catatan pesanan dari meja makan ke dapur dan membawakan makanan kembali ke meja.
2. **Eloquent ORM**
   - *Penjelasan Teknis:* Fitur Laravel yang memetakan tabel database menjadi objek kode pemrograman.
   - *Analogi:* Seperti penerjemah bahasa. Anda tidak perlu repot berbicara bahasa mesin SQL yang kaku (`SELECT * FROM shipments WHERE...`), cukup panggil bahasa manusia PHP (`Shipment::find($waybill)`).
3. **Eager Loading & N+1 Problem**
   - *Penjelasan Teknis:* Teknik mengambil data relasi secara massal di awal untuk menghindari query berulang ke database.
   - *Analogi:* Anda menyuruh anak Anda ke minimarket membeli susu, roti, dan telur sekaligus dalam 1 kali jalan (*Eager Loading*). Bukan menyuruhnya jalan ke minimarket beli susu, pulang ke rumah, lalu jalan lagi ke minimarket beli roti, lalu jalan lagi beli telur (*N+1 Problem yang boros tenaga*).
4. **Rate Limiting (Throttle)**
   - *Penjelasan Teknis:* Pembatasan jumlah request API per alamat IP per menit.
   - *Analogi:* Satpam di pintu wahana Dufan yang memberi jeda antrean agar pengunjung masuk dengan tertib dan wahana tidak kelebihan beban.
5. **Graceful Degradation / Fallback Engine**
   - *Penjelasan Teknis:* Kemampuan sistem untuk tetap beroperasi dengan fitur alternatif saat layanan pihak ketiga (Google AI) mengalami kendala.
   - *Analogi:* Seperti gedung perkantoran mewah yang memiliki genset diesel darurat. Jika aliran listrik PLN utama padam, genset menyala otomatis sehingga lampu gedung tidak pernah padam.
6. **Stale-While-Revalidate**
   - *Penjelasan Teknis:* Strategi performa frontend di mana data lama di memori langsung ditampilkan dalam 0 milidetik, sementara data terbaru disinkronkan di latar belakang tanpa membuat pengguna menunggu.
   - *Analogi:* Anda membaca koran edisi kemarin pagi sambil menunggu loper koran mengantarkan koran edisi hari ini ke depan pintu rumah Anda.
7. **Session Storage**
   - *Penjelasan Teknis:* Penyimpanan sementara di tab browser yang akan terhapus otomatis saat tab ditutup.
   - *Analogi:* Catatan kecil di papan tulis kapur. Selama jam pelajaran berlangsung catatan itu ada, begitu kelas usai papan tulis dihapus bersih untuk pelajaran berikutnya.

---

## BAB 7: CHEATSHEET PRESENTASI & UJIAN (KISI-KISI TANYA JAWAB DOSEN)

Hafalkan atau pahami 8 poin pertanyaan ini. Ini adalah pertanyaan yang paling sering diajukan oleh dosen penguji:

#### Pertanyaan 1: "Mengapa memilih Laravel untuk bagian backend proyek ini?"
> **Jawaban Anda:**  
> *"Kami memilih Laravel 11 karena memiliki arsitektur MVC yang sangat matang, fitur keamanan bawaan seperti Rate Limiting Throttle untuk mencegah serangan bot DDoS, Eloquent ORM yang memudahkan relasi data secara aman dari SQL Injection, serta ekosistem HTTP Client yang sangat stabil untuk berkomunikasi dengan Google Gemini API."*

#### Pertanyaan 2: "Mengapa validasi 14 digit resi dilakukan di dua tempat (Frontend dan Backend)?"
> **Jawaban Anda:**  
> *"Ini adalah penerapan prinsip keamanan **Defense in Depth** (Pertahanan Berlapis). Validasi di frontend bertujuan memberikan kenyamanan pengalaman pengguna (*UX*) agar mendapat respon instan tanpa menunggu loading server. Namun, validasi frontend bisa ditembus jika seseorang menyerang API langsung menggunakan Postman atau skrip cURL. Oleh karena itu, backend **wajib** melakukan validasi kedua dengan regex `^\d{14}$` sebelum data diproses ke database."*

#### Pertanyaan 3: "Bagaimana jika koneksi ke Google Gemini AI terputus atau kuota API habis saat demo?"
> **Jawaban Anda:**  
> *"Sistem kami telah dilengkapi **Graceful Degradation** di file `GeminiAIService.php`. Jika koneksi ke Google Gemini timeout (>5 detik) atau API key tidak tersedia, blok `try-catch` secara otomatis mengalihkan alur ke **Rule-Based Fallback Engine**. Fallback ini akan meracik narasi kontekstual berdasarkan status paket dan sensor cuaca. Aplikasi dijamin **tidak akan pernah crash (Zero Error 500)** dan pengguna tetap melihat narasi status yang ramah."*

#### Pertanyaan 4: "Apa keuntungan Eager Loading `->with([...])` yang Anda gunakan?"
> **Jawaban Anda:**  
> *"Eager Loading digunakan untuk memecahkan **N+1 Query Problem**. Tanpa Eager Loading, saat menampilkan 1 paket beserta riwayat event, kurir, dan sensornya, Laravel akan menjalankan 4 hingga 5 kali query SQL terpisah ke database. Dengan `->with(['trackingEvents', 'telemetry', 'latestNarrative', 'couriers'])`, Laravel menggabungkan seluruh pemanggilan relasi tersebut dalam rangkaian query yang sangat efisien di awal, sehingga menghemat beban kerja server database secara signifikan."*

#### Pertanyaan 5: "Bagaimana sistem menentukan apakah paket mengalami keterlambatan (Operational Warning F-04)?"
> **Jawaban Anda:**  
> *"Sistem mengevaluasinya melalui method `hasDelay()` pada model `Shipment.php`. Method ini membaca data sensor di tabel `telemetry_data`. Jika kolom `logistics_delay_reason` terisi (misalnya banjir atau jalan amblas) atau kondisi lalu lintas bernilai `'Heavy'`, backend akan mengirimkan flag `has_delay = true`. Di frontend, komponen `OperationalWarningBanner.jsx` otomatis memunculkan pita peringatan oranye untuk memberi tahu pengguna secara transparan."*

#### Pertanyaan 6: "Di mana data koordinat posisi kurir disimpan dan bagaimana peta menampilkannya?"
> **Jawaban Anda:**  
> *"Data koordinat disimpan di tabel `telemetry_data` pada kolom `latitude` dan `longitude`. Di model Laravel, kolom ini di-cast menjadi tipe data desimal float presisi tinggi. Nilai ini kemudian dikirim melalui API Resource ke frontend, di mana pustaka peta Leaflet menggunakannya untuk menempatkan pin marker kendaraan kurir tepat di atas peta jalan OpenStreetMap."*

#### Pertanyaan 7: "Mengapa riwayat pencarian terakhir menggunakan `sessionStorage` bukan `localStorage`?"
> **Jawaban Anda:**  
> *"Karena pertimbangan privasi data pelanggan (*Data Privacy*). Jika menggunakan `localStorage`, nomor resi akan tersimpan selamanya di komputer tersebut, sehingga jika pengguna memakai komputer publik/kantor, orang lain bisa melihat riwayat resinya. Dengan `sessionStorage`, riwayat hanya aktif selama tab browser terbuka dan akan otomatis terhapus bersih begitu pengguna menutup browser."*

#### Pertanyaan 8: "Apa fungsi Database View `tracking_summary` yang Anda buat di migrasi?"
> **Jawaban Anda:**  
> *"Database View `tracking_summary` berfungsi sebagai tabel virtual komposit yang menggabungkan data paket, telemetri sensor, dan narasi AI dalam satu tampilan. Ini mempermudah tim logistik atau modul dashboard analitik untuk menarik laporan komprehensif pengiriman cukup dengan perintah `SELECT * FROM tracking_summary` tanpa perlu menulis query JOIN berulang kali di banyak tempat."*

---

💡 **Saran Terakhir:**  
Simpan dokumen ini di ponsel atau laptop Anda. Sebelum giliran presentasi dimulai, buka kembali **Bab 1 (Analogi Restoran)** dan **Bab 7 (Cheatsheet Pertanyaan Dosen)** untuk pemanasan pikiran. Anda pasti sukses mendemokannya! 🚀
