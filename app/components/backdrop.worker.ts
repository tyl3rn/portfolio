// Draws the ridgeline backdrop off the main thread so scrolling and the
// letter morphs never wait on it.
import { FPS, createRidges } from "./ridges";

type Message =
  | { type: "init"; canvas: OffscreenCanvas; w: number; h: number; dpr: number; still: boolean }
  | { type: "resize"; w: number; h: number; dpr: number }
  | { type: "still"; still: boolean }
  | { type: "visible"; visible: boolean };

let renderer: ReturnType<typeof createRidges> | null = null;
let still = false;
let visible = true;
let timer: ReturnType<typeof setTimeout> | undefined;
const start = performance.now();

const loop = () => {
  timer = undefined;
  if (!renderer) return;
  renderer.draw(performance.now() - start);
  if (!still && visible) timer = setTimeout(loop, 1000 / FPS);
};

const restart = () => {
  clearTimeout(timer);
  loop();
};

self.onmessage = (e: MessageEvent<Message>) => {
  const m = e.data;
  if (m.type === "init") {
    const ctx = m.canvas.getContext("2d");
    if (!ctx) return;
    renderer = createRidges(m.canvas, ctx);
    renderer.resize(m.w, m.h, m.dpr);
    still = m.still;
    restart();
  } else if (m.type === "resize") {
    renderer?.resize(m.w, m.h, m.dpr);
    restart();
  } else if (m.type === "still") {
    still = m.still;
    restart();
  } else if (m.type === "visible") {
    visible = m.visible;
    if (visible) restart();
    else clearTimeout(timer);
  }
};

// The bundler loads this module asynchronously, so anything posted before
// the handler above exists would be dropped. Tell the page when to start.
postMessage("ready");
