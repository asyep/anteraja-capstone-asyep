/**
 * =============================================================================
 * constants.js - Konstanta Desain Sistem & Konfigurasi Layanan Anteraja
 * =============================================================================
 * Menyediakan nilai tetap standar yang digunakan di seluruh aplikasi:
 * 1. `BRAND_COLORS`: Palet warna identitas brand Anteraja (Magenta, Sukses, Warning).
 * 2. `WAYBILL_PATTERN`: Regex validasi nomor resi format 32 karakter alfanumerik.
 * 3. `MILESTONE_STAGES`: Kode dan label urutan 5 milestone pengiriman.
 * 4. `SHIPPING_SERVICES`: Tarif dasar dan estimasi SLA durasi pengiriman.
 */

export const BRAND_COLORS = {
  magenta: "#EC008C",
  success: "#10B981",
  warning: "#F59E0B",
};

export const WAYBILL_PATTERN = /^[A-Za-z0-9]{32}$/;

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