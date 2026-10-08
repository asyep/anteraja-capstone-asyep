import { WAYBILL_PATTERN } from "../utils/constants";

/**
 * Pemetaan skenario (dihitung backend pada field `scenario`) ke halaman frontend.
 * normal    → tracking standar
 * live      → peta GPS live telemetry
 * warning   → peringatan jalur / keterlambatan
 * delivered → paket telah diterima
 */
export const SCENARIO_ROUTES = {
  normal: "/tracking-normal",
  live: "/tracking-live",
  warning: "/tracking",
  delivered: "/delivered",
};

export const SCENARIO_META = {
  normal: {
    label: "Dalam Proses",
    dotClass: "bg-success-base",
    badgeClass: "bg-emerald-50 text-emerald-700",
  },
  live: {
    label: "Live GPS Telemetry",
    dotClass: "bg-success-base",
    badgeClass: "bg-purple-50 text-purple-700",
  },
  warning: {
    label: "Peringatan Jalur",
    dotClass: "bg-secondary-fixed-dim",
    badgeClass: "bg-amber-50 text-amber-700",
  },
  delivered: {
    label: "Telah Diterima",
    dotClass: "bg-tertiary",
    badgeClass: "bg-emerald-100 text-emerald-800",
  },
};

export function getRouteForScenario(scenario, waybill) {
  const base = SCENARIO_ROUTES[scenario] ?? SCENARIO_ROUTES.normal;
  return waybill
    ? `${base}?waybill_number=${encodeURIComponent(waybill)}`
    : base;
}

/**
 * Rute awal setelah pengguna mengirim nomor resi. Resi dengan format valid
 * diarahkan ke /cek-resi yang memanggil API lalu meneruskan ke halaman
 * sesuai skenario kiriman; format tidak valid langsung ke halaman validasi.
 */
export function getRouteForResi(resi) {
  const cleanResi = String(resi ?? "").trim();
  const query = `?waybill_number=${encodeURIComponent(cleanResi)}`;

  if (!cleanResi || !WAYBILL_PATTERN.test(cleanResi)) {
    return `/validation-error${query}`;
  }

  return `/cek-resi${query}`;
}
