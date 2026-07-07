"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const onPersonal = usePathname() === "/personal";

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-line bg-bg">
      <nav className="mx-auto max-w-5xl px-4 sm:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-sm font-medium text-ink">
          Tyler Nguyen
        </Link>

        <Link
          href={onPersonal ? "/" : "/personal"}
          className="rounded-full bg-ink px-3.5 py-1.5 text-sm font-medium text-bg hover:bg-white transition-colors"
        >
          {onPersonal ? "Home" : "Personal"}
        </Link>
      </nav>
    </header>
  );
}
