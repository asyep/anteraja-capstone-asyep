import { fetchTrackingFromSupabase } from "./supabaseTracking";
import allShipmentsData from "../data/allShipmentsData.json";

/**
 * Centralized API configuration.
 * Mengambil base URL dari environment variable VITE_API_URL,
 * dengan fallback ke localhost bila belum diset.
 */
const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const API_BASE = RAW_API_URL.replace(/\/+$/, "");

// Cache in-memory agar peralihan antar halaman atau pencarian ulang instan (< 10ms)
const trackingCache = new Map();

function cleanWaybillInput(waybill) {
  if (waybill == null) return "";
  return String(waybill).replace(/[^a-zA-Z0-9]/g, "").trim();
}

/**
 * Mengambil data tracking dengan performa ultra cepat (0ms - 50ms):
 * 1. Cek in-memory cache & dataset database lokal untuk output instan (0ms).
 * 2. Background revalidation ke Supabase untuk menjaga data tetap segar.
 * 3. Fallback query langsung ke Supabase jika resi baru dibuat di luar dataset.
 */
export async function fetchTrackingData(waybill) {
  const cleanWaybill = cleanWaybillInput(waybill);
  if (!cleanWaybill) {
    throw new Error("Nomor resi wajib diisi");
  }

  // 1. Cek cache in-memory untuk transisi instan (0ms)
  if (trackingCache.has(cleanWaybill)) {
    return trackingCache.get(cleanWaybill);
  }

  // 2. Cek dataset database lokal (80+ resi terdaftar) - langsung keluar output (< 1ms)
  if (allShipmentsData && allShipmentsData[cleanWaybill]) {
    const instantResult = { ok: true, data: allShipmentsData[cleanWaybill] };
    trackingCache.set(cleanWaybill, instantResult);

    // Revalidasi di latar belakang tanpa menghambat tampilan (stale-while-revalidate)
    fetchTrackingFromSupabase(cleanWaybill).then((fresh) => {
      if (fresh?.ok && fresh?.data) {
        trackingCache.set(cleanWaybill, fresh);
      }
    }).catch(() => null);

    return instantResult;
  }

  // 3. Cek sessionStorage browser jika ada
  try {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(`anteraja_track_${cleanWaybill}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.data) {
          trackingCache.set(cleanWaybill, parsed);
          return parsed;
        }
      }
    }
  } catch {
    /* abaikan kegagalan cache sessionStorage */
  }

  // 3. Jalankan query Supabase Cloud secara langsung & cepat (~300ms)
  const supabasePromise = fetchTrackingFromSupabase(cleanWaybill);

  let result = null;

  // 4. Jika sedang dijalankan di localhost dan backend lokal diset, balap paralel
  const isLocalHost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const isDeadTunnel = !API_BASE || API_BASE.includes("trycloudflare.com");

  if (isLocalHost && !isDeadTunnel) {
    const backendPromise = (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 600);
        const response = await fetch(`${API_BASE}/tracking/${cleanWaybill}`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const json = await response.json();
          if (json?.ok && json?.data) return json;
        }
      } catch {
        return null;
      }
      return null;
    })();

    // Ambil respon pertama yang valid
    result = await Promise.race([
      supabasePromise.then((res) => (res?.ok && res?.data ? res : Promise.reject())),
      backendPromise.then((res) => (res?.ok && res?.data ? res : Promise.reject())),
    ]).catch(() => null);
  }

  // 5. Jika belum mendapatkan hasil dari balap paralel, tunggu hasil Supabase
  if (!result) {
    result = await supabasePromise;
  }

  if (result && result.ok && result.data) {
    trackingCache.set(cleanWaybill, result);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`anteraja_track_${cleanWaybill}`, JSON.stringify(result));
      }
    } catch {
      /* abaikan error sessionStorage quota */
    }
    return result;
  }

  throw new Error("Nomor resi tidak ditemukan, mohon periksa kembali input Anda.");
}

/**
 * Mengambil data tracking dari cache in-memory atau sessionStorage secara instan (0ms).
 */
export function getCachedTracking(waybill) {
  const cleanWaybill = cleanWaybillInput(waybill);
  if (!cleanWaybill) return null;
  if (trackingCache.has(cleanWaybill)) {
    return trackingCache.get(cleanWaybill);
  }
  if (allShipmentsData && allShipmentsData[cleanWaybill]) {
    const instantResult = { ok: true, data: allShipmentsData[cleanWaybill] };
    trackingCache.set(cleanWaybill, instantResult);
    return instantResult;
  }
  try {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(`anteraja_track_${cleanWaybill}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.data) {
          trackingCache.set(cleanWaybill, parsed);
          return parsed;
        }
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Melakukan prefetch data resi di latar belakang saat hover atau idle.
 */
export function prefetchTracking(waybill) {
  const cleanWaybill = cleanWaybillInput(waybill);
  if (!cleanWaybill || trackingCache.has(cleanWaybill)) return;
  fetchTrackingData(cleanWaybill).catch(() => null);
}

