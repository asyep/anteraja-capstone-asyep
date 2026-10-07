/**
 * Catatan perjalanan detail — daftar waypoint dengan titik penanda.
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
          const active = note.state === "active";

          return (
            <div
              className="flex items-start justify-between gap-space-sm rounded-xl bg-surface-card p-space-sm"
              key={note.id}
            >
              <div className="flex items-start gap-space-sm">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    active ? "bg-primary" : "bg-border-strong"
                  }`}
                />
                <div>
                  <p
                    className={`font-label-sm text-label-sm text-on-surface ${
                      active ? "font-bold" : "font-semibold"
                    }`}
                  >
                    {note.title}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {note.description}
                  </p>
                </div>
              </div>
              <span
                className={`shrink-0 font-mono-code text-label-sm ${
                  active ? "font-bold text-primary" : "text-text-muted"
                }`}
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
