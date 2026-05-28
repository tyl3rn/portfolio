import { PageStagger, Fade } from "@/app/components/motion";

const experience = [
  {
    role: "software engineering intern",
    company: "BNSF Railway",
    location: "Fort Worth, TX",
    period: "june 2026 to july 2026",
    description: "incoming summer 2026: june 1st to july 31st.",
  },
  {
    role: "software developer intern",
    company: "Booz Allen Hamilton",
    location: "remote",
    period: "april 2026 to present",
    description:
      "building llm gateways and iot edge systems for production agentic ai workflows.",
  },
  {
    role: "ai developer intern",
    company: "MyAiPathways",
    location: "Hamilton, VA",
    period: "january 2026 to april 2026",
    description: "built a full-stack document automation platform.",
  },
  {
    role: "client project developer",
    company: "ML@UVA",
    location: "Charlottesville, VA",
    period: "october 2025 to january 2026",
    description:
      "built a computer vision scoring app for the uva math tournament, reaching 96 to 100% accuracy.",
  },
  {
    role: "software engineer intern",
    company: "theCourseForum",
    location: "Charlottesville, VA",
    period: "september 2025 to december 2025",
    description:
      "built content moderation and new features for uva's course review platform serving 10k+ users.",
  },
];

export default function Home() {
  return (
    <PageStagger className="flex flex-col gap-10 pt-2">
      {/* Intro */}
      <Fade className="flex flex-col gap-3">
        <h1 className="text-sm font-medium text-[#1a1a1a]">hi, i&apos;m tyler.</h1>
        <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
          3rd year at the university of virginia studying computer science and mathematics.
          currently seeking software engineering internships for summer 2027.
        </p>
      </Fade>

      <Fade>
        <hr className="border-neutral-200" />
      </Fade>

      {/* About */}
      <Fade className="flex flex-col gap-5">
        <p className="text-sm font-medium text-[#1a1a1a]">about</p>

        <div className="flex flex-col gap-4 text-sm text-neutral-500 leading-relaxed max-w-sm">
          <p>
            i&apos;m most interested in full-stack development, ai engineering, and building
            things that solve real problems.
          </p>
          <p>
            outside of code, i love music, powerlifting, pickleball, and spending time with
            friends.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-neutral-400">languages</p>
            <p className="text-neutral-500">Python, Java, C, C++, JavaScript, SQL, R, Swift</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-neutral-400">frameworks</p>
            <p className="text-neutral-500">
              PyTorch, React, Django, Express, Node.js, Flask, OpenCV
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-neutral-400">tools</p>
            <p className="text-neutral-500">Git, Docker, AWS, Figma, Xcode</p>
          </div>
        </div>
      </Fade>

      <Fade>
        <hr className="border-neutral-200" />
      </Fade>

      {/* Experience */}
      <Fade className="flex flex-col gap-5">
        <p className="text-sm font-medium text-[#1a1a1a]">experience</p>

        <div className="flex flex-col">
          {experience.map((item, i) => (
            <div key={i}>
              {i > 0 && <hr className="border-neutral-200 my-7" />}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm text-[#1a1a1a]">{item.role}</p>
                  <p className="text-xs text-neutral-400 shrink-0">{item.period}</p>
                </div>
                <p className="text-xs text-neutral-400">
                  {item.company} · {item.location}
                </p>
                <p className="text-sm text-neutral-500 leading-relaxed mt-1 max-w-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Fade>
    </PageStagger>
  );
}
