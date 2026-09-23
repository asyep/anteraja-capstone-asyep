# Functional Requirement Document (FRD) — Fitur F-04
## Operational Warning Banner
**Smart AI Shipment Tracking Widget Anteraja**

---

| Atribut Dokumen | Detail |
| :--- | :--- |
| **Kode Fitur** | **F-04** |
| **Nama Fitur** | **Operational Warning Banner** |
| **Prioritas** | **P1 (Should-Have MVP)** |
| **Dokumen Acuan** | PRD Final v4.0 (Bagian 1, 4, 5, 7) |
| **Tech Stack** | Backend: Laravel 10/11 | DB: PostgreSQL (`smart_logistics_context`) | Frontend: React.js |

---

### 1. Konteks
Fitur Operational Warning Banner (F-04) berfungsi memberikan penanda peringatan visual yang transparan jika terjadi kendala operasional lapangan (seperti cuaca buruk, kemacetan, atau kendala kendaraan transit). Fitur ini menjawab PRD Bagian 1 & 5 untuk menjaga transparansi dan kepercayaan pelanggan saat terjadi keterlambatan.

---

### 2. Peran & Hak Akses

| Peran | Lihat | Buat / Ubah | Setujui |
| :--- | :--- | :--- | :--- |
| **Pelanggan (B2C)** | Banner peringatan kendala | — | — |
| **Merchant (B2B)** | Banner peringatan kendala | — | — |
| **Agen CS Anteraja** | Banner peringatan kendala | — | — |

* **Field Terkunci**: `has_delay`, `delay_reason`, `traffic_status` (hanya dievaluasi oleh sistem backend).

---

### 3. Alur Sistem (*Workflow*)

1. Backend Laravel membaca data kondisi operasional dari tabel `smart_logistics_context`.
2. JIKA `logistics_delay_reason` bernilai bukan `None` (misal `Weather` atau `Traffic`), backend mengeset flag `has_delay = true` (BR-04.1).
3. Backend menyertakan objek `operational_context` dalam JSON API response.
4. Frontend React memeriksa variabel `has_delay`.
5. JIKA `has_delay = true`, tampilkan Warning Banner berwarna kuning/oranye di atas Narrative Box (BR-04.2).
6. JIKA `has_delay = false`, Warning Banner disembunyikan (*hidden*).

---

### 4. Aturan Bisnis (*Business Rules*)

| ID Aturan | Kondisi / Pemicu | Hasil / Aturan Sistem |
| :--- | :--- | :--- |
| **BR-04.1** | Pemicu Flag Keterlambatan | Flag `has_delay = true` dipicu jika `logistics_delay_reason` berisi salah satu nilai: `Weather`, `Traffic`, atau `Mechanical Failure`. |
| **BR-04.2** | Styling Warning Banner | Banner wajib menggunakan warna latar perhatian (Kuning `#F59E0B` / Oranye `#F97316`) lengkap dengan ikon peringatan (*warning icon*). |
| **BR-04.3** | Naskah Ringkasan Banner | Banner menampilkan teks ringkasan kendala:<br>*"Perhatian: Terdapat kendala {delay_reason} (Kondisi Lalu Lintas: {traffic_status}) di jalur transit."* |

---

### 5. Istilah Internal (*Glossary*)

| Istilah | Arti dalam Sistem Anteraja |
| :--- | :--- |
| `smart_logistics_context` | Tabel log pemantauan kondisi operasional armada, cuaca, dan kemacetan jalan. |
| `has_delay` | Indicator boolean yang menandakan adanya kendala operasional aktif pada pengiriman. |

---

### 6. Data Utama & Status

* **Operational Variables**: `has_delay` (Boolean), `delay_reason` (String), `traffic_status` (String), `waiting_time_minutes` (Int).

---

### 7. Daftar Fungsi

1. **F-04.1 Operational Context Evaluator**: Logika backend yang memfilter dan mengeset flag keterlambatan.
2. **F-04.2 Warning Banner Component**: Komponen UI React yang merender alert banner dinamis.

---

### 8. Acceptance Criteria (*AC*) Alur Utama

* **AC-F4.1 (Pengiriman Mengalami Kendala - Banner Tampil)**:
  * **Diberikan** resi dengan `logistics_delay_reason = 'Traffic Jam'` dan `traffic_status = 'Heavy'`.
  * **Ketika** data pelacakan dimuat di widget.
  * **Maka** Warning Banner berwarna oranye muncul di atas Narrative Box dengan teks: *"Perhatian: Terdapat kendala Traffic Jam (Kondisi Lalu Lintas: Heavy) di jalur transit."*

* **AC-F4.2 (Pengiriman Lancar - Banner Disembunyikan)**:
  * **Diberikan** resi dengan `logistics_delay_reason = 'None'` dan `traffic_status = 'Clear'`.
  * **Ketika** data pelacakan dimuat di widget.
  * **Maka** Warning Banner tidak ditampilkan pada antarmuka widget.

---

### 9. Tidak Termasuk (*Out-of-Scope*)

* Fitur pengajuan komplain atau klaim asuransi keterlambatan langsung dari banner.