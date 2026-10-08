import { useState } from "react";
import { submitFeedback } from "../../services/api";

export default function AINarrativeBox({ shipment }) {
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  if (!shipment || !shipment.ai_narrative) return null;

  const { ai_narrative } = shipment;

  async function sendFeedback(helpful) {
    if (submitting) return;

    setSubmitting(true);
    setFeedbackMessage("");

    try {
      const result = await submitFeedback({
        waybill: shipment.waybill_number,
        helpful,
      });
      setFeedbackMessage(result.message ?? "Terima kasih atas masukan Anda.");
    } catch (error) {
      setFeedbackMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-magenta/5 to-transparent border border-magenta/10 rounded-2xl p-5 sm:p-6 relative overflow-hidden group">
      {/* Dekorasi Abstract AI */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-magenta/5 rounded-full blur-2xl group-hover:bg-magenta/10 transition-colors duration-500"></div>

      <div className="flex gap-4 relative z-10">
        <div className="shrink-0 relative" role="img" aria-label="Avatar Satria">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-sm border border-stone-200/60 flex items-center justify-center overflow-hidden">
            <span className="text-xs font-black text-magenta" aria-hidden="true">
              S
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-success rounded-full border-2 border-white"></div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-ink text-sm sm:text-base">
              Satria AI Assistant
            </h3>
            <span className="bg-magenta text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Beta
            </span>
          </div>

          <p className="text-sm text-ink/80 leading-relaxed max-w-prose" aria-label={`Narasi Satria, ${ai_narrative.text.length} karakter`}>
            {ai_narrative.text}
          </p>

          {ai_narrative.is_fallback && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-muted bg-stone-100 px-2 py-1 rounded-md">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Pesan sistem standar (Fallback Mode)
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-magenta/10 pt-3">
            <span className="mr-1 text-xs font-semibold text-ink/70">
              Apakah penjelasan ini membantu?
            </span>
            <button
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 disabled:cursor-wait disabled:opacity-60"
              disabled={submitting}
              onClick={() => sendFeedback(true)}
              type="button"
            >
              Membantu
            </button>
            <button
              className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink/80 disabled:cursor-wait disabled:opacity-60"
              disabled={submitting}
              onClick={() => sendFeedback(false)}
              type="button"
            >
              Kurang jelas
            </button>
            {feedbackMessage && (
              <p aria-live="polite" className="w-full text-xs text-ink/70">
                {feedbackMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
