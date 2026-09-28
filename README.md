# Smart AI Shipment Tracking Widget Anteraja

Frontend React untuk prototype pelacakan pengiriman Anteraja. Aplikasi ini memindahkan interaksi dari manipulasi DOM langsung ke komponen React dengan aliran props satu arah. Data yang digunakan adalah mock lokal; integrasi Laravel, PostgreSQL, Redis, dan Gemini belum termasuk implementasi frontend ini.

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Build production lokal:

```bash
npm run build
npm run preview
```

## Tree of Components

```text
src/
├── App.jsx
├── main.jsx
├── index.css
├── data/
│   └── mockShipments.js
└── components/
    ├── TrackingHeader.jsx
    ├── ShipmentForm.jsx
    ├── DynamicETABadge.jsx
    ├── OperationalWarningBanner.jsx
    ├── AINarrativeBox.jsx
    ├── VisualMilestoneStepper.jsx
    ├── ShipmentCard.jsx
    ├── ShipmentList.jsx
    ├── ShipmentSummary.jsx
    └── ShippingCalculator.jsx
```

`index.html` adalah entry point Vite. Halaman prototype HTML/CSS lama tetap berada di `prototype/`.

## Alur props dan state

`App.jsx` menyimpan daftar shipment mock, resi aktif, status loading/error, jenis pengguna, dan filter riwayat. `ShipmentForm` mengelola input resi terkontrol lalu memanggil `onSearch` saat submit. `App` mencari kecocokan resi dan mengirim objek shipment terpilih sebagai props ke badge ETA, warning, AI narrative, stepper, ringkasan, dan kartu detail. `ShipmentList` menerima daftar serta filter, lalu mengirim callback pilihan kartu ke `App`. Kalkulator mengelola berat dan layanan lokal melalui state komponen.

### Hubungan dengan DIKW

- **Data:** atribut order, kota pengirim/penerima, event milestone, dan konteks kendala dari mock dataset yang mengikuti tabel `orders`, `order_items`, `sellers`, `customers`, dan `smart_logistics_context`.
- **Information:** status, progres milestone, estimasi tiba, dan sinyal kendala yang diturunkan dari data.
- **Knowledge:** narasi status Satria yang menerjemahkan status teknis menjadi bahasa pengguna; flag fallback ditampilkan untuk membedakan narasi simulasi cadangan.
- **Wisdom:** arahan sederhana di UI seperti memeriksa kembali resi, melihat estimasi baru, atau menghubungi bantuan saat ada kendala.

## Pemetaan FRD

| FRD | Komponen |
| --- | --- |
| F-01 Resi Search Bar & Validation | `ShipmentForm.jsx` |
| F-02 Visual Milestone Stepper | `VisualMilestoneStepper.jsx` |
| F-03 AI Status Narrative Box | `AINarrativeBox.jsx` |
| F-04 Operational Warning Banner | `OperationalWarningBanner.jsx` |
| F-05 Dynamic ETA Badge | `DynamicETABadge.jsx` |

Komponen pendukung: `TrackingHeader.jsx`, `ShipmentCard.jsx`, `ShipmentList.jsx`, dan `ShippingCalculator.jsx`.

## Catatan data demo

Empat resi pada `database/sample_data.sql` digunakan apa adanya. Dua variasi tambahan di `src/data/mockShipments.js` hanya untuk memvisualisasikan status awal dan kendala cuaca; keduanya bukan baris yang sudah dimasukkan ke database SQL. Jam dan kalkulator merupakan simulasi frontend.
