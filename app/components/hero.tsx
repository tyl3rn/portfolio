"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Skyline from "./skyline";
import DJDeck from "./dj-deck";

const BULBS = ["#ffd803", "#e53170", "#2cb67d", "#7f5af0", "#ff8906"];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);

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
          className="relative z-10 mb-10 sm:mb-14"
        >
          <p className="font-hand text-xl sm:text-2xl text-mint rotate-[-2deg] w-fit mb-2">
            welcome to my room ✦
          </p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter lowercase leading-[0.95]">
            tyler
            <br />
            nguyen<span className="text-amber">.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm sm:text-base text-muted leading-relaxed">
            cs + math at the university of virginia. i build full-stack and ai
            things, and i&apos;m looking for a summer 2027 swe internship.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["full-stack", "ai engineering", "late-night builds"].map((t, i) => (
              <span
                key={t}
                className="rounded-full border px-3 py-1 text-xs font-display tracking-wide"
                style={{
                  borderColor: BULBS[(i + 1) % BULBS.length],
                  color: BULBS[(i + 1) % BULBS.length],
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* the room: window + desk + deck */}
        <div className="relative">
          {/* string lights across the top of the window */}
          <div
            aria-hidden
            className="absolute -top-4 left-2 right-2 z-20 flex justify-between px-6"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="tw block w-2.5 h-2.5 rounded-full"
                style={{
                  background: BULBS[i % BULBS.length],
                  boxShadow: `0 0 10px ${BULBS[i % BULBS.length]}`,
                  animationDelay: `${(i % 5) * 0.7}s`,
                  transform: `translateY(${i % 2 === 0 ? 0 : 5}px)`,
                }}
              />
            ))}
          </div>

          {/* window */}
          <div className="relative rounded-t-2xl border-[10px] border-b-0 border-[#2b2742] bg-[#2b2742] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <div className="relative overflow-hidden rounded-t-lg aspect-[16/8] sm:aspect-[16/7]">
              <motion.div style={{ y: skyY }} className="absolute inset-0 h-[120%]">
                <Skyline playing={playing} />
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

          {/* window sill / desk */}
          <div className="relative h-5 rounded-b-md bg-gradient-to-b from-[#38334f] to-[#241f38] border-x border-b border-black/40" />

          {/* desk clutter */}
          <div
            aria-hidden
            className="relative z-10 -mt-1 mb-3 flex justify-between px-4 sm:px-10"
          >
            <p className="font-hand text-base sm:text-lg text-punch rotate-[-4deg] bg-[#241f38] px-2 rounded-sm">
              rent-free: the skyline
            </p>
            <p className="font-hand text-base sm:text-lg text-glow rotate-[3deg] bg-[#241f38] px-2 rounded-sm">
              ☕ fuel
            </p>
          </div>

          {/* the deck sits on the desk */}
          <div className="relative z-10 -mt-1">
            <DJDeck onPlayingChange={setPlaying} />
          </div>
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
