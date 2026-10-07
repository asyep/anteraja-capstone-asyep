import React from "react";
import { Link, useLocation } from "react-router-dom";
import BrandLogo from "../common/BrandLogo";

/** Semua route pelacakan dianggap masih berada di dalam menu "Lacak Kiriman". */
const PREFIX_LACAK = ["/lacak", "/tracking", "/delivered", "/canceled", "/ai-fallback"];

function kelasNav(aktif) {
  return [
    "inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-3 py-1.5",
    "font-label-lg text-label-lg transition-colors sm:px-4",
    aktif
      ? "bg-[#fce7f3] font-bold text-[#ec008c]"
      : "font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
  ].join(" ");
}

export default function Header() {
  const { pathname } = useLocation();

  const berandaAktif = pathname === "/";
  const lacakAktif = PREFIX_LACAK.some((prefix) =>
    pathname.startsWith(prefix),
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-surface/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-6 lg:px-10">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            aria-label="Anteraja — Beranda"
            className="flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            to="/"
          >
            <BrandLogo className="h-7 sm:h-9" />
          </Link>

          <nav aria-label="Navigasi utama" className="flex items-center gap-1 sm:gap-2">
            <Link
              aria-current={berandaAktif ? "page" : undefined}
              className={kelasNav(berandaAktif)}
              to="/"
            >
              Beranda
            </Link>
            <Link
              aria-current={lacakAktif ? "page" : undefined}
              className={kelasNav(lacakAktif)}
              to="/lacak"
            >
              Lacak Kiriman
            </Link>
          </nav>
        </div>

        <Link
          className="hidden min-h-[40px] items-center gap-2 rounded-full border border-border-subtle bg-surface-container-lowest px-4 font-label-md text-label-md font-bold text-on-surface-variant shadow-sm transition-colors hover:border-[#ec008c] hover:text-[#ec008c] md:inline-flex"
          to="/bantuan"
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
          Pusat Bantuan
        </Link>
      </div>
    </header>
  );
}
