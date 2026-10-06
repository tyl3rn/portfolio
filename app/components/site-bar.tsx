"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SiteLinks from "./site-links";

const SHOW_AFTER = 360; // px scrolled before the bar drops in, about when the hero leaves

// Drops in from the top once the hero is behind you and stays while you
// scroll: name (back to top), the page's sections with the current one
// underlined, and the same links as the top-right corner.
export default function SiteBar({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // whichever section is crossing the middle of the screen is "current"
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [sections]);

  // On phones the links scroll sideways; keep the current one in view.
  useEffect(() => {
    const el = nav.current;
    const link = el?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!el || !link) return;
    el.scrollTo({
      left: link.offsetLeft - (el.clientWidth - link.offsetWidth) / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [active, shown, reduced]);

  return (
    <AnimatePresence>
      {shown && (
        <motion.header
          key="bar"
          initial={reduced ? { opacity: 0 } : { y: "-100%" }}
          animate={reduced ? { opacity: 1 } : { y: 0 }}
          exit={reduced ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg"
        >
          <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4 sm:gap-6 sm:px-8">
            <a href="#" className="mono hidden shrink-0 text-sm text-ink sm:block">
              tyler nguyen
            </a>
            {/* on phones the links scroll sideways, and the right edge fades
                so it's clear there's more */}
            <nav
              ref={nav}
              aria-label="Sections"
              className="relative flex min-w-0 flex-1 gap-3.5 overflow-x-auto pr-6 [mask-image:linear-gradient(to_right,black_80%,transparent)] [scrollbar-width:none] sm:gap-6 sm:pr-0 sm:[mask-image:none]"
            >
              {sections.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-current={active === id ? "location" : undefined}
                  className={`casual shrink-0 py-1 text-[13px] transition-colors sm:text-sm ${
                    active === id
                      ? "text-ink underline decoration-accent decoration-2 underline-offset-[6px]"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>
            <SiteLinks inBar />
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
