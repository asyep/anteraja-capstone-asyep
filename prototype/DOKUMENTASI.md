# Dokumentasi Prototype Anteraja Smart Tracking

Prototype ini menyajikan alur pelanggan untuk mencari nomor resi, membaca progres pengiriman, memahami estimasi, dan mendapatkan bantuan. Acuan utama: PRD Smart AI Shipment Tracking Widget v4.0 Final, FRD Final v3.0, FRD F-01 sampai F-05, dan [`/docs/flow map.md`](../docs/flow%20map.md).

## Pemetaan halaman ke FRD dan flow

| Halaman | Kaitan FRD | Peran dalam alur |
| --- | --- | --- |
| [`index.html`](index.html) | F-01, F-03, F-04, F-05 | Beranda layanan; pencarian awal, pintasan status, pengenalan fitur dan tautan bantuan. |
| [`pages/lacak.html`](pages/lacak.html) | F-01 | Form pencarian resi serta pilihan contoh status untuk memulai pencarian. |
| [`pages/loading.html`](pages/loading.html) | F-01 | Layar transisi pencarian dengan indikator loading dan skeleton. |
| [`pages/validation-error.html`](pages/validation-error.html) | F-01 | Contoh pesan ketika format input tidak sesuai. |
| [`pages/tracking-normal.html`](pages/tracking-normal.html) | F-01, F-02, F-03, F-05 | Hasil paket dalam perjalanan normal: pencarian, narasi, stepper empat tahap, riwayat, rincian, dan ETA. |
| [`pages/tracking-live.html`](pages/tracking-live.html) | F-01, F-02, F-03, F-05 | Hasil perjalanan dengan ilustrasi radar/live map dan informasi status. |
| [`pages/tracking.html`](pages/tracking.html) | F-01, F-02, F-03, F-04, F-05 | Hasil dengan kendala operasional: banner peringatan, ETA yang disesuaikan, narasi, stepper, dan rincian. |
| [`pages/ai-fallback.html`](pages/ai-fallback.html) | F-03, F-06 | Contoh narasi cadangan saat layanan AI tidak tersedia, sementara status kiriman tetap dibaca. |
| [`pages/delivered.html`](pages/delivered.html) | F-02, F-03, F-05 | Hasil paket tiba; milestone selesai dan waktu penerimaan. |
| [`pages/canceled.html`](pages/canceled.html) | F-02 | Hasil paket dibatalkan; progres berhenti dan status dijelaskan. |
| [`pages/not-found.html`](pages/not-found.html) | F-01 | State resi tidak ditemukan beserta langkah pemeriksaan dan pencarian ulang. |
| [`pages/service-error.html`](pages/service-error.html) | F-01, F-06 | Contoh gangguan layanan dan jalur untuk mencoba kembali. |
| [`pages/bantuan.html`](pages/bantuan.html) | Pendukung F-01 sampai F-05 | FAQ dan jalur bantuan yang dapat dibuka dari navigasi/footer. |

Rincian node flow ke state tersedia di [`FLOW.md`](FLOW.md). Navigasi header dan footer menghubungkan beranda, pelacakan, dan bantuan. Tombol demo di halaman pencarian mengarah ke halaman hasil yang relevan.

## Fitur FRD yang tampak di antarmuka

- **F-01 — Resi Search Bar:** label input, validasi format, pencarian, state loading, validasi, tidak ditemukan, dan gangguan layanan.
- **F-02 — Visual Milestone Stepper:** empat tahap pengiriman, termasuk kondisi berjalan, tiba, dan batal.
- **F-03 — AI Status Narrative Box:** narasi penjelasan status dan tampilan narasi fallback.
- **F-04 — Operational Warning Banner:** peringatan kendala lapangan pada state operasional.
- **F-05 — Dynamic ETA Badge:** estimasi atau waktu tiba yang disesuaikan.
- **F-06 — Fallback Engine & Cache Manager:** layar fallback narasi tersedia. Cache Redis, permintaan Gemini, timeout, dan lookup database adalah tanggung jawab backend dan tidak dijalankan oleh prototype statis.

## Standar dan cara menjalankan

Halaman memakai elemen HTML semantik seperti `header`, `nav`, `main`, `section`, `aside`, `form`, `ol`, `time`, `details`, dan `footer`. JSON-LD Schema.org `ParcelDelivery` dan `DeliveryEvent` tersedia di `pages/tracking.html`. CSS memiliki breakpoint untuk desktop, tablet, dan ponsel, fokus keyboard, serta dukungan `prefers-reduced-motion`.

Buka `index.html` langsung atau jalankan server lokal dari folder `prototype/`:

```bash
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000`. Tiga nomor resi demo dipetakan ke fixture halaman secara lokal di browser; data status/rute merupakan contoh statis. Prototype bukan koneksi ke database atau API tracking.
