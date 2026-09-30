import { useState } from "react";

const SERVICES = {
  reguler: { label: "Reguler", rate: 10000, days: 3 },
  nextday: { label: "NextDay", rate: 15000, days: 1 },
  sameday: { label: "SameDay", rate: 25000, days: 0 },
};

export default function ShippingCalculator() {
  const [weight, setWeight] = useState("1");
  const [service, setService] = useState("reguler");
  const numericWeight = Math.max(0, Number(weight) || 0);
  const price = Math.round(numericWeight * SERVICES[service].rate);
  const eta = new Date();
  eta.setDate(eta.getDate() + SERVICES[service].days);
  const etaText =
    SERVICES[service].days === 0
      ? "Hari ini"
      : new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(eta);
  const priceText = `Rp ${price.toLocaleString("id-ID")}`;

  return (
    <section
      aria-labelledby="calculator-title"
      className="rounded-3xl border border-stone-100 bg-white p-5 shadow-[0_14px_40px_-34px_rgba(54,28,80,.3)]"
    >
      <p className="text-[10px] font-bold uppercase tracking-[.17em] text-brand">
        Transparansi biaya
      </p>
      <h2
        id="calculator-title"
        className="mt-1 text-lg font-extrabold text-ink"
      >
        Kalkulator ongkir
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <label
            htmlFor="input-weight"
            className="mb-1 block text-xs font-bold text-stone-600"
          >
            Berat paket (kg)
          </label>
          <input
            id="input-weight"
            type="number"
            min="0.1"
            step="0.1"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label
            htmlFor="select-service"
            className="mb-1 block text-xs font-bold text-stone-600"
          >
            Jenis layanan
          </label>
          <select
            id="select-service"
            value={service}
            onChange={(event) => setService(event.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-brand"
          >
            {Object.entries(SERVICES).map(([value, data]) => (
              <option key={value} value={value}>
                {data.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-stone-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted">Estimasi ongkir</span>
          <strong className="text-base text-brand" aria-live="polite">
            {priceText}
          </strong>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 border-t border-stone-200 pt-2">
          <span className="text-xs text-muted">Perkiraan tiba</span>
          <strong className="text-right text-xs text-ink">{etaText}</strong>
        </div>
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-stone-400">
        Tarif demo per kilogram. Biaya sebenarnya dapat bergantung pada rute,
        dimensi, dan kebijakan layanan.
      </p>
    </section>
  );
}
