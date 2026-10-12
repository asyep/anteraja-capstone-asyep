/**
 * =============================================================================
 * AssistantNarrative.jsx - Kartu Diagnostik Narasi AI & Feedback Pelanggan
 * =============================================================================
 * SEKILAS PENJELASAN LOGIKA:
 * 1. Logika Feedback Instan (< 1 Detik):
 *    Saat user klik "Ya" atau "Tidak", tombol langsung memutar spinner ~350ms
 *    dan mengirim feedback ke Supabase. Tanpa menunggu lama, status berubah
 *    menjadi centang hijau "Terima kasih atas feedback Anda!" (Optimistic UI).
 * 2. Logika Pencegahan Duplikasi:
 *    Status feedback disimpan di `localStorage` per nomor resi (`anteraja_feedback_${waybill}`).
 *    Jika user membuka resi yang sama lagi, tombol otomatis sudah terkunci dalam status centang.
 * 3. Logika Bagikan Status:
 *    Mendeteksi ketersediaan `navigator.share` (smartphone). Jika tidak ada,
 *    otomatis menyalin ringkasan resi dan tautan URL ke clipboard pengguna.
 * =============================================================================
 */


import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "@/lib/api";
import { sendFeedbackToSupabase } from "@/lib/supabaseTracking";
import { regenerateAiNarrative, prefetchNextGeminiNarrative } from "@/lib/geminiClient";

export default function AssistantNarrative({
  assistant,
  statusLabel,
  waybill,
  isNotFound = false,
  secondaryAction = null,
  tertiaryAction = null,
}) {

  const [shareLabel, setShareLabel] = useState("Bagikan Status");
  const storageKey = waybill ? `anteraja_feedback_${waybill}` : null;
  const [feedbackStatus, setFeedbackStatus] = useState(() => {
    try {
      if (typeof window !== "undefined" && storageKey) {
        return localStorage.getItem(storageKey) === "done" ? "success" : "idle";
      }
    } catch {
      /* ignore */
    }
    return "idle";
  });
  const [activeChoice, setActiveChoice] = useState(null);

  // State untuk Live Gemini AI Regeneration
  const [liveNarrative, setLiveNarrative] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isLiveGemini, setIsLiveGemini] = useState(false);

  // Reset live narrative jika nomor resi berganti & prefetch narasi AI berikutnya di latar belakang
  useEffect(() => {
    setLiveNarrative(null);
    setIsLiveGemini(false);
    if (waybill && !isNotFound) {
      prefetchNextGeminiNarrative(waybill, {
        statusLabel,
        courierName: assistant?.courierName,
        customerCity: assistant?.customerCity,
        isNotFound,
      });
    }
  }, [waybill, assistant?.message, assistant?.courierName, assistant?.customerCity, statusLabel, isNotFound]);

  const handleRegenerateAi = useCallback(async () => {
    if (!waybill || isRegenerating) return;
    setIsRegenerating(true);

    try {
      // Micro-transition 250ms agar animasi pemrosesan terlihat jelas namun total durasi selalu < 1 detik
      const minDelayPromise = new Promise((resolve) => setTimeout(resolve, 250));
      const aiPromise = regenerateAiNarrative(waybill, {
        statusLabel,
        courierName: assistant?.courierName,
        customerCity: assistant?.customerCity,
        isNotFound,
      });

      const [result] = await Promise.all([aiPromise, minDelayPromise]);

      if (result && result.text) {
        setLiveNarrative(result.text);
        setIsLiveGemini(!result.is_fallback);
      }
    } catch {
      /* fallback */
    } finally {
      setIsRegenerating(false);
    }
  }, [waybill, isRegenerating, statusLabel, assistant?.courierName, assistant?.customerCity, isNotFound]);

  // Dengarkan sinyal klik 'Lacak Paket' dari search bar
  useEffect(() => {
    function handleRefreshSignal(event) {
      const targetResi = event?.detail?.waybill;
      if (!targetResi || targetResi === waybill) {
        handleRegenerateAi();
      }
    }
    window.addEventListener("anteraja_refresh_tracking", handleRefreshSignal);
    return () => window.removeEventListener("anteraja_refresh_tracking", handleRefreshSignal);
  }, [waybill, handleRegenerateAi]);

  async function handleFeedback(membantu) {
    if (!waybill || feedbackStatus === "loading" || feedbackStatus === "success") return;
    
    setActiveChoice(membantu);
    setFeedbackStatus("loading");

    // 1. Kirim langsung ke Supabase (~30-50ms) dengan batas maksimal 700ms
    const supabasePromise = Promise.race([
      sendFeedbackToSupabase(waybill, membantu),
      new Promise((resolve) => setTimeout(() => resolve(false), 700)),
    ]);

    // 2. Kirim juga ke backend lokal di background (fire-and-forget, non-blocking)
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 600);
      fetch(`${API_BASE}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          resi: waybill,
          membantu: Boolean(membantu),
        }),
        signal: controller.signal,
      })
        .catch(() => null)
        .finally(() => clearTimeout(timer));
    } catch {
      /* ignore */
    }

    // 3. Durasi animasi spinner ~350ms (pasti di bawah 1 detik, terasa cepat & responsif)
    const minDelayPromise = new Promise((resolve) => setTimeout(resolve, 350));

    await Promise.all([supabasePromise, minDelayPromise]);

    try {
      if (storageKey) {
        localStorage.setItem(storageKey, "done");
      }
    } catch {
      /* ignore */
    }

    setFeedbackStatus("success");
  }

  async function bagikanStatus() {
    const teks = `${statusLabel} — resi ${assistant.courierId}. Pantau di halaman pelacakan Anteraja.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Status Paket Anteraja",
          text: teks,
          url: window.location.href,
        });
        return;
      }
      await navigator.clipboard.writeText(`${teks} ${window.location.href}`);
      setShareLabel("Tautan Tersalin!");
      setTimeout(() => setShareLabel("Bagikan Status"), 2000);
    } catch {
      /* pengguna membatalkan share; abaikan */
    }
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-surface-container-lowest p-3.5 sm:p-space-lg shadow-lg">
      <div className="flex flex-col gap-3 w-full min-w-0">
        {/* Header: Avatar, Name, Badges & Courier Subtitle */}
        <div className="flex items-center gap-3 w-full min-w-0">
          <div className="relative shrink-0">
            <div className="h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-full bg-surface-container shadow-md ring-2 ring-primary-fixed">
              <img
                alt="Satria Assistant — asisten AI pengiriman"
                className="h-full w-full object-cover"
                src={assistant.avatar}
              />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-success-base ring-2 ring-surface-container-lowest"
              title="Online"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-headline-sm text-sm sm:text-headline-sm font-bold text-on-surface">
                {assistant.name}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-ai-surface px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-label-sm font-bold text-ai-accent whitespace-nowrap">
                <span className="material-symbols-outlined text-[12px] sm:text-[13px]">
                  auto_awesome
                </span>
                Satria AI
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-label-sm font-bold text-purple-700 whitespace-nowrap">
                <span className="material-symbols-outlined text-[12px] sm:text-[13px]">
                  psychology
                </span>
                Live Gemini
              </span>
              <span className="inline-flex items-center rounded-full bg-tertiary-fixed px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-label-sm font-bold text-on-tertiary-fixed whitespace-nowrap">
                Terverifikasi
              </span>
            </div>
            <span className="font-label-sm text-[11px] sm:text-label-sm font-medium text-on-surface-variant truncate mt-0.5">
              {assistant.courierId
                ? `${assistant.courierName} (ID: ${assistant.courierId})`
                : assistant.courierName}
            </span>
          </div>
        </div>

        {/* Narrative Quote Bubble */}
        <div className="w-full min-w-0 rounded-xl bg-surface-container-low/70 p-3 sm:p-space-md text-xs sm:text-sm md:text-base leading-relaxed text-on-surface break-words">
          {isRegenerating ? (
            <div className="flex items-center gap-2 py-0.5 text-primary">
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              <span className="text-xs sm:text-sm font-semibold animate-pulse">Satria AI Gemini sedang memproses pesan status terkini...</span>
            </div>
          ) : (
            <p className="break-words font-normal leading-relaxed">&ldquo;{liveNarrative || assistant.message}&rdquo;</p>
          )}
        </div>

        {/* Feedback Row */}
        {waybill && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-border-subtle bg-surface-container-lowest p-2.5 sm:p-3 shadow-xs">
            <span className="text-xs sm:text-sm font-medium text-on-surface-variant">
              Apakah informasi dari AI ini membantu Anda?
            </span>
            <div className="flex items-center gap-2">
              {feedbackStatus === "success" ? (
                <span className="flex items-center gap-1.5 font-label-sm text-xs sm:text-label-sm font-semibold text-success-base transition-opacity duration-200">
                  <span className="material-symbols-outlined text-[17px]">check_circle</span>
                  Terima kasih atas masukannya!
                </span>
              ) : feedbackStatus === "error" ? (
                <span className="font-label-sm text-xs sm:text-label-sm text-error">Gagal mengirim</span>
              ) : (
                <>
                  <button
                    onClick={() => handleFeedback(true)}
                    disabled={feedbackStatus === "loading"}
                    className="group flex h-8 items-center gap-1.5 rounded-lg border border-border-subtle/80 bg-surface-container-low px-3 font-label-sm text-xs sm:text-label-sm font-semibold text-on-surface transition-all duration-150 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm active:scale-95 disabled:opacity-75 cursor-pointer"
                    title="Membantu"
                  >
                    {feedbackStatus === "loading" && activeChoice === true ? (
                      <span className="material-symbols-outlined animate-spin text-[16px] text-emerald-600">
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px] text-text-muted transition-colors group-hover:text-emerald-600">
                        thumb_up
                      </span>
                    )}
                    <span>Ya</span>
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    disabled={feedbackStatus === "loading"}
                    className="group flex h-8 items-center gap-1.5 rounded-lg border border-border-subtle/80 bg-surface-container-low px-3 font-label-sm text-xs sm:text-label-sm font-semibold text-on-surface transition-all duration-150 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700 hover:shadow-sm active:scale-95 disabled:opacity-75 cursor-pointer"
                    title="Kurang membantu"
                  >
                    {feedbackStatus === "loading" && activeChoice === false ? (
                      <span className="material-symbols-outlined animate-spin text-[16px] text-rose-600">
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px] text-text-muted transition-colors group-hover:text-rose-600">
                        thumb_down
                      </span>
                    )}
                    <span>Tidak</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-space-sm pt-0.5">
          <a
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-secondary-container px-4 font-label-md text-xs sm:text-label-md font-bold text-on-secondary-container shadow-xs transition-all hover:bg-secondary-fixed active:scale-[0.98] w-full sm:w-auto"
            href={assistant.whatsapp}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            Hubungi Satria via WhatsApp
          </a>

          {secondaryAction ? (
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-surface-container-low px-4 font-label-md text-xs sm:text-label-md font-bold text-on-surface transition-all hover:bg-surface-container-high active:scale-[0.98] w-full sm:w-auto"
              onClick={secondaryAction.onClick}
              type="button"
            >
              {secondaryAction.icon && (
                <span className="material-symbols-outlined text-[18px]">
                  {secondaryAction.icon}
                </span>
              )}
              {secondaryAction.label}
            </button>
          ) : (
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-surface-container-low px-4 font-label-md text-xs sm:text-label-md font-bold text-on-surface transition-all hover:bg-surface-container-high active:scale-[0.98] w-full sm:w-auto"
              onClick={bagikanStatus}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                share
              </span>
              {shareLabel}
            </button>
          )}

          {tertiaryAction && (
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-surface-container-low px-4 font-label-md text-xs sm:text-label-md font-bold text-error transition-all hover:bg-error-surface active:scale-[0.98] w-full sm:w-auto"
              onClick={tertiaryAction.onClick}
              type="button"
            >
              {tertiaryAction.icon && (
                <span className="material-symbols-outlined text-[18px]">
                  {tertiaryAction.icon}
                </span>
              )}
              {tertiaryAction.label}
            </button>
          )}

          <div className="hidden sm:flex ml-auto items-center gap-1.5 font-body-sm text-body-sm text-text-muted">
            <span className="material-symbols-outlined text-[16px] text-success-base">
              verified
            </span>
            {assistant.protocol}
          </div>
        </div>
      </div>
    </div>
  );
}
