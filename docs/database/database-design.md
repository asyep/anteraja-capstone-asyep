# Rancangan Database — Smart AI Shipment Tracking Widget Anteraja

## Acuan dan cakupan

Rancangan ini menggunakan PostgreSQL sesuai PRD v4.0 dan FRD master v3.0. Lima tabel sumber yang diwajibkan dipertahankan (`orders`, `order_items`, `sellers`, `customers`, `smart_logistics_context`). `tracking_events` ditambahkan untuk menyimpan jejak kejadian bertimestamp yang dibutuhkan stepper; `ai_narratives` mencatat hasil Gemini/fallback dan telemetry. Cache respons 300 detik tetap berada di Redis, bukan tabel PostgreSQL. UI-state loading/error dan `has_delay`, `current_milestone_stage`, `formatted_eta_string`, `is_free_shipping` adalah nilai turunan/API, bukan atribut yang perlu disimpan.

## Analisis atribut PRD, FRD, dan UI

UI states tersedia di `docs/ui`: dashboard live tracking, status sukses in-transit, warning operasional, serta 404. Elemen yang perlu dipasok API dan sumber datanya:

| Elemen/atribut | Sumber penyimpanan | Aturan/format |
|---|---|---|
| Input / `waybill_number` | `orders.order_id` | PK string 32 karakter, pola alfanumerik; validasi format API. Jangan ubah menjadi integer agar leading zero tetap utuh. |
| `order_status` | `orders.order_status` | Status internal dibatasi CHECK; hanya sistem logistik yang menulis. `shipped`/`in_transit` dianggap tahap transit oleh service. |
| Tahap dan waktu stepper | `tracking_events` + timestamp orders | Tahap visual ORDER_CREATED, PICKUP_READY, IN_TRANSIT, DELIVERED; CANCELED adalah pengecualian. Tampilan WIB hasil konversi dari `timestamptz`. |
| Kota asal/tujuan | `sellers.seller_city`, `customers.customer_city` | Digunakan narasi dan header rute. Order multi-seller dapat punya beberapa kota asal; MVP sample memakai satu seller/order. |
| ETA | `orders.order_estimated_delivery_date` | Tanggal estimasi tersimpan sebagai DATE sesuai dataset sumber; service format Bahasa Indonesia dan memberi jam default 18:00 WIB. Status delivered memakai timestamp aktual. |
| Kendala operasional | `smart_logistics_context.logistics_delay_reason`, `traffic_status`, `waiting_time_minutes` | `has_delay` dihitung bila alasan bukan `None` atau traffic Heavy/Detour. Waktu tunggu menyesuaikan jam estimasi. |
| Narasi AI/fallback | `ai_narratives` | Simpan teks, sumber/model, fallback, status, latensi, waktu generate; Redis menyimpan hasil aktif TTL 300s. |
| Harga/ongkir/promo | `order_items.price`, `freight_value` | NUMERIC non-negatif; total dijumlahkan per order. `has_free_shipping` turunan jika total ongkir 0 (perlu aturan aggregasi eksplisit untuk order multi-item). |
| Search state, error 404/500, loading | Tidak disimpan | State UI/API. 404 untuk order tidak ditemukan, 400 untuk format invalid. |

## Entitas dan relasi

- Satu customer dapat memiliki banyak orders; setiap order menjadi nomor resi.
- Satu order memiliki satu atau lebih item; satu seller dapat memasok banyak item.
- Satu order memiliki maksimal satu snapshot `smart_logistics_context` untuk MVP.
- Satu order dapat memiliki banyak `tracking_events` dan banyak riwayat `ai_narratives`.
- Narasi terakhir dipilih berdasarkan `generated_at DESC`; respons cache disimpan terpisah di Redis.

## Keputusan dan asumsi yang perlu dijaga

1. `order_id` dipakai sebagai `waybill_number`, sesuai glossary dan F-01; varchar 32 dengan PK dan B-tree index otomatis.
2. Lima tabel PRD bernuansa dataset e-commerce generik. `seller_id`/`customer_id` dipertahankan sebagai identifier, sedangkan field alamat rinci yang tidak dipakai FRD tidak ditambahkan.
3. Tanggal ETA pada sumber PRD/FRD dikontrak sebagai `date`; aturan jam default 18:00 WIB ada di service. `waiting_time_minutes` ditambahkan ke jam default. Ini menyelesaikan perbedaan antara contoh tanggal saja dan contoh tanggal+jam.
4. `has_delay` dihitung dari alasan non-None **atau** traffic Heavy/Detour agar aturan FRD master dan F-04 terpenuhi. Kamus nilai distandarkan di service; sumber data contoh memakai `Traffic Jam`, `Weather`, `Mechanical Failure`, `None`.
5. Status domain dalam PRD dataset menyebut `shipped`, sedangkan status makro FRD memakai `in_transit`. Keduanya diterima dan dipetakan ke milestone yang sama; status asli tetap disimpan.
6. FRD meminta narasi 150–250 karakter, tetapi contoh fallback statis bisa lebih pendek dari 150 karakter. Skema menyimpan sampai 500 karakter dan tidak memaksakan batas minimum; validator/prompt service yang perlu mematuhi target panjang tanpa menolak fallback wajib.
7. Waktu disimpan sebagai `timestamptz`; produsen data harus menyertakan timezone. Display FRD dikonversi ke `Asia/Jakarta`/WIB. Data dummy AC yang bersumber dari Brasil diberi offset `-03` sebagai data contoh, bukan waktu Indonesia.
8. Tidak dibuat tabel login/role karena widget public dan autentikasi multi-tenant berada di luar cakupan MVP. Catatan internal CS juga belum memiliki alur/tabel spesifik di UI/FRD MVP.

## Artefak implementasi

- `database/schema.sql`: DDL PostgreSQL, FK, CHECK, indeks, dan view ringkasan.
- `database/sample_data.sql`: data sintetis untuk in-transit normal, delay, delivered, canceled serta narasi fallback/AI.
- `docs/database/erd-smart-tracking.webp`: diagram ERD.

Jalankan pada database kosong dengan `psql -d anteraja_tracking -f database/schema.sql`, lalu `psql -d anteraja_tracking -f database/sample_data.sql`.
