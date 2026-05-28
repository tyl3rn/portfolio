"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pages = [
  { href: "/", label: "home" },
  { href: "/projects", label: "projects" },
];

const links = [
  { href: "https://github.com/", label: "github" },
  { href: "https://linkedin.com/in/tyler-nguyen2028", label: "linkedin" },
  { href: "/Tyler_Resume_May28.pdf", label: "resume" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium tracking-tight">Tyler Nguyen</p>
        <p className="text-xs text-neutral-400 mt-1">university of virginia</p>
        <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
          learning to make things.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        {pages.map(({ href, label }) => {
          const active =
            pathname === href ||
            (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`group text-sm flex items-center gap-2 transition-colors ${
                active
                  ? "text-[#1a1a1a]"
                  : "text-neutral-400 hover:text-neutral-800"
              }`}
            >
              <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                →
              </span>
              {label}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-1.5">
        {links.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group text-sm flex items-center gap-2 text-neutral-400 hover:text-neutral-800 transition-colors"
          >
            <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
