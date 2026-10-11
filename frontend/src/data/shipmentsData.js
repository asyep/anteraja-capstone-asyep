import allShipmentsData from "./allShipmentsData.json";

export const demoResiRoutes = {
  // Status "Pesanan Dibuat" (ORDER_CREATED)
  "10001338258951": "/tracking/order-created",
  "10001240251661": "/tracking/order-created",
  "10007017956955": "/tracking/order-created",
  "10002631775357": "/tracking/order-created",
  "10004504793184": "/tracking/order-created",
  "10007900268326": "/tracking/order-created",
  "10008877444318": "/tracking/order-created",
  "10002028439863": "/tracking/order-created",
  "10006555540744": "/tracking/order-created",
  "10001438989805": "/tracking/order-created",
  "10007439149233": "/tracking/order-created",
  "10006004182187": "/tracking/order-created",
  "10001599707677": "/tracking/order-created",
  "10008055995058": "/tracking/order-created",
  "10005047709743": "/tracking/order-created",
  "10002847192847192837461928374619": "/tracking/order-created",

  // Status "Sedang Diproses Kurir" (PICKUP_READY / COURIER_PROCESSED)
  "10003727210979": "/tracking/courier-processed",
  "10004944899549": "/tracking/courier-processed",
  "10002461042543": "/tracking/courier-processed",
  "10004529615275": "/tracking/courier-processed",
  "10004698408854": "/tracking/courier-processed",
  "10003920194827103948572910394857": "/tracking/courier-processed",

  // Status "Dalam Perjalanan" (IN_TRANSIT)
  "10001284277889": "/tracking/in-transit",
  "10003410529190": "/tracking/in-transit",
  "10008357059814": "/tracking/in-transit",
  "10003585650756": "/tracking/in-transit",
  "10009896606039": "/tracking/in-transit",
  "10004721519026": "/tracking/in-transit",
  "10001540137296": "/tracking/in-transit",
  "10006927597015": "/tracking/in-transit",
  "10004733616459": "/tracking/in-transit",
  "10002051454923": "/tracking/in-transit",
  "10005141907136": "/tracking/in-transit",
  "10005974249674": "/tracking/in-transit",
  "10008615270538": "/tracking/in-transit",
  "10001854316681": "/tracking/in-transit",
  "10008752612686": "/tracking/in-transit",
  "10005993561321": "/tracking/in-transit",
  "10007867414708": "/tracking/in-transit",
  "10008385972235": "/tracking/in-transit",
  "10002847192847192837461928374620": "/tracking/in-transit",
  "1000849201994": "/tracking/in-transit",
  "10008492019948271039485729103948": "/tracking/in-transit",
  "00010242fe8c5a6d1ba2dd792cb16214": "/tracking/in-transit",
  "1000921477821": "/tracking/in-transit",
  "1000781293812": "/tracking/in-transit",
  "0008288aa423d2a3f00fcb17cd7d8719": "/tracking/in-transit",

  // Status "Dalam Pengantaran" (OUT_FOR_DELIVERY)
  "10006947530309": "/tracking/out-for-delivery",
  "10009776552803": "/tracking/out-for-delivery",
  "10001298737106": "/tracking/out-for-delivery",
  "10007609857128": "/tracking/out-for-delivery",
  "10008519962896": "/tracking/out-for-delivery",
  "10009928378856": "/tracking/out-for-delivery",
  "10009256195745": "/tracking/out-for-delivery",
  "10002801823908": "/tracking/out-for-delivery",
  "10008760038701": "/tracking/out-for-delivery",
  "10005231494220": "/tracking/out-for-delivery",
  "10002847192847192837461928374621": "/tracking/out-for-delivery",

  // Status "Tiba di Tujuan" (DELIVERED)
  "10003840104345": "/delivered",
  "10004246059658": "/delivered",
  "10003561557300": "/delivered",
  "10002193448329": "/delivered",
  "10004272602734": "/delivered",
  "10007280359794": "/delivered",
  "10003962958940": "/delivered",
  "10002525876051": "/delivered",
  "10008378385615": "/delivered",
  "10008128575500": "/delivered",
  "10008173347748": "/delivered",
  "10007980611182": "/delivered",
  "10007801222128": "/delivered",
  "10003119634399": "/delivered",
  "10004673561638": "/delivered",
  "10007110082321": "/delivered",
  "10003098545541": "/delivered",
  "10002554762903": "/delivered",
  "10008574149614": "/delivered",
  "10008217611860": "/delivered",
  "11111111111111111111111111111111": "/delivered",
  "10002847192847192837461928374622": "/delivered",
  "11111111111111": "/delivered",

  // Status "Tidak Ditemukan" / Dibatalkan
  "10005908596099": "/not-found",
  "10008438486479": "/not-found",
  "22222222222222222222222222222222": "/not-found",
  "22222222222222": "/not-found",
  "1000998877665544332211": "/not-found",
};

export const sampleResiList = [
  {
    resi: "1000849201994",
    label: "In-Transit",
    path: "/tracking/in-transit",
    badgeClass: "bg-emerald-50 text-emerald-700",
  },
  {
    resi: "1000921477821",
    label: "Live GPS Telemetry",
    path: "/tracking/in-transit",
    badgeClass: "bg-purple-50 text-purple-700",
  },
  {
    resi: "1000781293812",
    label: "Peringatan Jalur",
    path: "/tracking/in-transit",
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

export function getRouteForResi(resi) {
  const cleanResi = cleanResiInput(resi);
  const query = `?waybill_number=${encodeURIComponent(cleanResi)}`;

  if (!cleanResi) {
    return `/not-found${query}`;
  }

  // 1. Cek langsung dari dataset database lengkap (70+ database shipments + demo resis) untuk routing 0ms
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

  // 2. Cek kamus rute demo
  if (demoResiRoutes[cleanResi]) {
    return `${demoResiRoutes[cleanResi]}${query}`;
  }

  // 3. Nomor 13–14 digit atau AWB 32 karakter yang belum ada di local snapshot dialihkan ke resolver API
  if (/^(?:\d{13,14}|[A-Za-z0-9]{32})$/.test(cleanResi)) {
    return `/cek-resi${query}`;
  }

  return `/not-found${query}`;
}
