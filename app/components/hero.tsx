"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Disc3 } from "lucide-react";
import Skyline from "./skyline";
import DJDeck from "./dj-deck";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [beat, setBeat] = useState({ playing: false, bpm: 88 });
  const [dockOpen, setDockOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const skyY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  useEffect(() => {
    if (!dockOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDockOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dockOpen]);

  return (
    <>
      <section
        id="top"
        ref={ref}
        className="relative flex items-center min-h-[85svh] sm:min-h-[92svh] overflow-hidden"
      >
        {/* the city is the page, not a picture on it */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <motion.div style={{ y: skyY }} className="absolute inset-0 h-[110%]">
            <Skyline playing={beat.playing} bpm={beat.bpm} />
          </motion.div>
          {/* scrims: keep the intro legible, settle the city into the page */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-bg to-transparent" />
        </div>

        {/* intro */}
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-8 pt-10">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight">
              Tyler Nguyen
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">
              CS + math at the University of Virginia. I build full-stack and
              AI things, and I&apos;m looking for a summer 2027 SWE internship.
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
        </div>
      </section>

      {/* music dock: the deck lives behind a small toggle so it never
          crowds the page. It stays mounted while hidden, so a running
          track keeps playing. */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
        <motion.div
          initial={false}
          animate={
            dockOpen
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 14, scale: 0.98 }
          }
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          style={{ pointerEvents: dockOpen ? "auto" : "none" }}
          aria-hidden={!dockOpen}
          inert={!dockOpen}
          className="w-[min(40rem,calc(100vw-2rem))] rounded-lg border border-line bg-panel shadow-2xl"
        >
          <DJDeck onPlayingChange={(playing, bpm) => setBeat({ playing, bpm })} />
        </motion.div>

        <button
          type="button"
          onClick={() => setDockOpen((o) => !o)}
          aria-expanded={dockOpen}
          aria-label={dockOpen ? "Hide the DJ deck" : "Open the DJ deck"}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-sm text-ink shadow-lg hover:bg-panel2 transition-colors"
        >
          <Disc3
            size={15}
            aria-hidden
            className={beat.playing ? "animate-[spinrecord_2.4s_linear_infinite]" : ""}
          />
          {dockOpen ? "Hide" : beat.playing ? "Now playing" : "Play music"}
        </button>
      </div>
    </>
  );
}
