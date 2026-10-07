/** Warna titik dan teks per status catatan perjalanan. */
const NOTE_STYLE = {
  done: { dot: "bg-success-base", time: "font-bold text-success-base", card: "" },
  active: { dot: "bg-primary", time: "font-bold text-primary", card: "" },
  // Posisi terkini saat paket masih bergerak: titik berdenyut + ring magenta.
  progress: {
    dot: "bg-primary animate-ping",
    dotWrap: "animate-pulse",
    time: "font-bold text-primary",
    card: "ring-1 ring-primary/20",
    title: "font-bold text-primary",
  },
  idle: { dot: "bg-border-strong", time: "text-text-muted", card: "" },
};

/**
 * Catatan perjalanan detail — daftar waypoint dengan titik penanda.
 * Status tiap catatan: "done" (hijau), "active" (magenta), "idle" (abu).
 */
export default function JourneyNotes({ journey }) {
  return (
    <div className="mt-space-lg flex flex-col gap-space-sm border-t border-border-subtle/50 pt-space-md">
      <div className="flex items-center justify-between text-on-surface">
        <span className="font-label-md text-label-md font-bold">
          Catatan Perjalanan Detil
        </span>
        <span className="font-body-sm text-body-sm text-text-muted">
          {journey.progressLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-space-xs font-body-sm text-body-sm">
        {journey.notes.map((note) => {
          const style = NOTE_STYLE[note.state] ?? NOTE_STYLE.idle;
          const bold = note.state !== "idle";
          const terkini = note.state === "progress";

          return (
            <div
              className={`flex items-start justify-between gap-space-sm rounded-xl bg-surface-card p-space-sm ${style.card}`}
              key={note.id}
            >
              <div className="flex items-start gap-space-sm">
                <span
                  className={`mt-1.5 shrink-0 rounded-full ${style.dot} ${
                    terkini ? "h-2.5 w-2.5" : "h-2 w-2"
                  }`}
                />
                <div>
                  <p
                    className={`font-label-sm text-label-sm ${
                      style.title ?? "text-on-surface"
                    } ${bold ? "font-bold" : "font-semibold"}`}
                  >
                    {note.title}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {note.description}
                  </p>
                </div>
              </div>
              <span
                className={`shrink-0 font-mono-code text-label-sm ${style.time}`}
              >
                {note.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
