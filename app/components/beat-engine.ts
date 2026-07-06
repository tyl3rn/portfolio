// A tiny synthesized beat engine. Everything is generated with the
// Web Audio API so the site ships zero audio assets.
//
// Realism comes from: swing + random timing slop, velocity variation,
// layered drum voices, a shared reverb, kick-triggered sidechain ducking,
// filter envelopes + vibrato on chords, soft saturation and compression
// on the master, and a vinyl crackle bed on the lo-fi tracks.

export type PadId = "stab" | "sub" | "zap" | "tom" | "tick" | "bell";

const note = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

// All step arrays are positions in a 16-step bar; songs loop over 4 bars
// (one chord + one bass root per bar).
export type Song = {
  id: string;
  title: string;
  vibe: string;
  bpm: number;
  chords: number[][];
  bass: number[];
  kick: number[];
  snare: number[];
  ghost: number[]; // very quiet snare hits between the backbeats
  hats: number[];
  openHats: number[];
  chordSteps: number[];
  bassSteps: number[] | "kick";
  chordType: OscillatorType;
  chordDecay: number;
  chordCutoff: number;
  swing: number; // fraction of a 16th to push odd steps late
  humanize: number; // seconds of random timing slop
  duck: number; // how hard each kick ducks the melody bus (0..1)
  clap: boolean; // backbeat is a layered clap instead of a snare
  crackle: boolean; // vinyl noise bed while playing
};

export const SONGS: Song[] = [
  {
    id: "night-drive",
    title: "night drive",
    vibe: "lo-fi, window down",
    bpm: 88,
    // Fmaj7 → Em7 → Dm7 → Cmaj7
    chords: [
      [53, 57, 60, 64],
      [52, 55, 59, 62],
      [50, 53, 57, 60],
      [48, 52, 55, 59],
    ],
    bass: [29, 28, 26, 24],
    kick: [0, 7, 10],
    snare: [4, 12],
    ghost: [11],
    hats: [0, 2, 4, 6, 8, 10, 12],
    openHats: [14],
    chordSteps: [0],
    bassSteps: "kick",
    chordType: "triangle",
    chordDecay: 1.4,
    chordCutoff: 900,
    swing: 0.16,
    humanize: 0.007,
    duck: 0.18,
    clap: false,
    crackle: true,
  },
  {
    id: "rooftop-house",
    title: "rooftop house",
    vibe: "4-on-the-floor, sunset",
    bpm: 122,
    // Am9-ish stabs
    chords: [
      [57, 60, 64, 67],
      [55, 59, 62, 66],
      [53, 57, 60, 64],
      [55, 59, 62, 66],
    ],
    bass: [33, 31, 29, 31],
    kick: [0, 4, 8, 12],
    snare: [4, 12],
    ghost: [],
    hats: [0, 4, 8, 12],
    openHats: [2, 6, 10, 14],
    chordSteps: [0, 10],
    bassSteps: [2, 6, 10, 14],
    chordType: "sawtooth",
    chordDecay: 0.5,
    chordCutoff: 1600,
    swing: 0.05,
    humanize: 0.004,
    duck: 0.5,
    clap: true,
    crackle: false,
  },
  {
    id: "subway-loop",
    title: "subway loop",
    vibe: "boom bap, downtown",
    bpm: 94,
    // Dm7 → Bbmaj7 → Gm7 → A7
    chords: [
      [50, 53, 57, 60],
      [46, 50, 53, 57],
      [43, 46, 50, 53],
      [45, 49, 52, 55],
    ],
    bass: [26, 22, 19, 21],
    kick: [0, 6, 10, 13],
    snare: [4, 12],
    ghost: [7, 15],
    hats: [0, 2, 4, 6, 8, 10, 12, 14],
    openHats: [7],
    chordSteps: [0],
    bassSteps: "kick",
    chordType: "triangle",
    chordDecay: 1.2,
    chordCutoff: 700,
    swing: 0.22,
    humanize: 0.009,
    duck: 0.12,
    clap: false,
    crackle: true,
  },
  {
    id: "arcade-dusk",
    title: "arcade dusk",
    vibe: "chiptune funk, corner store",
    bpm: 114,
    // Am7 → Fmaj7 → Cmaj7 → G
    chords: [
      [57, 60, 64, 67],
      [53, 57, 60, 64],
      [60, 64, 67, 71],
      [55, 59, 62, 67],
    ],
    bass: [33, 29, 24, 31],
    kick: [0, 3, 8, 11],
    snare: [4, 12],
    ghost: [],
    hats: [0, 2, 4, 6, 8, 10, 12, 14],
    openHats: [],
    chordSteps: [0, 8],
    bassSteps: "kick",
    chordType: "square",
    chordDecay: 0.4,
    chordCutoff: 2400,
    swing: 0.09,
    humanize: 0.005,
    duck: 0.28,
    clap: false,
    crackle: false,
  },
];

export class BeatEngine {
  playing = false;
  song: Song = SONGS[0];

  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private drums!: GainNode;
  private melody!: GainNode;
  private duckG!: GainNode;
  private verb!: ConvolverNode;
  private noiseBuf!: AudioBuffer;
  private crackleSrc: AudioBufferSourceNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private nextTime = 0;
  private xfade = 0.5;

  private ensure(): AudioContext {
    if (this.ctx) return this.ctx;
    const ctx = new AudioContext();
    this.ctx = ctx;

    // master → soft saturation → glue compressor → speakers
    this.master = ctx.createGain();
    this.master.gain.value = 0.55;

    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < curve.length; i++) {
      const x = (i / (curve.length - 1)) * 2 - 1;
      curve[i] = Math.tanh(1.4 * x) / Math.tanh(1.4);
    }
    shaper.curve = curve;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value = 18;
    comp.ratio.value = 3;
    comp.attack.value = 0.004;
    comp.release.value = 0.16;

    this.master.connect(shaper).connect(comp).connect(ctx.destination);

    this.drums = ctx.createGain();
    this.drums.connect(this.master);

    // melody runs through a duck gain so kicks can pump it
    this.duckG = ctx.createGain();
    this.duckG.connect(this.master);
    this.melody = ctx.createGain();
    this.melody.connect(this.duckG);
    this.applyCrossfade();

    // small dark room: 1.4s noise tail, squared decay
    const vLen = Math.floor(1.4 * ctx.sampleRate);
    const ir = ctx.createBuffer(2, vLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < vLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / vLen, 2.6);
      }
    }
    this.verb = ctx.createConvolver();
    this.verb.buffer = ir;
    const verbGain = ctx.createGain();
    verbGain.gain.value = 0.32;
    this.verb.connect(verbGain).connect(this.master);

    // 1s of white noise, reused for hats/snares/claps
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
      this.stopCrackle();
    } else {
      void ctx.resume();
      this.playing = true;
      this.step = 0;
      this.nextTime = ctx.currentTime + 0.06;
      this.timer = setInterval(this.schedule, 30);
      if (this.song.crackle) this.startCrackle();
    }
    return this.playing;
  }

  /** Switch tracks; takes effect immediately, even mid-playback. */
  setSong(song: Song) {
    this.song = song;
    if (this.playing) {
      if (song.crackle) this.startCrackle();
      else this.stopCrackle();
    }
  }

  dispose() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.playing = false;
    this.stopCrackle();
    void this.ctx?.close();
    this.ctx = null;
  }

  // random timing slop, ± amt seconds
  private slop() {
    return (Math.random() * 2 - 1) * this.song.humanize;
  }

  private schedule = () => {
    const ctx = this.ctx!;
    while (this.nextTime < ctx.currentTime + 0.12) {
      this.playStep(this.step, this.nextTime);
      this.nextTime += 60 / this.song.bpm / 4; // one 16th at current tempo
      this.step = (this.step + 1) % 64; // 4-bar loop
    }
  };

  private playStep(globalStep: number, t: number) {
    const s = this.song;
    const step = globalStep % 16;
    const bar = Math.floor(globalStep / 16);
    const six = 60 / s.bpm / 4;
    // swing pushes the off-16ths late, like a loose drummer
    const st = step % 2 === 1 ? t + s.swing * six : t;

    if (s.kick.includes(step)) {
      this.kick(st, step === 0 ? 1 : 0.82 + Math.random() * 0.12);
    }
    if (s.snare.includes(step)) this.snare(st + this.slop(), 1);
    if (s.ghost.includes(step) && Math.random() < 0.7) {
      this.snare(st + this.slop(), 0.22);
    }
    if (s.hats.includes(step)) {
      const accent = step % 4 === 0 ? 0.24 : 0.13;
      this.hat(st + this.slop(), accent + Math.random() * 0.05);
    }
    if (s.openHats.includes(step)) {
      this.hat(st + this.slop(), 0.14 + Math.random() * 0.04, true);
    }

    if (s.chordSteps.includes(step)) {
      this.chord(
        st + this.slop(),
        s.chords[bar],
        this.melody,
        s.chordDecay,
        s.chordCutoff,
        s.chordType,
        0.85 + Math.random() * 0.25
      );
    }
    const bassSteps = s.bassSteps === "kick" ? s.kick : s.bassSteps;
    if (bassSteps.includes(step)) {
      this.bass(st + this.slop() * 0.5, s.bass[bar], 0.9 + Math.random() * 0.15);
    }
  }

  // ---------- voices ----------

  private env(t: number, peak: number, decay: number, attack = 0): GainNode {
    const g = this.ctx!.createGain();
    if (attack > 0) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(peak, t + attack);
    } else {
      g.gain.setValueAtTime(peak, t);
    }
    g.gain.exponentialRampToValueAtTime(0.001, t + decay);
    return g;
  }

  private toVerb(node: AudioNode, amt: number) {
    const g = this.ctx!.createGain();
    g.gain.value = amt;
    node.connect(g).connect(this.verb);
  }

  private kick(t: number, vel = 1, out: GainNode = this.drums) {
    const ctx = this.ctx!;
    // body: pitch drop
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(44, t + 0.12);
    const g = this.env(t, 0.9 * vel, 0.3);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 0.32);
    // click: makes it punch instead of thud
    this.noiseHit(t, 0.22 * vel, 0.016, "highpass", 3800, out);
    // sidechain: every kick ducks the melody bus
    if (this.song.duck > 0) {
      const d = this.duckG.gain;
      d.cancelScheduledValues(t);
      d.setValueAtTime(1 - this.song.duck, t);
      d.linearRampToValueAtTime(1, t + 0.26);
    }
  }

  private noiseHit(
    t: number,
    peak: number,
    decay: number,
    filterType: BiquadFilterType,
    freq: number,
    out: GainNode,
    verbAmt = 0
  ) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.playbackRate.value = 0.9 + Math.random() * 0.2; // new texture every hit
    const f = ctx.createBiquadFilter();
    f.type = filterType;
    f.frequency.value = freq;
    const g = this.env(t, peak, decay);
    src.connect(f).connect(g).connect(out);
    if (verbAmt > 0) this.toVerb(g, verbAmt);
    src.start(t, Math.random() * 0.5); // random buffer offset
    src.stop(t + decay + 0.05);
  }

  private snare(t: number, vel = 1) {
    if (this.song.clap) {
      // layered clap: three staggered bursts + a roomy tail
      for (const off of [0, 0.011, 0.024]) {
        this.noiseHit(t + off, 0.28 * vel, 0.05, "bandpass", 1500, this.drums);
      }
      this.noiseHit(t + 0.02, 0.2 * vel, 0.22, "highpass", 1400, this.drums, 0.5);
      return;
    }
    // snare: crack + rattle + tonal body with a slight pitch drop
    this.noiseHit(t, 0.22 * vel, 0.07, "bandpass", 3400, this.drums);
    this.noiseHit(t, 0.3 * vel, 0.17, "highpass", 1600, this.drums, 0.4);
    const ctx = this.ctx!;
    const body = ctx.createOscillator();
    body.type = "triangle";
    body.frequency.setValueAtTime(196, t);
    body.frequency.exponentialRampToValueAtTime(150, t + 0.08);
    const g = this.env(t, 0.24 * vel, 0.09);
    body.connect(g).connect(this.drums);
    body.start(t);
    body.stop(t + 0.12);
  }

  private hat(t: number, peak: number, open = false) {
    // bandpass instead of plain highpass reads as metal, not static
    this.noiseHit(
      t,
      peak,
      open ? 0.24 + Math.random() * 0.08 : 0.04 + Math.random() * 0.02,
      "bandpass",
      9500,
      this.drums,
      open ? 0.25 : 0
    );
  }

  private bass(t: number, midi: number, vel = 1) {
    const ctx = this.ctx!;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(420, t);
    f.frequency.exponentialRampToValueAtTime(180, t + 0.3);
    const g = this.env(t, 0.55 * vel, 0.38, 0.008);
    f.connect(g).connect(this.melody);
    // triangle for character + sine underneath for weight
    for (const [type, mix] of [
      ["triangle", 0.7],
      ["sine", 0.5],
    ] as [OscillatorType, number][]) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = note(midi + 12);
      const og = ctx.createGain();
      og.gain.value = mix;
      osc.connect(og).connect(f);
      osc.start(t);
      osc.stop(t + 0.45);
    }
  }

  private chord(
    t: number,
    midis: number[],
    out: GainNode,
    decay: number,
    cutoff: number,
    type: OscillatorType = "triangle",
    vel = 1
  ) {
    const ctx = this.ctx!;
    // filter envelope: opens bright, settles darker
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(cutoff * 1.9, t);
    f.frequency.exponentialRampToValueAtTime(cutoff * 0.65, t + decay * 0.7);
    f.connect(out);
    this.toVerb(f, 0.45);

    // one shared vibrato LFO for the whole chord
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 4.6;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 3.5; // cents
    lfo.connect(lfoG);
    lfo.start(t);
    lfo.stop(t + decay + 0.3);

    midis.forEach((m, i) => {
      // two slightly detuned voices per note, gently strummed
      for (const cents of [-6, 6]) {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = note(m);
        osc.detune.value = cents;
        lfoG.connect(osc.detune);
        const start = t + i * (0.018 + Math.random() * 0.012);
        const g = this.env(start, 0.09 * vel, decay, 0.015);
        osc.connect(g).connect(f);
        osc.start(start);
        osc.stop(start + decay + 0.1);
      }
    });
  }

  // ---------- vinyl crackle bed ----------

  private startCrackle() {
    if (this.crackleSrc || !this.ctx) return;
    const ctx = this.ctx;
    const len = 2 * ctx.sampleRate;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.012;
    for (let p = 0; p < 46; p++) {
      const pos = Math.floor(Math.random() * (len - 40));
      const amp = 0.2 + Math.random() * 0.45;
      for (let k = 0; k < 30; k++) {
        d[pos + k] += (Math.random() * 2 - 1) * amp * (1 - k / 30);
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 5200;
    const g = ctx.createGain();
    g.gain.value = 0.35;
    src.connect(f).connect(g).connect(this.master);
    src.start();
    this.crackleSrc = src;
  }

  private stopCrackle() {
    this.crackleSrc?.stop();
    this.crackleSrc = null;
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
