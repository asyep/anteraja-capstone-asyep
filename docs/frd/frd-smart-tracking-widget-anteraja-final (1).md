# Functional Requirement Document (FRD) Final
## Smart AI Shipment Tracking Widget Anteraja
**Format: Standard 9-Section FRD Framework (Master Feature Document)**

---

### Atribut Dokumen
| Atribut | Detail |
| :--- | :--- |
| **Nama Proyek** | Smart AI Shipment Tracking Widget Anteraja |
| **Tipe Dokumen** | **Functional Requirement Document (FRD) Final** |
| **Versi Dokumen** | **v3.0 (Final Approved)** |
| **Dokumen Acuan** | PRD Smart AI Shipment Tracking Widget Anteraja v4.0 Final |
| **Target Deliverable** | Minimum Viable Product (MVP) ~2 Bulan (8 Minggu / 4 Sprints Scrum) |
| **Profil Tim** | 1 Solo Developer (Mahasiswa Sem 5–8 / Fresh Grad / Exp ~1 Tahun) |
| **Tech Stack Wajib** | Frontend: React.js + Tailwind CSS \| Backend: Laravel 10/11 (PHP 8.2+) \| DB: PostgreSQL + Redis \| AI: Gemini LLM API |

---

### 1 · Konteks
Dokumen FRD ini menerjemahkan arah strategis dari **PRD Smart AI Shipment Tracking Widget Anteraja v4.0 Final** menjadi spesifikasi fungsional dan aturan bisnis terperinci. Widget ini dikembangkan untuk mengonversi kode status operasional teknis internal (seperti `IN_TRANSIT_HUB_JKT_TO_SUB_04`, `MANIFESTED`, atau `OUT_FOR_GATEWAY`) menjadi narasi bahasa alami yang ramah dan komunikatif bagi pelanggan B2C, merchant B2B, dan agen CS. Secara spesifik, modul fungsional dalam FRD ini dirancang untuk mendukung pencapaian KPI utama PRD: **menurunkan volume tiket WISMO sebesar 25%–35%** dan menjaga **latensi respons API < 2.0 detik**.

---

### 2 · Peran & Hak Akses

#### 2.1 Matriks Akses Pengguna (*Access Control Matrix*)
| Peran Pengguna | Lihat (*Read*) | Buat / Ubah (*Write/Edit*) | Setujui / Eksekusi (*Execute*) |
| :--- | :--- | :--- | :--- |
| **Pelanggan Penerima (B2C)** | Data resi publik miliknya via `waybill_number` | - | Eksekusi Pencarian Resi |
| **Mitra Penjual / Merchant (B2B)** | Data resi paket kirimannya | - | Eksekusi Pencarian Resi |
| **Agen Customer Service (CS)** | Semua data resi + log operasional + narasi AI | Catatan internal penanganan | Eksekusi Pencarian & Re-generate |
| **Sistem (Backend / AI Engine)** | Seluruh data 5 tabel database | Simpan log, cache, & narasi AI | Trigger Fallback & Redis Caching |

#### 2.2 Field Terkunci (*Locked / Read-Only Fields*)
* **`order_status` / Status Logistik**: Hanya dapat diperbarui oleh sistem internal logistik; tidak dapat diubah oleh pengguna.
* **`waybill_number`**: Terkunci sebagai identifier unik setelah form dikirimkan.
* **`ai_narrative`**: Teks narasi bersifat *read-only*, dihasilkan secara otomatis oleh Gemini LLM API atau Fallback Engine.

---

### 3 · Alur Sistem (*System Workflow*)
1. **Input Resi**: Pengguna memasukkan `waybill_number` (string 32 karakter) pada Search Bar di React Widget.
2. **Request API**: Frontend mengirimkan request `GET /api/v1/tracking/{waybill_number}` ke Backend Laravel.
3. **Validasi Input**: Backend memvalidasi format resi. JIKA format tidak sesuai, sistem mengembalikan `HTTP 400 Bad Request`.
4. **Cek Caching Redis**: Backend mengecek in-memory cache Redis `tracking:waybill:{waybill_number}`.
   * JIKA *Cache Hit* (BR-01), backend langsung mengembalikan respons JSON (<20ms).
   * JIKA *Cache Miss*, backend melanjutkan kueri ke PostgreSQL.
5. **Kueri Data Relasional**: Backend melakukan *relational join* pada 5 tabel (`orders`, `order_items`, `sellers`, `customers`, `smart_logistics_context`). JIKA resi tidak ditemukan (BR-02), kembalikan `HTTP 404 Not Found`.
6. **Pemetaan Milestone**: Backend memetakan timestamp perjalanan resi ke dalam 4 tahapan *Visual Milestone* (BR-03).
7. **Evaluasi Kendala Lapangan**: Backend mengecek atribut `logistics_delay_reason` dan `traffic_status` (BR-04).
8. **Inference AI Narrative**: Backend menyusun prompt terstruktur dan memanggil Gemini LLM API dengan batas timeout 1.2 detik (BR-05).
9. **Penanganan Fallback**: JIKA pemanggilan LLM API melebih 1.2 detik atau error, sistem mengeksekusi *Rule-Based Fallback Engine* (BR-06).
10. **Cache & Output**: Backend menyimpan payload JSON ke Redis (TTL 300s) dan mengembalikan data ke React Widget untuk dirender di browser.

---

### 4 · Aturan Bisnis (*Business Rules*)

| No Aturan | Kondisi / Pemicu | Hasil / Aturan Sistem |
| :--- | :--- | :--- |
| **BR-01** | Data resi aktif ada di Redis Cache (*Cache Hit*) | Sistem langsung mengembalikan respons JSON dari Redis tanpa melakukan kueri ke database PostgreSQL (<20ms latency). |
| **BR-02** | Input `waybill_number` tidak ditemukan di database PostgreSQL | Sistem mengembalikan HTTP 404 Not Found dengan pesan ramah: *"Nomor resi tidak ditemukan. Mohon periksa kembali nomor resi yang Anda masukkan."* |
| **BR-03** | Pemetaan Tahapan Milestone Pengiriman: <br>- `order_purchase_timestamp` terisi <br>- `order_delivered_carrier_date` terisi <br>- `order_status` == `'in_transit'` / `'shipped'` <br>- `order_delivered_customer_date` terisi | Pemetaan Stage Visual Stepper: <br>➔ Stage 1: `ORDER_CREATED` (*Pesanan Dibuat*) <br>➔ Stage 2: `PICKUP_READY` (*Diproses Kurir/Hub*) <br>➔ Stage 3: `IN_TRANSIT` (*Dalam Transit Hub*) <br>➔ Stage 4: `DELIVERED` (*Paket Tiba di Tujuan*) |
| **BR-04** | `logistics_delay_reason` != `'None'` ATAU `traffic_status` IN (`'Heavy'`, `'Detour'`) | Sistem mengaktifkan *flag* `has_delay = true` dan memicu kemunculan *Operational Warning Banner* di bagian atas widget. |
| **BR-05** | Penyusunan Prompt AI ke Gemini LLM API | Teks narasi wajib dalam Bahasa Indonesia komunikatif, panjang **150–250 karakter** (3–4 kalimat), menyebutkan kota asal (`seller_city`), kota tujuan (`customer_city`), dan konteks kendala tanpa istilah teknis internal. |
| **BR-06** | Pemanggilan Gemini API memakan waktu **>1.2 detik** ATAU mengembalikan HTTP Error (5xx/429) | Sistem membatalkan request LLM, memicu *Rule-Based Fallback Engine*, menghasilkan narasi templat statis, dan mengeset `is_fallback = true` tanpa menggagalkan respons API. |
| **BR-07** | Perhitungan Nilai Transaksi & Ongkir | Nilai `price` dan `freight_value` tidak boleh negatif; jika `freight_value` == 0, sistem menandai sebagai promo *Gratis Ongkir*. |

---

### 5 · Istilah Internal (*Glossary*)

| Istilah Internal | Arti & Definisi di Anteraja |
| :--- | :--- |
| **WISMO** | *Where Is My Order?* — Kategori tiket pertanyaan utama pelanggan terkait keberadaan dan posisi paket. |
| **Satria** | Sebutan resmi untuk kurir lapangan Anteraja yang bertugas melakukan *pickup* dan *delivery* paket. |
| **Waybill Number** | Nomor unik resi pengiriman (pada dataset difungsikan dari string `order_id` 32 karakter). |
| **Manifested** | Status operasional saat paket pertama kali didata dan dimasukkan ke dalam sistem ekspedisi. |
| **Hub Transit / Gateway** | Fasilitas pemilahan (*sorting hub*) paket Anteraja antar-wilayah atau antar-kota. |
| **In-Transit** | Status paket yang sedang dalam pergerakan armada pengangkut antar-facility atau menuju hub tujuan. |
| **Out for Delivery** | Status paket yang sudah dibawa oleh kurir Satria menuju alamat penerima akhir. |

---

### 6 · Data Utama & Status (*State Transition Matrix*)

#### 6.1 Daftar Status Makro Pengiriman
* `ORDER_CREATED`: Pesanan baru terdaftar di sistem e-commerce/ekspedisi.
* `PICKUP_READY`: Paket telah diserahkan penjual dan diterima oleh kurir Satria / Hub awal.
* `IN_TRANSIT`: Paket sedang bergerak dalam rute transit antar-hub logistik.
* `DELIVERED`: Paket telah berhasil diserahkan kepada penerima di alamat tujuan.
* `DELAYED` *(Exception State)*: Paket mengalami penundaan sementara akibat cuaca, kemacetan, atau kendala operasional.

#### 6.2 Alur Perpindahan Status (*Allowed State Transitions*)
```
[ Draft ] ──> [ ORDER_CREATED ] ──> [ PICKUP_READY ] ──> [ IN_TRANSIT ] ──> [ DELIVERED ]
                                                              │
                                                              └──> [ DELAYED ] ──> (Resume IN_TRANSIT)
```

---

### 7 · Daftar Fungsi MVP (*Function List*)

| No Fungsi | Nama Fungsi | Deskripsi Singkat 1 Kalimat |
| :--- | :--- | :--- |
| **F-01** | **Resi Search Bar** | Menerima dan memvalidasi input nomor resi 32 karakter secara interaktif. |
| **F-02** | **Visual Milestone Stepper** | Menampilkan stepper diagram garis waktu 4 tahap progres logistik pengiriman. |
| **F-03** | **Smart AI Narrative Box** | Menampilkan teks penjelasan posisi paket berbasis bahasa alami hasil olahan Gemini LLM. |
| **F-04** | **Operational Warning Banner** | Menampilkan alert banner dinamis jika terdapat kendala cuaca atau kemacetan lalu lintas. |
| **F-05** | **Dynamic ETA Badge** | Menampilkan estimasi tanggal dan perkiraan jam tiba paket di lokasi tujuan. |
| **F-06** | **Fallback Engine & Cache Manager** | Menangani generasi narasi templat statis saat LLM timeout dan mengelola in-memory cache Redis. |

---

### 8 · Acceptance Criteria Alur Utama (*Main Flow AC*)

#### AC-F.1 · Pelacakan Normal Berhasil dengan AI Narrative
* **Diberikan**: Resi `00010242fe8c5a6d1ba2dd792cb16214`, `seller_city = 'volta redonda'`, `customer_city = 'campos dos goytacazes'`, status `in_transit`.
* **Ketika**: Pengguna memasukkan resi tersebut dan menekan tombol *"Lacak Paket"*.
* **Maka**: Sistem mengembalikan HTTP 200 OK (<2.0 detik), Milestone Stepper berada pada tahap `IN_TRANSIT`, `is_fallback = false`, dan AI Narrative Box menampilkan: *"Paketmu saat ini sedang dalam perjalanan dari Volta Redonda menuju Campos Dos Goytacazes. Pengiriman berjalan lancar dan diperkirakan tiba sesuai estimasi!"*

#### AC-F.2 · Pelacakan dengan Kendala Keterlambatan
* **Diberikan**: Resi `0008288aa423d2a3f00fcb17cd7d8719` dengan `logistics_delay_reason = 'Traffic Jam'` dan `traffic_status = 'Heavy'`.
* **Ketika**: Pengguna melakukan pencarian resi tersebut.
* **Maka**: Sistem mengembalikan `has_delay = true`, Warning Banner oranye muncul (*"Kondisi Lalu Lintas Padat di Jalur Transit"*), dan AI Narrative memberikan penjelasan situasi kemacetan secara empatik.

#### AC-F.3 · Skenario LLM API Timeout (>1.2 Detik)
* **Diberikan**: Layanan Gemini API mengalami latensi tinggi (>1.2 detik) saat memproses resi `00010242fe8c5a6d1ba2dd792cb16214`.
* **Ketika**: Request diproses oleh backend Laravel `GeminiAIService`.
* **Maka**: Sistem secara otomatis membatalkan request LLM pada detik ke-1.2, memicu `FallbackEngine`, mengeset `is_fallback = true`, dan mengembalikan narasi templat statis dalam waktu total **<1.5 detik** tanpa menginterupsi tampilan UI.

#### AC-F.4 · Resi Tidak Ditemukan
* **Diberikan**: Nomor resi `99999999999999999999999999999999` yang tidak terdaftar di database PostgreSQL.
* **Ketika**: Pengguna menekan tombol *"Lacak Paket"*.
* **Maka**: Sistem mengembalikan HTTP 404 Not Found dan menampilkan pesan error di UI: *"Nomor resi tidak ditemukan. Mohon periksa kembali nomor resi yang Anda masukkan."*

---

### 9 · Tidak Termasuk (*Out-of-Scope List*)
1. Fitur *live-tracking* lokasi GPS kurir Satria secara *real-time* di peta interaktif (diagendakan untuk Fase 2).
2. Prediksi waktu tiba berbasis model *Machine Learning Geospasial* kompleks (diagendakan untuk Fase 2).
3. Modul *Chatbot* interaktif 2 arah (Widget MVP bersifat *read-only* / 1 arah).
4. Integrasi klaim asuransi barang hilang/rusak atau sistem pembayaran COD.
5. Autentikasi multi-tenant / login akun pengguna (Public Tracking Widget).
