/**
 * Data contoh untuk halaman status "Sedang Diproses Kurir".
 *
 * Kondisi ketika paket sudah dijemput Satria Pickup dan tiba di Hub
 * Distribusi (Staging DC) kota asal — belum masuk tahap perjalanan ke
 * kota tujuan.
 *
 * Masih data statis mengikuti prototype; tinggal diganti sumbernya saat
 * backend sudah mengembalikan status ini.
 */
export const COURIER_PROCESSED_DATA = {
  waybill: "10003920194827103948572910394857",
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

  /** Banner status utama: gradien magenta pekat + ring magenta muda. */
  status: {
    code: "SEDANG DIPROSES KURIR",
    label: "Paket Telah Diterima & Sedang Diproses di Staging DC",
    icon: "warehouse",
    variant: "primary-solid",
    badges: [
      {
        id: "gratis-ongkir",
        label: "Gratis Ongkir",
        icon: "local_shipping",
        className: "bg-white text-tertiary border border-border-subtle/50",
      },
      {
        id: "diproses-hub",
        label: "Diproses di Hub/DC",
        dot: "bg-primary",
        className:
          "bg-secondary-container text-on-secondary-container border border-secondary-fixed",
      },
    ],
  },

  /** Narasi Satria Assistant — sumbernya sama dengan halaman lain. */
  assistant: {
    name: "Satria Assistant",
    courierName: "Staging DC Hub Semarang",
    courierId: "",
    avatar: "/profil-assistant.svg",
    message:
      "Halo Kak! Paket kamu sudah berhasil dijemput dan saat ini telah tiba di Hub Distribusi (Staging DC Semarang). Tim sortir kami sedang menyiapkan dan memverifikasi paket untuk diteruskan ke tahap perjalanan logistik utama. Pantau terus pergerakan paketmu ya!",
    whatsapp:
      "https://wa.me/6281119603333?text=Halo%20Satria%20AI,%20saya%20penerima%20paket%20100028471928",
    protocol: "Protokol Satria Sigap & Aman",
    aiBadge: true,
  },

  updatedLabel: "Updated 1 menit lalu",

  /** 5 tahap; dua tahap pertama sudah selesai. */
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
      place: "Staging Hub Semarang",
      icon: "check",
      state: "done",
    },
    {
      id: "transit",
      label: "Dalam Perjalanan",
      time: "Belum Dikirim",
      place: "Hub Tujuan",
      icon: "sync_alt",
      state: "pending",
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
      time: "Estimasi Menyesuaikan",
      place: "Tebet, Jakarta Selatan",
      icon: "home",
      state: "pending",
    },
  ],

  /** Catatan perjalanan: 3 pos, 2 di antaranya sudah selesai. */
  journey: {
    progressLabel: "2 dari 5 Pos Selesai",
    notes: [
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
        state: "active",
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

  /** Kartu radar posisi paket (varian "staging": peta kawasan + live GPS). */
  radar: {
    variant: "staging",
    icon: "warehouse",
    statusLabel: "Titik Lokasi Staging DC",
    liveBadge: true,
    pin: {
      title: "Staging Gateway Semarang Hub",
      subtitle: "DC Anteraja • Jl. Kaligawe KM 5",
    },
    zone: "Zona Distribusi Regional Jawa Tengah 01",
    coordinates: "LAT: -6.9582, LON: 110.4503",
    footerLabel: "Radar Posisi Paket",
    location: "Staging Distribution Center Semarang, Jawa Tengah, Indonesia",
  },

  /** Kartu kurir pengantaran akhir — belum dialokasikan. */
  courier: {
    idLabel: "ID: Menunggu Penugasan",
    title: "Kurir Pengantaran Belum Dialokasikan",
    description:
      "Satria untuk pengantaran akhir akan ditugaskan otomatis ketika paket tiba di Delivery Hub kota tujuan Anda.",
    standbyNote: "Penugasan kurir standby di Delivery Hub Jakarta",
  },
};
