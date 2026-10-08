import { WAYBILL_PATTERN } from "./constants";

const WIB_OPTIONS = {
  timeZone: "Asia/Jakarta",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
};

export function isValidWaybill(value) {
  return WAYBILL_PATTERN.test(String(value ?? "").trim());
}

export function formatWibTimestamp(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${new Intl.DateTimeFormat("id-ID", WIB_OPTIONS).format(date)} WIB`;
}

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

export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

/** "28/09 13:45" (WIB) untuk daftar riwayat ringkas. */
export function formatShortWib(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("day")}/${get("month")} ${get("hour")}:${get("minute")}`;
}

/** "28 September 2026, 18:30 WIB". */
export function formatLongWib(value) {
  if (!value) return "";
  const date = formatIndonesianDate(value);
  const time = formatWibTime(value);
  return date ? `${date}, ${time} WIB` : "";
}

/** "2 jam lalu" relatif terhadap sekarang. */
export function formatRelativeTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const units = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });
  for (const [unit, seconds] of units) {
    if (Math.abs(diffSeconds) >= seconds) {
      return rtf.format(Math.round(diffSeconds / seconds), unit);
    }
  }
  return "baru saja";
}

const TRAFFIC_LABELS = {
  Clear: "Lancar",
  Moderate: "Ramai Lancar",
  Heavy: "Padat",
};

export function formatTrafficStatus(value) {
  return TRAFFIC_LABELS[value] ?? value ?? "Tidak tersedia";
}

const VEHICLE_LABELS = {
  Motorcycle: "Motor",
  Car: "Mobil",
  Van: "Van",
  "Blind Van": "Blind Van",
  Truck: "Truk",
};

export function formatVehicle(type, plate) {
  const label = VEHICLE_LABELS[type] ?? type ?? "";
  return [label, plate].filter(Boolean).join(" • ");
}

export function formatWeight(kg) {
  if (kg == null) return "-";
  return `${Number(kg).toLocaleString("id-ID", { maximumFractionDigits: 2 })} Kg`;
}

export function formatVolume(m3) {
  if (m3 == null) return "Volume tidak tercatat";
  return `Volume ${Number(m3).toLocaleString("id-ID", { maximumFractionDigits: 3 })} m³`;
}

/** Nama depan untuk sapaan ("Budi Santoso" → "Budi"). */
export function firstName(name) {
  return String(name ?? "").trim().split(/\s+/)[0] ?? "";
}