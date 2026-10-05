# Day 14 - SQL: Analisis Data Pengiriman

Query berikut dijalankan langsung ke database PostgreSQL Supabase menggunakan SQL, tanpa Eloquent. Dataset demo dibuat melalui seeder Laravel dan berisi 26 shipment dalam 8 status serta 25 courier. Seluruh shipment contoh dibuat pada Oktober 2026 agar query bulan berjalan menghasilkan data.

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
| `ina20260927mdnbpn000000000000003` | 12.25 | in_transit | 6 |
| `66666666666666666666666666666666` | 10.50 | in_transit | 1 |
| `ina20260930subpku000000000000005` | 5.60 | in_transit | 8 |
| `ina20260930bjmsoc000000000000011` | 4.55 | in_transit | 14 |
| `ina20260929bthdpk000000000000014` | 2.65 | in_transit | 17 |
| `00010242fe8c5a6d1ba2dd792cb16214` | 2.50 | in_transit | 1 |
| `0008288aa423d2a3f00fcb17cd7d8719` | 1.25 | in_transit | 2 |
| `ina20260926plmmlg000000000000004` | 0.85 | in_transit | 7 |

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
| `ina20260925bpnbth000000000000010` | 15.20 | Large |
| `ina20260927mdnbpn000000000000003` | 12.25 | Large |
| `66666666666666666666666666666666` | 10.50 | Large |
| `ina20261002mdcbog000000000000013` | 9.80 | Large |
| `ina20260922mlgbjm000000000000007` | 7.35 | Large |
| `88888888888888888888888888888888` | 6.75 | Large |
| `ina20260930subpku000000000000005` | 5.60 | Large |
| `ina20260930bjmsoc000000000000011` | 4.55 | Medium |
| `22222222222222222222222222222222` | 4.00 | Medium |
| `ina20260928pkupnk000000000000008` | 3.75 | Medium |
| `ina20260918bogbks000000000000016` | 3.40 | Medium |
| `44444444444444444444444444444444` | 3.20 | Medium |
| `ina20260929bksupg000000000000002` | 2.80 | Medium |
| `ina20260929bthdpk000000000000014` | 2.65 | Medium |
| `00010242fe8c5a6d1ba2dd792cb16214` | 2.50 | Medium |
| `ina20260924smgpdg000000000000006` | 2.10 | Medium |
| `77777777777777777777777777777777` | 1.90 | Medium |
| `ina20260928cgkbdo000000000000001` | 1.40 | Medium |
| `0008288aa423d2a3f00fcb17cd7d8719` | 1.25 | Medium |
| `ina20260920pnkcbn000000000000012` | 1.05 | Medium |
| `ina20260926plmmlg000000000000004` | 0.85 | Small |
| `11111111111111111111111111111111` | 0.75 | Small |
| `ina20260923pdgmdc000000000000009` | 0.45 | Small |
| `33333333333333333333333333333333` | 0.30 | Small |
| `ina20261003cbntng000000000000015` | 0.20 | Small |
| `55555555555555555555555555555555` | 0.10 | Small |

Jumlah per kategori: Large 7, Medium 13, Small 6.

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
| Satria Demo 04 | 1 |
| Satria Demo 05 | 1 |
| Satria Demo 06 | 1 |
| Satria Demo 07 | 1 |
| Satria Demo 08 | 1 |
| Satria Demo 09 | 1 |
| Satria Demo 10 | 1 |
| Satria Demo 11 | 1 |
| Satria Demo 12 | 1 |
| Satria Demo 13 | 1 |
| Satria Demo 14 | 1 |
| Satria Demo 15 | 1 |
| Satria Demo 16 | 1 |
| Satria Demo 17 | 1 |
| Satria Demo 18 | 1 |
| Satria Demo 19 | 1 |

## 4. Rata-rata berat per status

Query ini menggunakan `AVG` dan `GROUP BY` untuk membandingkan berat rata-rata shipment pada setiap status.

```sql
SELECT status, ROUND(AVG(weight_kg), 2) AS avg_weight_kg
FROM shipments
GROUP BY status
ORDER BY status;
```

Hasil:

| status | avg_weight_kg |
|---|---:|
| approved | 1.40 |
| canceled | 3.22 |
| created | 0.25 |
| delivered | 2.46 |
| in_transit | 5.02 |
| processing | 5.27 |
| shipped | 10.98 |
| unavailable | 0.45 |

## 5. Courier dengan lebih dari dua shipment (`HAVING`)

Query ini menyaring hasil agregasi setelah menghitung shipment, sehingga hanya courier dengan lebih dari dua shipment yang ditampilkan.

```sql
SELECT c.name AS courier, COUNT(s.id) AS shipment_count
FROM couriers AS c
JOIN shipments AS s ON s.courier_id = c.id
GROUP BY c.id, c.name
HAVING COUNT(s.id) > 2
ORDER BY shipment_count DESC, c.name;
```

Hasil:

| courier | shipment_count |
|---|---:|
| Satria Demo 01 | 4 |
| Satria Demo 02 | 3 |
| Satria Demo 03 | 3 |

## 6. Semua courier, termasuk yang belum menerima shipment (`LEFT JOIN`)

Query ini mempertahankan semua baris `couriers`; `COUNT(s.id)` menghasilkan nol untuk courier tanpa shipment.

```sql
SELECT c.name AS courier, COUNT(s.id) AS shipment_count
FROM couriers AS c
LEFT JOIN shipments AS s ON s.courier_id = c.id
GROUP BY c.id, c.name
ORDER BY c.id;
```

Hasil:

| courier | shipment_count |
|---|---:|
| Satria Demo 01 | 4 |
| Satria Demo 02 | 3 |
| Satria Demo 03 | 3 |
| Satria Demo 04 | 1 |
| Satria Demo 05 | 1 |
| Satria Demo 06 | 1 |
| Satria Demo 07 | 1 |
| Satria Demo 08 | 1 |
| Satria Demo 09 | 1 |
| Satria Demo 10 | 1 |
| Satria Demo 11 | 1 |
| Satria Demo 12 | 1 |
| Satria Demo 13 | 1 |
| Satria Demo 14 | 1 |
| Satria Demo 15 | 1 |
| Satria Demo 16 | 1 |
| Satria Demo 17 | 1 |
| Satria Demo 18 | 1 |
| Satria Demo 19 | 1 |
| Satria Demo 20 | 0 |
| Satria Demo 21 | 0 |
| Satria Demo 22 | 0 |
| Satria Demo 23 | 0 |
| Satria Demo 24 | 0 |
| Satria Demo 25 | 0 |

## Ringkasan data dan perbandingan dengan Eloquent

Pengecekan dataset menghasilkan 25 courier dan 26 shipment; status shipment tersebar pada `approved` (1), `canceled` (3), `created` (2), `delivered` (6), `in_transit` (8), `processing` (3), `shipped` (2), dan `unavailable` (1). Courier 20 sampai 25 sengaja tidak diberi shipment untuk membuktikan hasil `LEFT JOIN`.

Query agregasi manual secara eksplisit menunjukkan `JOIN`, filter `created_at`, `GROUP BY`, dan `COUNT`. Eloquent dapat menyusun operasi yang sama, tetapi SQL manual memudahkan melihat urutan operasi database dan alasan `LEFT JOIN` tetap menampilkan courier dengan hitungan nol.
