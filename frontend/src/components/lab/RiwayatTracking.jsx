import { useEffect, useState } from "react";
import { API, isPhpApiConfigured } from "../../services/phpApi";

export default function RiwayatTracking() {
  const [riwayat, setRiwayat] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPhpApiConfigured) return;

    async function ambilRiwayat() {
      try {
        const response = await fetch(`${API}/shipment-history.php`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.pesan || "Riwayat tidak dapat dimuat.");
        }

        setRiwayat(data);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    ambilRiwayat();
  }, []);

  if (!isPhpApiConfigured) {
    return <p className="text-sm text-slate-500">Atur VITE_API_URL untuk memuat data PHP.</p>;
  }

  if (error) {
    return <p className="text-sm text-rose-600">{error}</p>;
  }

  if (riwayat.length === 0) {
    return <p className="text-sm text-slate-500">Memuat riwayat dari PHP...</p>;
  }

  return (
    <ul className="space-y-2" aria-label="Riwayat tracking dari PHP">
      {riwayat.map((langkah) => (
        <li key={langkah.jam} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <strong className="mr-2 text-slate-950">{langkah.jam}</strong>
          {langkah.pesan}
        </li>
      ))}
    </ul>
  );
}
