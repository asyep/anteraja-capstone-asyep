/**
 * Sumber tunggal konfigurasi navigasi header.
 *
 * Setiap halaman memakai Header yang sama; menu aktif ditentukan otomatis dari
 * `match` (prefix path). Jadi menambah menu cukup di file ini saja.
 */
export const NAV_ITEMS = [
  {
    id: "beranda",
    label: "Beranda",
    to: "/",
    // exact: "/" tidak boleh dianggap aktif di semua halaman
    match: ["/"],
    exact: true,
  },
  {
    id: "lacak",
    label: "Lacak Kiriman",
    to: "/lacak",
    // Semua route pelacakan tetap menyorot menu ini.
    match: [
      "/lacak",
      "/tracking",
      "/tracking-normal",
      "/tracking-live",
      "/delivered",
      "/canceled",
      "/ai-fallback",
      "/not-found",
      "/validation-error",
      "/service-error",
      "/smart-widget",
    ],
  },
];

/** Cek apakah sebuah route dianggap aktif untuk salah satu menu. */
export function isNavItemActive(item, pathname) {
  if (item.exact) return pathname === item.to;
  return item.match.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
