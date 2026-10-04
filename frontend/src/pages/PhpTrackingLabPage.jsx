import RiwayatTracking from "../components/lab/RiwayatTracking";
import WidgetTracking from "../components/lab/WidgetTracking";
import KalkulatorOngkirModul from "../components/lab/KalkulatorOngkirModul";
import { API, isPhpApiConfigured } from "../services/phpApi";

export default function PhpTrackingLabPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
      <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#c80070]">Modul PHP · Asep</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Penerjemah Status Resi</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Latihan ini mengambil data dari endpoint PHP, menerjemahkan status teknis menjadi pesan pelanggan, lalu mengirim feedback tanpa mengubah tampilan tracking utama.
        </p>
        {isPhpApiConfigured && (
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={`${API}/shipment-form.html`} target="_blank" rel="noreferrer" className="rounded-xl bg-[#c80070] px-4 py-2 text-sm font-bold text-white">Day 12 · Buat permintaan</a>
            <a href={`${API}/request-history.php`} target="_blank" rel="noreferrer" className="rounded-xl border border-pink-200 px-4 py-2 text-sm font-bold text-[#a0005b]">Riwayat permintaan</a>
          </div>
        )}
      </div>

      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-lg font-bold text-slate-950">Project Asep · Kalkulator margin ongkir</h2>
        <p className="mb-4 mt-1 text-sm text-slate-500">Hitung berat volumetrik, bandingkan margin layanan, dan pilih rekomendasi berdasarkan batas margin minimum.</p>
        <KalkulatorOngkirModul />
      </section>

      <div className="mt-7 grid gap-7 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Hari 1 · Riwayat JSON</h2>
          <p className="mt-1 text-sm text-slate-500">Endpoint `shipment-history.php` memakai function `statusRamah()`.</p>
          <div className="mt-4">
            <RiwayatTracking />
          </div>
        </section>

        <section>
          <h2 className="mb-1 text-lg font-bold text-slate-950">Hari 2 · TrackingWidget dan feedback</h2>
          <p className="mb-4 text-sm text-slate-500">Endpoint `tracking.php` memakai class, lalu `feedback.php` menerima POST dari React.</p>
          <WidgetTracking />
        </section>
      </div>
    </section>
  );
}
