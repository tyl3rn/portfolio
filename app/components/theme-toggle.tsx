"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const storageKey = "theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#fafafa");
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const initialTheme = saved === "light" ? "light" : "dark";

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
  }

  const isDark = theme === "dark";
  const label = `Switch to ${isDark ? "light" : "dark"} mode`;
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className="fixed left-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-full border border-line bg-bg/85 text-ink shadow-sm backdrop-blur transition-colors hover:bg-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <Icon size={17} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
