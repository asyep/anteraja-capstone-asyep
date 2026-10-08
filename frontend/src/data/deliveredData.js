/**
 * Data contoh untuk halaman status "Tiba di Tujuan".
 *
 * Kondisi ketika paket sudah sampai ke alamat penerima dan telah diterima
 * langsung oleh penerima dengan bukti serah terima (POD) yang valid.
 */
export const DELIVERED_DATA = {
  waybill: "10002847192847192837461928374622",
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

  status: {
    code: "TIBA DI TUJUAN",
    label: "Paket Berhasil Diterima oleh Budi Santoso (Penerima Langsung)",
    icon: "task_alt",
    variant: "delivered",
    badges: [
      {
        id: "gratis-ongkir",
        label: "Gratis Ongkir",
        icon: "local_shipping",
        className: "bg-white text-primary",
      },
      {
        id: "diterima",
        label: "Paket Diterima",
        dot: "bg-tertiary",
        className: "bg-tertiary-fixed text-on-tertiary-fixed",
      },
      {
        id: "diterima-pada",
        label: "Diterima: 28 Sep 2024, 14:20 WIB",
        icon: "schedule",
        tone: "ghost",
        className:
          "bg-white/20 border border-white/20 text-white backdrop-blur-md font-medium",
      },
    ],
  },

  assistant: {
    name: "Satria Assistant",
    courierName: "Delivery Hub Jakarta Selatan - Tebet",
    courierId: "SATRIA-0412",
    avatar: "/profil-assistant.svg",
    message:
      "Halo Kak Budi! Paketmu sudah berhasil diterima oleh Budi Santoso di alamat rumahnya di Jl. Tebet Barat Dalam No. 42 pada pukul 14:20 WIB. Bukti serah terima (POD) sudah terverifikasi dan tersimpan aman di sistem Anteraja. Terima kasih telah mempercayakan pengirimanmu kepada Anteraja.",
    whatsapp:
      "https://wa.me/6281119603333?text=Halo%20Satria%20AI,%20saya%20penerima%20paket%201000284719282847192837461922",
    protocol: "Protokol Satria Sigap & Aman",
    aiBadge: true,
  },

  updatedLabel: "Updated 1 menit lalu",

  milestones: [
    {
      id: "created",
      label: "Pesanan Dibuat",
      time: "26 Sep 2024, 09:15",
      place: "Hub Semarang / Pengirim",
      icon: "check",
      state: "done",
    },
    {
      id: "courier",
      label: "Diproses Kurir",
      time: "26 Sep 2024, 14:30 WIB",
      place: "Staging DC Semarang",
      icon: "check",
      state: "done",
    },
    {
      id: "transit",
      label: "Dalam Perjalanan",
      time: "27 Sep 2024, 04:15 WIB",
      place: "Transit Hub Cirebon",
      icon: "check",
      state: "done",
    },
    {
      id: "delivering",
      label: "Dalam Pengantaran",
      time: "28 Sep 2024, 13:45 WIB",
      place: "Menuju Lokasi Penerima",
      icon: "local_shipping",
      state: "done",
    },
    {
      id: "arrived",
      label: "Tiba di Tujuan",
      time: "28 Sep 2024, 14:20 WIB",
      place: "Jl. Tebet Barat Dalam No. 42",
      icon: "home",
      state: "done",
    },
  ],

  journey: {
    progressLabel: "5 dari 5 Pos Selesai",
    notes: [
      {
        id: "note-delivered",
        title: "[DELIVERED] Paket berhasil diserahkan langsung ke penerima",
        description:
          "Bukti serah terima (POD) telah diverifikasi dan diterima secara valid oleh penerima pada alamat tujuan.",
        time: "28/09 14:20",
        state: "done",
      },
      {
        id: "note-ofd",
        title:
          "[OUT FOR DELIVERY] Paket sedang dibawa oleh Satria (Agus Prasetyo) menuju alamat penerima",
        description: "Petugas kurir Satria Tebet Barat sedang dalam rute pengantaran akhir.",
        time: "28/09 13:45",
        state: "done",
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
        id: "note-in-transit",
        title: "[IN TRANSIT] Paket tiba di Fasilitas Transit Hub Cirebon Barat",
        description:
          "Pemeriksaan armada & konsolidasi kargo jalur Pantura/Cipali menuju Sorting Gateway Jakarta.",
        time: "27/09 04:15",
        state: "done",
      },
      {
        id: "note-created",
        title: "[ORDER CREATED] Informasi Pesanan Telah Diterima",
        description:
          "Permintaan penjemputan paket telah dijadwalkan oleh sistem Anteraja.",
        time: "26/09 09:15",
        state: "done",
      },
    ],
  },

  radar: {
    variant: "delivered",
    icon: "home",
    statusLabel: "Alamat Tujuan Sudah Diterima",
    liveBadgeLabel: "Bukti Serah Terima Terverifikasi",
    pin: {
      title: "Jl. Tebet Barat Dalam No. 42",
      subtitle: "Penerima: Budi Santoso",
    },
    zone: "Zona Tebet, Jakarta Selatan",
    coordinates: "LAT: -6.2382, LON: 106.8530",
    footerLabel: "Radar Posisi Paket",
    location: "Jl. Tebet Barat Dalam No. 42, Tebet, Jakarta Selatan, Indonesia",
  },

  courier: {
    active: true,
    idLabel: "Terverifikasi",
    title: "Satria Bertugas",
    name: "Satria Agus Prasetyo",
    avatar: "/profil-satria.svg",
    rating: "4.8",
    totalKiriman: "1.2K kiriman",
    armada: "Motor Anteraja",
    armadaId: "SAT-214",
    phone: "tel:+6281119603333",
    whatsapp: "https://wa.me/6281119603333?text=Halo%20Satria%20Agus,%20saya%20Budi%20penerima%20paket%201000284719282847192837461922",
    activeNote: "Paket Sudah Diterima",
    standbyNote: "Kurir standby di area delivery",
  },
};
