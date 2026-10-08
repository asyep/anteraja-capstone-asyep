-- PostgreSQL schema for Smart AI Shipment Tracking Widget Anteraja
-- Run with: psql -d anteraja_tracking -f database/schema.sql
BEGIN;

-- 1. Table: shipments
CREATE TABLE shipments (
    waybill_number varchar(32) PRIMARY KEY,
    service_type varchar(50) NOT NULL, -- e.g., 'AR-REG (Reguler)'
    
    -- Sender Info
    sender_name varchar(100) NOT NULL,
    sender_address varchar(255) NOT NULL,
    
    -- Receiver Info
    receiver_name varchar(100) NOT NULL,
    receiver_address varchar(255) NOT NULL,
    
    -- Package Details
    weight_kg numeric(8,2) NOT NULL,
    volume_m3 numeric(8,3),
    insurance_status boolean DEFAULT false,
    insurance_type varchar(50),
    is_free_shipping boolean DEFAULT false,
    has_sla_guarantee boolean DEFAULT false,
    
    -- Status and Timing
    shipment_status varchar(30) NOT NULL, -- 'PESANAN_DIBUAT', 'DIPROSES_KURIR', 'DALAM_PERJALANAN', 'DALAM_PENGANTARAN', 'TIBA_DI_TUJUAN', 'TIDAK_DITEMUKAN'
    purchase_date timestamptz,
    estimated_delivery_date timestamptz NOT NULL,
    delivered_date timestamptz,
    
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Table: couriers
CREATE TABLE couriers (
    courier_id varchar(32) PRIMARY KEY, -- e.g., '#JKT-88219'
    courier_name varchar(100) NOT NULL,
    courier_phone varchar(20),
    courier_photo_url text,
    vehicle_type varchar(50),
    vehicle_plate varchar(20),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Table: shipment_couriers (Mapping couriers to shipments if active)
CREATE TABLE shipment_couriers (
    waybill_number varchar(32) NOT NULL REFERENCES shipments(waybill_number) ON DELETE CASCADE,
    courier_id varchar(32) NOT NULL REFERENCES couriers(courier_id) ON DELETE CASCADE,
    assigned_at timestamptz NOT NULL DEFAULT now(),
    is_active boolean DEFAULT true,
    PRIMARY KEY (waybill_number, courier_id)
);

-- 4. Table: tracking_events
CREATE TABLE tracking_events (
    event_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    waybill_number varchar(32) NOT NULL REFERENCES shipments(waybill_number) ON DELETE CASCADE,
    event_code varchar(40) NOT NULL, -- e.g., '[IN TRANSIT]', '[OUTBOUND]'
    milestone_stage varchar(30), -- 'PESANAN_DIBUAT', 'DIPROSES_KURIR', 'DALAM_PERJALANAN', 'DALAM_PENGANTARAN', 'TIBA_DI_TUJUAN'
    title varchar(150) NOT NULL,
    description text,
    facility_name varchar(120),
    event_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_tracking_events_waybill ON tracking_events(waybill_number, event_at DESC);

-- 5. Table: telemetry_data (Live Map Data)
CREATE TABLE telemetry_data (
    telemetry_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    waybill_number varchar(32) NOT NULL UNIQUE REFERENCES shipments(waybill_number) ON DELETE CASCADE,
    latitude numeric(10,6),
    longitude numeric(10,6),
    speed_kmh numeric(5,1),
    location_name varchar(150),
    accuracy_percentage numeric(5,2),
    is_gps_active boolean DEFAULT true,
    
    logistics_delay_reason varchar(150),
    traffic_status varchar(50), -- 'Clear', 'Heavy', etc.
    weather_condition varchar(50),
    waiting_time_minutes integer DEFAULT 0,
    
    observed_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_telemetry_waybill ON telemetry_data(waybill_number);

-- 6. Table: ai_narratives
CREATE TABLE ai_narratives (
    narrative_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    waybill_number varchar(32) NOT NULL REFERENCES shipments(waybill_number) ON DELETE CASCADE,
    ai_title varchar(100), -- 'Satria Assistant'
    ai_subtitle varchar(150), -- 'Satria Hendra (Armada Linehaul)'
    narrative_text text NOT NULL,
    is_fallback boolean NOT NULL DEFAULT false,
    provider varchar(40) NOT NULL DEFAULT 'gemini',
    generation_status varchar(20) NOT NULL CHECK (generation_status IN ('success','fallback','error')),
    generated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_narratives_waybill ON ai_narratives(waybill_number, generated_at DESC);

-- 7. View: tracking_summary
CREATE VIEW tracking_summary AS
SELECT s.waybill_number, s.shipment_status, s.service_type, 
       s.sender_name, s.sender_address, 
       s.receiver_name, s.receiver_address, 
       s.estimated_delivery_date,
       t.latitude, t.longitude, t.speed_kmh, t.location_name,
       t.traffic_status, t.weather_condition, t.logistics_delay_reason,
       a.narrative_text
FROM shipments s
LEFT JOIN telemetry_data t ON t.waybill_number = s.waybill_number
LEFT JOIN ai_narratives a ON a.waybill_number = s.waybill_number;

COMMIT;
