# Functional Requirement Document (FRD) — Fitur F-01
## Resi Search Bar & Validation
**Smart AI Shipment Tracking Widget Anteraja**

---

| Atribut Dokumen | Detail |
| :--- | :--- |
| **Kode Fitur** | **F-01** |
| **Nama Fitur** | **Resi Search Bar & Validation** |
| **Prioritas** | **P0 (Must-Have MVP)** |
| **Dokumen Acuan** | PRD Final v4.0 (Bagian 4, 6, 7) |
| **Tech Stack** | Frontend: React.js (Tailwind CSS) | Backend: Laravel 10/11 | Cache: Redis |

---

### 1. Konteks
Fitur Resi Search Bar & Validation (F-01) berfungsi sebagai pintu masuk utama pelacakan resi pada Smart AI Shipment Tracking Widget Anteraja. Fitur ini menerima input nomor resi unik (`waybill_number` / `order_id`), memvalidasi format string secara instan, dan melakukan kueri pencarian data berlatensi rendah (<2.0 detik) menggunakan Redis Caching untuk mendukung sasaran penekanan tiket WISMO pada PRD Bagian 3.

---

### 2. Peran & Hak Akses

| Peran | Lihat | Buat / Ubah | Setujui |
| :--- | :--- | :--- | :--- |
| **Pelanggan (B2C)** | Data resi yang diinputkan | — | — |
| **Merchant (B2B)** | Data resi pengiriman tokonya | — | — |
| **Agen CS Anteraja** | Seluruh data resi pelanggan | — | — |

* **Field Terkunci**: `waybill_number` (read-only setelah dikirim), `order_status` (hanya diubah oleh sistem internal).

---

### 3. Alur Sistem (*Workflow*)

1. Pengguna membuka widget pelacakan dan memasukkan string nomor resi pada form input `waybill_number`.
2. Frontend React memvalidasi format string (alphanumeric 32 karakter). JIKA tidak sesuai, tampilkan pesan error instan (BR-01.2).
3. Pengguna menekan tombol **"Lacak Paket"** atau menekan tombol `Enter`.
4. State tombol berubah menjadi `loading = true` dan tombol di-disable untuk mencegah double submission (BR-01.6).
5. Frontend mengirimkan request HTTP `GET /api/v1/tracking/{waybill_number}` ke Laravel Backend.
6. Backend Laravel melakukan lookup pada Redis Cache dengan key `tracking:waybill:{waybill_number}`.
7. JIKA **Cache Hit** (BR-01.3), backend langsung mengembalikan respons JSON (<20ms).
8. JIKA **Cache Miss**, backend melakukan kueri relational join ke PostgreSQL DB (BR-01.4).
9. JIKA resi tidak terdaftar di DB, backend mengembalikan `HTTP 404 Not Found` (BR-01.5).
10. JIKA resi ditemukan, backend menyimpan payload di Redis (TTL 300s) dan mengembalikan `HTTP 200 OK`.

---

### 4. Aturan Bisnis (*Business Rules*)

| ID Aturan | Kondisi / Pemicu | Hasil / Aturan Sistem |
| :--- | :--- | :--- |
| **BR-01.1** | Format Input Resi | String wajib alphanumeric persis 32 karakter (format MD5 ID resi Olist / Anteraja). |
| **BR-01.2** | Validasi Input Field | Validasi wajib dilakukan secara *double-check*: Client-side Regex di React & Server-side FormRequest di Laravel. |
| **BR-01.3** | Caching Lookup Strategy | Pengecekan Redis Cache `tracking:waybill:{id}` wajib dilakukan sebelum kueri DB. TTL cache diset 300 detik (5 menit). |
| **BR-01.4** | Optimization Database Query | Kueri PostgreSQL wajib memanfaatkan B-Tree Indexing pada kolom `order_id` dengan latensi execution <100ms. |
| **BR-01.5** | Handling Resi Tidak Ditemukan | Jika resi tidak ada di DB, kembalikan `HTTP 404` dengan pesan ramah pengguna: *"Nomor resi tidak ditemukan, mohon periksa kembali input Anda."* |
| **BR-01.6** | Multi-Submit Protection | Saat proses request berlangsung (`loading = true`), tombol submit wajib terkunci (*disabled*) untuk menghindari *race condition*. |

---

### 5. Istilah Internal (*Glossary*)

| Istilah | Arti dalam Sistem Anteraja |
| :--- | :--- |
| `waybill_number` | Nomor resi unik pelacakan paket Anteraja (`order_id` 32 karakter pada database). |
| `Cache Hit` | Kondisi di mana data resi sudah tersedia di RAM Redis sehingga tidak membebani database PostgreSQL. |
| `Rate Limit` | Batasan keamanan maksimal 30 request/menit per IP address untuk mencegah serangan spam. |

---

### 6. Data Utama & Status

* **Input Variable**: `waybill_number` (VARCHAR 32, Required).
* **State UI Matrix**: `Idle` → `Validating` → `Loading` → `Success` / `Error_404` / `Error_500`.

---

### 7. Daftar Fungsi

1. **F-01.1 Form Input Resi Component**: Menerima dan memvalidasi string resi 32 karakter pada antarmuka React.
2. **F-01.2 Tracking API Client**: Mengirimkan HTTP request asynchronous ke Laravel backend.
3. **F-01.3 Fast Redis Caching Engine**: Memproses lookup cache instan untuk resi aktif.

---

### 8. Acceptance Criteria (*AC*) Alur Utama

* **AC-F1.1 (Pencarian Resi Valid - Normal)**:
  * **Diberikan** pengguna memasukkan nomor resi valid `00010242fe8c5a6d1ba2dd792cb16214`.
  * **Ketika** pengguna menekan tombol "Lacak Paket".
  * **Maka** sistem menampilkan indikator loading, memanggil API, dan menyajikan data pelacakan lengkap dalam waktu <2.0 detik.

* **AC-F1.2 (Input Resi Tidak Valid - Client Validation)**:
  * **Diberikan** pengguna memasukkan string resi pendek `12345` (kurang dari 32 karakter).
  * **Ketika** pengguna menekan tombol "Lacak Paket".
  * **Maka** sistem tidak mengirim request HTTP, dan langsung menampilkan pesan validator merah: *"Nomor resi harus 32 karakter"*.

* **AC-F1.3 (Resi Tidak Terdaftar - HTTP 404)**:
  * **Diberikan** pengguna memasukkan resi 32 karakter yang tidak terdaftar `ffffffffffffffffffffffffffffffff`.
  * **Ketika** pengguna menekan tombol "Lacak Paket".
  * **Maka** API mengembalikan HTTP 404, dan UI menampilkan pesan: *"Nomor resi tidak ditemukan, mohon periksa kembali input Anda."*

* **AC-F1.4 (Pencegahan Double Click - Anti Spam)**:
  * **Diberikan** koneksi internet lambat.
  * **Ketika** pengguna menekan tombol "Lacak Paket" 3 kali secara cepat.
  * **Maka** tombol langsung ter-disable pada klik pertama, dan hanya 1 HTTP request yang dikirimkan ke server.

---

### 9. Tidak Termasuk (*Out-of-Scope*)

* Pemindaian nomor resi berbasis kamera/QR code.
* Pencarian resi secara masif sekaligus (*bulk search*).
* Penyimpanan riwayat pencarian resi yang terhubung ke akun login pengguna.