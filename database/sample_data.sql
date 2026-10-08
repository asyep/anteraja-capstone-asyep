-- Synthetic demo records for normal, live, warning, delivered, and canceled flows.
BEGIN;

INSERT INTO shipments (
    waybill_number, service_type, 
    sender_name, sender_address, 
    receiver_name, receiver_address, 
    weight_kg, volume_m3, insurance_status, insurance_type, is_free_shipping, has_sla_guarantee, 
    shipment_status, estimated_delivery_date
) VALUES 
-- Normal / In-Transit (#10008492019945)
('10008492019945', 'AR-REG (Reguler)', 
'Toko Gadget Sejahtera', 'Jl. Braga No. 10, Bandung', 
'Budi Santoso', 'Jl. Merdeka No. 45, Jakarta Pusat', 
1.2, 0.005, true, 'Proteksi Penuh', true, true, 
'IN_TRANSIT', '2026-09-28 18:30:00+07'),

-- Live Telemetry (#10009214778215)
('10009214778215', 'AR-REG (Reguler)', 
'Toko Sentral Gadget Bandung', 'Coblong, Kota Bandung', 
'Dimas Prasetyo', 'Jl. Tebet Barat Raya No. 45, Jakarta Selatan', 
1.25, 0.002, true, 'Proteksi Penuh', true, true, 
'OUT_FOR_DELIVERY', '2026-09-28 18:30:00+07'),

-- Warning / Peringatan Jalur (#10007812938125)
('10007812938125', 'AR-REG (Reguler)', 
'Pusat Sepatu Olahraga', 'Grogol, Jakarta Barat', 
'Ahmad Yani', 'Jl. Pandanaran No. 12, Semarang', 
2.5, 0.015, false, 'Standar', false, false, 
'IN_TRANSIT', '2026-09-30 18:00:00+07'),

-- Delivered (#11111111111111)
('11111111111111', 'AR-NDR (Next Day)', 
'Kosmetik Nusantara', 'Sleman, Yogyakarta', 
'Siti Aminah', 'Jl. Pahlawan No. 22, Surabaya', 
0.5, 0.001, true, 'Proteksi Penuh', false, true, 
'DELIVERED', '2026-09-20 18:00:00+07'),

-- Canceled (#22222222222222)
('22222222222222', 'AR-REG (Reguler)', 
'Buku Kita', 'Denpasar, Bali', 
'Rina Nose', 'Jl. Sudirman No. 8, Mataram', 
1.0, 0.003, false, 'Standar', true, false, 
'NOT_FOUND', '2026-09-25 18:00:00+07');


INSERT INTO couriers (
    courier_id, courier_name, courier_phone, courier_photo_url, vehicle_type, vehicle_plate
) VALUES 
('#JKT-88219', 'Agus Prasetyo', '+6281119603333', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD69cWIIxsJ98_1KHzF7HXERTT10HAAaKI-NbrmGAH7H9zBLU7OxfW28XoSkbQUTkLHJmhOAWMtOt3pS925THRD7fSvlFqHQLiOCWn9kvfewwunbCyNBQP6qIxBXsFzXuz7kdmW0R0E-Z44rHi3TgY1HiGCTyIRhRfpJK3jNWIQt-saXAHMzTh1N4RHavyZstCt-O4CjNe5vLACuIfy7-mYZyxWgsRlLJQCS1u66EV3jbnQ1vGwsmXu-Q', 'Linehaul Truck', 'B 9421 KXP'),
('#BDG-99321', 'Asep Saepudin', '+6281119603334', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD69cWIIxsJ98_1KHzF7HXERTT10HAAaKI-NbrmGAH7H9zBLU7OxfW28XoSkbQUTkLHJmhOAWMtOt3pS925THRD7fSvlFqHQLiOCWn9kvfewwunbCyNBQP6qIxBXsFzXuz7kdmW0R0E-Z44rHi3TgY1HiGCTyIRhRfpJK3jNWIQt-saXAHMzTh1N4RHavyZstCt-O4CjNe5vLACuIfy7-mYZyxWgsRlLJQCS1u66EV3jbnQ1vGwsmXu-Q', 'Motorcycle', 'D 4321 ABC');


INSERT INTO shipment_couriers (waybill_number, courier_id) VALUES 
('10008492019945', '#JKT-88219'),
('10009214778215', '#JKT-88219'),
('10007812938125', '#BDG-99321');


INSERT INTO tracking_events (
    waybill_number, event_code, milestone_stage, title, description, facility_name, event_at
) VALUES 
-- Tracking Live Events (#10009214778215)
('10009214778215', '[PICKUP]', 'ORDER_CREATED', 'Paket Diterima dari Pengirim', 'Penjemputan oleh Satria Drop Point Dipatiukur Bandung.', 'Dipatiukur Bandung', '2026-09-26 09:15:00+07'),
('10009214778215', '[RECEIVED]', 'PICKUP_READY', 'Paket Tiba di Staging Gateway Bandung', 'Diterima petugas Satria Inbound dalam kondisi kemasan baik dan tersegel.', 'Gateway Bandung', '2026-09-26 18:40:00+07'),
('10009214778215', '[PROCESSED]', 'PICKUP_READY', 'Paket Telah Di-sortir di Gateway Bandung', 'Pemilahan conveyor otomatis selesai, diteruskan ke manifes muatan kontainer utama.', 'Gateway Bandung', '2026-09-26 21:15:00+07'),
('10009214778215', '[OUTBOUND]', 'PICKUP_READY', 'Pemindaian Barcode & Konsolidasi Karung Kargo', 'Area Sortir Otomatis Line B Gateway Bandung.', 'Gateway Bandung', '2026-09-26 23:40:00+07'),
('10009214778215', '[TRANSIT]', 'IN_TRANSIT', 'Paket Diberangkatkan ke Hub Distribusi Cakung', 'Truk Linehaul Lintas Jawa Barat–DKI Jakarta via Tol Cipularang.', 'Hub Cakung', '2026-09-27 01:15:00+07'),
('10009214778215', '[IN TRANSIT]', 'OUT_FOR_DELIVERY', 'Paket Berangkat dari Hub Sortir Bandung', 'Linehaul Armada Antar-Kota Truk B 9421 KXP menuju Hub Distribusi Cakung, Jakarta Timur.', 'Hub Cakung', '2026-09-27 04:20:00+07');


INSERT INTO telemetry_data (
    waybill_number, latitude, longitude, speed_kmh, location_name, accuracy_percentage, 
    is_gps_active, logistics_delay_reason, traffic_status, weather_condition
) VALUES 
('10009214778215', -6.3681, 107.2891, 78.0, 'Tol Cikampek KM 54 (Arah Barat)', 99.8, true, 'None', 'Clear', 'Cerah'),
('10007812938125', -6.8523, 107.5611, 10.0, 'Jalur Utama Pantura KM 10', 95.0, true, 'Kecelakaan Lalu Lintas', 'Heavy', 'Hujan Lebat');


INSERT INTO ai_narratives (
    waybill_number, ai_title, ai_subtitle, narrative_text, is_fallback, generation_status
) VALUES 
('10008492019945', 'Satria Assistant', 'Satria Agus (Kurir Pengantar)', 'Halo Kak! Paketmu bernomor resi 10008492019945 saat ini sedang dalam perjalanan menuju alamat. Cuaca sedang cerah dan lalu lintas lancar, estimasi tiba pukul 18:30 WIB.', false, 'success'),
('10009214778215', 'Satria Assistant', 'Satria Hendra (Armada Linehaul)', 'Halo Kak! Paketmu bernomor resi 10009214778215 saat ini sedang meluncur aman bersama armada linehaul Satria Hendra via Tol Cipularang. Kondisi cuaca sepanjang rute sangat cerah dan tidak ada hambatan operasional, sehingga paket diperkirakan tiba sebelum pukul 18:30 WIB. Tenang ya Kak, Satria kami selalu menjaga paketmu dengan penuh kehati-hatian!', false, 'success'),
('10007812938125', 'Sistem Deteksi Rute', 'AI Peringatan Dini', 'Mohon maaf, saat ini sedang terjadi hujan lebat di jalur pengiriman paket. Kemungkinan terjadi sedikit keterlambatan, namun kami berusaha semaksimal mungkin.', true, 'fallback');

COMMIT;
