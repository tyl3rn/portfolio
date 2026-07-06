// Hand-drawn-style NYC skyline that lives behind the studio window.
// All "randomness" is a deterministic hash so server and client render
// the exact same scene.

// Integer-only hash: Math.sin varies in the last bits between JS engines,
// which caused React hydration mismatches. Math.imul is exact everywhere.
const rnd = (a: number, b: number, c = 0) => {
  let h = Math.imul(a + 1, 374761393) ^ Math.imul(b + 1, 668265263) ^ Math.imul(c + 1, 1103515245);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

type Building = { x: number; w: number; h: number };

const MID: Building[] = [
  { x: -10, w: 80, h: 120 },
  { x: 80, w: 55, h: 165 },
  { x: 145, w: 70, h: 105 },
  { x: 225, w: 50, h: 190 },
  { x: 285, w: 85, h: 130 },
  { x: 380, w: 60, h: 175 },
  { x: 450, w: 75, h: 115 },
  { x: 535, w: 55, h: 150 },
  { x: 600, w: 90, h: 125 },
  { x: 700, w: 60, h: 160 },
  { x: 770, w: 60, h: 110 },
];

const NEAR: Building[] = [
  { x: -20, w: 95, h: 200 },
  { x: 90, w: 70, h: 150 },
  { x: 175, w: 90, h: 235 },
  { x: 280, w: 65, h: 170 },
  { x: 360, w: 100, h: 210 },
  { x: 610, w: 80, h: 185 },
  { x: 705, w: 110, h: 155 },
];

function Windows({
  b,
  bi,
  baseline,
  litColor,
  litChance,
  twinkly,
}: {
  b: Building;
  bi: number;
  baseline: number;
  litColor: string;
  litChance: number;
  twinkly: boolean;
}) {
  const top = baseline - b.h;
  const cols = Math.max(1, Math.floor((b.w - 14) / 15));
  const rows = Math.max(1, Math.floor((b.h - 18) / 19));
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const roll = rnd(bi, r, c);
      if (roll > litChance) continue;
      const flicker = twinkly && roll < 0.12;
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={b.x + 8 + c * 15}
          y={top + 10 + r * 19}
          width={7}
          height={10}
          rx={1}
          fill={litColor}
          className={flicker ? "tw" : undefined}
          style={
            flicker
              ? { animationDelay: `${round2(rnd(bi, c, r) * 4)}s` }
              : undefined
          }
        />
      );
    }
  }
  return <>{cells}</>;
}

export default function Skyline({
  playing,
  bpm = 88,
}: {
  playing: boolean;
  bpm?: number;
}) {
  const pulse = playing
    ? { animationDuration: `${round2(60 / bpm)}s` }
    : undefined;

  const stars = Array.from({ length: 34 }, (_, i) => ({
    x: round2(rnd(i, 1) * 800),
    y: round2(rnd(i, 2) * 170 + 8),
    r: round2(rnd(i, 3) * 1.2 + 0.5),
    d: round2(rnd(i, 4) * 5),
  }));

  return (
    <svg
      viewBox="0 0 800 420"
      preserveAspectRatio="xMidYMax slice"
      className="w-full h-full"
      role="img"
      aria-label="Cartoon New York skyline at night"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#171a3e" />
          <stop offset="60%" stopColor="#292b5c" />
          <stop offset="100%" stopColor="#4b3a70" />
        </linearGradient>
        <radialGradient id="moonglow">
          <stop offset="0%" stopColor="#f5f0d8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f5f0d8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="420" fill="url(#sky)" />

      {/* stars */}
      <g>
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#fffffe"
            className="tw"
            style={{ animationDelay: `${s.d}s` }}
          />
        ))}
      </g>

      {/* moon */}
      <circle cx="668" cy="72" r="58" fill="url(#moonglow)" />
      <circle cx="668" cy="72" r="26" fill="#f5f0d8" />
      <circle cx="659" cy="66" r="5" fill="#e3ddb9" />
      <circle cx="677" cy="80" r="3.5" fill="#e3ddb9" />
      <circle cx="670" cy="58" r="2.5" fill="#e3ddb9" />

      {/* clouds */}
      <g className="cloud-drift" opacity="0.55" fill="#31346b">
        <ellipse cx="150" cy="70" rx="46" ry="13" />
        <ellipse cx="185" cy="60" rx="30" ry="11" />
        <ellipse cx="120" cy="62" rx="26" ry="9" />
      </g>
      <g
        className="cloud-drift"
        style={{ animationDelay: "-9s", animationDuration: "30s" }}
        opacity="0.4"
        fill="#31346b"
      >
        <ellipse cx="450" cy="110" rx="52" ry="12" />
        <ellipse cx="490" cy="100" rx="28" ry="10" />
      </g>

      {/* little plane */}
      <g className="plane-fly">
        <g transform="translate(0 92)">
          <rect x="0" y="0" width="26" height="6" rx="3" fill="#c9c4de" />
          <polygon points="8,2 -2,-8 4,-8 13,2" fill="#a9a3c4" />
          <polygon points="8,4 -2,14 4,14 13,4" fill="#a9a3c4" />
          <circle cx="26" cy="3" r="2.4" fill="#e53170" className="blinker" />
        </g>
      </g>

      {/* far silhouette */}
      <path
        d="M0 320 L0 285 L40 285 L40 265 L75 265 L75 292 L120 292 L120 255 L128 255 L128 240 L136 240 L136 255 L175 255 L175 285 L215 285 L215 250 L260 250 L260 275 L300 275 L300 235 L306 235 L306 220 L312 220 L312 235 L350 235 L350 280 L400 280 L400 258 L445 258 L445 288 L490 288 L490 245 L540 245 L540 272 L585 272 L585 252 L635 252 L635 285 L680 285 L680 262 L730 262 L730 290 L800 290 L800 320 Z"
        fill="#232649"
      />

      {/* mid layer */}
      <g>
        {MID.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={340 - b.h} width={b.w} height={b.h} fill="#1d2044" />
            <Windows
              b={b}
              bi={i + 40}
              baseline={340}
              litColor="rgba(255, 216, 3, 0.28)"
              litChance={0.32}
              twinkly={false}
            />
          </g>
        ))}
      </g>

      {/* empire state-ish tower */}
      <g>
        <rect x="495" y="185" width="72" height="155" fill="#161832" />
        <rect x="509" y="140" width="44" height="50" fill="#161832" />
        <rect x="523" y="112" width="16" height="32" fill="#161832" />
        <line x1="531" y1="80" x2="531" y2="112" stroke="#161832" strokeWidth="3" />
        <circle cx="531" cy="78" r="3.2" fill="#e53170" className="blinker" />
        <g className={playing ? "city-pulsing" : undefined} style={pulse}>
          <rect x="509" y="142" width="44" height="6" fill="#ffd803" opacity="0.85" />
          <rect x="523" y="114" width="16" height="5" fill="#ff8906" opacity="0.85" />
        </g>
      </g>

      {/* near layer, the lit-up one that pulses with the beat */}
      <g>
        {NEAR.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={420 - b.h - 30}
            width={b.w}
            height={b.h + 30}
            fill="#12142c"
          />
        ))}
        <g className={playing ? "city-pulsing" : undefined} style={pulse}>
          {NEAR.map((b, i) => (
            <Windows
              key={i}
              b={{ ...b, h: b.h + 30 }}
              bi={i}
              baseline={420}
              litColor="#ffd803"
              litChance={0.4}
              twinkly
            />
          ))}
        </g>

        {/* water tower on the second near building */}
        <g transform="translate(108 190)">
          <line x1="6" y1="20" x2="6" y2="30" stroke="#0c0d20" strokeWidth="3" />
          <line x1="26" y1="20" x2="26" y2="30" stroke="#0c0d20" strokeWidth="3" />
          <rect x="0" y="2" width="32" height="20" rx="2" fill="#0c0d20" />
          <polygon points="-2,4 34,4 16,-8" fill="#0c0d20" />
        </g>

        {/* rooftop antenna */}
        <g transform="translate(410 178)">
          <line x1="0" y1="0" x2="0" y2="32" stroke="#0c0d20" strokeWidth="3" />
          <circle cx="0" cy="-2" r="3" fill="#e53170" className="blinker" style={{ animationDelay: "0.8s" }} />
        </g>
      </g>
    </svg>
  );
}
