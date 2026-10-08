import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchShipment } from "../services/api";
import { getRouteForScenario } from "../data/shipmentsData";
import { errorRoute } from "../hooks/useTrackingDetail";
import TrackingLoadingState from "../components/tracking/TrackingLoadingState";

/**
 * /cek-resi?waybill_number=… — memanggil API lalu meneruskan pengguna ke
 * halaman tracking yang sesuai dengan skenario kiriman.
 */
export default function TrackingResolverPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const waybill = searchParams.get("waybill_number")?.trim() ?? "";

  useEffect(() => {
    let active = true;
    fetchShipment(waybill)
      .then((shipment) => {
        if (active) {
          navigate(getRouteForScenario(shipment.scenario, shipment.waybill_number), { replace: true });
        }
      })
      .catch((error) => {
        if (active && error.name !== "AbortError") {
          navigate(errorRoute(error, waybill), { replace: true });
        }
      });
    return () => {
      active = false;
    };
  }, [waybill, navigate]);

  return <TrackingLoadingState waybill={waybill} />;
}
