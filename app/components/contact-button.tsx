"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy } from "lucide-react";

// "Contact me" opens a small card instead of jumping straight to mailto,
// since plenty of people have no mail app set up: the address, a copy
// button, and the mail-app link for anyone who does want it.
export default function ContactButton({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const address = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  // close on a click anywhere else, or Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // clipboard blocked: select the address so ctrl+c still works
      const sel = window.getSelection();
      if (sel && address.current) {
        const range = document.createRange();
        range.selectNodeContents(address.current);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-white transition-[filter] hover:brightness-90 sm:px-4"
      >
        Contact me
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Contact"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 w-max max-w-[calc(100vw-2rem)] rounded-md border border-line bg-panel p-4 shadow-[0_12px_32px_-16px_rgba(23,26,33,0.35)]"
          >
            <p className="casual text-xs text-muted">email me at</p>
            <p ref={address} className="mono mt-1 select-all text-sm text-ink">
              {email}
            </p>
            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-medium text-bg transition-opacity hover:opacity-80"
              >
                {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
                <span aria-live="polite">{copied ? "copied" : "copy"}</span>
              </button>
              <a
                href={`mailto:${email}`}
                className="text-xs text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-muted"
              >
                open mail app
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
