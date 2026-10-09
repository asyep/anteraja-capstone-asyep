import { useLocation } from "react-router-dom";

import Logo from "@/components/layout/Logo";
import MobileNav from "@/components/layout/MobileNav";
import NavLinks from "@/components/layout/NavLinks";
import { NAV_ITEMS } from "@/components/layout/navigation";
import useMobileNav from "@/components/layout/useMobileNav";

/**
 * Header aplikasi — dipasang sekali di app/App.jsx sehingga tampil sama
 * di semua halaman.
 *
 * Struktur berkas terkait:
 *   navigation.js   konfigurasi menu + aturan menu aktif
 *   useMobileNav.js state buka/tutup menu mobile
 *   Logo.jsx        logo Anteraja
 *   NavLinks.jsx    daftar menu (dipakai versi desktop & mobile)
 *   MobileNav.jsx   tombol hamburger + panel dropdown
 *
 * Tinggi header 80px (h-20); offset konten diatur di App.jsx (pt-20).
 */
export default function Header() {
  const { pathname } = useLocation();
  const { open, toggle, close } = useMobileNav(pathname);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border-subtle/70 bg-surface/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between gap-4 px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6 lg:gap-space-xl">
          <Logo />

          {/* Navigasi desktop */}
          <nav aria-label="Navigasi utama" className="hidden md:block">
            <NavLinks items={NAV_ITEMS} pathname={pathname} />
          </nav>
        </div>

        {/* Navigasi mobile */}
        <MobileNav
          items={NAV_ITEMS}
          onNavigate={close}
          onToggle={toggle}
          open={open}
          pathname={pathname}
        />
      </div>
    </header>
  );
}
