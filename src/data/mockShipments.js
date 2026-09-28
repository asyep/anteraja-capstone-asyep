const milestones = (currentIndex, canceled = false, deliveredAt = null) => {
  const stages = [
    ['ORDER_CREATED', 'Pesanan dibuat', '2017-09-20T09:00:00-03:00'],
    ['PICKUP_READY', 'Diproses kurir', '2017-09-21T08:00:00-03:00'],
    ['IN_TRANSIT', 'Dalam perjalanan', '2017-09-23T16:30:00-03:00'],
    ['DELIVERED', 'Tiba di tujuan', deliveredAt],
  ];
  return stages.map(([code, label, timestamp], index) => ({
    code,
    label,
    timestamp: timestamp && index <= currentIndex ? timestamp : null,
    completed: !canceled && index < currentIndex,
    current: !canceled && index === currentIndex,
  }));
};

const shipments = [
  {
    waybill_number: '00010242fe8c5a6d1ba2dd792cb16214',
    order_status: 'in_transit', seller_city: 'Volta Redonda', customer_city: 'Campos dos Goytacazes',
    seller_name: 'Loja Centro Volta Redonda', customer_name: 'Marina Oliveira',
    item_description: 'Perlengkapan rumah', weight_kg: 1.2, service_name: 'Anteraja Reguler',
    logistics_delay_reason: 'None', traffic_status: 'Clear', waiting_time_minutes: 0, has_delay: false,
    estimated_delivery_date: '2017-09-28', estimated_delivery_time: '18:30',
    delivered_at: null, is_free_shipping: false, insurance_active: true,
    ai_narrative: { text: 'Paket Kakak sedang bergerak dari Volta Redonda menuju Campos dos Goytacazes. Perjalanan saat ini berjalan lancar dan kurir memperbarui setiap titik transit agar paket tiba sesuai perkiraan.', is_fallback: false },
    milestone_stages: milestones(2),
  },
  {
    waybill_number: '0008288aa423d2a3f00fcb17cd7d8719',
    order_status: 'in_transit', seller_city: 'Rio de Janeiro', customer_city: 'Niteroi',
    seller_name: 'Toko Elektronik Carioca', customer_name: 'Budi Santoso',
    item_description: 'Aksesori elektronik', weight_kg: 1.8, service_name: 'Anteraja Reguler',
    logistics_delay_reason: 'Traffic Jam', traffic_status: 'Heavy', waiting_time_minutes: 45, has_delay: true,
    estimated_delivery_date: '2017-09-29', estimated_delivery_time: '12:00',
    delivered_at: null, is_free_shipping: true, insurance_active: true,
    ai_narrative: { text: 'Paket Kakak sedang menuju Niteroi dari Rio de Janeiro. Lalu lintas padat menambah waktu perjalanan, jadi estimasi kami sesuaikan. Kurir terus memantau rute dan mengupayakan kiriman tiba dengan aman.', is_fallback: true },
    milestone_stages: milestones(2),
  },
  {
    waybill_number: '11111111111111111111111111111111',
    order_status: 'delivered', seller_city: 'Volta Redonda', customer_city: 'Sao Paulo',
    seller_name: 'Toko Serba Ada', customer_name: 'Dewi Lestari',
    item_description: 'Paket pilihan', weight_kg: 0.8, service_name: 'Anteraja NextDay',
    logistics_delay_reason: 'None', traffic_status: 'Clear', waiting_time_minutes: 0, has_delay: false,
    estimated_delivery_date: '2017-09-28', estimated_delivery_time: '18:00',
    delivered_at: '2017-09-25T14:20:00+07:00', is_free_shipping: false, insurance_active: true,
    ai_narrative: { text: 'Paket Kakak sudah diterima di Sao Paulo pada 25 September pukul 14.20 WIB. Perjalanan dari Volta Redonda selesai dengan aman. Terima kasih telah mempercayakan kiriman kepada Anteraja.', is_fallback: false },
    milestone_stages: milestones(3, false, '2017-09-25T14:20:00+07:00'),
  },
  {
    waybill_number: '22222222222222222222222222222222',
    order_status: 'canceled', seller_city: 'Rio de Janeiro', customer_city: 'Niteroi',
    seller_name: 'Toko Carioca', customer_name: 'Rizky Pratama',
    item_description: 'Barang pesanan', weight_kg: 1, service_name: 'Anteraja Reguler',
    logistics_delay_reason: 'None', traffic_status: 'Unknown', waiting_time_minutes: 0, has_delay: false,
    estimated_delivery_date: '2017-09-29', estimated_delivery_time: null,
    delivered_at: null, is_free_shipping: false, insurance_active: false,
    ai_narrative: { text: 'Pengiriman ini dibatalkan sebelum perjalanan dimulai. Jika pembatalan tidak sesuai dengan permintaan Kakak, hubungi penjual untuk memastikan tindak lanjut pesanan dan pengembalian dana.', is_fallback: true },
    milestone_stages: milestones(-1, true),
  },
  {
    waybill_number: '33333333333333333333333333333333',
    order_status: 'processing', seller_city: 'Jakarta Selatan', customer_city: 'Bandung',
    seller_name: 'Kreasi Nusantara', customer_name: 'Nadia Putri',
    item_description: 'Busana', weight_kg: 0.6, service_name: 'Anteraja Reguler',
    logistics_delay_reason: 'None', traffic_status: 'Clear', waiting_time_minutes: 0, has_delay: false,
    estimated_delivery_date: '2026-09-30', estimated_delivery_time: '18:00',
    delivered_at: null, is_free_shipping: false, insurance_active: false,
    ai_narrative: { text: 'Pesanan Kakak sedang disiapkan di hub pengiriman Jakarta Selatan. Setelah proses sortir selesai, paket akan diteruskan ke Bandung. Kami akan memperbarui informasi begitu paket mulai bergerak.', is_fallback: true },
    milestone_stages: milestones(1),
  },
  {
    waybill_number: '44444444444444444444444444444444',
    order_status: 'in_transit', seller_city: 'Surabaya', customer_city: 'Yogyakarta',
    seller_name: 'Surya Gadget', customer_name: 'Andi Saputra',
    item_description: 'Perangkat elektronik', weight_kg: 2.4, service_name: 'Anteraja Reguler',
    logistics_delay_reason: 'Weather', traffic_status: 'Moderate', waiting_time_minutes: 75, has_delay: true,
    estimated_delivery_date: '2026-10-01', estimated_delivery_time: '16:30',
    delivered_at: null, is_free_shipping: false, insurance_active: true,
    ai_narrative: { text: 'Paket Kakak tetap bergerak menuju Yogyakarta, tetapi cuaca di jalur transit membuat perjalanan perlu lebih berhati-hati. Estimasi telah diperbarui dan kurir memprioritaskan keselamatan paket selama pengantaran.', is_fallback: true },
    milestone_stages: milestones(2),
  },
];

export default shipments;
