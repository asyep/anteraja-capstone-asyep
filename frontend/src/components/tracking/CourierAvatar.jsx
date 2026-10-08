/**
 * Avatar kurir dengan indikator online.
 * Bila `src` kosong, tampilkan inisial nama sebagai fallback supaya tidak
 * bergantung pada aset eksternal.
 */
export default function CourierAvatar({ src, name, size = "h-16 w-16" }) {
  const inisial = String(name ?? "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((kata) => kata[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative shrink-0">
      <div
        className={`${size} overflow-hidden rounded-full bg-surface-container shadow-sm ring-2 ring-primary-fixed`}
      >
        {src ? (
          <img
            alt={`${name} — kurir Satria Anteraja`}
            className="h-full w-full rounded-full object-cover"
            src={src}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-headline-sm text-headline-sm font-bold text-primary">
            {inisial}
          </span>
        )}
      </div>
      <span
        className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-success-base ring-2 ring-surface-container-lowest"
        title="Online"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      </span>
    </div>
  );
}
