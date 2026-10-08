import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/layout/Logo";
import StoreBadges from "@/components/ui/StoreBadges";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/ui/SocialIcons";
import { LACAK_CONTACT } from "@/data/lacakContent";

const KANAL_SOSIAL = [
  { id: "facebook", label: "Facebook", href: "#", Icon: FacebookIcon },
  { id: "instagram", label: "Instagram", href: "#", Icon: InstagramIcon },
  { id: "tiktok", label: "TikTok", href: "#", Icon: TikTokIcon },
  { id: "x", label: "X", href: LACAK_CONTACT.x, Icon: XIcon },
  { id: "youtube", label: "YouTube", href: "#", Icon: YouTubeIcon },
];

const IKON_UTILITAS = [
  { icon: "language", label: "Website" },
  { icon: "chat", label: "Chat" },
  { icon: "share", label: "Share" },
  { icon: "rss_feed", label: "RSS" },
];

export default function Footer() {
  return (
    <footer className="mt-16 w-full border-t border-gray-100 bg-white pb-12 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-gray-100 pb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Kolom 1 — Brand, bio, dan sosial utilitas */}
          <div className="flex flex-col items-start gap-4">
            <Logo className="h-9" />
            <p className="text-sm leading-relaxed text-gray-500">
              Solusi pengiriman logistik pintar berbasis teknologi dengan armada
              Satria terpercaya untuk kebutuhan perorangan maupun korporasi di
              seluruh Indonesia.
            </p>
            <div className="flex items-center gap-2 pt-2">
              {IKON_UTILITAS.map(({ icon, label }) => (
                <a
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-[#fce7f3] hover:text-[#ec008c]"
                  href="#"
                  key={icon}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Kolom 2 — Layanan */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Layanan
            </h2>
            <nav className="flex flex-col gap-2.5 text-sm font-medium text-gray-500">
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
                Bantuan
              </Link>
            </nav>
          </div>

          {/* Kolom 3 — Bantuan & Hubungi */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Bantuan &amp; Hubungi
            </h2>
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <span className="block text-[11px] font-bold uppercase text-gray-400">
                  X
                </span>
                <a
                  className="font-semibold text-gray-800 transition-colors hover:text-[#ec008c]"
                  href={LACAK_CONTACT.x}
                  rel="noreferrer"
                  target="_blank"
                >
                  {LACAK_CONTACT.xHandle}
                </a>
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase text-gray-400">
                  Call Center
                </span>
                <a
                  className="font-bold text-gray-900 transition-colors hover:text-[#ec008c]"
                  href={LACAK_CONTACT.hotline}
                >
                  {LACAK_CONTACT.hotlineLabel}
                </a>
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase text-gray-400">
                  Customer Service
                </span>
                <a
                  className="font-semibold text-gray-800 transition-colors hover:text-[#ec008c]"
                  href={`mailto:${LACAK_CONTACT.email}`}
                >
                  {LACAK_CONTACT.email}
                </a>
              </div>
            </div>
          </div>

          {/* Kolom 4 — Sosial media & unduh aplikasi */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
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

        <div className="pt-8 text-center text-xs text-gray-500">
          © 2024 PT Tri Adi Bersama (Anteraja). Hak Cipta Dilindungi
          Undang-Undang.
        </div>
      </div>
    </footer>
  );
}
