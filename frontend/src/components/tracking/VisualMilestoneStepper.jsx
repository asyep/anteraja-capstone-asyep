import React from "react";
import { MILESTONE_STAGES } from "../../utils/constants";
import { formatWibTimestamp } from "../../utils/formatters";

export default function VisualMilestoneStepper({ shipment }) {
  if (!shipment) return null;

  const { order_status, milestone_stages = [] } = shipment;

  if (order_status === "canceled") {
    return (
      <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mb-1">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-rose-800 mb-1">
            Pengiriman Dibatalkan
          </h3>
          <p className="text-sm text-rose-800/80 max-w-sm mx-auto">
            Proses pengiriman untuk nomor resi ini telah dihentikan.
          </p>
        </div>
      </div>
    );
  }

  // Helper untuk menentukan icon dan warna berdasarkan status stage
  const getStageStyles = (status) => {
    switch (status) {
      case "completed":
        return {
          icon: (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
          bg: "bg-[#10B981]",
          border: "border-[#10B981]",
          text: "text-emerald-800 font-bold",
          line: "bg-[#10B981]",
        };
      case "current":
        return {
          icon: <div className="w-2.5 h-2.5 bg-magenta rounded-full"></div>,
          bg: "bg-white",
          border: "border-magenta border-2",
          text: "text-magenta font-bold",
          line: "bg-stone-200",
        };
      case "pending":
      default:
        return {
          icon: null,
          bg: "bg-white",
          border: "border-stone-300",
          text: "text-muted font-medium",
          line: "bg-stone-200",
        };
    }
  };

  const orderedStages = MILESTONE_STAGES.map((stage) =>
    milestone_stages.find((item) => {
      const code = String(item.stage ?? item.code ?? "")
        .replace(/[\s-]+/g, "_")
        .toUpperCase();
      return code === stage.code;
    }) ?? { stage: stage.code, status: "pending", timestamp: null },
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 p-5 sm:p-7 shadow-sm">
      <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-6">
        Status Perjalanan
      </h3>

      <div className="relative">
        <div className="absolute left-4 top-2 bottom-6 w-0.5 bg-stone-100 sm:left-1/2 sm:-ml-[1px] sm:top-4 sm:bottom-auto sm:w-full sm:h-0.5 sm:-translate-y-1/2 z-0"></div>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-0 justify-between relative z-10">
          {orderedStages.map((stageItem, index) => {
            const styles = getStageStyles(stageItem.status);
            const stageName =
              MILESTONE_STAGES[index].label;

            return (
              <div
                key={MILESTONE_STAGES[index].code}
                className="flex sm:flex-col items-start sm:items-center relative w-full group"
              >
                {/* Horizontal line for desktop (hidden on last item) */}
                {index < orderedStages.length - 1 && (
                  <div
                    className={`hidden sm:block absolute top-4 left-1/2 w-full h-[2px] -translate-y-1/2 z-0 ${styles.line}`}
                  ></div>
                )}

                {/* Vertical line for mobile (hidden on last item) */}
                {index < orderedStages.length - 1 && (
                  <div
                    className={`sm:hidden absolute top-8 left-4 w-[2px] h-full -translate-x-1/2 z-0 ${styles.line}`}
                  ></div>
                )}

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors duration-300 ${styles.bg} ${styles.border}`}
                >
                  {styles.icon}
                </div>

                <div className="ml-4 sm:ml-0 sm:mt-3 sm:text-center">
                  <p className={`text-sm ${styles.text}`}>{stageName}</p>
                  {stageItem.timestamp && (
                    <p className="text-xs text-muted mt-0.5">
                      {formatWibTimestamp(stageItem.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
