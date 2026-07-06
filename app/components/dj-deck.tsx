"use client";

import { useEffect, useRef, useState } from "react";
import { BeatEngine, BPM, type PadId } from "./beat-engine";

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
  labelColor,
  side,
}: {
  spinning: boolean;
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
  onPlayingChange?: (playing: boolean) => void;
}) {
  const engineRef = useRef<BeatEngine | null>(null);
  const [playing, setPlaying] = useState(false);
  const [xfade, setXfade] = useState(50);
  const [hint, setHint] = useState(true);

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
    onPlayingChange?.(next);
  };

  const onPad = (id: PadId) => {
    setHint(false);
    engine().pad(id);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-2xl border border-liney bg-[#161327] p-3 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
      {hint && (
        <p className="absolute -top-9 right-2 font-hand text-lg sm:text-xl text-glow rotate-[-3deg] pointer-events-none">
          press play, i dare you ↓
        </p>
      )}

      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-5 items-stretch">
        <Turntable spinning={playing} labelColor="#ff8906" side="a" />

        {/* mixer */}
        <div className="flex flex-col items-center justify-between gap-3 py-1 w-32 sm:w-44">
          {/* led screen */}
          <div className="w-full rounded-md bg-[#0a0913] border border-liney px-2 py-1.5 text-center">
            <p className="font-display text-[10px] sm:text-xs text-glow tracking-widest">
              {playing ? "▶ NIGHT DRIVE" : "■ STANDBY"}
            </p>
            <p className="font-display text-[9px] text-muted tracking-widest">
              {BPM} BPM · 4-BAR LOOP
            </p>
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

        <Turntable spinning={playing} labelColor="#ffd803" side="b" />
      </div>
    </div>
  );
}
