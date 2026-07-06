import { ArrowUpRight } from "lucide-react";
import Hero from "./components/hero";
import { Reveal, SectionHead } from "./components/reveal";

/* ---------------- data ---------------- */

const experience = [
  {
    role: "Software Engineering Intern",
    company: "BNSF Railway",
    location: "Fort Worth, TX",
    period: "Summer 2026",
    description: "Incoming summer 2026, June 1st to July 31st.",
  },
  {
    role: "Software Developer Intern",
    company: "Booz Allen Hamilton",
    location: "Remote",
    period: "Apr 2026 to present",
    description:
      "Building LLM gateways and IoT edge systems for production agentic AI workflows.",
  },
  {
    role: "AI Developer Intern",
    company: "MyAiPathways",
    location: "Hamilton, VA",
    period: "Jan to Apr 2026",
    description: "Built a full-stack document automation platform.",
  },
  {
    role: "Client Project Developer",
    company: "ML@UVA",
    location: "Charlottesville, VA",
    period: "Oct 2025 to Jan 2026",
    description:
      "Built a computer vision scoring app for the UVA math tournament, reaching 96 to 100% accuracy.",
  },
  {
    role: "Software Engineer Intern",
    company: "theCourseForum",
    location: "Charlottesville, VA",
    period: "Sep to Dec 2025",
    description:
      "Built content moderation and new features for UVA's course review platform serving 10k+ users.",
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
}[] = [
  {
    title: "Rally",
    year: "2026",
    description:
      "A passive personal safety app that monitors sensor signals and automatically alerts friends when someone may be in danger.",
    tags: ["React Native", "Claude API", "Node.js", "Supabase", "Express"],
    image: "/rallyportfolio.png",
    github: "https://github.com/rallyhoohacks/rally-together",
    live: "https://rally-together.com/",
  },
  {
    title: "CavRec",
    year: "2026",
    description:
      "A full-stack intramural sports management system for UVA students with team registration, scheduling, and role-based auth.",
    tags: ["Django", "PostgreSQL", "Amazon S3", "Google OAuth"],
    github: "https://github.com/tyl3rn/CIOManager",
  },
];

const skills = [
  {
    label: "Languages",
    items: "Python, Java, C, C++, JavaScript, SQL, R, Swift",
  },
  {
    label: "Frameworks",
    items: "PyTorch, React, Django, Express, Node.js, Flask, OpenCV",
  },
  {
    label: "Tools",
    items: "Git, Docker, AWS, Figma, Xcode",
  },
];

const offTheClock = [
  {
    title: "Music",
    blurb: "Always on. The deck up top is the dream setup.",
  },
  {
    title: "Powerlifting",
    blurb: "Chasing numbers that go up slower than my commit count.",
  },
  {
    title: "Pickleball",
    blurb: "Unreasonably competitive for a casual sport.",
  },
  {
    title: "Friends",
    blurb: "Most of these projects started as 2am ideas with them.",
  },
];

/* ---------------- sections ---------------- */

function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-4 sm:px-8 py-24 sm:py-32 scroll-mt-16">
      <SectionHead no="01" title="About" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <Reveal className="flex flex-col gap-5 text-sm sm:text-base text-muted leading-relaxed">
          <p>
            Hey, I&apos;m Tyler. I&apos;m a third-year at the University of
            Virginia double majoring in computer science and mathematics.
          </p>
          <p>
            I&apos;m most interested in full-stack development, AI engineering,
            and building things that solve real problems, ideally the kind
            people actually use the next morning.
          </p>
          <p>
            This page is set in a warehouse with a skyline view because
            that&apos;s roughly where my head lives at 1am: some city, some
            music, some code that almost works.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <dl>
            {skills.map((s) => (
              <div
                key={s.label}
                className="grid grid-cols-[7rem_1fr] gap-4 border-t border-line py-4 first:border-t-0 first:pt-0"
              >
                <dt className="text-sm text-muted">{s.label}</dt>
                <dd className="text-sm text-ink leading-relaxed">{s.items}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-4 sm:px-8 py-24 sm:py-32 scroll-mt-16">
      <SectionHead no="02" title="Experience" />

      <div>
        {experience.map((item) => (
          <Reveal key={`${item.company}-${item.period}`}>
            <div className="grid sm:grid-cols-[1fr_auto] gap-x-8 gap-y-1 border-t border-line py-6">
              <div>
                <h3 className="text-sm sm:text-base font-medium text-ink">
                  {item.role}
                </h3>
                <p className="mt-0.5 text-sm text-muted">
                  {item.company} · {item.location}
                </p>
                <p className="mt-2 text-sm text-muted leading-relaxed max-w-xl">
                  {item.description}
                </p>
              </div>
              <p className="text-sm text-muted sm:text-right whitespace-nowrap row-start-1 sm:col-start-2">
                {item.period}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-4 sm:px-8 py-24 sm:py-32 scroll-mt-16">
      <SectionHead no="03" title="Projects" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.08}>
            <div className="aspect-video w-full overflow-hidden border border-line bg-panel">
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full grid place-items-center">
                  <span className="font-display text-2xl font-semibold text-muted">
                    CavRec
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-baseline justify-between gap-3">
              <h3 className="font-display text-lg font-semibold">
                {project.title}
              </h3>
              <div className="flex items-center gap-4 shrink-0 text-sm">
                <span className="text-muted">{project.year}</span>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted hover:text-ink transition-colors"
                >
                  GitHub
                  <ArrowUpRight size={13} aria-hidden />
                </a>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted hover:text-ink transition-colors"
                  >
                    Live
                    <ArrowUpRight size={13} aria-hidden />
                  </a>
                )}
              </div>
            </div>

            <p className="mt-2 text-sm text-muted leading-relaxed">
              {project.description}
            </p>
            <p className="mt-3 text-xs text-muted">{project.tags.join(" · ")}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function OffTheClock() {
  return (
    <section id="off-the-clock" className="mx-auto max-w-5xl px-4 sm:px-8 py-24 sm:py-32 scroll-mt-16">
      <SectionHead no="04" title="Off the clock" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
        {offTheClock.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06}>
            <div className="border-t border-line pt-4">
              <h3 className="text-sm font-medium text-ink">{item.title}</h3>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">
                {item.blurb}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 sm:px-8 py-20 sm:py-28">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight">
            Let&apos;s make something.
          </h2>
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { href: "https://github.com/tyl3rn", label: "GitHub" },
              { href: "https://linkedin.com/in/tyler-nguyen2028", label: "LinkedIn" },
              { href: "/Tyler_Resume_May28 (1).pdf", label: "Résumé" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink transition-colors"
              >
                {link.label}
                <ArrowUpRight size={14} aria-hidden />
              </a>
            ))}
          </div>
          <p className="mt-14 text-xs text-muted">
            © {new Date().getFullYear()} Tyler Nguyen · Built with Next.js. The
            beats are synthesized in your browser, no audio files involved.
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
      <About />
      <Experience />
      <Projects />
      <OffTheClock />
      <Footer />
    </>
  );
}
