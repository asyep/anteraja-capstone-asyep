# Panduan Database PostgreSQL

## Setup

Jalankan pada database PostgreSQL kosong dari root repository:

```sh
createdb anteraja_tracking
psql -d anteraja_tracking -f database/schema.sql
psql -d anteraja_tracking -f database/sample_data.sql
```

Lihat ringkasan satu resi dengan:

```sql
SELECT * FROM tracking_summary
WHERE waybill_number = '00010242fe8c5a6d1ba2dd792cb16214';
```

Timeline dapat dibaca dari `tracking_events` berdasarkan `order_id`, urutkan `event_at ASC`. Narasi terkini dapat dibaca dari `ai_narratives` dengan `generated_at DESC LIMIT 1`. Cache respons TTL 300 detik berada di Redis, bukan PostgreSQL.

## Informasi tabel

### `customers` - penerima

| Kolom | Tipe | Informasi |
|---|---|---|
| `customer_id` | varchar(32), PK | ID customer dari dataset. |
| `customer_city` | varchar(100) | Kota tujuan untuk rute dan narasi. |
| `customer_state` | char(2) | Kode wilayah opsional. |
| `created_at`, `updated_at` | timestamptz | Audit waktu data master. |

### `sellers` - pengirim/merchant

| Kolom | Tipe | Informasi |
|---|---|---|
| `seller_id` | varchar(32), PK | ID seller dari dataset. |
| `seller_city` | varchar(100) | Kota asal untuk rute dan narasi. |
| `seller_state` | char(2) | Kode wilayah opsional. |
| `created_at`, `updated_at` | timestamptz | Audit waktu data master. |

### `orders` - resi dan pengiriman

| Kolom | Tipe | Informasi |
|---|---|---|
| `order_id` | varchar(32), PK | Nomor resi (`waybill_number`); string mempertahankan angka nol di depan. |
| `customer_id` | varchar(32), FK | Relasi ke penerima. |
| `order_status` | varchar(24) | Status sumber dengan CHECK constraint; diperbarui sistem logistik. |
| `order_purchase_timestamp` | timestamptz | Waktu order dibuat / milestone awal. |
| `order_approved_at` | timestamptz | Waktu persetujuan jika tersedia. |
| `order_delivered_carrier_date` | timestamptz | Waktu serah ke kurir/hub. |
| `order_delivered_customer_date` | timestamptz | Waktu tiba aktual, sumber milestone delivered. |
| `order_estimated_delivery_date` | date | Tanggal estimasi sumber; jam default dibentuk oleh service. |
| `created_at`, `updated_at` | timestamptz | Audit pencatatan/perubahan. |

### `order_items` - item dan ongkos kirim

PK gabungan: (`order_id`, `order_item_id`), sehingga order dapat berisi beberapa item/seller.

| Kolom | Tipe | Informasi |
|---|---|---|
| `order_id` | varchar(32), PK/FK | Relasi ke `orders`; item terhapus bersama order. |
| `order_item_id` | smallint, PK | Nomor baris item, harus positif. |
| `seller_id` | varchar(32), FK | Relasi ke `sellers`. |
| `price` | numeric(12,2) | Harga barang, tidak boleh negatif. |
| `freight_value` | numeric(12,2) | Ongkir item, tidak boleh negatif. |
| `created_at` | timestamptz | Waktu item dicatat. |

### `smart_logistics_context` - kondisi operasional terkini

Maksimal satu snapshot per order untuk kebutuhan MVP.

| Kolom | Tipe | Informasi |
|---|---|---|
| `context_id` | bigint identity, PK | ID internal konteks. |
| `order_id` | varchar(32), FK/UNIQUE | Relasi unik ke satu order. |
| `logistics_delay_reason` | varchar(80) | None atau alasan kendala seperti Weather, Traffic Jam, Mechanical Failure. |
| `traffic_status` | varchar(24) | Clear, Moderate, Heavy, Detour, atau Unknown. |
| `waiting_time_minutes` | integer | Penyesuaian ETA dalam menit; minimum nol. |
| `observed_at` | timestamptz | Waktu kondisi diamati. |
| `created_at`, `updated_at` | timestamptz | Audit pencatatan/perubahan. |

### `tracking_events` - riwayat timeline

| Kolom | Tipe | Informasi |
|---|---|---|
| `event_id` | bigint identity, PK | ID kejadian. |
| `order_id` | varchar(32), FK | Order yang mengalami kejadian. |
| `event_code` | varchar(40) | Kode kejadian operasional. |
| `milestone_stage` | varchar(24) | ORDER_CREATED, PICKUP_READY, IN_TRANSIT, DELIVERED, CANCELED. |
| `description` | varchar(300) | Keterangan untuk ditampilkan. |
| `facility_name` | varchar(120) | Nama fasilitas jika tersedia. |
| `event_at` | timestamptz | Waktu kejadian; urutkan kronologis dan format ke WIB. |
| `created_at` | timestamptz | Waktu event direkam di database. |

### `ai_narratives` - narasi dan telemetry AI

| Kolom | Tipe | Informasi |
|---|---|---|
| `narrative_id` | bigint identity, PK | ID hasil generasi. |
| `order_id` | varchar(32), FK | Order terkait. |
| `text` | varchar(500) | Teks narasi; target 150-250 karakter divalidasi di service. |
| `is_fallback` | boolean | True jika teks dibuat fallback rule-based. |
| `provider`, `model` | varchar | Sumber/model generasi. |
| `generation_status` | varchar(16) | success, fallback, atau error. |
| `latency_ms` | integer | Latensi generasi, non-negatif. |
| `generated_at` | timestamptz | Waktu dibuat. |
| `expires_at` | timestamptz | Waktu kedaluwarsa opsional untuk kebijakan cache. |

### `tracking_summary` - view ringkasan tracking

View baca gabungan order, customer, item/seller, dan konteks operasional. Menyediakan nomor resi, status/tanggal, kota asal/tujuan, total harga/ongkir, `has_free_shipping`, data kendala, serta `has_delay`. Nilai turunan tidak ditulis manual; view bukan target penulisan.

## Aturan integrasi

- `order_id` menjadi nomor resi unik string 32 karakter, sesuai FRD F-01.
- `shipped` dan `in_transit` sama-sama dipetakan service ke milestone transit; status asal tetap disimpan.
- `has_delay` true jika alasan bukan `None` atau traffic bernilai `Heavy`/`Detour`.
- Timestamp disimpan dengan zona waktu; service mengubah tampilan milestone ke WIB.
- Jika butuh banyak snapshot konteks per order, hapus UNIQUE pada `order_id` dan gunakan `observed_at` untuk memilih snapshot terbaru.
- `has_delay`, `current_milestone_stage`, format ETA, state loading, dan error HTTP dihitung/ditangani service/UI, bukan tabel.
