// Satu tempat untuk alamat backend PHP. Jika belum diisi, komponen latihan
// menampilkan petunjuk konfigurasi dan frontend prototype tetap berjalan normal.
export const API = import.meta.env.VITE_PHP_API_URL?.replace(/\/$/, "") ?? "";

export const isPhpApiConfigured = API.length > 0;
