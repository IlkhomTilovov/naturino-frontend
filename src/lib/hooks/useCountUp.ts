import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Animates an integer from 0 to `target` once `start` becomes true. */
export function useCountUp(target: number, start: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      setValue(Math.round(easeOutCubic(t) * target));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [start, target, duration]);

  return value;
}
