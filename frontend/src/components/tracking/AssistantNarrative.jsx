/**
 * =============================================================================
 * AssistantNarrative.jsx - Kartu Diagnostik Narasi AI & Feedback Pelanggan
 * =============================================================================
 * Menampilkan pesan narasi cerdas Satria AI yang menjelaskan status paket
 * dalam bahasa manusia yang ramah, serta menyediakan aksi interaktif:
 * 1. Narasi Cerdas: Menjelaskan kondisi pengiriman dan perkiraan langkah berikutnya.
 * 2. Tombol Aksi Cepat: Hubungi CS via WhatsApp resmi dan Bagikan Status (Web Share API).
 * 3. Quick Feedback: Tombol konfirmasi "Apakah informasi ini membantu?"
 *    dengan proses instan (< 1 detik) ke Supabase dan backend Laravel.
 */

import { useState } from "react";
import { API_BASE } from "@/lib/api";
import { sendFeedbackToSupabase } from "@/lib/supabaseTracking";

export default function AssistantNarrative({ assistant, statusLabel, waybill }) {

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
    <div className="relative w-full overflow-hidden rounded-2xl bg-surface-container-lowest p-space-lg shadow-lg">
      <div className="flex items-start gap-space-md">
        <div className="relative shrink-0">
          <div className="h-14 w-14 overflow-hidden rounded-full bg-surface-container shadow-md ring-2 ring-primary-fixed">
            <img
              alt="Satria Assistant — asisten AI pengiriman"
              className="h-full w-full object-cover"
              src={assistant.avatar}
            />
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-success-base ring-2 ring-surface-container-lowest"
            title="Online"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-space-xs">
          <div className="flex flex-wrap items-center justify-between gap-space-xs">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {assistant.name}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-ai-surface px-2.5 py-0.5 font-label-sm text-label-sm font-bold text-ai-accent">
                <span className="material-symbols-outlined text-[13px]">
                  auto_awesome
                </span>
                Satria AI
              </span>
              <span className="rounded-full bg-tertiary-fixed px-2 py-0.5 font-label-sm text-label-sm font-bold text-on-tertiary-fixed">
                Terverifikasi
              </span>
            </div>
            <span className="font-label-sm text-label-sm font-medium text-on-surface-variant">
              {assistant.courierId
                ? `${assistant.courierName} (ID: ${assistant.courierId})`
                : assistant.courierName}
            </span>
          </div>

          <p className="mt-1 rounded-xl bg-surface-container-low/70 p-space-md font-body-lg text-body-lg leading-relaxed text-on-surface">
            &ldquo;{assistant.message}&rdquo;
          </p>

          {waybill && (
            <div className="mt-1 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface-container-lowest p-3 shadow-sm sm:flex-nowrap">
              <span className="font-label-sm text-label-sm font-medium text-on-surface-variant">
                Apakah informasi dari AI ini membantu Anda?
              </span>
              <div className="flex gap-2">
                {feedbackStatus === "success" ? (
                  <span className="flex items-center gap-1.5 font-label-sm text-label-sm font-semibold text-success-base transition-opacity duration-200">
                    <span className="material-symbols-outlined text-[17px]">check_circle</span>
                    Terima kasih atas masukannya!
                  </span>
                ) : feedbackStatus === "error" ? (
                  <span className="font-label-sm text-label-sm text-error">Gagal mengirim</span>
                ) : (
                  <>
                    <button
                      onClick={() => handleFeedback(true)}
                      disabled={feedbackStatus === "loading"}
                      className="group flex h-8 items-center gap-1.5 rounded-lg border border-border-subtle/80 bg-surface-container-low px-3 font-label-sm text-label-sm font-semibold text-on-surface transition-all duration-150 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm active:scale-95 disabled:opacity-75 cursor-pointer"
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
                      className="group flex h-8 items-center gap-1.5 rounded-lg border border-border-subtle/80 bg-surface-container-low px-3 font-label-sm text-label-sm font-semibold text-on-surface transition-all duration-150 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700 hover:shadow-sm active:scale-95 disabled:opacity-75 cursor-pointer"
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

          <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
            <a
              className="flex h-11 items-center gap-2 rounded-xl bg-secondary-container px-space-md font-label-md text-label-md font-bold text-on-secondary-container shadow-sm transition-all hover:bg-secondary-fixed active:scale-[0.98]"
              href={assistant.whatsapp}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              Hubungi Satria via WhatsApp
            </a>

            <button
              className="flex h-11 items-center gap-2 rounded-xl bg-surface-container-low px-space-md font-label-md text-label-md font-bold text-on-surface transition-all hover:bg-surface-container-high active:scale-[0.98]"
              onClick={bagikanStatus}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                share
              </span>
              {shareLabel}
            </button>

            <div className="ml-auto hidden items-center gap-1.5 font-body-sm text-body-sm text-text-muted sm:flex">
              <span className="material-symbols-outlined text-[16px] text-success-base">
                verified
              </span>
              {assistant.protocol}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
