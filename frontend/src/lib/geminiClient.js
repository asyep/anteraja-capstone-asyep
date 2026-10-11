/**
 * =============================================================================
 * geminiClient.js - Live Gemini AI Generator & Client Gateway
 * =============================================================================
 * Berfungsi untuk memicu regenerasi narasi AI secara live:
 * 1. Mengutamakan pemanggilan ke Backend Laravel (POST /api/v1/tracking/:waybill/regenerate-ai).
 * 2. Menyediakan direct client fallback ke Google Gemini API (gemini-1.5-flash) jika backend
 *    sedang offline dan user memasang VITE_GEMINI_API_KEY di environment frontend.
 * =============================================================================
 */

import { API_BASE } from "./api";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-3.5-flash-lite";

/**
 * Meminta narasi AI baru secara live untuk nomor resi tertentu.
 *
 * @param {string} waybill - Nomor resi paket
 * @param {Object} context - Konteks data pengiriman untuk direct fallback
 * @returns {Promise<{ ok: boolean, text: string, provider: string, is_fallback: boolean }>}
 */
export async function regenerateAiNarrative(waybill, context = {}) {
  // 1. Coba panggil Laravel Backend API
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE}/tracking/${waybill}/regenerate-ai`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (response.ok) {
      const json = await response.json();
      if (json?.ok && json?.data?.text) {
        return {
          ok: true,
          text: json.data.text,
          title: json.data.title || "Satria Assistant",
          subtitle: json.data.subtitle || "Satria AI Live Assistant",
          provider: json.data.provider || "gemini",
          is_fallback: Boolean(json.data.is_fallback),
        };
      }
    }
  } catch {
    /* Backend offline atau timeout; lanjutkan ke direct client fallback */
  }

  // 2. Direct Call ke Google Gemini API (jika VITE_GEMINI_API_KEY tersedia di frontend)
  if (GEMINI_API_KEY) {
    try {
      const prompt = `Anda adalah "Satria Assistant", asisten AI resmi dari ekspedisi Anteraja.
Tugas Anda: Buat narasi status pengiriman paket yang ramah, sopan, dan menenangkan hati pelanggan.
Data Pengiriman:
- Resi: ${waybill}
- Status: ${context.statusLabel || "Sedang Diproses"}
- Kurir: ${context.courierName || "Satria Operasional"}
- Asal ke Tujuan: ${context.sellerCity || "Kota Pengirim"} ke ${context.customerCity || "Kota Tujuan"}

Aturan:
1. Gunakan Bahasa Indonesia santai dan ramah (sapaan: "Halo Kak!").
2. Panjang teks 150 - 250 karakter.
3. Jangan sebut kode internal teknis logistik.
4. Berikan HANYA teks narasi langsung tanpa tanda kutip.`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
        }),
      });

      if (res.ok) {
        const geminiJson = await res.json();
        const generatedText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          const cleanText = generatedText.trim().replace(/^["']|["']$/g, "");
          return {
            ok: true,
            text: cleanText,
            title: "Satria Assistant",
            subtitle: "Satria AI Live (Gemini Direct)",
            provider: "gemini",
            is_fallback: false,
          };
        }
      }
    } catch {
      /* Direct Gemini gagal; fallback ke template statis */
    }
  }

  // 3. Fallback jika kedua jalur di atas tidak dapat diakses
  const destCity = context.customerCity ? `ke ${context.customerCity}` : "ke alamat tujuan";
  return {
    ok: true,
    text: `Halo Kak! Paketmu saat ini sedang bergerak aman ${destCity} bersama armada Satria Anteraja. Kami pastikan pengantaran tetap sesuai estimasi ya!`,
    title: "Satria Assistant",
    subtitle: "Satria AI Assistant (Fallback)",
    provider: "gemini",
    is_fallback: true,
  };
}
