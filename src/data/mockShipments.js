export const mockShipments = [
  {
    waybill_number: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    order_status: "in_transit",
    seller_city: "Jakarta Pusat",
    customer_city: "Bandung",
    logistics_delay_reason: "None",
    traffic_status: "Clear",
    has_delay: false,
    order_estimated_delivery_date: "2026-10-02T10:00:00Z",
    order_delivered_customer_date: null,
    ai_narrative: {
      text: "Paket Anda sedang dalam perjalanan menuju Bandung. Cuaca cerah dan lalu lintas lancar, estimasi tiba tepat waktu pada tanggal 2 Oktober 2026. Terima kasih telah menggunakan Anteraja.",
      is_fallback: false
    },
    milestone_stages: [
      { stage: "Order Created", status: "completed", timestamp: "2026-09-28T08:00:00Z" },
      { stage: "Pickup Ready", status: "completed", timestamp: "2026-09-28T14:30:00Z" },
      { stage: "In Transit", status: "current", timestamp: "2026-09-29T09:15:00Z" },
      { stage: "Delivered", status: "pending", timestamp: null }
    ]
  },
  {
    waybill_number: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7",
    order_status: "delivered",
    seller_city: "Surabaya",
    customer_city: "Semarang",
    logistics_delay_reason: "None",
    traffic_status: "Clear",
    has_delay: false,
    order_estimated_delivery_date: "2026-09-28T15:00:00Z",
    order_delivered_customer_date: "2026-09-28T14:45:00Z",
    ai_narrative: {
      text: "Hore! Paket Anda telah berhasil dikirim dan diterima di Semarang lebih awal dari perkiraan. Kami harap Anda puas dengan layanan pengiriman cerdas Anteraja.",
      is_fallback: false
    },
    milestone_stages: [
      { stage: "Order Created", status: "completed", timestamp: "2026-09-26T10:00:00Z" },
      { stage: "Pickup Ready", status: "completed", timestamp: "2026-09-26T16:00:00Z" },
      { stage: "In Transit", status: "completed", timestamp: "2026-09-27T08:30:00Z" },
      { stage: "Delivered", status: "completed", timestamp: "2026-09-28T14:45:00Z" }
    ]
  },
  {
    waybill_number: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8",
    order_status: "in_transit",
    seller_city: "Medan",
    customer_city: "Palembang",
    logistics_delay_reason: "Weather",
    traffic_status: "Heavy",
    has_delay: true,
    order_estimated_delivery_date: "2026-10-04T12:00:00Z",
    order_delivered_customer_date: null,
    ai_narrative: {
      text: "Mohon maaf, terdapat sedikit keterlambatan karena kondisi cuaca buruk di area transit. Kami terus memantau situasi untuk memastikan paket Anda tiba dengan aman secepat mungkin.",
      is_fallback: false
    },
    milestone_stages: [
      { stage: "Order Created", status: "completed", timestamp: "2026-09-29T07:00:00Z" },
      { stage: "Pickup Ready", status: "completed", timestamp: "2026-09-29T11:00:00Z" },
      { stage: "In Transit", status: "current", timestamp: "2026-09-29T18:00:00Z" },
      { stage: "Delivered", status: "pending", timestamp: null }
    ]
  },
  {
    waybill_number: "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9",
    order_status: "pickup_ready",
    seller_city: "Yogyakarta",
    customer_city: "Malang",
    logistics_delay_reason: "None",
    traffic_status: "Clear",
    has_delay: false,
    order_estimated_delivery_date: "2026-10-03T18:00:00Z",
    order_delivered_customer_date: null,
    ai_narrative: {
      text: "Paket Anda sudah disiapkan oleh pengirim dan sedang menunggu penjemputan oleh kurir SATRIA kami. Estimasi pengiriman berjalan sesuai jadwal yang ditentukan.",
      is_fallback: false
    },
    milestone_stages: [
      { stage: "Order Created", status: "completed", timestamp: "2026-09-29T10:00:00Z" },
      { stage: "Pickup Ready", status: "current", timestamp: "2026-09-29T11:15:00Z" },
      { stage: "In Transit", status: "pending", timestamp: null },
      { stage: "Delivered", status: "pending", timestamp: null }
    ]
  },
  {
    waybill_number: "e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    order_status: "in_transit",
    seller_city: "Denpasar",
    customer_city: "Jakarta Selatan",
    logistics_delay_reason: "Traffic Jam",
    traffic_status: "Detour",
    has_delay: true,
    order_estimated_delivery_date: "2026-10-05T14:00:00Z",
    order_delivered_customer_date: null,
    ai_narrative: {
      text: "Terdapat pengalihan rute akibat kemacetan lalu lintas yang parah di jalur utama. Sistem AI kami telah memilih rute alternatif terbaik agar paket Anda tetap aman dan segera sampai.",
      is_fallback: false
    },
    milestone_stages: [
      { stage: "Order Created", status: "completed", timestamp: "2026-09-28T09:00:00Z" },
      { stage: "Pickup Ready", status: "completed", timestamp: "2026-09-28T13:00:00Z" },
      { stage: "In Transit", status: "current", timestamp: "2026-09-29T08:00:00Z" },
      { stage: "Delivered", status: "pending", timestamp: null }
    ]
  },
  {
    waybill_number: "f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1",
    order_status: "canceled",
    seller_city: "Makassar",
    customer_city: "Balikpapan",
    logistics_delay_reason: "None",
    traffic_status: "Clear",
    has_delay: false,
    order_estimated_delivery_date: "2026-10-01T10:00:00Z",
    order_delivered_customer_date: null,
    ai_narrative: {
      text: "Pengiriman paket ini telah dibatalkan atas permintaan pengirim atau masalah teknis operasional. Silakan hubungi layanan pelanggan kami untuk informasi lebih lanjut mengenai pengembalian.",
      is_fallback: true
    },
    milestone_stages: [
      { stage: "Order Created", status: "completed", timestamp: "2026-09-27T10:00:00Z" },
      { stage: "Pickup Ready", status: "completed", timestamp: "2026-09-27T14:00:00Z" },
      { stage: "In Transit", status: "canceled", timestamp: null },
      { stage: "Delivered", status: "canceled", timestamp: null }
    ]
  }
];
