/**
 * Data contoh untuk halaman status "Dalam Pengantaran".
 *
 * Kondisi ketika paket sudah dibawa Satria (kurir) dan sedang menuju alamat
 * penerima — tahap terakhir sebelum paket diterima.
 *
 * Catatan: "Radar Posisi Paket" bergerak otomatis mendekati alamat penerima
 * (lihat features/tracking/data/deliveryRoutes.js).
 */
export const OUT_FOR_DELIVERY_DATA = {
  waybill: "10002847192847192837461928374621",
  service: "Reguler",

  sender: {
    name: "Toko Sentral Komputer Semarang",
    city: "Kota Semarang, Jawa Tengah",
  },
  receiver: {
    name: "Budi Santoso",
    address:
      "Jl. Tebet Barat Dalam No. 42, RT 05 / RW 03, Jakarta Selatan, DKI Jakarta 12810",
  },

  package: {
    serviceName: "Anteraja Regular",
    serviceEta: "1-2 Hari Kerja",
    weight: "1.25 Kg",
    dimension: "Dimensi 20x15x10 cm",
    insurance: "Terlindungi",
    instruction: "Taruh di Rak Teras jika Kosong",
  },

  /** Banner status: gradien magenta gelap, badge estimasi tiba per menit. */
  status: {
    code: "DALAM PENGANTARAN",
    label: "Paket Sedang Dibawa Satria Menuju Alamat Penerima",
    icon: "electric_moped",
    variant: "delivery",
    badges: [
      {
        id: "gratis-ongkir",
        label: "Gratis Ongkir",
        icon: "local_shipping",
        className: "bg-white text-primary",
      },
      {
        id: "dalam-pengantaran",
        label: "Dalam Pengantaran",
        dot: "bg-primary animate-ping",
        className: "bg-secondary-container text-on-secondary-container",
      },
      {
        id: "estimasi-tiba",
        label: "Estimasi Tiba: 30 – 45 Menit (Hari ini sebelum 18:00 WIB)",
        icon: "schedule",
        tone: "ghost",
        className:
          "bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium",
      },
    ],
  },

  /** Narasi Satria Assistant — sumbernya sama dengan halaman status lain. */
  assistant: {
    name: "Satria Assistant",
    courierName: "Delivery Hub Jakarta Selatan - Tebet",
    courierId: "",
    avatar: "/profil-assistant.svg",
    message:
      "Halo Kak Budi! Kabar baik, paketmu saat ini sudah dibawa oleh Satria Agus Prasetyo dan sedang bergerak menuju alamat rumahmu di Jl. Tebet Barat Dalam No. 42. Pastikan nomor teleponmu aktif ya, Satria akan segera tiba dalam estimasi 30–45 menit ke depan!",
    whatsapp:
      "https://wa.me/6281119603333?text=Halo%20Satria%20AI,%20saya%20penerima%20paket%20100028471928",
    protocol: "Protokol Satria Sigap & Aman",
    aiBadge: true,
  },

  updatedLabel: "Updated 1 menit lalu",

  /** 5 tahap; empat tahap selesai, tahap ke-4 sedang berjalan. */
  milestones: [
    {
      id: "created",
      label: "Pesanan Dibuat",
      time: "26 Sep, 09:15",
      place: "Hub Semarang / Pengirim",
      icon: "check",
      state: "done",
    },
    {
      id: "courier",
      label: "Diproses Kurir",
      time: "26 Sep, 14:30",
      place: "Staging DC Semarang",
      icon: "check",
      state: "done",
    },
    {
      id: "transit",
      label: "Dalam Perjalanan",
      time: "27 Sep, 04:15",
      place: "Transit Hub Cirebon",
      icon: "check",
      state: "done",
    },
    {
      id: "delivering",
      label: "Dalam Pengantaran",
      time: "28 Sep, 13:45 WIB",
      place: "Menuju Lokasi Penerima",
      placeClass: "text-primary font-semibold",
      icon: "electric_moped",
      state: "done",
      pulse: true,
    },
    {
      id: "arrived",
      label: "Tiba di Tujuan",
      time: "Est. 17:00 WIB",
      place: "Tebet, Jakarta Selatan",
      icon: "home",
      state: "pending",
    },
  ],

  /** Catatan perjalanan: 9 pos, posisi terkini ditandai state "progress". */
  journey: {
    progressLabel: "4 dari 5 Pos Selesai",
    notes: [
      {
        id: "note-ofd",
        title:
          "[OUT FOR DELIVERY] Paket sedang dibawa oleh Satria (Agus Prasetyo) menuju alamat penerima (Jl. Tebet Barat Dalam No. 42)",
        description: "Petugas kurir Satria Tebet Barat sedang dalam rute pengantaran.",
        time: "28/09 13:45",
        state: "progress",
      },
      {
        id: "note-arrived-hub",
        title:
          "[ARRIVED AT HUB] Paket telah tiba di Delivery Hub Jakarta Selatan (Tebet Staging Store)",
        description: "Selesai disortir ke kantong kurir pengantaran Satria.",
        time: "28/09 08:30",
        state: "done",
      },
      {
        id: "note-gateway",
        title:
          "[TRANSIT GATEWAY] Paket tiba di Sorting Gateway Jakarta Timur (Halim DC)",
        description: "Diberangkatkan ke Delivery Hub Tebet via Shuttle DC.",
        time: "28/09 03:15",
        state: "done",
      },
      {
        id: "note-in-transit",
        title: "[IN TRANSIT] Paket Tiba di Fasilitas Transit Hub Cirebon Barat",
        description:
          "Pemeriksaan armada & konsolidasi kargo jalur Pantura/Cipali menuju Sorting Gateway Jakarta.",
        time: "27/09 04:15",
        state: "done",
      },
      {
        id: "note-departed",
        title:
          "[DEPARTED] Paket Diberangkatkan dari Staging Gateway Semarang Hub",
        description:
          "Armada Linehaul B 9421 KXP bergerak via rute Tol Trans Jawa (Pantura).",
        time: "26/09 23:45",
        state: "done",
      },
      {
        id: "note-manifest",
        title: "[PROCESSED] Manifest Muatan Selesai di Hub Sortir Semarang",
        description:
          "Paket dimuat ke kontainer JKT-TB-01 dengan segel pengaman logistik resmi.",
        time: "26/09 18:30",
        state: "done",
      },
      {
        id: "note-processed",
        title:
          "[PROCESSED] Paket Telah Tiba di Hub Sortir (Staging DC Semarang)",
        description:
          "Pemilahan barcode conveyor selesai, paket siap diberangkatkan via armada Linehaul.",
        time: "26/09 14:30",
        state: "done",
      },
      {
        id: "note-picked-up",
        title: "[PICKED UP] Paket Berhasil Dijemput oleh Satria Pickup",
        description:
          "Diserahterimakan dari pihak pengirim (Toko Sentral Komputer Semarang).",
        time: "26/09 11:20",
        state: "done",
      },
      {
        id: "note-created",
        title: "[ORDER CREATED] Informasi Pesanan Telah Diterima",
        description:
          "Permintaan penjemputan paket telah dijadwalkan oleh sistem Anteraja.",
        time: "26/09 09:15",
        state: "idle",
      },
    ],
  },

  /**
   * Radar posisi: varian "delivery" — kurir bergerak mendekati alamat
   * penerima mengikuti rute "tebet-barat-dalam".
   */
  radar: {
    variant: "delivery",
    icon: "electric_moped",
    routeId: "tebet-barat-dalam",
    // Mulai dari titik saat kurir berjarak 0.8 km dari lokasi penerima.
    startIndex: 2,
    intervalMs: 4000,
    pillLabel: "Satria Bergerak",
    liveBadgeLabel: "Live GPS Satria Aktif",
    zoneLabel: "Rute Terakhir Satria Tebet",
    coordinates: "LAT: -6.2382, LON: 106.8530",
    footerLabel: "Radar Posisi Paket",
    footerDoneLabel: "Satria Tiba di Alamat Penerima",
  },

  /** Kartu kurir: sudah bertugas, tombol hubungi aktif. */
  courier: {
    active: true,
    idLabel: "Sedang Bertugas",
    name: "Agus Prasetyo",
    avatar: "",
    rating: "4.98",
    totalKiriman: "2,410 Kiriman Sukses",
    armada: "Armada Satria Motor Tebet",
    armadaId: "JKT-88219",
    activeNote: "Sedang bertugas aktif di rute (0.8 km dari lokasi Anda)",
    phone: "tel:081234567890",
    whatsapp:
      "https://wa.me/6281234567890?text=Halo%20Mas%20Agus%20Satria,%20terkait%20pengantaran%20paket%20ke%20Tebet%20Barat",
  },
};
