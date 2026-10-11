/**
 * =============================================================================
 * formatters.js - Utilitas Pemformatan Data, Waktu (WIB), dan Mata Uang
 * =============================================================================
 * Berfungsi untuk menstandarkan format tampilan data di antarmuka pengguna:
 * 1. `isValidWaybill(value)`: Validasi format nomor resi.
 * 2. `formatWibTimestamp(value)`: Tanggal + Jam dalam zona Waktu Indonesia Barat (WIB).
 * 3. `formatWibTime(value)`: Jam:Menit dalam zona WIB.
 * 4. `formatIndonesianDate(value)`: Tanggal panjang bahasa Indonesia (contoh: 11 Oktober 2026).
 * 5. `formatRupiah(value)`: Angka ke format mata uang Rupiah (IDR).
 */

import { WAYBILL_PATTERN } from "@/lib/constants";

const WIB_OPTIONS = {
  timeZone: "Asia/Jakarta",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
};

/**
 * Memvalidasi apakah string merupakan nomor resi Anteraja yang valid.
 * @param {string} value - Nomor resi.
 * @returns {boolean}
 */
export function isValidWaybill(value) {
  return WAYBILL_PATTERN.test(String(value ?? "").trim());
}

/**
 * Mengubah ISO string menjadi format tanggal & jam WIB.
 * @param {string|Date} value
 * @returns {string} Contoh: "11 Okt 2026 14:30 WIB"
 */
export function formatWibTimestamp(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${new Intl.DateTimeFormat("id-ID", WIB_OPTIONS).format(date)} WIB`;
}

/**
 * Mengubah ISO string menjadi jam & menit WIB (HH:mm).
 * @param {string|Date} value
 * @returns {string} Contoh: "14:30"
 */
export function formatWibTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

/**
 * Mengubah tanggal ke format teks lengkap bahasa Indonesia.
 * @param {string|Date} value
 * @returns {string} Contoh: "11 Oktober 2026"
 */
export function formatIndonesianDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Mengubah angka menjadi format mata uang Rupiah.
 * @param {number|string} value
 * @returns {string} Contoh: "Rp 15.000"
 */
export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}