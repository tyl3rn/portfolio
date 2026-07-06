"use client";

import { motion, useScroll } from "framer-motion";

const anchors = [
  { href: "#about", label: "about" },
  { href: "#experience", label: "experience" },
  { href: "#projects", label: "projects" },
  { href: "#bside", label: "b-side" },
];

const socials = [
  { href: "https://github.com/tyl3rn", label: "github" },
  { href: "https://linkedin.com/in/tyler-nguyen2028", label: "linkedin" },
  { href: "/Tyler_Resume_May28 (1).pdf", label: "resume" },
];

export default function Nav() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      {/* scroll progress, styled like a track playhead */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left bg-gradient-to-r from-grape via-punch to-amber"
      />

      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl">
        <nav className="flex items-center justify-between gap-4 rounded-full border border-liney bg-night/70 backdrop-blur-md px-5 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <a
            href="#top"
            className="font-display font-bold text-sm tracking-tight text-ink whitespace-nowrap"
          >
            tyler<span className="text-amber">.</span>n
          </a>

          <div className="hidden sm:flex items-center gap-4">
            {anchors.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-xs text-muted hover:text-ink transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {socials.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-xs text-muted hover:text-ink transition-colors flex items-center gap-0.5"
              >
                <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
                {label}
              </a>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}
