"use client";

import { useEffect, useRef } from "react";
import { FPS, createRidges } from "./ridges";

// Faint drifting ridgelines behind every page (see ridges.ts).
// Rendering happens in a worker via OffscreenCanvas; browsers without it
// fall back to drawing on the main thread.
export default function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    // Made here rather than in JSX: a canvas can only be handed to a
    // worker once, and dev-mode effects mount twice.
    const canvas = document.createElement("canvas");
    canvas.className = "h-full w-full";
    host.appendChild(canvas);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const size = () => ({
      w: window.innerWidth,
      h: window.innerHeight,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
    });

    let cleanup = () => {};

    if ("transferControlToOffscreen" in canvas) {
      const worker = new Worker(new URL("./backdrop.worker.ts", import.meta.url));
      worker.onmessage = (e) => {
        if (e.data !== "ready") return;
        const offscreen = canvas.transferControlToOffscreen();
        worker.postMessage({ type: "init", canvas: offscreen, ...size(), still: still.matches }, [
          offscreen,
        ]);
      };

      const onResize = () => worker.postMessage({ type: "resize", ...size() });
      const onStill = () => worker.postMessage({ type: "still", still: still.matches });
      const onVisible = () =>
        worker.postMessage({ type: "visible", visible: document.visibilityState === "visible" });

      window.addEventListener("resize", onResize);
      still.addEventListener("change", onStill);
      document.addEventListener("visibilitychange", onVisible);
      cleanup = () => {
        worker.terminate();
        window.removeEventListener("resize", onResize);
        still.removeEventListener("change", onStill);
        document.removeEventListener("visibilitychange", onVisible);
      };
    } else {
      const ctx = (canvas as HTMLCanvasElement).getContext("2d");
      if (ctx) {
        const ridges = createRidges(canvas, ctx);
        const resize = () => {
          const { w, h, dpr } = size();
          ridges.resize(w, h, dpr);
        };

        let raf = 0;
        let last = -Infinity;
        const start = performance.now();
        const tick = (now: number) => {
          raf = requestAnimationFrame(tick);
          if (now - last < 1000 / FPS) return;
          last = now;
          ridges.draw(now - start);
        };
        const run = () => {
          cancelAnimationFrame(raf);
          if (still.matches) ridges.draw(0);
          else raf = requestAnimationFrame(tick);
        };
        const onResize = () => {
          resize();
          if (still.matches) ridges.draw(0);
        };

        resize();
        run();
        window.addEventListener("resize", onResize);
        still.addEventListener("change", run);
        cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("resize", onResize);
          still.removeEventListener("change", run);
        };
      }
    }

    return () => {
      cleanup();
      canvas.remove();
    };
  }, []);

  return <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
}
