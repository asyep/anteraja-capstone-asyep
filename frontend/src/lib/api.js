/**
 * =============================================================================
 * api.js - Centralized API Gateway & High-Speed Cache Layer
 * =============================================================================
 * Menangani seluruh pengambilan data pelacakan resi dengan strategi multi-tier:
 * 1. Tier 1: In-Memory Map Cache (0ms - instant transition)
 * 2. Tier 2: Pre-bundled Local Master Dataset (0ms - 80+ nomor resi terdaftar)
 * 3. Tier 3: Browser SessionStorage Cache (persisten selama sesi tab aktif)
 * 4. Tier 4: Parallel Race antara Supabase Cloud API & Local Laravel API (< 500ms)
 */

import { fetchTrackingFromSupabase } from "./supabaseTracking";
import allShipmentsData from "../data/allShipmentsData.json";

/**
 * Konfigurasi URL dasar API backend (Laravel).
 * Menggunakan environment variable `VITE_API_URL` dengan fallback ke localhost.
 */
const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
export const API_BASE = RAW_API_URL.replace(/\/+$/, "");

/**
 * Cache memori lokal (RAM) agar pencarian berulang atau navigasi antar tab
 * tidak memerlukan network request ulang.
 */
const trackingCache = new Map();

/**
 * Membersihkan format nomor resi dari karakter non-alfanumerik.
 * @param {string|number} waybill - Nomor resi mentah.
 * @returns {string} Nomor resi bersih.
 */
function cleanWaybillInput(waybill) {
  if (waybill == null) return "";
  return String(waybill).replace(/[^a-zA-Z0-9]/g, "").trim();
}

/**
 * Mengambil data detail pelacakan untuk nomor resi tertentu.
 * Mengimplementasikan pola 'Stale-While-Revalidate' untuk kecepatan maksimal.
 *
 * @param {string} waybill - Nomor resi paket.
 * @returns {Promise<{ ok: boolean, data: Object }>}
 * @throws {Error} Jika nomor resi kosong atau tidak ditemukan.
 */
export async function fetchTrackingData(waybill) {
  const cleanWaybill = cleanWaybillInput(waybill);
  if (!cleanWaybill) {
    throw new Error("Nomor resi wajib diisi");
  }

  // --- Tier 1: Cek In-Memory Cache (0ms) ---
  if (trackingCache.has(cleanWaybill)) {
    return trackingCache.get(cleanWaybill);
  }

  // --- Tier 2: Cek Master Dataset Lokal (0ms) ---
  if (allShipmentsData && allShipmentsData[cleanWaybill]) {
    const instantResult = { ok: true, data: allShipmentsData[cleanWaybill] };
    trackingCache.set(cleanWaybill, instantResult);

    // Revalidasi data segar dari cloud di latar belakang tanpa memblokir UI
    fetchTrackingFromSupabase(cleanWaybill)
      .then((fresh) => {
        if (fresh?.ok && fresh?.data) {
          trackingCache.set(cleanWaybill, fresh);
        }
      })
      .catch(() => null);

    return instantResult;
  }

  // --- Tier 3: Cek SessionStorage Browser ---
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
    /* Abaikan jika storage browser tidak dapat diakses */
  }

  // --- Tier 4: Pengambilan Data Jaringan (Supabase Cloud + Backend Laravel) ---
  const supabasePromise = fetchTrackingFromSupabase(cleanWaybill);
  let result = null;

  const isLocalHost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const isDeadTunnel = !API_BASE || API_BASE.includes("trycloudflare.com");

  // Jika di localhost, jalankan balap paralel antara Laravel API dan Supabase Cloud
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

    // Ambil respon tercepat yang berhasil
    result = await Promise.race([
      supabasePromise.then((res) => (res?.ok && res?.data ? res : Promise.reject())),
      backendPromise.then((res) => (res?.ok && res?.data ? res : Promise.reject())),
    ]).catch(() => null);
  }

  // Jika balap paralel belum selesai / bukan di localhost, tunggu respon Supabase
  if (!result) {
    result = await supabasePromise;
  }

  // Simpan ke cache jika data berhasil didapatkan
  if (result && result.ok && result.data) {
    trackingCache.set(cleanWaybill, result);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`anteraja_track_${cleanWaybill}`, JSON.stringify(result));
      }
    } catch {
      /* Abaikan jika kuota sessionStorage penuh */
    }
    return result;
  }

  throw new Error("Nomor resi tidak ditemukan, mohon periksa kembali input Anda.");
}

/**
 * Mengambil data tracking yang tersimpan di cache secara sinkron (0ms).
 * Digunakan untuk render instan sebelum network request selesai.
 *
 * @param {string} waybill - Nomor resi.
 * @returns {{ ok: boolean, data: Object } | null}
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
    /* Abaikan jika storage gagal dibaca */
  }

  return null;
}

/**
 * Memuat data resi ke dalam cache di latar belakang (prefetch).
 * Berguna saat pengguna mengarahkan kursor (hover) pada tombol atau riwayat pencarian.
 *
 * @param {string} waybill - Nomor resi.
 */
export function prefetchTracking(waybill) {
  const cleanWaybill = cleanWaybillInput(waybill);
  if (!cleanWaybill || trackingCache.has(cleanWaybill)) return;
  fetchTrackingData(cleanWaybill).catch(() => null);
}
