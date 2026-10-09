import { Link } from "react-router-dom";

import { isNavItemActive } from "@/components/layout/navigation";

/** Kelas pill untuk menu aktif (magenta) — dipakai desktop & mobile. */
const ACTIVE_CLASS =
  "bg-pink-50 font-bold text-[#ec008c] shadow-[inset_0_0_0_1px_rgba(236,0,140,0.12)]";

/** Kelas menu tidak aktif. */
const IDLE_CLASS =
  "font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface";

/**
 * Daftar menu navigasi utama.
 * `variant` menentukan tata letak: sejajar di header (desktop) atau
 * bertumpuk di panel mobile.
 */
export default function NavLinks({
  pathname,
  items,
  variant = "desktop",
  onNavigate,
}) {
  const isMobile = variant === "mobile";

  return (
    <ul
      className={
        isMobile ? "flex flex-col gap-1" : "flex items-center gap-space-xs"
      }
    >
      {items.map((item) => {
        const active = isNavItemActive(item, pathname);

        return (
          <li key={item.id}>
            <Link
              aria-current={active ? "page" : undefined}
              className={[
                "inline-flex items-center rounded-full font-label-lg text-label-lg transition-colors",
                isMobile
                  ? "w-full px-4 py-3"
                  : "px-3 py-1.5 sm:px-4 sm:py-2",
                active ? ACTIVE_CLASS : IDLE_CLASS,
              ].join(" ")}
              onClick={onNavigate}
              to={item.to}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
