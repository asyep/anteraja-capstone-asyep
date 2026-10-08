/**
 * Peta koridor Pantura / Tol Trans Jawa (leg Semarang → Jakarta).
 * Dipakai untuk status "Dalam Perjalanan".
 *
 * `marker` adalah posisi armada dalam koordinat viewBox peta. Peta ikut
 * menggeser (pan) supaya armada selalu terlihat di tengah, dan pergeseran
 * dianimasikan halus lewat transition pada viewBox.
 */

// Ukuran area yang ditampilkan; rasionya disesuaikan dengan kartu (h-56).
const VIEW_WIDTH = 194;
const VIEW_HEIGHT = 93;

export default function TransitMap({ marker }) {
  const cx = marker?.x ?? 255;
  const cy = marker?.y ?? 130;
  const viewBox = `${cx - VIEW_WIDTH / 2} ${cy - VIEW_HEIGHT / 2} ${VIEW_WIDTH} ${VIEW_HEIGHT}`;

  return (
    <svg
      aria-label="Peta koridor perjalanan armada"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      style={{ transition: "viewBox 1200ms ease-in-out" }}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          height="25"
          id="logistics-grid-transit"
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
      <rect fill="url(#logistics-grid-transit)" height="100%" width="100%" />

      {/* Pesisir Laut Jawa */}
      <path
        d="M-20,35 Q140,55 240,25 T460,15 T520,30"
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
        y="28"
      >
        Pesisir Laut Jawa (Pantura)
      </text>

      {/* Pelabuhan Cirebon */}
      <rect
        fill="#e2e8f0"
        height="50"
        opacity="0.4"
        rx="6"
        width="125"
        x="310"
        y="50"
      />
      <text
        fill="#64748b"
        fontFamily="Plus Jakarta Sans"
        fontSize="8"
        fontWeight="700"
        x="320"
        y="64"
      >
        PELABUHAN CIREBON
      </text>

      {/* Interchange Palimanan */}
      <rect
        fill="#e2e8f0"
        height="55"
        opacity="0.4"
        rx="6"
        width="115"
        x="45"
        y="165"
      />
      <text
        fill="#64748b"
        fontFamily="Plus Jakarta Sans"
        fontSize="8"
        fontWeight="700"
        x="53"
        y="178"
      >
        INTERCHANGE PALIMANAN
      </text>

      {/* Jalur utama */}
      <path
        d="M0,190 L140,175 L255,130 L410,100 L520,95"
        fill="none"
        stroke="#94a3b8"
        strokeLinecap="round"
        strokeWidth="9"
      />
      <path
        d="M0,190 L140,175 L255,130 L410,100 L520,95"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="5"
      />

      <path
        d="M255,0 L255,130 L280,240"
        fill="none"
        stroke="#cbd5e1"
        strokeLinecap="round"
        strokeWidth="7"
      />
      <path
        d="M255,0 L255,130 L280,240"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="3.5"
      />

      {/* Nama jalur */}
      <text
        fill="#334155"
        fontFamily="Plus Jakarta Sans"
        fontSize="8.5"
        fontWeight="700"
        x="285"
        y="122"
      >
        Tol Cikopo - Palimanan (Cipali)
      </text>
      <text
        fill="#475569"
        fontFamily="Plus Jakarta Sans"
        fontSize="8"
        fontWeight="600"
        x="20"
        y="170"
      >
        Jl. Raya Fatahillah
      </text>

      {/* Titik transit Cirebon */}
      <circle
        className="animate-pulse"
        cx="255"
        cy="130"
        fill="#b30069"
        fillOpacity="0.15"
        r="34"
      />
      <circle cx="255" cy="130" fill="#b30069" fillOpacity="0.25" r="20" />

      {/* Penanda armada yang bergerak */}
      <g
        style={{
          transform: `translate(${marker?.x ?? 255}px, ${marker?.y ?? 130}px)`,
          transition: "transform 1200ms ease-in-out",
        }}
      >
        <circle cx="0" cy="0" fill="#b30069" fillOpacity="0.28" r="16" />
        <circle
          cx="0"
          cy="0"
          fill="#ffffff"
          r="9"
          stroke="#b30069"
          strokeWidth="1.5"
        />
        <circle cx="0" cy="0" fill="#b30069" r="5" />
      </g>
    </svg>
  );
}
