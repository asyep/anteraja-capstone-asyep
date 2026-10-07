# Product Requirement Document (PRD) Final
## Smart AI Shipment Tracking Widget Anteraja
**Format: Standard 8-Section PRD Framework (1-Page Executive Format)**

---

### Atribut Dokumen
| Atribut | Detail |
| :--- | :--- |
| **Nama Proyek** | Smart AI Shipment Tracking Widget Anteraja |
| **Versi Dokumen** | v4.0 (Final Approved) |
| **Target Deliverable** | Minimum Viable Product (MVP) ~2 Bulan (8 Minggu / 4 Sprints Scrum) |
| **Profil Tim** | 1 Solo Developer (Mahasiswa Sem 5–8 / Fresh Grad / Exp ~1 Tahun) |
| **Tech Stack Wajib** | Frontend: React.js + Tailwind CSS \| Backend: Laravel 10/11 (PHP 8.2+) \| DB: PostgreSQL + Redis \| AI: Gemini LLM API |

---

### Bagian 1 · Masalah (*Problem Statement*)
* **Apa yang bermasalah sekarang?**
  1. **Tingginya Tiket WISMO**: Lebih dari **40% dari total tiket Customer Service (CS)** Anteraja didominasi oleh pertanyaan berulang mengenai lokasi keberadaan paket (*Where Is My Order?*) [3].
  2. **Friksi Istilah Teknis Operasional**: Sistem pelacakan konvensional menampilkan kode status internal (seperti *"Manifested"*, *"Arrived at Hub Transit JKT-SEL"*, *"Out for Gateway"*, atau `IN_TRANSIT_HUB_JKT_TO_SUB_04`) yang tidak dipahami oleh pengguna awam, memicu kecemasan pengguna (*user anxiety*) dan eskalasi manual ke CS [3, 8].
  3. **Ketidakpastian Estimasi Tiba**: Pengguna hanya diberikan rentang tanggal pengiriman yang terlalu luas tanpa perkiraan waktu/jam tiba yang pasti [3].

---

### Bagian 2 · Pengguna (*User Roles & Quantities*)
* **Siapa yang memakai dan berapa jumlahnya?**
  1. **Pelanggan Penerima Paket (B2C)**: ~15.000+ pengguna aktif/hari yang melacak status resi melalui web/widget Anteraja [1].
  2. **Mitra Penjual / Merchant (B2B)**: ~500+ merchant/hari yang memantau kelancaran pengiriman paket ke pelanggan mereka [1].
  3. **Agen Customer Service (CS)**: ~50 staf CS Anteraja yang membutuhkan acuan status naratif saat menangani kendala eskalasi [3].

---

### Bagian 3 · Tujuan (*Success Metrics & KPIs*)
* **Berhasil itu kalau apa? (Angka + Cara Ukur)**
  1. **Penurunan Tiket WISMO**: Menurunkan volume tiket CS kategori WISMO sebesar **25% – 35%** (target jangka panjang 30–40%) dalam 1 bulan pasca-MVP (diukur dari *CS Ticketing System Log*) [7].
  2. **API Response Latency**: Total latensi pencarian resi + generasi narasi AI **< 2.0 detik** pada *95th percentile* (diukur via *Laravel Telescope / APM*) [9, 10].
  3. **SLA Uptime System**: Ketersediaan *endpoint* pelacakan sebesar **99.9%** (diukur via *Redis Cache Hit Rate & Uptime Monitor*) [10].
  4. **Akurasi Data Status**: **100%** narasi AI sinkron dengan log perjalanan resi di PostgreSQL [5, 6].

---

### Bagian 4 · Lingkup (*Scope: In-Scope vs Out-of-Scope*)
* **Apa yang dibuat (In-Scope MVP) dan apa yang tidak (Out-of-Scope)?**

| Termasuk dalam MVP (~2 Bulan) | TIDAK Termasuk dalam MVP (Phase 2 / Backlog) |
| :--- | :--- |
| Form pencarian resi unik (`waybill_number` / `order_id`) [16]. | Fitur live-tracking GPS kurir secara *real-time* di peta interaktif [12]. |
| Visual Stepper Timeline 4 Tahap (*Order Created → Pickup → In Transit → Delivered*) [5, 7]. | Prediksi keterlambatan berbasis *Machine Learning Geospasial* [12]. |
| Smart AI Status Narrative Generator berbasis Gemini LLM API [6, 8, 10]. | Fitur *Chatbot* interaktif 2 arah (Widget MVP bersifat *read-only*) [7]. |
| Operational Warning Banner jika terjadi kendala cuaca/kemacetan. | Integrasi sistem pembayaran / klaim asuransi barang hilang. |
| Rule-Based Fallback Engine jika LLM API Timeout (>1.2 detik) [10]. | Autentikasi multi-tenant / login akun pengguna. |

---

### Bagian 5 · Batasan (*System Constraints*)
* **Apa yang wajib dipakai dan dipatuhi?**
  1. **Tech Stack Wajib**: Frontend React.js (Tailwind CSS), Backend Laravel 10/11 (PHP 8.2+), Database PostgreSQL, Cache Redis [9, 10].
  2. **Sumber Data Wajib**: Menggunakan integrasi 5 dataset terstruktur (`orders`, `order_items`, `sellers`, `customers`, `smart_logistics_context`) [15, 16, 17].
  3. **Kapasitas SDM & Durasi**: Wajib dikerjakan oleh **1 Solo Developer** dalam batas waktu **8 Minggu (4 Sprints Scrum @ 2 Minggu)** [13, 14].
  4. **Keamanan Data & Kredensial**: Seluruh API Key Gemini dan kredensial Database wajib disimpan di file `.env` dan didaftarkan pada `.gitignore` [11, 12].

---

### Bagian 6 · Skala (*System Scale Metrics*)
* **Seberapa besar skala sistem yang ditangani?**
  1. **Volume Data Resi**: Pemrosesan **10.000+ data resi** dalam database PostgreSQL.
  2. **Target Cache Hit Rate**: **>80%** kueri resi aktif ditangani oleh Redis Cache (TTL 300 detik) untuk menghemat beban kueri DB [10].
  3. **Timeout LLM Limit**: Batas toleransi latensi panggilan Gemini API maksimal **1.2 detik** sebelum beralih ke Fallback Engine [10].
  4. **Panjang Teks Narasi AI**: Maksimal **150 – 250 karakter** (3–4 kalimat) dalam Bahasa Indonesia ramah pengguna [6, 8].
  5. **Ukuran Bundle UI Widget**: Berat komponen frontend React **< 150 KB** agar ringan saat di-embed [9].
  6. **Siklus Rilis**: 4 Sprint iteratif berbasis Scrum [13].

---

### Bagian 7 · Daftar Fitur & Prioritas (*Feature Matrix*)
* **Fitur apa saja, mana yang didahulukan?**

| ID Fitur | Nama Fitur | Prioritas | Deskripsi Fungsional Singkat |
| :--- | :--- | :--- | :--- |
| **F-01** | **Resi Search Bar** | **P0 (Must-Have)** | Form pencarian resi interaktif dengan validasi string 32 karakter [16]. |
| **F-02** | **Visual Milestone Stepper** | **P0 (Must-Have)** | Stepper timeline visual 4 tahapan logistik pengiriman (*Pickup → Transit → Kurir → Delivered*) [5, 7]. |
| **F-03** | **AI Status Narrative Box** | **P0 (Must-Have)** | Kotak teks penjelasan posisi paket berbasis bahasa alami hasil olahan Gemini LLM [6, 8, 10]. |
| **F-04** | **Operational Warning Banner** | **P1 (Should-Have)** | Banner peringatan jika terdapat kendala cuaca/kemacetan di jalur transit. |
| **F-05** | **Dynamic ETA Badge** | **P1 (Should-Have)** | Indikator badge tanggal & perkiraan jam tiba paket [6]. |

---

### Bagian 8 · Keputusan Terbuka (*Open Decisions*)
* **Apa yang belum diputuskan, siapa pemutusnya, dan kapan batas waktunya?**

| No | Pertanyaan / Masalah Terbuka | Pembuat Keputusan | Batas Waktu (*Deadline*) |
| :--- | :--- | :--- | :--- |
| 1 | Pemilihan Varian LLM API: Gemini 1.5 Flash vs Gemini Pro untuk efisiensi latensi dan biaya [10]. | Tech Lead / AI Engineer | Akhir Sprint 1 (Minggu ke-2) |
| 2 | Mekanisme Embedding Widget di React: Apakah via `<iframe/>` atau *Custom Web Component (JS Bundle)* [9]. | Frontend Developer | Akhir Sprint 2 (Minggu ke-4) |
| 3 | Nada Bicara (*Tone of Voice*) Narasi AI: Apakah baku formal atau santai komunikatif khas Anteraja [6, 14]. | Product Owner / Mentor | Akhir Sprint 2 (Minggu ke-4) |
