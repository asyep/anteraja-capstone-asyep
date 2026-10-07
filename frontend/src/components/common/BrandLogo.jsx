import React from "react";

/**
 * Wordmark Anteraja sebagai SVG inline.
 * Dipakai bersama oleh Header dan Footer supaya brand selalu konsisten
 * tanpa bergantung pada aset eksternal (CDN) yang bisa kedaluwarsa.
 */
export default function BrandLogo({ className = "h-9", inverted = false }) {
  const wordColor = inverted ? "#ffffff" : "#1a1a1a";
  const tileColor = "#ec008c";

  return (
    <svg
      aria-label="Anteraja"
      className={`${className} w-auto`}
      role="img"
      viewBox="0 0 136 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Satria tile mark */}
      <rect fill={tileColor} height="34" rx="11" width="34" x="1" y="3" />
      <path
        d="M23.6 22.2c-1.2 3.4-4.2 5.6-8 5.6-4.9 0-8.4-3.1-8.4-7.7 0-4.7 3.6-7.9 8.6-7.9 3.6 0 6.5 1.9 7.7 4.9l-4.6 1.7c-.5-1.4-1.6-2.2-3.1-2.2-1.9 0-3.2 1.4-3.2 3.4 0 2 1.3 3.3 3.2 3.3 1.5 0 2.6-.7 3.1-2l4.7.9Z"
        fill="#ffffff"
      />
      {/* Wordmark */}
      <text
        fill={wordColor}
        fontFamily="Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
        fontSize="27"
        fontWeight="800"
        lengthAdjust="spacingAndGlyphs"
        textLength="88"
        x="45"
        y="31"
      >
        anteraja
      </text>
    </svg>
  );
}
