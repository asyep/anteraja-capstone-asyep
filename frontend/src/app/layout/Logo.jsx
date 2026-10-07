import { Link } from "react-router-dom";

/**
 * Logo Anteraja (aset SVG di frontend/public/anteraja-logo.svg).
 * Rasio asli 1268 : 518, jadi tinggi yang di-set akan menentukan lebar.
 */
export default function Logo({ className = "h-8 sm:h-9" }) {
  return (
    <Link
      aria-label="Anteraja — kembali ke beranda"
      className="inline-flex shrink-0 items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      to="/"
    >
      <img
        alt="Anteraja Lacak"
        className={`${className} w-auto object-contain`}
        src="/anteraja-logo.svg"
      />
    </Link>
  );
}
