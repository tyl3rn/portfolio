"use client";

import { useEffect, useRef } from "react";
import { useAnimate, useReducedMotion } from "framer-motion";

// Scroll down: left penguin serves. Scroll up: right penguin returns.
// The next hit is blocked until the current shot lands (plus a small
// buffer), so fast scroll-jiggling can't glitch the rally.
const SCROLL_THRESHOLD = 48; // px of scrolling in one direction per hit
const BALL_TRAVEL = 276; // svg units between the two paddles
const HIT_BUFFER_MS = 130; // extra pause after a shot lands

// A mix of shots so the rally isn't one repeated arc. peak is how high
// the ball rises (more negative = higher); dur is the flight time.
type Shot = { dur: number; peak: number; spin: number };
const SHOTS: Shot[] = [
  { dur: 0.4, peak: -22, spin: 760 }, // drive: fast and low over the net
  { dur: 0.65, peak: -64, spin: 540 }, // normal arc
  { dur: 0.65, peak: -64, spin: 540 }, // (weighted so normal is common)
  { dur: 1.1, peak: -122, spin: 340 }, // lob: slow and high
];

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
        <g transform="translate(13.3 -14)">
          {/* wrapped grip with a butt cap */}
          <rect x="-1.5" y="0" width="3" height="5.6" rx="1.3" fill="#4a4a52" />
          <line x1="-1.5" y1="1.7" x2="1.5" y2="1.7" stroke="#71717c" strokeWidth="0.8" />
          <line x1="-1.5" y1="3.2" x2="1.5" y2="3.2" stroke="#71717c" strokeWidth="0.8" />
          <rect x="-2.1" y="-1.5" width="4.2" height="1.7" rx="0.85" fill="#6b6b74" />
          {/* face: edge guard, then the hitting surface */}
          <rect x="-6" y="4.8" width="12" height="14.6" rx="5.2" fill="#55555c" stroke="#8f8f98" strokeWidth="1.1" />
          <rect x="-4.1" y="6.7" width="8.2" height="10.8" rx="3.6" fill="#65656f" />
        </g>
      </g>
    </g>
  );
}

export default function Pickleball() {
  const [scope, animate] = useAnimate();
  const reduced = useReducedMotion();

  const side = useRef<"left" | "right">("left");
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

    const hit = (dir: "down" | "up") => {
      const now = performance.now();
      if (now < busyUntil.current) return;

      const from = side.current;
      if (dir === "down" && from === "left") side.current = "right";
      else if (dir === "up" && from === "right") side.current = "left";
      else return;

      const toRight = from === "left";
      const shot = SHOTS[Math.floor(Math.random() * SHOTS.length)];
      // block the next hit until this shot lands
      busyUntil.current = now + shot.dur * 1000 + HIT_BUFFER_MS;

      void animate(
        `[data-hop="${from}"]`,
        { y: [0, -9, 0] },
        { duration: 0.32, ease: "easeOut" }
      );
      void animate(
        "[data-ball]",
        {
          x: toRight ? [0, BALL_TRAVEL / 2, BALL_TRAVEL] : [BALL_TRAVEL, BALL_TRAVEL / 2, 0],
          y: [0, shot.peak, 0],
        },
        {
          duration: shot.dur,
          ease: "linear",
          y: { duration: shot.dur, ease: ["easeOut", "easeIn"] },
        }
      );
      // topspin: the hole pattern makes the rotation visible
      void animate(
        "[data-ballspin]",
        { rotate: toRight ? [0, shot.spin] : [0, -shot.spin] },
        { duration: shot.dur, ease: "linear" }
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
        viewBox="0 -30 560 180"
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
            <g
              data-ballspin
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <circle r="6.2" fill="#ff8906" stroke="#c96f05" strokeWidth="1" />
              {/* the holes that make it a pickleball, not a tennis ball */}
              <g fill="#a35a04">
                <circle cx="0" cy="0" r="1" />
                <circle cx="0" cy="-3.3" r="1" />
                <circle cx="3.1" cy="-1.2" r="1" />
                <circle cx="1.9" cy="2.8" r="1" />
                <circle cx="-1.9" cy="2.8" r="1" />
                <circle cx="-3.1" cy="-1.2" r="1" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
