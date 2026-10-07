-- Synthetic demo records for normal, delayed, delivered, and canceled flows.
BEGIN;
INSERT INTO customers(customer_id, customer_city, customer_state) VALUES
('cust-demo-001','Campos dos Goytacazes','RJ'),
('cust-demo-002','Niteroi','RJ'),
('cust-demo-003','Sao Paulo','SP');

INSERT INTO sellers(seller_id, seller_city, seller_state) VALUES
('seller-demo-001','Volta Redonda','RJ'),
('seller-demo-002','Rio de Janeiro','RJ');

INSERT INTO orders(order_id, customer_id, order_status, order_purchase_timestamp,
 order_approved_at, order_delivered_carrier_date, order_delivered_customer_date, order_estimated_delivery_date) VALUES
('00010242fe8c5a6d1ba2dd792cb16214','cust-demo-001','in_transit','2017-09-20 09:00:00-03','2017-09-20 10:00:00-03','2017-09-21 08:00:00-03',NULL,'2017-09-28'),
('0008288aa423d2a3f00fcb17cd7d8719','cust-demo-002','in_transit','2017-09-19 11:00:00-03','2017-09-19 12:00:00-03','2017-09-20 07:00:00-03',NULL,'2017-09-25'),
('11111111111111111111111111111111','cust-demo-003','delivered','2017-09-20 09:00:00-03','2017-09-20 10:00:00-03','2017-09-21 08:00:00-03','2017-09-25 14:20:00-03','2017-09-28'),
('22222222222222222222222222222222','cust-demo-002','canceled','2017-09-22 09:00:00-03',NULL,NULL,NULL,'2017-09-29');

INSERT INTO order_items(order_id, order_item_id, seller_id, price, freight_value) VALUES
('00010242fe8c5a6d1ba2dd792cb16214',1,'seller-demo-001',125000.00,15000.00),
('0008288aa423d2a3f00fcb17cd7d8719',1,'seller-demo-002',250000.00,0.00),
('11111111111111111111111111111111',1,'seller-demo-001',75000.00,10000.00),
('22222222222222222222222222222222',1,'seller-demo-002',50000.00,8000.00);

INSERT INTO smart_logistics_context(order_id, logistics_delay_reason, traffic_status, waiting_time_minutes, observed_at) VALUES
('00010242fe8c5a6d1ba2dd792cb16214','None','Clear',0,'2017-09-23 09:00:00-03'),
('0008288aa423d2a3f00fcb17cd7d8719','Traffic Jam','Heavy',45,'2017-09-23 09:00:00-03'),
('11111111111111111111111111111111','None','Clear',0,'2017-09-25 14:20:00-03'),
('22222222222222222222222222222222','None','Clear',0,'2017-09-22 09:00:00-03');

INSERT INTO tracking_events(order_id,event_code,milestone_stage,description,facility_name,event_at) VALUES
('00010242fe8c5a6d1ba2dd792cb16214','ORDER_CREATED','ORDER_CREATED','Pesanan dibuat','Volta Redonda','2017-09-20 09:00:00-03'),
('00010242fe8c5a6d1ba2dd792cb16214','PICKUP_READY','PICKUP_READY','Paket diterima kurir','Hub Volta Redonda','2017-09-21 08:00:00-03'),
('00010242fe8c5a6d1ba2dd792cb16214','IN_TRANSIT_HUB','IN_TRANSIT','Paket bergerak ke hub tujuan','Hub Rio de Janeiro','2017-09-22 16:30:00-03'),
('0008288aa423d2a3f00fcb17cd7d8719','ORDER_CREATED','ORDER_CREATED','Pesanan dibuat','Rio de Janeiro','2017-09-19 11:00:00-03'),
('0008288aa423d2a3f00fcb17cd7d8719','PICKUP_READY','PICKUP_READY','Paket diterima kurir','Hub Rio de Janeiro','2017-09-20 07:00:00-03'),
('0008288aa423d2a3f00fcb17cd7d8719','TRAFFIC_DELAY','IN_TRANSIT','Perjalanan tertunda karena lalu lintas padat','Jalur Niteroi','2017-09-23 09:00:00-03'),
('11111111111111111111111111111111','ORDER_CREATED','ORDER_CREATED','Pesanan dibuat','Volta Redonda','2017-09-20 09:00:00-03'),
('11111111111111111111111111111111','PICKUP_READY','PICKUP_READY','Paket diterima kurir','Hub Volta Redonda','2017-09-21 08:00:00-03'),
('11111111111111111111111111111111','DELIVERED','DELIVERED','Paket diterima pelanggan','Sao Paulo','2017-09-25 14:20:00-03'),
('22222222222222222222222222222222','ORDER_CREATED','ORDER_CREATED','Pesanan dibuat','Rio de Janeiro','2017-09-22 09:00:00-03'),
('22222222222222222222222222222222','CANCELED','CANCELED','Pengiriman dibatalkan',NULL,'2017-09-22 10:00:00-03');

INSERT INTO ai_narratives(order_id,text,is_fallback,provider,generation_status,latency_ms,generated_at) VALUES
('00010242fe8c5a6d1ba2dd792cb16214','Paketmu saat ini sedang dalam perjalanan dari Volta Redonda menuju Campos dos Goytacazes. Pengiriman berjalan lancar dan diperkirakan tiba sesuai estimasi.',false,'gemini','success',812,'2017-09-23 09:00:01-03'),
('0008288aa423d2a3f00fcb17cd7d8719','Paketmu sedang dalam perjalanan dari Rio de Janeiro menuju Niteroi. Ada hambatan lalu lintas padat di jalur transit, namun kurir Anteraja terus mengupayakan paket tiba secepatnya.',true,'rule_based','fallback',1200,'2017-09-23 09:00:01-03');
COMMIT;
