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
              Résumé
              <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </div>

        {/* the warehouse: concrete wall with one window-and-console fixture.
            Window and deck share a continuous steel frame so they read as a
            single built-in booth, not a floating panel. */}
        <div className="concrete relative border border-line px-4 sm:px-12 lg:px-16 pt-8 sm:pt-12 pb-10 sm:pb-14">
          <div className="mx-auto max-w-3xl">
            {/* glass (fades in first) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
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
            </motion.div>

            {/* console fused directly under the glass, settling into its tilt */}
            <motion.div
              initial={{ opacity: 0, rotateX: 50 }}
              whileInView={{ opacity: 1, rotateX: 22 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
              style={{ transformPerspective: 1100, transformOrigin: "top center" }}
              className="relative z-10"
            >
              <div className="border-[6px] border-t-0 border-[#1c1c1c] bg-panel shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                <DJDeck onPlayingChange={(playing, bpm) => setBeat({ playing, bpm })} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
