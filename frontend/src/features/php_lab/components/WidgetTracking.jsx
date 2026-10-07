import { useState } from "react";
import { API, isPhpApiConfigured } from "@/shared/lib/phpApi";

export default function WidgetTracking() {
  const [resi, setResi] = useState("1000849201994");
  const [widget, setWidget] = useState(null);
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

  async function bukaWidget(event) {
    event.preventDefault();
    setPesan("");

    if (!isPhpApiConfigured) {
      setPesan("Atur VITE_API_URL terlebih dahulu agar React dapat menghubungi PHP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/tracking.php?resi=${encodeURIComponent(resi.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.pesan || "Widget tracking tidak dapat dibuka.");
      }

      setWidget(data);
    } catch (requestError) {
      setPesan(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function kirimFeedback(membantu) {
    if (!isPhpApiConfigured) {
      setPesan("Atur VITE_API_URL terlebih dahulu agar feedback dapat dikirim.");
      return;
    }

    try {
      const response = await fetch(`${API}/feedback.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resi: resi.trim(), membantu }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.pesan || "Feedback tidak dapat dikirim.");
      }

      setPesan(data.pesan);
    } catch (requestError) {
      setPesan(requestError.message);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={bukaWidget}>
        <label className="sr-only" htmlFor="php-waybill">
          Nomor resi
        </label>
        <input
          id="php-waybill"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
          value={resi}
          onChange={(event) => setResi(event.target.value)}
          placeholder="Masukkan nomor resi"
        />
        <button className="rounded-xl bg-[#c80070] px-5 py-3 text-sm font-bold text-white" disabled={loading} type="submit">
          {loading ? "Memuat..." : "Buka widget"}
        </button>
      </form>

      {pesan && <p className="mt-3 text-sm text-slate-600">{pesan}</p>}

      {widget && (
        <div className="mt-5">
          <h3 className="text-base font-bold text-slate-950">Resi {widget.resi}</h3>
          <ul className="mt-3 space-y-2">
            {widget.riwayat.map((langkah) => (
              <li key={langkah.jam} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <strong className="mr-2 text-slate-950">{langkah.jam}</strong>
                {langkah.pesan}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800" onClick={() => kirimFeedback(true)} type="button">
              Membantu
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700" onClick={() => kirimFeedback(false)} type="button">
              Kurang jelas
            </button>
            <a
              className="rounded-lg border border-pink-200 px-3 py-2 text-sm font-semibold text-[#c80070]"
              href={`${API}/tracking-download.php?resi=${encodeURIComponent(widget.resi)}`}
            >
              Unduh bukti tracking
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
