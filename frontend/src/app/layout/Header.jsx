import React from "react";
import { Link, useLocation } from "react-router-dom";
import BrandLogo from "@/shared/ui/BrandLogo";

/** Route pelacakan tetap dianggap bagian dari menu "Lacak Kiriman". */
const PREFIX_LACAK = [
  "/lacak",
  "/tracking",
  "/delivered",
  "/canceled",
  "/ai-fallback",
];

export default function Header() {
  const { pathname } = useLocation();

  const berandaAktif = pathname === "/";
  const lacakAktif = PREFIX_LACAK.some((prefix) => pathname.startsWith(prefix));

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-surface/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between gap-space-md px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex items-center gap-space-xl">
          <Link
            aria-label="Anteraja — Beranda"
            className="flex items-center gap-space-xs rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            to="/"
          >
            <BrandLogo className="h-9" />
          </Link>

          <nav
            aria-label="Navigasi utama"
            className="flex items-center gap-space-md"
          >
            <Link
              aria-current={berandaAktif ? "page" : undefined}
              className="px-3 py-2 font-label-lg text-label-lg text-on-surface-variant transition-colors hover:text-on-surface"
              to="/"
            >
              Beranda
            </Link>
            <Link
              aria-current={lacakAktif ? "page" : undefined}
              className={
                lacakAktif
                  ? "rounded-full bg-pink-50 px-4 py-1.5 font-label-lg text-label-lg font-bold text-[#ec008c] transition-colors"
                  : "px-3 py-2 font-label-lg text-label-lg text-on-surface-variant transition-colors hover:text-on-surface"
              }
              to="/lacak"
            >
              Lacak Kiriman
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
