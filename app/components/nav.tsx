export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-line bg-bg">
      <nav className="mx-auto max-w-5xl px-4 sm:px-8 h-14 flex items-center justify-between">
        <a href="#top" className="font-display text-sm font-medium text-ink">
          Tyler Nguyen
        </a>

        <div className="flex items-center gap-5 sm:gap-7">
          <a
            href="#about"
            className="text-sm text-muted hover:text-ink transition-colors"
          >
            About
          </a>
          <a
            href="#off-the-clock"
            className="rounded-full bg-ink px-3.5 py-1.5 text-sm font-medium text-bg hover:bg-white transition-colors"
          >
            Personal
          </a>
        </div>
      </nav>
    </header>
  );
}
