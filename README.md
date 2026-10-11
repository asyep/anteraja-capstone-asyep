# Anteraja Smart AI Shipment Tracking

Platform pelacakan pengiriman cerdas (*Smart Tracking*) berbasis AI telemetry, peta interaktif real-time, narasi prediktif pengiriman, dan REST API berkinerja tinggi untuk Anteraja Capstone Project.

Branch ini (`release/smart-tracking-v1`) merupakan rilis bersih (*clean release*) yang khusus memuat seluruh komponen aktif yang digunakan langsung dalam sistem Smart Tracking: **Frontend**, **Backend**, **Database**, dan **Dokumentasi Terkait**.

---

## Arsitektur & Struktur Proyek

```text
.
├── frontend/               # Single Page Application (React 19 + Vite + Tailwind CSS + Leaflet)
│   ├── src/
│   │   ├── components/     # Komponen UI pelacakan (Map, Stepper, Card, Feedback, Modal)
│   │   ├── context/        # State management pelacakan & cache
│   │   ├── pages/          # Halaman rute (Lacak, In-Transit, Out-for-Delivery, Delivered, dll)
│   │   ├── services/       # Integrasi API client & cache layer
│   │   └── data/           # Dataset lokal & metadata fallback
│   ├── public/             # Asset publik, ikon SVG, dan ilustrasi status
│   └── package.json
│
├── backend/                # REST API Service (Laravel 11 + SQLite / MySQL)
│   ├── app/                # Controllers, Models, Services (Tracking, Feedback, Telemetry)
│   ├── database/           # Migrasi tabel & database seeders
│   ├── routes/             # Definisi endpoint API (`api.php`)
│   └── composer.json
│
├── database/               # Berkas skema SQL & master dataset
│   ├── schema.sql          # DDL struktur tabel relasional
│   ├── dataset.csv         # Dataset master pengiriman dan riwayat resi
│   ├── seed_dataset.sql    # DML data awal pengujian
│   └── sample_data.sql     # Data contoh untuk demonstrasi
│
└── docs/                   # Spesifikasi teknis & perancangan sistem
    ├── prd/                # Product Requirement Document
    ├── frd/                # Functional Requirement Document (F-01 s/d F-07)
    ├── database/           # Rancangan ERD dan kamus data
    ├── ui/                 # Panduan desain dan spesifikasi antarmuka
    └── flow map.md         # Alur perjalanan paket dan state transition
```

---

## Panduan Menjalankan Sistem

### 1. Backend (Laravel REST API)

Pastikan PHP (>= 8.2) dan Composer telah terpasang.

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Server API default berjalan pada `http://127.0.0.1:8000`.

### 2. Frontend (React + Vite)

Pastikan Node.js (>= 18) telah terpasang.

```bash
cd frontend
npm install
npm run dev
```

Buka browser pada `http://localhost:5173`.

Untuk membuat build produksi:
```bash
npm run build
npm run preview
```

---

## Fitur Utama Smart Tracking

1. **Pencarian Resi Instan (< 1 Detik)**:
   - Pencarian cerdas dengan dukungan client-side cache & memory cache untuk respons instan.
   - Deteksi otomatis status dan pengalihan dinamis ke halaman tracking yang sesuai.
2. **Peta Pelacakan Real-time (Leaflet Map)**:
   - Visualisasi posisi kurir (*Satria*), hub transit, rute perjalanan, dan titik pengantaran penerima.
3. **5 Tahapan Status Pengiriman**:
   - `Order Created` (Pesanan Dibuat)
   - `Courier Processed` (Diproses Kurir / Hub)
   - `In Transit` (Dalam Perjalanan antar-hub)
   - `Out For Delivery` (Paket Sedang Diantar oleh Satria)
   - `Delivered` (Paket Berhasil Diterima)
4. **Narasi AI & Estimasi Dinamis**:
   - Narasi ramah pengguna yang menerjemahkan status operasional logistik menjadi informasi yang mudah dipahami.
5. **Konfirmasi Pengiriman & Feedback Cepat**:
   - Respon optimis instan saat pelanggan mengonfirmasi penerimaan paket tanpa jeda waktu.
