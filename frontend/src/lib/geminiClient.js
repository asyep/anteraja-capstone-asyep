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
  const statusUpper = (context.statusLabel || "").toUpperCase();
  const isNotFound = Boolean(
    context.isNotFound ||
    statusUpper.includes("TIDAK DITEMUKAN") ||
    statusUpper.includes("BELUM TERCATAT") ||
    statusUpper.includes("404") ||
    statusUpper.includes("DIBATALKAN")
  );
  const isDelivered = statusUpper.includes("DITERIMA") || statusUpper.includes("TIBA DI TUJUAN") || statusUpper.includes("DELIVERED");
  const isOutForDelivery = statusUpper.includes("DIANTAR") || statusUpper.includes("PENGANTARAN") || statusUpper.includes("OUT_FOR_DELIVERY");
  const isOrderCreated = statusUpper.includes("DIBUAT") || statusUpper.includes("ORDER_CREATED") || statusUpper.includes("MENUNGGU PENJEMPUTAN") || statusUpper.includes("MENUNGGU PICKUP");
  const isCourierProcessed = statusUpper.includes("DIPROSES") || statusUpper.includes("STAGING") || statusUpper.includes("DC") || statusUpper.includes("COURIER_PROCESSED");

  // 1. Coba panggil Laravel Backend API (hanya jika bukan state resi belum tercatat / not found)
  if (!isNotFound) {
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
  }

  // 2. Direct Call ke Google Gemini API (jika VITE_GEMINI_API_KEY tersedia di frontend)
  if (GEMINI_API_KEY) {
    try {
      let stateGuideline = "Paket sedang dalam perjalanan logistik antarkota menuju kota tujuan.";
      if (isNotFound) {
        stateGuideline = "Nomor resi BELUM TERCATAT / belum ter-scan di staging store fisik kami (404). Jelaskan dengan tenang dan ramah bahwa seller mungkin baru mencetak label pengiriman atau paket fisik sedang diserahterimakan ke kurir Satria, dan sarankan untuk mengecek berkala atau memeriksa kembali kebenaran digit resi.";
      } else if (isDelivered) {
        stateGuideline = "Paket sudah TELAH DITERIMA dengan sukses di alamat tujuan. Sampaikan ucapan selamat dan terima kasih karena telah mempercayakan pengiriman ke Anteraja.";
      } else if (isOutForDelivery) {
        stateGuideline = "Paket SEDANG DIANTAR oleh kurir Satria menuju rumah penerima. Ingatkan agar nomor handphone penerima aktif.";
      } else if (isOrderCreated) {
        stateGuideline = "Pesanan BARU SAJA DIBUAT oleh pengirim di sistem dan sedang menunggu penjemputan oleh kurir Satria.";
      } else if (isCourierProcessed) {
        stateGuideline = "Paket sudah dijemput dan SEDANG DIPROSES / disortir di Staging DC Hub sebelum diberangkatkan.";
      }

      const prompt = `Anda adalah "Satria Assistant", asisten AI resmi dari ekspedisi Anteraja.
Tugas Anda: Buat narasi status pengiriman paket yang ramah, sopan, dan menenangkan hati pelanggan sesuai status saat ini.
Data Pengiriman:
- Resi: ${waybill}
- Status: ${context.statusLabel || (isNotFound ? "Resi Belum Tercatat" : "Sedang Diproses")}
- Kurir/Petugas: ${context.courierName || (isNotFound ? "Duta Layanan Pelanggan" : "Satria Operasional")}
- Panduan Konteks Status: ${stateGuideline}

Aturan:
1. Gunakan Bahasa Indonesia santai dan ramah (sapaan: "Halo Kak!").
2. Panjang teks 150 - 250 karakter (2-3 kalimat).
3. Jangan sebut kode internal teknis logistik (misal: MANIFESTED, HUB_01).
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

  // 3. Fallback jika kedua jalur di atas tidak dapat diakses (Sesuai State Spesifik)
  const destCity = context.customerCity ? `ke ${context.customerCity}` : "ke alamat tujuan";
  let fallbackText = `Halo Kak! Paketmu saat ini sedang dalam perjalanan aman ${destCity} bersama armada Satria Anteraja. Kami pastikan pengantaran tetap sesuai estimasi ya!`;

  if (isNotFound) {
    fallbackText = "Halo Kak! Nomor resi ini belum terbaca di sistem pelacakan Anteraja. Hal ini umumnya terjadi karena pihak pengirim baru membuat label dan paket fisik belum di-scan di hub kami, atau terdapat kekeliruan pengetikan digit resi. Silakan cek berkala ya!";
  } else if (isDelivered) {
    fallbackText = `Kabar gembira Kak! Paketmu telah berhasil diantar dan diterima dengan aman di alamat tujuan. Terima kasih telah mempercayakan pengiriman Anda kepada Anteraja!`;
  } else if (isOutForDelivery) {
    fallbackText = `Halo Kak! Paketmu saat ini sudah dibawa oleh kurir Satria dan sedang bergerak menuju alamat rumahmu. Pastikan nomor HP aktif ya agar kurir mudah menghubungi saat tiba!`;
  } else if (isOrderCreated) {
    fallbackText = `Halo Kak! Pesanan kamu baru saja dibuat oleh pengirim. Saat ini sistem kami sedang mengalokasikan Satria untuk segera menjemput paket ke lokasi pengirim. Pantau terus update terbarunya di sini ya!`;
  } else if (isCourierProcessed) {
    fallbackText = `Halo Kak! Paketmu sudah berhasil dijemput dan saat ini sedang disortir serta diverifikasi di Staging DC Hub sebelum diberangkatkan ke kota tujuan. Pantau terus ya!`;
  }

  return {
    ok: true,
    text: fallbackText,
    title: "Satria Assistant",
    subtitle: isNotFound ? "Duta Layanan Pelanggan (Satria AI)" : "Satria AI Assistant",
    provider: "gemini",
    is_fallback: true,
  };
}
