/**
 * =============================================================================
 * useTrackingDetail.js - Hook Pengambilan Data & Penyelaras Data Pengiriman
 * =============================================================================
 * Berfungsi untuk:
 * 1. `useTrackingDetail(waybill)`: Custom hook yang mengelola state pengambilan
 *    data (data, loading, error) dengan sinkronisasi instan (0ms) dari cache
 *    dan background revalidation ke API backend/Supabase.
 * 2. `mergeShipmentData(baseData, apiData)`: Fungsi transformer yang menggabungkan
 *    data live dari REST API ke dalam template visual UI (stepper milestone,
 *    telemetri GPS Leaflet map, narasi Satria AI, dan profil kurir).
 */

import { useState, useEffect } from "react";
import { fetchTrackingData, getCachedTracking } from "../lib/api";
import { saveRecentSearch } from "./useRecentSearches";
import { TRANSIT_ROUTES } from "../data/transitRoutes";

/**
 * Custom React Hook untuk mengambil data status pelacakan secara reaktif.
 * @param {string} waybill - Nomor resi paket yang dilacak.
 * @returns {{ data: Object|null, loading: boolean, error: string|null }}
 */
export function useTrackingDetail(waybill) {
  const cleanWaybill = String(waybill || "").replace(/[^a-zA-Z0-9]/g, "").trim();
  const cached = getCachedTracking(cleanWaybill);


  const [currentWaybill, setCurrentWaybill] = useState(cleanWaybill);
  const [data, setData] = useState(cached?.data || null);
  const [loading, setLoading] = useState(!cached?.data);
  const [error, setError] = useState(null);

  // Sinkronisasi instan seketika pada render tick (0ms) saat waybill berubah
  if (cleanWaybill !== currentWaybill) {
    setCurrentWaybill(cleanWaybill);
    if (cached?.data) {
      setData(cached.data);
      setLoading(false);
      setError(null);
    } else {
      setData(null);
      setLoading(true);
      setError(null);
    }
  }

  useEffect(() => {
    let active = true;
    if (!cleanWaybill) {
      setLoading(false);
      return;
    }

    const currentCached = getCachedTracking(cleanWaybill);
    if (currentCached?.data) {
      setData(currentCached.data);
      setLoading(false);
    }

    async function fetchTracking() {
      try {
        const json = await fetchTrackingData(cleanWaybill);

        if (active) {
          setData(json.data);
          setLoading(false);
          saveRecentSearch(cleanWaybill);
        }
      } catch (err) {
        if (active) {
          if (!currentCached?.data) {
            setError(err.message);
          }
          setLoading(false);
        }
      }
    }

    fetchTracking();

    return () => {
      active = false;
    };
  }, [cleanWaybill]);

  return { data, loading, error };
}

/**
 * Mengintegrasikan data pengiriman dari backend API / Supabase ke dalam template
 * tampilan visual. Mengatur pemformatan kota, nama pengirim/penerima, tanggal,
 * urutan tahapan milestone, rute Leaflet, serta telemetri GPS kurir/kendaraan.
 *
 * @param {Object} baseData - Template data lokal bawaan status halaman.
 * @param {Object|null} apiData - Data pengiriman dinamis dari response API.
 * @returns {Object} Objek data lengkap siap render oleh TrackingStatusLayout.
 */
export function mergeShipmentData(baseData, apiData) {
  if (!apiData) return baseData;

  
  const cleanCity = (val) => {
    if (!val) return "";
    const parts = String(val).split(",");
    const last = parts[parts.length - 1].trim();
    return last.replace(/^(Kota|Kabupaten|Kab\.?)\s+/i, "").trim();
  };

  const senderCity = cleanCity(
    apiData.shipment?.sender?.city ||
    apiData.seller_city ||
    apiData.shipment?.sender?.address ||
    baseData.sender?.city ||
    ""
  );

  const senderName = apiData.shipment?.sender?.name || baseData.sender?.name || "";

  const receiverCity = cleanCity(
    apiData.shipment?.receiver?.city ||
    apiData.customer_city ||
    apiData.shipment?.receiver?.address ||
    baseData.receiver?.city ||
    ""
  );

  const receiverName = apiData.shipment?.receiver?.name || baseData.receiver?.name || "";

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString("id-ID", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    }).replace(/\./g, ":");
  };

  const formatNoteDate = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month} ${hours}:${minutes}`;
  };

  const STAGE_CONFIG = [
    {
      stage: "ORDER_CREATED",
      id: "created",
      label: "Pesanan Dibuat",
      pendingIcon: "inventory_2",
      activeIcon: "inventory_2",
      doneIcon: "check",
      defaultPendingTime: "Menunggu",
    },
    {
      stage: "PICKUP_READY",
      id: "courier",
      label: "Diproses Kurir",
      pendingIcon: "local_shipping",
      activeIcon: "local_shipping",
      doneIcon: "check",
      defaultPendingTime: "Menunggu Jadwal",
    },
    {
      stage: "IN_TRANSIT",
      id: "transit",
      label: "Dalam Perjalanan",
      pendingIcon: "sync_alt",
      activeIcon: "local_shipping",
      doneIcon: "check",
      defaultPendingTime: "Belum Dikirim",
    },
    {
      stage: "OUT_FOR_DELIVERY",
      id: "delivering",
      label: "Dalam Pengantaran",
      pendingIcon: "electric_moped",
      activeIcon: "electric_moped",
      doneIcon: "check",
      defaultPendingTime: "Belum Tersedia",
    },
    {
      stage: "DELIVERED",
      id: "arrived",
      label: "Tiba di Tujuan",
      pendingIcon: "home",
      activeIcon: "home",
      doneIcon: "home",
      defaultPendingTime: "Estimasi Menyesuaikan",
    },
  ];

  const mapMilestones = (apiMilestones, baseMilestones) => {
    return STAGE_CONFIG.map((config, index) => {
      const base = (baseMilestones && baseMilestones[index]) || {};
      const apiM = apiMilestones
        ? apiMilestones.find((m) => m.stage === config.stage) || apiMilestones[index]
        : null;

      const isCompleted = apiM && (apiM.status === "completed" || apiM.status === "done");
      const isCurrent = apiM && apiM.status === "current";
      const isDone =
        isCompleted ||
        isCurrent ||
        (!apiM && base.state === "done");

      let icon;
      if (isCurrent) {
        icon = config.activeIcon || base.icon || config.pendingIcon;
      } else if (isCompleted) {
        icon = config.doneIcon || "check";
      } else if (!apiMilestones && base.icon) {
        icon = base.icon;
      } else {
        icon = isDone ? (config.doneIcon || "check") : config.pendingIcon;
      }
      if (isDone && icon === "circle") icon = "check";

      // WAKTU: Prioritaskan timestamp nyata dari Supabase
      let time;
      if (apiM?.timestamp) {
        time = formatDate(apiM.timestamp);
      } else if (isDone && base.time && base.time !== "Menunggu" && base.time !== "Menunggu Jadwal" && !apiMilestones) {
        time = base.time;
      } else if (isDone) {
        time = "Selesai";
      } else {
        time = config.defaultPendingTime;
      }

      // LOKASI / FASILITAS: Selaraskan dengan kota pengirim / penerima aktual dari resi
      let place;
      if (config.stage === "ORDER_CREATED") {
        place = senderCity ? `Hub ${senderCity} / Pengirim` : (base.place || "Hub Pengirim");
      } else if (config.stage === "PICKUP_READY") {
        if (apiM?.facility_name && apiM.facility_name !== "Sistem Anteraja") {
          place = apiM.facility_name;
        } else if (senderCity) {
          place = `Hub Sortir ${senderCity}`;
        } else {
          place = "Hub Sortir Pengirim";
        }
      } else if (config.stage === "IN_TRANSIT") {
        place = apiM?.facility_name || "Hub Tujuan";
      } else if (config.stage === "OUT_FOR_DELIVERY") {
        place = apiM?.facility_name || (receiverCity ? `Area ${receiverCity}` : "Alamat Penerima");
      } else if (config.stage === "DELIVERED") {
        place = receiverCity || "Tiba di Tujuan";
      } else {
        place = apiM?.facility_name || base.place || "-";
      }

      return {
        id: base.id || config.id,
        label: config.label,
        time,
        place,
        placeClass: base.placeClass,
        icon,
        state: isDone ? "done" : "pending",
        pulse: Boolean(isCurrent || (!apiMilestones && base.pulse)),
      };
    });
  };

  const mapJourneyNotes = (apiEvents, baseJourney, milestones) => {
    // 1. Jika ada tracking_events dari Supabase / API: prioritaskan data riil!
    if (apiEvents && apiEvents.length > 0) {
      // Urutkan event terbaru di atas (descending)
      const sortedEvents = [...apiEvents].sort(
        (a, b) => new Date(b.event_at) - new Date(a.event_at)
      );

      const notes = sortedEvents.map((evt, idx) => {
        let displayTitle = evt.title || "";
        const cleanCode = (evt.event_code || "").replace(/[\[\]]/g, "");
        if (cleanCode && !displayTitle.startsWith("[")) {
          displayTitle = `[${cleanCode}] ${displayTitle}`;
        }
        let displayDesc = evt.description;
        if (!displayDesc) {
          displayDesc = evt.facility_name
            ? `Paket diproses di ${evt.facility_name}.`
            : displayTitle;
        }
        return {
          id: `note-${evt.id || idx}`,
          title: displayTitle,
          description: displayDesc,
          time: evt.event_at ? formatNoteDate(evt.event_at) : "-",
          state: idx === 0 ? "done" : (idx === 1 ? "active" : "idle"),
        };
      });

      const doneMilestonesCount = milestones?.filter((m) => m.state === "done")?.length || notes.length;

      return {
        progressLabel: `${doneMilestonesCount} dari 5 Pos Selesai`,
        notes,
      };
    }

    // 2. Jika fallback ke mock data, sinkronkan nama pengirim & kota asal agar tidak bocor data kota lain
    if (baseJourney?.notes) {
      const sanitizedNotes = baseJourney.notes.map((note) => {
        let desc = note.description || "";
        let title = note.title || "";
        if (senderName) {
          desc = desc.replace(/Toko Sentral Komputer Semarang/gi, senderName);
        }
        if (senderCity) {
          desc = desc.replace(/Semarang/gi, senderCity);
          title = title.replace(/Semarang/gi, senderCity);
        }
        return {
          ...note,
          title,
          description: desc,
        };
      });

      return {
        ...baseJourney,
        notes: sanitizedNotes,
      };
    }

    return baseJourney;
  };

  const mapRadar = (baseRadar, apiData) => {
    if (!baseRadar) return baseRadar;

    // 1. VARIAN "STAGING" (Diproses Kurir di Hub Asal)
    if (baseRadar.variant === "staging") {
      if (apiData?.telemetry?.latitude != null && apiData?.telemetry?.longitude != null) {
        const lat = Number(apiData.telemetry.latitude);
        const lon = Number(apiData.telemetry.longitude);
        return {
          ...baseRadar,
          geo: { lat, lon },
          coordinates: `LAT: ${lat.toFixed(4)}, LON: ${lon.toFixed(4)}`,
          pin: {
            title: apiData.telemetry.location_name || baseRadar.pin?.title,
            subtitle: "DC Anteraja • Koordinat Riil Telemetri",
          },
        };
      }

      const cityKey = senderCity.toLowerCase();
      const KNOWN_HUBS = [
        {
          keys: ["semarang"],
          title: "Staging Gateway Semarang Hub",
          subtitle: "DC Anteraja • Jl. Kaligawe KM 5",
          zone: "Zona Distribusi Regional Jawa Tengah 01",
          geo: { lat: -6.9582, lon: 110.4503 },
        },
        {
          keys: ["jakarta"],
          title: "Staging Gateway Cakung DC",
          subtitle: "DC Anteraja • Kawasan Industri Cakung",
          zone: "Zona Distribusi Regional Jabodetabek 01",
          geo: { lat: -6.1856, lon: 106.9452 },
        },
        {
          keys: ["bandung"],
          title: "Staging Gateway Bandung Hub",
          subtitle: "DC Anteraja • Jl. Soekarno-Hatta 608",
          zone: "Zona Distribusi Regional Jawa Barat 01",
          geo: { lat: -6.9412, lon: 107.6454 },
        },
        {
          keys: ["surabaya"],
          title: "Staging Gateway Surabaya Hub",
          subtitle: "DC Anteraja • Margomulyo Permai",
          zone: "Zona Distribusi Regional Jawa Timur 01",
          geo: { lat: -7.2341, lon: 112.6712 },
        },
        {
          keys: ["yogyakarta", "jogja", "sleman"],
          title: "Staging Hub Yogyakarta",
          subtitle: "DC Anteraja • Jl. Ring Road Utara",
          zone: "Zona Distribusi Regional D.I. Yogyakarta 01",
          geo: { lat: -7.7692, lon: 110.4185 },
        },
      ];

      const matched = KNOWN_HUBS.find((h) =>
        h.keys.some((k) => cityKey.includes(k))
      );

      if (matched) {
        return {
          ...baseRadar,
          geo: matched.geo,
          pin: {
            title: matched.title,
            subtitle: matched.subtitle,
          },
          zone: matched.zone,
          coordinates: `LAT: ${matched.geo.lat.toFixed(4)}, LON: ${matched.geo.lon.toFixed(4)}`,
        };
      }

      return baseRadar;
    }

    // 2. VARIAN "TRANSIT" (Dalam Perjalanan Antar-Kota)
    if (baseRadar.variant === "transit") {
      const sCity = senderCity.toLowerCase();
      const rCity = receiverCity.toLowerCase();
      const latestEventTitle = (apiData?.tracking_events?.[0]?.title || "").toLowerCase();
      const latestEventDesc = (apiData?.tracking_events?.[0]?.description || "").toLowerCase();

      // Pilih rute antarkota yang sesuai dengan kota pengirim & catatan perjalanan
      let routeId = "semarang-jakarta";
      if (
        sCity.includes("bandung") ||
        latestEventDesc.includes("bandung") ||
        latestEventTitle.includes("bandung") ||
        latestEventDesc.includes("cakung") ||
        latestEventTitle.includes("cakung")
      ) {
        routeId = "bandung-jakarta";
      } else if (sCity.includes("surabaya") || latestEventDesc.includes("surabaya")) {
        routeId = "surabaya-jakarta";
      } else if (sCity.includes("semarang") || latestEventDesc.includes("semarang")) {
        routeId = "semarang-jakarta";
      }

      const route = TRANSIT_ROUTES[routeId] || TRANSIT_ROUTES["semarang-jakarta"];

      // Telemetri riil dari database (misal koordinat GPS truk di tol)
      let activeGeo = null;
      let activeLocationName = null;
      let startIndex = 2; // Default di pertengahan jalan

      if (apiData?.telemetry?.latitude != null && apiData?.telemetry?.longitude != null) {
        activeGeo = {
          lat: Number(apiData.telemetry.latitude),
          lon: Number(apiData.telemetry.longitude),
        };
        activeLocationName = apiData.telemetry.location_name;
      }

      // Cari indeks waypoint yang paling cocok dengan posisi Catatan Perjalanan Detil / Telemetri
      if (activeGeo && route?.waypoints) {
        const foundIdx = route.waypoints.findIndex(
          (wp) =>
            (activeLocationName && wp.label.toLowerCase().includes(activeLocationName.toLowerCase())) ||
            (Math.abs(wp.geo.lat - activeGeo.lat) < 0.15 && Math.abs(wp.geo.lon - activeGeo.lon) < 0.15)
        );
        if (foundIdx !== -1) {
          startIndex = foundIdx;
        } else {
          startIndex = Math.min(4, Math.max(1, route.waypoints.length - 2));
        }
      } else if (route?.waypoints) {
        if (latestEventTitle.includes("outbound") || latestEventDesc.includes("menuju")) {
          startIndex = Math.min(3, route.waypoints.length - 2);
        } else if (latestEventTitle.includes("tiba di hub")) {
          startIndex = 1;
        }
      }

      const currentWp = route?.waypoints?.[startIndex] || route?.waypoints?.[0];
      const activeLoc = activeLocationName || currentWp?.label || "Koridor Antar-Kota";

      return {
        ...baseRadar,
        routeId,
        startIndex,
        telemetryGeo: activeGeo,
        pillLabel: `Titik: ${activeLoc}`,
        liveBadgeLabel: "Live GPS Armada Truk Aktif",
        zoneLabel: route.koridor || "Koridor Logistik Antar-Kota",
        coordinates: activeGeo
          ? `LAT: ${activeGeo.lat.toFixed(4)}, LON: ${activeGeo.lon.toFixed(4)}`
          : currentWp?.geo
            ? `LAT: ${currentWp.geo.lat.toFixed(4)}, LON: ${currentWp.geo.lon.toFixed(4)}`
            : baseRadar.coordinates,
        footerDoneLabel: "Armada Tiba di Hub Tujuan",
      };
    }

    // 3. VARIAN "DELIVERY" (Dalam Pengantaran oleh Kurir Satria ke Rumah Penerima)
    if (baseRadar.variant === "delivery") {
      const receiverAddr = apiData?.shipment?.receiver?.address || baseRadar.location;
      return {
        ...baseRadar,
        destinationAddress: receiverAddr,
        location: receiverAddr || baseRadar.location,
        zoneLabel: receiverAddr ? `Menuju ${receiverAddr}` : baseRadar.zoneLabel,
      };
    }

    return baseRadar;
  };

  const mapAssistant = (baseAssistant, apiData) => {
    if (!baseAssistant) return baseAssistant;

    let courierName = baseAssistant.courierName || "Satria Assistant";
    if (senderCity) {
      courierName = `Staging DC Hub ${senderCity}`;
    }

    const currentStatusCode = (baseData?.status?.code || apiData?.order_status || apiData?.shipment_status || "").toUpperCase();
    const isOutForDelivery = baseData?.radar?.variant === "delivery" || currentStatusCode === "OUT_FOR_DELIVERY";

    if (isOutForDelivery) {
      const kurirName = apiData?.courier?.name || baseData?.courier?.name || "Eko Yulianto";
      courierName = `Satria ${kurirName} (Pengantaran Motor)`;
    }

    // 1. Jika ada narasi AI tersimpan di database Supabase yang benar-benar cocok dengan statusnya
    const isTransitNarrative = Boolean(
      apiData?.ai_narrative?.text &&
      (apiData.ai_narrative.text.includes("Tol") ||
       apiData.ai_narrative.text.includes("Linehaul") ||
       apiData.ai_narrative.text.includes("78 km/jam"))
    );

    if (apiData?.ai_narrative?.text && (!isOutForDelivery || (!isTransitNarrative && (apiData?.order_status === "OUT_FOR_DELIVERY" || apiData?.shipment_status === "OUT_FOR_DELIVERY")))) {
      return {
        ...baseAssistant,
        title: apiData.ai_narrative.title || baseAssistant.title || "Satria Assistant",
        subtitle: isOutForDelivery ? courierName : (apiData.ai_narrative.subtitle || courierName),
        courierName: isOutForDelivery ? courierName : (apiData.ai_narrative.subtitle || courierName),
        message: apiData.ai_narrative.text,
        narrative: apiData.ai_narrative.text,
      };
    }

    // 2. Buat narasi cerdas yang selaras dengan status operasional paket & data riil
    const status = currentStatusCode;
    let message = "";

    if (status === "ORDER_CREATED") {
      message = `Halo Kak! Pesanan kamu baru saja dibuat oleh pengirim (${senderName || "pihak toko"}${senderCity ? ` di ${senderCity}` : ""}). Saat ini sistem Anteraja sedang mengalokasikan Satria Pickup untuk menjemput paket. Pantau terus update terbarunya di sini ya!`;
    } else if (status === "PICKUP_READY") {
      message = `Halo Kak! Pesanan kamu dari ${senderName || "pengirim"}${senderCity ? ` (${senderCity})` : ""} telah siap dan Satria Pickup kami telah dijadwalkan untuk menjemput paket di lokasi pengirim. Setelah dijemput, paket akan langsung dibawa ke Staging DC Hub ${senderCity || "asal"} untuk proses verifikasi barcode conveyor menuju ${receiverCity || "alamat tujuan"}. Pantau terus update terbarunya di sini ya!`;
    } else if (status === "COURIER_PROCESSED") {
      message = `Halo Kak! Paket kamu dari ${senderName || "pengirim"} sudah berhasil dijemput dan saat ini telah tiba di Hub Distribusi (Staging DC ${senderCity || "asal"}). Tim sortir kami sedang menyiapkan dan memverifikasi barcode conveyor untuk diberangkatkan via armada Linehaul menuju ${receiverCity || "kota tujuan"}. Pantau terus pergerakan paketmu ya!`;
    } else if (status === "IN_TRANSIT") {
      message = `Halo Kak! Paketmu dari ${senderName || senderCity || "pengirim"} saat ini sedang dalam perjalanan logistik antarkota menuju ${receiverCity || "tujuan"}. Armada Linehaul kami bergerak terpantau 24/7 dan diproyeksikan tiba di Hub Tujuan sesuai jadwal estimasi. Pantau terus pergerakannya di radar posisi ya!`;
    } else if (status === "OUT_FOR_DELIVERY" || isOutForDelivery) {
      const kurirName = apiData?.courier?.name || baseData?.courier?.name || "Eko Yulianto";
      message = `Halo Kak! Kabar baik, paketmu sudah tiba di Hub tujuan ${receiverCity || "Jakarta"} dan saat ini sedang dibawa langsung oleh Satria Pengantaran (${kurirName}) dengan sepeda motor menuju alamat rumah penerima (${receiverName || "kamu"}). Pastikan nomor HP aktif dan penerima dapat dihubungi ya!`;
    } else if (status === "DELIVERED") {
      message = `Alhamdulillah, paketmu dari ${senderName || "pengirim"} telah sukses diserahterimakan kepada ${receiverName || "penerima"} di ${receiverCity || "alamat tujuan"}. Terima kasih telah mempercayakan pengiriman Anda kepada Anteraja!`;
    } else {
      message = (baseAssistant.message || baseAssistant.narrative || "")
        .replace(/Toko Sentral Komputer Semarang/gi, senderName || "Pengirim")
        .replace(/Semarang/gi, senderCity || "Origin Hub");
    }

    return {
      ...baseAssistant,
      courierName,
      message,
      narrative: message,
    };
  };

  const mapStatus = (baseStatus, apiData) => {
    if (!baseStatus) return baseStatus;
    const statusCode = (apiData?.order_status || apiData?.shipment_status || baseStatus.code || "").toUpperCase();
    let subtitle = baseStatus.subtitle;
    let label = baseStatus.label;

    if (statusCode === "PICKUP_READY") {
      subtitle = "Kurir Satria dijadwalkan menjemput paket di lokasi pengirim";
    } else if (statusCode === "IN_TRANSIT") {
      if (apiData?.telemetry?.location_name) {
        label = `Paket Sedang Melintasi ${apiData.telemetry.location_name}`;
      } else if (apiData?.tracking_events?.[0]?.title) {
        label = apiData.tracking_events[0].title;
      }
    }

    const badges = Array.isArray(baseStatus.badges) ? [...baseStatus.badges] : [];
    if (badges.length > 0 && apiData.shipment?.service?.label) {
      badges[0] = {
        ...badges[0],
        label: `Anteraja ${apiData.shipment.service.label}`,
      };
    }
    let variant = baseStatus.variant;
    if (statusCode === "ORDER_CREATED") variant = "default";
    else if (statusCode === "PICKUP_READY" || statusCode === "COURIER_PROCESSED" || statusCode === "PROCESSED") variant = "primary-solid";
    else if (statusCode === "IN_TRANSIT") variant = "transit";
    else if (statusCode === "OUT_FOR_DELIVERY") variant = "delivery";
    else if (statusCode === "DELIVERED") variant = "delivered";

    return {
      ...baseStatus,
      variant,
      label,
      subtitle,
      badges,
    };
  };

  const milestones = mapMilestones(apiData.milestone_stages, baseData.milestones);
  const journey = mapJourneyNotes(apiData.tracking_events, baseData.journey, milestones);
  const radar = mapRadar(baseData.radar, apiData);
  const assistant = mapAssistant(baseData.assistant, apiData);
  const status = mapStatus(baseData.status, apiData);

  // Status kurir: untuk "Dalam Perjalanan" dan "Pesanan Dibuat", Satria (kurir motor) belum bertugas
  // karena pada transit kargo diangkut armada truk antar-kota (linehaul).
  const statusCode = (apiData?.order_status || apiData?.shipment_status || baseData?.status?.code || "").toUpperCase();
  const isTransit = statusCode === "IN_TRANSIT" || baseData?.radar?.variant === "transit";
  const isOrderCreated = statusCode === "ORDER_CREATED" || baseData?.radar?.variant === "standby";
  const isStaging = statusCode === "PROCESSED" || baseData?.radar?.variant === "staging";

  let courier;
  if (isTransit || isOrderCreated || isStaging || !baseData?.courier?.active) {
    const destCity = apiData.shipment?.receiver?.city || baseData.receiver?.city;
    courier = {
      active: false,
      idLabel: "ID: Menunggu Penugasan",
      title: "Kurir Pengantaran Belum Dialokasikan",
      description:
        "Satria untuk pengantaran akhir akan ditugaskan otomatis ketika paket tiba di Delivery Hub kota tujuan Anda.",
      standbyNote: destCity
        ? `Penugasan kurir standby di Delivery Hub ${destCity}`
        : (baseData.courier?.standbyNote || "Penugasan kurir standby di Delivery Hub Tujuan"),
    };
  } else if (apiData.courier) {
    courier = {
      ...baseData.courier,
      active: true,
      idLabel: baseData.courier?.idLabel || "Sedang Bertugas",
      title: baseData.courier?.title || "Satria Bertugas",
      name: apiData.courier.name || baseData.courier?.name,
      rating: baseData.courier?.rating || "4.9",
      totalKiriman: baseData.courier?.totalKiriman || "1.2K kiriman",
      armada: baseData.courier?.armada || "Armada Satria Motor",
      armadaId: apiData.courier.id || baseData.courier?.armadaId,
      phone: `tel:${apiData.courier.phone}`,
      whatsapp: `https://wa.me/${apiData.courier.phone.replace(/^0/, '62')}`,
      activeNote: baseData.courier?.activeNote || "Sedang bertugas aktif di rute pengantaran",
    };
  } else {
    courier = baseData.courier;
  }

  return {
    ...baseData,
    waybill: apiData.waybill_number,
    service: apiData.shipment?.service?.label || baseData.service,
    status,
    updatedLabel: baseData.updatedLabel || (apiData.last_updated_at ? `Updated ${formatDate(apiData.last_updated_at)}` : "Updated 2 menit lalu"),
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
    milestones,
    journey,
    radar,
    assistant,
    courier
  };
}
