/**
 * Peta lokasi penyerahan paket (titik akhir pengantaran).
 *
 * Berbeda dari DeliveryMap yang menampilkan kurir bergerak, peta ini
 * menampilkan titik tujuan akhir: paket sudah diterima di alamat penerima.
 */
export default function DeliveredMap() {
  return (
    <svg
      aria-label="Peta lokasi penyerahan paket di alamat penerima"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      viewBox="0 0 500 240"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          height="25"
          id="logistics-grid-tebet-done"
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
      <rect fill="url(#logistics-grid-tebet-done)" height="100%" width="100%" />

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

      {/* Rute yang sudah dilalui (selesai, garis penuh hijau) */}
      <path
        d="M240,140 L320,140 L320,60"
        fill="none"
        stroke="#10B981"
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

      {/* Titik penyerahan */}
      <circle cx="320" cy="60" fill="#10B981" fillOpacity="0.2" r="24" />
      <circle
        cx="320"
        cy="60"
        fill="#10B981"
        r="10"
        stroke="#ffffff"
        strokeWidth="2.5"
      />
    </svg>
  );
}
