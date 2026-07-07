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
      {/* far flipper + tail, behind the body for depth */}
      <ellipse
        cx="-12"
        cy="-21"
        rx="3.4"
        ry="9"
        fill="#1c1c1c"
        transform="rotate(16 -12 -21)"
      />
      <path d="M-11 -6 L -19 -2 L -10 -1 Z" fill="#1f1f26" stroke="#3d3d44" strokeWidth="0.7" />

      {/* webbed feet: one planted behind, one stepped forward */}
      <g stroke="#0a0a0a" strokeWidth="0.5">
        <path d="M-9 -3 L 2 -3 Q 4.5 -0.6 2 1 L -8 1 Q -10.5 -0.4 -9 -3 Z" fill="#c96f05" />
        <path d="M-4 -3 L 8 -3 Q 10.5 -0.6 8 1 L -3 1 Q -5.5 -0.4 -4 -3 Z" fill="#e0790a" />
        <line x1="4.5" y1="0.6" x2="4.6" y2="-2" />
        <line x1="1.8" y1="0.7" x2="1.9" y2="-2" />
      </g>

      {/* body */}
      <ellipse cx="0" cy="-24" rx="15" ry="22" fill="#262626" stroke="#3d3d44" strokeWidth="1" />
      {/* back sheen */}
      <ellipse cx="-5" cy="-31" rx="5" ry="10" fill="#33333c" opacity="0.6" transform="rotate(-12 -5 -31)" />
      {/* white front */}
      <path d="M4 -41 Q 12 -30 11.5 -18 Q 11 -6 3 -3 Q -4 -4 -4.5 -20 Q -4 -34 4 -41 Z" fill="#ededed" />
      <path d="M4 -41 Q -1 -33 -1 -20 Q -1 -8 3 -3" fill="none" stroke="#d6d6db" strokeWidth="0.8" opacity="0.7" />

      {/* head: eye with a catchlight, two-part beak */}
      <circle cx="7" cy="-38" r="2.8" fill="#ededed" />
      <circle cx="7.8" cy="-38" r="1.4" fill="#0a0a0a" />
      <circle cx="8.3" cy="-38.6" r="0.5" fill="#ededed" />
      <path d="M12.5 -37.5 L 22 -34.5 L 12.5 -33.2 Z" fill="#ff8906" />
      <path d="M12.5 -33 L 20.5 -33.6 L 12.5 -31 Z" fill="#d97a08" />
      <line x1="12.5" y1="-33.1" x2="21" y2="-34" stroke="#a35a04" strokeWidth="0.5" />

      {/* near wing + paddle, reaching toward the net */}
      <g transform="rotate(-24 10 -28)">
        <ellipse cx="13" cy="-20" rx="4" ry="9" fill="#2b2b32" stroke="#3d3d44" strokeWidth="1" />
        <g transform="translate(13.3 -14)">
          {/* wrapped grip with a butt cap */}
          <rect x="-1.5" y="0" width="3" height="5.6" rx="1.3" fill="#4a4a52" />
          <line x1="-1.5" y1="1.7" x2="1.5" y2="1.7" stroke="#71717c" strokeWidth="0.8" />
          <line x1="-1.5" y1="3.2" x2="1.5" y2="3.2" stroke="#71717c" strokeWidth="0.8" />
          <rect x="-2.1" y="-1.5" width="4.2" height="1.7" rx="0.85" fill="#6b6b74" />
          {/* face: edge guard, hitting surface, faceplate seam */}
          <rect x="-6" y="4.8" width="12" height="14.6" rx="5.2" fill="#55555c" stroke="#8f8f98" strokeWidth="1.1" />
          <rect x="-4.1" y="6.7" width="8.2" height="10.8" rx="3.6" fill="#65656f" />
          <line x1="0" y1="7" x2="0" y2="17.2" stroke="#55555c" strokeWidth="0.6" opacity="0.7" />
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
        <defs>
          {/* diamond mesh for the net */}
          <pattern
            id="netmesh"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="6" stroke="#4a4a52" strokeWidth="0.7" />
            <line x1="0" y1="0" x2="6" y2="0" stroke="#4a4a52" strokeWidth="0.7" />
          </pattern>
        </defs>

        {/* court */}
        <line x1="60" y1="132" x2="500" y2="132" stroke="#262626" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="280" cy="134" rx="150" ry="4" fill="#141414" opacity="0.7" />

        {/* net */}
        <g>
          {/* posts with caps and base anchors */}
          <rect x="249.5" y="98" width="4" height="34" rx="1.5" fill="#3d3d44" />
          <rect x="306.5" y="98" width="4" height="34" rx="1.5" fill="#3d3d44" />
          <circle cx="251.5" cy="97" r="2.4" fill="#55555c" />
          <circle cx="308.5" cy="97" r="2.4" fill="#55555c" />
          <ellipse cx="251.5" cy="132" rx="4" ry="1.6" fill="#262626" />
          <ellipse cx="308.5" cy="132" rx="4" ry="1.6" fill="#262626" />

          {/* mesh, held between the posts, sagging slightly at the top */}
          <path d="M252 101 Q 280 104 308 101 L 308 131 L 252 131 Z" fill="url(#netmesh)" />
          {/* top tape band with a highlight */}
          <path d="M251 100 Q 280 103 309 100 L 309 104 Q 280 107 251 104 Z" fill="#8f8f98" />
          <path d="M251 100.6 Q 280 103.6 309 100.6" fill="none" stroke="#c7c7cd" strokeWidth="0.7" />
          {/* bottom band + center strap */}
          <line x1="252" y1="131" x2="308" y2="131" stroke="#6b6b74" strokeWidth="1.4" />
          <rect x="279" y="104" width="2" height="27" fill="#6b6b74" />
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
