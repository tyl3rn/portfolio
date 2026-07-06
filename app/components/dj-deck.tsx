"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BeatEngine, SONGS, type PadId, type Song } from "./beat-engine";

const PADS: { id: PadId; label: string }[] = [
  { id: "stab", label: "stab" },
  { id: "sub", label: "sub" },
  { id: "zap", label: "zap" },
  { id: "tom", label: "tom" },
  { id: "tick", label: "tick" },
  { id: "bell", label: "bell" },
];

const PAD_COLOR = "#ffd803";

function Turntable({
  spinning,
  bpm,
  labelColor,
  side,
}: {
  spinning: boolean;
  bpm: number;
  labelColor: string;
  side: string;
}) {
  return (
    <div className="relative rounded-xl bg-[#1c1930] border border-liney p-3 sm:p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
      <div className="relative aspect-square">
        {/* record */}
        <div
          className={`record absolute inset-0 rounded-full border border-black/60 shadow-[0_4px_14px_rgba(0,0,0,0.6)] ${
            spinning ? "spinning" : ""
          }`}
          style={spinning ? { animationDuration: `${120 / bpm}s` } : undefined}
        >
          <div
            className="absolute inset-[32%] rounded-full flex items-center justify-center"
            style={{ background: labelColor }}
          >
            <div className="w-[14%] h-[14%] rounded-full bg-night" />
            <span className="absolute bottom-[12%] font-display text-[8px] font-bold text-night/70 tracking-widest">
              TN
            </span>
          </div>
        </div>
        {/* tonearm */}
        <div
          className="absolute -top-1 -right-1 origin-top-right transition-transform duration-500"
          style={{ transform: spinning ? "rotate(24deg)" : "rotate(4deg)" }}
        >
          <div className="w-4 h-4 rounded-full bg-[#3a3654] border border-black/50" />
          <div className="absolute top-3 right-1.5 w-1.5 h-14 sm:h-16 rounded-full bg-[#3a3654] border border-black/40" />
          <div className="absolute top-[4.2rem] sm:top-[4.7rem] right-0.5 w-3.5 h-4 rounded-sm bg-[#4a4568]" />
        </div>
      </div>
      <p className="mt-2 text-center font-display text-[9px] tracking-[0.25em] text-muted uppercase">
        deck {side}
      </p>
    </div>
  );
}

export default function DJDeck({
  onPlayingChange,
}: {
  onPlayingChange?: (playing: boolean, bpm: number) => void;
}) {
  const engineRef = useRef<BeatEngine | null>(null);
  const [playing, setPlaying] = useState(false);
  const [song, setSong] = useState<Song>(SONGS[0]);
  const [xfade, setXfade] = useState(50);
  const [hint, setHint] = useState(true);
  const [picker, setPicker] = useState(false);

  const engine = () => (engineRef.current ??= new BeatEngine());

  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const onToggle = () => {
    setHint(false);
    const next = engine().toggle();
    setPlaying(next);
    onPlayingChange?.(next, song.bpm);
  };

  const onPad = (id: PadId) => {
    setHint(false);
    engine().pad(id);
  };

  const pickSong = (s: Song) => {
    engine().setSong(s);
    setSong(s);
    setPicker(false);
    onPlayingChange?.(playing, s.bpm);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-2xl border border-liney bg-[#161327] p-3 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
      {hint && (
        <p className="absolute -top-9 right-2 font-hand text-lg sm:text-xl text-glow rotate-[-3deg] pointer-events-none">
          press play, i dare you ↓
        </p>
      )}

      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-5 items-stretch">
        <Turntable spinning={playing} bpm={song.bpm} labelColor="#ff8906" side="a" />

        {/* mixer */}
        <div className="flex flex-col items-center justify-between gap-3 py-1 w-32 sm:w-44">
          {/* led screen doubles as the track selector */}
          <div
            className="relative w-full"
            onMouseEnter={() => setPicker(true)}
            onMouseLeave={() => setPicker(false)}
          >
            <button
              type="button"
              onClick={() => setPicker((p) => !p)}
              aria-haspopup="listbox"
              aria-expanded={picker}
              aria-label="Choose a track"
              className="w-full rounded-md bg-[#0a0913] border border-liney px-2 py-1.5 text-center cursor-pointer transition-colors hover:border-glow/40"
            >
              <p className="font-display text-[10px] sm:text-xs text-glow tracking-widest uppercase truncate">
                {playing ? "▶" : "■"} {song.title}
              </p>
              <p className="font-display text-[9px] text-muted tracking-widest">
                {song.bpm} BPM · TRACKS ▴
              </p>
            </button>

            {/* game-style track hud */}
            <AnimatePresence>
              {picker && (
                <motion.ul
                  role="listbox"
                  aria-label="Tracks"
                  initial={{ opacity: 0, y: 10, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 sm:w-64 z-30 rounded-lg border border-glow/25 bg-night/60 backdrop-blur-md p-1.5 shadow-[0_0_30px_rgba(255,216,3,0.12)]"
                >
                  <li className="px-2.5 pt-1 pb-1.5 font-display text-[9px] tracking-[0.3em] uppercase text-muted">
                    track select
                  </li>
                  {SONGS.map((s, i) => {
                    const active = s.id === song.id;
                    return (
                      <motion.li
                        key={s.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.05, duration: 0.25, ease: "easeOut" }}
                      >
                        <button
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => pickSong(s)}
                          className={`w-full flex items-baseline justify-between gap-2 rounded-md px-2.5 py-1.5 text-left transition-all duration-150 hover:translate-x-1 hover:bg-glow/10 ${
                            active ? "text-glow" : "text-ink/85"
                          }`}
                        >
                          <span className="font-display text-xs font-bold lowercase">
                            {active && <span aria-hidden>▶ </span>}
                            {s.title}
                          </span>
                          <span className="font-display text-[9px] text-muted tracking-wider whitespace-nowrap">
                            {s.bpm} bpm
                          </span>
                        </button>
                        <p className="px-2.5 -mt-1 pb-1 font-hand text-sm text-muted/80 leading-tight">
                          {s.vibe}
                        </p>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* play */}
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={playing}
            aria-label={playing ? "Pause the beat" : "Play the beat"}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full font-display text-lg grid place-items-center border transition-all duration-200 active:scale-90 ${
              playing
                ? "bg-glow border-glow text-night shadow-[0_0_24px_rgba(255,216,3,0.5)]"
                : "bg-amber border-amber text-night shadow-[0_0_24px_rgba(255,137,6,0.35)] hover:scale-105"
            }`}
          >
            {playing ? "❚❚" : "▶"}
          </button>

          {/* pads */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full">
            {PADS.map((pad) => (
              <button
                key={pad.id}
                type="button"
                aria-label={`Play ${pad.label} sound`}
                onPointerDown={() => onPad(pad.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPad(pad.id);
                  }
                }}
                className="aspect-square rounded-md border border-black/50 transition-all duration-100 active:scale-90 active:brightness-150 hover:brightness-125"
                style={{
                  background: `${PAD_COLOR}1c`,
                  boxShadow: `inset 0 0 10px ${PAD_COLOR}3a, 0 2px 4px rgba(0,0,0,0.4)`,
                }}
              >
                <span
                  className="font-display text-[8px] sm:text-[9px] uppercase tracking-wider"
                  style={{ color: PAD_COLOR }}
                >
                  {pad.label}
                </span>
              </button>
            ))}
          </div>

          {/* crossfader */}
          <div className="w-full">
            <input
              type="range"
              min={0}
              max={100}
              value={xfade}
              aria-label="Crossfader between beat and keys"
              onChange={(e) => {
                const v = Number(e.target.value);
                setXfade(v);
                engine().setCrossfade(v / 100);
              }}
              className="xfader"
            />
            <div className="flex justify-between font-display text-[8px] sm:text-[9px] tracking-[0.2em] text-muted uppercase -mt-1">
              <span className={xfade < 40 ? "text-amber" : ""}>beat</span>
              <span className={xfade > 60 ? "text-amber" : ""}>keys</span>
            </div>
          </div>
        </div>

        <Turntable spinning={playing} bpm={song.bpm} labelColor="#ffd803" side="b" />
      </div>
    </div>
  );
}
