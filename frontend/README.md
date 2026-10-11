# Frontend Anteraja Smart AI Tracking — Manual Teknis Lengkap

Aplikasi antarmuka web (*Single Page Application*) untuk **Anteraja Smart AI Shipment Tracking**, dibangun menggunakan **React 19**, **Vite**, **Tailwind CSS v4**, dan **Leaflet Interactive Map**.

---

## 📌 Daftar Isi

1. [Struktur Direktori & Hierarki Komponen](#-struktur-direktori--hierarki-komponen)
2. [Alur Logika Sistem (System Logic Deep-Dive)](#-alur-logika-sistem-system-logic-deep-dive)
3. [Arsitektur Multi-Tier Caching (< 1 Detik)](#-arsitektur-multi-tier-caching--1-detik)
4. [5 Tahapan Milestone & Logika Tampilannya](#-5-tahapan-milestone--logika-tampilannya)
5. [Peta Interaktif & Telemetri Kurir (Leaflet)](#-peta-interaktif--telemetri-kurir-leaflet)
6. [Asisten Cerdas Satria AI & Feedback Cepat](#-asisten-cerdas-satria-ai--feedback-cepat)
7. [Dokumentasi State Management & Custom Hooks](#-dokumentasi-state-management--custom-hooks)
8. [Utilitas & Layanan Modul (`src/lib/`)](#-utilitas--layanan-modul-srclib)
9. [Panduan Menjalankan & Perintah Build](#-panduan-menjalankan--perintah-build)

---

## 🏗️ Struktur Direktori & Hierarki Komponen

```text
frontend/src/
├── components/
│   ├── layout/                 # Komponen layout global
│   │   ├── Header.jsx          # Header tetap dengan navigasi & logo Anteraja
│   │   ├── Footer.jsx          # Footer 4 kolom dengan tautan layanan & kontak CS
│   │   ├── Logo.jsx            # Vektor logo resmi Anteraja
│   │   ├── NavLinks.jsx        # Daftar menu navigasi (desktop & mobile)
│   │   ├── MobileNav.jsx       # Menu hamburger responsif
│   │   └── navigation.js       # Konfigurasi rute menu
│   │
│   ├── tracking/               # Komponen spesifik pelacakan paket
│   │   ├── TrackingStatusLayout.jsx # Master template 12-kolom status tracking
│   │   ├── StatusBanner.jsx         # Banner atas dengan gradien transisi warna
│   │   ├── MilestoneProgress.jsx    # Stepper 5 tahapan riil dengan garis dinamis
│   │   ├── AssistantNarrative.jsx   # Kartu narasi AI Satria & quick feedback
│   │   ├── CourierCard.jsx          # Kartu profil kurir, kendaraan, & kontak
│   │   ├── LivePositionCard.jsx     # Mini-radar koordinat GPS & trigger peta
│   │   ├── PackageDetailCard.jsx    # Rincian berat, pengirim, penerima, dan SLA
│   │   ├── JourneyNotes.jsx         # Linimasa catatan perjalanan fisik paket
│   │   ├── TrackingSearchBar.jsx    # Input resi cepat dengan tombol salin & prefetch
│   │   └── maps/
│   │       └── TrackingMap.jsx      # Peta interaktif Leaflet + rotasi kurir
│   │
│   └── ui/                     # Komponen UI atomik
│       ├── ETABadge.jsx        # Badge estimasi waktu tiba
│       ├── SocialIcons.jsx     # Ikon SVG media sosial
│       └── StoreBadges.jsx     # Badge unduhan PlayStore & AppStore
│
├── context/
│   └── ShipmentContext.jsx     # Global Context (resi aktif, recent search, user)
│
├── data/
│   ├── allShipmentsData.json   # Master snapshot data 80+ resi terdaftar
│   ├── shipmentsData.js        # Kamus rute cepat & sanitasi resi
│   ├── orderCreatedData.js     # Template data Milestone 1
│   ├── courierProcessedData.js # Template data Milestone 2
│   ├── inTransitData.js        # Template data Milestone 3
│   ├── outForDeliveryData.js   # Template data Milestone 4
│   ├── deliveredData.js        # Template data Milestone 5
│   └── transitRoutes.js        # Koordinat waypoint rute linehaul
│
├── hooks/
│   ├── useTrackingDetail.js    # Hook reaktif data tracking & transformer
│   ├── useRecentSearches.js    # Hook sinkronisasi riwayat ke localStorage
│   └── useTransitAnimation.js  # Hook animasi pergerakan waypoint kendaraan
│
├── lib/
│   ├── api.js                  # Multi-tier API gateway & memory caching
│   ├── supabaseTracking.js     # Direct Supabase cloud REST client
│   ├── constants.js            # Token warna brand, SLA, dan regex resi
│   └── formatters.js           # Format mata uang Rupiah & tanggal WIB
│
├── pages/
│   ├── HomePage.jsx            # Landing page dengan pencarian resi
│   ├── LacakPage.jsx           # Portal pencarian resi & panduan status
│   ├── TrackingResolverPage.jsx# Dispatcher rute dinamis sesuai status resi
│   ├── OrderCreatedPage.jsx    # Tampilan Milestone 1: Pesanan Dibuat
│   ├── CourierProcessedPage.jsx# Tampilan Milestone 2: Diproses Kurir
│   ├── InTransitPage.jsx       # Tampilan Milestone 3: Dalam Perjalanan
│   ├── OutForDeliveryPage.jsx  # Tampilan Milestone 4: Sedang Diantar
│   ├── DeliveredPage.jsx       # Tampilan Milestone 5: Tiba di Tujuan
│   ├── HelpPage.jsx            # Pusat bantuan & FAQ pelanggan
│   └── NotFoundPage.jsx        # Halaman edukatif resi tidak ditemukan (404)
│
├── App.jsx                     # Root component & routing
└── main.jsx                    # Entry point React DOM
```

---

## 🔄 Alur Logika Sistem (System Logic Deep-Dive)

Proses pelacakan paket berjalan melalui 5 tahapan logika berurutan:

```text
[1. User Memasukkan Nomor Resi]
          │
          ▼
   cleanResiInput(resi) ───────────────► Membersihkan karakter selain alfanumerik
          │
          ▼
   getRouteForResi(resi)
   ├── Cek dataset lokal? ─────────────► Redirect instan (0ms) ke rute spesifik
   └── Resi baru di luar dataset? ─────► Arahkan ke /cek-resi?waybill_number=...
          │
          ▼
   TrackingResolverPage
          │ (Balap Query API < 750ms)
          ▼
   useTrackingDetail(waybill)
   ├── Cek in-memory Map? ─────────────► Pakai data cache (0ms)
   └── Revalidasi ke Supabase/Backend
          │
          ▼
   mergeShipmentData(baseData, apiData)► Susun koordinat, format WIB, dan profil kurir
          │
          ▼
   Render TrackingStatusLayout
   ├── StatusBanner (Warna sesuai tahap)
   ├── MilestoneProgress (Stepper 5 tahap)
   ├── AssistantNarrative (AI Diagnostic)
   └── TrackingMap (Peta Leaflet GPS)
```

---

## ⚡ Arsitektur Multi-Tier Caching (< 1 Detik)

Modul [`src/lib/api.js`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/frontend/src/lib/api.js) menerapkan strategi caching 4 lapis:

1. **Lapis 1 — In-Memory RAM Cache (`trackingCache`)**:
   * *Kecepatan*: **0 milidetik**.
   * *Cara Kerja*: Variabel `Map()` global menyimpan seluruh hasil respon yang pernah diminta selama peramban berjalan. Transisi antar halaman berjalan tanpa jeda *blank*.
2. **Lapis 2 — Master Snapshot Dataset (`allShipmentsData.json`)**:
   * *Kecepatan*: **< 1 milidetik**.
   * *Cara Kerja*: Data terkompilasi langsung ke bundle JS. 80+ nomor resi terdaftar dapat langsung ditampilkan seketika sambil melakukan revalidasi di background (*Stale-While-Revalidate*).
3. **Lapis 3 — Browser `sessionStorage`**:
   * *Kecepatan*: **< 5 milidetik**.
   * *Cara Kerja*: Menyimpan data per nomor resi di storage sesi agar *refresh* halaman tetap instan.
4. **Lapis 4 — Parallel Race Cloud & Local API**:
   * *Kecepatan*: **~300 - 450 milidetik**.
   * *Cara Kerja*: Menjalankan `Promise.race` antara Supabase Cloud REST API dan backend lokal. Respon pertama yang sukses langsung diambil dan disimpan ke Lapis 1 & 3.

---

## 📍 5 Tahapan Milestone & Logika Tampilannya

Setiap tahapan pengiriman memiliki penyesuaian visual khusus pada banner, warna, dan stepper:

### 1. Pesanan Dibuat (`OrderCreatedPage.jsx`)
* **Varian Banner**: `default` (Pink cerah bergradasi: `#f472b6` -> `#ec4899`).
* **Stepper**: Titik 1 aktif berdenyut (`animate-pulse`), titik 2 s/d 5 redup (*pending*).
* **Kondisi**: Paket belum diserahkan oleh pengirim; kurir dijadwalkan untuk penjemputan (*pickup*).

### 2. Diproses Kurir (`CourierProcessedPage.jsx`)
* **Varian Banner**: `primary-solid` (Magenta khas Anteraja: `#ec008c` -> `#c70072`).
* **Stepper**: Titik 1 selesai (centang hijau), Titik 2 aktif dengan ikon kendaraan pengantar.
* **Kondisi**: Paket telah sukses di-pickup dan sedang diproses sortasi di Staging Store awal.

### 3. Dalam Perjalanan (`InTransitPage.jsx`)
* **Varian Banner**: `transit` (Deep Magenta pekat: `#b50064` -> `#8f004c`).
* **Stepper**: Titik 1 & 2 hijau selesai, Titik 3 aktif bergerak antar-hub.
* **Kondisi**: Paket berada dalam perjalanan armada linehaul (truk/pesawat antar kota). Mini radar memperlihatkan koordinat GPS rute antar kota.

### 4. Sedang Diantar (`OutForDeliveryPage.jsx`)
* **Varian Banner**: `delivery` (Dark Maroon / Plum pekat: `#78003a` -> `#4e0024`).
* **Stepper**: Titik 1 s/d 3 selesai, Titik 4 aktif menuju rumah penerima.
* **Kondisi**: Kurir Satria membawa paket. Peta menampilkan posisi kurir mendekati alamat tujuan penerima.

### 5. Tiba di Tujuan (`DeliveredPage.jsx`)
* **Varian Banner**: `delivered` (Emerald Green permanen: `#16a34a` -> `#15803d`).
* **Stepper**: Kelima titik berwarna hijau penuh dengan ikon sukses.
* **Kondisi**: Paket telah diterima oleh penerima yang sah. Ditampilkan nama penerima dan foto/tanda bukti terima (*Proof of Delivery*).

---

## 🗺️ Peta Interaktif & Telemetri Kurir (Leaflet)

Implementasi peta pada [`src/components/tracking/maps/TrackingMap.jsx`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/frontend/src/components/tracking/maps/TrackingMap.jsx):

* **Kalkulasi Sudut Rotasi Kurir (`getBearing`)**:
  Menghitung azimuth matematis antara titik awal dan tujuan agar ikon kendaraan otomatis menghadap ke arah jalan yang benar:
  ```javascript
  const y = Math.sin(dLng) * Math.cos(endLatRad);
  const x = Math.cos(startLatRad) * Math.sin(endLatRad) -
            Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(dLng);
  const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  ```
* **Kamera Stabil (`StaticMapController`)**:
  Mencegah layar goyang atau berpindah paksa saat pengguna sedang memperbesar (*zoom*) atau menggeser (*drag*) area peta.

---

## 🤖 Asisten Cerdas Satria AI & Feedback Cepat

Implementasi pada [`src/components/tracking/AssistantNarrative.jsx`](file:///Users/asep/Developer/Projects/anteraja-capstone-asyep/frontend/src/components/tracking/AssistantNarrative.jsx):

1. **Narasi Diagnostik Operasional**:
   Menerjemahkan kode status teknis menjadi narasi ramah yang menenangkan pelanggan dan menjelaskan langkah selanjutnya.
2. **Optimistic Feedback (< 350ms)**:
   Saat pengguna menekan tombol "Ya" atau "Tidak":
   * UI langsung memutar spinner ~350ms.
   * State lokal segera berubah menjadi centang hijau sukses (*Optimistic Update*).
   * Network request ke Supabase dan backend Laravel dikirim secara asinkron di latar belakang.
   * Status disimpan di `localStorage` per resi untuk mencegah klik berulang.
3. **Web Share API**:
   Membuka menu berbagi bawaan sistem operasi pada ponsel pintar untuk mengirim ringkasan status via WhatsApp/SMS dengan satu klik.

---

## 🔧 Dokumentasi State Management & Custom Hooks

* **`useTrackingDetail(waybill)`**:
  Mengembalikan `{ data, loading, error }`. Memiliki mekanisme sinkronisasi instan pada render tick pertama tanpa menunggu network request jika data sudah ada di cache.
* **`useRecentSearches()`**:
  Mengelola riwayat pencarian (maksimal 5 item unik). Menggunakan `window.dispatchEvent` dan event `storage` agar riwayat tersinkronisasi otomatis antar komponen dan tab browser.
* **`useTransitAnimation(route, options)`**:
  Melakukan interpolasi pergerakan armada kendaraan sepanjang garis waypoint rute perjalanan.

---

## 📦 Panduan Menjalankan & Perintah Build

### 1. Mode Pengembangan (Development)
```bash
npm install
npm run dev
```
Server berjalan di `http://localhost:5173` dengan hot-module-replacement (HMR).

### 2. Membangun Bundle Produksi (Build)
```bash
npm run build
```
Menghasilkan aset minified di direktori `dist/` dalam waktu **~1.2 - 1.4 detik**.

### 3. Preview Hasil Build
```bash
npm run preview
```
Menjalankan server statis lokal untuk memverifikasi bundle produksi sebelum deployment.
