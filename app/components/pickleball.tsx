"use client";

import { useEffect, useRef } from "react";
import { useAnimate, useReducedMotion } from "framer-motion";

// Scroll down: left penguin serves. Scroll up: right penguin returns.
// A cooldown longer than the ball's flight keeps fast scroll-jiggling
// from turning the rally into a glitch.
const COOLDOWN_MS = 950;
const SCROLL_THRESHOLD = 48; // px of scrolling in one direction per hit
const BALL_TRAVEL = 276; // svg units between the two paddles

// Drawn facing right, feet on y=0.
function Penguin() {
  return (
    <g>
      <ellipse cx="-5" cy="-1.5" rx="4" ry="2" fill="#8f8f98" />
      <ellipse cx="5" cy="-1.5" rx="4" ry="2" fill="#8f8f98" />
      <ellipse cx="0" cy="-24" rx="15" ry="22" fill="#262626" stroke="#3d3d44" strokeWidth="1" />
      <ellipse cx="3" cy="-19" rx="8.5" ry="13.5" fill="#ededed" />
      <circle cx="7" cy="-38" r="2.6" fill="#ededed" />
      <circle cx="8" cy="-38" r="1.2" fill="#0a0a0a" />
      <polygon points="13,-36 21,-33 13,-31" fill="#ff8906" />
      {/* wing + paddle, reaching toward the net */}
      <g transform="rotate(-24 10 -28)">
        <ellipse cx="13" cy="-20" rx="4" ry="9" fill="#262626" stroke="#3d3d44" strokeWidth="1" />
        <rect x="12" y="-14" width="2.6" height="6" rx="1.3" fill="#6b6b74" />
        <ellipse cx="13.3" cy="-4" rx="5.5" ry="7" fill="#6b6b74" />
      </g>
    </g>
  );
}

export default function Pickleball() {
  const [scope, animate] = useAnimate();
  const reduced = useReducedMotion();

  const side = useRef<"left" | "right">("left");
  const lastHit = useRef(-Infinity);
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

    const hit = (dir: "down" | "up") => {
      const now = performance.now();
      if (now - lastHit.current < COOLDOWN_MS) return;

      const from = side.current;
      if (dir === "down" && from === "left") side.current = "right";
      else if (dir === "up" && from === "right") side.current = "left";
      else return;

      lastHit.current = now;
      const toRight = from === "left";

      void animate(
        `[data-hop="${from}"]`,
        { y: [0, -9, 0] },
        { duration: 0.32, ease: "easeOut" }
      );
      void animate(
        "[data-ball]",
        {
          x: toRight ? [0, BALL_TRAVEL / 2, BALL_TRAVEL] : [BALL_TRAVEL, BALL_TRAVEL / 2, 0],
          y: [0, -64, 0],
        },
        {
          duration: 0.65,
          ease: "linear",
          y: { duration: 0.65, ease: ["easeOut", "easeIn"] },
        }
      );
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
        hit(dir > 0 ? "down" : "up");
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
        viewBox="0 0 560 150"
        role="img"
        aria-label="Two penguins playing pickleball; the rally follows your scrolling"
        className="mx-auto block w-full max-w-lg"
      >
        {/* court */}
        <line x1="60" y1="132" x2="500" y2="132" stroke="#262626" strokeWidth="2" strokeLinecap="round" />

        {/* net */}
        <g>
          <line x1="252" y1="96" x2="252" y2="132" stroke="#3d3d44" strokeWidth="2.5" />
          <line x1="308" y1="96" x2="308" y2="132" stroke="#3d3d44" strokeWidth="2.5" />
          <line x1="252" y1="97" x2="308" y2="97" stroke="#8f8f98" strokeWidth="3" />
          <g stroke="#262626" strokeWidth="1">
            <line x1="266" y1="99" x2="266" y2="132" />
            <line x1="280" y1="99" x2="280" y2="132" />
            <line x1="294" y1="99" x2="294" y2="132" />
            <line x1="252" y1="109" x2="308" y2="109" />
            <line x1="252" y1="121" x2="308" y2="121" />
          </g>
        </g>

        {/* players */}
        <g transform="translate(120 132)">
          <g data-hop="left">
            <Penguin />
          </g>
        </g>
        <g transform="translate(440 132)">
          <g data-hop="right">
            <g transform="scale(-1 1)">
              <Penguin />
            </g>
          </g>
        </g>

        {/* the ball, resting by the left paddle until someone swings */}
        <g transform="translate(142 114)">
          <g data-ball>
            <circle r="5.5" fill="#ff8906" />
          </g>
        </g>
      </svg>
    </div>
  );
}
