/**
 * Konstanta halaman status pelacakan.
 * Dipakai bersama oleh OrderCreatedView dan view status lainnya.
 */

/** Contoh resi demo untuk status "Pesanan Dibuat" (32 karakter). */
export const ORDER_CREATED_DEMO_RESI = "10002847192847192837461928374619";

/** Contoh resi demo untuk status transit (chip pencarian terakhir). */
export const IN_TRANSIT_DEMO_RESI = "10003920194827103948572910394857";

/** Riwayat pencarian contoh di bawah kolom resi. */
export const RECENT_SEARCHES = [
  {
    resi: ORDER_CREATED_DEMO_RESI,
    label: "100028471928...",
    dotClass: "bg-success-base",
  },
  {
    resi: IN_TRANSIT_DEMO_RESI,
    label: "100039201948...",
    dotClass: "bg-secondary-fixed-dim",
  },
];
