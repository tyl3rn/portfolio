"use client";

import { motion } from "framer-motion";
import type { Transition, Variants } from "framer-motion";

const fadeTransition: Transition = { duration: 0.28, ease: "easeOut" };

const pageVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: fadeTransition },
};

export function PageStagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GridStagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={gridVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function Fade({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeVariants} className={className}>
      {children}
    </motion.div>
  );
}
