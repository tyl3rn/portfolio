"use client";

import { motion } from "framer-motion";

export function Reveal({
  children,
  className,
  delay = 0,
  x = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  x?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({
  no,
  title,
  note,
}: {
  no: string;
  title: string;
  note: string;
}) {
  return (
    <Reveal className="flex items-end gap-4 mb-10 sm:mb-14">
      <span
        className="font-display text-5xl sm:text-7xl font-bold leading-none text-transparent"
        style={{ WebkitTextStroke: "1.5px var(--muted)" }}
      >
        {no}
      </span>
      <div>
        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight lowercase">
          {title}
        </h2>
        <p className="font-hand text-lg sm:text-xl text-amber -mb-1">{note}</p>
      </div>
    </Reveal>
  );
}
