import { useEffect, useRef, useState } from "react";

/**
 * Tracks scroll progress (0 to 1) of a tall wrapper element as it passes through
 * the viewport — used to drive pinned/sticky scroll-jacked animations.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableDistance = rect.height - viewportHeight;
      if (scrollableDistance <= 0) {
        setProgress(rect.top <= 0 ? 1 : 0);
        return;
      }

      const traveled = -rect.top;
      const next = Math.min(1, Math.max(0, traveled / scrollableDistance));
      setProgress(next);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      setTimeout(update, 0);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, progress };
}
