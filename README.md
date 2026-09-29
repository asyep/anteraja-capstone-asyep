# Smart AI Shipment Tracking Widget Anteraja

Prototype antarmuka React untuk pencarian dan pemantauan pengiriman. UI membaca data simulasi lokal dari `src/data/mockShipments.js`; layanan backend, database, dan integrasi AI eksternal belum terhubung.

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Vite akan menampilkan URL lokal di terminal. Untuk membuat build production dan menjalankannya secara lokal:

```bash
npm run build
npm run preview
```

## Susunan komponen

```text
App
├── TrackingHeader
├── ShipmentForm
└── Hasil pelacakan (activeShipment)
    ├── DynamicETABadge
    ├── OperationalWarningBanner
    ├── AINarrativeBox
    ├── VisualMilestoneStepper
    ├── ShipmentList
    │   ├── ShipmentCard (satu untuk setiap paket)
    │   └── EmptyState (ketika hasil filter kosong)
    └── Panel informasi
        ├── ShipmentSummary
        └── ShippingCalculator
```

Struktur file utama:

```text
src/
├── App.jsx
├── main.jsx
├── index.css
├── data/
│   └── mockShipments.js
└── components/
    ├── AINarrativeBox.jsx
    ├── DynamicETABadge.jsx
    ├── EmptyState.jsx
    ├── OperationalWarningBanner.jsx
    ├── ShipmentCard.jsx
    ├── ShipmentForm.jsx
    ├── ShipmentList.jsx
    ├── ShipmentSummary.jsx
    ├── ShippingCalculator.jsx
    ├── TrackingHeader.jsx
    └── VisualMilestoneStepper.jsx
```

## Alur state dan props

`App.jsx` menjadi pemilik state halaman dan sumber data bersama. Data paket diperlakukan sebagai immutable: pencarian dan pemilihan paket mencari objek dari dataset, lalu menyimpan referensi objek terpilih tanpa mengubah properti dataset.

| State di `App` | Fungsi | Props/callback terkait |
| --- | --- | --- |
| `activeShipment` | Paket yang sedang ditampilkan | Objek `shipment` diteruskan ke ETA, warning, narasi AI, stepper, dan ringkasan. |
| `searchQuery` | Isi input resi yang sedang diketik | `ShipmentForm` menerima `searchQuery` dan `onSearchQueryChange`; submit memanggil `onSearch`. |
| `statusFilter` | Filter daftar paket aktif | `ShipmentList` menerima `statusFilter` dan `onStatusFilterChange`. |
| `loading`, `errorMessage` | Status proses pencarian dan pesan validasi | Diteruskan ke `ShipmentForm` untuk feedback dan pencegahan submit berulang. |
| `audience`, `activeUser` | Preferensi header dan pengguna sesi | Diteruskan ke `TrackingHeader`; pilihan audiens memakai callback parent. |

Alur interaksi: `ShipmentForm` mengirim query ke `App` saat submit. `App` mencari kecocokan pada dataset, memperbarui `activeShipment`, lalu komponen tampilan menerima paket baru melalui props. `ShipmentList` merender hasil filter dan mengirim nomor resi terpilih melalui callback; `App` yang memperbarui paket aktif dan query. Tidak ada child yang mengubah props secara langsung. Kalkulator mengelola input berat dan layanan sebagai state lokal karena nilainya tidak dibutuhkan komponen lain.

Daftar paket dirender dengan `.map()` dan setiap `ShipmentCard` memakai `key={shipment.waybill_number}`. Tab filter juga memakai key tetap dari nilai status. Jika tidak ada paket yang cocok, `EmptyState` ditampilkan.

## Pemetaan ke FRD

| FRD | Komponen |
| --- | --- |
| F-01 Pencarian dan validasi resi | `ShipmentForm.jsx` dan handler pencarian di `App.jsx` |
| F-02 Visualisasi milestone | `VisualMilestoneStepper.jsx` |
| F-03 Narasi status AI | `AINarrativeBox.jsx` |
| F-04 Peringatan operasional | `OperationalWarningBanner.jsx` |
| F-05 Estimasi waktu tiba dinamis | `DynamicETABadge.jsx` |
| Daftar/filter paket dan kalkulator ongkir | `ShipmentList.jsx`, `ShipmentCard.jsx`, `EmptyState.jsx`, `ShippingCalculator.jsx` |

## Batasan data demo

Semua kiriman dan aktivitas pelacakan berasal dari mock lokal. Estimasi, kalkulasi ongkir, dan narasi merupakan simulasi frontend, bukan hasil telemetri atau layanan pengiriman real-time.
