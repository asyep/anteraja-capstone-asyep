import { useEffect, useState } from "react";

/**
 * Animasi posisi armada pada rute perjalanan.
 *
 * Posisi berpindah dari satu waypoint ke waypoint berikutnya dengan jeda
 * tetap, lalu berhenti di titik terakhir. Dipakai agar "Radar Posisi Paket"
 * pada status "Dalam Perjalanan" terlihat bergerak real-time.
 *
 * @returns {{ index:number, waypoint:object, tibaDiTujuan:boolean }}
 */
export default function useTransitAnimation(
  route,
  { startIndex = 0, intervalMs = 4000, loop = false } = {},
) {
  const jumlah = route?.waypoints?.length ?? 0;
  const [index, setIndex] = useState(() =>
    Math.min(Math.max(startIndex, 0), Math.max(jumlah - 1, 0)),
  );

  useEffect(() => {
    setIndex(Math.min(Math.max(startIndex, 0), Math.max(jumlah - 1, 0)));
  }, [route?.id, startIndex, jumlah]);

  useEffect(() => {
    if (jumlah <= 1) return undefined;

    const timer = setInterval(() => {
      setIndex((sebelumnya) => {
        if (sebelumnya < jumlah - 1) return sebelumnya + 1;
        return loop ? 0 : sebelumnya;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [jumlah, intervalMs, loop, route?.id]);

  return {
    index,
    waypoint: route?.waypoints?.[index] ?? null,
    tibaDiTujuan: jumlah > 0 && index === jumlah - 1,
  };
}
