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

export const TRANSIT_ROUTES = {
  [RUTE_SEMARANG_JAKARTA.id]: RUTE_SEMARANG_JAKARTA,
};

/** Titik awal animasi berdasarkan indeks waypoint yang sedang aktif. */
export function waypointAwal(rute, indeks = 3) {
  return rute.waypoints[Math.min(indeks, rute.waypoints.length - 1)];
}
