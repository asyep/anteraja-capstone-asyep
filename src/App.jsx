import { useEffect, useMemo, useState } from 'react';
import AINarrativeBox from './components/AINarrativeBox.jsx';
import DynamicETABadge from './components/DynamicETABadge.jsx';
import OperationalWarningBanner from './components/OperationalWarningBanner.jsx';
import ShipmentForm from './components/ShipmentForm.jsx';
import ShipmentList from './components/ShipmentList.jsx';
import ShipmentSummary from './components/ShipmentSummary.jsx';
import ShippingCalculator from './components/ShippingCalculator.jsx';
import TrackingHeader from './components/TrackingHeader.jsx';
import VisualMilestoneStepper from './components/VisualMilestoneStepper.jsx';
import shipments from './data/mockShipments.js';

export default function App() {
  const [shipmentData] = useState(() => shipments);
  const [activeWaybill, setActiveWaybill] = useState(shipments[0].waybill_number);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [audience, setAudience] = useState('B2C');
  const [activeUser, setActiveUser] = useState('Asep');
  const activeShipment = useMemo(() => shipmentData.find((item) => item.waybill_number === activeWaybill) ?? shipmentData[0], [activeWaybill, shipmentData]);

  useEffect(() => {
    const storedUser = window.sessionStorage.getItem('activeUser');
    if (storedUser) setActiveUser(storedUser);
    else window.sessionStorage.setItem('activeUser', 'Asep');
  }, []);

  const handleSearch = (waybill) => {
    setLoading(true);
    setErrorMessage('');
    window.setTimeout(() => {
      const result = shipmentData.find((item) => item.waybill_number.toLowerCase() === waybill.toLowerCase());
      if (result) {
        setActiveWaybill(result.waybill_number);
        setFilter('all');
        document.getElementById('hasil-pelacakan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        setErrorMessage('Nomor resi belum ditemukan. Periksa kembali nomor yang dimasukkan.');
      }
      setLoading(false);
    }, 450);
  };

  const handleSelectShipment = (waybill) => {
    setActiveWaybill(waybill);
    setErrorMessage('');
  };

  return (
    <div id="beranda" className="min-h-screen bg-canvas text-ink">
      <TrackingHeader audience={audience} onAudienceChange={setAudience} activeUser={activeUser} />
      <main className="mx-auto max-w-[1240px] px-4 pb-12 pt-7 sm:px-8 sm:pt-10">
        <section className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-violet-700">✦ Smart logistics · informasi lebih jelas</p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-.04em] text-ink sm:text-4xl">Lacak kiriman dengan tenang.</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">Pantau progres paket, pahami pembaruan operasional, dan lihat perkiraan waktu tiba dalam satu halaman.</p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-xs font-semibold text-emerald-800 sm:self-auto"><span className="size-2 rounded-full bg-success" aria-hidden="true" />Demo pelacakan siap</div>
        </section>

        <ShipmentForm onSearch={handleSearch} loading={loading} initialValue={activeWaybill} errorMessage={errorMessage} />

        <section id="hasil-pelacakan" aria-label="Hasil pelacakan terpilih" className="mt-5 scroll-mt-24 space-y-4">
          <DynamicETABadge shipment={activeShipment} />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              <OperationalWarningBanner shipment={activeShipment} />
              <AINarrativeBox shipment={activeShipment} />
              <VisualMilestoneStepper shipment={activeShipment} />
              <ShipmentList shipments={shipmentData} activeWaybill={activeWaybill} onSelect={handleSelectShipment} filter={filter} onFilterChange={setFilter} />
            </div>
            <aside className="space-y-4" aria-label="Informasi tambahan pengiriman">
              <ShipmentSummary shipment={activeShipment} />
              <ShippingCalculator />
              <section id="bantuan" className="rounded-3xl bg-gradient-to-br from-brand to-[#9c0058] p-5 text-white shadow-lg shadow-pink-200"><p className="text-[10px] font-bold uppercase tracking-[.17em] text-pink-100">Butuh bantuan?</p><h2 className="mt-1 text-lg font-extrabold">Kami siap membantu.</h2><p className="mt-2 text-xs leading-relaxed text-pink-50">Jika informasi kiriman belum sesuai, hubungi layanan bantuan Anteraja dengan menyiapkan nomor resi.</p><a href="mailto:cs@anteraja.id" className="mt-4 inline-flex rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-brand transition hover:bg-pink-50">Hubungi bantuan <span aria-hidden="true" className="ml-2">→</span></a></section>
            </aside>
          </div>
        </section>
      </main>
      <footer className="border-t border-stone-200 bg-white"><div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8"><span><strong className="text-brand">anteraja</strong> · Smart AI Shipment Tracking Widget</span><span>Prototype React · Data simulasi untuk demonstrasi</span></div></footer>
    </div>
  );
}
