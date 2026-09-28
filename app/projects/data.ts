// Projects shown on the home page and at /projects/[slug]. The detail
// fields (role, timeline, sections) are placeholders until written up.

export type Project = {
  slug: string;
  title: string;
  year: string;
  description: string;
  tags: string[];
  image?: string;
  github: string;
  live?: string;
  role: string;
  timeline: string;
  sections: { heading: string; body: string[] }[];
};

const placeholderSections = (title: string) => [
  {
    heading: "Overview",
    body: [
      `Placeholder: a couple of sentences on what ${title} is, the problem it solves, and who it's for.`,
      "Placeholder: why you decided to build it, and what made it interesting.",
    ],
  },
  {
    heading: "How it works",
    body: [
      "Placeholder: walk through the architecture at a high level. What happens from the moment a user does something to the moment they see a result?",
      "Placeholder: call out the one or two technical decisions you're proudest of.",
    ],
  },
  {
    heading: "What I built",
    body: [
      "Placeholder: your specific contributions, with numbers where you have them (latency, accuracy, users, cost).",
    ],
  },
  {
    heading: "What I learned",
    body: [
      "Placeholder: what was harder than expected, and what you'd do differently next time.",
    ],
  },
];

export const projects: Project[] = [
  {
    slug: "rally",
    title: "Rally",
    year: "2026",
    description:
      "A passive personal safety app that monitors sensor signals and automatically alerts friends when someone may be in danger.",
    tags: ["React Native", "Claude API", "Node.js", "Supabase", "Express"],
    image: "/rallyportfolio.png",
    github: "https://github.com/rallyhoohacks/rally-together",
    live: "https://rally-together.com/",
    role: "Placeholder role",
    timeline: "March 2026",
    sections: placeholderSections("Rally"),
  },
  {
    slug: "cavrec",
    title: "CavRec",
    year: "2026",
    description:
      "A full-stack intramural sports management system for UVA students with team registration, scheduling, and role-based auth.",
    tags: ["Django", "PostgreSQL", "Amazon S3", "Google OAuth"],
    image: "/cavrec.png",
    github: "https://github.com/tyl3rn/CIOManager",
    role: "Placeholder role",
    timeline: "2026",
    sections: placeholderSections("CavRec"),
  },
  {
    slug: "ai-shortform-video-generator",
    title: "AI Shortform Video Generator",
    year: "2026",
    description:
      "A pipeline that turns Reddit stories into narrated vertical videos, using an AI judge to score posts and only render the ones worth watching.",
    tags: ["Python", "FastAPI", "Claude API", "ffmpeg", "edge-tts"],
    image: "/duedatepic.png",
    github: "https://github.com/tyl3rn/ai-shortform-video-generator",
    role: "Placeholder role",
    timeline: "July 2026",
    sections: placeholderSections("the AI Shortform Video Generator"),
  },
];
