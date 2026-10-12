# 📘 PANDUAN LENGKAP PENJELASAN BACKEND & KORELASI FRONTEND
### Proyek Capstone: Anteraja Smart AI Tracking

> Dokumen ini dirancang khusus dengan bahasa yang ramah, analogi sederhana, dan terstruktur agar Anda dapat **memahami alur kode backend secara menyeluruh** serta **percaya diri saat mempresentasikan dan mendemokannya** di hadapan dosen/penguji.

---

## 📑 DAFTAR ISI
1. [Gambaran Besar Arsitektur (Big Picture)](#1-gambaran-besar-arsitektur-big-picture)
2. [Peta Struktur File Backend](#2-peta-struktur-file-backend)
3. [Bedah Kode Backend File demi File](#3-bedah-kode-backend-file-demi-file)
   - [3.1 Pintu Masuk Rute: `routes/api.php`](#31-pintu-masuk-rute-routesapiphp)
   - [3.2 Controller Pelacakan & AI: `TrackingController.php`](#32-controller-pelacakan--ai-trackingcontrollerphp)
   - [3.3 Controller Data Kiriman & Demo: `ShipmentController.php`](#33-controller-data-kiriman--demo-shipmentcontrollerphp)
   - [3.4 Controller Umpan Balik: `FeedbackController.php`](#34-controller-umpan-balik-feedbackcontrollerphp)
   - [3.5 Otak Integrasi AI & Fallback: `GeminiAIService.php`](#35-otak-integrasi-ai--fallback-geminiaiservicephp)
   - [3.6 Model Database (Eloquent ORM): `app/Models/`](#36-model-database-eloquent-orm-appmodels)
   - [3.7 Format Response API: `app/Http/Resources/`](#37-format-response-api-apphttpresources)
   - [3.8 Skema Database & Migrasi: `database/migrations/`](#38-skema-database--migrasi-databasemigrations)
4. [Jembatan Hubungan: Bagaimana Backend & Frontend Saling Terhubung?](#4-jembatan-hubungan-bagaimana-backend--frontend-saling-terhubung)
5. [Alur Eksekusi Data Saat Pengguna Melacak Paket (Step-by-Step Flow)](#5-alur-eksekusi-data-saat-pengguna-melacak-paket-step-by-step-flow)
6. [Kisi-Kisi Tanya-Jawab Demo Penguji (Cheatsheet Ujian)](#6-kisi-kisi-tanya-jawab-demo-penguji-cheatsheet-ujian)

---

## 1. Gambaran Besar Arsitektur (Big Picture)

Aplikasi ini menggunakan arsitektur **Decoupled Client-Server (RESTful API)**:

```
[ Pengguna / Browser Mobile & Desktop ]
                 │
                 ▼
[ FRONTEND: React 19 + Vite + Tailwind CSS ]
  - Menampilkan UI interaktif, peta Leaflet, kartu status, & tombol
                 │
                 │ HTTP Request (JSON via fetch)
                 ▼
[ BACKEND: Laravel 11 (PHP 8.2+) ]
  ├── Routing & Security Throttle (Mencegah spam request)
  ├── Controllers & Services (Otak bisnis & pengolahan logika)
  ├── Integrasi AI External: Google Gemini LLM API (gemini-3.5-flash-lite)
  └── Eloquent ORM & Query Builder
                 │
                 ▼
[ DATABASE: PostgreSQL (atau Supabase Cloud) ]
  - Tabel: shipments, couriers, tracking_events, telemetry_data, ai_narratives, feedback
```

### Analogi Sederhana:
- **Frontend** adalah **Buku Menu dan Meja Makan yang Indah**: apa yang dilihat, disentuh, dan dinikmati oleh pelanggan.
- **Backend (Laravel)** adalah **Dapur dan Koki**: menerima pesanan pelanggan, memeriksa bahan di kulkas (**Database**), meracik bumbu khusus (**Google Gemini AI**), lalu menyajikan hasilnya dalam piring bersih berstandar rapi (**JSON Response**).

---

## 2. Peta Struktur File Backend

Seluruh kode backend berada di dalam folder `backend/`:

| Path File / Folder | Peran & Tanggung Jawab |
|:---|:---|
| [`routes/api.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/routes/api.php) | **Buku Resepsionis:** Mendefinisikan alamat URL endpoint API dan aturan keamanan *rate limiting*. |
| [`app/Http/Controllers/TrackingController.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Http/Controllers/TrackingController.php) | **Manajer Pelacakan:** Memvalidasi resi 14 digit, memanggil data paket, dan memicu generate narasi AI. |
| [`app/Http/Controllers/ShipmentController.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Http/Controllers/ShipmentController.php) | **Manajer Kiriman:** Menyediakan daftar resi dengan filter/paginasi dan 1 sampel per skenario demo. |
| [`app/Http/Controllers/FeedbackController.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Http/Controllers/FeedbackController.php) | **Kotak Saran:** Menerima penilaian pengguna (*Ya/Tidak*) atas kejelasan informasi AI. |
| [`app/Services/GeminiAIService.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Services/GeminiAIService.php) | **Mesin AI Satria:** Meracik prompt ke Google Gemini API, menjaga batas 150-250 karakter, dan menyediakan *Rule-Based Fallback* jika API mati/offline. |
| `app/Models/` | **Representasi Objek Database (Eloquent):** Menghubungkan tabel database ke bahasa pemrograman PHP OOP. |
| `app/Http/Resources/` | **Penyaring Format Data (Transformer):** Memformat data mentah database menjadi JSON terstruktur dan ramah dibaca frontend. |
| `database/migrations/` | **Arsitek Tabel:** Script otomatis yang membuat tabel, relasi foreign key, indeks, dan SQL VIEW di PostgreSQL. |
| `database/seeders/` | **Pengisi Data Awal:** Mengisi 70 data resi, kurir, event pelacakan, dan data sensor GPS dari berkas CSV. |

---

## 3. Bedah Kode Backend File demi File

### 3.1 Pintu Masuk Rute: `routes/api.php`
Berkas ini adalah pintu gerbang pertama setiap kali frontend mengirimkan permintaan ke backend:

```php
Route::prefix('v1')->middleware('throttle:60,1')->group(function () {
    Route::get('/tracking/{waybill}', [TrackingController::class, 'show']);
    Route::post('/tracking/{waybill}/regenerate-ai', [TrackingController::class, 'regenerateAi']);
    Route::get('/shipments/samples', [ShipmentController::class, 'samples']);
    Route::get('/shipments', [ShipmentController::class, 'index']);
    Route::post('/feedback', [FeedbackController::class, 'store'])->middleware('throttle:10,1');
});
```

#### Apa fungsi kode di atas?
1. **`prefix('v1')`**: Menandai versi API (`/api/v1/...`). Jika di masa depan ada update besar, kita bisa membuat `/api/v2/...` tanpa merusak frontend versi lama.
2. **`throttle:60,1` (Rate Limiting)**: Setiap IP address dibatasi maksimal **60 request per menit**. Tujuannya mencegah bot melakukan *spamming* atau serangan *Denial of Service (DoS)* yang bisa membuat server *down*.
3. **`throttle:10,1` pada feedback**: Membatasi pengiriman umpan balik maksimal **10 kali per menit** agar database tidak dibanjiri spam klik tombol feedback.

---

### 3.2 Controller Pelacakan & AI: `TrackingController.php`

Controller ini mengurus dua tugas penting:

#### A. Method `show($waybill)` — Mengambil Data Lengkap Resi
```php
public function show(string $waybill, GeminiAIService $geminiService): JsonResponse
{
    // 1. Validasi format resi resmi Anteraja (WAJIB 14 digit angka)
    if (! preg_match('/^\d{14}$/', $waybill)) {
        return response()->json([
            'ok' => false,
            'code' => 'INVALID_WAYBILL',
            'message' => 'Format nomor resi tidak valid. Nomor resi Anteraja terdiri dari 14 digit angka.'
        ], 422);
    }

    // 2. Query ke Database dengan Eager Loading
    $shipment = Shipment::query()
        ->with(['trackingEvents', 'telemetry', 'latestNarrative', 'couriers'])
        ->find($waybill);

    // 3. Cek apakah resi ditemukan di database
    if (! $shipment || $shipment->shipment_status === 'NOT_FOUND') {
        return response()->json([
            'ok' => false,
            'code' => 'NOT_FOUND',
            'message' => 'Nomor resi tidak ditemukan, mohon periksa kembali input Anda.'
        ], 404);
    }

    // 4. Otomatis generate AI jika resi ini belum pernah punya narasi
    if (! $shipment->latestNarrative) {
        $geminiService->generateAndSaveNarrative($shipment);
        $shipment->load('latestNarrative');
    }

    // 5. Kembalikan data dalam format JSON standar
    return response()->json([
        'ok' => true,
        'data' => new ShipmentTrackingResource($shipment),
    ]);
}
```

> **Konsep Kunci yang Perlu Dijelaskan ke Penguji:**
> - **Eager Loading (`->with(...)`)**: Daripada menjalankan 5 query terpisah (ambil paket, lalu ambil riwayat, lalu ambil sensor GPS, lalu ambil kurir), kita memuat semuanya sekaligus dalam 1 rangkaian query efisien. Ini memecahkan masalah klasik performa database bernama **N+1 Query Problem**.
> - **HTTP Status Code Sesuai Standar**: Menggunakan `422` (Input salah), `404` (Tidak ditemukan), dan `200` (Sukses).

#### B. Method `regenerateAi($waybill)` — Refresh Narasi Live Gemini
Dipanggil saat pengguna menekan tombol "Lacak Paket" berulang kali:
- Mengambil data telemetri real-time terbaru paket.
- Mengontak Google Gemini via `GeminiAIService`.
- Menyimpan teks baru ke tabel `ai_narratives`.
- Mengembalikan teks narasi baru ke antarmuka pengguna dalam hitungan milidetik.

---

### 3.3 Controller Data Kiriman & Demo: `ShipmentController.php`

File ini dibuat untuk mempermudah operasional dan pengujian sistem:

1. **`index(Request $request)`**:
   - Menampilkan daftar resi berhalaman (*pagination* default 15 data per halaman).
   - Memiliki fitur pencarian multi-kolom: mencari nomor resi, nama pengirim, atau nama penerima dengan kata kunci case-insensitive (`ilike`).
2. **`samples()`**:
   - Mengambil tepat **1 contoh resi terbaik** untuk tiap variasi:
     - Skenario `normal` (Perjalanan lancar)
     - Skenario `live` (Sedang ada telemetri GPS aktif bergerak)
     - Skenario `warning` (Sedang ada kendala cuaca/banjir/kemacetan)
     - Skenario `delivered` (Sudah selesai diantar)
     - Contoh resi `not_found` (Untuk simulasi salah input)
   - Digunakan oleh tombol *chips demo* di antarmuka frontend agar penguji tidak perlu repot mengetik resi panjang secara manual.

---

### 3.4 Controller Umpan Balik: `FeedbackController.php`

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

> **Tujuan Bisnis Logistik:**
> Data ini berguna untuk mengukur **CSAT (Customer Satisfaction)** terhadap asisten AI. Jika pengguna mengklik "Ya" (membantu), berarti narasi Satria Assistant sukses menjelaskan status paket tanpa membuat pelanggan bingung, sehingga menurunkan beban tiket komplain CS (*WISMO — Where Is My Order*).

---

### 3.5 Otak Integrasi AI & Fallback: `GeminiAIService.php`

Ini adalah file paling canggih di backend. Mengintegrasikan Large Language Model (LLM) dengan data sensor logistik.

#### A. Prompt Engineering Berbasis Aturan Anteraja
Service ini menyusun prompt secara otomatis dengan menggabungkan:
- Nama Kurir Satria yang bertugas.
- Kota Asal dan Kota Tujuan.
- Tahap pengiriman (*Pesanan Dibuat, Sedang Diproses, Perjalanan, Pengantaran, Tiba*).
- Data Sensor IoT: Nama jalan terkini, kecepatan kendaraan (km/jam), status lalu lintas, cuaca, dan kendala rute.

#### B. Instruksi Ketat (Strict Guidelines) ke Gemini:
1. **Persona CS Satria**: Ramah, santun, solutif, menenangkan pelanggan.
2. **Anti Jargon Teknis**: Dilarang menggunakan istilah gudang rumit seperti *"MANIFESTED"*, *"LINEHAUL DEPARTED"*, atau kode staging *"HUB_JKT_01"*.
3. **Batas Panjang Kalimat**: Wajib padat dan jelas (150 – 250 karakter) agar pas di layar ponsel.

#### C. Mekanisme Penyelamat: Rule-Based Fallback Engine (Graceful Degradation)
Pertanyaan umum penguji: *"Bagaimana kalau koneksi internet ke Google Gemini lambat, kuota API habis, atau API key belum dipasang?"*
- Sistem **TIDAK AKAN CRASH / ERROR 500**!
- Di dalam kode terdapat blok `try-catch` dengan timeout ketat (5 detik):
```php
try {
    $response = Http::timeout($this->timeout)->post($url, $payload);
    // jika sukses, ambil teks dari Gemini
} catch (Throwable $e) {
    Log::warning("Gemini AI gagal, beralih ke Fallback Engine: " . $e->getMessage());
    return $this->buildFallbackNarrative($shipment, $sellerCity, $customerCity);
}
```
- Jika ada kendala, `buildFallbackNarrative()` otomatis menyusun teks kontekstual pintar berbasis templat logistik dan menandai kolom `is_fallback = true`. Layar pengguna tetap menampilkan pesan ramah tanpa gangguan!

---

### 3.6 Model Database (Eloquent ORM): `app/Models/`

Laravel menggunakan sistem **Eloquent ORM**, di mana setiap tabel direpresentasikan menjadi sebuah kelas objek PHP:

1. **`Shipment.php`**:
   - Model utama paket pengiriman.
   - Primary Key: `waybill_number` (string 14 digit, bukan integer auto-increment).
   - Relasi:
     - `hasMany(TrackingEvent::class)`: 1 paket memiliki banyak catatan riwayat perjalanan.
     - `hasOne(TelemetryData::class)`: 1 paket memiliki 1 status data sensor IoT aktif.
     - `hasMany(AiNarrative::class)`: 1 paket bisa memiliki riwayat beberapa narasi AI.
     - `belongsToMany(Courier::class, 'shipment_couriers')`: Relasi many-to-many ke kurir via tabel pivot.
2. **`Courier.php`**: Menyimpan identitas kurir (nama, nomor telepon, foto, jenis armada, plat nomor).
3. **`TrackingEvent.php`**: Menyimpan titik checkpoint perjalanan (*stage*, waktu kejadian, nama fasilitas hub).
4. **`TelemetryData.php`**: Menyimpan koordinat GPS (latitude, longitude), kecepatan km/jam, kondisi cuaca, dan alasan keterlambatan.
5. **`AiNarrative.php`**: Menyimpan teks narasi yang telah di-generate, timestamp, dan provider (`gemini`).
6. **`Feedback.php`**: Menyimpan pilihan penilaian `membantu` (boolean) per nomor resi.

---

### 3.7 Format Response API: `app/Http/Resources/`

- **`ShipmentTrackingResource.php`**:
  Berfungsi sebagai *transformer*. Tanpa file ini, data mentah database dengan nama kolom database akan langsung terlempar ke frontend.
  Dengan Resource, backend membungkus data menjadi struktur rapi berstandar:
  ```json
  {
    "waybill_number": "10006947530309",
    "order_status": "OUT_FOR_DELIVERY",
    "shipment": { "service_type": "AR-REG", "sender": {...}, "receiver": {...} },
    "courier": { "name": "Eko Yulianto", "whatsapp_url": "https://wa.me/..." },
    "telemetry": { "latitude": -6.368, "longitude": 107.289, "speed_kmh": 78 },
    "ai_narrative": { "text": "Halo Kak! Paketmu sedang diantar oleh kurir Satria...", "is_fallback": false }
  }
  ```

---

### 3.8 Skema Database & Migrasi: `database/migrations/`

Didefinisikan dalam berkas [`2026_10_08_070433_create_tracking_tables.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/database/migrations/2026_10_08_070433_create_tracking_tables.php):

```
┌─────────────────────────────────┐
│           shipments             │
│─────────────────────────────────│
│ PK: waybill_number (VARCHAR 32) │◄──────┐
│     service_type                │       │
│     sender_name & address       │       │ 1-to-N
│     receiver_name & address     │       │
│     weight_kg, insurance_status │       ├─── tracking_events
│     shipment_status             │       │    (event_code, milestone_stage, event_at)
│     estimated_delivery_date     │       │
└────────────────┬────────────────┘       ├─── telemetry_data
                 │                        │    (lat, lon, speed_kmh, delay_reason)
                 │ 1-to-N (Pivot)         │
                 ▼                        ├─── ai_narratives
┌─────────────────────────────────┐       │    (narrative_text, provider, is_fallback)
│       shipment_couriers         │       │
│─────────────────────────────────│       └─── feedback
│ PK: (waybill_number, courier_id)│            (resi, membantu, catatan)
│     assigned_at, is_active      │
└────────────────┬────────────────┘
                 │ N-to-1
                 ▼
┌─────────────────────────────────┐
│            couriers             │
│─────────────────────────────────│
│ PK: courier_id                  │
│     courier_name, phone, plate  │
└─────────────────────────────────┘
```

- **Database VIEW `tracking_summary`**: Di akhir migrasi, dibuat view SQL komposit yang menggabungkan tabel `shipments`, `telemetry_data`, dan `ai_narratives` agar laporan rekap pengiriman dapat ditarik dengan 1 query cepat tanpa join berulang.

---

## 4. Jembatan Hubungan: Bagaimana Backend & Frontend Saling Terhubung?

| Fitur di Layar Frontend | Komponen Frontend Terkait | Endpoint Backend yang Dipanggil | File Backend yang Mengolah |
|:---|:---|:---|:---|
| **Pencarian Nomor Resi** | [`TrackingSearchBar.jsx`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/frontend/src/components/tracking/TrackingSearchBar.jsx) & [`api.js`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/frontend/src/lib/api.js) | `GET /api/v1/tracking/{waybill}` | [`TrackingController@show`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Http/Controllers/TrackingController.php) |
| **Refresh Pesan AI Gemini** | Tombol "Lacak Paket" & [`AssistantNarrative.jsx`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/frontend/src/components/tracking/AssistantNarrative.jsx) | `POST /api/v1/tracking/{waybill}/regenerate-ai` | [`TrackingController@regenerateAi`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Http/Controllers/TrackingController.php) & [`GeminiAIService.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Services/GeminiAIService.php) |
| **Pemberian Umpan Balik (Ya/Tidak)** | Tombol jempol di [`AssistantNarrative.jsx`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/frontend/src/components/tracking/AssistantNarrative.jsx) | `POST /api/v1/feedback` | [`FeedbackController@store`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Http/Controllers/FeedbackController.php) |
| **Chip Sampel Resi Cepat** | [`SearchPod.jsx`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/frontend/src/components/tracking/lab/SearchPod.jsx) | `GET /api/v1/shipments/samples` | [`ShipmentController@samples`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Http/Controllers/ShipmentController.php) |
| **Peta Radar & Titik GPS** | [`LivePositionCard.jsx`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/frontend/src/components/tracking/LivePositionCard.jsx) | Mengambil field `telemetry` dari endpoint tracking | Model [`TelemetryData.php`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/backend/app/Models/TelemetryData.php) |
| **Peringatan Operasional (F-04)** | [`OperationalWarningBanner.jsx`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/frontend/src/components/tracking/OperationalWarningBanner.jsx) | Membaca flag `has_delay` dan `logistics_delay_reason` | Kolom `has_delay` di tabel `telemetry_data` |

---

## 5. Alur Eksekusi Data Saat Pengguna Melacak Paket (Step-by-Step Flow)

Jika penguji meminta Anda: *"Coba jelaskan siklus perjalanannya saat tombol 'Lacak Paket' diklik!"*, gunakan penjelasan 5 langkah ini:

1. **Langkah 1 (Validasi di Frontend):**
   Pengguna memasukkan 14 digit resi (contoh: `10006947530309`). Frontend memvalidasi agar tidak ada huruf dan tidak lebih dari 14 digit.
2. **Langkah 2 (Pengiriman HTTP Request):**
   Frontend melalui `fetchTrackingData()` mengirimkan permintaan `GET /api/v1/tracking/10006947530309` ke Backend Laravel.
3. **Langkah 3 (Pemeriksaan Keamanan & Database di Backend):**
   - Middleware `throttle:60,1` memastikan user ini bukan bot spam.
   - `TrackingController` memeriksa format regex 14 digit numerik.
   - Laravel mengeksekusi query database untuk mengambil data paket, event riwayat, kurir bertugas, dan koordinat GPS.
4. **Langkah 4 (Pemrosesan Asisten AI):**
   Jika paket belum memiliki narasi AI, backend memanggil `GeminiAIService`. Service ini menyusun data sensor (kecepatan, cuaca, tujuan) ke dalam prompt LLM, lalu menghubungi Google Gemini API untuk mendapatkan pesan ramah pelanggan bergaya Satria.
5. **Langkah 5 (Respon JSON ke Antarmuka):**
   Backend memformat data menjadi JSON melalui `ShipmentTrackingResource` dan mengirimkannya kembali ke browser dengan status `HTTP 200 OK`. Frontend menerima data tersebut lalu merender banner status, stepper progres, kartu kurir, dan balon dialog Satria Assistant.

---

## 6. Kisi-Kisi Tanya-Jawab Demo Penguji (Cheatsheet Ujian)

Berikut adalah pertanyaan yang paling sering ditanyakan oleh penguji/dosen beserta jawaban cerdas yang bisa langsung Anda sampaikan:

#### Q1: "Mengapa Anda memilih Laravel untuk bagian backend proyek ini?"
> **Jawaban:**
> *"Laravel menyediakan arsitektur MVC yang sangat matang, keamanan bawaan seperti Rate Limiting (Throttle) untuk mencegah brute-force/DDoS, Eloquent ORM yang memudahkan relasi database tanpa query SQL manual yang rentan SQL Injection, serta integrasi HTTP Client yang sangat mudah untuk berkomunikasi dengan Google Gemini API."*

#### Q2: "Mengapa validasi 14 digit resi dilakukan di Frontend dan juga di Backend?"
> **Jawaban:**
> *"Ini adalah prinsip keamanan **Defense in Depth**. Validasi di frontend berfungsi untuk kenyamanan pengguna (*user experience*) agar mendapat umpan balik instan. Namun, frontend bisa dilewati (*bypass*) jika seseorang menembak API langsung menggunakan Postman atau script cURL. Oleh karena itu, backend **wajib** memvalidasi ulang dengan regex `^\d{14}$` sebelum query masuk ke database."*

#### Q3: "Bagaimana jika Google Gemini API down atau kuota API habis saat demo?"
> **Jawaban:**
> *"Sistem kami sudah menerapkan arsitektur **Graceful Degradation** di berkas `GeminiAIService.php`. Jika koneksi ke Google Gemini timeout (>5 detik) atau API key tidak valid, sistem secara otomatis beralih ke **Rule-Based Fallback Engine** yang menyusun kalimat narasi kontekstual berdasarkan data sensor dan status paket. Aplikasi tidak akan pernah crash (Error 500), dan pengguna tetap mendapatkan informasi yang jelas."*

#### Q4: "Apa itu Eager Loading yang Anda gunakan di `TrackingController`?"
> **Jawaban:**
> *"Eager Loading menggunakan method `->with(['trackingEvents', 'telemetry', 'latestNarrative', 'couriers'])`. Fungsinya adalah mengambil tabel paket dan seluruh relasi anaknya dalam satu batch query di awal. Tanpa eager loading, Laravel akan menjalankan query baru setiap kali mengakses data anak, yang menimbulkan masalah **N+1 Query Problem** dan memperlambat database secara signifikan."*

#### Q5: "Di mana data koordinat rute kurir dan hambatan jalan disimpan?"
> **Jawaban:**
> *"Disimpan di tabel `telemetry_data`. Tabel ini merepresentasikan data sensor IoT armada pengiriman, mencakup latitude, longitude, kecepatan kendaraan (speed_kmh), status kemacetan, kondisi cuaca, hingga alasan hambatan (logistics_delay_reason) yang menjadi pemicu munculnya Operational Warning Banner (F-04) di antarmuka pengguna."*

---

💡 *Simpan dan buka dokumen ini sebagai panduan saat sesi presentasi capstone Anda berlangsung!*
