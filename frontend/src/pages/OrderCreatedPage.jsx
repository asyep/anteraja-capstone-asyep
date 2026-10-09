import { useSearchParams } from "react-router-dom";
import TrackingStatusLayout from "../components/tracking/TrackingStatusLayout";
import { ORDER_CREATED_DATA } from "../data/orderCreatedData";
import { useTrackingDetail, mergeShipmentData } from "../hooks/useTrackingDetail";
import TrackingLoadingState from "../components/tracking/TrackingLoadingState";

export default function OrderCreatedView() {
  const [searchParams] = useSearchParams();
  const waybill = searchParams.get("waybill_number") || ORDER_CREATED_DATA.waybill;

  const { data: apiData, loading, error } = useTrackingDetail(waybill);

  if (loading) return <TrackingLoadingState waybill={waybill} />;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  const mergedData = mergeShipmentData(ORDER_CREATED_DATA, apiData);

  return (
    <main className="min-h-[calc(100vh-20rem)] w-full bg-surface">
      <div className="flex w-full flex-col">
        <TrackingStatusLayout data={mergedData} />
      </div>
    </main>
  );
}
