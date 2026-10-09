# Big Data Delivery Bottleneck Hubs Analysis (Anteraja)

## 1. Dataset & Schema
Dataset `scan_events` diproses menggunakan PySpark untuk menangani volume data scan logistik.
- **Schema**:
  - `hub_id` (string): Kode lokasi hub logistik
  - `package_id` (string): Identitas unik paket
  - `event_type` (string): Tipe scan (`ARRIVAL` / `DEPARTURE`)
  - `timestamp` (timestamp): Waktu pencatatan scan event

## 2. Data Quality Check
Sebelum perhitungan dwell time, pembersihan data dilakukan untuk menjaga akurasi insight:
- **Scan Duplikat**: Dihapus menggunakan deduplikasi `(hub_id, package_id, event_type, timestamp)`.
- **Missing Events**: Ditemukan paket yang hanya memiliki scan `ARRIVAL` tanpa `DEPARTURE` (paket tertahan/unscanned departure) serta `DEPARTURE` tanpa `ARRIVAL`.
- **Invalid Timestamp**: Dieliminasi record di mana timestamp `DEPARTURE` terjadi lebih awal dibanding `ARRIVAL`.

## 3. Hasil Perhitungan Bottleneck Hubs

| hub_id | package_count | avg_dwell_hours | median_dwell_hours |
| :--- | :---: | :---: | :---: |
| **HUB_MKS** | 158 | 10.98 | 10.85 |
| **HUB_SUB** | 142 | 8.42 | 8.35 |
| **HUB_BDG** | 165 | 7.05 | 6.98 |
| **HUB_MES** | 148 | 2.52 | 2.48 |
| **HUB_CGK** | 145 | 2.49 | 2.45 |
| **HUB_JOG** | 142 | 2.51 | 2.50 |

## 4. Business Insight & Rekomendasi Investigasi

**HUB_MKS** memiliki *average dwell time* tertinggi sebesar **10,98 jam** dengan *median dwell time* **10,85 jam** pada total **158 paket**, diikuti oleh **HUB_SUB** (8,42 jam). Selisih yang sangat kecil antara rata-rata dan median mengindikasikan bahwa keterlambatan di HUB_MKS bersifat konsisten secara sistemik pada hampir seluruh paket, bukan disebabkan oleh pencilan (*outlier*). Tim operasional selanjutnya disarankan untuk memfokuskan investigasi pada kapasitas *sorting machine*, kecukupan jumlah tenaga kerja shift malam, serta kelancaran alur perpindahan paket dari area *ARRIVAL* ke armada *DEPARTURE* di HUB_MKS.