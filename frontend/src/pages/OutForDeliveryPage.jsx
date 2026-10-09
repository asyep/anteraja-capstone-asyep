import { useSearchParams } from "react-router-dom";
import TrackingStatusLayout from "../components/tracking/TrackingStatusLayout";
import { OUT_FOR_DELIVERY_DATA } from "../data/outForDeliveryData";
import { useTrackingDetail, mergeShipmentData } from "../hooks/useTrackingDetail";
import TrackingLoadingState from "../components/tracking/TrackingLoadingState";

export default function OutForDeliveryView() {
  const [searchParams] = useSearchParams();
  const waybill = searchParams.get("waybill_number") || OUT_FOR_DELIVERY_DATA.waybill;

  const { data: apiData, loading, error } = useTrackingDetail(waybill);

  if (loading) return <TrackingLoadingState waybill={waybill} />;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  const mergedData = mergeShipmentData(OUT_FOR_DELIVERY_DATA, apiData);

  return (
    <main className="min-h-[calc(100vh-20rem)] w-full bg-surface">
      <div className="flex w-full flex-col">
        <TrackingStatusLayout data={mergedData} />
      </div>
    </main>
  );
}
