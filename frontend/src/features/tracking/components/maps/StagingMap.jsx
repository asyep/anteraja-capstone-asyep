/**
 * Peta kawasan Staging Distribution Center Semarang.
 * Digambar penuh dengan SVG (grid, jalan, label, dan pin gudang) sehingga
 * tidak bergantung pada aset peta eksternal.
 */
export default function StagingMap() {
  return (
    <svg
      aria-label="Peta lokasi Staging Distribution Center Semarang"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      viewBox="0 0 500 240"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          height="25"
          id="logistics-grid"
          patternUnits="userSpaceOnUse"
          width="25"
        >
          <path
            d="M 25 0 L 0 0 0 25"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="0.8"
          />
        </pattern>
      </defs>

      <rect fill="#f8fafc" height="100%" width="100%" />
      <rect fill="url(#logistics-grid)" height="100%" width="100%" />

      {/* Laut Jawa */}
      <path
        d="M-20,40 Q120,60 210,30 T450,20 T520,35"
        fill="none"
        opacity="0.6"
        stroke="#cbd5e1"
        strokeLinecap="round"
        strokeWidth="16"
      />
      <text
        fill="#64748b"
        fontFamily="Plus Jakarta Sans"
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="0.5"
        x="80"
        y="32"
      >
        Laut Jawa / Kawasan Pesisir Utara
      </text>

      {/* Kawasan industri */}
      <rect
        fill="#e2e8f0"
        height="55"
        opacity="0.5"
        rx="6"
        width="130"
        x="280"
        y="45"
      />
      <text
        fill="#64748b"
        fontFamily="Plus Jakarta Sans"
        fontSize="8"
        fontWeight="700"
        x="290"
        y="58"
      >
        KAWASAN INDUSTRI TERBOYO
      </text>

      <rect
        fill="#e2e8f0"
        height="60"
        opacity="0.4"
        rx="6"
        width="110"
        x="40"
        y="160"
      />
      <text
        fill="#64748b"
        fontFamily="Plus Jakarta Sans"
        fontSize="8"
        fontWeight="700"
        x="48"
        y="173"
      >
        SIMPANG LIMA SEMARANG
      </text>

      {/* Jalan utama */}
      <path
        d="M0,195 L140,185 L260,135 L420,110 L520,105"
        fill="none"
        stroke="#94a3b8"
        strokeLinecap="round"
        strokeWidth="9"
      />
      <path
        d="M0,195 L140,185 L260,135 L420,110 L520,105"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="5"
      />

      <path
        d="M260,0 L260,135 L285,240"
        fill="none"
        stroke="#cbd5e1"
        strokeLinecap="round"
        strokeWidth="7"
      />
      <path
        d="M260,0 L260,135 L285,240"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="3.5"
      />

      <path
        d="M70,90 L260,135 L440,205"
        fill="none"
        stroke="#cbd5e1"
        strokeLinecap="round"
        strokeWidth="6"
      />
      <path
        d="M70,90 L260,135 L440,205"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="3"
      />

      <path
        d="M180,240 L260,135"
        fill="none"
        stroke="#e2e8f0"
        strokeDasharray="3,3"
        strokeWidth="3"
      />
      <path
        d="M370,50 L420,110 L430,240"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="4"
      />

      {/* Nama jalan */}
      <text
        fill="#475569"
        fontFamily="Plus Jakarta Sans"
        fontSize="8"
        fontWeight="600"
        x="15"
        y="178"
      >
        Jl. Pemuda / Gajah Mada
      </text>
      <text
        fill="#334155"
        fontFamily="Plus Jakarta Sans"
        fontSize="8.5"
        fontWeight="700"
        x="295"
        y="128"
      >
        Jl. Raya Kaligawe KM 5 (Pantura)
      </text>
      <text
        fill="#475569"
        fontFamily="Plus Jakarta Sans"
        fontSize="8"
        fontWeight="600"
        x="300"
        y="215"
      >
        Jl. Brigjen Sudiarto
      </text>
      <text
        fill="#64748b"
        fontFamily="Plus Jakarta Sans"
        fontSize="7.5"
        fontWeight="600"
        x="266"
        y="45"
      >
        Pelabuhan Tanjung Emas
      </text>

      {/* Titik gudang */}
      <circle
        className="animate-pulse"
        cx="260"
        cy="135"
        fill="#b30069"
        fillOpacity="0.15"
        r="34"
      />
      <circle cx="260" cy="135" fill="#b30069" fillOpacity="0.25" r="20" />
      <circle
        cx="260"
        cy="135"
        fill="#b30069"
        r="8"
        stroke="#ffffff"
        strokeWidth="2.5"
      />
    </svg>
  );
}
