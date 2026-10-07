import { useSearchParams } from "react-router-dom";

import TrackingStatusLayout from "@/features/tracking/components/TrackingStatusLayout";
import { IN_TRANSIT_DATA } from "@/features/tracking/data/inTransitData";

/**
 * Halaman status pelacakan: "Dalam Perjalanan".
 *
 * Kondisi ketika paket sedang menempuh perjalanan jarak jauh — dari hub
 * asal menuju hub sortir akhir, belum masuk tahap pengantaran ke penerima.
 *
 * Pada status ini "Radar Posisi Paket" bergerak otomatis mengikuti waypoint
 * rute (lihat data/transitRoutes.js + hooks/useTransitAnimation.js).
 */
export default function InTransitView() {
  const [searchParams] = useSearchParams();
  const waybill = searchParams.get("waybill_number") || IN_TRANSIT_DATA.waybill;

  const data = { ...IN_TRANSIT_DATA, waybill };

  return (
    <main className="min-h-[calc(100vh-20rem)] w-full bg-surface">
      <div className="flex w-full flex-col">
        <TrackingStatusLayout data={data} />
      </div>
    </main>
  );
}
