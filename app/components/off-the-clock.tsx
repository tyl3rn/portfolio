"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Morph } from "./type";

// Each hobby is a row in the same label + content rhythm as Experience on
// the home page; what changes is the content. The typing caret is the only
// amber here, same as the site's other sparing accents. (Pickleball lives
// on the home page with the penguins.)

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <article className="grid sm:grid-cols-[10rem_1fr] gap-x-10 gap-y-3">
      <h3 className="casual text-sm lowercase text-muted leading-relaxed sm:pt-2">
        {label}
      </h3>
      <div className="min-w-0">{children}</div>
    </article>
  );
}

function TextButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ml-3 underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-muted"
    >
      {children}
    </button>
  );
}

/* ---------------- type racing: a Monkeytype test that types itself ---------------- */

const PROMPT =
  "i like to do monkeytype and this is how fast i type using the chopstick method";
const WPM = 150;
const CHAR_MS = 60000 / (WPM * 5); // monkeytype counts 5 characters as a word
const LEAD_IN_MS = 700; // caret blinks for a beat before the first key

// Two-finger typing is bursty: uneven taps with a beat between words.
// The jitter is rescaled so every run still lands on exactly 150.
function keystrokes(text: string) {
  const raw = Array.from(text, (ch) =>
    ch === " " ? 1.6 : 0.55 + Math.random() * 0.9
  );
  const scale = (text.length * CHAR_MS) / raw.reduce((a, b) => a + b, 0);
  return raw.map((d) => d * scale);
}

function TypeRacing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [run, setRun] = useState(0); // bumped by "run it back"

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setTyped(PROMPT.length);
      setWpm(WPM);
      return;
    }
    setTyped(0);
    setWpm(0);
    const delays = keystrokes(PROMPT);
    let i = 0;
    let elapsed = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tap = () => {
      elapsed += delays[i];
      i += 1;
      setTyped(i);
      // like monkeytype, the live number only moves when a word finishes
      if (PROMPT[i - 1] === " " || i === PROMPT.length) {
        setWpm(Math.round(i / 5 / (elapsed / 60000)));
      }
      if (i < PROMPT.length) timer = setTimeout(tap, delays[i]);
    };
    timer = setTimeout(tap, LEAD_IN_MS + delays[0]);
    return () => clearTimeout(timer);
  }, [inView, reduced, run]);

  const done = typed >= PROMPT.length;

  return (
    <div ref={ref}>
      <p className="mono text-xl sm:text-3xl leading-snug">
        <span className="sr-only">{PROMPT}</span>
        <span aria-hidden>
          {Array.from(PROMPT, (ch, i) => (
            <span
              key={i}
              className={`relative ${i < typed ? "text-ink" : "text-muted/40"}`}
            >
              {i === typed && (
                // blinks while waiting for the first key, solid while typing
                <motion.span
                  className="absolute -left-px top-[0.2em] bottom-[0.2em] w-0.5 rounded-full bg-accent"
                  animate={!reduced && typed === 0 ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
                  transition={
                    !reduced && typed === 0
                      ? { duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }
                      : { duration: 0 }
                  }
                />
              )}
              {ch}
            </span>
          ))}
        </span>
      </p>
      <p className="casual mt-4 text-sm text-muted">
        <span className={`tabular-nums ${done ? "text-ink" : ""}`}>{wpm}</span> wpm
        {done && !reduced && (
          <TextButton onClick={() => setRun((r) => r + 1)}>run it back</TextButton>
        )}
      </p>
    </div>
  );
}

/* ---------------- the section ---------------- */

export default function OffTheClock() {
  return (
    <div className="flex flex-col gap-16 sm:gap-20">
      <Row label="type racing">
        <TypeRacing />
      </Row>

      <Row label="concerts">
        <p className="text-2xl sm:text-4xl leading-snug tracking-tight lowercase">
          <Morph
            reach={1.2}
            text={[
              { text: "been to ", className: "text-muted" },
              { text: "laufey, blood orange, quavo, swae lee, 21 savage, steve lacy, " },
              { text: "and ", className: "text-muted" },
              { text: "the chainsmokers." },
            ]}
          />
        </p>
      </Row>

      <Row label="videogames">
        <p className="casual text-xl sm:text-3xl leading-[1.3] text-ink">
          Peaked Immortal 3 in Valorant.{" "}
          <span className="text-muted">
            Also had a Minecraft server in middle school.
          </span>
        </p>
      </Row>
    </div>
  );
}
