import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchShipment } from "../services/api";
import { useShipmentContext } from "../context/ShipmentContext";
import { getRouteForScenario } from "../data/shipmentsData";
import { loadSamples } from "./useSampleResi";

/** Arahkan error API ke halaman status yang sesuai. */
export function errorRoute(error, waybill) {
  const query = waybill ? `?waybill_number=${encodeURIComponent(waybill)}` : "";
  if (error?.status === 404) return `/not-found${query}`;
  if (error?.status === 422) return `/validation-error${query}`;
  return `/service-error${query}`;
}

/**
 * Muat detail kiriman untuk halaman tracking berdasarkan ?waybill_number=.
 * - Tanpa parameter: gunakan contoh resi dari database untuk skenario halaman.
 * - Bila skenario kiriman tidak cocok dengan halaman, alihkan ke halaman yang benar.
 */
export default function useTrackingDetail(pageScenario) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { recordShipment } = useShipmentContext();
  const queryWaybill = searchParams.get("waybill_number")?.trim() ?? "";

  const [state, setState] = useState({ shipment: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
    setState({ shipment: null, loading: true, error: null });

    async function load() {
      let waybill = queryWaybill;
      try {
        if (!waybill) {
          const { samples } = await loadSamples();
          waybill = samples.find((item) => item.scenario === pageScenario)?.waybill_number;
          if (!waybill) throw Object.assign(new Error("Contoh resi tidak tersedia."), { status: 404 });
        }

        const shipment = await fetchShipment(waybill);
        if (!active) return;

        if (pageScenario && shipment.scenario && shipment.scenario !== pageScenario) {
          navigate(getRouteForScenario(shipment.scenario, shipment.waybill_number), { replace: true });
          return;
        }

        recordShipment(shipment);
        setState({ shipment, loading: false, error: null });
      } catch (error) {
        if (!active || error.name === "AbortError") return;
        navigate(errorRoute(error, waybill), { replace: true });
      }
    }

    load();
    return () => {
      active = false;
    };
    // recordShipment berasal dari context dan berubah tiap render; sengaja tidak dimasukkan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryWaybill, pageScenario, navigate]);

  return state;
}
