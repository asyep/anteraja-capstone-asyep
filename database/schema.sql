-- PostgreSQL schema for Smart AI Shipment Tracking Widget Anteraja
-- Run with: psql -d anteraja_tracking -f database/schema.sql
BEGIN;

CREATE TABLE customers (
    customer_id varchar(32) PRIMARY KEY,
    customer_city varchar(100) NOT NULL,
    customer_state varchar(2),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sellers (
    seller_id varchar(32) PRIMARY KEY,
    seller_city varchar(100) NOT NULL,
    seller_state varchar(2),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orders (
    order_id varchar(32) PRIMARY KEY,
    customer_id varchar(32) NOT NULL REFERENCES customers(customer_id),
    order_status varchar(24) NOT NULL CHECK (order_status IN ('created','approved','processing','in_transit','shipped','delivered','canceled','unavailable')),
    order_purchase_timestamp timestamptz NOT NULL,
    order_approved_at timestamptz,
    order_delivered_carrier_date timestamptz,
    order_delivered_customer_date timestamptz,
    order_estimated_delivery_date date NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (order_delivered_customer_date IS NULL OR order_delivered_carrier_date IS NULL OR order_delivered_customer_date >= order_delivered_carrier_date)
);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_estimated_delivery ON orders(order_estimated_delivery_date);

CREATE TABLE order_items (
    order_id varchar(32) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    order_item_id smallint NOT NULL CHECK (order_item_id > 0),
    seller_id varchar(32) NOT NULL REFERENCES sellers(seller_id),
    price numeric(12,2) NOT NULL CHECK (price >= 0),
    freight_value numeric(12,2) NOT NULL CHECK (freight_value >= 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY(order_id, order_item_id)
);
CREATE INDEX idx_order_items_seller_id ON order_items(seller_id);

-- One row per order is the MVP assumption. Change order_id to a non-unique FK
-- and add observed_at if multiple operational snapshots per shipment are needed.
CREATE TABLE smart_logistics_context (
    context_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id varchar(32) NOT NULL UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
    logistics_delay_reason varchar(80) NOT NULL DEFAULT 'None',
    traffic_status varchar(24) NOT NULL DEFAULT 'Clear' CHECK (traffic_status IN ('Clear','Moderate','Heavy','Detour','Unknown')),
    waiting_time_minutes integer NOT NULL DEFAULT 0 CHECK (waiting_time_minutes >= 0),
    observed_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_logistics_delay ON smart_logistics_context(logistics_delay_reason, traffic_status);

-- Normalized operational event history supports accurate timestamped stepper.
CREATE TABLE tracking_events (
    event_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id varchar(32) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    event_code varchar(40) NOT NULL,
    milestone_stage varchar(24) CHECK (milestone_stage IN ('ORDER_CREATED','PICKUP_READY','IN_TRANSIT','DELIVERED','CANCELED')),
    description varchar(300),
    facility_name varchar(120),
    event_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(order_id, event_code, event_at)
);
CREATE INDEX idx_tracking_events_order_time ON tracking_events(order_id, event_at);

-- Append-only generated text/logs aid telemetry, CS review, and regeneration.
CREATE TABLE ai_narratives (
    narrative_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id varchar(32) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    text varchar(500) NOT NULL CHECK (char_length(text) BETWEEN 1 AND 500),
    is_fallback boolean NOT NULL,
    provider varchar(40) NOT NULL DEFAULT 'gemini',
    model varchar(80),
    generation_status varchar(16) NOT NULL CHECK (generation_status IN ('success','fallback','error')),
    latency_ms integer CHECK (latency_ms >= 0),
    generated_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz
);
CREATE INDEX idx_ai_narratives_order_generated ON ai_narratives(order_id, generated_at DESC);

-- UI/API projection. Keep computed values out of base tables; optionally use this view.
CREATE VIEW tracking_summary AS
SELECT o.order_id AS waybill_number, o.order_status, o.order_purchase_timestamp,
       o.order_delivered_carrier_date, o.order_delivered_customer_date,
       o.order_estimated_delivery_date, c.customer_city,
       string_agg(DISTINCT s.seller_city, ', ' ORDER BY s.seller_city) AS seller_city,
       sum(oi.price)::numeric(12,2) AS item_total,
       sum(oi.freight_value)::numeric(12,2) AS freight_total,
       COALESCE(bool_or(oi.freight_value = 0), false) AS has_free_shipping,
       sl.logistics_delay_reason, sl.traffic_status, sl.waiting_time_minutes,
       (COALESCE(sl.logistics_delay_reason, 'None') <> 'None'
        OR COALESCE(sl.traffic_status, 'Clear') IN ('Heavy','Detour')) AS has_delay
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
LEFT JOIN order_items oi ON oi.order_id = o.order_id
LEFT JOIN sellers s ON s.seller_id = oi.seller_id
LEFT JOIN smart_logistics_context sl ON sl.order_id = o.order_id
GROUP BY o.order_id, c.customer_city, sl.logistics_delay_reason, sl.traffic_status, sl.waiting_time_minutes;

COMMIT;
