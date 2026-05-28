import { PageStagger, GridStagger, Fade } from "@/app/components/motion";

type Thumbnail =
  | { type: "image"; src: string }
  | { type: "logo-text"; primary: string; secondary: string; colors: [string, string] };

const projects: {
  title: string;
  year: string;
  description: string;
  tags: string[];
  thumbnail: Thumbnail;
  github: string;
  live?: string;
}[] = [
  {
    title: "Rally",
    year: "2026",
    description:
      "a passive personal safety app that monitors sensor signals and automatically alerts friends when someone may be in danger.",
    tags: ["react native", "claude api", "node.js", "supabase", "express"],
    thumbnail: { type: "image", src: "/rallyportfolio.png" },
    github: "https://github.com/rallyhoohacks/rally-together",
    live: "https://rally-together.com/",
  },
  {
    title: "CavRec",
    year: "2026",
    description:
      "a full-stack intramural sports management system for uva students with team registration, scheduling, and role-based auth.",
    tags: ["django", "postgresql", "amazon s3", "google oauth"],
    thumbnail: {
      type: "logo-text",
      primary: "Cav",
      secondary: "Rec",
      colors: ["#E57200", "#232D4B"],
    },
    github: "https://github.com/tyl3rn/CIOManager",
  },
];

function ThumbnailDisplay({ thumb, title }: { thumb: Thumbnail; title: string }) {
  if (thumb.type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={thumb.src}
        alt={title}
        className="w-full aspect-video object-cover object-top border border-neutral-200"
      />
    );
  }

  return (
    <div className="w-full aspect-video bg-white border border-neutral-200 flex items-center justify-center">
      <span className="text-3xl font-semibold tracking-tight">
        <span style={{ color: thumb.colors[0] }}>{thumb.primary}</span>
        <span style={{ color: thumb.colors[1] }}>{thumb.secondary}</span>
      </span>
    </div>
  );
}

export default function Projects() {
  return (
    <PageStagger className="flex flex-col gap-10 pt-2">
      <Fade>
        <p className="text-sm font-medium text-[#1a1a1a]">projects</p>
      </Fade>

      <GridStagger className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
        {projects.map((project) => (
          <Fade key={project.title} className="flex flex-col gap-3">
            <ThumbnailDisplay thumb={project.thumbnail} title={project.title} />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm text-[#1a1a1a]">{project.title}</p>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs text-neutral-400">{project.year}</span>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group text-xs text-neutral-400 hover:text-neutral-800 transition-colors flex items-center gap-0.5"
                  >
                    <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                    github
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group text-xs text-neutral-400 hover:text-neutral-800 transition-colors flex items-center gap-0.5"
                    >
                      <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        ↗
                      </span>
                      live
                    </a>
                  )}
                </div>
              </div>

              <p className="text-sm text-neutral-500 leading-relaxed">{project.description}</p>

              <div className="flex gap-1.5 flex-wrap">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-neutral-100 text-neutral-400 px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Fade>
        ))}
      </GridStagger>
    </PageStagger>
  );
}
