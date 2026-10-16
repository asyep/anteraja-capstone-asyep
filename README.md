# Anteraja Smart AI Shipment Tracking

[![Branch](https://img.shields.io/badge/branch-release%2Fsmart--tracking--v1-ec008c.svg)](https://github.com/asyep/anteraja-capstone-asyep/tree/release/smart-tracking-v1)
[![Frontend](https://img.shields.io/badge/frontend-React%2019%20%7C%20Vite%20%7C%20Tailwind-blue.svg)](frontend/)
[![Backend](https://img.shields.io/badge/backend-Laravel%2011%20REST%20API-red.svg)](backend/)
[![Database](https://img.shields.io/badge/database-SQLite%20%2F%20MySQL%20%2F%20Supabase-emerald.svg)](database/)
[![Status](https://img.shields.io/badge/status-Production%20Ready-success.svg)]()

Platform pelacakan pengiriman pintar (*Smart Tracking*) berbasis **AI Telemetry**, **peta interaktif real-time**, **narasi prediktif logistik**, dan **REST API berkecepatan tinggi** yang dikembangkan khusus untuk **Anteraja Capstone Project**.

Branch ini (`release/smart-tracking-v1`) adalah rilis bersih (*clean release*) yang khusus menyajikan file, modul, dan dokumentasi yang **100% aktif digunakan** untuk sistem pelacakan Smart Tracking.

---

## 📌 Daftar Isi

1. [Latar Belakang & Solusi](#-latar-belakang--solusi)
2. [Fitur-Fitur Utama](#-fitur-fitur-utama)
3. [Arsitektur Sistem & Alur Data](#-arsitektur-sistem--alur-data)
4. [Struktur Repositori](#-struktur-repositori)
5. [Spesifikasi Teknis Frontend](#-spesifikasi-teknis-frontend)
6. [Spesifikasi Teknis Backend & API](#-spesifikasi-teknis-backend--api)
7. [Spesifikasi Basis Data](#-spesifikasi-basis-data)
8. [Matriks Resi Uji Coba (Demo Waybills)](#-matriks-resi-uji-coba-demo-waybills)
9. [Panduan Menjalankan Sistem (Getting Started)](#-panduan-menjalankan-sistem-getting-started)
10. [Metrik Performa & Kecepatan (< 1 Detik)](#-metrik-performa--kecepatan--1-detik)
11. [Dokumentasi Spesifikasi Terkait](#-dokumentasi-spesifikasi-terkait)

---

## 🌟 Latar Belakang & Solusi

### Masalah pada Pelacakan Logistik Konvensional:
* **Istilah Teknis Sulit Dipahami**: Status seperti `MANIFESTED`, `ARRIVED AT STAGING STORE`, atau `ON-PROCESS LINEHAUL` membingungkan pelanggan awam.
* **Informasi Statis & Minim Visual**: Hanya berupa deretan tabel teks tanpa visualisasi rute perjalanan atau lokasi kurir.
* **Estimasi Tidak Pasti**: Rentang waktu tiba yang terlalu luas tanpa memperhitungkan kendala operasional riil.
* **Pencarian Lambat**: Waktu tunggu (*loading*) yang lama saat memeriksa nomor resi di jaringan seluler.

### Solusi Smart AI Tracking Anteraja:
* 🤖 **Satria AI Diagnostic Narrative**: Menerjemahkan status logistik mentah menjadi penjelasan bahasa manusia yang ramah, informatif, dan prediktif.
* 🗺️ **Peta Telemetri Real-Time**: Visualisasi posisi kurir Satria, kendaraan pengantar, titik staging store, dan garis rute pengantaran interaktif berbasis Leaflet Map.
* ⚡ **Pencarian Instan (< 1 Detik)**: Arsitektur *multi-tier caching* (RAM Cache, Snapshot Dataset, SessionStorage, dan Cloud Parallel Race) yang menjamin output keluar seketika.
* 📍 **5 Milestone Transparan**: Alur 5 tahapan pengiriman dengan garis stepper visual dan transisi warna psikologis yang dinamis.
* 💬 **Feedback Cepat & Optimis**: Respon tombol kepuasan pelanggan dalam ~350ms tanpa menghambat pengalaman pengguna.

---

## 🚀 Fitur-Fitur Utama

| Fitur | Deskripsi | Komponen Terkait |
| --- | --- | --- |
| **Instant Waybill Lookup** | Pencarian nomor resi super cepat di bawah 1 detik dengan sanitasi karakter otomatis. | `api.js`, `TrackingSearchBar.jsx` |
| **Smart Route Resolver** | Otomatis mengarahkan nomor resi ke status tahapan pengiriman yang tepat (0ms). | `TrackingResolverPage.jsx` |
| **Dynamic Color Gradient Banner** | Kartu status utama dengan gradasi warna yang bertransisi dari muda ke pekat sesuai progres paket. | `StatusBanner.jsx` |
| **5-Stage Milestone Stepper** | Visualisasi progres perjalanan paket dengan garis penghubung hijau dan status berdenyut (*pulse*). | `MilestoneProgress.jsx` |
| **Satria AI Assistant** | Asisten AI yang memberikan rangkuman status, tombol kontak CS via WhatsApp, dan Web Share. | `AssistantNarrative.jsx` |
| **Optimistic Feedback** | Konfirmasi kepuasan pengguna (*helpful?*) yang merespons instan < 350ms ke Supabase. | `AssistantNarrative.jsx` |
| **Interactive Leaflet Map** | Peta interaktif dengan polyline rute, marker hub, dan marker kurir berotasi (*bearing angle*). | `TrackingMap.jsx` |
| **Satria Courier Profile** | Rincian nama, foto, rating, kendaraan, plat nomor, dan kontak langsung kurir Satria. | `CourierCard.jsx` |
| **Package Metadata Card** | Detail berat paket (kg), dimensi, jenis barang, layanan SLA, dan proteksi asuransi. | `PackageDetailCard.jsx` |
| **Detailed Journey Timeline** | Linimasa kronologis seluruh riwayat pergerakan fisik paket dari origin hingga destination. | `JourneyNotes.jsx` |

---

## 🏗️ Arsitektur Sistem & Alur Data

```text
[ USER BROWSER ]
       │
       ▼ (Input Nomor Resi / Waybill)
┌──────────────────────────────────────────────────────────┐
│              FRONTEND (React 19 + Vite)                  │
├──────────────────────────────────────────────────────────┤
│ 1. Sanitasi Input (cleanResiInput)                       │
│ 2. Route Dispatcher (getRouteForResi)                    │
│                                                          │
│ 3. Multi-Tier Cache Gateway (api.js):                    │
│    ├── Tier 1: In-Memory Map (0ms)                       │
│    ├── Tier 2: Master Dataset Snapshot (0ms)             │
│    ├── Tier 3: Browser SessionStorage                    │
│    └── Tier 4: Parallel Race (< 500ms)                   │
└──────────────┬────────────────────────────┬──────────────┘
               │ (Jalur Lokal / Cloud)       │ (Direct Cloud Fallback)
               ▼                             ▼
┌──────────────────────────────┐   ┌──────────────────────────────┐
│  BACKEND (Laravel 11 API)    │   │     SUPABASE CLOUD REST      │
├──────────────────────────────┤   ├──────────────────────────────┤
│ - GET  /api/v1/tracking/{no} │   │ - Tabel shipments & events   │
│ - POST /api/v1/feedback      │   │ - Tabel couriers & telemetry │
│ - Cache, Eloquent ORM, CORS  │   │ - Tabel ai_narratives        │
└──────────────┬───────────────┘   └──────────────┬───────────────┘
               │                                  │
               ▼                                  ▼
      [ Database Relasional ]             [ Cloud PostgreSQL ]
```

---

## 📁 Struktur Repositori

```text
.
├── frontend/               # Web Application SPA (React 19, Vite, Tailwind CSS, Leaflet)
│   ├── public/             # Aset gambar, ikon SVG, dan ilustrasi status pengiriman
│   ├── src/
│   │   ├── components/     # Komponen modular UI pelacakan
│   │   │   ├── layout/     # Header, Footer, Logo, Navigasi
│   │   │   ├── tracking/   # Banner, Stepper, AI Narrative, CourierCard, Radar
│   │   │   │   └── maps/   # TrackingMap.jsx (Leaflet interactive map)
│   │   │   └── ui/         # Badges, Modal, Toast
│   │   ├── context/        # ShipmentContext (Global state & search history)
│   │   ├── data/           # Dataset master lokal, rute demo, dan koordinat
│   │   ├── hooks/          # useTrackingDetail, useRecentSearches, useTransitAnimation
│   │   ├── lib/            # api.js, supabaseTracking.js, constants.js, formatters.js
│   │   ├── pages/          # 5 Halaman Milestone + Resolver + Lacak + Bantuan
│   │   ├── App.jsx         # Router & root layout
│   │   ├── main.jsx        # Bootstrap React DOM
│   │   └── index.css       # Tailwind v4 utility styles & theme tokens
│   ├── package.json
│   └── vite.config.js
│
├── backend/                # REST API Service (Laravel 11)
│   ├── app/
│   │   ├── Http/Controllers/Api/  # TrackingController & FeedbackController
│   │   ├── Models/                # Shipment, Courier, TrackingEvent, Telemetry, Narrative
│   │   └── Services/              # TrackingService & AI Formatter
│   ├── config/             # Konfigurasi database, CORS, dan cache
│   ├── database/
│   │   ├── migrations/     # DDL skema tabel relasional Laravel
│   │   └── seeders/        # DatabaseSeeder dengan dataset master Anteraja
│   ├── routes/             # api.php (Endpoint RESTful)
│   └── composer.json
│
├── database/               # Master SQL Schemas & Dataset CSV
│   ├── schema.sql          # Skema DDL tabel database
│   ├── dataset.csv         # Master dataset 80+ resi dan riwayat tracking
│   ├── seed_dataset.sql    # DML data awal pengujian
│   ├── sample_data.sql     # Data contoh untuk demonstrasi
│   └── generate_seed.py    # Skrip python generator dataset
│
├── docs/                   # Spesifikasi Teknis & Desain Proyek
│   ├── prd/                # Product Requirement Document
│   ├── frd/                # Functional Requirement Document (F-01 s/d F-07)
│   ├── database/           # ERD & rancangan kamus data relasional
│   ├── ui/                 # Spesifikasi antarmuka & panduan desain
│   └── flow map.md         # Alur perjalanan paket dan state transit
│
├── README.md               # Dokumentasi utama proyek
└── .gitignore              # Konfigurasi git ignore bersih
```

---

## 💻 Spesifikasi Teknis Frontend

* **Framework & Tooling**: React 19, Vite 7, React Router v6.
* **Styling**: Tailwind CSS v4 dengan konfigurasi tema `@theme` dan Google Fonts *Plus Jakarta Sans*.
* **Mapping Engine**: Leaflet 1.9 & React-Leaflet dengan OpenStreetMap tiles dan kalkulasi rotasi kurir (*bearing angle*).
* **State Management**: React Context API (`ShipmentContext`) untuk resi aktif dan riwayat pencarian (tersimpan di `sessionStorage` & `localStorage`).

### 5 Milestone Status Pengiriman & Transisi Warna Banner:

| Milestone | Label Tampilan | Varian Banner | Skema Warna | Status Kurir & Logistik |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Pesanan Dibuat** | `default` | Pink Muda Cerah (`#f472b6`) | Pesanan baru diterbitkan seller, menunggu kurir pickup. |
| **2** | **Diproses Kurir** | `primary-solid` | Magenta Anteraja (`#ec008c`) | Paket di-pickup dan masuk fasilitas staging hub asal. |
| **3** | **Dalam Perjalanan** | `transit` | Deep Magenta (`#b50064`) | Paket berada dalam armada linehaul antar-hub kota. |
| **4** | **Sedang Diantar** | `delivery` | Dark Maroon (`#78003a`) | Kurir Satria membawa paket menuju alamat penerima. |
| **5** | **Tiba di Tujuan** | `delivered` | Emerald Green (`#16a34a`) | Paket telah sukses diserahterimakan kepada penerima. |

---

## ⚙️ Spesifikasi Teknis Backend & API

* **Framework**: Laravel 11.x (PHP >= 8.2).
* **Architecture**: Controller-Service-Repository pattern.
* **Database Driver**: SQLite (default lokal) / MySQL / PostgreSQL Supabase.

### REST API Endpoints:

#### 1. Pelacakan Resi (*Tracking Details*)
```http
GET /api/v1/tracking/{waybill_number}
```
* **Response `200 OK`**:
```json
{
  "ok": true,
  "data": {
    "waybill_number": "10001284277889",
    "order_status": "IN_TRANSIT",
    "service_code": "AR-REG",
    "service_label": "Reguler",
    "sender": { "name": "Budi Santoso", "city": "Jakarta Barat" },
    "receiver": { "name": "Siti Rahma", "city": "Bandung" },
    "courier": {
      "id": "SAT-0042",
      "name": "Satria Hendra",
      "phone": "081234567890",
      "vehicle_plate": "B 4521 KZX"
    },
    "telemetry": {
      "latitude": -6.9034,
      "longitude": 107.6186,
      "speed_kmh": 45,
      "eta_minutes": 75
    },
    "milestones": [ ... ],
    "tracking_events": [ ... ],
    "ai_narrative": {
      "title": "Paket Dalam Jalur Cepat",
      "text": "Paket Anda sedang diangkut armada linehaul menuju Hub Bandung..."
    }
  }
}
```

#### 2. Konfirmasi & Feedback Pelanggan
```http
POST /api/v1/feedback
Content-Type: application/json

{
  "resi": "10001284277889",
  "membantu": true
}
```
* **Response `200 OK`**:
```json
{
  "ok": true,
  "message": "Feedback berhasil dicatat"
}
```

---

## 🗄️ Spesifikasi Basis Data

Basis data dirancang dengan relasi normalisasi tingkat 3 (3NF):

```text
┌─────────────────┐       1:N       ┌──────────────────┐
│    couriers     ├─────────────────┤  telemetry_data  │
└────────┬────────┘                 └──────────────────┘
         │ 1:N
┌────────┴────────┐       1:N       ┌──────────────────┐
│    shipments    ├─────────────────┤ tracking_events  │
└────────┬────────┘                 └──────────────────┘
         │ 1:1                      
         ├──────────────────────────┬──────────────────┐
         │                          │                  │
┌────────┴────────┐        ┌────────┴────────┐┌────────┴────────┐
│  ai_narratives  │        │    feedback     ││shipment_couriers│
└─────────────────┘        └─────────────────┘└─────────────────┘
```

1. **`shipments`**: Data induk pengiriman, nomor resi, pengirim, penerima, layanan SLA, status akhir.
2. **`couriers`**: Data petugas kurir Satria, nomor telepon, armada kendaraan, dan rating.
3. **`tracking_events`**: Riwayat kronologis pemindaian resi di setiap hub / pos pemeriksaan.
4. **`telemetry_data`**: Log koordinat GPS riil (latitude, longitude, kecepatan, akurasi sinyal).
5. **`ai_narratives`**: Teks narasi hasil analisis AI untuk setiap tahapan status pengiriman.
6. **`feedback`**: Rekapitulasi konfirmasi kepuasan pengguna terhadap kejelasan informasi.

---

## 🧪 Matriks Resi Uji Coba (Demo Waybills)

Gunakan nomor resi pengujian berikut untuk memeriksa visualisasi masing-masing status secara langsung:

| No | Nomor Resi Uji Coba | Status Tahapan | Rute Halaman | Keterangan Uji |
| :---: | :--- | :--- | :--- | :--- |
| 1 | `10001240251661` | **Pesanan Dibuat** | `/tracking/order-created` | Banner Pink, menunggu kurir pickup |
| 2 | `10004944899549` | **Diproses Kurir** | `/tracking/courier-processed` | Banner Magenta, diproses di Staging Hub |
| 3 | `10001284277889` | **Dalam Perjalanan** | `/tracking/in-transit` | Banner Deep Magenta, rute peta linehaul |
| 4 | `10005728491028` | **Sedang Diantar** | `/tracking/out-for-delivery` | Banner Dark Maroon, GPS live Satria |
| 5 | `10003840104345` | **Tiba di Tujuan** | `/delivered` | Banner Hijau, paket sukses diterima |
| 6 | `10009988776655` | **Resi Tidak Ada** | `/not-found` | Halaman edukasi 404 & bantuan CS |

---

## 🛠️ Panduan Menjalankan Sistem (Getting Started)

### Prasyarat:
* **Node.js**: Versi 18.0 atau lebih baru.
* **PHP**: Versi 8.2 atau lebih baru.
* **Composer**: Versi 2.x.

---

### 1. Menjalankan Backend (Laravel API)

```bash
# 1. Masuk ke direktori backend
cd backend

# 2. Pasang dependensi PHP
composer install

# 3. Siapkan file konfigurasi environment
cp .env.example .env
php artisan key:generate

# 4. Jalankan migrasi basis data dan seeder dataset master
php artisan migrate --seed

# 5. Jalankan server lokal
php artisan serve
```
* Server API akan aktif pada: `http://127.0.0.1:8000`.

---

### 2. Menjalankan Frontend (React + Vite)

Buka jendela terminal baru:

```bash
# 1. Masuk ke direktori frontend
cd frontend

# 2. Pasang dependensi Node.js
npm install

# 3. Jalankan development server
npm run dev
```
* Buka peramban di: `http://localhost:5173`.

---

### 3. Membangun Bundle Produksi (Build Production)

```bash
cd frontend
npm run build
npm run preview
```

---

## ⚡ Metrik Performa & Kecepatan (< 1 Detik)

Sistem dirancang dengan target performa tinggi (*sub-second user experience*):

| Jenis Operasi | Target SLA | Realisasi Kinerja | Mekanisme Optimasi |
| --- | :---: | :---: | --- |
| **Pencarian Resi di Cache (RAM)** | < 100 ms | **0 ms** | In-Memory `Map` caching |
| **Pencarian Resi Terdaftar (Local Snapshot)** | < 300 ms | **< 1 ms** | Pre-bundled master dataset JSON |
| **Pencarian Resi Baru (Cloud Query)** | < 1.000 ms | **~300 - 450 ms** | Parallel Race: Supabase & Laravel |
| **Konfirmasi Feedback Pengguna** | < 1.000 ms | **~350 ms** | Optimistic UI update & async storage |
| **Durasi Bundle Build Frontend** | < 5.000 ms | **1.24 detik** | Vite rolldown & tree-shaking |

---

## 📚 Dokumentasi Spesifikasi Terkait

Dokumentasi rancangan lengkap tersedia di folder [`docs/`](docs/):

* 📄 **[Product Requirement Document (PRD)](docs/prd/)**: Latar belakang bisnis, target pengguna, dan user journey.
* 📋 **[Functional Requirement Document (FRD)](docs/frd/)**: Spesifikasi teknis F-01 sampai F-07.
* 🗺️ **[Flow Map Perjalanan Paket](docs/flow map.md)**: Diagram transisi status operasional paket.
* 💾 **[Dokumentasi Database](docs/database/)**: Kamus data dan diagram relasi tabel.
* 🎨 **[Spesifikasi UI](docs/ui/)**: Desain komponen, layout 12-kolom, dan token warna.
* 🧠 **[Panduan Teknis Backend & Fitur](docs/PANDUAN_PENJELASAN_BACKEND.md)**: Panduan komprehensif arsitektur backend, controller, model, AI telemetry, dan korelasi frontend-backend dengan analogi dunia nyata.

---

**Anteraja Capstone Project — Smart AI Shipment Tracking System**  
*Built with speed, precision, and human-friendly logistics intelligence.*
