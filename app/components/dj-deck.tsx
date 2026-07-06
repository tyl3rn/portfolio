"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { BeatEngine, SONGS, type PadId, type Song } from "./beat-engine";

const PADS: { id: PadId; label: string }[] = [
  { id: "stab", label: "stab" },
  { id: "sub", label: "sub" },
  { id: "zap", label: "zap" },
  { id: "tom", label: "tom" },
  { id: "tick", label: "tick" },
  { id: "bell", label: "bell" },
];

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
    <div className="relative rounded-md bg-panel2 border border-line p-3 sm:p-4">
      <div className="relative aspect-square">
        {/* record */}
        <div
          className={`record absolute inset-0 rounded-full border border-black/70 ${
            spinning ? "spinning" : ""
          }`}
          style={spinning ? { animationDuration: `${120 / bpm}s` } : undefined}
        >
          <div
            className="absolute inset-[32%] rounded-full flex items-center justify-center"
            style={{ background: labelColor }}
          >
            <div className="w-[14%] h-[14%] rounded-full bg-bg" />
            <span className="absolute bottom-[12%] font-display text-[8px] font-bold text-black/60 tracking-widest">
              TN
            </span>
          </div>
        </div>
        {/* tonearm */}
        <div
          className="absolute -top-1 -right-1 origin-top-right transition-transform duration-500"
          style={{ transform: spinning ? "rotate(24deg)" : "rotate(4deg)" }}
        >
          <div className="w-4 h-4 rounded-full bg-[#2e2e2e] border border-black/50" />
          <div className="absolute top-3 right-1.5 w-1.5 h-14 sm:h-16 rounded-full bg-[#2e2e2e] border border-black/40" />
          <div className="absolute top-[4.2rem] sm:top-[4.7rem] right-0.5 w-3.5 h-4 rounded-sm bg-[#3a3a3a]" />
        </div>
      </div>
      <p className="mt-2 text-center text-[9px] tracking-[0.25em] text-muted uppercase">
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
  const [picker, setPicker] = useState(false);

  const engine = () => (engineRef.current ??= new BeatEngine());

  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const onToggle = () => {
    const next = engine().toggle();
    setPlaying(next);
    onPlayingChange?.(next, song.bpm);
  };

  const onPad = (id: PadId) => {
    engine().pad(id);
  };

  const pickSong = (s: Song) => {
    engine().setSong(s);
    setSong(s);
    setPicker(false);
    onPlayingChange?.(playing, s.bpm);
  };

  return (
    <div className="relative w-full bg-panel p-3 sm:p-5">
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
              className="w-full rounded bg-black border border-line px-2 py-1.5 text-center cursor-pointer transition-colors hover:border-neutral-600"
            >
              <p className="font-display text-[10px] sm:text-xs text-accent tracking-widest uppercase truncate">
                {playing ? "▶" : "■"} {song.title}
              </p>
              <p className="font-display text-[9px] text-muted tracking-widest">
                {song.bpm} BPM · TRACKS
              </p>
            </button>

            {/* track selector */}
            <AnimatePresence>
              {picker && (
                <motion.ul
                  role="listbox"
                  aria-label="Tracks"
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 460, damping: 34 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 sm:w-64 z-30 rounded-md border border-line bg-panel2 p-1 shadow-xl"
                >
                  <li className="px-2.5 pt-1.5 pb-1 text-[10px] tracking-[0.25em] uppercase text-muted">
                    Track select
                  </li>
                  {SONGS.map((s) => {
                    const active = s.id === song.id;
                    return (
                      <li key={s.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => pickSong(s)}
                          className={`w-full rounded px-2.5 py-2 text-left transition-colors hover:bg-white/5 ${
                            active ? "text-accent" : "text-ink"
                          }`}
                        >
                          <span className="flex items-baseline justify-between gap-2">
                            <span className="font-display text-xs font-medium">
                              {s.title}
                            </span>
                            <span className="text-[10px] text-muted tabular-nums whitespace-nowrap">
                              {s.bpm} BPM
                            </span>
                          </span>
                          <span className="block text-[11px] text-muted">
                            {s.vibe}
                          </span>
                        </button>
                      </li>
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
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full grid place-items-center bg-ink text-bg hover:bg-white transition-colors active:scale-95"
          >
            {playing ? (
              <Pause size={18} fill="currentColor" strokeWidth={0} aria-hidden />
            ) : (
              <Play size={18} fill="currentColor" strokeWidth={0} aria-hidden className="translate-x-[1px]" />
            )}
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
                className="aspect-square rounded border border-line bg-panel2 text-muted transition-all duration-100 hover:bg-[#242424] hover:text-ink active:scale-95"
              >
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider">
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
            <div className="flex justify-between text-[8px] sm:text-[9px] tracking-[0.2em] text-muted uppercase -mt-1">
              <span className={xfade < 40 ? "text-ink" : ""}>beat</span>
              <span className={xfade > 60 ? "text-ink" : ""}>keys</span>
            </div>
          </div>
        </div>

        <Turntable spinning={playing} bpm={song.bpm} labelColor="#d4d4d4" side="b" />
      </div>
    </div>
  );
}
