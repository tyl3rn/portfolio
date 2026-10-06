"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Click the photo and a pair of pixel shades drops onto my face. Positions
// are shares of the photo, measured on the 640px crop in /tylerpic.jpg:
// eyes at about (350, 192) and (386, 194), so the head tilts ~3°.
const SHADES = { left: "51%", top: "28.5%", width: "13%", tilt: 3 };
const DROP = -160; // px above the landing spot the shades fall from

// X black, W white glint, . clear
const GLASSES = [
  "XXXXXXXXXXXXXXXX",
  "XWWXXXX..XWWXXXX",
  "XXWWXXX..XXWWXXX",
  ".XXXXX....XXXXX.",
  "..XXX......XXX..",
];
const SPARKLE = ["..W..", "..W..", "WWWWW", "..W..", "..W.."];

function Pixels({ rows, className }: { rows: string[]; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
    >
      {rows.flatMap((row, y) =>
        Array.from(row, (c, x) =>
          c === "." ? null : (
            // a hair over 1 so neighbouring pixels never show a seam
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1.02"
              height="1.02"
              fill={c === "W" ? "#ededed" : "#000"}
            />
          )
        )
      )}
    </svg>
  );
}

export default function Avatar() {
  const [shades, setShades] = useState(false);
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      onClick={() => setShades((on) => !on)}
      aria-pressed={shades}
      aria-label={shades ? "Take the shades off" : "Put the shades on"}
      className="relative mx-auto block aspect-square w-56 cursor-pointer rounded-full outline-none transition-shadow duration-300 hover:shadow-[0_0_0_2px_rgba(27,141,179,0.7),0_0_48px_6px_rgba(27,141,179,0.35)] focus-visible:shadow-[0_0_0_2px_rgba(27,141,179,0.7),0_0_48px_6px_rgba(27,141,179,0.35)] sm:w-72"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/tylerpic.jpg"
        alt="Tyler hiking up Mt. Fuji"
        width={640}
        height={640}
        className="h-full w-full rounded-full border border-line object-cover"
      />

      <AnimatePresence>
        {shades && (
          <motion.div
            key="shades"
            className="pointer-events-none absolute"
            style={{ left: SHADES.left, top: SHADES.top, width: SHADES.width, rotate: SHADES.tilt }}
            initial={reduced ? { opacity: 0 } : { y: DROP, opacity: 0 }}
            // falls, lands, gives one small bounce
            animate={reduced ? { opacity: 1 } : { y: [DROP, 0, -5, 0], opacity: 1 }}
            transition={
              reduced
                ? { duration: 0.2 }
                : {
                    y: { duration: 0.75, times: [0, 0.6, 0.8, 1], ease: ["easeIn", "easeOut", "easeIn"] },
                    opacity: { duration: 0.15 },
                  }
            }
            exit={
              reduced
                ? { opacity: 0, transition: { duration: 0.2 } }
                : { y: DROP, opacity: 0, transition: { duration: 0.35, ease: "easeIn" } }
            }
          >
            <Pixels rows={GLASSES} className="block w-full" />
            {/* the glint pops in once they've landed */}
            <motion.div
              className="absolute -right-[14%] -top-[55%] w-[30%]"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: [0, 1.25, 1], rotate: 0 }}
              transition={{ delay: reduced ? 0 : 0.6, duration: 0.4, ease: "easeOut" }}
            >
              <Pixels rows={SPARKLE} className="block w-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
