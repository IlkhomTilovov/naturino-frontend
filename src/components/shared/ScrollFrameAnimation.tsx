import { useEffect, useRef, useState } from "react";

interface ScrollFrameAnimationProps {
  /** e.g. "/hero-frames/frame-{n}.webp" with {n} as a 3-digit placeholder */
  framePattern: string;
  frameCount: number;
  /** 0 to 1 — which frame to display, driven by the parent's scroll-progress tracking. */
  progress: number;
  className?: string;
}

function frameUrl(pattern: string, index: number): string {
  return pattern.replace("{n}", String(index).padStart(3, "0"));
}

export function ScrollFrameAnimation({ framePattern, frameCount, progress, className }: ScrollFrameAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = [];

    const loadFrame = (index: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = frameUrl(framePattern, index + 1);
        images[index] = img;
      });

    (async () => {
      await loadFrame(0);
      if (cancelled) return;
      imagesRef.current = images;
      setIsReady(true);

      // Load the rest in small concurrent batches — much faster to fill the buffer
      // than one-at-a-time, which left late frames stuttering on a fast scroll.
      const BATCH_SIZE = 8;
      for (let start = 1; start < frameCount; start += BATCH_SIZE) {
        if (cancelled) return;
        const batch = Array.from(
          { length: Math.min(BATCH_SIZE, frameCount - start) },
          (_, j) => loadFrame(start + j),
        );
        await Promise.all(batch);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framePattern, frameCount]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useEffect(() => {
    if (!isReady) return;
    const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * (frameCount - 1))));
    drawFrame(frameIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, progress, frameCount]);

  // Redraw on resize so the canvas stays sharp/cover-fitted.
  useEffect(() => {
    if (!isReady) return;
    const onResize = () => {
      const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * (frameCount - 1))));
      drawFrame(frameIndex);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  return <canvas ref={canvasRef} className={className} />;
}
