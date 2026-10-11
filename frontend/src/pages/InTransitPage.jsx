import { useSearchParams } from "react-router-dom";
import TrackingStatusLayout from "../components/tracking/TrackingStatusLayout";
import { IN_TRANSIT_DATA } from "../data/inTransitData";
import { useTrackingDetail, mergeShipmentData } from "../hooks/useTrackingDetail";
import TrackingLoadingState from "../components/tracking/TrackingLoadingState";

export default function InTransitView() {
  const [searchParams] = useSearchParams();
  const waybill = searchParams.get("waybill_number") || IN_TRANSIT_DATA.waybill;

  const { data: apiData, loading, error } = useTrackingDetail(waybill);

  if (error && !apiData) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  const mergedData = mergeShipmentData(IN_TRANSIT_DATA, apiData);

  return (
    <main className="min-h-[calc(100vh-20rem)] w-full bg-surface relative">
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20 overflow-hidden">
          <div className="h-full bg-primary animate-pulse w-full" />
        </div>
      )}
      <div className="flex w-full flex-col">
        <TrackingStatusLayout data={mergedData} />
      </div>
    </main>
  );
}
