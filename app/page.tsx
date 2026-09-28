import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Pickleball from "./components/pickleball";
import { Reveal } from "./components/reveal";
import { HeroName, Morph, SectionTitle } from "./components/type";

/* ---------------- data ---------------- */

const experience = [
  {
    role: "Software Engineer Intern",
    company: "BNSF Railway",
    location: "Fort Worth, TX",
    period: "Summer 2026",
    description:
      "Migrated 60+ batch jobs from WebSphere to Spring Boot on OpenShift and made them 60% faster along the way.",
  },
  {
    role: "Software Engineer Intern",
    company: "Booz Allen Hamilton",
    location: "Remote",
    period: "Apr to May 2026",
    description:
      "Built a multi-provider LLM gateway, an MCP-powered agent, and the guardrails that keep both in line.",
  },
  {
    role: "AI/ML Researcher",
    company: "University of Virginia",
    location: "Charlottesville, VA",
    period: "Jan to May 2026",
    description: "Deep learning and generative AI.",
  },
  {
    role: "AI Consultant",
    company: "MyAiPathways",
    location: "Hamilton, VA",
    period: "Jan to Apr 2026",
    description: "Built a resume screener that cut manual review by 75% and a platform that drafts offer letters for you.",
  },
  {
    role: "Machine Learning Developer",
    company: "ML@UVA",
    location: "Charlottesville, VA",
    period: "Oct 2025 to Jan 2026",
    description:
      "Built an app that grades handwritten math tournament sheets 18x faster, from three minutes down to under ten seconds.",
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
    image: "/cavrec.png",
    github: "https://github.com/tyl3rn/CIOManager",
  },
  {
    title: "AI Shortform Video Generator",
    year: "2026",
    description:
      "A pipeline that turns Reddit stories into narrated vertical videos, using an AI judge to score posts and only render the ones worth watching.",
    tags: ["Python", "FastAPI", "Claude API", "ffmpeg", "edge-tts"],
    image: "/duedatepic.png",
    github: "https://github.com/tyl3rn/ai-shortform-video-generator",
  },
];

// Straight from the résumé.
const skills = [
  {
    label: "languages",
    items: ["Python", "Java", "C", "TypeScript", "JavaScript", "SQL", "R", "HTML/CSS"],
  },
  {
    label: "frameworks",
    items: [
      "React.js", "Node.js", "Express.js", "Flask", "Django",
      "Spring Boot", "OpenCV", "LiteLLM", "PyTorch",
    ],
  },
  {
    label: "tools",
    items: [
      "Git", "Docker", "Kubernetes", "OpenShift", "Rancher",
      "Jenkins", "PostgreSQL", "Keycloak", "Linux",
    ],
  },
];

/* ---------------- sections ---------------- */

function Hero() {
  return (
    <section id="top" className="mx-auto max-w-5xl px-4 sm:px-8 pt-32 sm:pt-40 pb-10 sm:pb-14">
      <HeroName text="Tyler Nguyen" />
      <p className="mt-6 text-base sm:text-lg text-muted leading-relaxed">
        Computer Science @ the University of Virginia
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-5">
        <Link
          href="/personal"
          className="inline-flex min-w-[6.5rem] justify-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg hover:opacity-80 transition-opacity"
        >
          Personal
        </Link>
        {[
          { href: "https://github.com/tyl3rn", label: "GitHub" },
          { href: "https://linkedin.com/in/tyler-nguyen2028", label: "LinkedIn" },
          { href: "/Nguyen__Tyler_Resume.pdf", label: "Résumé" },
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
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-4 sm:px-8 py-24 sm:py-32 scroll-mt-16">
      <SectionTitle title="About" />
      <Reveal className="max-w-4xl">
        <p className="casual text-2xl sm:text-4xl leading-[1.3] text-ink">
          Hey, I&apos;m Tyler.{" "}
          <span className="text-muted">
            I&apos;m from Virginia Beach, VA, and a third-year at the
            University of Virginia majoring in computer science.
          </span>
        </p>
        <p className="mt-8 max-w-2xl text-base sm:text-lg text-muted leading-relaxed">
          I&apos;m most interested in{" "}
          <span className="mono text-ink">full-stack development</span>,{" "}
          <span className="mono text-ink">AI engineering</span>, and building
          things that solve real problems.
        </p>
      </Reveal>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-4 sm:px-8 py-24 sm:py-32 scroll-mt-16">
      <SectionTitle title="Experience" />

      <div className="flex flex-col gap-16 sm:gap-20">
        {experience.map((item) => (
          <Reveal key={`${item.company}-${item.period}`}>
            <article className="grid sm:grid-cols-[10rem_1fr] gap-x-10 gap-y-3">
              <div className="casual flex flex-wrap gap-x-4 sm:block text-sm lowercase text-muted leading-relaxed sm:pt-3">
                <p>{item.period}</p>
                <p>{item.location}</p>
              </div>
              <div>
                <h3 className="text-3xl sm:text-4xl leading-tight tracking-tight lowercase">
                  <Morph text={item.company} reach={1.2} />
                </h3>
                <p className="casual mt-2 text-base sm:text-lg text-ink">
                  {item.role}
                </p>
                <p className="mt-3 max-w-xl text-sm sm:text-base text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-4 sm:px-8 py-24 sm:py-32 scroll-mt-16">
      <SectionTitle title="Projects" />

      <div className="flex flex-col gap-20 sm:gap-24">
        {projects.map((project) => (
          <Reveal key={project.title}>
            <article className="grid md:grid-cols-[3fr_2fr] gap-6 md:gap-10 items-start">
              <div className="aspect-video w-full overflow-hidden border border-line bg-panel">
                {project.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top"
                  />
                )}
              </div>

              <div>
                <p className="mono text-xs uppercase tracking-wider text-muted">
                  {project.year}
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl leading-tight tracking-tight lowercase">
                  <Morph text={project.title} reach={1.2} />
                </h3>
                <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">
                  {project.description}
                </p>
                <ul className="mono mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center gap-5 text-sm">
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
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-4 sm:px-8 py-24 sm:py-32 scroll-mt-16">
      <SectionTitle title="Skills" />
      <Reveal className="grid grid-cols-3 gap-4 sm:gap-10">
        {skills.map((group) => (
          <div key={group.label}>
            <h3 className="casual text-sm text-muted">{group.label}</h3>
            <ul className="mt-4 sm:mt-5 flex flex-col gap-1.5 sm:gap-2 text-sm sm:text-lg text-ink">
              {group.items.map((item) => (
                // hovering an item flips it into Recursive's monospace
                <li
                  key={item}
                  className="w-fit hover:mono transition-[font-variation-settings] duration-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="mx-auto max-w-5xl px-4 sm:px-8 py-24 sm:py-32">
      <SectionTitle title="Let's make something" />
      <a
        href="mailto:wgq4tr@virginia.edu"
        className="casual inline-flex items-center gap-2 text-xl sm:text-2xl text-muted hover:text-ink transition-colors"
      >
        wgq4tr@virginia.edu
        <ArrowUpRight size={20} aria-hidden />
      </a>
      <p className="mono mt-16 text-xs text-muted">
        © {new Date().getFullYear()} Tyler Nguyen, built with Next.js
      </p>
    </footer>
  );
}

/* ---------------- page ---------------- */

export default function Home() {
  return (
    <>
      <Hero />
      <Pickleball />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Footer />
    </>
  );
}
