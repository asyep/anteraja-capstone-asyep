export const demoResiRoutes = {
  // Status "Pesanan Dibuat" — paket belum dijemput Satria.
  "10002847192847192837461928374619": "/tracking/order-created",
  // Status "Sedang Diproses Kurir" — paket ada di Staging DC kota asal.
  "10003920194827103948572910394857": "/tracking/courier-processed",
  // Status "Dalam Perjalanan" — paket transit antarkota (radar bergerak).
  "10002847192847192837461928374620": "/tracking/in-transit",
  // Status "Dalam Pengantaran" — kurir menuju alamat penerima (radar bergerak).
  "10002847192847192837461928374621": "/tracking/out-for-delivery",
  1000849201994: "/tracking-normal",
  "10008492019948271039485729103948": "/tracking-normal",
  "00010242fe8c5a6d1ba2dd792cb16214": "/tracking-normal",
  1000921477821: "/tracking-live",
  1000781293812: "/tracking",
  "0008288aa423d2a3f00fcb17cd7d8719": "/tracking",
  "11111111111111111111111111111111": "/delivered",
  "10002847192847192837461928374622": "/delivered",
  11111111111111: "/delivered",
  "22222222222222222222222222222222": "/canceled",
  22222222222222: "/canceled",
};

export const sampleResiList = [
  {
    resi: "1000849201994",
    label: "In-Transit",
    path: "/tracking-normal",
    badgeClass: "bg-emerald-50 text-emerald-700",
  },
  {
    resi: "1000921477821",
    label: "Live GPS Telemetry",
    path: "/tracking-live",
    badgeClass: "bg-purple-50 text-purple-700",
  },
  {
    resi: "1000781293812",
    label: "Peringatan Jalur",
    path: "/tracking",
    badgeClass: "bg-amber-50 text-amber-700",
  },
  {
    resi: "11111111111111",
    label: "Telah Diterima",
    path: "/delivered",
    badgeClass: "bg-emerald-100 text-emerald-800",
  },
  {
    resi: "22222222222222",
    label: "Dibatalkan",
    path: "/canceled",
    badgeClass: "bg-rose-50 text-rose-700",
  },
];

export function getRouteForResi(resi) {
  const cleanResi = String(resi ?? "").trim();
  const query = `?waybill_number=${encodeURIComponent(cleanResi)}`;

  if (!cleanResi) {
    return `/validation-error${query}`;
  }

  if (demoResiRoutes[cleanResi]) {
    return `${demoResiRoutes[cleanResi]}${query}`;
  }

  // Nomor 13–14 digit dan AWB alfanumerik 32 karakter adalah format yang diterima.
  // Resi valid tanpa fixture status khusus akan masuk ke halaman cek-resi (API Resolver).
  if (/^(?:\d{13,14}|[A-Za-z0-9]{32})$/.test(cleanResi)) {
    return `/cek-resi${query}`;
  }

  return `/validation-error${query}`;
}
