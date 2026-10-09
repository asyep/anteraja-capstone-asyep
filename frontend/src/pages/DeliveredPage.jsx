import { useSearchParams } from "react-router-dom";
import TrackingStatusLayout from "../components/tracking/TrackingStatusLayout";
import { DELIVERED_DATA } from "../data/deliveredData";
import { useTrackingDetail, mergeShipmentData } from "../hooks/useTrackingDetail";
import TrackingLoadingState from "../components/tracking/TrackingLoadingState";

export default function DeliveredPage() {
  const [searchParams] = useSearchParams();
  const waybill = searchParams.get("waybill_number") || DELIVERED_DATA.waybill;

  const { data: apiData, loading, error } = useTrackingDetail(waybill);

  if (loading) return <TrackingLoadingState waybill={waybill} />;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  const mergedData = mergeShipmentData(DELIVERED_DATA, apiData);

  return (
    <main className="min-h-[calc(100vh-20rem)] w-full bg-surface">
      <div className="flex w-full flex-col">
        <TrackingStatusLayout data={mergedData} />
      </div>
    </main>
  );
}
