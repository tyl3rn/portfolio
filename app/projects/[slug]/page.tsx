import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Morph } from "../../components/type";
import { projects } from "../data";

// Only the slugs in data.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return {
    title: project ? `${project.title} · Tyler Nguyen` : "Tyler Nguyen",
    description: project?.description,
    // placeholder write-ups: keep out of search until they're real
    robots: { index: false },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) notFound();
  const project = projects[i];
  const next = projects[(i + 1) % projects.length];

  const facts = [
    { label: "timeline", value: project.timeline },
    { label: "role", value: project.role },
    { label: "stack", value: project.tags.join(", ") },
  ];

  return (
    // keyed so the morphing title remounts when paging between projects
    <article key={slug} className="mx-auto max-w-5xl px-4 sm:px-8 pt-20 sm:pt-28 pb-24 sm:pb-32">
      <Link
        href="/#projects"
        className="casual inline-flex items-center gap-1.5 text-sm lowercase text-muted hover:text-ink transition-colors"
      >
        <ArrowLeft size={14} aria-hidden />
        back
      </Link>

      <header className="mt-12 sm:mt-16">
        <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.05] tracking-tight lowercase">
          <Morph text={project.title} intro />
        </h1>
        <p className="mt-6 max-w-2xl text-lg sm:text-xl text-muted leading-relaxed">
          {project.description}
        </p>

        <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="casual text-sm lowercase text-muted">{f.label}</dt>
              <dd className="mt-1.5 text-sm sm:text-base text-ink leading-relaxed">{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex items-center gap-5 text-sm">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-muted hover:text-ink transition-colors"
          >
            GitHub
            <ArrowUpRight size={14} aria-hidden />
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted hover:text-ink transition-colors"
            >
              Live
              <ArrowUpRight size={14} aria-hidden />
            </a>
          )}
        </div>
      </header>

      {project.image && (
        <div className="mt-14 sm:mt-20 aspect-video w-full overflow-hidden border border-line bg-panel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}

      <div className="mt-20 sm:mt-28 flex flex-col gap-14 sm:gap-20">
        {project.sections.map((s) => (
          <section key={s.heading} className="grid sm:grid-cols-[10rem_1fr] gap-x-10 gap-y-3">
            <h2 className="casual text-sm lowercase text-muted sm:pt-1">{s.heading}</h2>
            <div className="flex flex-col gap-4 max-w-2xl text-base sm:text-lg text-ink/85 leading-relaxed">
              {s.body.map((para, j) => (
                <p key={j}>{para}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Link href={`/projects/${next.slug}`} className="group mt-28 sm:mt-36 block">
        <span className="casual text-sm lowercase text-muted group-hover:text-ink transition-colors">
          next project
        </span>
        <span className="mt-2 block text-[clamp(2rem,6vw,4rem)] leading-[1.05] tracking-tight lowercase">
          <Morph text={next.title} />
        </span>
      </Link>
    </article>
  );
}
