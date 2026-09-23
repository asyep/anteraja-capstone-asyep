# Functional Requirement Document (FRD) — Fitur F-02
## Visual Milestone Stepper
**Smart AI Shipment Tracking Widget Anteraja**

---

| Atribut Dokumen | Detail |
| :--- | :--- |
| **Kode Fitur** | **F-02** |
| **Nama Fitur** | **Visual Milestone Stepper** |
| **Prioritas** | **P0 (Must-Have MVP)** |
| **Dokumen Acuan** | PRD Final v4.0 (Bagian 4, 6, 7) |
| **Tech Stack** | Frontend: React.js (Tailwind CSS) | Backend: Laravel 10/11 | DB: PostgreSQL |

---

### 1. Konteks
Fitur Visual Milestone Stepper (F-02) menyajikan diagram garis waktu (*stepper timeline*) visual 4 tahapan logistik pengiriman. Fitur ini dirancang untuk mengubah persepsi status teknis yang rumit menjadi indikator progres visual sekuensial yang transparan guna mengurangi kecemasan pengguna (*user anxiety*), merujuk pada PRD Bagian 1 & 3.

---

### 2. Peran & Hak Akses

| Peran | Lihat | Buat / Ubah | Setujui |
| :--- | :--- | :--- | :--- |
| **Pelanggan (B2C)** | Diagram stepper progres resi | — | — |
| **Merchant (B2B)** | Diagram stepper progres resi | — | — |
| **Agen CS Anteraja** | Diagram stepper progres resi | — | — |

* **Field Terkunci**: `current_milestone_stage`, `timeline.completed`, `timeline.timestamp` (hanya dihitung oleh logika backend).

---

### 3. Alur Sistem (*Workflow*)

1. Widget menerima payload JSON dari API response `GET /api/v1/tracking/{waybill_number}`.
2. Backend Laravel telah memetakan status database ke 4 tahap sekuensial (BR-02.1).
3. Component React `<VisualMilestoneStepper />` merender 4 node tahapan sekuensial.
4. JIKA suatu tahapan telah dilalui (`completed = true`), node dirender dengan warna hijau Anteraja `#10B981` dan ikon centang (BR-02.2).
5. JIKA suatu tahapan merupakan posisi terkini (*current stage*), node diberi efek animasi pulsa (*active state*).
6. JIKA status resi `canceled`, seluruh stepper berubah menjadi indikator merah peringatan (BR-02.3).

---

### 4. Aturan Bisnis (*Business Rules*)

| ID Aturan | Kondisi / Pemicu | Hasil / Aturan Sistem |
| :--- | :--- | :--- |
| **BR-02.1** | Pemetaan 4 Tahap Milestone | Logika backend memetakan status ke 4 tahap sekuensial:<br>1. `ORDER_CREATED`: `order_purchase_timestamp`<br>2. `PICKUP_READY`: `order_delivered_carrier_date`<br>3. `IN_TRANSIT`: `order_status = 'in_transit'` / `'shipped'`<br>4. `DELIVERED`: `order_delivered_customer_date` NOT NULL. |
| **BR-02.2** | Urutan Sekuensial Stepper | Milestone Stage N hanya berstatus `completed = true` jika Stage N-1 telah bernilai `completed = true`. |
| **BR-02.3** | Handling Status Pembatalan | Jika `order_status = 'canceled'`, stepper menampilkan badge merah *"Pengiriman Dibatalkan"* dan menghentikan progres stepper. |
| **BR-02.4** | Timestamp Formatting | Setiap node completed wajib menampilkan timestamp terformat dalam Waktu Indonesia Barat (WIB), contoh: `19 Sep 2017, 09:45 WIB`. |

---

### 5. Istilah Internal (*Glossary*)

| Istilah | Arti dalam Sistem Anteraja |
| :--- | :--- |
| `Milestone Stage` | Tahapan besar visual perjalanan paket dari pengirim hingga penerima. |
| `Carrier Date` | Waktu penyerahan paket dari seller/pengirim ke kurir Satria / Sorting Hub Anteraja. |

---

### 6. Data Utama & Status

* **Status Sequence**: `ORDER_CREATED` → `PICKUP_READY` → `IN_TRANSIT` → `DELIVERED` (atau `CANCELED`).

---

### 7. Daftar Fungsi

1. **F-02.1 Milestone Stage Mapper**: Service Laravel yang mengelompokkan timestamp database ke 4 milestone.
2. **F-02.2 Stepper Progress Component**: Komponen UI React yang merender diagram garis waktu horizontal/vertikal responsif.

---

### 8. Acceptance Criteria (*AC*) Alur Utama

* **AC-F2.1 (Status Paket In-Transit - Normal)**:
  * **Diberikan** resi `00010242fe8c5a6d1ba2dd792cb16214` berstatus `in_transit` dengan `order_purchase_timestamp` dan `order_delivered_carrier_date` terisi.
  * **Ketika** widget dimuat.
  * **Maka** Stage 1 (`Pesanan Dibuat`), Stage 2 (`Diproses Kurir`), dan Stage 3 (`Dalam Perjalanan`) bertanda hijau centang, sedangkan Stage 4 (`Tiba di Tujuan`) berwarna abu-abu (belum selesai).

* **AC-F2.2 (Status Paket Delivered)**:
  * **Diberikan** resi dengan `order_delivered_customer_date` NOT NULL (`2017-09-28 15:00:00`).
  * **Ketika** widget dimuat.
  * **Maka** ke-4 Stage bertanda hijau centang completed, dan Stage 4 menampilkan tanggal dan jam tiba paket.

* **AC-F2.3 (Status Paket Dibatalkan)**:
  * **Diberikan** resi dengan `order_status = 'canceled'`.
  * **Ketika** widget dimuat.
  * **Maka** stepper menampilkan indikator merah dengan keterangan *"Pengiriman Dibatalkan"*.

---

### 9. Tidak Termasuk (*Out-of-Scope*)

* Pelacakan koordinat GPS posisi armada kurir secara live di peta (Out-of-scope MVP).
* Pengubahan urutan milestone oleh pengguna.