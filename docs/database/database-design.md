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

## Cara menggunakan

1. Buat database PostgreSQL, misalnya `createdb anteraja_tracking`.
2. Dari root repository, jalankan `psql -d anteraja_tracking -f database/schema.sql`.
3. Isi contoh data dengan `psql -d anteraja_tracking -f database/sample_data.sql`.
4. Cari resi menggunakan `SELECT * FROM tracking_summary WHERE waybill_number = '00010242fe8c5a6d1ba2dd792cb16214';`.
5. Ambil timeline berdasarkan `order_id` dari `tracking_events`, urutkan `event_at ASC`. Gunakan event untuk tahap yang mempunyai timestamp; aturan fallback dari status order diterapkan di service jika event belum tersedia.
6. Ambil narasi paling baru dari `ai_narratives` dengan urutan `generated_at DESC LIMIT 1`. Cache API aktif tetap dikelola backend Laravel/Redis.

## Kamus tabel

### `customers` - penerima

| Kolom | Tipe | Keterangan |
|---|---|---|
| `customer_id` | `varchar(32)` | Primary key identifier customer dari dataset. |
| `customer_city` | `varchar(100)` | Kota tujuan yang ditampilkan/disebut dalam narasi. |
| `customer_state` | `char(2)` | Kode wilayah/state opsional dari dataset. |
| `created_at`, `updated_at` | `timestamptz` | Waktu pencatatan/perubahan data master. |

### `sellers` - pengirim/merchant

| Kolom | Tipe | Keterangan |
|---|---|---|
| `seller_id` | `varchar(32)` | Primary key identifier pengirim dari dataset. |
| `seller_city` | `varchar(100)` | Kota asal paket. |
| `seller_state` | `char(2)` | Kode wilayah/state opsional. |
| `created_at`, `updated_at` | `timestamptz` | Waktu pencatatan/perubahan data master. |

### `orders` - transaksi/pengiriman dan nomor resi

| Kolom | Tipe | Keterangan |
|---|---|---|
| `order_id` | `varchar(32)` | Primary key sekaligus `waybill_number`; format string mempertahankan nol di depan. |
| `customer_id` | `varchar(32)` | Foreign key ke `customers`. |
| `order_status` | `varchar(24)` | Status sumber; CHECK membatasi ke status yang disepakati. Sistem logistik yang berwenang memperbaruinya. |
| `order_purchase_timestamp` | `timestamptz` | Waktu pesanan dibuat; milestone pertama. |
| `order_approved_at` | `timestamptz` | Waktu persetujuan pesanan, jika tersedia. |
| `order_delivered_carrier_date` | `timestamptz` | Waktu diserahkan ke kurir/hub; sumber milestone pickup. |
| `order_delivered_customer_date` | `timestamptz` | Waktu diterima pelanggan; milestone delivered dan waktu tiba aktual. |
| `order_estimated_delivery_date` | `date` | Tanggal ETA dari sumber. Jam tampilan dibuat service. |
| `created_at`, `updated_at` | `timestamptz` | Audit pencatatan/perubahan. |

### `order_items` - item transaksi

Primary key gabungan (`order_id`, `order_item_id`) mendukung beberapa barang/seller dalam satu order.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `order_id` | `varchar(32)` | PK bagian dan FK ke `orders`; penghapusan order menghapus item. |
| `order_item_id` | `smallint` | PK bagian nomor baris item, harus positif. |
| `seller_id` | `varchar(32)` | FK ke `sellers`. |
| `price` | `numeric(12,2)` | Nilai item, tidak boleh negatif. |
| `freight_value` | `numeric(12,2)` | Ongkir item, tidak boleh negatif. Nol dapat menandai gratis ongkir sesuai aturan agregasi bisnis. |
| `created_at` | `timestamptz` | Waktu data item dimasukkan. |

### `smart_logistics_context` - konteks operasional terkini

Satu baris maksimal per order pada versi MVP; `order_id` memiliki constraint UNIQUE.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `context_id` | `bigint identity` | Primary key internal. |
| `order_id` | `varchar(32)` | FK unik ke `orders`. |
| `logistics_delay_reason` | `varchar(80)` | `None`, `Weather`, `Traffic Jam`, `Mechanical Failure`, atau alasan operasional lain. |
| `traffic_status` | `varchar(24)` | CHECK: `Clear`, `Moderate`, `Heavy`, `Detour`, `Unknown`. |
| `waiting_time_minutes` | `integer` | Tambahan waktu estimasi, minimum nol. |
| `observed_at` | `timestamptz` | Waktu kondisi tersebut diamati. |
| `created_at`, `updated_at` | `timestamptz` | Audit pencatatan/perubahan konteks. |

### `tracking_events` - riwayat perjalanan

| Kolom | Tipe | Keterangan |
|---|---|---|
| `event_id` | `bigint identity` | Primary key event. |
| `order_id` | `varchar(32)` | FK ke order terkait. |
| `event_code` | `varchar(40)` | Kode event sumber yang stabil dan dapat ditelusuri. |
| `milestone_stage` | `varchar(24)` | Tahap UI opsional: ORDER_CREATED, PICKUP_READY, IN_TRANSIT, DELIVERED, CANCELED. |
| `description` | `varchar(300)` | Pesan aman untuk timeline. |
| `facility_name` | `varchar(120)` | Nama hub/lokasi jika ada. |
| `event_at` | `timestamptz` | Waktu kejadian; tampilkan dalam WIB dan urutkan kronologis. |
| `created_at` | `timestamptz` | Waktu event dimasukkan ke database. |

### `ai_narratives` - keluaran AI dan fallback

Simpan riwayat per generasi agar keberhasilan, fallback, dan latensi dapat diaudit; bukan tempat cache jangka pendek.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `narrative_id` | `bigint identity` | Primary key. |
| `order_id` | `varchar(32)` | FK ke order. |
| `text` | `varchar(500)` | Narasi yang diberikan ke widget. Batas target 150-250 karakter diberlakukan di service/prompt. |
| `is_fallback` | `boolean` | True jika dibuat oleh fallback rule-based. |
| `provider`, `model` | `varchar` | Penyedia/model generator; provider default Gemini. |
| `generation_status` | `varchar(16)` | CHECK: success, fallback, error. |
| `latency_ms` | `integer` | Durasi generasi dalam milidetik, non-negatif. |
| `generated_at` | `timestamptz` | Waktu narasi dibuat. |
| `expires_at` | `timestamptz` | Opsional, masa berlaku bila backend ingin merekam kebijakan cache. |

### `tracking_summary` - view respons pelacakan

View ini menggabungkan order, customer, items, seller, dan konteks operasional. Kolom utama: `waybill_number`, `order_status`, timestamp milestone/ETA, `customer_city`, `seller_city`, total item/ongkir, `has_free_shipping`, data kendala, dan `has_delay`. Nilai delay dihitung; tidak perlu diinput atau diperbarui manual. View dibaca dengan query SELECT dan bukan target penulisan.
