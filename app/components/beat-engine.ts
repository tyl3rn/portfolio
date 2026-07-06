// A tiny synthesized lo-fi beat engine. Everything is generated with the
// Web Audio API so the site ships zero audio assets.

export const BPM = 88;

export type PadId = "stab" | "sub" | "zap" | "tom" | "tick" | "bell";

const note = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

// Fmaj7 → Em7 → Dm7 → Cmaj7, one chord per bar
const CHORDS: number[][] = [
  [53, 57, 60, 64],
  [52, 55, 59, 62],
  [50, 53, 57, 60],
  [48, 52, 55, 59],
];
const BASS: number[] = [29, 28, 26, 24];

const KICK_STEPS = [0, 7, 10];
const SNARE_STEPS = [4, 12];

export class BeatEngine {
  playing = false;

  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private drums!: GainNode;
  private melody!: GainNode;
  private noiseBuf!: AudioBuffer;
  private timer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private nextTime = 0;
  private xfade = 0.5;

  private ensure(): AudioContext {
    if (this.ctx) return this.ctx;
    const ctx = new AudioContext();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(ctx.destination);

    this.drums = ctx.createGain();
    this.drums.connect(this.master);
    this.melody = ctx.createGain();
    this.melody.connect(this.master);
    this.applyCrossfade();

    // 1s of white noise, reused for hats/snares/scratches
    this.noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    return ctx;
  }

  /** 0 = all drums (deck A), 1 = all keys (deck B), equal-power curve */
  setCrossfade(x: number) {
    this.xfade = Math.min(1, Math.max(0, x));
    if (this.ctx) this.applyCrossfade();
  }

  private applyCrossfade() {
    const t = this.ctx!.currentTime;
    this.drums.gain.setTargetAtTime(
      0.95 * Math.cos((this.xfade * Math.PI) / 2),
      t,
      0.03
    );
    this.melody.gain.setTargetAtTime(
      0.9 * Math.sin((this.xfade * Math.PI) / 2),
      t,
      0.03
    );
  }

  toggle(): boolean {
    const ctx = this.ensure();
    if (this.playing) {
      this.playing = false;
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
    } else {
      void ctx.resume();
      this.playing = true;
      this.step = 0;
      this.nextTime = ctx.currentTime + 0.06;
      this.timer = setInterval(this.schedule, 30);
    }
    return this.playing;
  }

  dispose() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.playing = false;
    void this.ctx?.close();
    this.ctx = null;
  }

  private schedule = () => {
    const ctx = this.ctx!;
    const sixteenth = 60 / BPM / 4;
    while (this.nextTime < ctx.currentTime + 0.12) {
      this.playStep(this.step, this.nextTime);
      this.nextTime += sixteenth;
      this.step = (this.step + 1) % 64; // 4-bar loop
    }
  };

  private playStep(globalStep: number, t: number) {
    const step = globalStep % 16;
    const bar = Math.floor(globalStep / 16);

    if (KICK_STEPS.includes(step)) this.kick(t);
    if (SNARE_STEPS.includes(step)) this.snare(t);
    if (step % 2 === 0) this.hat(t, step % 4 === 2 ? 0.1 : 0.2);
    if (step === 14 && bar % 2 === 1) this.hat(t, 0.16, true);

    if (step === 0) this.chord(t, CHORDS[bar], this.melody, 1.4, 900);
    if (KICK_STEPS.includes(step)) this.bass(t, BASS[bar]);
  }

  // ---------- voices ----------

  private env(t: number, peak: number, decay: number): GainNode {
    const g = this.ctx!.createGain();
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + decay);
    return g;
  }

  private kick(t: number, out: GainNode = this.drums) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(44, t + 0.12);
    const g = this.env(t, 0.9, 0.3);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 0.32);
  }

  private noiseHit(
    t: number,
    peak: number,
    decay: number,
    filterType: BiquadFilterType,
    freq: number,
    out: GainNode
  ) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = filterType;
    f.frequency.value = freq;
    const g = this.env(t, peak, decay);
    src.connect(f).connect(g).connect(out);
    src.start(t);
    src.stop(t + decay + 0.05);
  }

  private snare(t: number) {
    this.noiseHit(t, 0.35, 0.16, "highpass", 1700, this.drums);
    const ctx = this.ctx!;
    const body = ctx.createOscillator();
    body.type = "triangle";
    body.frequency.value = 190;
    const g = this.env(t, 0.25, 0.1);
    body.connect(g).connect(this.drums);
    body.start(t);
    body.stop(t + 0.12);
  }

  private hat(t: number, peak: number, open = false) {
    this.noiseHit(t, peak, open ? 0.3 : 0.05, "highpass", 7000, this.drums);
  }

  private bass(t: number, midi: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = note(midi + 12);
    const g = this.env(t, 0.5, 0.35);
    osc.connect(g).connect(this.melody);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  private chord(
    t: number,
    midis: number[],
    out: GainNode,
    decay: number,
    cutoff: number,
    type: OscillatorType = "triangle"
  ) {
    const ctx = this.ctx!;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = cutoff;
    f.connect(out);
    midis.forEach((m, i) => {
      // two slightly detuned voices per note, gently strummed
      for (const cents of [-6, 6]) {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = note(m);
        osc.detune.value = cents;
        const g = this.env(t + i * 0.02, 0.09, decay);
        osc.connect(g).connect(f);
        osc.start(t + i * 0.02);
        osc.stop(t + i * 0.02 + decay + 0.1);
      }
    });
  }

  // ---------- one-shot pads ----------

  pad(id: PadId) {
    const ctx = this.ensure();
    void ctx.resume();
    const t = ctx.currentTime + 0.01;

    switch (id) {
      case "stab":
        this.chord(t, [60, 64, 67, 71], this.master, 0.5, 2400, "sawtooth");
        break;
      case "sub": {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(38, t + 0.5);
        const g = this.env(t, 0.8, 0.7);
        osc.connect(g).connect(this.master);
        osc.start(t);
        osc.stop(t + 0.75);
        break;
      }
      case "zap": {
        const osc = ctx.createOscillator();
        osc.type = "square";
        osc.frequency.setValueAtTime(1100, t);
        osc.frequency.exponentialRampToValueAtTime(110, t + 0.22);
        const g = this.env(t, 0.2, 0.24);
        osc.connect(g).connect(this.master);
        osc.start(t);
        osc.stop(t + 0.28);
        break;
      }
      case "tom": {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(240, t);
        osc.frequency.exponentialRampToValueAtTime(85, t + 0.2);
        const g = this.env(t, 0.55, 0.3);
        osc.connect(g).connect(this.master);
        osc.start(t);
        osc.stop(t + 0.34);
        break;
      }
      case "tick":
        this.noiseHit(t, 0.45, 0.04, "bandpass", 3200, this.master);
        break;
      case "bell": {
        for (const freq of [540, 812]) {
          const osc = ctx.createOscillator();
          osc.type = "square";
          osc.frequency.value = freq;
          const g = this.env(t, 0.12, 0.16);
          osc.connect(g).connect(this.master);
          osc.start(t);
          osc.stop(t + 0.2);
        }
        break;
      }
    }
  }
}
