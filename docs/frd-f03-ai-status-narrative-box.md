# Functional Requirement Document (FRD) — Fitur F-03
## AI Status Narrative Box
**Smart AI Shipment Tracking Widget Anteraja**

---

| Atribut Dokumen | Detail |
| :--- | :--- |
| **Kode Fitur** | **F-03** |
| **Nama Fitur** | **AI Status Narrative Box** |
| **Prioritas** | **P0 (Must-Have MVP)** |
| **Dokumen Acuan** | PRD Final v4.0 (Bagian 1, 3, 4, 6, 7) |
| **Tech Stack** | Backend: Laravel 10/11 + Gemini LLM API | Frontend: React.js | Cache: Redis |

---

### 1. Konteks
Fitur AI Status Narrative Box (F-03) merupakan komponen inti cerdas (*core intelligence*) yang mentransformasikan kode status teknis internal (seperti `IN_TRANSIT_HUB_JKT_TO_SUB_04` atau *"Manifested"*) menjadi narasi kalimat Bahasa Indonesia yang ramah, komunikatif, dan solutif. Fitur ini menangani langsung akar penyebab tiket WISMO pada PRD Bagian 1.

---

### 2. Peran & Hak Akses

| Peran | Lihat | Buat / Ubah | Setujui |
| :--- | :--- | :--- | :--- |
| **Pelanggan (B2C)** | Teks narasi AI posisi paket | — | — |
| **Merchant (B2B)** | Teks narasi AI posisi paket | — | — |
| **Agen CS Anteraja** | Teks narasi AI posisi paket | — | — |

* **Field Terkunci**: `ai_narrative.text`, `ai_narrative.is_fallback` (hanya dihasilkan secara otomatis oleh Gemini LLM API / Fallback Engine).

---

### 3. Alur Sistem (*Workflow*)

1. Backend Laravel menerima kueri pelacakan resi.
2. Service `GeminiAIService` menyusun *Prompt Payload* terstruktur yang menggabungkan `seller_city`, `customer_city`, `current_milestone`, `freight_value`, `logistics_delay_reason`, dan `traffic_status` (BR-03.1).
3. Laravel HTTP Client memanggil Gemini LLM API dengan batas *timeout* diset **1.2 detik** (BR-03.2).
4. JIKA Gemini API merespons dalam <1.2 detik, gunakan teks buatan AI (`is_fallback = false`).
5. JIKA Gemini API timeout (>1.2s) atau mengalami HTTP Error (5xx/429), eksekusi `Rule-Based Fallback Engine` (`is_fallback = true`) (BR-03.3).
6. Teks narasi disimpan di Redis Cache (TTL 300s) dan dikirimkan dalam payload JSON ke frontend.
7. Frontend React merender naskah narasi di dalam kotak dialog ramah berlatar terang dengan avatar Assistant.

---

### 4. Aturan Bisnis (*Business Rules*)

| ID Aturan | Kondisi / Pemicu | Hasil / Aturan Sistem |
| :--- | :--- | :--- |
| **BR-03.1** | Konstruksi Prompt AI | Prompt wajib menginstruksikan LLM berperan sebagai Assistant CS Anteraja yang ramah, menggunakan Bahasa Indonesia sehari-hari yang komunikatif, tanpa kode teknis internal, dan membatasi panjang teks **150 – 250 karakter** (3–4 kalimat). |
| **BR-03.2** | Strict API Timeout | Batas waktu tunggu panggilan Gemini LLM API diset maksimal **1.2 detik** (`Http::timeout(1.2)`). |
| **BR-03.3** | Rule-Based Fallback Logic | JIKA LLM Timeout/Error, sistem wajib mengembalikan narasi statis cadangan:<br>• *Normal*: "Paketmu saat ini sedang dalam perjalanan dari {seller_city} menuju {customer_city} dan diperkirakan tiba sesuai estimasi."<br>• *Kendala*: "Paketmu dalam perjalanan dari {seller_city} ke {customer_city}. Ada sedikit hambatan {delay_reason} di jalur transit, namun kurir Anteraja terus mengupayakan paket tiba tepat waktu." |
| **BR-03.4** | Fallback Flagging | Payload wajib menyertakan flag `is_fallback: true/false` agar sistem dapat memantau performa LLM API via telemetry. |

---

### 5. Istilah Internal (*Glossary*)

| Istilah | Arti dalam Sistem Anteraja |
| :--- | :--- |
| `AI Status Explainer` | Modul AI berbasis LLM yang mentranslasikan log teknis menjadi penjelasan komunikatif. |
| `Fallback Engine` | Engine cadangan berbasis aturan (*rule-based*) untuk menjamin ketersediaan narasi jika LLM API bermasalah. |

---

### 6. Data Utama & Status

* **Output Variable**: `ai_narrative.text` (String 150–250 char), `ai_narrative.is_fallback` (Boolean), `ai_narrative.generated_at` (Timestamp).

---

### 7. Daftar Fungsi

1. **F-03.1 Prompt Payload Builder**: Menyusun variabel logistik menjadi prompt terstruktur.
2. **F-03.2 Gemini LLM Client**: Mengirimkan HTTP request asynchronous ke Gemini API dengan timeout 1.2s.
3. **F-03.3 Rule-Based Fallback Generator**: Menggenerate teks narasi statis jika LLM timeout.
4. **F-03.4 Smart Narrative Card Component**: Komponen React UI yang merender naskah narasi dan avatar.

---

### 8. Acceptance Criteria (*AC*) Alur Utama

* **AC-F3.1 (Generasi Narasi AI Normal - Gemini API Success)**:
  * **Diberikan** resi `00010242fe8c5a6d1ba2dd792cb16214` asal `volta redonda` tujuan `campos dos goytacazes`.
  * **Ketika** Gemini API merespons dalam waktu 0.8 detik.
  * **Maka** UI menampilkan teks narasi ramah AI: *"Paketmu saat ini sedang dalam perjalanan dari Volta Redonda menuju Campos Dos Goytacazes..."*, dan flag `is_fallback = false`.

* **AC-F3.2 (LLM Timeout - Fallback Engine Triggered)**:
  * **Diberikan** Gemini API mengalami latensi tinggi (>1.2 detik).
  * **Ketika** timeout 1.2 detik tercapai.
  * **Maka** sistem secara otomatis memanggil Fallback Engine, menyajikan narasi statis standar, dan mengatur `is_fallback = true` tanpa membatalkan pencarian resi.

* **AC-F3.3 (Panjang Teks Narasi AI)**:
  * **Diberikan** respons teks buatan Gemini API.
  * **Maka** panjang karakter teks berada dalam rentang **150 – 250 karakter** (3–4 kalimat ringkas).

---

### 9. Tidak Termasuk (*Out-of-Scope*)

* Chatbot interaktif dua arah (Widget bersifat 1 arah/read-only pada MVP).
* Generasi suara / text-to-speech audio pada widget.