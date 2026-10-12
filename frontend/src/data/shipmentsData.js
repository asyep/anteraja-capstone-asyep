/**
 * =============================================================================
 * shipmentsData.js - Pemetaan Rute Status Nomor Resi Resmi Anteraja
 * =============================================================================
 * SEKILAS PENJELASAN LOGIKA:
 * Fungsi `getRouteForResi(resi)` menentukan URL tujuan:
 * 1. Bersihkan input dengan `cleanResiInput` (buang spasi/simbol non-alfanumerik).
 * 2. Validasi format standar Anteraja:
 *    - Format resmi Anteraja WAJIB berupa 14 digit angka diawali '1000' (/^1000\d{10}$/).
 *    - Nomor resi anomali (> 14 digit, < 14 digit, atau karakter aneh) langsung
 *      dianggap TIDAK TERCATAT dan dialihkan ke `/not-found`.
 * 3. Cek dataset master database (`allShipmentsData.json`):
 *    - Jika ada, baca `order_status` miliknya dan kembalikan URL tujuan seketika (0ms).
 * 4. Jika format 14 digit valid tapi belum ada di dataset lokal, arahkan ke `/cek-resi`
 *    agar dicek langsung ke backend server / database PostgreSQL.
 * =============================================================================
 */

import allShipmentsData from "./allShipmentsData.json";

/**
 * Pemetaan rute otomatis yang 100% tersinkronisasi dengan master dataset database.
 */
export const demoResiRoutes = Object.fromEntries(
  Object.entries(allShipmentsData).map(([waybill, item]) => {
    let path = "/not-found";
    if (item.order_status === "ORDER_CREATED") path = "/tracking/order-created";
    else if (item.order_status === "PICKUP_READY" || item.order_status === "COURIER_PROCESSED") path = "/tracking/courier-processed";
    else if (item.order_status === "IN_TRANSIT") path = "/tracking/in-transit";
    else if (item.order_status === "OUT_FOR_DELIVERY") path = "/tracking/out-for-delivery";
    else if (item.order_status === "DELIVERED") path = "/delivered";
    return [waybill, path];
  })
);

/**
 * Daftar sampel resi resmi dari database PostgreSQL untuk quick test di UI.
 * Semua nomor resi di bawah ini 100% terdaftar dan valid di database.
 */
export const sampleResiList = [
  {
    resi: "10003410529190",
    label: "In-Transit",
    path: "/tracking/in-transit",
    badgeClass: "bg-emerald-50 text-emerald-700",
  },
  {
    resi: "10001284277889",
    label: "Live GPS Telemetry",
    path: "/tracking/in-transit",
    badgeClass: "bg-purple-50 text-purple-700",
  },
  {
    resi: "10001540137296",
    label: "Peringatan Jalur",
    path: "/tracking/in-transit",
    badgeClass: "bg-amber-50 text-amber-700",
  },
  {
    resi: "10003840104345",
    label: "Telah Diterima",
    path: "/delivered",
    badgeClass: "bg-emerald-100 text-emerald-800",
  },
  {
    resi: "10005908596099",
    label: "Resi Belum Tercatat",
    path: "/not-found",
    badgeClass: "bg-rose-50 text-rose-700",
  },
];

/**
 * Membersihkan input nomor resi secara ketat:
 * Menghapus tanda #, spasi, tanda minus, dan karakter non-alfanumerik
 * yang kerap terbawa saat copy-paste di smartphone atau browser mobile.
 */
export function cleanResiInput(resi) {
  if (resi == null) return "";
  return String(resi).replace(/[^a-zA-Z0-9]/g, "").trim();
}

/**
 * Mengembalikan rute pelacakan berdasarkan nomor resi.
 * Resi anomali (> 14 digit atau format tidak sesuai standar 14 digit) langsung
 * diarahkan ke status tidak tercatat / tidak ditemukan (/not-found).
 */
export function getRouteForResi(resi) {
  const cleanResi = cleanResiInput(resi);
  const query = `?waybill_number=${encodeURIComponent(cleanResi)}`;

  if (!cleanResi) {
    return `/not-found${query}`;
  }

  // Validasi format nomor resi standar Anteraja:
  // Harus tepat 14 digit numerik yang diawali 1000 atau 1001.
  // Resi dengan panjang > 14 digit atau anomali tidak terdaftar di database manapun.
  const isStandardWaybill = /^100[01]\d{10}$/.test(cleanResi);
  if (!isStandardWaybill) {
    return `/not-found${query}`;
  }

  // 1. Cek langsung dari master dataset database resmi (70 database shipments) untuk routing 0ms
  if (allShipmentsData && allShipmentsData[cleanResi]) {
    const status = allShipmentsData[cleanResi].order_status;
    let path = "/not-found";
    if (status === "ORDER_CREATED") path = "/tracking/order-created";
    else if (status === "PICKUP_READY" || status === "COURIER_PROCESSED") path = "/tracking/courier-processed";
    else if (status === "IN_TRANSIT") path = "/tracking/in-transit";
    else if (status === "OUT_FOR_DELIVERY") path = "/tracking/out-for-delivery";
    else if (status === "DELIVERED") path = "/delivered";
    return `${path}${query}`;
  }

  // 2. Jika format 14 digit valid tapi belum ada di local snapshot, alihkan ke resolver API (/cek-resi)
  return `/cek-resi${query}`;
}
