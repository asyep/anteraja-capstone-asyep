/**
 * =============================================================================
 * supabaseTracking.js - Supabase Direct Client & Resilient Cloud Fallback
 * =============================================================================
 * Berfungsi sebagai jalur data cloud langsung ke database Supabase REST API:
 * 1. Menjamin pelacakan tetap berjalan 100% online di production (Vercel)
 *    bahkan ketika server backend lokal atau tunnel sedang tidak aktif.
 * 2. Memetakan relasi tabel `shipments`, `couriers`, `tracking_events`,
 *    `telemetry_data`, dan `ai_narratives` menjadi struktur data standar.
 * 3. Menyimpan feedback pengguna secara instan (< 100ms).
 */

const SUPABASE_URL = "https://unyopreridcpkbvhlfph.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVueW9wcmVyaWRjcGtidmhsZnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MTE5MTUsImV4cCI6MjEwNjM4NzkxNX0.PfSY_Nkw7T4elaygiYBU0Cx5oR0HD1D7pZkTpWup5wA";

// Konfigurasi Layanan Pengiriman Anteraja
const SERVICES_CONFIG = {
  "AR-SD": { label: "Same Day", sla: "Tiba di hari yang sama" },
  "AR-NDR": { label: "Next Day", sla: "1 Hari Kerja" },
  "AR-REG": { label: "Reguler", sla: "2-3 Hari Kerja" },
  "AR-ECO": { label: "Ekonomis", sla: "3-5 Hari Kerja" },
};

// Urutan Kronologis Tahapan Milestone Pengiriman
const MILESTONES_ORDER = [
  "ORDER_CREATED",
  "PICKUP_READY",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];


function extractCity(address) {
  if (!address) return "";
  const parts = address.split(",");
  return parts[parts.length - 1].trim();
}

function parseService(serviceType) {
  if (!serviceType) return { code: "", label: "", sla: null };
  const code = serviceType.split(" ")[0].trim().toUpperCase();
  const meta = SERVICES_CONFIG[code] || { label: serviceType, sla: null };
  return { code, label: meta.label, sla: meta.sla };
}

function buildMilestones(shipment, events) {
  const currentIndex = MILESTONES_ORDER.indexOf(shipment.shipment_status);
  const isDelivered = shipment.shipment_status === "DELIVERED";

  return MILESTONES_ORDER.map((stage, idx) => {
    const stageEvents = events.filter((e) => e.milestone_stage === stage);
    const first = stageEvents[0];
    const last = stageEvents[stageEvents.length - 1];

    let status = "pending";
    if (idx < currentIndex || (isDelivered && idx === currentIndex)) {
      status = "completed";
    } else if (idx === currentIndex) {
      status = "current";
    }

    let timestamp = first?.event_at;
    if (!timestamp && stage === "ORDER_CREATED") {
      timestamp = shipment.purchase_date;
    }
    if (!timestamp && stage === "DELIVERED") {
      timestamp = shipment.delivered_date;
    }

    return {
      stage,
      status,
      timestamp: timestamp || null,
      facility_name: (last || first)?.facility_name || null,
      title: (last || first)?.title || null,
    };
  });
}

/**
 * Mengambil data detail pelacakan lengkap langsung dari Supabase PostgREST.
 */
export async function fetchTrackingFromSupabase(waybill) {
  const cleanWaybill = String(waybill).trim();
  if (!cleanWaybill) return null;

  try {
    const query = new URLSearchParams({
      waybill_number: `eq.${cleanWaybill}`,
      select:
        "*,tracking_events(*),telemetry_data(*),ai_narratives(*),shipment_couriers(*,couriers(*))",
    });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/shipments?${query.toString()}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return null;

    const row = rows[0];
    const rawEvents = Array.isArray(row.tracking_events) ? row.tracking_events : [];
    // Sort events ascending by event_at
    const events = [...rawEvents].sort(
      (a, b) => new Date(a.event_at) - new Date(b.event_at)
    );

    const telemetry = row.telemetry_data || null;
    const narratives = Array.isArray(row.ai_narratives) ? row.ai_narratives : [];
    const narrative = narratives.length > 0 ? narratives[narratives.length - 1] : null;

    let activeCourier = null;
    if (Array.isArray(row.shipment_couriers) && row.shipment_couriers.length > 0) {
      const sorted = [...row.shipment_couriers].sort(
        (a, b) => new Date(b.assigned_at) - new Date(a.assigned_at)
      );
      const chosen = sorted.find((c) => c.is_active) || sorted[0];
      if (chosen && chosen.couriers) {
        const c = chosen.couriers;
        activeCourier = {
          id: c.courier_id,
          name: c.courier_name,
          phone: c.courier_phone,
          whatsapp_url: c.courier_phone
            ? `https://wa.me/${c.courier_phone.replace(/\D+/g, "")}`
            : null,
          photo_url: c.courier_photo_url,
          vehicle_type: c.vehicle_type,
          vehicle_plate: c.vehicle_plate,
          assigned_at: chosen.assigned_at,
          is_active: Boolean(chosen.is_active),
        };
      }
    }

    const firstPickupEvent = events.find((e) => e.milestone_stage === "PICKUP_READY");
    const firstTransitEvent = events.find((e) => e.milestone_stage === "IN_TRANSIT");
    const firstDeliveryEvent = events.find((e) => e.milestone_stage === "OUT_FOR_DELIVERY");

    const maxEventAt = events.reduce((latest, e) => {
      const dt = new Date(e.event_at);
      return !latest || dt > latest ? dt : latest;
    }, null);

    const lastUpdated = maxEventAt ? maxEventAt.toISOString() : row.updated_at;

    return {
      ok: true,
      data: {
        waybill_number: row.waybill_number,
        order_status: row.shipment_status,
        current_milestone_stage: row.shipment_status,
        seller_city: extractCity(row.sender_address),
        customer_city: extractCity(row.receiver_address),
        order_purchase_timestamp: row.purchase_date,
        order_delivered_carrier_date: firstPickupEvent?.event_at || null,
        in_transit_timestamp: firstTransitEvent?.event_at || null,
        out_for_delivery_timestamp: firstDeliveryEvent?.event_at || null,
        order_estimated_delivery_date: row.estimated_delivery_date,
        order_delivered_customer_date: row.delivered_date,
        last_updated_at: lastUpdated,
        has_delay: Boolean(telemetry?.logistics_delay_reason || telemetry?.traffic_status === "Heavy"),
        logistics_delay_reason: telemetry?.logistics_delay_reason || null,
        traffic_status: telemetry?.traffic_status || null,

        shipment: {
          service_type: row.service_type,
          service: parseService(row.service_type),
          sender: {
            name: row.sender_name,
            address: row.sender_address,
            city: extractCity(row.sender_address),
          },
          receiver: {
            name: row.receiver_name,
            address: row.receiver_address,
            city: extractCity(row.receiver_address),
          },
          weight_kg: Number(row.weight_kg),
          volume_m3: row.volume_m3 ? Number(row.volume_m3) : null,
          insurance_status: Boolean(row.insurance_status),
          insurance_type: row.insurance_type,
          is_free_shipping: Boolean(row.is_free_shipping),
          has_sla_guarantee: Boolean(row.has_sla_guarantee),
        },

        courier: activeCourier,

        telemetry: telemetry
          ? {
              latitude: Number(telemetry.latitude),
              longitude: Number(telemetry.longitude),
              speed_kmh: Number(telemetry.speed_kmh),
              location_name: telemetry.location_name,
              accuracy_percentage: Number(telemetry.accuracy_percentage),
              is_gps_active: Boolean(telemetry.is_gps_active),
              traffic_status: telemetry.traffic_status,
              weather_condition: telemetry.weather_condition,
              logistics_delay_reason: telemetry.logistics_delay_reason,
              waiting_time_minutes: telemetry.waiting_time_minutes,
              observed_at: telemetry.observed_at,
            }
          : null,

        milestone_stages: buildMilestones(row, events),

        tracking_events: [...events].reverse().map((e) => ({
          id: e.event_id,
          event_code: (e.event_code || "").replace(/[\[\]]/g, ""),
          milestone_stage: e.milestone_stage,
          title: e.title,
          description: e.description,
          facility_name: e.facility_name,
          event_at: e.event_at,
        })),

        ai_narrative: narrative
          ? {
              title: narrative.ai_title,
              subtitle: narrative.ai_subtitle,
              text: narrative.narrative_text,
              is_fallback: Boolean(narrative.is_fallback),
              provider: narrative.provider,
              generation_status: narrative.generation_status,
              generated_at: narrative.generated_at,
            }
          : null,
      },
    };
  } catch (err) {
    console.error("Gagal mengambil data dari Supabase:", err);
    return null;
  }
}

/**
 * Menyimpan feedback langsung ke Supabase sebagai fallback.
 */
export async function sendFeedbackToSupabase(resi, membantu) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        resi,
        membantu,
        created_at: new Date().toISOString(),
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}
