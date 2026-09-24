"use client";

import { useEffect, useRef } from "react";

// Slowly shifting topographic contour lines behind every page. A 3D
// simplex field (x, y, time) is sampled on a coarse grid each frame and
// traced with marching squares, so the lines drift and merge like a map
// of moving terrain. Kept faint so it reads as texture, not content.
const CELL = 14; // px between grid samples; smaller = smoother, slower
const SCALE = 1 / 420; // noise frequency per px; smaller = broader shapes
const SPEED = 0.000035; // noise-time per ms
const LEVELS = 12; // contour lines across the field's range
const LINE = "237, 237, 237"; // --ink as rgb
const ALPHA = 0.05; // regular lines
const ALPHA_INDEX = 0.09; // every 4th line, like index contours on a map
const FPS = 30;

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

/* ---------------- component ---------------- */

export default function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const noise = makeNoise(7);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let field = new Float32Array(0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      field = new Float32Array(cols * rows);
    };

    const draw = (time: number) => {
      const z = time * SPEED;
      // Two octaves: broad swells plus a little finer wobble.
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * CELL * SCALE;
          const y = r * CELL * SCALE;
          field[r * cols + c] =
            noise(x, y, z) + 0.35 * noise(x * 2.3 + 40, y * 2.3, z * 1.4);
        }
      }

      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;

      for (let l = 0; l < LEVELS; l++) {
        const level = -1 + (2 * (l + 0.5)) / LEVELS;
        ctx.strokeStyle = `rgba(${LINE}, ${l % 4 === 0 ? ALPHA_INDEX : ALPHA})`;
        ctx.beginPath();

        for (let r = 0; r < rows - 1; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const a = field[r * cols + c]; // top-left
            const b = field[r * cols + c + 1]; // top-right
            const cc = field[(r + 1) * cols + c + 1]; // bottom-right
            const d = field[(r + 1) * cols + c]; // bottom-left
            const idx =
              (a > level ? 8 : 0) |
              (b > level ? 4 : 0) |
              (cc > level ? 2 : 0) |
              (d > level ? 1 : 0);
            if (idx === 0 || idx === 15) continue;

            const x0 = c * CELL;
            const y0 = r * CELL;
            // Where the level crosses each cell edge.
            const top = () => [x0 + (CELL * (level - a)) / (b - a), y0];
            const right = () => [x0 + CELL, y0 + (CELL * (level - b)) / (cc - b)];
            const bottom = () => [x0 + (CELL * (level - d)) / (cc - d), y0 + CELL];
            const left = () => [x0, y0 + (CELL * (level - a)) / (d - a)];
            const seg = (p: number[], q: number[]) => {
              ctx.moveTo(p[0], p[1]);
              ctx.lineTo(q[0], q[1]);
            };

            switch (idx) {
              case 1: case 14: seg(left(), bottom()); break;
              case 2: case 13: seg(bottom(), right()); break;
              case 3: case 12: seg(left(), right()); break;
              case 4: case 11: seg(top(), right()); break;
              case 6: case 9: seg(top(), bottom()); break;
              case 7: case 8: seg(left(), top()); break;
              case 5: seg(left(), top()); seg(bottom(), right()); break;
              case 10: seg(top(), right()); seg(left(), bottom()); break;
            }
          }
        }
        ctx.stroke();
      }
    };

    resize();
    let raf = 0;
    let last = -Infinity;
    const start = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 1000 / FPS) return;
      last = now;
      draw(now - start);
    };

    const run = () => {
      cancelAnimationFrame(raf);
      if (still.matches) draw(0);
      else raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      resize();
      if (still.matches) draw(0);
    };

    run();
    window.addEventListener("resize", onResize);
    still.addEventListener("change", run);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      still.removeEventListener("change", run);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
