# Anteraja Hub Dwell Monitor — Documentation

## 1. Project Overview
Aplikasi **Anteraja Hub Dwell Monitor** dibangun untuk membantu supervisor operasional logistik Anteraja dalam memantau performa dwell time armada di setiap fasilitas hub secara real-time. Aplikasi ini memudahkan tim operasional untuk mendeteksi bottleneck pergerakan kurir/armada Satria secara geografis, melihat distribusi beban hub, dan menentukan prioritas investigasi penumpukan paket.

---

## 2. Data Sources
Aplikasi menggunakan integrasi data lokal terstruktur yang tersimpan pada `public/data/`:
1. **`locations.json`**: Data spasial titik hub logistik (Latitude, Longitude), nama resmi hub, dan wilayah operasional kota.
2. **`metrics.json`**: Metrik operasional raw numeric per hub yang mencakup:
   - `mean_dwell_hours`: Rata-rata durasi dwell time kunjungan armada (satuan jam numerik).
   - `min_dwell_hours` & `max_dwell_hours`: Batas durasi dwell time terendah dan tertinggi.
   - `completed_visits`: Total kunjungan kurir yang telah rampung dan digunakan sebagai pembagi perhitungan metrik rata-rata global.
   - `open_visits`: Kunjungan armada yang masih berlangsung (open/in-progress) untuk monitoring beban berjalan tanpa mendistorsi rata-rata completed.
   - `priority`: Status klasifikasi operasional (`HIGH` jika dwell time > 6.0 jam, `NORMAL` jika ≤ 6.0 jam).
3. **`ai-summary.json`**: Ringkasan narasi eksekutif terstruktur hasil validasi AI Studio yang berisi interpretasi bottleneck dan rekomendasi langkah investigasi lanjutan.

---

## 3. Stitch Design
Desain antarmuka dirancang terlebih dahulu menggunakan Google Stitch dengan identitas visual khas Anteraja (Magenta `#EC008C`, Dark Slate `#0F172A`, dan Slate-50).
- **Stitch Project URL:** https://stitch.withgoogle.com/projects/1923144906129339843
- **Stitch Project ID:** `1923144906129339843`
- **Screens Generated:**
  - `v1 (Desktop 1440px)`: Layout dua kolom berdampingan (*side-by-side*) dengan peta Leaflet luas di kiri dan detail panel di kanan.
  - `v2 (Mobile 390px)`: Layout responsif satu kolom vertikal bertumpuk (*stacked*) yang ramah interaksi layar sentuh.
- **Tangkapan Layar:**
  - Desain Desktop Stitch: `screenshots/stitch-v1.png`
  - Desain Mobile Stitch: `screenshots/stitch-v2.png`

---

## 4. AI Structured-Output Testing
Pengujian dilakukan menggunakan Google AI Studio (Gemini Flash Preview) dengan System Instruction ketat yang mewajibkan schema JSON terstruktur:
`{"summary": string, "priority_hubs": string[], "next_checks": string[]}`

| Test Scenario | Kondisi Input | Hasil Output JSON | Evaluasi |
| :--- | :--- | :--- | :---: |
| **Test 1 — Normal Data** | Dataset normal dengan 3 hub > 6 jam | Mengidentifikasi `["HUB-JKT-01", "HUB-JKT-02", "HUB-BKS-01"]` dengan ringkasan bottleneck dan rekomendasi audit | **PASS** |
| **Test 2 — No Priority Hub** | Seluruh mean dwell < 6.0 jam | `priority_hubs: []`, AI melaporkan seluruh fasilitas beroperasi normal di bawah batas | **PASS** |
| **Test 3 — Empty Hubs** | Array kosong `[]` | `priority_hubs: []`, AI secara eksplisit menyatakan data metrik tidak tersedia | **PASS** |
| **Test 4 — Untrusted Hub Name** | Nama hub disisipi injection instruksi override | AI mengabaikan perintah jahat, memperlakukan teks sebagai string biasa, dan mempertahankan `priority_hubs: []` | **PASS** |

---

## 5. Application Features
1. **Global KPI Dashboard**: Menghitung secara otomatis Total Hub (6 fasilitas), Total Completed Visits (6.660 kunjungan), Global Mean Dwell Time tertimbang (5.6 jam), dan Total Priority Hub (3 fasilitas > 6.0h).
2. **Top 3 Hub Bottleneck**: Menyorot tiga fasilitas dengan dwell time tertinggi secara numerik murni (#1 Hub Cakung 7.8h, #2 Hub Marunda 6.9h, #3 Hub Tambun 6.2h).
3. **Interactive Leaflet Map**: Peta interaktif dengan custom circle marker berkode warna (magenta untuk prioritas tinggi dan biru untuk normal) yang terhubung langsung ke data hub.
4. **Searchable Hub List**: Pencarian real-time berdasarkan nama fasilitas atau nama kota.
5. **Shared Priority Filter**: Filter tombol toggle (*All Hubs* vs *Priority Only*) yang terikat pada state tunggal, menyaring tampilan peta Leaflet dan daftar hub secara simultan.
6. **Hub Detail Panel**: Menampilkan kartu ringkasan saat marker peta atau item list diklik, memuat identitas hub, nilai mean/min/max dwell time, badge status investigasi, dan rincian volume kunjungan.
7. **Application State Handling**: Penanganan state Loading saat data dimuat, Error boundary jika fetch gagal, dan Empty state bila filter pencarian tidak menemukan kecocokan.

---

## 6. Testing (Desktop & Mobile)
- **Desktop (1440px)**:
  - Tampilan dua kolom berdampingan (*side-by-side*). Area Leaflet map dan list/detail panel tampak seimbang.
  - Interaksi hover, klik marker, dan popup bekerja lancar tanpa kendala double mount.
  - Atribusi OpenStreetMap terlihat jelas di pojok kanan bawah peta.
  - Artefak screenshot: `screenshots/desktop.png`
- **Mobile (390px)**:
  - Komponen bertumpuk secara vertikal (*single-column stack*).
  - Peta tetap memiliki tinggi proporsional dan dapat digeser tanpa menyebabkan horizontal scroll pada halaman.
  - Detail hub dan filter toggle mudah diakses via jempol tangan (*touch-friendly*).
  - Artefak screenshot: `screenshots/mobile.png`

---

## 7. Operational Insight
Berdasarkan analisis data operasional, **Hub Cakung Mega Hub (HUB-JKT-01)** wajib menjadi prioritas utama investigasi tim operasional. Fasilitas ini membukukan mean dwell time tertinggi mencapai **7.8 jam** (dengan durasi puncak ekstrem mencapai 14.5 jam) di tengah volume trafik terbesar jaringan yang mencakup **1.420 completed visits** serta **85 open visits**. Kondisi ini, disusul oleh **Hub Marunda Logistics (6.9 jam)** pada koridor logistik Jakarta Utara, menunjukkan indikasi kuat terjadinya penumpukan di area staging inbound-outbound dan ketimpangan alokasi kurir saat jam pergantian shift, yang berpotensi menjadi titik kegagalan tunggal (*single point of bottleneck*) bagi SLA pengiriman paket seluruh wilayah Jabodetabek.