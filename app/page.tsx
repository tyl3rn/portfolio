"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import Hero from "./components/hero";
import { Reveal, SectionHead } from "./components/reveal";

/* ---------------- data ---------------- */

const experience = [
  {
    role: "software engineering intern",
    company: "BNSF Railway",
    location: "Fort Worth, TX",
    period: "summer 2026",
    description: "incoming summer 2026: june 1st to july 31st.",
    color: "#ff8906",
  },
  {
    role: "software developer intern",
    company: "Booz Allen Hamilton",
    location: "remote",
    period: "april 2026 – present",
    description:
      "building llm gateways and iot edge systems for production agentic ai workflows.",
    color: "#7f5af0",
  },
  {
    role: "ai developer intern",
    company: "MyAiPathways",
    location: "Hamilton, VA",
    period: "jan – april 2026",
    description: "built a full-stack document automation platform.",
    color: "#e53170",
  },
  {
    role: "client project developer",
    company: "ML@UVA",
    location: "Charlottesville, VA",
    period: "oct 2025 – jan 2026",
    description:
      "built a computer vision scoring app for the uva math tournament, reaching 96 to 100% accuracy.",
    color: "#2cb67d",
  },
  {
    role: "software engineer intern",
    company: "theCourseForum",
    location: "Charlottesville, VA",
    period: "sept – dec 2025",
    description:
      "built content moderation and new features for uva's course review platform serving 10k+ users.",
    color: "#ffd803",
  },
];

const projects: {
  title: string;
  year: string;
  description: string;
  tags: string[];
  image?: string;
  github: string;
  live?: string;
  tape: string;
  tilt: number;
  note: string;
}[] = [
  {
    title: "Rally",
    year: "2026",
    description:
      "a passive personal safety app that monitors sensor signals and automatically alerts friends when someone may be in danger.",
    tags: ["react native", "claude api", "node.js", "supabase", "express"],
    image: "/rallyportfolio.png",
    github: "https://github.com/rallyhoohacks/rally-together",
    live: "https://rally-together.com/",
    tape: "#e53170",
    tilt: -1.5,
    note: "hackathon build → real app",
  },
  {
    title: "CavRec",
    year: "2026",
    description:
      "a full-stack intramural sports management system for uva students with team registration, scheduling, and role-based auth.",
    tags: ["django", "postgresql", "amazon s3", "google oauth"],
    github: "https://github.com/tyl3rn/CIOManager",
    tape: "#2cb67d",
    tilt: 1.5,
    note: "go hoos",
  },
];

const crates: { label: string; items: string[]; color: string }[] = [
  {
    label: "languages",
    items: ["Python", "Java", "C", "C++", "JavaScript", "SQL", "R", "Swift"],
    color: "#ff8906",
  },
  {
    label: "frameworks",
    items: ["PyTorch", "React", "Django", "Express", "Node.js", "Flask", "OpenCV"],
    color: "#7f5af0",
  },
  {
    label: "tools",
    items: ["Git", "Docker", "AWS", "Figma", "Xcode"],
    color: "#2cb67d",
  },
];

const bside = [
  { emoji: "🎧", title: "music", blurb: "always on. the dj deck up top is the dream setup.", color: "#7f5af0" },
  { emoji: "🏋️", title: "powerlifting", blurb: "chasing numbers that go up slower than my commit count.", color: "#e53170" },
  { emoji: "🏓", title: "pickleball", blurb: "unreasonably competitive for a casual sport.", color: "#2cb67d" },
  { emoji: "🫂", title: "friends", blurb: "most of these projects started as 2am ideas with them.", color: "#ff8906" },
];

const marqueeItems = [
  "open to summer 2027 swe internships",
  "cs + math @ uva",
  "full-stack",
  "ai engineering",
  "based in charlottesville, va",
  "press play on the deck",
];

/* ---------------- sections ---------------- */

function Marquee() {
  return (
    <div className="border-y border-liney bg-wall/60 py-3 overflow-hidden">
      <div className="marquee-track flex w-max gap-8 pr-8">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex gap-8">
            {marqueeItems.map((item) => (
              <span
                key={item}
                className="font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-muted whitespace-nowrap"
              >
                {item} <span className="text-amber">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-4 sm:px-8 py-24 sm:py-32 scroll-mt-20">
      <SectionHead no="01" title="about" note="the person behind the deck" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        <Reveal className="flex flex-col gap-5 text-sm sm:text-base text-muted leading-relaxed">
          <p>
            hey, i&apos;m tyler. i&apos;m a 3rd year at the university of virginia double
            majoring in computer science and mathematics.
          </p>
          <p>
            i&apos;m most interested in full-stack development, ai engineering, and
            building things that solve real problems, ideally the kind people
            actually use the next morning.
          </p>
          <p>
            this page is set in a fictional new york apartment because that&apos;s
            roughly where my head lives at 1am: some skyline, some music, some
            code that almost works.
          </p>
        </Reveal>

        <div className="flex flex-col gap-4">
          {crates.map((crate, i) => (
            <Reveal key={crate.label} delay={i * 0.12} x={24}>
              <div
                className="rounded-lg border border-liney bg-wall p-4 hover:-translate-y-1 transition-transform duration-300"
                style={{ boxShadow: `4px 4px 0 ${crate.color}` }}
              >
                <p
                  className="font-display text-[10px] uppercase tracking-[0.3em] mb-2"
                  style={{ color: crate.color }}
                >
                  crate: {crate.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {crate.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-night border border-liney px-2.5 py-0.5 text-xs text-ink/90"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });

  return (
    <section id="experience" className="mx-auto max-w-5xl px-4 sm:px-8 py-24 sm:py-32 scroll-mt-20">
      <SectionHead no="02" title="experience" note="the setlist so far" />

      <div ref={ref} className="relative pl-7 sm:pl-9">
        {/* track line that draws itself as you scroll */}
        <div className="absolute left-[7px] sm:left-[9px] top-1 bottom-1 w-[2px] bg-liney rounded-full" />
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute left-[7px] sm:left-[9px] top-1 bottom-1 w-[2px] origin-top rounded-full bg-gradient-to-b from-amber via-punch to-grape"
        />

        <div className="flex flex-col gap-12">
          {experience.map((item, i) => (
            <Reveal key={i} delay={0.05}>
              <div className="relative">
                <span
                  className="absolute -left-7 sm:-left-9 top-1 block w-4 h-4 rounded-full border-2 border-night"
                  style={{ background: item.color, boxShadow: `0 0 12px ${item.color}88` }}
                />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display font-bold text-base sm:text-lg lowercase">
                    {item.role}
                  </h3>
                  <span className="font-display text-xs tracking-widest uppercase" style={{ color: item.color }}>
                    {item.period}
                  </span>
                </div>
                <p className="text-xs text-muted mt-1">
                  {item.company} · {item.location}
                </p>
                <p className="text-sm text-muted leading-relaxed mt-2 max-w-xl">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-4 sm:px-8 py-24 sm:py-32 scroll-mt-20">
      <SectionHead no="03" title="projects" note="tracks i've released" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.15}>
            <div
              className="group relative rounded-xl border border-liney bg-wall p-4 sm:p-5 transition-all duration-300 hover:rotate-0 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              style={{ rotate: `${project.tilt}deg` }}
            >
              {/* tape strip */}
              <div
                aria-hidden
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 rotate-[-2deg] rounded-sm opacity-80"
                style={{ background: `${project.tape}66`, border: `1px solid ${project.tape}` }}
              />

              <div className="aspect-video w-full overflow-hidden rounded-md border border-liney bg-night">
                {project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center">
                    <span className="font-display text-3xl font-bold">
                      <span style={{ color: "#E57200" }}>Cav</span>
                      <span style={{ color: "#7f9cf5" }}>Rec</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-baseline justify-between gap-3">
                <h3 className="font-display font-bold text-lg">{project.title}</h3>
                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <span className="text-muted">{project.year}</span>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-ink transition-colors"
                  >
                    ↗ github
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-ink transition-colors"
                    >
                      ↗ live
                    </a>
                  )}
                </div>
              </div>

              <p className="mt-2 text-sm text-muted leading-relaxed">{project.description}</p>
              <p className="mt-2 font-hand text-lg" style={{ color: project.tape }}>
                {project.note}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-night border border-liney px-2.5 py-0.5 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function BSide() {
  return (
    <section id="bside" className="mx-auto max-w-5xl px-4 sm:px-8 py-24 sm:py-32 scroll-mt-20">
      <SectionHead no="04" title="b-side" note="off the clock" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {bside.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.1}>
            <div
              className="h-full rounded-lg border border-liney bg-wall p-4 sm:p-5 transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-1"
              style={{ boxShadow: `0 6px 0 -2px ${item.color}` }}
            >
              <span className="text-2xl" aria-hidden>
                {item.emoji}
              </span>
              <p className="mt-2 font-display font-bold text-sm lowercase" style={{ color: item.color }}>
                {item.title}
              </p>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">{item.blurb}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-liney bg-wall/40">
      <div className="mx-auto max-w-5xl px-4 sm:px-8 py-20 sm:py-28 text-center">
        <Reveal>
          <p className="font-hand text-2xl text-mint mb-3">last track ✦</p>
          <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight lowercase">
            let&apos;s make something<span className="text-amber">.</span>
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              { href: "https://github.com/tyl3rn", label: "github" },
              { href: "https://linkedin.com/in/tyler-nguyen2028", label: "linkedin" },
              { href: "/Tyler_Resume_May28 (1).pdf", label: "resume" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-liney px-5 py-2 text-sm text-muted hover:text-ink hover:border-ink transition-colors"
              >
                ↗ {link.label}
              </a>
            ))}
          </div>
          <p className="mt-12 text-xs text-muted">
            © {new Date().getFullYear()} tyler nguyen · built with next.js ·
            mixed in a fictional new york bedroom studio
          </p>
        </Reveal>
      </div>
    </footer>
  );
}

/* ---------------- page ---------------- */

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Experience />
      <Projects />
      <BSide />
      <Footer />
    </>
  );
}
