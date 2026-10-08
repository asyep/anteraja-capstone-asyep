export const BRAND_COLORS = {
  magenta: "#EC008C",
  success: "#10B981",
  warning: "#F59E0B",
};

// Nomor resi Anteraja: 14 digit angka (sama dengan validasi backend).
export const WAYBILL_PATTERN = /^\d{14}$/;

export const MILESTONE_STAGES = [
  { code: "ORDER_CREATED", label: "Pesanan Dibuat" },
  { code: "PICKUP_READY", label: "Diproses Kurir" },
  { code: "IN_TRANSIT", label: "Dalam Perjalanan" },
  { code: "OUT_FOR_DELIVERY", label: "Dalam Pengantaran" },
  { code: "DELIVERED", label: "Tiba di Tujuan" },
];

export const SHIPPING_SERVICES = {
  reguler: { label: "Reguler", rate: 10000, days: 3 },
  nextday: { label: "NextDay", rate: 15000, days: 1 },
  sameday: { label: "SameDay", rate: 25000, days: 0 },
};