const experience = [
  {
    role: "software engineering intern",
    company: "[Company]",
    period: "summer 2026",
    description:
      "what you did here. keep it concise and impactful. mention the tech you used and what you shipped.",
  },
  {
    role: "teaching assistant",
    company: "[Course] at UVA",
    period: "fall 2025 to present",
    description:
      "ran office hours, helped students understand concepts, and graded assignments.",
  },
  {
    role: "member",
    company: "[Club / Organization]",
    period: "2024 to present",
    description: "describe what you do here.",
  },
];

export default function Experience() {
  return (
    <div className="flex flex-col gap-10 pt-2">
      <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
        experience
      </p>

      <div className="flex flex-col">
        {experience.map((item, i) => (
          <div key={i}>
            {i > 0 && <hr className="border-neutral-200 my-8" />}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-sm font-medium">{item.role}</p>
                <p className="font-mono text-[10px] text-neutral-400 shrink-0">{item.period}</p>
              </div>
              <p className="font-mono text-[10px] text-neutral-400">{item.company}</p>
              <p className="text-sm text-neutral-500 leading-relaxed mt-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
