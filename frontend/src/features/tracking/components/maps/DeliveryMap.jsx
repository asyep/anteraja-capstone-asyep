/**
 * Peta kawasan Tebet (Jakarta Selatan) untuk status "Dalam Pengantaran".
 *
 * Menampilkan rute kurir dari titik awal menuju alamat penerima. `marker`
 * adalah posisi kurir dalam koordinat viewBox peta dan dianimasikan halus
 * sehingga terlihat bergerak menuju tujuan.
 */
export default function DeliveryMap({ marker, tujuan }) {
  const mx = marker?.x ?? 240;
  const my = marker?.y ?? 140;

  return (
    <svg
      aria-label="Peta rute kurir menuju alamat penerima"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      viewBox="0 0 500 240"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          height="25"
          id="logistics-grid-tebet"
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
      <rect fill="url(#logistics-grid-tebet)" height="100%" width="100%" />

      {/* Taman Tebet Eco Park */}
      <rect
        fill="#dcfce7"
        height="55"
        opacity="0.5"
        rx="6"
        width="90"
        x="30"
        y="30"
      />
      <text
        fill="#15803d"
        fontFamily="Plus Jakarta Sans"
        fontSize="8"
        fontWeight="700"
        x="38"
        y="58"
      >
        TAMAN TEBET ECO
      </text>

      {/* Stasiun Tebet */}
      <rect
        fill="#e2e8f0"
        height="45"
        opacity="0.6"
        rx="6"
        width="110"
        x="350"
        y="160"
      />
      <text
        fill="#64748b"
        fontFamily="Plus Jakarta Sans"
        fontSize="8"
        fontWeight="700"
        x="360"
        y="185"
      >
        STASIUN TEBET
      </text>

      {/* Jalan utama */}
      <path
        d="M20,120 L150,120 L240,140 L380,80 L480,80"
        fill="none"
        stroke="#cbd5e1"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <path
        d="M150,20 L150,220"
        fill="none"
        stroke="#cbd5e1"
        strokeLinecap="round"
        strokeWidth="6"
      />
      <path
        d="M380,20 L380,220"
        fill="none"
        stroke="#cbd5e1"
        strokeLinecap="round"
        strokeWidth="6"
      />

      {/* Rute kurir menuju tujuan */}
      <path
        d="M240,140 L320,140 L320,60"
        fill="none"
        stroke="#b30069"
        strokeDasharray="4 4"
        strokeLinecap="round"
        strokeWidth="3.5"
      />

      <text
        fill="#475569"
        fontFamily="Plus Jakarta Sans"
        fontSize="8.5"
        fontWeight="700"
        x="165"
        y="110"
      >
        Jl. Tebet Barat Dalam Raya
      </text>
      <text
        fill="#1b8700"
        fontFamily="Plus Jakarta Sans"
        fontSize="8.5"
        fontWeight="700"
        x="330"
        y="55"
      >
        Tujuan: {tujuan}
      </text>

      {/* Titik tujuan (alamat penerima) */}
      <circle cx="320" cy="60" fill="#1b8700" r="6" />
      <circle
        cx="320"
        cy="60"
        fill="none"
        r="12"
        stroke="#1b8700"
        strokeWidth="1.5"
      />

      {/* Jejak posisi kurir sebelumnya */}
      <circle cx={mx} cy={my} fill="#b30069" fillOpacity="0.2" r="28" />
      <circle cx={mx} cy={my} fill="#b30069" fillOpacity="0.35" r="16" />

      {/* Penanda kurir yang bergerak */}
      <g
        style={{
          transform: `translate(${mx}px, ${my}px)`,
          transition: "transform 1200ms ease-in-out",
        }}
      >
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
