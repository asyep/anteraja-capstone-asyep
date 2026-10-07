import React from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../common/BrandLogo";
import StoreBadges from "../common/StoreBadges";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from "../common/SocialIcons";
import { LACAK_CONTACT } from "../../data/lacakContent";

const KANAL_SOSIAL = [
  { id: "facebook", label: "Facebook", href: "#", Icon: FacebookIcon },
  { id: "instagram", label: "Instagram", href: "#", Icon: InstagramIcon },
  { id: "tiktok", label: "TikTok", href: "#", Icon: TikTokIcon },
  { id: "x", label: "X", href: LACAK_CONTACT.x, Icon: XIcon },
  { id: "youtube", label: "YouTube", href: "#", Icon: YouTubeIcon },
];

const IKON_UTILITAS = ["language", "chat", "share", "rss_feed"];

export default function Footer() {
  return (
    <footer className="mt-16 w-full border-t border-border-subtle bg-white pb-12 pt-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 border-b border-border-subtle pb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Kolom 1 — Brand */}
          <div className="flex flex-col items-start gap-4">
            <Link aria-label="Anteraja — Beranda" to="/">
              <BrandLogo className="h-9" />
            </Link>
            <p className="font-body-md text-body-md leading-relaxed text-text-muted">
              Solusi pengiriman logistik pintar berbasis teknologi dengan armada
              Satria terpercaya untuk kebutuhan perorangan maupun korporasi di
              seluruh Indonesia.
            </p>
            <div className="flex items-center gap-2 pt-2">
              {IKON_UTILITAS.map((ikon) => (
                <a
                  aria-label={ikon.replace("_", " ")}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-low text-text-muted transition-colors hover:bg-[#fce7f3] hover:text-[#ec008c]"
                  href="#"
                  key={ikon}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {ikon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Kolom 2 — Layanan */}
          <div className="flex flex-col gap-3">
            <h2 className="font-label-lg text-label-lg font-bold uppercase tracking-wider text-on-surface">
              Layanan
            </h2>
            <nav className="flex flex-col gap-2.5 font-body-md text-body-md font-medium text-text-muted">
              <Link className="transition-colors hover:text-[#ec008c]" to="/">
                Beranda
              </Link>
              <Link
                className="transition-colors hover:text-[#ec008c]"
                to="/lacak"
              >
                Lacak Kiriman
              </Link>
              <Link
                className="transition-colors hover:text-[#ec008c]"
                to="/bantuan"
              >
                Pusat Bantuan
              </Link>
            </nav>
          </div>

          {/* Kolom 3 — Bantuan & Hubungi */}
          <div className="flex flex-col gap-3">
            <h2 className="font-label-lg text-label-lg font-bold uppercase tracking-wider text-on-surface">
              Bantuan &amp; Hubungi
            </h2>
            <div className="flex flex-col gap-3 font-body-md text-body-md">
              <div>
                <span className="block font-label-sm text-label-sm font-bold uppercase text-text-placeholder">
                  X
                </span>
                <a
                  className="font-semibold text-on-surface transition-colors hover:text-[#ec008c]"
                  href={LACAK_CONTACT.x}
                  rel="noreferrer"
                  target="_blank"
                >
                  {LACAK_CONTACT.xHandle}
                </a>
              </div>
              <div>
                <span className="block font-label-sm text-label-sm font-bold uppercase text-text-placeholder">
                  Call Center
                </span>
                <a
                  className="font-bold text-on-surface transition-colors hover:text-[#ec008c]"
                  href={LACAK_CONTACT.hotline}
                >
                  {LACAK_CONTACT.hotlineLabel}
                </a>
              </div>
              <div>
                <span className="block font-label-sm text-label-sm font-bold uppercase text-text-placeholder">
                  Customer Service
                </span>
                <a
                  className="font-semibold text-on-surface transition-colors hover:text-[#ec008c]"
                  href={`mailto:${LACAK_CONTACT.email}`}
                >
                  {LACAK_CONTACT.email}
                </a>
              </div>
            </div>
          </div>

          {/* Kolom 4 — Sosial media & aplikasi */}
          <div className="flex flex-col gap-4">
            <h2 className="font-label-lg text-label-lg font-bold uppercase tracking-wider text-on-surface">
              Sosial Media
            </h2>
            <div className="flex items-center gap-2.5">
              {KANAL_SOSIAL.map(({ id, label, href, Icon }) => (
                <a
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ec008c] text-white transition-opacity hover:opacity-90"
                  href={href}
                  key={id}
                  rel="noreferrer"
                  target={href.startsWith("http") ? "_blank" : undefined}
                >
                  <Icon />
                </a>
              ))}
            </div>
            <StoreBadges className="pt-2" />
          </div>
        </div>

        <div className="pt-8 text-center font-body-sm text-body-sm text-text-muted">
          © 2024 PT Tri Adi Bersama (Anteraja). Hak Cipta Dilindungi
          Undang-Undang.
        </div>
      </div>
    </footer>
  );
}
