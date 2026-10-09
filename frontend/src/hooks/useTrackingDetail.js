import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export function useTrackingDetail(waybill) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    if (!waybill) {
      setLoading(false);
      return;
    }

    async function fetchTracking() {
      try {
        const response = await fetch(`${API_BASE}/tracking/${waybill}`);
        if (!response.ok) {
          throw new Error("Resi tidak ditemukan");
        }
        const json = await response.json();
        
        if (active) {
          setData(json.data);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchTracking();

    return () => {
      active = false;
    };
  }, [waybill]);

  return { data, loading, error };
}

export function mergeShipmentData(baseData, apiData) {
  if (!apiData) return baseData;
  
  const formatDate = (isoString) => {
    if (!isoString) return "Belum Tersedia";
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    }).replace(/\./g, ":");
  };

  const getMilestoneIcon = (stage) => {
    switch (stage) {
      case "ORDER_CREATED": return "check";
      case "PICKUP_READY": return "inventory_2";
      case "IN_TRANSIT": return "sync_alt";
      case "OUT_FOR_DELIVERY": return "electric_moped";
      case "DELIVERED": return "home";
      default: return "circle";
    }
  };

  const mapMilestones = (apiMilestones, baseMilestones) => {
    if (!apiMilestones || apiMilestones.length === 0) return baseMilestones;
    return apiMilestones.map((m) => {
      const isDone = m.status === "current" || m.status === "done";
      return {
        id: m.stage.toLowerCase(),
        label: m.title || m.stage.replace(/_/g, " "),
        time: m.timestamp ? formatDate(m.timestamp) : (isDone ? "Selesai" : "Menunggu"),
        place: m.facility_name || "-",
        icon: getMilestoneIcon(m.stage),
        state: isDone ? "done" : "pending"
      };
    });
  };

  const mapJourneyNotes = (apiEvents, baseJourney) => {
    if (!apiEvents || apiEvents.length === 0) return baseJourney;
    
    // Sort events descending (newest first)
    const sortedEvents = [...apiEvents].sort((a, b) => new Date(b.event_at) - new Date(a.event_at));
    
    const notes = sortedEvents.map((evt, idx) => ({
      id: `note-${evt.id || idx}`,
      title: evt.title,
      description: evt.description || `${evt.title} di ${evt.facility_name}`,
      time: evt.event_at ? formatDate(evt.event_at) : "-",
      state: idx === 0 ? "active" : "idle"
    }));

    return {
      progressLabel: baseJourney?.progressLabel || "Info Perjalanan",
      notes: notes
    };
  };

  return {
    ...baseData,
    waybill: apiData.waybill_number,
    service: apiData.shipment?.service?.label || baseData.service,
    updatedLabel: apiData.last_updated_at ? `Updated ${formatDate(apiData.last_updated_at)}` : baseData.updatedLabel,
    sender: {
      name: apiData.shipment?.sender?.name || baseData.sender?.name,
      city: apiData.shipment?.sender?.city || baseData.sender?.city,
      address: apiData.shipment?.sender?.address || baseData.sender?.address
    },
    receiver: {
      name: apiData.shipment?.receiver?.name || baseData.receiver?.name,
      city: apiData.shipment?.receiver?.city || baseData.receiver?.city,
      address: apiData.shipment?.receiver?.address || baseData.receiver?.address
    },
    package: {
      ...baseData.package,
      weight: apiData.shipment?.weight_kg ? `${apiData.shipment.weight_kg} Kg` : baseData.package?.weight,
      serviceName: apiData.shipment?.service?.label ? `Anteraja ${apiData.shipment.service.label}` : baseData.package?.serviceName,
      serviceEta: apiData.shipment?.service?.sla || baseData.package?.serviceEta
    },
    milestones: mapMilestones(apiData.milestone_stages, baseData.milestones),
    journey: mapJourneyNotes(apiData.tracking_events, baseData.journey),
    courier: apiData.courier ? {
      ...baseData.courier,
      idLabel: `ID: ${apiData.courier.id}`,
      title: apiData.courier.name,
      description: `No. HP: ${apiData.courier.phone}`,
      whatsapp: `https://wa.me/${apiData.courier.phone.replace(/^0/, '62')}`
    } : baseData.courier
  };
}
