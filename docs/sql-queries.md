# Day 14 - SQL: Analisis Data Pengiriman

Query berikut dijalankan langsung ke database PostgreSQL Supabase menggunakan SQL, tanpa Eloquent. Dataset demo dibuat melalui seeder Laravel dan berisi 10 shipment dalam 6 status serta 4 courier. Seluruh shipment contoh dibuat pada Oktober 2026 agar query bulan berjalan menghasilkan data.

> Catatan struktur repo: `database/schema.sql` di root mendefinisikan skema smart tracking (`orders`, `tracking_events`, dan tabel terkait). Tabel `couriers` dan `shipments` untuk latihan ini berasal dari migrasi Laravel di `backend/database/migrations` dan sudah tersedia di Supabase.

Ambang kategori berat pada query `CASE` adalah aturan analisis latihan: Small sampai 1 kg, Medium di atas 1 kg sampai 5 kg, dan Large di atas 5 kg. Ambang ini bukan aturan tarif bisnis.

## 1. Shipment berstatus `in_transit`, dari yang terberat

Query ini menyaring shipment yang sedang dalam perjalanan dan mengurutkannya dari berat tertinggi.

```sql
SELECT tracking_number, weight_kg, status, courier_id
FROM shipments
WHERE status = 'in_transit'
ORDER BY weight_kg DESC;
```

Hasil:

| tracking_number | weight_kg | status | courier_id |
|---|---:|---|---:|
| `66666666666666666666666666666666` | 10.50 | in_transit | 1 |
| `00010242fe8c5a6d1ba2dd792cb16214` | 2.50 | in_transit | 1 |
| `0008288aa423d2a3f00fcb17cd7d8719` | 1.25 | in_transit | 2 |

## 2. Kategori ukuran shipment dengan `CASE`

Query ini mengubah berat numerik menjadi label kategori Small, Medium, atau Large.

```sql
SELECT tracking_number, weight_kg,
       CASE
           WHEN weight_kg <= 1 THEN 'Small'
           WHEN weight_kg <= 5 THEN 'Medium'
           ELSE 'Large'
       END AS size_category
FROM shipments
ORDER BY weight_kg DESC;
```

Hasil:

| tracking_number | weight_kg | size_category |
|---|---:|---|
| `66666666666666666666666666666666` | 10.50 | Large |
| `88888888888888888888888888888888` | 6.75 | Large |
| `22222222222222222222222222222222` | 4.00 | Medium |
| `44444444444444444444444444444444` | 3.20 | Medium |
| `00010242fe8c5a6d1ba2dd792cb16214` | 2.50 | Medium |
| `77777777777777777777777777777777` | 1.90 | Medium |
| `0008288aa423d2a3f00fcb17cd7d8719` | 1.25 | Medium |
| `11111111111111111111111111111111` | 0.75 | Small |
| `33333333333333333333333333333333` | 0.30 | Small |
| `55555555555555555555555555555555` | 0.10 | Small |

## 3. Total shipment per courier pada bulan ini

Query ini menghitung shipment yang `created_at`-nya berada pada bulan kalender saat query dijalankan, lalu mengelompokkannya per courier.

```sql
SELECT c.name AS courier, COUNT(s.id) AS shipment_count
FROM couriers AS c
JOIN shipments AS s ON s.courier_id = c.id
WHERE s.created_at >= date_trunc('month', CURRENT_DATE)
  AND s.created_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
GROUP BY c.id, c.name
ORDER BY c.id;
```

Hasil pada Oktober 2026:

| courier | shipment_count |
|---|---:|
| Satria Demo 01 | 4 |
| Satria Demo 02 | 3 |
| Satria Demo 03 | 3 |
