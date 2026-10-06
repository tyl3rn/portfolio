"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const TYPE_MS = 40; // per character, same pace as the pickleball penguins

// Hover a photo: it grows a little and a retro dialogue box types out
// where it was taken. Same look as the penguins' dialogue on the home page.
export default function Photo({
  src,
  alt,
  location,
}: {
  src: string;
  alt: string;
  location: string;
}) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!open) return;
    if (reduced) {
      setTyped(location.length);
      return;
    }
    const id = setInterval(() => {
      setTyped((n) => {
        if (n + 1 >= location.length) clearInterval(id);
        return Math.min(n + 1, location.length);
      });
    }, TYPE_MS);
    return () => clearInterval(id);
  }, [open, reduced, location]);

  const show = () => {
    setTyped(0);
    setOpen(true);
  };
  const hide = () => setOpen(false);
  const done = typed >= location.length;

  return (
    <div
      tabIndex={0}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      className="group relative outline-none hover:z-10 focus-visible:z-10"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="aspect-square w-full object-cover border border-line transition-transform duration-300 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
      />

      {open && (
        <div className="pointer-events-none absolute bottom-full left-1/2 mb-4 -translate-x-1/2">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative rounded-[3px] border border-ink bg-panel p-[3px]"
          >
            {/* tail pointing down at the photo; drawn first so
                the inner border stays on top of it */}
            <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-[5px] rotate-45 border-b border-r border-ink bg-panel" />
            <div className="relative rounded-[2px] border border-[#9aa4ae] py-1.5 pl-3 pr-6 font-mono text-xs tracking-wide text-ink whitespace-nowrap">
              {/* the full line, invisible, holds the box at its final width
                  so it doesn't grow as the text types */}
              <span className="grid">
                <span className="invisible col-start-1 row-start-1">{location}</span>
                <span className="col-start-1 row-start-1">{location.slice(0, typed)}</span>
              </span>
              {done && (
                <span
                  className={`absolute bottom-1.5 right-2 h-0 w-0 border-x-[3px] border-t-4 border-x-transparent border-t-muted ${
                    reduced ? "" : "animate-pulse"
                  }`}
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
