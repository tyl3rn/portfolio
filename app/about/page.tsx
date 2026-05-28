export default function About() {
  return (
    <div className="flex flex-col gap-10 pt-2">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">about</p>
        <div className="flex flex-col gap-4 text-sm text-neutral-500 leading-relaxed max-w-sm">
          <p>
            hey! i&apos;m tyler, a 3rd year at uva double majoring in computer science (b.a.)
            and mathematics (b.a.).
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

      <hr className="border-neutral-200" />

      <div className="flex flex-col gap-4">
        <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">skills</p>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[10px] text-neutral-400">languages</p>
            <p className="text-neutral-500">Python, JavaScript, TypeScript, Java, C</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[10px] text-neutral-400">frameworks</p>
            <p className="text-neutral-500">React, Next.js, Node.js</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[10px] text-neutral-400">tools</p>
            <p className="text-neutral-500">Git, Linux, SQL</p>
          </div>
        </div>
      </div>
    </div>
  );
}
