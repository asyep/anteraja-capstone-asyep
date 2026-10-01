import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm">
      <div className="h-[74px] max-w-[1320px] mx-auto px-2 sm:px-6 lg:px-10 flex items-center justify-between gap-1 sm:gap-8">
        <div className="flex items-center gap-1 sm:gap-10">
          <Link
            to="/"
            className="flex items-center gap-3 transition-transform hover:opacity-95"
            aria-label="Anteraja Beranda"
          >
            <img
              alt="Anteraja"
              className="h-6 sm:h-9 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe6Sd3grxrRWPcD50ZL9ML41Qgjht-JFyyH9oR_h216L-YuPxTnO476pV6oNgnxfW6GO3e69fnJ6zfE31GbHVruEB0qAqLhqyF4GzmBS6Uw8utcokB5ESQNjEUgBTQue2S_nmzjh85VMNah20d2omDqGQ8Z1easannyiXA-VC-6TascqvSc5Oq2eMij5tOvg1KKRukpf5TRfeUfqFgTRHTP1uW23cHVlgombuEI5jwo_4iEzCJmERdLH6uug9wp-LKkV8"
            />
          </Link>

          <nav
            className="flex items-center gap-0 sm:gap-2"
            aria-label="Navigasi utama"
          >
            <Link
              to="/"
              className={`inline-flex min-h-9 shrink-0 items-center whitespace-nowrap rounded-xl px-3 sm:px-5 text-xs sm:text-sm transition-colors ${
                currentPath === "/"
                  ? "bg-[#b30069]/10 font-bold text-[#b30069]"
                  : "font-semibold text-[#5a3f49] hover:bg-[#f0eded] hover:text-[#b30069]"
              }`}
            >
              Beranda
            </Link>

            <Link
              to="/lacak"
              className={`inline-flex min-h-9 shrink-0 items-center whitespace-nowrap rounded-xl px-1 sm:px-5 text-[10px] sm:text-sm transition-colors ${
                currentPath.startsWith("/lacak") ||
                currentPath.startsWith("/tracking") ||
                currentPath === "/delivered" ||
                currentPath === "/canceled" ||
                currentPath === "/ai-fallback"
                  ? "bg-[#b30069]/10 font-bold text-[#b30069]"
                  : "font-semibold text-[#5a3f49] hover:bg-[#f0eded] hover:text-[#b30069]"
              }`}
            >
              Lacak Kiriman
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
