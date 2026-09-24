export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}

export function SectionHead({ no, title }: { no: string; title: string }) {
  return (
    <Reveal className="mb-10 sm:mb-12 flex items-baseline gap-4">
      <span className="text-xs tracking-[0.2em] text-muted tabular-nums">
        {no}
      </span>
      <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
        {title}
      </h2>
    </Reveal>
  );
}
