"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Skyline from "./skyline";
import DJDeck from "./dj-deck";

// quadratic bezier, used to hang the light string
const qb = (t: number, a: number, b: number, c: number) => {
  const u = 1 - t;
  return u * u * a + 2 * u * t * b + t * t * c;
};

const SAGS: [number, number, number, number, number, number][] = [
  [0, 6, 250, 46, 500, 9],
  [500, 9, 750, 46, 1000, 6],
];
const BULB_TS = [0.16, 0.32, 0.48, 0.64, 0.8];

function StringLights() {
  return (
    <svg viewBox="0 0 1000 62" className="w-full" aria-hidden>
      {SAGS.map(([x0, y0, x1, y1, x2, y2], s) => (
        <g key={s}>
          <path
            d={`M${x0} ${y0} Q${x1} ${y1} ${x2} ${y2}`}
            fill="none"
            stroke="#3a3654"
            strokeWidth="2"
          />
          {BULB_TS.map((t, i) => {
            const x = qb(t, x0, x1, x2);
            const y = qb(t, y0, y1, y2);
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={y + 6}
                  stroke="#3a3654"
                  strokeWidth="1.5"
                />
                <circle
                  cx={x}
                  cy={y + 10}
                  r="4.5"
                  fill="#ffe8b3"
                  className="glim"
                  style={{
                    filter: "drop-shadow(0 0 7px #ffd803)",
                    animationDelay: `${((s * 5 + i) % 7) * 0.55}s`,
                  }}
                />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [beat, setBeat] = useState({ playing: false, bpm: 88 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const skyY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-[#131120] via-wall to-night"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24">
        {/* title */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-10 mb-12 sm:mb-16"
        >
          <p className="font-hand text-xl sm:text-2xl text-amber rotate-[-2deg] w-fit mb-2">
            welcome to my room
          </p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter lowercase leading-[0.95]">
            tyler
            <br />
            nguyen
          </h1>
          <p className="mt-5 max-w-md text-sm sm:text-base text-muted leading-relaxed">
            cs + math at the university of virginia. i build full-stack and ai
            things, and i&apos;m looking for a summer 2027 swe internship.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["full-stack", "ai engineering", "late-night builds"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-amber/50 text-amber px-3 py-1 text-xs font-display tracking-wide"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* the room: window up top, deck on the desk below */}
        <div className="relative">
          {/* window (fades in on its own as you reach it) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative"
          >
            {/* christmas lights draped above the window */}
            <div className="absolute -top-6 sm:-top-8 inset-x-2 z-20 pointer-events-none">
              <StringLights />
            </div>

            <div className="relative rounded-t-2xl border-[10px] border-b-0 border-[#2b2742] bg-[#2b2742] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <div className="relative overflow-hidden rounded-t-lg aspect-video sm:aspect-[16/8]">
                <motion.div style={{ y: skyY }} className="absolute inset-0 h-[120%]">
                  <Skyline playing={beat.playing} bpm={beat.bpm} />
                </motion.div>
                {/* pane bars */}
                <div aria-hidden className="absolute inset-0 pointer-events-none">
                  <div className="absolute left-1/2 top-0 bottom-0 w-2 -translate-x-1/2 bg-[#2b2742]" />
                  <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 bg-[#2b2742] hidden sm:block" />
                </div>
                {/* glass shine */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-transparent to-white/[0.06]"
                />
              </div>
            </div>

            {/* window sill */}
            <div className="relative h-5 rounded-b-md bg-gradient-to-b from-[#38334f] to-[#241f38] border-x border-b border-black/40" />
          </motion.div>

          {/* the deck lies on the desk below, tilted like real hardware,
              and settles into place as its own second reveal */}
          <motion.div
            initial={{ opacity: 0, y: 70, rotateX: 58 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 24 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            style={{ transformPerspective: 1100 }}
            className="relative z-10 mt-8 sm:mt-12"
          >
            <DJDeck onPlayingChange={(playing, bpm) => setBeat({ playing, bpm })} />
          </motion.div>

          {/* ground shadow under the deck */}
          <div
            aria-hidden
            className="mx-auto -mt-3 h-8 w-2/3 rounded-[50%] bg-black/60 blur-2xl"
          />
        </div>

        {/* scroll cue */}
        <div className="mt-14 flex justify-center">
          <a
            href="#about"
            className="scroll-cue flex flex-col items-center gap-1 text-muted hover:text-ink transition-colors"
          >
            <span className="font-hand text-lg">the rest of the set</span>
            <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
