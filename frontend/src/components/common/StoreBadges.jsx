import React from "react";

/** Badge App Store & Google Play versi SVG inline (tanpa aset eksternal). */
export function AppStoreBadge({ className = "h-9" }) {
  return (
    <svg
      aria-label="Unduh di App Store"
      className={`${className} w-auto`}
      role="img"
      viewBox="0 0 135 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#000000" height="40" rx="7" width="135" />
      <path
        d="M27.9 20.3c0-3.2 2.6-4.7 2.7-4.8-1.5-2.2-3.8-2.5-4.6-2.5-2-.2-3.8 1.2-4.8 1.2-1 0-2.5-1.1-4.1-1.1-2.1 0-4.1 1.2-5.2 3.2-2.2 3.9-.6 9.6 1.6 12.7 1.1 1.5 2.3 3.3 4 3.2 1.6-.1 2.2-1 4.1-1s2.5 1 4.1 1c1.7 0 2.8-1.5 3.9-3.1 1.2-1.8 1.7-3.5 1.7-3.6-.1 0-3.3-1.3-3.4-5.2ZM24.6 10.5c.9-1 1.4-2.5 1.3-3.9-1.3.1-2.8.9-3.7 1.9-.8.9-1.5 2.4-1.3 3.8 1.4.1 2.9-.7 3.7-1.8Z"
        fill="#ffffff"
      />
      <text
        fill="#ffffff"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="9"
        x="40"
        y="15"
      >
        Unduh di
      </text>
      <text
        fill="#ffffff"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="15"
        fontWeight="600"
        x="40"
        y="30"
      >
        App Store
      </text>
    </svg>
  );
}

export function GooglePlayBadge({ className = "h-9" }) {
  return (
    <svg
      aria-label="Dapatkan di Google Play"
      className={`${className} w-auto`}
      role="img"
      viewBox="0 0 135 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#000000" height="40" rx="7" width="135" />
      <path d="M9.6 8.6c-.3.3-.5.8-.5 1.4v20c0 .6.2 1.1.5 1.4l.1.1 11.2-11.2v-.3L9.6 8.6Z" fill="#00d3ff" />
      <path d="m24.5 24.2-3.7-3.7v-.3l3.7-3.7.1.1 4.4 2.5c1.3.7 1.3 1.9 0 2.6l-4.4 2.5h-.1Z" fill="#ffd400" />
      <path d="m24.6 24.1-3.8-3.8-11.2 11.2c.4.5 1.1.5 1.9.1l13.1-7.5" fill="#ff3a44" />
      <path d="M24.6 16.3 11.5 8.8c-.8-.5-1.5-.4-1.9.1l11.2 11.2 3.8-3.8Z" fill="#00e676" />
      <text
        fill="#ffffff"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="9"
        x="40"
        y="15"
      >
        Dapatkan di
      </text>
      <text
        fill="#ffffff"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="15"
        fontWeight="600"
        x="40"
        y="30"
      >
        Google Play
      </text>
    </svg>
  );
}

export default function StoreBadges({ className = "" }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <a aria-label="Unduh aplikasi Anteraja di App Store" href="#">
        <AppStoreBadge />
      </a>
      <a aria-label="Unduh aplikasi Anteraja di Google Play" href="#">
        <GooglePlayBadge />
      </a>
    </div>
  );
}
