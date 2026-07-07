"use client";

import { useEffect, useRef } from "react";
import { useAnimate, useReducedMotion } from "framer-motion";

// Scroll down: the penguin sets the bar down. Scroll up: it pulls the
// bar back to lockout. Starts already holding the bar, since the first
// thing a visitor can do is scroll down. Same guards as the pickleball
// rally: a busy window while the rep finishes, a scroll threshold, and
// an IntersectionObserver so off-screen scrolling does nothing.
const SCROLL_THRESHOLD = 48;
const REP_MS = 550;
const BUFFER_MS = 150;
const BAR_DROP = 9; // svg units from lockout to the plates touching ground
const BODY_DROP = 5; // how far the penguin sinks into the "hinge"

export default function Deadlift() {
  const [scope, animate] = useAnimate();
  const reduced = useReducedMotion();

  const barDown = useRef(false);
  const busyUntil = useRef(0);
  const visible = useRef(false);
  const lastY = useRef(0);
  const acc = useRef(0);
  const lastDir = useRef(0);

  useEffect(() => {
    const el = scope.current as HTMLElement | null;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    lastY.current = window.scrollY;

    const rep = (dir: "down" | "up") => {
      const now = performance.now();
      if (now < busyUntil.current) return;

      if (dir === "down" && !barDown.current) {
        barDown.current = true;
        busyUntil.current = now + REP_MS + BUFFER_MS;
        void animate(
          "[data-bar]",
          { y: [0, BAR_DROP] },
          { duration: REP_MS / 1000, ease: "easeInOut" }
        );
        void animate(
          "[data-lifter]",
          { y: [0, BODY_DROP] },
          { duration: REP_MS / 1000, ease: "easeInOut" }
        );
      } else if (dir === "up" && barDown.current) {
        barDown.current = false;
        busyUntil.current = now + REP_MS + BUFFER_MS;
        // slight overshoot at the top, like a real lockout
        void animate(
          "[data-bar]",
          { y: [BAR_DROP, -1.2, 0] },
          { duration: (REP_MS + 120) / 1000, ease: "easeOut" }
        );
        void animate(
          "[data-lifter]",
          { y: [BODY_DROP, -0.8, 0] },
          { duration: (REP_MS + 120) / 1000, ease: "easeOut" }
        );
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      lastY.current = y;
      if (reduced || !visible.current || dy === 0) return;

      const dir = Math.sign(dy);
      if (dir !== lastDir.current) {
        acc.current = 0;
        lastDir.current = dir;
      }
      acc.current += dy;
      if (Math.abs(acc.current) >= SCROLL_THRESHOLD) {
        acc.current = 0;
        rep(dir > 0 ? "down" : "up");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [animate, reduced, scope]);

  return (
    <div ref={scope} className="mx-auto max-w-5xl px-4 sm:px-8">
      <svg
        viewBox="0 0 320 112"
        role="img"
        aria-label="A penguin deadlifting a barbell; scrolling down sets the bar down, scrolling up lifts it"
        className="mx-auto block w-full max-w-[240px] sm:max-w-[280px]"
      >
        {/* floor */}
        <line x1="70" y1="98" x2="250" y2="98" stroke="#262626" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="160" cy="100" rx="66" ry="3.5" fill="#141414" opacity="0.7" />

        <g transform="translate(160 98)">
          {/* feet stay planted while the body hinges */}
          <ellipse cx="-6" cy="-1.5" rx="4.5" ry="2" fill="#8f8f98" />
          <ellipse cx="6" cy="-1.5" rx="4.5" ry="2" fill="#8f8f98" />

          {/* penguin, facing the viewer */}
          <g data-lifter>
            <ellipse cx="0" cy="-26" rx="16" ry="22" fill="#262626" stroke="#3d3d44" strokeWidth="1" />
            <ellipse cx="0" cy="-20" rx="10" ry="14" fill="#ededed" />
            <circle cx="-4.5" cy="-40" r="2.4" fill="#ededed" />
            <circle cx="-4.5" cy="-39.6" r="1.1" fill="#0a0a0a" />
            <circle cx="4.5" cy="-40" r="2.4" fill="#ededed" />
            <circle cx="4.5" cy="-39.6" r="1.1" fill="#0a0a0a" />
            <polygon points="-3,-36.5 3,-36.5 0,-32.5" fill="#ff8906" />
            {/* flippers reaching down to the bar */}
            <ellipse cx="-11.5" cy="-24" rx="3.5" ry="10" fill="#262626" stroke="#3d3d44" strokeWidth="1" transform="rotate(12 -11.5 -24)" />
            <ellipse cx="11.5" cy="-24" rx="3.5" ry="10" fill="#262626" stroke="#3d3d44" strokeWidth="1" transform="rotate(-12 11.5 -24)" />
          </g>

          {/* barbell, drawn at lockout height */}
          <g data-bar>
            <rect x="-70" y="-17.3" width="140" height="2.6" rx="1.3" fill="#8f8f98" />
            {/* grip marks + collars */}
            <rect x="-11" y="-17.8" width="3.4" height="3.6" rx="1" fill="#71717c" />
            <rect x="7.6" y="-17.8" width="3.4" height="3.6" rx="1" fill="#71717c" />
            <rect x="-42" y="-18.8" width="3" height="5.6" rx="1" fill="#71717c" />
            <rect x="39" y="-18.8" width="3" height="5.6" rx="1" fill="#71717c" />
            {/* plates, big to small */}
            <circle cx="-50" cy="-16" r="7" fill="#3d3d44" stroke="#55555c" strokeWidth="1" />
            <circle cx="50" cy="-16" r="7" fill="#3d3d44" stroke="#55555c" strokeWidth="1" />
            <circle cx="-57.5" cy="-16" r="5.5" fill="#4a4a52" />
            <circle cx="57.5" cy="-16" r="5.5" fill="#4a4a52" />
            <circle cx="-63" cy="-16" r="4" fill="#55555c" />
            <circle cx="63" cy="-16" r="4" fill="#55555c" />
            <circle cx="-50" cy="-16" r="1.2" fill="#262626" />
            <circle cx="50" cy="-16" r="1.2" fill="#262626" />
          </g>
        </g>
      </svg>
    </div>
  );
}
