# Functional Requirement Document (FRD) — Fitur F-05
## Dynamic ETA Badge Indicator
**Smart AI Shipment Tracking Widget Anteraja**

---

| Atribut Dokumen | Detail |
| :--- | :--- |
| **Kode Fitur** | **F-05** |
| **Nama Fitur** | **Dynamic ETA Badge Indicator** |
| **Prioritas** | **P1 (Should-Have MVP)** |
| **Dokumen Acuan** | PRD Final v4.0 (Bagian 1, 3, 6, 7) |
| **Tech Stack** | Backend: Laravel 10/11 | DB: PostgreSQL (`orders`) | Frontend: React.js |

---

### 1. Konteks
Fitur Dynamic ETA Badge Indicator (F-05) menyajikan informasi perkiraan tanggal dan perkiraan jam tiba paket secara pasti. Fitur ini dirancang untuk menyelesaikan masalah ketidakpastian estimasi tiba pada PRD Bagian 1, memberikan kepastian penuh bagi penerima B2C dan merchant B2B.

---

### 2. Peran & Hak Akses

| Peran | Lihat | Buat / Ubah | Setujui |
| :--- | :--- | :--- | :--- |
| **Pelanggan (B2C)** | Label badge estimasi tanggal & jam tiba | — | — |
| **Merchant (B2B)** | Label badge estimasi tanggal & jam tiba | — | — |
| **Agen CS Anteraja** | Label badge estimasi tanggal & jam tiba | — | — |

* **Field Terkunci**: `order_estimated_delivery_date` (read-only dari database PostgreSQL).

---

### 3. Alur Sistem (*Workflow*)

1. Backend Laravel mengambil `order_estimated_delivery_date` dari tabel `orders`.
2. JIKA terdapat `waiting_time_minutes` > 0 pada `smart_logistics_context`, backend mengkalkulasi penyesuaian perkiraan jam tiba (BR-05.1).
3. Backend mengformat timestamp menjadi string Bahasa Indonesia terformat (contoh: *"28 September 2017, Est. 18:30 WIB"*) (BR-05.2).
4. Frontend React merender Dynamic ETA Badge di bagian atas widget pelacakan.
5. JIKA paket telah berstatus `DELIVERED`, ubah badge menjadi konfirmasi kedatangan paket (BR-05.3).

---

### 4. Aturan Bisnis (*Business Rules*)

| ID Aturan | Kondisi / Pemicu | Hasil / Aturan Sistem |
| :--- | :--- | :--- |
| **BR-05.1** | Kalkulasi Estimasi Jam Tiba | Perkiraan tanggal diambil dari `order_estimated_delivery_date`. Perkiraan jam default diset pukul `18:00 WIB`, atau ditambah `waiting_time_minutes`. |
| **BR-05.2** | Date Formatting Standard | Format tanggal wajib menggunakan konvensi Indonesia: `{DD} {Nama_Bulan} {YYYY}` (contoh: `28 September 2017`). |
| **BR-05.3** | Badge State saat Delivered | Jika `order_status = 'delivered'`, ubah label badge menjadi: *"Paket Telah Tiba pada {order_delivered_customer_date}"*. |

---

### 5. Istilah Internal (*Glossary*)

| Istilah | Arti dalam Sistem Anteraja |
| :--- | :--- |
| `ETA (Estimated Time of Arrival)` | Perkiraan tanggal dan jam paket tiba di lokasi penerima. |

---

### 6. Data Utama & Status

* **Input Variable**: `order_estimated_delivery_date` (TIMESTAMP NOT NULL).
* **Output Variable**: `formatted_eta_string` (String).

---

### 7. Daftar Fungsi

1. **F-05.1 ETA Formatter Service**: Logika backend untuk mengkalkulasi dan mengformat timestamp estimasi.
2. **F-05.2 ETA Badge Component**: Komponen UI React untuk merender badge estimasi di bagian header widget.

---

### 8. Acceptance Criteria (*AC*) Alur Utama

* **AC-F5.1 (Paket In-Transit - Display ETA)**:
  * **Diberikan** resi dengan `order_estimated_delivery_date = '2017-09-28 00:00:00'`.
  * **Ketika** widget dimuat.
  * **Maka** badge menampilkan: *"Estimasi Tiba: 28 September 2017"*.

* **AC-F5.2 (Paket Telah Tiba - Display Delivery Timestamp)**:
  * **Diberikan** resi yang sudah berstatus `DELIVERED` pada `2017-09-25 14:20:00`.
  * **Ketika** widget dimuat.
  * **Maka** badge berwarna hijau menampilkan: *"Paket Telah Tiba: 25 September 2017, 14:20 WIB"*.

---

### 9. Tidak Termasuk (*Out-of-Scope*)

* Pengubahan tanggal estimasi secara manual oleh pengguna atau kurir.