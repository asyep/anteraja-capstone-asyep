import { useEffect, useState } from "react";

/**
 * Kelola state menu navigasi mobile:
 * - buka/tutup menu,
 * - tutup otomatis saat route berubah,
 * - tutup saat tombol Escape ditekan,
 * - kunci scroll body selama menu terbuka.
 */
export default function useMobileNav(pathname) {
  const [open, setOpen] = useState(false);

  // Tutup saat pindah halaman
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return { open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) };
}
