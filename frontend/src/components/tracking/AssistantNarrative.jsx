import { useState } from "react";

/**
 * Kotak narasi Satria Assistant: avatar + badge AI, pesan naratif, dan
 * aksi (WhatsApp, bagikan status). Tombol bagikan memakai Web Share API
 * bila tersedia, kalau tidak teks disalin ke clipboard.
 */
export default function AssistantNarrative({ assistant, statusLabel, waybill }) {
  const [shareLabel, setShareLabel] = useState("Bagikan Status");
  const [feedbackStatus, setFeedbackStatus] = useState("idle");

  async function handleFeedback(membantu) {
    if (!waybill || feedbackStatus === "loading" || feedbackStatus === "success") return;
    
    setFeedbackStatus("loading");
    try {
      const response = await fetch("http://localhost:8000/api/v1/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          resi: waybill,
          membantu: membantu,
        }),
      });

      if (!response.ok) throw new Error("Gagal mengirim feedback");
      setFeedbackStatus("success");
    } catch (error) {
      console.error(error);
      setFeedbackStatus("error");
      setTimeout(() => setFeedbackStatus("idle"), 3000);
    }
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
                  <span className="flex items-center gap-1 font-label-sm text-label-sm text-success-base">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Terima kasih atas masukannya!
                  </span>
                ) : feedbackStatus === "error" ? (
                  <span className="font-label-sm text-label-sm text-error">Gagal mengirim</span>
                ) : (
                  <>
                    <button
                      onClick={() => handleFeedback(true)}
                      disabled={feedbackStatus === "loading"}
                      className="flex h-8 items-center gap-1 rounded-lg bg-surface-container-low px-3 font-label-sm text-label-sm text-on-surface transition-colors hover:bg-success-container hover:text-on-success-container disabled:opacity-50"
                      title="Membantu"
                    >
                      <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                      Ya
                    </button>
                    <button
                      onClick={() => handleFeedback(false)}
                      disabled={feedbackStatus === "loading"}
                      className="flex h-8 items-center gap-1 rounded-lg bg-surface-container-low px-3 font-label-sm text-label-sm text-on-surface transition-colors hover:bg-error-container hover:text-on-error-container disabled:opacity-50"
                      title="Kurang membantu"
                    >
                      <span className="material-symbols-outlined text-[16px]">thumb_down</span>
                      Tidak
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
