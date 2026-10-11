/**
 * Rute perjalanan armada untuk status "Dalam Perjalanan".
 *
 * Setiap rute memuat beberapa titik pantau (waypoint). Posisi armada
 * dianimasikan dari titik ke titik sehingga "Radar Posisi Paket" terlihat
 * bergerak real-time.
 *
 * Koordinat:
 *   svg  -> posisi pada viewBox peta (500 x 240)
 *   geo  -> koordinat asli untuk label LAT/LON
 */

const RUTE_SEMARANG_JAKARTA = {
  id: "semarang-jakarta",
  asal: "Staging DC Semarang",
  tujuan: "Sorting Gateway Jakarta",
  koridor: "Koridor Pantura / Tol Trans Jawa",
  waypoints: [
    {
      id: "semarang",
      svg: { x: 40, y: 178 },
      geo: { lat: -6.9582, lon: 110.4503 },
      label: "Staging Gateway Semarang Hub",
      detail: "Armada Linehaul B 9421 KXP • Koridor Pantura",
      status: "Titik Keberangkatan",
    },
    {
      id: "pekalongan",
      svg: { x: 130, y: 160 },
      geo: { lat: -6.8886, lon: 109.6753 },
      label: "Transit Hub Pekalongan",
      detail: "Armada Linehaul B 9421 KXP • Jalur Pantura",
      status: "Melintasi Pekalongan",
    },
    {
      id: "tegal",
      svg: { x: 200, y: 142 },
      geo: { lat: -6.8694, lon: 109.1402 },
      label: "Transit Hub Tegal",
      detail: "Armada Linehaul B 9421 KXP • Jalur Pantura",
      status: "Melintasi Tegal",
    },
    {
      id: "cirebon",
      svg: { x: 255, y: 130 },
      geo: { lat: -6.7063, lon: 108.557 },
      label: "Transit Hub Cirebon Barat",
      detail: "Armada Linehaul B 9421 KXP • Koridor Pantura",
      status: "Konsolidasi Kargo",
    },
    {
      id: "cikopo",
      svg: { x: 350, y: 110 },
      geo: { lat: -6.5667, lon: 107.4167 },
      label: "Transit Hub Cikopo",
      detail: "Armada Linehaul B 9421 KXP • Tol Cipali",
      status: "Melintasi Cikopo",
    },
    {
      id: "jakarta",
      svg: { x: 470, y: 98 },
      geo: { lat: -6.2088, lon: 106.8456 },
      label: "Sorting Gateway Jakarta",
      detail: "Armada Linehaul B 9421 KXP • Menuju hub tujuan",
      status: "Menuju Hub Tujuan",
    },
  ],
};

const RUTE_BANDUNG_JAKARTA = {
  id: "bandung-jakarta",
  asal: "Hub Sortir Bandung",
  tujuan: "Sorting Gateway Cakung DC",
  koridor: "Koridor Tol Purbaleunyi - JORR",
  waypoints: [
    {
      id: "bandung",
      geo: { lat: -6.9412, lon: 107.6454 },
      label: "Hub Sortir Asal Bandung",
      detail: "Armada Linehaul • Jl. Soekarno-Hatta",
      status: "Berangkat dari Hub Asal",
    },
    {
      id: "padalarang",
      geo: { lat: -6.8458, lon: 107.4912 },
      label: "Tol Padaleunyi KM 122",
      detail: "Armada Linehaul • Jalur Tol Purbaleunyi",
      status: "Melintasi Padalarang",
    },
    {
      id: "cipularang",
      geo: { lat: -6.612, lon: 107.412 },
      label: "Tol Cipularang KM 82",
      detail: "Armada Linehaul • Koridor Purwakarta",
      status: "Melintasi Cipularang",
    },
    {
      id: "cikampek",
      geo: { lat: -6.4025, lon: 107.135 },
      label: "Gerbang Tol Cikampek Utama",
      detail: "Armada Linehaul • Tol Jakarta-Cikampek",
      status: "Melintasi Cikampek",
    },
    {
      id: "pasar-rebo",
      geo: { lat: -6.3021, lon: 106.8951 },
      label: "Tol JORR KM 34 (Pasar Rebo)",
      detail: "Armada Blind Van • Menuju Hub Cakung",
      status: "Melintasi Tol JORR",
    },
    {
      id: "cakung",
      geo: { lat: -6.1856, lon: 106.9452 },
      label: "Staging Gateway Cakung DC",
      detail: "DC Anteraja • Kawasan Industri Cakung",
      status: "Menuju Hub Cakung",
    },
  ],
};

const RUTE_SURABAYA_JAKARTA = {
  id: "surabaya-jakarta",
  asal: "Staging Gateway Surabaya Hub",
  tujuan: "Sorting Gateway Cakung DC",
  koridor: "Koridor Tol Trans Jawa (Jatim - Jabar)",
  waypoints: [
    {
      id: "surabaya",
      geo: { lat: -7.2341, lon: 112.6712 },
      label: "Staging Hub Surabaya Margomulyo",
      detail: "Armada Linehaul • Jawa Timur",
      status: "Titik Keberangkatan",
    },
    {
      id: "solo",
      geo: { lat: -7.5561, lon: 110.8316 },
      label: "Transit Hub Solo",
      detail: "Armada Linehaul • Tol Solo-Ngawi",
      status: "Melintasi Solo",
    },
    {
      id: "semarang",
      geo: { lat: -6.9582, lon: 110.4503 },
      label: "Gateway Hub Semarang Kaligawe",
      detail: "Armada Linehaul • Tol Krapyak",
      status: "Melintasi Semarang",
    },
    {
      id: "cirebon",
      geo: { lat: -6.7063, lon: 108.557 },
      label: "Transit Hub Cirebon",
      detail: "Armada Linehaul • Tol Cipali",
      status: "Melintasi Cirebon",
    },
    {
      id: "jakarta",
      geo: { lat: -6.1856, lon: 106.9452 },
      label: "Sorting Gateway Cakung DC",
      detail: "DC Anteraja • Hub Tujuan Jakarta",
      status: "Menuju Hub Tujuan",
    },
  ],
};

export const TRANSIT_ROUTES = {
  [RUTE_SEMARANG_JAKARTA.id]: RUTE_SEMARANG_JAKARTA,
  [RUTE_BANDUNG_JAKARTA.id]: RUTE_BANDUNG_JAKARTA,
  [RUTE_SURABAYA_JAKARTA.id]: RUTE_SURABAYA_JAKARTA,
};

/** Titik awal animasi berdasarkan indeks waypoint yang sedang aktif. */
export function waypointAwal(rute, indeks = 3) {
  if (!rute?.waypoints || rute.waypoints.length === 0) return null;
  return rute.waypoints[Math.min(indeks, rute.waypoints.length - 1)];
}
