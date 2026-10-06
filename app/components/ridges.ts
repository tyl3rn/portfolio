// Stacked ridgelines: rows of horizontal lines pushed up into sharp peaks,
// like mountain ranges seen side-on. Heights come from a 3D simplex field
// (x, row, time) that's folded into creases and sharpened, so most of each
// line lies low and the creases stand up as spikes. Lines are sampled
// coarsely and joined with straight segments, which keeps every peak
// pointed. Rows are drawn back to front and each one blanks out the rows
// behind it, so ranges overlap instead of tangling. The field drifts
// sideways and evolves over time, so the peaks rise, sink, and travel.
// It's painted as fog, like the photo in the hero: a pale sky, and each
// range a little denser than the one behind it, so the near ridges stand
// out and the far ones dissolve.
// Shared by the backdrop worker and its main-thread fallback.
const GAP = 26; // px between rows
const STEP = 22; // px between samples along a row; larger = sharper, longer facets
const PEAK = 78; // px, tallest spike
const SWELL = 14; // px, broad rise and fall under the spikes
const SHARP = 4; // how much of each crease survives as a spike; higher = rarer, thinner peaks
const SCALE = 1 / 260; // noise frequency per px along a row
const ROW_SCALE = 0.11; // noise frequency per row; smaller = ranges span more rows
const SPEED = 0.00003; // noise-time per ms
const DRIFT = 0.000012; // sideways travel, in noise units per ms
const SKY_TOP = [238, 243, 248]; // thin fog up high
const SKY_BOTTOM = [218, 227, 236]; // denser fog low down
const SLATE = [166, 182, 199]; // what the nearest ranges lean toward
const HAZE = 0.15; // how far the nearest range leans toward SLATE
const LINE = "23, 26, 33"; // --ink as rgb
const ALPHA_BACK = 0.035; // top rows read as far away
const ALPHA_FRONT = 0.09; // bottom rows read as close
export const FPS = 30;

/* ---------------- 3D simplex noise ---------------- */

const GRAD = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

function makeNoise(seed: number) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  // Small LCG so the pattern is stable for a given seed.
  let s = seed >>> 0;
  for (let i = 255; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const F3 = 1 / 3;
  const G3 = 1 / 6;

  const corner = (gi: number, x: number, y: number, z: number) => {
    let t = 0.6 - x * x - y * y - z * z;
    if (t < 0) return 0;
    t *= t;
    const g = GRAD[gi % 12];
    return t * t * (g[0] * x + g[1] * y + g[2] * z);
  };

  return (x: number, y: number, z: number) => {
    const s = (x + y + z) * F3;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const t = (i + j + k) * G3;
    const x0 = x - (i - t);
    const y0 = y - (j - t);
    const z0 = z - (k - t);

    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 1, 0];
      else if (x0 >= z0) [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 0, 1];
      else [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 1, 0, 1];
    } else {
      if (y0 < z0) [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 0, 1, 1];
      else if (x0 < z0) [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 0, 1, 1];
      else [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 1, 1, 0];
    }

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    return (
      32 *
      (corner(perm[ii + perm[jj + perm[kk]]], x0, y0, z0) +
        corner(
          perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]],
          x0 - i1 + G3, y0 - j1 + G3, z0 - k1 + G3,
        ) +
        corner(
          perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]],
          x0 - i2 + 2 * G3, y0 - j2 + 2 * G3, z0 - k2 + 2 * G3,
        ) +
        corner(
          perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]],
          x0 - 1 + 3 * G3, y0 - 1 + 3 * G3, z0 - 1 + 3 * G3,
        ))
    );
  };
}

/* ---------------- renderer ---------------- */

type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export function createRidges(canvas: HTMLCanvasElement | OffscreenCanvas, ctx: Ctx) {
  const noise = makeNoise(7);
  let w = 0;
  let h = 0;
  let samples = 0;
  let ys = new Float32Array(0); // one row's heights, reused
  let sky: CanvasGradient | null = null;

  const mix = (a: number[], b: number[], t: number) =>
    a.map((v, i) => Math.round(v + (b[i] - v) * t));

  const resize = (width: number, height: number, dpr: number) => {
    w = width;
    h = height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // one sample past each edge so the lines run off screen
    samples = Math.ceil(w / STEP) + 3;
    ys = new Float32Array(samples);
    sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, `rgb(${SKY_TOP})`);
    sky.addColorStop(1, `rgb(${SKY_BOTTOM})`);
  };

  const draw = (time: number) => {
    const z = time * SPEED;
    const drift = time * DRIFT;

    if (sky) ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 1;
    ctx.lineJoin = "miter";

    // Rows run past the bottom edge far enough that their peaks still
    // poke up into view.
    const rows = Math.ceil((h + PEAK) / GAP);
    for (let r = 0; r < rows; r++) {
      const base = (r + 1) * GAP;
      for (let i = 0; i < samples; i++) {
        const x = (i - 1) * STEP;
        const nx = x * SCALE + drift;
        const ny = r * ROW_SCALE;
        const crease = 1 - Math.abs(noise(nx, ny, z));
        const swell = noise(nx * 0.35 + 50, ny * 0.5, z * 0.6) * 0.5 + 0.5;
        ys[i] = base - PEAK * crease ** SHARP - SWELL * swell;
      }

      // Fill from this ridge down to where the next row's lowest point can
      // reach, in the fog colour at this depth, hiding the rows behind.
      const depth = Math.min(1, base / h);
      const fog = mix(mix(SKY_TOP, SKY_BOTTOM, depth), SLATE, HAZE * depth);
      ctx.fillStyle = `rgb(${fog})`;
      ctx.beginPath();
      ctx.moveTo(-STEP, base + GAP + 1);
      for (let i = 0; i < samples; i++) ctx.lineTo((i - 1) * STEP, ys[i]);
      ctx.lineTo((samples - 2) * STEP, base + GAP + 1);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-STEP, ys[0]);
      for (let i = 1; i < samples; i++) ctx.lineTo((i - 1) * STEP, ys[i]);
      ctx.strokeStyle = `rgba(${LINE}, ${ALPHA_BACK + (ALPHA_FRONT - ALPHA_BACK) * depth})`;
      ctx.stroke();
    }
  };

  return { resize, draw };
}
