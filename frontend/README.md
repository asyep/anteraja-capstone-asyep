# Frontend Anteraja Smart AI Tracking

Aplikasi web pelacakan pengiriman cerdas berbasis **React 19**, **Vite**, **Tailwind CSS**, dan **Leaflet Map**.

---

## Ringkasan Logika & Alur Kerja Sistem (System Logic Flow)

Secara garis besar, alur kerja di sisi frontend terbagi menjadi **5 langkah logika**:

```text
[1. Input Resi Pengguna] 
         ↓ (Sanitasi Karakter Alfanumerik)
[2. Logika Resolusi Rute (TrackingResolverPage)]
         ↓ (Cek apakah resi ada di dataset / butuh query API)
[3. Multi-Tier Caching & Data Fetching (api.js)]
         ↓ (Tier 1: RAM Cache -> Tier 2: Dataset Lokal -> Tier 3: Supabase/Laravel)
[4. Data Merger & Formatting (mergeShipmentData)]
         ↓ (Sinkronkan data mentah API ke template visual UI)
[5. Render Visual & Interaksi UI]
         ├── Status Banner (Gradasi warna dinamis sesuai milestone)
         ├── Milestone Stepper (5 tahap pengiriman riil)
         ├── Peta Telemetri Leaflet (Posisi GPS kurir & rute)
         └── Narasi Satria AI & Feedback Cepat (< 1 Detik)
```

---

### Penjelasan Logika Tiap Langkah

#### 1. Logika Input & Sanitasi Resi (`cleanResiInput`)
* **Masalah**: Pengguna sering menyalin nomor resi bersama spasi, simbol `#`, atau tanda hubung `-`.
* **Logika**: Sistem otomatis menghapus seluruh karakter non-alfanumerik (`/[^a-zA-Z0-9]/g`) sebelum data diproses, mencegah error pencarian.

#### 2. Logika Navigasi & Dispatcher Rute (`getRouteForResi` & `TrackingResolverPage`)
* **Logika 0ms**: Jika resi cocok dengan dataset demo / lokal, rute langsung dialihkan ke URL status yang tepat (`/tracking/in-transit`, `/tracking/out-for-delivery`, dll) seketika tanpa loading.
* **Logika Resi Baru**: Jika resi baru di luar dataset, diarahkan ke `/cek-resi` yang melakukan query status ke backend dan Supabase (< 750ms), lalu mengarahkan ke halaman status yang sesuai.

#### 3. Logika Multi-Tier Cache & Parallel Race (`api.js`)
* **Tier 1 (RAM Map)**: Menyimpan resi yang pernah dicari dalam memori JavaScript (respons 0ms saat navigasi bolak-balik).
* **Tier 2 (Dataset Snapshot)**: Menyediakan snapshot data 80+ resi terdaftar agar data langsung tampil seketika (< 1ms).
* **Tier 3 (Cloud Supabase & Local API)**: Menjalankan *parallel race* antara Supabase Cloud dan server backend lokal. Data tercepat yang berhasil akan langsung ditampilkan ke layar, menjaga kecepatan selalu di bawah 1 detik.

#### 4. Logika Penggabungan Data (`mergeShipmentData`)
* **Tujuan**: Memastikan antarmuka selalu lengkap dan stabil.
* **Logika**: Data dinamis dari API (nama pengirim/penerima, kota, timestamp event, koordinat GPS kurir) digabungkan ke template visual milestone. Jika salah satu data opsional kosong, sistem menyediakan nilai default yang rapi (*graceful fallback*).

#### 5. Logika Komponen & Visual
* **Status Banner**: Warna latar berganti otomatis sesuai tahapan (Pink muda -> Magenta Anteraja -> Deep Magenta -> Dark Maroon -> Hijau Sukses).
* **Milestone Progress**: Garis stepper hijau menyala untuk tahapan yang sudah dilewati, dan titik yang sedang berlangsung berdenyut (*pulse animation*).
* **Live Radar & Leaflet Map**: Menghitung sudut rotasi ikon kendaraan (*bearing*) dan menampilkan titik koordinat GPS riil.
* **Instant Feedback**: Tombol bantuan "Ya/Tidak" merespons seketika secara optimis di layar (< 350ms) sembari mencatat data ke database di background.

---

## Cara Menjalankan Secara Lokal

```bash
# 1. Masuk ke folder frontend
cd frontend

# 2. Pasang dependensi
npm install

# 3. Jalankan server pengembang (Vite)
npm run dev
```

Buka peramban di `http://localhost:5173`.

Untuk membuat build produksi:
```bash
npm run build
npm run preview
```
