import { useEffect, useState } from "react";
import AINarrativeBox from "../components/AINarrativeBox";
import DynamicETABadge from "../components/DynamicETABadge";
import OperationalWarningBanner from "../components/OperationalWarningBanner";
import ShipmentForm from "../components/ShipmentForm";
import ShipmentList from "../components/ShipmentList";
import ShipmentSummary from "../components/ShipmentSummary";
import ShippingCalculator from "../components/ShippingCalculator";
import VisualMilestoneStepper from "../components/VisualMilestoneStepper";
import { mockShipments } from "../data/mockShipments";

export default function SmartWidgetPage() {
  const [shipments] = useState(mockShipments);
  const [activeShipment, setActiveShipment] = useState(mockShipments[0]);
  const [searchQuery, setSearchQuery] = useState(
    mockShipments[0].waybill_number,
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userName, setUserName] = useState("Asep");

  useEffect(() => {
    const storedName = window.sessionStorage.getItem("activeUser");
    if (storedName) {
      setUserName(storedName);
      return;
    }
    window.sessionStorage.setItem("activeUser", "Asep");
  }, []);

  function handleSearch(waybill) {
    const normalizedWaybill = waybill.trim();
    setSearchQuery(normalizedWaybill);
    setLoading(true);
    setErrorMessage("");

    window.setTimeout(() => {
      const match = shipments.find(
        (shipment) =>
          shipment.waybill_number.toLowerCase() ===
          normalizedWaybill.toLowerCase(),
      );

      if (match) {
        setActiveShipment(match);
        setStatusFilter("all");
        document
          .getElementById("widget-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        setErrorMessage(
          "Nomor resi belum ditemukan. Periksa kembali nomor yang dimasukkan.",
        );
      }

      setLoading(false);
    }, 450);
  }

  function handleSelectShipment(waybill) {
    const match = shipments.find(
      (shipment) => shipment.waybill_number === waybill,
    );
    if (!match) return;

    setActiveShipment(match);
    setSearchQuery(match.waybill_number);
    setErrorMessage("");
  }

  return (
    <div className="min-h-full bg-[#fcf9f8] text-[#29232a]">
      <div className="mx-auto max-w-[1240px] space-y-5 px-4 py-7 sm:px-8 sm:py-10">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-violet-700">
              <span aria-hidden="true">✦</span> Smart logistics · informasi
              lebih jelas
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-.04em] text-[#29232a] sm:text-4xl">
              Lacak kiriman dengan tenang.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#777079]">
              Pantau progres paket, pahami pembaruan operasional, dan lihat
              perkiraan waktu tiba dalam satu halaman.
            </p>
          </div>
          <p className="flex items-center gap-2 self-start rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-xs font-semibold text-emerald-800 sm:self-auto">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-emerald-500"
            />
            Satria Assistant siap membantu, {userName}.
          </p>
        </section>

        <ShipmentForm
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          loading={loading}
          errorMessage={errorMessage}
        />

        <section
          id="widget-results"
          aria-label="Hasil pelacakan terpilih"
          className="scroll-mt-24 space-y-4"
        >
          <DynamicETABadge shipment={activeShipment} />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              <OperationalWarningBanner shipment={activeShipment} />
              <AINarrativeBox shipment={activeShipment} />
              <VisualMilestoneStepper shipment={activeShipment} />
              <ShipmentList
                shipments={shipments}
                activeWaybill={activeShipment.waybill_number}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onSelect={handleSelectShipment}
              />
            </div>
            <aside
              className="space-y-4"
              aria-label="Informasi tambahan pengiriman"
            >
              <ShipmentSummary shipment={activeShipment} />
              <ShippingCalculator />
              <section className="rounded-3xl bg-gradient-to-br from-[#e20074] to-[#9c0058] p-5 text-white shadow-lg shadow-pink-200">
                <p className="text-[10px] font-bold uppercase tracking-[.17em] text-pink-100">
                  Butuh bantuan?
                </p>
                <h2 className="mt-1 text-lg font-extrabold">
                  Kami siap membantu.
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-pink-50">
                  Siapkan nomor resi, lalu hubungi layanan bantuan Anteraja
                  untuk menanyakan status kiriman.
                </p>
                <a
                  href="mailto:cs@anteraja.id"
                  className="mt-4 inline-flex rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-[#b30069] transition hover:bg-pink-50"
                >
                  Hubungi bantuan{" "}
                  <span aria-hidden="true" className="ml-2">
                    →
                  </span>
                </a>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
