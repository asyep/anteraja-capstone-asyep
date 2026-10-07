import { useState } from "react";

/**
 * Kotak narasi Satria Assistant: avatar + badge AI, pesan naratif, dan
 * aksi (WhatsApp, bagikan status). Tombol bagikan memakai Web Share API
 * bila tersedia, kalau tidak teks disalin ke clipboard.
 */
export default function AssistantNarrative({ assistant, statusLabel }) {
  const [shareLabel, setShareLabel] = useState("Bagikan Status");

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
