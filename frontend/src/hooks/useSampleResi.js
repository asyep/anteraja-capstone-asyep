import { useEffect, useState } from "react";
import { fetchShipmentSamples } from "../services/api";
import { SCENARIO_META, getRouteForScenario } from "../data/shipmentsData";

let samplesPromise = null;

/** Ambil contoh resi dari API sekali saja per sesi halaman. */
export function loadSamples() {
  if (!samplesPromise) {
    samplesPromise = fetchShipmentSamples().catch((error) => {
      samplesPromise = null;
      throw error;
    });
  }
  return samplesPromise;
}

/**
 * Contoh resi nyata dari database untuk chip "Uji Coba Resi".
 * Setiap item: { resi, scenario, label, path, badgeClass, dotClass, ... }.
 */
export default function useSampleResi() {
  const [state, setState] = useState({ samples: [], notFoundExample: null, loading: true });

  useEffect(() => {
    let active = true;
    loadSamples()
      .then(({ samples, notFoundExample }) => {
        if (!active) return;
        setState({
          loading: false,
          notFoundExample,
          samples: samples.map((item) => ({
            ...item,
            ...SCENARIO_META[item.scenario],
            resi: item.waybill_number,
            path: getRouteForScenario(item.scenario, item.waybill_number),
          })),
        });
      })
      .catch(() => active && setState((prev) => ({ ...prev, loading: false })));
    return () => {
      active = false;
    };
  }, []);

  return state;
}
