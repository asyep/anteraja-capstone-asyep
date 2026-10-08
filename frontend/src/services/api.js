import { MILESTONE_STAGES } from "../utils/constants";

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

export class ApiError extends Error {
  constructor(message, status = 0, code = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const CACHE_TTL_MS = 30_000;
const shipmentCache = new Map();

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { Accept: "application/json", ...(options.headers ?? {}) },
    });
  } catch (networkError) {
    if (networkError.name === "AbortError") throw networkError;
    throw new ApiError(
      "Server pelacakan tidak dapat dihubungi. Periksa koneksi Anda lalu coba kembali.",
      0,
      "NETWORK_ERROR",
    );
  }
  const payload = await readResponse(response);
  return { response, payload };
}

function rateLimitMessage(response) {
  const retryAfter = Number(response.headers.get("Retry-After"));
  const retryMessage = Number.isFinite(retryAfter) && retryAfter > 0
    ? ` Coba lagi dalam ${retryAfter} detik.`
    : " Coba lagi sebentar lagi.";

  return `Permintaan terlalu sering. Sistem sedang melindungi layanan tracking.${retryMessage}`;
}

async function readResponse(response) {
  return response.json().catch(() => ({}));
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

    return { ...supplied, stage: stage.code, label: stage.label, status: stageStatus, timestamp };
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

export async function fetchShipment(waybill, { signal, force = false } = {}) {
  const key = String(waybill ?? "").trim();
  const cached = shipmentCache.get(key);
  if (!force && cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.data;
  }

  const { response, payload } = await request(
    `/tracking/${encodeURIComponent(key)}`,
    { signal },
  );

  if (!response.ok || payload.ok === false) {
    if (response.status === 429) {
      throw new ApiError(rateLimitMessage(response), 429, "RATE_LIMITED");
    }

    if (response.status === 404) {
      throw new ApiError(
        "Nomor resi tidak ditemukan, mohon periksa kembali input Anda.",
        404,
        "NOT_FOUND",
      );
    }
    throw new ApiError(
      payload.message ??
        payload.pesan ??
        "Pelacakan belum dapat dimuat. Silakan coba kembali.",
      response.status,
      payload.code ?? null,
    );
  }

  const shipment = normalizeShipment(payload);
  shipmentCache.set(key, { at: Date.now(), data: shipment });
  return shipment;
}

/** Satu contoh resi per skenario (normal, live, warning, delivered). */
export async function fetchShipmentSamples({ signal } = {}) {
  const { response, payload } = await request("/shipments/samples", { signal });
  if (!response.ok) {
    throw new ApiError(
      payload.message ?? "Contoh resi belum dapat dimuat.",
      response.status,
    );
  }
  return {
    samples: payload.data ?? [],
    notFoundExample: payload.not_found_example ?? null,
  };
}

/** Daftar kiriman dengan filter opsional status / scenario / search. */
export async function fetchShipments(params = {}, { signal } = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value != null && value !== ""),
  ).toString();
  const { response, payload } = await request(
    `/shipments${query ? `?${query}` : ""}`,
    { signal },
  );
  if (!response.ok) {
    throw new ApiError(
      payload.message ?? "Daftar kiriman belum dapat dimuat.",
      response.status,
    );
  }
  return { items: payload.data ?? [], meta: payload.meta ?? null };
}

export async function submitFeedback({ waybill, helpful }) {
  const { response, payload } = await request("/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resi: waybill, membantu: helpful }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(rateLimitMessage(response));
    }

    const validationMessage = Object.values(payload.errors ?? {})
      .flat()
      .find((message) => typeof message === "string");

    throw new Error(
      validationMessage ?? payload.message ?? "Feedback belum dapat dikirim. Silakan coba kembali.",
    );
  }

  return payload;
}
