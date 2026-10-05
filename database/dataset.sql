-- =============================================================================
-- Dataset demo Smart AI Shipment Tracking Widget Anteraja
-- =============================================================================
-- Isi minimum 25 baris per tabel skema smart tracking (database/schema.sql):
--   customers (26), sellers (26), orders (26), order_items (37),
--   smart_logistics_context (26), tracking_events (80), ai_narratives (30).
--
-- Cara pakai (database kosong maupun yang sudah berisi sample_data.sql):
--   createdb anteraja_tracking
--   psql -d anteraja_tracking -f database/schema.sql
--   psql -d anteraja_tracking -f database/dataset.sql
--
-- Sifat berkas:
--   * Idempoten. Aman dijalankan berulang; baris yang sudah ada tidak terduplikasi
--     (ON CONFLICT untuk tabel ber-key, NOT EXISTS untuk ai_narratives).
--   * Empat resi warisan dari sample_data.sql dipertahankan apa adanya karena
--     dipakai sebagai contoh uji di FRD F-03 dan FRD master (00010242..., 0008288a...,
--     1111..., 2222...), termasuk offset waktu Brasil -03.
--   * Resi 3333... sampai 8888... adalah resi yang sudah dipakai Laravel
--     (ShipmentSeeder) agar tabel shipments dan orders merujuk nomor resi yang sama.
--   * Sisanya memakai konteks Anteraja Indonesia: kota asal/tujuan Indonesia,
--     timestamp +07 (WIB), dan nilai rupiah.
--   * order_id adalah waybill_number: 32 karakter alfanumerik sesuai FRD F-01.
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. customers - penerima (26 baris)
-- =============================================================================
INSERT INTO customers (customer_id, customer_city, customer_state) VALUES
    ('cust-demo-001', 'Campos dos Goytacazes', 'RJ'),
    ('cust-demo-002', 'Niteroi', 'RJ'),
    ('cust-demo-003', 'Sao Paulo', 'SP'),
    ('cust-demo-004', 'Bandung', 'JB'),
    ('cust-demo-005', 'Semarang', 'JT'),
    ('cust-demo-006', 'Surabaya', 'JI'),
    ('cust-demo-007', 'Yogyakarta', 'YO'),
    ('cust-demo-008', 'Medan', 'SU'),
    ('cust-demo-009', 'Palembang', 'SS'),
    ('cust-demo-010', 'Denpasar', 'BA'),
    ('cust-demo-011', 'Makassar', 'SN'),
    ('cust-demo-012', 'Balikpapan', 'KI'),
    ('cust-demo-013', 'Malang', 'JI'),
    ('cust-demo-014', 'Pekanbaru', 'RI'),
    ('cust-demo-015', 'Padang', 'SB'),
    ('cust-demo-016', 'Banjarmasin', 'KS'),
    ('cust-demo-017', 'Pontianak', 'KB'),
    ('cust-demo-018', 'Manado', 'SA'),
    ('cust-demo-019', 'Batam', 'KR'),
    ('cust-demo-020', 'Solo', 'JT'),
    ('cust-demo-021', 'Cirebon', 'JB'),
    ('cust-demo-022', 'Bogor', 'JB'),
    ('cust-demo-023', 'Depok', 'JB'),
    ('cust-demo-024', 'Tangerang', 'BT'),
    ('cust-demo-025', 'Bekasi', 'JB'),
    ('cust-demo-026', 'Mataram', 'NB')
ON CONFLICT (customer_id) DO NOTHING;

-- =============================================================================
-- 2. sellers - pengirim/merchant (26 baris)
-- =============================================================================
INSERT INTO sellers (seller_id, seller_city, seller_state) VALUES
    ('seller-demo-001', 'Volta Redonda', 'RJ'),
    ('seller-demo-002', 'Rio de Janeiro', 'RJ'),
    ('seller-demo-003', 'Jakarta Pusat', 'JK'),
    ('seller-demo-004', 'Tangerang', 'BT'),
    ('seller-demo-005', 'Bandung', 'JB'),
    ('seller-demo-006', 'Surabaya', 'JI'),
    ('seller-demo-007', 'Semarang', 'JT'),
    ('seller-demo-008', 'Yogyakarta', 'YO'),
    ('seller-demo-009', 'Jakarta Selatan', 'JK'),
    ('seller-demo-010', 'Bekasi', 'JB'),
    ('seller-demo-011', 'Medan', 'SU'),
    ('seller-demo-012', 'Palembang', 'SS'),
    ('seller-demo-013', 'Surabaya', 'JI'),
    ('seller-demo-014', 'Semarang', 'JT'),
    ('seller-demo-015', 'Malang', 'JI'),
    ('seller-demo-016', 'Pekanbaru', 'RI'),
    ('seller-demo-017', 'Padang', 'SB'),
    ('seller-demo-018', 'Balikpapan', 'KI'),
    ('seller-demo-019', 'Banjarmasin', 'KS'),
    ('seller-demo-020', 'Pontianak', 'KB'),
    ('seller-demo-021', 'Manado', 'SA'),
    ('seller-demo-022', 'Batam', 'KR'),
    ('seller-demo-023', 'Cirebon', 'JB'),
    ('seller-demo-024', 'Bogor', 'JB'),
    ('seller-demo-025', 'Depok', 'JB'),
    ('seller-demo-026', 'Denpasar', 'BA')
ON CONFLICT (seller_id) DO NOTHING;

-- =============================================================================
-- 3. orders - transaksi/pengiriman dan nomor resi (26 baris)
--    Status tersebar pada seluruh kamus: created, approved, processing,
--    in_transit, shipped, delivered, canceled, unavailable.
-- =============================================================================
INSERT INTO orders (
    order_id, customer_id, order_status, order_purchase_timestamp, order_approved_at,
    order_delivered_carrier_date, order_delivered_customer_date, order_estimated_delivery_date
) VALUES
    -- Resi warisan sample_data.sql (contoh uji FRD, waktu Brasil -03)
    ('00010242fe8c5a6d1ba2dd792cb16214', 'cust-demo-001', 'in_transit', '2017-09-20 09:00:00-03', '2017-09-20 10:00:00-03', '2017-09-21 08:00:00-03', NULL, '2017-09-28'),
    ('0008288aa423d2a3f00fcb17cd7d8719', 'cust-demo-002', 'in_transit', '2017-09-19 11:00:00-03', '2017-09-19 12:00:00-03', '2017-09-20 07:00:00-03', NULL, '2017-09-25'),
    ('11111111111111111111111111111111', 'cust-demo-003', 'delivered', '2017-09-20 09:00:00-03', '2017-09-20 10:00:00-03', '2017-09-21 08:00:00-03', '2017-09-25 14:20:00-03', '2017-09-28'),
    ('22222222222222222222222222222222', 'cust-demo-002', 'canceled', '2017-09-22 09:00:00-03', NULL, NULL, NULL, '2017-09-29'),
    -- Resi yang sama dengan ShipmentSeeder Laravel (Laravel Day 13)
    ('33333333333333333333333333333333', 'cust-demo-004', 'created', '2026-10-01 09:15:00+07', NULL, NULL, NULL, '2026-10-08'),
    ('44444444444444444444444444444444', 'cust-demo-005', 'processing', '2026-09-30 10:00:00+07', '2026-09-30 10:20:00+07', NULL, NULL, '2026-10-07'),
    ('55555555555555555555555555555555', 'cust-demo-006', 'delivered', '2026-09-26 08:30:00+07', '2026-09-26 08:45:00+07', '2026-09-26 16:00:00+07', '2026-09-28 14:45:00+07', '2026-09-28'),
    ('66666666666666666666666666666666', 'cust-demo-007', 'in_transit', '2026-09-29 07:45:00+07', '2026-09-29 08:00:00+07', '2026-09-29 15:30:00+07', NULL, '2026-10-06'),
    ('77777777777777777777777777777777', 'cust-demo-008', 'canceled', '2026-09-27 11:20:00+07', NULL, NULL, NULL, '2026-10-04'),
    ('88888888888888888888888888888888', 'cust-demo-009', 'shipped', '2026-09-25 09:00:00+07', '2026-09-25 09:30:00+07', '2026-09-26 07:15:00+07', NULL, '2026-10-02'),
    -- Resi tambahan konteks Anteraja Indonesia (WIB +07, rupiah)
    ('ina20260928cgkbdo000000000000001', 'cust-demo-010', 'approved', '2026-09-28 08:10:00+07', '2026-09-28 08:25:00+07', NULL, NULL, '2026-10-05'),
    ('ina20260929bksupg000000000000002', 'cust-demo-011', 'processing', '2026-09-29 13:40:00+07', '2026-09-29 14:00:00+07', NULL, NULL, '2026-10-06'),
    ('ina20260927mdnbpn000000000000003', 'cust-demo-012', 'in_transit', '2026-09-27 09:05:00+07', '2026-09-27 09:20:00+07', '2026-09-28 06:50:00+07', NULL, '2026-10-04'),
    ('ina20260926plmmlg000000000000004', 'cust-demo-013', 'in_transit', '2026-09-26 15:30:00+07', '2026-09-26 15:45:00+07', '2026-09-27 08:00:00+07', NULL, '2026-10-03'),
    ('ina20260930subpku000000000000005', 'cust-demo-014', 'in_transit', '2026-09-30 10:10:00+07', '2026-09-30 10:25:00+07', '2026-10-01 07:30:00+07', NULL, '2026-10-07'),
    ('ina20260924smgpdg000000000000006', 'cust-demo-015', 'delivered', '2026-09-24 08:00:00+07', '2026-09-24 08:15:00+07', '2026-09-24 17:00:00+07', '2026-09-26 11:20:00+07', '2026-09-29'),
    ('ina20260922mlgbjm000000000000007', 'cust-demo-016', 'delivered', '2026-09-22 09:30:00+07', '2026-09-22 09:50:00+07', '2026-09-23 08:10:00+07', '2026-09-26 16:05:00+07', '2026-09-26'),
    ('ina20260928pkupnk000000000000008', 'cust-demo-017', 'canceled', '2026-09-28 19:20:00+07', NULL, NULL, NULL, '2026-10-05'),
    ('ina20260923pdgmdc000000000000009', 'cust-demo-018', 'unavailable', '2026-09-23 12:00:00+07', '2026-09-23 12:30:00+07', NULL, NULL, '2026-09-30'),
    ('ina20260925bpnbth000000000000010', 'cust-demo-019', 'shipped', '2026-09-25 07:00:00+07', '2026-09-25 07:20:00+07', '2026-09-26 06:00:00+07', NULL, '2026-10-02'),
    ('ina20260930bjmsoc000000000000011', 'cust-demo-020', 'in_transit', '2026-09-30 16:45:00+07', '2026-09-30 17:00:00+07', '2026-10-01 09:20:00+07', NULL, '2026-10-08'),
    ('ina20260920pnkcbn000000000000012', 'cust-demo-021', 'delivered', '2026-09-20 08:15:00+07', '2026-09-20 08:35:00+07', '2026-09-21 07:40:00+07', '2026-09-24 13:10:00+07', '2026-09-25'),
    ('ina20261002mdcbog000000000000013', 'cust-demo-022', 'processing', '2026-10-02 09:50:00+07', '2026-10-02 10:05:00+07', NULL, NULL, '2026-10-09'),
    ('ina20260929bthdpk000000000000014', 'cust-demo-023', 'in_transit', '2026-09-29 11:25:00+07', '2026-09-29 11:40:00+07', '2026-09-30 07:05:00+07', NULL, '2026-10-06'),
    ('ina20261003cbntng000000000000015', 'cust-demo-024', 'created', '2026-10-03 08:05:00+07', NULL, NULL, NULL, '2026-10-10'),
    ('ina20260918bogbks000000000000016', 'cust-demo-025', 'delivered', '2026-09-18 10:00:00+07', '2026-09-18 10:20:00+07', '2026-09-19 08:30:00+07', '2026-09-27 15:40:00+07', '2026-09-24')
ON CONFLICT (order_id) DO UPDATE SET
    customer_id = EXCLUDED.customer_id,
    order_status = EXCLUDED.order_status,
    order_purchase_timestamp = EXCLUDED.order_purchase_timestamp,
    order_approved_at = EXCLUDED.order_approved_at,
    order_delivered_carrier_date = EXCLUDED.order_delivered_carrier_date,
    order_delivered_customer_date = EXCLUDED.order_delivered_customer_date,
    order_estimated_delivery_date = EXCLUDED.order_estimated_delivery_date,
    updated_at = now();

-- =============================================================================
-- 4. order_items - item, seller, harga, dan ongkir (37 baris)
--    Beberapa order sengaja multi-item/multi-seller agar agregasi view teruji.
--    freight_value = 0.00 menandai gratis ongkir (has_free_shipping).
-- =============================================================================
INSERT INTO order_items (order_id, order_item_id, seller_id, price, freight_value) VALUES
    ('00010242fe8c5a6d1ba2dd792cb16214', 1, 'seller-demo-001', 125000.00, 15000.00),
    ('0008288aa423d2a3f00fcb17cd7d8719', 1, 'seller-demo-002', 250000.00, 0.00),
    ('11111111111111111111111111111111', 1, 'seller-demo-001', 75000.00, 10000.00),
    ('22222222222222222222222222222222', 1, 'seller-demo-002', 50000.00, 8000.00),
    ('33333333333333333333333333333333', 1, 'seller-demo-003', 189000.00, 18000.00),
    ('44444444444444444444444444444444', 1, 'seller-demo-004', 245000.00, 22000.00),
    ('44444444444444444444444444444444', 2, 'seller-demo-004', 99000.00, 0.00),
    ('55555555555555555555555555555555', 1, 'seller-demo-005', 315000.00, 25000.00),
    ('66666666666666666666666666666666', 1, 'seller-demo-006', 450000.00, 0.00),
    ('66666666666666666666666666666666', 2, 'seller-demo-006', 125000.00, 15000.00),
    ('66666666666666666666666666666666', 3, 'seller-demo-026', 89000.00, 12000.00),
    ('77777777777777777777777777777777', 1, 'seller-demo-007', 175000.00, 16000.00),
    ('88888888888888888888888888888888', 1, 'seller-demo-008', 520000.00, 30000.00),
    ('88888888888888888888888888888888', 2, 'seller-demo-008', 65000.00, 0.00),
    ('ina20260928cgkbdo000000000000001', 1, 'seller-demo-009', 230000.00, 20000.00),
    ('ina20260929bksupg000000000000002', 1, 'seller-demo-010', 410000.00, 24000.00),
    ('ina20260929bksupg000000000000002', 2, 'seller-demo-010', 78000.00, 0.00),
    ('ina20260927mdnbpn000000000000003', 1, 'seller-demo-011', 156000.00, 27000.00),
    ('ina20260926plmmlg000000000000004', 1, 'seller-demo-012', 289000.00, 31000.00),
    ('ina20260926plmmlg000000000000004', 2, 'seller-demo-012', 112000.00, 0.00),
    ('ina20260930subpku000000000000005', 1, 'seller-demo-013', 199000.00, 0.00),
    ('ina20260924smgpdg000000000000006', 1, 'seller-demo-014', 367000.00, 21000.00),
    ('ina20260922mlgbjm000000000000007', 1, 'seller-demo-015', 143000.00, 19000.00),
    ('ina20260922mlgbjm000000000000007', 2, 'seller-demo-015', 58000.00, 0.00),
    ('ina20260928pkupnk000000000000008', 1, 'seller-demo-016', 275000.00, 23000.00),
    ('ina20260923pdgmdc000000000000009', 1, 'seller-demo-017', 340000.00, 26000.00),
    ('ina20260925bpnbth000000000000010', 1, 'seller-demo-018', 610000.00, 35000.00),
    ('ina20260930bjmsoc000000000000011', 1, 'seller-demo-019', 168000.00, 20000.00),
    ('ina20260930bjmsoc000000000000011', 2, 'seller-demo-025', 94000.00, 11000.00),
    ('ina20260920pnkcbn000000000000012', 1, 'seller-demo-020', 128000.00, 17000.00),
    ('ina20261002mdcbog000000000000013', 1, 'seller-demo-021', 455000.00, 28000.00),
    ('ina20261002mdcbog000000000000013', 2, 'seller-demo-021', 132000.00, 0.00),
    ('ina20261002mdcbog000000000000013', 3, 'seller-demo-026', 71000.00, 9000.00),
    ('ina20260929bthdpk000000000000014', 1, 'seller-demo-022', 205000.00, 24000.00),
    ('ina20261003cbntng000000000000015', 1, 'seller-demo-023', 187000.00, 15000.00),
    ('ina20260918bogbks000000000000016', 1, 'seller-demo-024', 398000.00, 33000.00),
    ('ina20260918bogbks000000000000016', 2, 'seller-demo-024', 84000.00, 0.00)
ON CONFLICT (order_id, order_item_id) DO UPDATE SET
    seller_id = EXCLUDED.seller_id,
    price = EXCLUDED.price,
    freight_value = EXCLUDED.freight_value;

-- =============================================================================
-- 5. smart_logistics_context - konteks operasional (26 baris, satu per order)
--    has_delay dihitung view: alasan <> 'None' ATAU traffic Heavy/Detour.
-- =============================================================================
INSERT INTO smart_logistics_context (
    order_id, logistics_delay_reason, traffic_status, waiting_time_minutes, observed_at
) VALUES
    ('00010242fe8c5a6d1ba2dd792cb16214', 'None', 'Clear', 0, '2017-09-23 09:00:00-03'),
    ('0008288aa423d2a3f00fcb17cd7d8719', 'Traffic Jam', 'Heavy', 45, '2017-09-23 09:00:00-03'),
    ('11111111111111111111111111111111', 'None', 'Clear', 0, '2017-09-25 14:20:00-03'),
    ('22222222222222222222222222222222', 'None', 'Clear', 0, '2017-09-22 09:00:00-03'),
    ('33333333333333333333333333333333', 'None', 'Clear', 0, '2026-10-01 09:15:00+07'),
    ('44444444444444444444444444444444', 'None', 'Clear', 0, '2026-09-30 10:20:00+07'),
    ('55555555555555555555555555555555', 'None', 'Clear', 0, '2026-09-28 14:45:00+07'),
    ('66666666666666666666666666666666', 'None', 'Clear', 0, '2026-09-29 15:30:00+07'),
    ('77777777777777777777777777777777', 'None', 'Clear', 0, '2026-09-27 11:30:00+07'),
    ('88888888888888888888888888888888', 'Traffic Jam', 'Moderate', 20, '2026-09-26 07:15:00+07'),
    ('ina20260928cgkbdo000000000000001', 'None', 'Clear', 0, '2026-09-28 08:25:00+07'),
    ('ina20260929bksupg000000000000002', 'None', 'Clear', 0, '2026-09-29 14:00:00+07'),
    ('ina20260927mdnbpn000000000000003', 'Weather', 'Heavy', 90, '2026-09-28 06:50:00+07'),
    ('ina20260926plmmlg000000000000004', 'Road Closure', 'Detour', 35, '2026-09-27 08:00:00+07'),
    ('ina20260930subpku000000000000005', 'None', 'Clear', 0, '2026-10-01 07:30:00+07'),
    ('ina20260924smgpdg000000000000006', 'None', 'Clear', 0, '2026-09-26 11:20:00+07'),
    ('ina20260922mlgbjm000000000000007', 'None', 'Moderate', 15, '2026-09-26 16:05:00+07'),
    ('ina20260928pkupnk000000000000008', 'None', 'Clear', 0, '2026-09-28 19:25:00+07'),
    ('ina20260923pdgmdc000000000000009', 'None', 'Unknown', 0, '2026-09-23 12:30:00+07'),
    ('ina20260925bpnbth000000000000010', 'Mechanical Failure', 'Heavy', 60, '2026-09-26 06:00:00+07'),
    ('ina20260930bjmsoc000000000000011', 'None', 'Clear', 0, '2026-10-01 09:20:00+07'),
    ('ina20260920pnkcbn000000000000012', 'None', 'Clear', 0, '2026-09-24 13:10:00+07'),
    ('ina20261002mdcbog000000000000013', 'None', 'Clear', 0, '2026-10-02 10:05:00+07'),
    ('ina20260929bthdpk000000000000014', 'Traffic Jam', 'Heavy', 45, '2026-09-30 07:05:00+07'),
    ('ina20261003cbntng000000000000015', 'None', 'Clear', 0, '2026-10-03 08:05:00+07'),
    ('ina20260918bogbks000000000000016', 'Weather', 'Moderate', 30, '2026-09-27 15:40:00+07')
ON CONFLICT (order_id) DO UPDATE SET
    logistics_delay_reason = EXCLUDED.logistics_delay_reason,
    traffic_status = EXCLUDED.traffic_status,
    waiting_time_minutes = EXCLUDED.waiting_time_minutes,
    observed_at = EXCLUDED.observed_at,
    updated_at = now();

-- =============================================================================
-- 6. tracking_events - riwayat perjalanan (80 baris)
--    Milestone: ORDER_CREATED, PICKUP_READY, IN_TRANSIT, DELIVERED, CANCELED.
--    Event kendala (TRAFFIC_DELAY, WEATHER_DELAY, ROUTE_DETOUR,
--    MECHANICAL_DELAY) dipetakan ke tahap IN_TRANSIT untuk banner peringatan.
-- =============================================================================
INSERT INTO tracking_events (
    order_id, event_code, milestone_stage, description, facility_name, event_at
) VALUES
    -- 00010242fe8c5a6d1ba2dd792cb16214 - in_transit normal
    ('00010242fe8c5a6d1ba2dd792cb16214', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Volta Redonda', '2017-09-20 09:00:00-03'),
    ('00010242fe8c5a6d1ba2dd792cb16214', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Volta Redonda', '2017-09-21 08:00:00-03'),
    ('00010242fe8c5a6d1ba2dd792cb16214', 'IN_TRANSIT_HUB', 'IN_TRANSIT', 'Paket bergerak ke hub tujuan', 'Hub Rio de Janeiro', '2017-09-22 16:30:00-03'),
    -- 0008288aa423d2a3f00fcb17cd7d8719 - in_transit delay lalu lintas
    ('0008288aa423d2a3f00fcb17cd7d8719', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Rio de Janeiro', '2017-09-19 11:00:00-03'),
    ('0008288aa423d2a3f00fcb17cd7d8719', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Rio de Janeiro', '2017-09-20 07:00:00-03'),
    ('0008288aa423d2a3f00fcb17cd7d8719', 'TRAFFIC_DELAY', 'IN_TRANSIT', 'Perjalanan tertunda karena lalu lintas padat', 'Jalur Niteroi', '2017-09-23 09:00:00-03'),
    -- 11111111111111111111111111111111 - delivered
    ('11111111111111111111111111111111', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Volta Redonda', '2017-09-20 09:00:00-03'),
    ('11111111111111111111111111111111', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Volta Redonda', '2017-09-21 08:00:00-03'),
    ('11111111111111111111111111111111', 'DELIVERED', 'DELIVERED', 'Paket diterima pelanggan', 'Sao Paulo', '2017-09-25 14:20:00-03'),
    -- 22222222222222222222222222222222 - canceled
    ('22222222222222222222222222222222', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Rio de Janeiro', '2017-09-22 09:00:00-03'),
    ('22222222222222222222222222222222', 'CANCELED', 'CANCELED', 'Pengiriman dibatalkan', NULL, '2017-09-22 10:00:00-03'),
    -- 33333333333333333333333333333333 - created
    ('33333333333333333333333333333333', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat dan menunggu konfirmasi penjual', 'Jakarta Pusat', '2026-10-01 09:15:00+07'),
    -- 44444444444444444444444444444444 - processing
    ('44444444444444444444444444444444', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Tangerang', '2026-09-30 10:00:00+07'),
    ('44444444444444444444444444444444', 'MANIFESTED', 'PICKUP_READY', 'Paket sudah dicatat, menunggu diambil kurir', 'Hub Tangerang', '2026-09-30 14:30:00+07'),
    -- 55555555555555555555555555555555 - delivered lebih cepat dari estimasi
    ('55555555555555555555555555555555', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Bandung', '2026-09-26 08:30:00+07'),
    ('55555555555555555555555555555555', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Bandung', '2026-09-26 16:00:00+07'),
    ('55555555555555555555555555555555', 'IN_TRANSIT_HUB', 'IN_TRANSIT', 'Paket bergerak ke hub tujuan', 'Hub Surabaya', '2026-09-27 08:30:00+07'),
    ('55555555555555555555555555555555', 'DELIVERED', 'DELIVERED', 'Paket diterima pelanggan', 'Surabaya', '2026-09-28 14:45:00+07'),
    -- 66666666666666666666666666666666 - in_transit tiga item
    ('66666666666666666666666666666666', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Surabaya', '2026-09-29 07:45:00+07'),
    ('66666666666666666666666666666666', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Surabaya', '2026-09-29 15:30:00+07'),
    ('66666666666666666666666666666666', 'IN_TRANSIT_HUB', 'IN_TRANSIT', 'Paket bergerak ke hub tujuan', 'Hub Semarang', '2026-09-30 09:15:00+07'),
    -- 77777777777777777777777777777777 - canceled sebelum pickup
    ('77777777777777777777777777777777', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Semarang', '2026-09-27 11:20:00+07'),
    ('77777777777777777777777777777777', 'CANCELED', 'CANCELED', 'Pengiriman dibatalkan sebelum paket dijemput kurir', NULL, '2026-09-27 13:05:00+07'),
    -- 88888888888888888888888888888888 - shipped dengan lalu lintas sedang
    ('88888888888888888888888888888888', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Yogyakarta', '2026-09-25 09:00:00+07'),
    ('88888888888888888888888888888888', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Yogyakarta', '2026-09-26 07:15:00+07'),
    ('88888888888888888888888888888888', 'IN_TRANSIT_HUB', 'IN_TRANSIT', 'Paket bergerak ke hub tujuan', 'Hub Palembang', '2026-09-26 18:40:00+07'),
    -- ina20260928cgkbdo000000000000001 - approved
    ('ina20260928cgkbdo000000000000001', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Jakarta Selatan', '2026-09-28 08:10:00+07'),
    ('ina20260928cgkbdo000000000000001', 'ORDER_APPROVED', NULL, 'Pesanan disetujui penjual', 'Jakarta Selatan', '2026-09-28 08:25:00+07'),
    -- ina20260929bksupg000000000000002 - processing
    ('ina20260929bksupg000000000000002', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Bekasi', '2026-09-29 13:40:00+07'),
    ('ina20260929bksupg000000000000002', 'ORDER_APPROVED', NULL, 'Pesanan disetujui penjual', 'Bekasi', '2026-09-29 14:00:00+07'),
    ('ina20260929bksupg000000000000002', 'MANIFESTED', 'PICKUP_READY', 'Paket sudah dicatat, menunggu diambil kurir', 'Hub Bekasi', '2026-09-29 17:20:00+07'),
    -- ina20260927mdnbpn000000000000003 - in_transit delay cuaca
    ('ina20260927mdnbpn000000000000003', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Medan', '2026-09-27 09:05:00+07'),
    ('ina20260927mdnbpn000000000000003', 'ORDER_APPROVED', NULL, 'Pesanan disetujui penjual', 'Medan', '2026-09-27 09:20:00+07'),
    ('ina20260927mdnbpn000000000000003', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Medan', '2026-09-28 06:50:00+07'),
    ('ina20260927mdnbpn000000000000003', 'WEATHER_DELAY', 'IN_TRANSIT', 'Perjalanan tertunda karena cuaca buruk', 'Jalur Balikpapan', '2026-09-28 15:30:00+07'),
    -- ina20260926plmmlg000000000000004 - in_transit pengalihan rute
    ('ina20260926plmmlg000000000000004', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Palembang', '2026-09-26 15:30:00+07'),
    ('ina20260926plmmlg000000000000004', 'ORDER_APPROVED', NULL, 'Pesanan disetujui penjual', 'Palembang', '2026-09-26 15:45:00+07'),
    ('ina20260926plmmlg000000000000004', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Palembang', '2026-09-27 08:00:00+07'),
    ('ina20260926plmmlg000000000000004', 'ROUTE_DETOUR', 'IN_TRANSIT', 'Rute dialihkan karena penutupan jalan', 'Jalur Malang', '2026-09-27 19:25:00+07'),
    -- ina20260930subpku000000000000005 - in_transit gratis ongkir
    ('ina20260930subpku000000000000005', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Surabaya', '2026-09-30 10:10:00+07'),
    ('ina20260930subpku000000000000005', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Surabaya', '2026-10-01 07:30:00+07'),
    ('ina20260930subpku000000000000005', 'IN_TRANSIT_HUB', 'IN_TRANSIT', 'Paket bergerak ke hub tujuan', 'Hub Pekanbaru', '2026-10-01 20:10:00+07'),
    -- ina20260924smgpdg000000000000006 - delivered lebih awal
    ('ina20260924smgpdg000000000000006', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Semarang', '2026-09-24 08:00:00+07'),
    ('ina20260924smgpdg000000000000006', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Semarang', '2026-09-24 17:00:00+07'),
    ('ina20260924smgpdg000000000000006', 'IN_TRANSIT_HUB', 'IN_TRANSIT', 'Paket bergerak ke hub tujuan', 'Hub Padang', '2026-09-25 09:40:00+07'),
    ('ina20260924smgpdg000000000000006', 'DELIVERED', 'DELIVERED', 'Paket diterima pelanggan', 'Padang', '2026-09-26 11:20:00+07'),
    -- ina20260922mlgbjm000000000000007 - delivered dengan tiba di hub
    ('ina20260922mlgbjm000000000000007', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Malang', '2026-09-22 09:30:00+07'),
    ('ina20260922mlgbjm000000000000007', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Malang', '2026-09-23 08:10:00+07'),
    ('ina20260922mlgbjm000000000000007', 'IN_TRANSIT_HUB', 'IN_TRANSIT', 'Paket bergerak ke hub tujuan', 'Hub Surabaya', '2026-09-24 07:50:00+07'),
    ('ina20260922mlgbjm000000000000007', 'ARRIVED_AT_HUB', 'IN_TRANSIT', 'Paket tiba di gudang sortir tujuan', 'Hub Banjarmasin', '2026-09-25 16:30:00+07'),
    ('ina20260922mlgbjm000000000000007', 'DELIVERED', 'DELIVERED', 'Paket diterima pelanggan', 'Banjarmasin', '2026-09-26 16:05:00+07'),
    -- ina20260928pkupnk000000000000008 - canceled atas permintaan pembeli
    ('ina20260928pkupnk000000000000008', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Pekanbaru', '2026-09-28 19:20:00+07'),
    ('ina20260928pkupnk000000000000008', 'CANCELED', 'CANCELED', 'Pesanan dibatalkan atas permintaan pembeli', NULL, '2026-09-28 20:10:00+07'),
    -- ina20260923pdgmdc000000000000009 - unavailable
    ('ina20260923pdgmdc000000000000009', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Padang', '2026-09-23 12:00:00+07'),
    ('ina20260923pdgmdc000000000000009', 'ORDER_APPROVED', NULL, 'Pesanan disetujui penjual', 'Padang', '2026-09-23 12:30:00+07'),
    ('ina20260923pdgmdc000000000000009', 'STOCK_UNAVAILABLE', NULL, 'Pesanan tidak dapat diproses karena stok barang tidak tersedia', 'Padang', '2026-09-23 16:45:00+07'),
    -- ina20260925bpnbth000000000000010 - shipped kendala teknis
    ('ina20260925bpnbth000000000000010', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Balikpapan', '2026-09-25 07:00:00+07'),
    ('ina20260925bpnbth000000000000010', 'ORDER_APPROVED', NULL, 'Pesanan disetujui penjual', 'Balikpapan', '2026-09-25 07:20:00+07'),
    ('ina20260925bpnbth000000000000010', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Balikpapan', '2026-09-26 06:00:00+07'),
    ('ina20260925bpnbth000000000000010', 'MECHANICAL_DELAY', 'IN_TRANSIT', 'Perjalanan tertunda karena kendala teknis kendaraan', 'Jalur Batam', '2026-09-26 13:30:00+07'),
    -- ina20260930bjmsoc000000000000011 - in_transit dua seller
    ('ina20260930bjmsoc000000000000011', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Banjarmasin', '2026-09-30 16:45:00+07'),
    ('ina20260930bjmsoc000000000000011', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Banjarmasin', '2026-10-01 09:20:00+07'),
    ('ina20260930bjmsoc000000000000011', 'IN_TRANSIT_HUB', 'IN_TRANSIT', 'Paket bergerak ke hub tujuan', 'Hub Surabaya', '2026-10-01 22:05:00+07'),
    -- ina20260920pnkcbn000000000000012 - delivered
    ('ina20260920pnkcbn000000000000012', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Pontianak', '2026-09-20 08:15:00+07'),
    ('ina20260920pnkcbn000000000000012', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Pontianak', '2026-09-21 07:40:00+07'),
    ('ina20260920pnkcbn000000000000012', 'IN_TRANSIT_HUB', 'IN_TRANSIT', 'Paket bergerak ke hub tujuan', 'Hub Jakarta', '2026-09-22 10:25:00+07'),
    ('ina20260920pnkcbn000000000000012', 'DELIVERED', 'DELIVERED', 'Paket diterima pelanggan', 'Cirebon', '2026-09-24 13:10:00+07'),
    -- ina20261002mdcbog000000000000013 - processing tiga item
    ('ina20261002mdcbog000000000000013', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Manado', '2026-10-02 09:50:00+07'),
    ('ina20261002mdcbog000000000000013', 'ORDER_APPROVED', NULL, 'Pesanan disetujui penjual', 'Manado', '2026-10-02 10:05:00+07'),
    ('ina20261002mdcbog000000000000013', 'MANIFESTED', 'PICKUP_READY', 'Paket sudah dicatat, menunggu diambil kurir', 'Hub Manado', '2026-10-02 15:40:00+07'),
    -- ina20260929bthdpk000000000000014 - in_transit delay lalu lintas
    ('ina20260929bthdpk000000000000014', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Batam', '2026-09-29 11:25:00+07'),
    ('ina20260929bthdpk000000000000014', 'ORDER_APPROVED', NULL, 'Pesanan disetujui penjual', 'Batam', '2026-09-29 11:40:00+07'),
    ('ina20260929bthdpk000000000000014', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Batam', '2026-09-30 07:05:00+07'),
    ('ina20260929bthdpk000000000000014', 'TRAFFIC_DELAY', 'IN_TRANSIT', 'Perjalanan tertunda karena lalu lintas padat', 'Jalur Depok', '2026-09-30 14:20:00+07'),
    -- ina20261003cbntng000000000000015 - created
    ('ina20261003cbntng000000000000015', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat dan menunggu konfirmasi penjual', 'Cirebon', '2026-10-03 08:05:00+07'),
    -- ina20260918bogbks000000000000016 - delivered terlambat karena cuaca
    ('ina20260918bogbks000000000000016', 'ORDER_CREATED', 'ORDER_CREATED', 'Pesanan dibuat', 'Bogor', '2026-09-18 10:00:00+07'),
    ('ina20260918bogbks000000000000016', 'ORDER_APPROVED', NULL, 'Pesanan disetujui penjual', 'Bogor', '2026-09-18 10:20:00+07'),
    ('ina20260918bogbks000000000000016', 'PICKUP_READY', 'PICKUP_READY', 'Paket diterima kurir', 'Hub Bogor', '2026-09-19 08:30:00+07'),
    ('ina20260918bogbks000000000000016', 'WEATHER_DELAY', 'IN_TRANSIT', 'Perjalanan tertunda karena cuaca buruk', 'Jalur Bekasi', '2026-09-20 09:45:00+07'),
    ('ina20260918bogbks000000000000016', 'DELIVERED', 'DELIVERED', 'Paket diterima pelanggan', 'Bekasi', '2026-09-27 15:40:00+07')
ON CONFLICT (order_id, event_code, event_at) DO NOTHING;

-- =============================================================================
-- 7. ai_narratives - keluaran AI dan fallback (30 baris)
--    Menyimpan riwayat tiap generasi: success Gemini, fallback rule-based,
--    dan satu baris error per order yang timeout agar latensi dapat diaudit.
-- =============================================================================
INSERT INTO ai_narratives (
    order_id, text, is_fallback, provider, model, generation_status, latency_ms, generated_at, expires_at
)
SELECT
    v.order_id,
    v.text,
    v.is_fallback,
    v.provider,
    v.model,
    v.generation_status,
    v.latency_ms,
    v.generated_at,
    v.generated_at + interval '5 minutes'
FROM (VALUES
    -- Resi warisan: dua generasi awal dari sample_data.sql (expires_at NULL)
    ('00010242fe8c5a6d1ba2dd792cb16214'::varchar, 'Paketmu saat ini sedang dalam perjalanan dari Volta Redonda menuju Campos dos Goytacazes. Pengiriman berjalan lancar dan diperkirakan tiba sesuai estimasi.'::varchar, false, 'gemini'::varchar, ''::varchar, 'success'::varchar, 812, '2017-09-23 09:00:01-03'::timestamptz, NULL::timestamptz),
    ('0008288aa423d2a3f00fcb17cd7d8719'::varchar, 'Paketmu sedang dalam perjalanan dari Rio de Janeiro menuju Niteroi. Ada hambatan lalu lintas padat di jalur transit, namun kurir Anteraja terus mengupayakan paket tiba secepatnya.'::varchar, true, 'rule_based'::varchar, ''::varchar, 'fallback'::varchar, 1200, '2017-09-23 09:00:01-03'::timestamptz, NULL::timestamptz),
    -- Regenerasi resi 0008288a setelah kondisi lalu lintas dilaporkan (Gemini sukses)
    ('0008288aa423d2a3f00fcb17cd7d8719'::varchar, 'Paketmu masih dalam perjalanan dari Rio de Janeiro ke Niteroi. Kemacetan di jalur transit mulai berkurang, sehingga estimasi tiba kembali sesuai jadwal. Kami kabari lagi begitu paket sampai.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 951, '2017-09-23 09:05:00-03'::timestamptz, NULL::timestamptz),
    -- Order 3333 - created
    ('33333333333333333333333333333333'::varchar, 'Pesananmu sudah kami terima dan sedang menunggu konfirmasi penjual di Jakarta Pusat. Setelah pesanan disetujui, paket akan segera kami proses untuk dikirim ke Bandung. Kami akan memberi kabar di setiap tahap berikutnya.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 934, '2026-10-01 09:20:00+07'::timestamptz, NULL::timestamptz),
    -- Order 4444 - processing
    ('44444444444444444444444444444444'::varchar, 'Paket dari Tangerang sedang kami siapkan di gudang sortir untuk perjalanan menuju Semarang. Tim operasional melakukan penimbangan dan penyegelan agar kiriman aman sampai tujuan. Estimasi tiba tetap sesuai jadwal.'::varchar, true, 'rule_based'::varchar, 'fallback-v1'::varchar, 'fallback'::varchar, 18, '2026-09-30 10:25:00+07'::timestamptz, NULL::timestamptz),
    -- Order 5555 - delivered lebih cepat
    ('55555555555555555555555555555555'::varchar, 'Hore! Paketmu sudah diterima di Surabaya pada 28 September 2026 pukul 14.45 WIB, lebih cepat dari estimasi. Terima kasih telah mempercayakan pengiriman kepada Anteraja. Sampai jumpa di pengiriman berikutnya!'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 1045, '2026-09-28 14:50:00+07'::timestamptz, NULL::timestamptz),
    -- Order 6666 - in_transit normal
    ('66666666666666666666666666666666'::varchar, 'Paketmu sedang dalam perjalanan dari Surabaya menuju Yogyakarta dan saat ini sudah melewati hub transit. Lalu lintas lancar, sehingga estimasi tiba pada 6 Oktober 2026 masih dapat dipenuhi. Kami pantau terus perjalanannya.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 889, '2026-09-30 09:20:00+07'::timestamptz, NULL::timestamptz),
    -- Order 6666 - timeout Gemini, dipakai teks fallback
    ('66666666666666666666666666666666'::varchar, 'Paketmu sedang menuju Yogyakarta dan sudah melewati hub transit di Semarang. Tidak ada kendala berarti pada perjalanan ini. Estimasi tiba 6 Oktober 2026 masih dapat dipenuhi dan kami akan memberi kabar berikutnya.'::varchar, true, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'error'::varchar, 1200, '2026-09-30 09:25:00+07'::timestamptz, NULL::timestamptz),
    ('66666666666666666666666666666666'::varchar, 'Paketmu sedang dalam perjalanan menuju Yogyakarta. Tim Satria Anteraja terus memantau proses pengiriman dan memastikan kiriman ditangani dengan aman. Status akan diperbarui saat paket tiba di titik berikutnya.'::varchar, true, 'rule_based'::varchar, 'fallback-v1'::varchar, 'fallback'::varchar, 21, '2026-09-30 09:30:00+07'::timestamptz, NULL::timestamptz),
    -- Order 7777 - canceled
    ('77777777777777777777777777777777'::varchar, 'Pengiriman ke Medan dibatalkan sebelum paket diserahkan ke kurir. Dana akan dikembalikan sesuai kebijakan penjual. Jika ini bukan yang kamu harapkan, silakan hubungi penjual atau layanan pelanggan Anteraja.'::varchar, true, 'rule_based'::varchar, 'fallback-v1'::varchar, 'fallback'::varchar, 22, '2026-09-27 13:10:00+07'::timestamptz, NULL::timestamptz),
    -- Order 8888 - shipped, lalu lintas sedang
    ('88888888888888888888888888888888'::varchar, 'Paket dari Yogyakarta sudah diserahkan ke kurir dan sedang menuju Palembang. Ada kepadatan lalu lintas di jalur transit, sehingga kami menambahkan estimasi sekitar 20 menit dari jadwal awal. Paket tetap aman.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 976, '2026-09-26 18:50:00+07'::timestamptz, NULL::timestamptz),
    -- ina...001 - approved
    ('ina20260928cgkbdo000000000000001'::varchar, 'Pesananmu dari Jakarta Selatan sudah disetujui penjual dan sedang menunggu penjemputan kurir. Paket akan kami antar ke Denpasar sesuai jadwal. Kami akan mengirim pembaruan begitu paket mulai bergerak.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 902, '2026-09-28 08:30:00+07'::timestamptz, NULL::timestamptz),
    -- ina...002 - processing
    ('ina20260929bksupg000000000000002'::varchar, 'Paket dari Bekasi sedang diproses di gudang kami sebelum berangkat ke Makassar. Proses pengepakan dan penyortiran berjalan normal tanpa kendala. Estimasi tiba 6 Oktober 2026 masih sesuai jadwal pengiriman.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 1180, '2026-09-29 17:30:00+07'::timestamptz, NULL::timestamptz),
    -- ina...003 - in_transit delay cuaca
    ('ina20260927mdnbpn000000000000003'::varchar, 'Perjalanan paketmu dari Medan ke Balikpapan sedikit tertunda karena cuaca buruk di jalur transit. Kurir menambah waktu tunggu sekitar 90 menit demi keselamatan. Paket dalam kondisi aman dan terus kami pantau.'::varchar, true, 'rule_based'::varchar, 'fallback-v1'::varchar, 'fallback'::varchar, 25, '2026-09-28 15:40:00+07'::timestamptz, NULL::timestamptz),
    -- ina...003 - timeout Gemini, teks fallback tersimpan
    ('ina20260927mdnbpn000000000000003'::varchar, 'Paketmu menuju Balikpapan mengalami penundaan karena cuaca buruk. Kurir mengutamakan keselamatan sehingga estimasi tiba bergeser sekitar 90 menit. Kami akan mengabari lagi saat cuaca membaik.'::varchar, true, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'error'::varchar, 1200, '2026-09-28 15:45:00+07'::timestamptz, NULL::timestamptz),
    -- ina...004 - in_transit pengalihan rute
    ('ina20260926plmmlg000000000000004'::varchar, 'Paketmu menuju Malang dialihkan melalui jalur alternatif karena ada penutupan jalan di rute utama. Pengalihan ini menambah sekitar 35 menit perjalanan, namun paket tetap aman dan diperkirakan tiba sesuai estimasi.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 1023, '2026-09-27 19:35:00+07'::timestamptz, NULL::timestamptz),
    -- ina...005 - in_transit gratis ongkir
    ('ina20260930subpku000000000000005'::varchar, 'Paketmu sedang dalam perjalanan dari Surabaya menuju Pekanbaru dengan gratis ongkir. Perjalanan berjalan lancar dan paket diperkirakan tiba pada 7 Oktober 2026. Kami akan memberi kabar saat paket tiba di hub tujuan.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 912, '2026-10-01 20:20:00+07'::timestamptz, NULL::timestamptz),
    -- ina...006 - delivered lebih awal
    ('ina20260924smgpdg000000000000006'::varchar, 'Kabar baik! Paketmu sudah diterima di Padang pada 26 September 2026, tiga hari lebih cepat dari estimasi. Terima kasih sudah menggunakan layanan Anteraja. Semoga barang yang kamu pesan sesuai harapan.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 998, '2026-09-26 11:25:00+07'::timestamptz, NULL::timestamptz),
    -- ina...007 - delivered
    ('ina20260922mlgbjm000000000000007'::varchar, 'Paketmu telah tiba di Banjarmasin dan diterima langsung oleh penerima pada 26 September 2026 pukul 16.05 WIB. Ada sedikit kepadatan di jalur akhir, namun pengiriman tetap selesai tepat waktu sesuai estimasi.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 1102, '2026-09-26 16:10:00+07'::timestamptz, NULL::timestamptz),
    -- ina...008 - canceled
    ('ina20260928pkupnk000000000000008'::varchar, 'Pengiriman ke Pontianak dibatalkan atas permintaan pembeli sebelum paket dijemput kurir. Tidak ada biaya pengiriman yang dikenakan. Silakan hubungi penjual jika ingin membuat pesanan baru dengan alamat yang sama.'::varchar, true, 'rule_based'::varchar, 'fallback-v1'::varchar, 'fallback'::varchar, 19, '2026-09-28 20:15:00+07'::timestamptz, NULL::timestamptz),
    -- ina...009 - unavailable
    ('ina20260923pdgmdc000000000000009'::varchar, 'Mohon maaf, pesanan menuju Manado tidak dapat diproses karena stok barang tidak tersedia di penjual Padang. Silakan hubungi penjual untuk penggantian produk atau pengembalian dana sesuai kebijakan mereka.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 1058, '2026-09-23 16:50:00+07'::timestamptz, NULL::timestamptz),
    -- ina...010 - shipped kendala teknis
    ('ina20260925bpnbth000000000000010'::varchar, 'Paketmu dari Balikpapan menuju Batam mengalami keterlambatan karena kendala teknis pada kendaraan operasional. Tim kami sudah menyiapkan kendaraan pengganti dan menambah estimasi sekitar 60 menit. Paket aman.'::varchar, true, 'rule_based'::varchar, 'fallback-v1'::varchar, 'fallback'::varchar, 27, '2026-09-26 13:40:00+07'::timestamptz, NULL::timestamptz),
    ('ina20260925bpnbth000000000000010'::varchar, 'Perjalanan paketmu menuju Batam tertunda karena kendala teknis kendaraan. Kurir pengganti sudah ditugaskan dan paket dipastikan aman. Estimasi tiba bergeser sekitar 60 menit dari jadwal sebelumnya.'::varchar, true, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'error'::varchar, 1200, '2026-09-26 13:45:00+07'::timestamptz, NULL::timestamptz),
    -- ina...011 - in_transit dua seller
    ('ina20260930bjmsoc000000000000011'::varchar, 'Dua paket dari Banjarmasin sedang dalam perjalanan menuju Solo melalui hub Surabaya. Keduanya diproses bersama agar lebih efisien. Estimasi tiba 8 Oktober 2026 masih dapat dipenuhi tanpa kendala berarti.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 967, '2026-10-01 22:15:00+07'::timestamptz, NULL::timestamptz),
    -- ina...012 - delivered
    ('ina20260920pnkcbn000000000000012'::varchar, 'Paketmu sudah diterima di Cirebon pada 24 September 2026 pukul 13.10 WIB, sehari lebih awal dari estimasi. Terima kasih telah mempercayakan pengirimanmu kepada Anteraja. Sampai jumpa di pengiriman berikutnya!'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 1088, '2026-09-24 13:15:00+07'::timestamptz, NULL::timestamptz),
    -- ina...013 - processing tiga item
    ('ina20261002mdcbog000000000000013'::varchar, 'Tiga paket dari Manado sedang kami siapkan untuk perjalanan ke Bogor. Seluruh item sudah diverifikasi dan kini berada dalam proses penyortiran di gudang asal. Estimasi tiba 9 Oktober 2026 masih sesuai jadwal.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 941, '2026-10-02 15:45:00+07'::timestamptz, NULL::timestamptz),
    -- ina...014 - in_transit delay lalu lintas
    ('ina20260929bthdpk000000000000014'::varchar, 'Paketmu menuju Depok tertahan kemacetan di jalur tengah, sehingga estimasi tiba bergeser sekitar 45 menit. Kurir Anteraja tetap melanjutkan perjalanan dan memastikan paketmu tiba dengan aman.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 1015, '2026-09-30 14:30:00+07'::timestamptz, NULL::timestamptz),
    ('ina20260929bthdpk000000000000014'::varchar, 'Paketmu sedang menuju Depok dan mengalami penundaan sekitar 45 menit karena kepadatan lalu lintas. Tim Satria Anteraja terus memantau perjalanan agar paket tiba dengan aman di alamat tujuan.'::varchar, true, 'rule_based'::varchar, 'fallback-v1'::varchar, 'fallback'::varchar, 24, '2026-09-30 14:35:00+07'::timestamptz, NULL::timestamptz),
    -- ina...015 - created
    ('ina20261003cbntng000000000000015'::varchar, 'Pesananmu dari Cirebon sudah tercatat di sistem Anteraja dan sedang menunggu konfirmasi penjual. Setelah disetujui, paket akan kami jemput untuk dikirim ke Tangerang. Terima kasih sudah berbelanja.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 875, '2026-10-03 08:10:00+07'::timestamptz, NULL::timestamptz),
    -- ina...016 - delivered terlambat karena cuaca
    ('ina20260918bogbks000000000000016'::varchar, 'Paketmu akhirnya tiba di Bekasi pada 27 September 2026. Pengiriman sempat tertunda karena cuaca buruk di jalur transit. Kami mohon maaf atas keterlambatan ini dan akan terus memperbaiki layanan kami.'::varchar, false, 'gemini'::varchar, 'gemini-2.5-flash'::varchar, 'success'::varchar, 1063, '2026-09-27 15:45:00+07'::timestamptz, NULL::timestamptz)
) AS v(order_id, text, is_fallback, provider, model, generation_status, latency_ms, generated_at, expires_at)
WHERE NOT EXISTS (
    SELECT 1 FROM ai_narratives n
    WHERE n.order_id = v.order_id AND n.generated_at = v.generated_at
);

COMMIT;

-- =============================================================================
-- Verifikasi cepat setelah menjalankan berkas ini:
--   SELECT 'customers' AS tabel, count(*) FROM customers
--   UNION ALL SELECT 'sellers', count(*) FROM sellers
--   UNION ALL SELECT 'orders', count(*) FROM orders
--   UNION ALL SELECT 'order_items', count(*) FROM order_items
--   UNION ALL SELECT 'smart_logistics_context', count(*) FROM smart_logistics_context
--   UNION ALL SELECT 'tracking_events', count(*) FROM tracking_events
--   UNION ALL SELECT 'ai_narratives', count(*) FROM ai_narratives;
--
-- Contoh pelacakan satu resi (dipakai widget):
--   SELECT * FROM tracking_summary WHERE waybill_number = 'ina20260927mdnbpn000000000000003';
--   SELECT event_at, event_code, description FROM tracking_events
--     WHERE order_id = 'ina20260927mdnbpn000000000000003' ORDER BY event_at ASC;
--   SELECT text, is_fallback FROM ai_narratives
--     WHERE order_id = 'ina20260927mdnbpn000000000000003' ORDER BY generated_at DESC LIMIT 1;
-- =============================================================================
