/**
 * Konten statis halaman Lacak Kiriman.
 * Dipisah dari komponen supaya copywriting bisa diubah tanpa menyentuh JSX.
 */

export const TRACKING_FEATURES = [
  {
    id: "radar",
    icon: "explore",
    iconClassName: "bg-warning-surface text-secondary",
    title: "Radar Telemetri Satria Live GPS",
    description:
      "Pantau koordinat riil kurir Satria saat pengantaran menuju alamat tujuan dengan estimasi sisa jarak presisi per 100 meter.",
    cta: "Presisi GPS Armada",
    ctaClassName: "text-primary",
  },
  {
    id: "assistant",
    icon: "smart_toy",
    iconClassName: "bg-ai-surface text-ai-accent",
    title: "Satria AI Assistant & Updates",
    description:
      "Status manifest teknis seperti 'Sortation Hub Transit' diterjemahkan ke bahasa yang ramah, santun, dan mudah dicerna secara manusiawi.",
    cta: "Natural Language Status",
    ctaClassName: "text-ai-accent",
  },
  {
    id: "eta",
    icon: "schedule",
    iconClassName: "bg-primary-fixed text-primary",
    title: "Estimasi Kedatangan Dinamis (ETA)",
    description:
      "Didukung prediksi kecerdasan buatan dengan akurasi 98.4% yang terus beradaptasi terhadap kepadatan lalu lintas dan cuaca terkini.",
    cta: "Algoritma Cuaca & Rute",
    ctaClassName: "text-primary",
  },
  {
    id: "whatsapp",
    icon: "chat",
    iconClassName: "bg-success-surface text-tertiary",
    title: "Notifikasi Otomatis WhatsApp",
    description:
      "Dapatkan pembaruan langsung di ponsel Anda begitu paket tiba di titik transit terdekat atau saat kurir bergerak menuju pintu rumah.",
    cta: "Siaga 24 Jam Bebas Pulsa",
    ctaClassName: "text-tertiary",
  },
];

export const TRACKING_STEPS = [
  {
    id: "step-1",
    number: "01",
    numberClassName: "text-primary/20",
    icon: "pin",
    iconClassName: "bg-primary-fixed text-primary",
    title: "Masukkan Nomor Resi",
    description:
      "Salin nomor resi (AWB) dari aplikasi e-commerce Anda, resi fisik, atau SMS notifikasi pengiriman pesanan.",
  },
  {
    id: "step-2",
    number: "02",
    numberClassName: "text-secondary/20",
    icon: "cognition",
    iconClassName: "bg-warning-surface text-secondary",
    title: "Analisis Telemetri Satria AI",
    description:
      "Sistem secara instan menganalisis manifest gudang, memvalidasi rute aktif, dan mengunci posisi mutakhir paket.",
  },
  {
    id: "step-3",
    number: "03",
    numberClassName: "text-tertiary/20",
    icon: "person_pin_circle",
    iconClassName: "bg-success-surface text-tertiary",
    title: "Pantau Rute & Hubungi Kurir",
    description:
      "Lihat jam tiba dinamis dan lakukan panggilan langsung atau WhatsApp dengan Satria saat paket berstatus 'Out for Delivery'.",
  },
];

export const TRACKING_FAQ = [
  {
    id: "faq-manifest",
    question: "Resi belum terupdate atau masih 'Manifest Created' dalam 24 jam?",
    answer:
      "Hal ini umum terjadi jika paket baru diserahkan oleh penjual/merchant dan sedang dalam antrean pemindaian di Hub Pertama Anteraja. Status akan otomatis aktif begitu paket melewati pemindai conveyor kami.",
  },
  {
    id: "faq-late-courier",
    question: "Bagaimana jika kurir belum tiba melewati jam estimasi kedatangan?",
    answer:
      "Satria kami mungkin menghadapi kendala cuaca ekstrem atau lonjakan rute. Anda dapat mengklik tombol \"Hubungi Satria\" yang muncul pada rincian resi untuk menanyakan perkiraan tiba langsung ke nomor kurir aktif.",
  },
  {
    id: "faq-change-address",
    question: "Apakah bisa mengubah alamat pengantaran saat paket sudah jalan?",
    answer:
      "Perubahan alamat dapat diajukan selama paket belum berstatus 'Satria Mengantar'. Silakan hubungi CS Satria WhatsApp kami dengan melampirkan foto KTP dan bukti transaksi resmi.",
  },
];

export const LACAK_CONTACT = {
  whatsapp: "https://wa.me/6281119603333",
  hotline: "tel:02150663333",
  hotlineLabel: "021 - 5066 - 3333",
  email: "cs@anteraja.id",
  x: "https://x.com/AnterajaCare",
  xHandle: "@AnterajaCare",
};
