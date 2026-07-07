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
        className="mx-auto block w-full max-w-[280px] sm:max-w-[330px]"
      >
        {/* floor */}
        <line x1="60" y1="98" x2="260" y2="98" stroke="#262626" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="160" cy="100" rx="76" ry="3.5" fill="#141414" opacity="0.7" />

        <g transform="translate(160 98)">
          {/* feet stay planted while the body hinges */}
          <ellipse cx="-7" cy="-1.5" rx="5" ry="2.2" fill="#8f8f98" />
          <ellipse cx="7" cy="-1.5" rx="5" ry="2.2" fill="#8f8f98" />

          {/* penguin, facing the viewer */}
          <g data-lifter>
            <ellipse cx="0" cy="-29" rx="18" ry="25" fill="#262626" stroke="#3d3d44" strokeWidth="1" />
            <ellipse cx="0" cy="-22" rx="11" ry="15.5" fill="#ededed" />
            <circle cx="-5" cy="-45" r="2.6" fill="#ededed" />
            <circle cx="-5" cy="-44.5" r="1.2" fill="#0a0a0a" />
            <circle cx="5" cy="-45" r="2.6" fill="#ededed" />
            <circle cx="5" cy="-44.5" r="1.2" fill="#0a0a0a" />
            <polygon points="-3.4,-41 3.4,-41 0,-36.5" fill="#ff8906" />
            {/* flippers reaching down to the bar */}
            <ellipse cx="-13" cy="-30" rx="3.8" ry="11.5" fill="#262626" stroke="#3d3d44" strokeWidth="1" transform="rotate(13 -13 -30)" />
            <ellipse cx="13" cy="-30" rx="3.8" ry="11.5" fill="#262626" stroke="#3d3d44" strokeWidth="1" transform="rotate(-13 13 -30)" />
          </g>

          {/* power bar at lockout: thick sleeves, knurl, collars, and
              full-size calibrated plates */}
          <g data-bar>
            {/* shaft with knurl patches where the flippers grip */}
            <rect x="-75" y="-22.4" width="150" height="2.8" rx="1.4" fill="#8f8f98" />
            <rect x="-17.5" y="-22.7" width="7" height="3.4" rx="1" fill="#71717c" opacity="0.85" />
            <rect x="10.5" y="-22.7" width="7" height="3.4" rx="1" fill="#71717c" opacity="0.85" />
            {/* loaded sleeves, thicker than the shaft */}
            <rect x="-70" y="-23" width="30" height="4" rx="2" fill="#a9a9b2" />
            <rect x="40" y="-23" width="30" height="4" rx="2" fill="#a9a9b2" />
            {/* collars with a screw knob */}
            <rect x="-67.5" y="-25" width="3.5" height="8" rx="1.2" fill="#71717c" />
            <rect x="64" y="-25" width="3.5" height="8" rx="1.2" fill="#71717c" />
            <rect x="-71" y="-22.2" width="3" height="2.4" rx="1" fill="#55555c" />
            <rect x="68" y="-22.2" width="3" height="2.4" rx="1" fill="#55555c" />

            {/* plates, outermost first: change plate, back plate, then the
                amber comp plate with rim ring and hub */}
            <circle cx="-61" cy="-21" r="6" fill="#55555c" stroke="#6b6b74" strokeWidth="0.8" />
            <circle cx="61" cy="-21" r="6" fill="#55555c" stroke="#6b6b74" strokeWidth="0.8" />
            <circle cx="-54" cy="-21" r="12" fill="#3d3d44" stroke="#55555c" strokeWidth="1" />
            <circle cx="54" cy="-21" r="12" fill="#3d3d44" stroke="#55555c" strokeWidth="1" />
            <circle cx="-47" cy="-21" r="12" fill="#ff8906" stroke="#c96f05" strokeWidth="1.2" />
            <circle cx="47" cy="-21" r="12" fill="#ff8906" stroke="#c96f05" strokeWidth="1.2" />
            <circle cx="-47" cy="-21" r="7" fill="none" stroke="#d97a08" strokeWidth="1" />
            <circle cx="47" cy="-21" r="7" fill="none" stroke="#d97a08" strokeWidth="1" />
            <circle cx="-47" cy="-21" r="2.6" fill="#262626" stroke="#0a0a0a" strokeWidth="0.6" />
            <circle cx="47" cy="-21" r="2.6" fill="#262626" stroke="#0a0a0a" strokeWidth="0.6" />
          </g>
        </g>
      </svg>
    </div>
  );
}
