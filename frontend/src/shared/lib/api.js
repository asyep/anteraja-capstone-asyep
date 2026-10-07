import { MILESTONE_STAGES } from "@/shared/lib/constants";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace(/\/$/, "");

function getField(source, ...keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined) return source[key];
  }
  return null;
}

function normalizeStageCode(value) {
  return String(value ?? "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

function normalizeMilestones(source, shipment) {
  const suppliedStages = getField(source, "milestone_stages", "milestones");
  const timestamps = [
    getField(source, "order_purchase_timestamp", "tanggal_pesan"),
    getField(source, "order_delivered_carrier_date", "tiba_carrier"),
    getField(source, "in_transit_timestamp"),
    getField(source, "order_delivered_customer_date", "tiba_pelanggan"),
  ];
  const status = String(shipment.order_status ?? "").toLowerCase();
  const currentCode = normalizeStageCode(
    getField(source, "current_milestone_stage", "current_stage"),
  );
  const delivered = Boolean(timestamps[3]) || status === "delivered";
  const inTransit = ["in_transit", "shipped"].includes(status) || delivered;

  return MILESTONE_STAGES.map((stage, index) => {
    const supplied = Array.isArray(suppliedStages)
      ? suppliedStages.find(
          (item) =>
            normalizeStageCode(item.stage ?? item.code) === stage.code,
        )
      : null;
    const timestamp = supplied?.timestamp ?? timestamps[index] ?? null;
    const suppliedStatus = supplied?.status;
    let stageStatus = suppliedStatus;

    if (!stageStatus && supplied?.completed) stageStatus = "completed";
    if (!stageStatus && (supplied?.current || currentCode === stage.code)) {
      stageStatus = "current";
    }
    if (!stageStatus) {
      const completed = index === 0
        ? Boolean(timestamps[0])
        : index === 1
          ? Boolean(timestamps[1])
          : index === 2
            ? inTransit
            : delivered;
      stageStatus = completed ? "completed" : "pending";
    }

    return { stage: stage.code, status: stageStatus, timestamp };
  });
}

export function normalizeShipment(payload) {
  const source = payload?.data ?? payload;
  const narrative = getField(source, "ai_narrative", "narasi_ai");
  const shipment = {
    ...source,
    waybill_number: getField(source, "waybill_number", "resi"),
    order_status: getField(source, "order_status", "status"),
    seller_city: getField(source, "seller_city", "kota_asal"),
    customer_city: getField(source, "customer_city", "kota_tujuan"),
    order_estimated_delivery_date: getField(
      source,
      "order_estimated_delivery_date",
      "estimasi_tiba",
    ),
    order_delivered_customer_date: getField(
      source,
      "order_delivered_customer_date",
      "tiba_pelanggan",
    ),
    has_delay: getField(source, "has_delay", "ada_keterlambatan") === true,
    logistics_delay_reason: getField(
      source,
      "logistics_delay_reason",
      "alasan_delay",
    ),
    traffic_status: getField(
      source,
      "traffic_status",
      "status_lalulintas",
    ),
    ai_narrative: narrative
      ? {
          ...narrative,
          text: getField(narrative, "text", "teks") ?? "",
          is_fallback: narrative.is_fallback === true,
        }
      : null,
  };

  shipment.milestone_stages = normalizeMilestones(source, shipment);
  return shipment;
}

export async function fetchShipment(waybill, { signal } = {}) {
  const response = await fetch(
    `${API_BASE_URL}/tracking/${encodeURIComponent(waybill)}`,
    {
      headers: { Accept: "application/json" },
      signal,
    },
  );
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.ok === false) {
    if (response.status === 404) {
      throw new Error(
        "Nomor resi tidak ditemukan, mohon periksa kembali input Anda.",
      );
    }
    throw new Error(
      payload.message ??
        payload.pesan ??
        "Pelacakan belum dapat dimuat. Silakan coba kembali.",
    );
  }

  return normalizeShipment(payload);
}