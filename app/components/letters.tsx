"use client";

import { useEffect, useRef } from "react";

type Axes = Record<string, number>;

const settings = (base: Axes, near: Axes, t: number) =>
  Object.keys(base)
    .map((a) => `"${a}" ${(base[a] + (near[a] - base[a]) * t).toFixed(2)}`)
    .join(", ");

// Splits text into letters and drives each one's variable-font axes by
// how close the cursor is: letters near the pointer ease toward `near`,
// the rest settle back to `base`. With `intro`, a virtual cursor sweeps
// across once on load so touch screens still see it move.
export default function Letters({
  text,
  base,
  near,
  reach = 1.4, // falloff radius, in multiples of the font size
  intro = false,
}: {
  text: string | { text: string; className?: string }[];
  base: Axes;
  near: Axes;
  reach?: number;
  intro?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const spans = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-l]"));
    const cur = spans.map(() => 0);
    let centers: { x: number; y: number }[] = [];
    let radius = 0;
    let box = { left: 0, right: 0, y: 0 };

    // Page coordinates, measured at rest so widening letters don't chase
    // the cursor around.
    const measure = () => {
      centers = spans.map((s) => {
        const r = s.getBoundingClientRect();
        return { x: r.left + r.width / 2 + scrollX, y: r.top + r.height / 2 + scrollY };
      });
      const r = root.getBoundingClientRect();
      box = { left: r.left + scrollX, right: r.right + scrollX, y: r.top + r.height / 2 + scrollY };
      radius = parseFloat(getComputedStyle(root).fontSize) * reach;
    };

    let pointer: { x: number; y: number } | null = null; // client coords
    let introStart = intro ? -1 : Infinity; // -1 = waiting for first frame
    const INTRO_MS = 1600;
    let raf = 0;

    const frame = (now: number) => {
      raf = 0;
      let target: { x: number; y: number } | null = null;

      if (introStart === -1) introStart = now;
      const p = (now - introStart) / INTRO_MS;
      if (p >= 0 && p < 1) {
        const span = box.right - box.left + radius * 2;
        target = { x: box.left - radius + span * p, y: box.y };
      } else if (pointer) {
        target = { x: pointer.x + scrollX, y: pointer.y + scrollY };
      }

      let moving = p >= 0 && p < 1;
      spans.forEach((s, i) => {
        let goal = 0;
        if (target) {
          const d = Math.hypot(target.x - centers[i].x, target.y - centers[i].y);
          const k = Math.max(0, 1 - d / radius);
          goal = k * k * (3 - 2 * k);
        }
        const prev = cur[i];
        let next = prev + (goal - prev) * 0.16;
        if (Math.abs(goal - next) < 0.002) next = goal;
        if (next !== prev) {
          cur[i] = next;
          s.style.fontVariationSettings = settings(base, near, next);
          moving = true;
        }
      });

      if (moving) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    // Only headings on (or near) screen do any work per pointer/scroll event.
    let onScreen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) kick();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(root);

    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      introStart = Infinity; // a real cursor takes over from the sweep
      if (onScreen) kick();
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.type === "pointerleave") {
        pointer = null;
        kick();
      }
    };
    const onScroll = () => {
      if (pointer && onScreen) kick();
    };
    const onResize = () => {
      measure();
      kick();
    };

    measure();
    document.fonts?.ready.then(measure);
    if (intro) kick();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onLeave);
    window.addEventListener("pointercancel", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onLeave);
      window.removeEventListener("pointercancel", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [base, near, reach, intro]);

  const rest = settings(base, near, 0);
  const parts = typeof text === "string" ? [{ text }] : text;
  return (
    <span ref={ref}>
      <span className="sr-only">{parts.map((p) => p.text).join("")}</span>
      <span aria-hidden>
        {parts.map((part, p) => (
          <span key={p} className={part.className}>
            {/* words stay whole so lines only break at spaces */}
            {part.text.split(/(\s+)/).map((word, w) =>
              /^\s*$/.test(word) ? (
                word && " "
              ) : (
                <span key={w} className="inline-block whitespace-nowrap">
                  {Array.from(word).map((ch, i) => (
                    <span key={i} data-l style={{ fontVariationSettings: rest }}>
                      {ch}
                    </span>
                  ))}
                </span>
              ),
            )}
          </span>
        ))}
      </span>
    </span>
  );
}
