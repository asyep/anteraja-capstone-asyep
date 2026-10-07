import NavLinks from "@/app/layout/NavLinks";

/**
 * Panel navigasi untuk layar kecil: tombol hamburger + panel dropdown
 * yang muncul tepat di bawah header.
 */
export default function MobileNav({ open, items, onToggle, onNavigate, pathname }) {
  return (
    <>
      <button
        aria-controls="header-mobile-menu"
        aria-expanded={open}
        aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-on-surface transition-colors hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
        onClick={onToggle}
        type="button"
      >
        <span className="material-symbols-outlined text-[26px]">
          {open ? "close" : "menu"}
        </span>
      </button>

      {open ? (
        <>
          {/* Latar gelap transparan, klik untuk menutup */}
          <button
            aria-label="Tutup menu navigasi"
            className="fixed inset-0 top-20 z-40 cursor-default bg-on-surface/20 backdrop-blur-[2px] md:hidden"
            onClick={onNavigate}
            tabIndex={-1}
            type="button"
          />

          <nav
            aria-label="Navigasi mobile"
            className="fixed inset-x-0 top-20 z-50 border-b border-border-subtle bg-surface px-4 pb-4 pt-2 shadow-lg md:hidden"
            id="header-mobile-menu"
          >
            <NavLinks
              items={items}
              onNavigate={onNavigate}
              pathname={pathname}
              variant="mobile"
            />
          </nav>
        </>
      ) : null}
    </>
  );
}
