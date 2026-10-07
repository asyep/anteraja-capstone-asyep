import React from "react";

/** Badge toko aplikasi resmi (aset lokal di frontend/public). */
export default function StoreBadges({ className = "" }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <a
        aria-label="Unduh aplikasi Anteraja di App Store"
        className="inline-block"
        href="#"
      >
        <img
          alt="Download on App Store"
          className="h-9 w-auto"
          src="/app-store-badge.svg"
        />
      </a>
      <a
        aria-label="Unduh aplikasi Anteraja di Google Play"
        className="inline-block"
        href="#"
      >
        <img
          alt="Get it on Google Play"
          className="h-9 w-auto"
          src="/google-play-badge.svg"
        />
      </a>
    </div>
  );
}
