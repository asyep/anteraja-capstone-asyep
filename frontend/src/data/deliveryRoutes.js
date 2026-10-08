/**
 * Rute pengantaran kurir (leg terakhir) untuk status "Dalam Pengantaran".
 *
 * Posisi kurir dianimasikan dari titik awal menuju alamat penerima,
 * sehingga "Radar Posisi Paket" terlihat bergerak mendekati tujuan.
 *
 * Setiap titik memuat jarak sisa (km) untuk label "0.8 km lagi".
 */

const RUTE_TEBET = {
  id: "tebet-barat-dalam",
  kurir: "Agus Prasetyo",
  alamat: "Jl. Tebet Barat Dalam No. 42",
  tujuan: "No. 42",
  waypoints: [
    {
      id: "titik-awal",
      svg: { x: 60, y: 120 },
      geo: { lat: -6.2300, lon: 106.8450 },
      label: "Delivery Hub Tebet",
      detail: "Rute pengantaran dimulai",
      sisaKm: 2.4,
      status: "Rute Dimulai",
    },
    {
      id: "tebet-raya",
      svg: { x: 150, y: 120 },
      geo: { lat: -6.2320, lon: 106.8480 },
      label: "Jl. Tebet Barat Dalam Raya",
      detail: "Menuju Tebet Barat Dalam",
      sisaKm: 1.6,
      status: "Melintasi Tebet Raya",
    },
    {
      id: "posisi-awal",
      svg: { x: 240, y: 140 },
      geo: { lat: -6.2350, lon: 106.8500 },
      label: "Satria Agus Prasetyo",
      detail: "Menuju Tebet Barat Dalam",
      sisaKm: 0.8,
      status: "Mendekati Lokasi",
    },
    {
      id: "tikungan",
      svg: { x: 320, y: 140 },
      geo: { lat: -6.2370, lon: 106.8500 },
      label: "Simpang Tebet Barat",
      detail: "Belok menuju nomor rumah",
      sisaKm: 0.3,
      status: "Memasuki Jalan Tujuan",
    },
    {
      id: "tujuan",
      svg: { x: 320, y: 60 },
      geo: { lat: -6.2370, lon: 106.8480 },
      label: "Jl. Tebet Barat Dalam No. 42",
      detail: "Satria tiba di alamat penerima",
      sisaKm: 0,
      status: "Tiba di Alamat",
    },
  ],
};

export const DELIVERY_ROUTES = {
  [RUTE_TEBET.id]: RUTE_TEBET,
};
