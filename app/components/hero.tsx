"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Skyline from "./skyline";
import DJDeck from "./dj-deck";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [beat, setBeat] = useState({ playing: false, bpm: 88 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const skyY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section id="top" ref={ref} className="pt-32 sm:pt-40">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        {/* intro */}
        <div className="max-w-2xl mb-14 sm:mb-20">
          <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight">
            Tyler Nguyen
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">
            CS + math at the University of Virginia. I build full-stack and AI
            things, and I&apos;m looking for a summer 2027 SWE internship.
          </p>
          <div className="mt-7 flex items-center gap-4">
            <a
              href="#projects"
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg hover:bg-white transition-colors"
            >
              View projects
            </a>
            <a
              href="/Tyler_Resume_May28 (1).pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink transition-colors"
            >
              Resume
              <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </div>

        {/* the warehouse: concrete wall, steel windows, deck on the stage */}
        <div className="concrete relative border border-line px-4 sm:px-10 pt-6 sm:pt-10 pb-8 sm:pb-10">
          {/* window wall (fades in on its own) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="border-[6px] border-[#1c1c1c] bg-[#1c1c1c]">
              <div className="relative overflow-hidden aspect-video sm:aspect-[16/8]">
                <motion.div style={{ y: skyY }} className="absolute inset-0 h-[118%]">
                  <Skyline playing={beat.playing} bpm={beat.bpm} />
                </motion.div>
                <div aria-hidden className="mullions absolute inset-0 pointer-events-none" />
              </div>
            </div>
            {/* concrete ledge under the glass */}
            <div className="h-2.5 bg-[#111111] border-x border-b border-black/60" />
          </motion.div>

          {/* the deck, its own second reveal, lying flat like real hardware */}
          <motion.div
            initial={{ opacity: 0, y: 48, rotateX: 52 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 22 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            style={{ transformPerspective: 1100 }}
            className="relative z-10 mt-8 sm:mt-10"
          >
            <DJDeck onPlayingChange={(playing, bpm) => setBeat({ playing, bpm })} />
          </motion.div>

          <p className="mt-7 text-center text-xs text-muted">
            The deck really plays. Press play, hit the pads, pick a track on the
            screen.
          </p>
        </div>
      </div>
    </section>
  );
}
