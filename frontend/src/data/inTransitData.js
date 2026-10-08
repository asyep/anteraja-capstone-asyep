/**
 * Data contoh untuk halaman status "Dalam Perjalanan".
 *
 * Kondisi ketika paket sedang menempuh perjalanan jarak jauh — dari drop
 * point/hub asal menuju hub sortir akhir — belum masuk tahap pengantaran
 * ke alamat penerima.
 *
 * Catatan: pada halaman ini "Radar Posisi Paket" bergerak otomatis mengikuti
 * waypoint rute (lihat features/tracking/data/transitRoutes.js).
 */
export const IN_TRANSIT_DATA = {
  waybill: "10002847192847192837461928374620",
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

  /**
   * Banner status. Varian "transit" memakai gradien magenta cerah dengan
   * judul lebih kecil (18-20px) dan tiga badge termasuk estimasi tiba.
   */
  status: {
    code: "DALAM PERJALANAN",
    label: "Paket Sedang Transit di Cirebon Barat",
    icon: "local_shipping",
    variant: "transit",
    badges: [
      {
        id: "gratis-ongkir",
        label: "Gratis Ongkir",
        icon: "local_shipping",
        className: "bg-white text-primary",
      },
      {
        id: "dalam-perjalanan",
        label: "Dalam Perjalanan",
        dot: "bg-primary",
        className: "bg-secondary-container text-on-secondary-container",
      },
      {
        id: "estimasi-tiba",
        label: "Est. Tiba 27 Sep 16:00",
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
    courierName: "Transit Hub Linehaul Cirebon",
    courierId: "",
    avatar: "/profil-assistant.svg",
    message:
      "Halo Kak! Paketmu saat ini sedang dalam perjalanan logistik antarkota dari Staging DC Semarang menuju Jakarta. Saat ini armada Linehaul kami sedang transit sejenak di Transit Hub Cirebon untuk proses konsolidasi muatan kargo sebelum melanjutkan perjalanan ke Sorting Gateway Jakarta. Paketmu aman dan terpantau 24/7!",
    whatsapp:
      "https://wa.me/6281119603333?text=Halo%20Satria%20AI,%20saya%20penerima%20paket%20100028471928",
    protocol: "Protokol Satria Sigap & Aman",
    aiBadge: true,
  },

  updatedLabel: "Updated 1 menit lalu",

  /** 5 tahap; tiga tahap pertama selesai, tahap ke-3 sedang berjalan. */
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
      time: "27 Sep, 04:15 WIB",
      place: "Transit Hub Cirebon",
      placeClass: "text-primary font-semibold",
      icon: "local_shipping",
      state: "done",
      pulse: true,
    },
    {
      id: "delivering",
      label: "Dalam Pengantaran",
      time: "Belum Tersedia",
      place: "Alamat Penerima",
      icon: "electric_moped",
      state: "pending",
    },
    {
      id: "arrived",
      label: "Tiba di Tujuan",
      time: "Est. 27 Sep 16:00",
      place: "Tebet, Jakarta Selatan",
      icon: "home",
      state: "pending",
    },
  ],

  /** Catatan perjalanan: 6 pos, posisi terkini ditandai state "progress". */
  journey: {
    progressLabel: "3 dari 5 Pos Selesai",
    notes: [
      {
        id: "note-in-transit",
        title:
          "[IN TRANSIT] Paket Tiba di Fasilitas Transit Hub Cirebon Barat",
        description:
          "Pemeriksaan armada & konsolidasi kargo jalur Pantura/Cipali menuju Sorting Gateway Jakarta.",
        time: "27/09 04:15",
        state: "progress",
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
        title: "[PROCESSED] Paket Telah Tiba di Hub Sortir (Staging DC Semarang)",
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
   * Radar posisi: varian "transit" — penanda armada bergerak mengikuti
   * waypoint pada rute "semarang-jakarta".
   */
  radar: {
    variant: "transit",
    icon: "local_shipping",
    routeId: "semarang-jakarta",
    // Mulai dari titik Cirebon (indeks 3) sesuai kondisi pada desain.
    startIndex: 3,
    intervalMs: 4000,
    pillLabel: "Titik Transit Hub Cirebon",
    liveBadgeLabel: "Live GPS Armada Truk Aktif",
    zoneLabel: "Koridor Transit Jawa Barat 02",
    footerLabel: "Radar Posisi Paket",
    footerDoneLabel: "Armada Tiba di Hub Tujuan",
  },

  /** Kartu kurir pengantaran akhir — belum tersedia. */
  courier: {
    idLabel: "Satria Belum Tersedia",
    title: "Kurir Pengantaran Belum Tersedia",
    description:
      "Satria untuk pengantaran akhir akan ditugaskan otomatis ketika paket tiba di Delivery Hub kota tujuan Anda.",
    standbyNote: "Penugasan kurir standby di Delivery Hub Jakarta",
  },
};
