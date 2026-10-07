import { useSearchParams } from "react-router-dom";

import TrackingStatusLayout from "@/features/tracking/components/TrackingStatusLayout";
import { DELIVERED_DATA } from "@/features/tracking/data/deliveredData";

export default function DeliveredPage() {
  const [searchParams] = useSearchParams();
  const waybill = searchParams.get("waybill_number") || DELIVERED_DATA.waybill;

  const data = { ...DELIVERED_DATA, waybill };

  return (
    <main className="min-h-[calc(100vh-20rem)] w-full bg-surface">
      <div className="flex w-full flex-col">
        <TrackingStatusLayout data={data} />
      </div>
    </main>
  );
}
