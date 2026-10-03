import { useState } from "react";
import { API, isPhpApiConfigured } from "../../services/phpApi";

const INITIAL_FORM = { berat: 1.2, p: 30, l: 20, t: 15, harga: 120000, modal: 70000, marginMin: 15, batasOngkir: "", preferensi: "tercepat", asuransiPersen: 0, biayaTambahan: 0, pembagiVolume: 6000 };
const HISTORY_KEY = "anteraja-kalkulator-ongkir-riwayat";

function readHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); }
  catch { return []; }
}

export default function KalkulatorOngkirModul() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [hasil, setHasil] = useState(null);
  const [rekomendasi, setRekomendasi] = useState(null);
  const [sudahRekomendasi, setSudahRekomendasi] = useState(false);
  const [error, setError] = useState("");
  const [riwayat, setRiwayat] = useState(readHistory);

  async function hitung(event) {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API}/hari1.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(Object.entries(form).map(([key, value]) => [key, Number(value)]))),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.pesan || "Kalkulasi gagal.");
      setHasil(data);
      const item = { dibuat: new Date().toISOString(), input: form, hasil: data };
      const terbaru = [item, ...readHistory()].slice(0, 20);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(terbaru));
      setRiwayat(terbaru);
      setRekomendasi(null);
      setSudahRekomendasi(false);
    } catch (requestError) { setError(requestError.message); }
  }

  async function cariRekomendasi() {
    setError("");
    try {
      const response = await fetch(`${API}/hari2.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(Object.entries(form).map(([key, value]) => [key, Number(value)]))),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.pesan || "Rekomendasi gagal dibuat.");
      setRekomendasi(data.rekomendasi);
      setSudahRekomendasi(true);
    } catch (requestError) { setError(requestError.message); }
  }

  function unduhCsv() {
    const json = JSON.stringify({ ...form, batasOngkir: "" });
    const encoded = btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    window.location.href = `${API}/hari1.php?aksi=unduh&data=${encodeURIComponent(encoded)}`;
  }

  function linkWhatsApp() {
    if (!hasil) return "#";
    const pesan = `Perbandingan ongkir Anteraja (berat tagih ${hasil.beratDitagih} kg): ${hasil.layanan.map((item) => `${item.nama} ${new Intl.NumberFormat("id-ID").format(item.ongkir)} (${item.margin}%)`).join("; ")}`;
    return `https://wa.me/?text=${encodeURIComponent(pesan)}`;
  }

  function hapusRiwayat() {
    localStorage.removeItem(HISTORY_KEY);
    setRiwayat([]);
  }

  if (!isPhpApiConfigured) return <p className="text-sm text-slate-500">Atur VITE_PHP_API_URL untuk mencoba kalkulator PHP.</p>;

  const fields = [
    ["berat", "Berat aktual (kg)"], ["p", "Panjang (cm)"], ["l", "Lebar (cm)"],
    ["t", "Tinggi (cm)"], ["harga", "Harga jual (Rp)"], ["modal", "Modal produk (Rp)"],
    ["marginMin", "Margin minimum (%)"], ["batasOngkir", "Batas ongkir maksimum (opsional)"],
    ["asuransiPersen", "Asuransi (%)"], ["biayaTambahan", "Biaya tambahan (Rp)"],
    ["pembagiVolume", "Pembagi volumetrik"],
  ];

  return (
    <div className="space-y-4">
      <form onSubmit={hitung} className="grid gap-3 sm:grid-cols-2">
        {fields.map(([name, label]) => <label key={name} className="space-y-1 text-sm text-slate-600">{label}<input required={!['batasOngkir'].includes(name)} min="0" max={name === 'asuransiPersen' ? 100 : undefined} step="any" type="number" value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900" /></label>)}
        <label className="space-y-1 text-sm text-slate-600">Prioritas rekomendasi<select value={form.preferensi} onChange={(event) => setForm({ ...form, preferensi: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"><option value="tercepat">Tercepat</option><option value="termurah">Termurah</option><option value="margin">Margin tertinggi</option></select></label>
        <button className="rounded-xl bg-[#c80070] px-4 py-2 font-semibold text-white sm:col-span-2">Hitung margin ongkir</button>
      </form>
      {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
      {hasil && <div className="space-y-3 text-sm text-slate-700">
        <p>Berat yang ditagih: <strong>{hasil.beratDitagih} kg</strong></p>
        <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr><th className="py-2">Layanan</th><th>Ongkir</th><th>Margin</th><th>Estimasi</th></tr></thead><tbody>{hasil.layanan.map((layanan) => <tr key={layanan.nama} className="border-t border-slate-100"><td className="py-2">{layanan.nama}{Object.entries(hasil.label || {}).filter(([, nama]) => nama === layanan.nama).map(([label]) => <span key={label} className="ml-2 rounded bg-pink-50 px-2 py-0.5 text-xs text-pink-700">{{termurah:"Termurah",tercepat:"Tercepat",marginTerbaik:"Margin terbaik"}[label]}</span>)}</td><td>Rp {layanan.ongkir.toLocaleString("id-ID")}</td><td className={layanan.margin < 0 ? "text-red-600" : ""}>{layanan.margin}%</td><td>{layanan.hari === 0 ? "Hari ini" : `${layanan.hari} hari`}</td></tr>)}</tbody></table></div>
        <button type="button" onClick={unduhCsv} className="rounded-xl border border-slate-300 px-4 py-2 font-semibold">Unduh hasil CSV</button>
        <a href={linkWhatsApp()} target="_blank" rel="noreferrer" className="ml-2 inline-block rounded-xl border border-green-600 px-4 py-2 font-semibold text-green-700">Bagikan ringkasan WhatsApp</a>
        <button type="button" onClick={cariRekomendasi} className="rounded-xl border border-[#c80070] px-4 py-2 font-semibold text-[#c80070]">Rekomendasikan layanan</button>
        {sudahRekomendasi && <p className="rounded-xl bg-pink-50 p-3">Rekomendasi dengan margin minimum {form.marginMin}%: <strong>{rekomendasi?.nama ?? "Tidak ada layanan yang memenuhi"}</strong>{rekomendasi && ` (${rekomendasi.hari} hari, margin ${rekomendasi.margin}%)`}</p>}
      </div>}
      {riwayat.length > 0 && <section className="border-t border-slate-100 pt-4 text-sm"><div className="flex items-center justify-between"><h3 className="font-bold">Riwayat kalkulasi tersimpan di perangkat ini ({riwayat.length})</h3><button type="button" onClick={hapusRiwayat} className="text-rose-600">Hapus riwayat</button></div><ul className="mt-2 max-h-36 space-y-1 overflow-y-auto text-slate-500">{riwayat.map((item) => <li key={item.dibuat}>{new Date(item.dibuat).toLocaleString("id-ID")} · berat ditagih {item.hasil.beratDitagih} kg</li>)}</ul></section>}
    </div>
  );
}
