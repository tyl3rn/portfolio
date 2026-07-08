import type { Metadata } from "next";

// unfinished scaffold page: keep it out of search results
export const metadata: Metadata = {
  robots: { index: false },
};

export default function About() {
  return (
    <div className="flex flex-col gap-10 pt-2">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-[10px] text-muted uppercase tracking-widest">about</p>
        <div className="flex flex-col gap-4 text-sm text-muted leading-relaxed max-w-sm">
          <p>
            hey! i&apos;m tyler, from virginia beach, va. i&apos;m a 3rd year at uva double
            majoring in computer science (b.a.) and mathematics (b.a.).
          </p>
          <p>
            i&apos;m most interested in full-stack development, systems programming, and the
            intersection of technology and creativity.
          </p>
          <p>
            outside of code, i love photography, music, and spending time with friends.
          </p>
        </div>
      </div>

      <hr className="border-line" />

      <div className="flex flex-col gap-4">
        <p className="font-mono text-[10px] text-muted uppercase tracking-widest">skills</p>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[10px] text-muted">languages</p>
            <p className="text-muted">Python, JavaScript, TypeScript, Java, C</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[10px] text-muted">frameworks</p>
            <p className="text-muted">React, Next.js, Node.js</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[10px] text-muted">tools</p>
            <p className="text-muted">Git, Linux, SQL</p>
          </div>
        </div>
      </div>
    </div>
  );
}
