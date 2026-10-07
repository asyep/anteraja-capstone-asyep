/**
 * Data contoh untuk halaman status "Pesanan Dibuat" (paket belum dijemput).
 *
 * Catatan: masih data statis mengikuti prototype. Saat backend endpoint
 * sudah mengembalikan status ini, tinggal ganti sumber datanya tanpa
 * mengubah komponen tampilan.
 */
export const ORDER_CREATED_DATA = {
  waybill: "10002847192847192837461928374619",
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

  /** Banner status utama di atas halaman. */
  status: {
    code: "PESANAN DIBUAT",
    label: "Menunggu Penjemputan Paket oleh Satria",
    icon: "inventory_2",
    badges: [
      {
        id: "gratis-ongkir",
        label: "Gratis Ongkir",
        icon: "local_shipping",
        className: "bg-white text-tertiary",
      },
      {
        id: "menunggu-pickup",
        label: "Menunggu Pickup",
        className: "bg-secondary-container text-on-secondary-container",
      },
    ],
  },

  /** Narasi dari Satria Assistant. */
  assistant: {
    name: "Satria Assistant",
    courierName: "Satria Agus Prasetyo",
    courierId: "STR-8821",
    avatar: "/profil-assistant.svg",
    message:
      "Halo Kak! Pesanan kamu baru saja dibuat oleh pengirim (Toko Sentral Komputer Semarang). Saat ini kami sedang mengalokasikan Satria untuk segera menjemput paket ke lokasi pengirim. Pantau terus update terbarunya di sini ya!",
    whatsapp:
      "https://wa.me/6281119603333?text=Halo%20Satria%20Agus,%20saya%20penerima%20paket%20100028471928",
    protocol: "Protokol Satria Sigap & Aman",
  },

  updatedLabel: "Updated 2 menit lalu",

  /** 5 tahap progres pengiriman; hanya tahap pertama yang selesai. */
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
      time: "Menunggu Jadwal",
      place: "Gateway Transit",
      icon: "local_shipping",
      state: "pending",
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

  /** Catatan perjalanan detail. */
  journey: {
    progressLabel: "1 dari 5 Pos Selesai",
    notes: [
      {
        id: "note-1",
        title: "Informasi Pesanan Telah Diterima",
        description:
          "Informasi pesanan telah diterima oleh sistem Anteraja. Menunggu penyerahan paket dari pihak pengirim.",
        time: "26/09 09:15",
        state: "active",
      },
      {
        id: "note-2",
        title: "Permintaan Pickup Dijadwalkan",
        description:
          "Permintaan penjemputan paket telah dijadwalkan oleh Toko Sentral Komputer Semarang ke Satria Anteraja.",
        time: "26/09 08:30",
        state: "idle",
      },
    ],
  },

  /** Kartu radar posisi paket. */
  radar: {
    statusLabel: "Menunggu Penjemputan",
    title: "Satria Belum Berjalan",
    description:
      "Pelacakan GPS aktif otomatis saat paket telah dijemput dan dibawa oleh Satria.",
    footerLeft: "Status Kurir: Standby Alokasi",
    footerRight: "Peta Standby",
  },

  /** Kartu kurir pengantaran akhir. */
  courier: {
    idLabel: "ID: Menunggu Penugasan",
    title: "Kurir Pengantaran Belum Dialokasikan",
    description:
      "Satria untuk pengantaran akhir akan ditugaskan otomatis ketika paket tiba di Delivery Hub kota tujuan Anda.",
    standbyNote: "Penugasan kurir standby di Delivery Hub Jakarta",
  },
};
