import { ArrowUpRight } from "lucide-react";

const anchors = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
];

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-line bg-bg">
      <nav className="mx-auto max-w-5xl px-4 sm:px-8 h-14 flex items-center justify-between">
        <a href="#top" className="font-display text-sm font-medium text-ink">
          Tyler Nguyen
        </a>

        <div className="flex items-center gap-5 sm:gap-7">
          {anchors.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="hidden sm:block text-sm text-muted hover:text-ink transition-colors"
            >
              {label}
            </a>
          ))}
          <a
            href="https://github.com/tyl3rn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink transition-colors"
          >
            GitHub
            <ArrowUpRight size={13} aria-hidden />
          </a>
          <a
            href="/Tyler_Resume_May28 (1).pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-3.5 py-1.5 text-sm font-medium text-bg hover:bg-white transition-colors"
          >
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
}
