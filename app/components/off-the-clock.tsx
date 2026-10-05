"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimate, useInView, useReducedMotion } from "framer-motion";
import { Morph } from "./type";

// Each hobby is a row in the same label + content rhythm as Experience on
// the home page; what changes is the content. Amber only shows up where it
// does elsewhere on the site: the caret and the pickleball.

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

/* ---------------- pickleball: every serve finds the net ---------------- */

// Ball path, relative to where it rests by the paddle.
const IMPACT = { x: 132, y: 4 }; // ball's edge meets the mesh
const PEAK_Y = -36;
const GROUND_Y = 19;

function Paddle() {
  // grip at the origin, face above it; same paddle as the home page
  return (
    <g>
      <rect x="-1.6" y="-10" width="3.2" height="10" rx="1.3" fill="#4a4a52" />
      <rect x="-2.2" y="-11.5" width="4.4" height="1.8" rx="0.9" fill="#6b6b74" />
      <rect x="-7" y="-28" width="14" height="17" rx="5.5" fill="#55555c" stroke="#8f8f98" strokeWidth="1.1" />
      <rect x="-5" y="-26" width="10" height="13" rx="4" fill="#65656f" />
    </g>
  );
}

function NetBall() {
  const [scope, animate] = useAnimate();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [serves, setServes] = useState(0);
  const busy = useRef(false);

  const serve = async () => {
    if (reduced) {
      setServes((n) => n + 1);
      return;
    }
    if (busy.current) return;
    busy.current = true;

    await animate("[data-paddle]", { rotate: -28 }, { duration: 0.14, ease: "easeOut" });
    void animate("[data-paddle]", { rotate: [-28, 22, 0] }, { duration: 0.4, ease: "easeOut" });
    await animate(
      "[data-ball]",
      { x: [0, IMPACT.x / 2, IMPACT.x], y: [0, PEAK_Y, IMPACT.y] },
      { duration: 0.55, ease: "linear", y: { duration: 0.55, ease: ["easeOut", "easeIn"] } }
    );

    // straight into the net: it bulges, the ball drops and dribbles back
    setServes((n) => n + 1);
    void animate("[data-mesh]", { x: [0, 2.5, -1, 0] }, { duration: 0.35, ease: "easeOut" });
    await animate(
      "[data-ball]",
      { x: [IMPACT.x, IMPACT.x - 5, IMPACT.x - 8], y: [IMPACT.y, GROUND_Y, GROUND_Y - 6, GROUND_Y] },
      { duration: 0.6, ease: "linear", y: { duration: 0.6, ease: ["easeIn", "easeOut", "easeIn"] } }
    );

    await animate("[data-ball]", { opacity: 0 }, { duration: 0.25, delay: 0.5 });
    await animate("[data-ball]", { x: 0, y: 0 }, { duration: 0 });
    await animate("[data-ball]", { opacity: 1 }, { duration: 0.2 });
    busy.current = false;
  };

  // one serve on its own the first time the row scrolls into view
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(serve, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div
      ref={ref}
      className="grid gap-x-10 gap-y-4 md:grid-cols-[minmax(0,20rem)_1fr] md:items-center"
    >
      <button
        ref={scope}
        type="button"
        onClick={serve}
        aria-label="Serve another one"
        className="block w-full max-w-xs cursor-pointer md:max-w-none"
      >
        <svg viewBox="28 36 192 72" aria-hidden className="block w-full">
          <defs>
            <pattern
              id="servemesh"
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="5" stroke="#4a4a52" strokeWidth="0.7" />
              <line x1="0" y1="0" x2="5" y2="0" stroke="#4a4a52" strokeWidth="0.7" />
            </pattern>
          </defs>

          {/* court */}
          <line x1="14" y1="104" x2="246" y2="104" stroke="#262626" strokeWidth="2" strokeLinecap="round" />

          {/* net, side on: post, mesh, and the top tape */}
          <rect x="198.5" y="58" width="3" height="46" rx="1" fill="#3d3d44" />
          <g data-mesh>
            <rect x="194" y="62" width="12" height="41" fill="url(#servemesh)" />
            <rect x="192" y="59" width="16" height="4" rx="1" fill="#8f8f98" />
            <line x1="194" y1="103" x2="206" y2="103" stroke="#6b6b74" strokeWidth="1.2" />
          </g>

          <g transform="translate(46 100) rotate(-8)">
            <g data-paddle style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
              <Paddle />
            </g>
          </g>

          {/* the ball, waiting by the paddle */}
          <g transform="translate(59 80)">
            <g data-ball>
              <circle r="5" fill="#ff8906" stroke="#c96f05" strokeWidth="0.9" />
              <g fill="#a35a04">
                <circle cx="0" cy="0" r="0.8" />
                <circle cx="0" cy="-2.7" r="0.8" />
                <circle cx="2.5" cy="-1" r="0.8" />
                <circle cx="1.5" cy="2.3" r="0.8" />
                <circle cx="-1.5" cy="2.3" r="0.8" />
                <circle cx="-2.5" cy="-1" r="0.8" />
              </g>
            </g>
          </g>
        </svg>
      </button>

      <div>
        <p className="text-base sm:text-lg text-muted leading-relaxed">
          Every game, you can count on me to hit the ball directly into the net.
        </p>
        <p className="casual mt-3 text-sm text-muted">
          net <span className="tabular-nums text-ink">{serves}</span>, me{" "}
          <span className="text-ink">0</span>
          <TextButton onClick={serve}>serve again</TextButton>
        </p>
      </div>
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

      <Row label="pickleball">
        <NetBall />
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
