import AssistantNarrative from "./AssistantNarrative";
import CourierCard from "./CourierCard";
import JourneyNotes from "./JourneyNotes";
import LivePositionCard from "./LivePositionCard";
import MilestoneProgress from "./MilestoneProgress";
import PackageDetailCard from "./PackageDetailCard";
import StatusBanner from "./StatusBanner";
import TrackingSearchBar from "./TrackingSearchBar";

/**
 * Kerangka halaman status pelacakan — dipakai bersama oleh semua status
 * (mis. "Pesanan Dibuat", "Sedang Diproses Kurir").
 *
 * Susunan:
 *   Hero + kolom resi
 *   Banner status
 *   Grid 12 kolom:
 *     kiri (8)  : narasi Satria Assistant + progres + catatan perjalanan
 *     kanan (4) : rincian paket, radar posisi, kurir bertugas
 *
 * Isi tiap bagian datang dari objek `data` masing-masing status.
 */
export default function TrackingStatusLayout({ data }) {
  return (
    <section className="relative mx-auto w-full max-w-[1200px] px-margin py-space-lg md:px-margin-tablet lg:px-margin-desktop">
      {/* Judul halaman */}
      <div className="mb-space-xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
        <div className="flex flex-col gap-space-xs">
          <div className="inline-flex w-fit items-center gap-space-xs rounded-full bg-ai-surface px-3 py-1 shadow-sm">
            <span className="material-symbols-outlined text-[18px] text-ai-accent">
              auto_awesome
            </span>
            <span className="font-label-sm text-label-sm font-bold uppercase tracking-wide text-ai-accent">
              AI-Powered Tracking Diagnostics
            </span>
          </div>
          <h1 className="font-headline-xl text-[28px] font-extrabold leading-9 tracking-tight text-on-surface sm:text-headline-xl sm:leading-[44px]">
            Lacak Pengiriman Smart AI
          </h1>
          <p className="max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
            Pantau status paket real-time dengan asisten pintar Satria AI,
            akurasi rute dinamis, dan jaminan estimasi waktu terpercaya.
          </p>
        </div>
      </div>

      {/* Kolom pencarian resi */}
      <TrackingSearchBar initialWaybill={data.waybill} />

      <div className="flex w-full flex-col gap-space-lg">
        <StatusBanner status={data.status} />

        <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
          {/* Kolom kiri */}
          <div className="flex h-full flex-col gap-space-lg lg:col-span-8">
            <AssistantNarrative
              assistant={data.assistant}
              statusLabel={data.status.label}
              waybill={data.waybill}
            />

            <div className="flex flex-1 flex-col rounded-2xl bg-surface-container-lowest p-space-lg shadow-lg">
              <MilestoneProgress
                milestones={data.milestones}
                updatedLabel={data.updatedLabel}
              />
              <JourneyNotes journey={data.journey} />
            </div>
          </div>

          {/* Kolom kanan */}
          <div className="flex flex-col gap-space-lg lg:col-span-4">
            <PackageDetailCard data={data} />
            <LivePositionCard radar={data.radar} />
            <CourierCard courier={data.courier} />
          </div>
        </div>
      </div>
    </section>
  );
}
