import Letters from "./letters";

// Thin monospace at rest; letters near the cursor turn heavy, casual,
// and slanted. Same Recursive family as the body copy.
const BASE = { MONO: 1, CASL: 0, wght: 350, slnt: 0 };
const NEAR = { MONO: 0, CASL: 1, wght: 900, slnt: -15 };

type Parts = string | { text: string; className?: string }[];

export function Morph({
  text,
  reach,
  intro,
}: {
  text: Parts;
  reach?: number;
  intro?: boolean;
}) {
  return <Letters text={text} base={BASE} near={NEAR} reach={reach} intro={intro} />;
}

export function HeroName({ text }: { text: string }) {
  return (
    <h1 className="text-[clamp(2.5rem,10.5vw,7rem)] leading-none tracking-tight lowercase whitespace-nowrap">
      <Letters text={text} base={BASE} near={NEAR} intro />
    </h1>
  );
}

export function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="mb-12 sm:mb-16 text-[clamp(2.25rem,7vw,4.5rem)] leading-none tracking-tight lowercase">
      <Morph text={title} />
    </h2>
  );
}
