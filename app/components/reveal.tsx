"use client";

import { motion } from "framer-motion";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ no, title }: { no: string; title: string }) {
  return (
    <Reveal className="mb-10 sm:mb-12 flex items-baseline gap-4">
      <span className="text-xs tracking-[0.2em] text-muted tabular-nums">
        {no}
      </span>
      <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
        {title}
      </h2>
    </Reveal>
  );
}
