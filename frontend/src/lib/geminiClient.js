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

// Indeks memori lokal agar fallback berturut-turut selalu menghasilkan pesan yang berbeda
const lastFallbackIndexes = {};

function getDiverseFallback(category, pool) {
  const last = lastFallbackIndexes[category] ?? -1;
  let next = Math.floor(Math.random() * pool.length);
  if (pool.length > 1 && next === last) {
    next = (next + 1) % pool.length;
  }
  lastFallbackIndexes[category] = next;
  return pool[next];
}

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
      const timer = setTimeout(() => controller.abort(), 6000);

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

  // 2. Direct Call ke Google Gemini API (menggunakan VITE_GEMINI_API_KEY)
  if (GEMINI_API_KEY && GEMINI_API_KEY !== "your_gemini_api_key_here") {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8500);

      let stateGuideline = "Paket sedang dalam perjalanan logistik antarkota menuju kota tujuan.";
      if (isNotFound) {
        stateGuideline = "Nomor resi BELUM TERCATAT / belum ter-scan di staging store fisik kami (404). Jelaskan dengan tenang dan ramah bahwa seller mungkin baru mencetak label pengiriman atau paket fisik sedang diserahterimakan ke kurir Satria, dan sarankan untuk mengecek berkala.";
      } else if (isDelivered) {
        stateGuideline = "Paket sudah TELAH DITERIMA dengan sukses di alamat tujuan. Sampaikan ucapan selamat dan terima kasih karena telah mempercayakan pengiriman ke Anteraja.";
      } else if (isOutForDelivery) {
        stateGuideline = "Paket SEDANG DIANTAR oleh kurir Satria menuju rumah penerima. Ingatkan agar nomor handphone penerima aktif.";
      } else if (isOrderCreated) {
        stateGuideline = "Pesanan BARU SAJA DIBUAT oleh pengirim di sistem dan sedang menunggu penjemputan oleh kurir Satria.";
      } else if (isCourierProcessed) {
        stateGuideline = "Paket sudah dijemput dan SEDANG DIPROSES / disortir di Staging DC Hub sebelum diberangkatkan.";
      }

      const randomSeed = Math.random().toString(36).substring(2, 7);
      const prompt = `Anda adalah "Satria Assistant", asisten AI resmi dari ekspedisi Anteraja.
Tugas Anda: Buat narasi status pengiriman paket yang ramah, sopan, dan menenangkan hati pelanggan sesuai status saat ini.
Data Pengiriman:
- Resi: ${waybill}
- Status: ${context.statusLabel || (isNotFound ? "Resi Belum Tercatat" : "Sedang Diproses")}
- Kurir/Petugas: ${context.courierName || (isNotFound ? "Duta Layanan Pelanggan" : "Satria Operasional")}
- Panduan Konteks Status: ${stateGuideline}
- Variasi ID: ${randomSeed}

Aturan:
1. Gunakan Bahasa Indonesia santai dan ramah (sapaan: "Halo Kak!").
2. Buat narasi yang segar, kreatif, berbeda dari template standar, dan jangan kaku.
3. Panjang teks 150 - 250 karakter (2-3 kalimat).
4. Jangan sebut kode internal teknis logistik (misal: MANIFESTED, HUB_01).
5. Berikan HANYA teks narasi langsung tanpa tanda kutip.`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 500 },
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);

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
      /* Direct Gemini gagal / timeout; lanjutkan ke diverse fallback pool */
    }
  }

  // 3. Fallback Variatif Berkelanjutan (Kumpulan beragam pesan dinamis per status)
  const destCity = context.customerCity ? `ke ${context.customerCity}` : "ke alamat tujuan";
  
  if (isNotFound) {
    const notFoundPool = [
      "Halo Kak! Nomor resi ini belum terbaca di sistem pelacakan Anteraja. Hal ini umumnya terjadi karena pihak pengirim baru membuat label dan paket fisik belum di-scan di hub kami. Silakan cek berkala ya!",
      "Update Satria Assistant: Resi belum tercatat di data logistik kami. Mohon pastikan digit resi yang dimasukkan sudah tepat atau tanyakan ke pihak pengirim apakah paket sudah diserahkan ke kurir.",
      "Halo Kak! Paket dengan nomor resi ini masih dalam tahap penyerahan dari pihak penjual. Sistem kami akan otomatis memperbarui status begitu paket pertama kali di-scan oleh Satria.",
      "Perhatian: Data pelacakan resi ini belum tersedia. Kurir Satria siap memproses paket begitu diserahkan dari pihak seller. Cek kembali secara berkala ya Kak!",
    ];
    return {
      ok: true,
      text: getDiverseFallback("not_found", notFoundPool),
      title: "Satria Assistant",
      subtitle: "Duta Layanan Pelanggan (Satria AI)",
      provider: "gemini",
      is_fallback: true,
    };
  }

  if (isDelivered) {
    const deliveredPool = [
      `Kabar gembira Kak! Paketmu telah berhasil diantar dan diterima dengan aman di alamat tujuan ${destCity}. Terima kasih telah mempercayakan pengiriman Anda kepada Anteraja!`,
      `Alhamdulillah, paketmu sudah sukses mendarat dengan selamat! Senang sekali Satria Anteraja bisa mengantarkan kebutuhanmu hari ini. Sampai jumpa di pengiriman selanjutnya ya Kak!`,
      `Halo Kak! Pengiriman paketmu telah selesai dengan sukses. Tim kurir Satria berterima kasih atas sambutan ramah dari penerima. Semoga harimu menyenangkan!`,
      `Paket telah diterima dengan baik di lokasi tujuan. Kami pastikan proses serah terima berjalan sesuai protokol Satria Sigap & Aman. Terima kasih telah memilih Anteraja!`,
    ];
    return {
      ok: true,
      text: getDiverseFallback("delivered", deliveredPool),
      title: "Satria Assistant",
      subtitle: "Satria AI Assistant",
      provider: "gemini",
      is_fallback: true,
    };
  }

  if (isOutForDelivery) {
    const outPool = [
      `Halo Kak! Paketmu saat ini sudah dibawa oleh kurir Satria dan sedang bergerak menuju alamat rumahmu. Pastikan nomor HP aktif ya agar kurir mudah menghubungi saat tiba!`,
      `Update Kurir Satria: Paketmu sedang dalam perjalanan pengantaran putaran terakhir hari ini. Satria berupaya tiba secepatnya di depan pintumu!`,
      `Siap-siap ya Kak! Kurir Satria sedang melaju menuju lokasi tujuanmu. Pastikan ada orang di rumah untuk menerima paketmu dengan aman.`,
      `Halo Kak! Pengantaran paketmu sedang berlangsung. Armada Satria mengutamakan keselamatan dan ketepatan waktu pengantaran paketmu hari ini.`,
    ];
    return {
      ok: true,
      text: getDiverseFallback("out_for_delivery", outPool),
      title: "Satria Assistant",
      subtitle: "Satria AI Assistant",
      provider: "gemini",
      is_fallback: true,
    };
  }

  if (isOrderCreated) {
    const orderCreatedPool = [
      `Halo Kak! Pesanan kamu baru saja dibuat oleh pengirim. Saat ini sistem kami sedang mengalokasikan Satria untuk segera menjemput paket ke lokasi pengirim. Pantau terus ya!`,
      `Update Satria: Tiket penjemputan paket telah terbit. Kurir Satria terdekat sedang ditugaskan menuju lokasi seller untuk serah terima paket fisik.`,
      `Halo Kak! Data resi pengiriman sudah tersinkronisasi di sistem. Begitu pihak seller siap, kurir Satria langsung meluncur melakukan penjemputan barang.`,
      `Pesanan baru terdaftar di Anteraja! Kami siap mengambil dan meneruskan paketmu secepat mungkin. Nantikan pembaruan berikutnya ya Kak!`,
    ];
    return {
      ok: true,
      text: getDiverseFallback("order_created", orderCreatedPool),
      title: "Satria Assistant",
      subtitle: "Satria AI Assistant",
      provider: "gemini",
      is_fallback: true,
    };
  }

  if (isCourierProcessed) {
    const processedPool = [
      `Halo Kak! Paketmu sudah berhasil dijemput dan saat ini sedang disortir serta diverifikasi di Staging DC Hub sebelum diberangkatkan ke kota tujuan. Pantau terus ya!`,
      `Update dari Staging Hub: Paketmu telah lulus pemindaian barcode dan dimasukkan ke dalam container armada ekspedisi utama. Perjalanan segera dimulai!`,
      `Halo Kak! Paket fisik sudah berada di fasilitas sortir Anteraja. Tim Satria memastikan paket dipacking dan dikelompokkan dengan sangat rapi dan aman.`,
      `Paketmu sedang disiapkan untuk keberangkatan logistik antarkota. Semua proses pemilahan berjalan lancar sesuai standar operasional Anteraja.`,
    ];
    return {
      ok: true,
      text: getDiverseFallback("courier_processed", processedPool),
      title: "Satria Assistant",
      subtitle: "Satria AI Assistant",
      provider: "gemini",
      is_fallback: true,
    };
  }

  // Default: In-Transit (perjalanan)
  const inTransitPool = [
    `Halo Kak! Paketmu saat ini sedang dalam perjalanan aman ${destCity} bersama armada Satria Anteraja. Kami pastikan pengantaran tetap sesuai estimasi ya!`,
    `Update Satria Assistant: Armada logistik sedang melaju stabil di jalur transit antarkota. Kondisi cuaca dan laju kendaraan terpantau prima menuju ${destCity}.`,
    `Halo Kak! Satria AI terus memantau posisi armada yang membawa paketmu. Rute berjalan lancar dan paketmu diproyeksikan mendarat tepat pada waktunya.`,
    `Kabar baik Kak! Paketmu sedang bergerak di koridor ekspedisi utama. Tim operasional Satria mengawal penuh keamanan paketmu hingga tiba di kota tujuan.`,
    `Pemberitahuan Satria AI: Perjalanan transit berlangsung kondusif. Kami terus mengoptimalkan rute logistik agar paket kesayanganmu tiba secepatnya di ${destCity}!`,
    `Halo Kak! Kurir armada Satria sedang menempuh rute pengiriman berikutnya. Paketmu tersimpan rapi dan aman di kendaraan berpelindung cuaca Anteraja.`,
    `Info terkini Satria: Seluruh sistem tracking terhubung aktif via telemetri GPS. Paketmu melaju dengan kecepatan stabil menuju fasilitas hub terdekat.`,
  ];

  return {
    ok: true,
    text: getDiverseFallback("in_transit", inTransitPool),
    title: "Satria Assistant",
    subtitle: "Satria AI Assistant",
    provider: "gemini",
    is_fallback: true,
  };
}
