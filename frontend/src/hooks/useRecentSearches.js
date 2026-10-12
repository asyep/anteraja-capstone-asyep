import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "anteraja_recent_searches";
const EVENT_NAME = "anteraja_recent_searches_updated";
const MAX_ITEMS = 5;

// Bersihkan peninggalan riwayat lama di localStorage agar tidak membekas dari sesi sebelumnya
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Membaca riwayat nomor resi dari sessionStorage (reset otomatis saat tab/browser ditutup).
 */
export function getStoredRecentSearches() {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "string" && /^\d{14}$/.test(item))
      : [];
  } catch {
    return [];
  }
}

/**
 * Menyimpan nomor resi ke riwayat pencarian (ditaruh di paling awal).
 * Menggunakan sessionStorage sehingga riwayat hanya bertahan selama sesi aktif web belum ditutup.
 * Hanya menyimpan nomor resi yang tepat 14 digit numerik.
 */
export function saveRecentSearch(waybill) {
  if (!waybill || typeof window === "undefined") return;
  const clean = String(waybill).replace(/\D/g, "").slice(0, 14);
  if (clean.length !== 14) return;

  try {
    const current = getStoredRecentSearches();
    // Hilangkan duplikat nomor resi yang sama
    const filtered = current.filter((item) => item !== clean);
    const updated = [clean, ...filtered].slice(0, MAX_ITEMS);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (error) {
    console.error("Gagal menyimpan riwayat pencarian:", error);
  }
}

/**
 * Menghapus seluruh riwayat pencarian dalam sesi aktif.
 */
export function clearStoredRecentSearches() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (error) {
    console.error("Gagal menghapus riwayat pencarian:", error);
  }
}

/**
 * Hook untuk reaktif membaca dan memanipulasi riwayat pencarian resi.
 */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState(getStoredRecentSearches);

  useEffect(() => {
    function handleUpdate() {
      setRecentSearches(getStoredRecentSearches());
    }

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const addSearch = useCallback((waybill) => {
    saveRecentSearch(waybill);
  }, []);

  const clearSearches = useCallback(() => {
    clearStoredRecentSearches();
  }, []);

  return {
    recentSearches,
    addSearch,
    clearSearches,
  };
}
