/**
 * Engine âm thanh 5 THEME — tổng hợp 100% Web Audio (không file, không bản quyền).
 *
 * CÔNG THỨC "ĐÃ TAI" (mọi tiếng đều 3 lớp):
 *  1. TRANSIENT — click/thump cực ngắn cho cảm giác "chạm được"
 *  2. BODY     — thân nốt (osc chính, có thể 2 osc detune cho dày)
 *  3. AIR      — đuôi vang: reverb convolver sinh IR riêng theo theme
 *  + humanize (±cents, ±volume, pan nhẹ) → không bao giờ nghe "máy"
 *
 * GIỌNG THEO THEME:
 *  · game   — NEON arcade: square/saw zap, sub-kick, sparkle chip
 *  · apple  — THUỶ TINH: chuông pha lê 3 hoạ âm, vang bloom lạnh
 *  · cozy   — ẤM ÁP: kalimba gỗ + thump ấm, music-box, vỗ tay mềm
 *  · dreamy — MỘNG MƠ: celesta + pad, vang dài bay bổng
 *  · studio — XƯỞNG: thock phím cơ khô, snap chuẩn, gần như không vang
 */

type ThemeId = "game" | "apple" | "cozy" | "dreamy" | "studio";
const THEME_SET = new Set<ThemeId>(["game", "apple", "cozy", "dreamy", "studio"]);

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let verbIn: ConvolverNode | null = null;
let verbOut: GainNode | null = null;
let verbTheme: ThemeId | null = null;
let _muted: boolean | null = null;

function theme(): ThemeId {
  if (typeof document === "undefined") return "game";
  const t = document.documentElement.getAttribute("data-theme") as ThemeId | null;
  return t && THEME_SET.has(t) ? t : "game";
}

function muted(): boolean {
  if (_muted === null) {
    _muted = typeof window !== "undefined" && window.localStorage.getItem("lw_muted") === "1";
  }
  return _muted;
}
export function isMuted(): boolean {
  return muted();
}
export function setMuted(m: boolean): void {
  _muted = m;
  if (typeof window !== "undefined") window.localStorage.setItem("lw_muted", m ? "1" : "0");
  if (master && ctx) master.gain.setValueAtTime(m ? 0 : 0.62, ctx.currentTime);
}

/** Không gian vang theo theme: thời lượng, tốc độ tắt, độ tối, mức wet */
const VERB: Record<ThemeId, { dur: number; decay: number; damp: number; wet: number }> = {
  game: { dur: 0.5, decay: 3.4, damp: 0.3, wet: 0.14 },
  apple: { dur: 1.7, decay: 2.6, damp: 0.22, wet: 0.32 },
  cozy: { dur: 0.9, decay: 3.0, damp: 0.12, wet: 0.2 },
  dreamy: { dur: 2.6, decay: 2.1, damp: 0.18, wet: 0.46 },
  studio: { dur: 0.28, decay: 4.2, damp: 0.32, wet: 0.07 },
};

/** IR tổng hợp: noise × decay mũ + one-pole lowpass (damp) → vang tự nhiên, 0 file */
function buildIR(c: AudioContext, id: ThemeId): AudioBuffer {
  const { dur, decay, damp } = VERB[id];
  const n = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(2, n, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < n; i++) {
      const white = Math.random() * 2 - 1;
      lp += damp * (white - lp);
      d[i] = lp * Math.pow(1 - i / n, decay);
    }
  }
  return buf;
}

function ensureVerb() {
  if (!ctx || !master) return;
  const id = theme();
  if (!verbIn) {
    verbIn = ctx.createConvolver();
    verbOut = ctx.createGain();
    verbIn.connect(verbOut);
    verbOut.connect(master);
  }
  if (verbTheme !== id) {
    verbTheme = id;
    verbIn.buffer = buildIR(ctx, id);
    verbOut!.gain.value = VERB[id].wet;
  }
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value = 12;
    comp.ratio.value = 5;
    master = ctx.createGain();
    master.gain.value = muted() ? 0 : 0.62;
    master.connect(comp);
    comp.connect(ctx.destination);
    // Mo khoa iOS: phat 1 buffer CAM (silent) ngay trong gesture dau tien
    try {
      const b = ctx.createBuffer(1, 1, 22050);
      const s = ctx.createBufferSource();
      s.buffer = b;
      s.connect(ctx.destination);
      s.start(0);
    } catch {
      /* ignore */
    }
  }
  ensureVerb();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Resume xong mới lịch tiếng → hết cảnh iOS "lúc nghe được lúc không". */
function audio(play: (t: number) => void): void {
  if (muted()) return;
  const c = ac();
  if (!c || !master) return;
  const run = () => play(c.currentTime);
  if (c.state === "running") run();
  else c.resume().then(run).catch(run);
}

// ---------- dụng cụ chung ----------
const rand = (a: number, b: number) => a + Math.random() * (b - a);
/** dịch tần số theo cents (100 cents = nửa cung) */
const cents = (f: number, c: number) => f * Math.pow(2, c / 1200);
/** humanize: mỗi lần phát hơi khác một chút → không bị "máy móc" */
const hz = (f: number) => cents(f, rand(-7, 7));
const semi = (f: number, s: number) => f * Math.pow(2, s / 12);

/** đầu ra chuẩn: g → master (+ share sang reverb theo send) + pan nhẹ */
function out(c: AudioContext, g: GainNode, send: number, pan: number) {
  let node: AudioNode = g;
  if (pan !== 0 && typeof c.createStereoPanner === "function") {
    const p = c.createStereoPanner();
    p.pan.value = pan;
    g.connect(p);
    node = p;
  }
  node.connect(master!);
  if (send > 0 && verbIn) {
    const s = c.createGain();
    s.gain.value = send;
    node.connect(s);
    s.connect(verbIn);
  }
}

interface ToneOpts {
  type?: OscillatorType;
  peak?: number;
  glide?: number;
  detune?: number;
  filterStart?: number;
  filterEnd?: number;
  q?: number;
  attack?: number;
  /** thời gian decay riêng (mặc định = dur) */
  release?: number;
  /** rung nhẹ (vibrato) — Hz và độ sâu cents */
  vibHz?: number;
  vibCents?: number;
  /** lượng gửi sang reverb 0..1 */
  send?: number;
  /** pan -1..1 (mặc định 0) */
  pan?: number;
}
function tone(freq: number, t: number, dur: number, o: ToneOpts = {}) {
  const c = ac();
  if (!c || !master) return;
  const osc = c.createOscillator();
  osc.type = o.type ?? "sawtooth";
  osc.frequency.setValueAtTime(freq, t);
  if (o.glide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.glide), t + dur);
  if (o.detune) osc.detune.setValueAtTime(o.detune, t);

  if (o.vibHz && o.vibCents) {
    const lfo = c.createOscillator();
    lfo.frequency.value = o.vibHz;
    const lg = c.createGain();
    lg.gain.value = (o.vibCents / 100) * freq * 0.06;
    lfo.connect(lg);
    lg.connect(osc.frequency);
    lfo.start(t);
    lfo.stop(t + dur + 0.05);
  }

  const g = c.createGain();
  const peak = (o.peak ?? 0.12) * rand(0.92, 1.06);
  const atk = o.attack ?? Math.min(0.008, dur * 0.25);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + atk);
  g.gain.exponentialRampToValueAtTime(0.0001, t + (o.release ?? dur));

  let node: AudioNode = osc;
  if (o.filterStart) {
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(o.filterStart, t);
    if (o.filterEnd) f.frequency.exponentialRampToValueAtTime(Math.max(80, o.filterEnd), t + dur);
    f.Q.value = o.q ?? 4;
    osc.connect(f);
    node = f;
  }
  node.connect(g);
  out(c, g, o.send ?? 0, o.pan ?? 0);
  osc.start(t);
  osc.stop(t + (o.release ?? dur) + 0.08);
}

/** 2 osc detune ± cents — thân nốt DÀY (lead game, fanfare) */
function duo(freq: number, t: number, dur: number, o: ToneOpts = {}, spread = 9) {
  tone(freq, t, dur, { ...o, detune: spread, peak: (o.peak ?? 0.12) * 0.62 });
  tone(freq, t, dur, { ...o, detune: -spread, peak: (o.peak ?? 0.12) * 0.62 });
}

function noiseHit(
  t: number,
  dur: number,
  peak: number,
  fStart: number,
  fEnd: number,
  q = 1,
  type: BiquadFilterType = "bandpass",
  send = 0,
  pan = 0,
) {
  const c = ac();
  if (!c || !master) return;
  const n = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, n, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = type;
  bp.frequency.setValueAtTime(fStart, t);
  bp.frequency.exponentialRampToValueAtTime(Math.max(80, fEnd), t + dur);
  bp.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak * rand(0.9, 1.1), t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp);
  bp.connect(g);
  out(c, g, send, pan);
  src.start(t);
  src.stop(t + dur + 0.02);
}

/** TRANSIENT click — 8-14ms noise, cho cảm giác "chạm" */
function click(t: number, bright = 3600, peak = 0.05, send = 0) {
  noiseHit(t, 0.013, peak, bright, bright * 0.55, 2.2, "bandpass", send);
}
/** TRANSIENT thump — sub tròn 70-140Hz tụt cao độ, cho cảm giác "nặng tay" */
function thump(t: number, f = 110, peak = 0.1) {
  tone(f * 2.1, t, 0.085, { type: "sine", peak, glide: f, attack: 0.002 });
}

/** Chuông pha lê (apple): 3 hoạ âm thuỷ tinh thật (1 / 2.32 / 4.25) */
function bell(freq: number, t: number, peak = 0.08, dur = 0.55, send = 0.38) {
  const pan = rand(-0.25, 0.25);
  tone(freq, t, dur, { type: "sine", peak, attack: 0.003, send, pan });
  tone(freq * 2.32, t, dur * 0.5, { type: "sine", peak: peak * 0.22, attack: 0.002, send: send * 0.8, pan });
  tone(freq * 4.25, t, dur * 0.22, { type: "sine", peak: peak * 0.1, attack: 0.001, send: send * 0.6, pan });
  click(t, 6200, peak * 0.3);
}

/** Kalimba gỗ (cozy): thân triangle ấm + hoạ âm lệch + "thịch" nỉ */
function pluck(freq: number, t: number, peak = 0.15, dur = 0.45, send = 0.22) {
  const pan = rand(-0.18, 0.18);
  tone(freq, t, dur, { type: "triangle", peak, attack: 0.002, filterStart: freq * 4.5, filterEnd: freq * 1.7, q: 1, send, pan });
  tone(freq * 3.93, t, 0.1, { type: "sine", peak: peak * 0.2, attack: 0.001, pan });
  noiseHit(t, 0.018, peak * 0.32, 1300, 650, 1.2, "lowpass");
}

/** Celesta mơ (dreamy): sine mềm + lấp lánh 4x, vang dài */
function cel(freq: number, t: number, peak = 0.06, dur = 0.7, send = 0.5) {
  const pan = rand(-0.3, 0.3);
  tone(freq, t, dur, { type: "sine", peak, attack: 0.007, send, pan });
  tone(freq * 4, t, dur * 0.25, { type: "sine", peak: peak * 0.12, attack: 0.004, send: send * 0.8, pan });
}

/** Thock phím cơ (studio): noise đanh + body gỗ 190Hz + sub nhẹ — ASMR bàn phím */
function thock(t: number, bright = 2400, peak = 0.075) {
  noiseHit(t, 0.014, peak, bright, bright * 0.5, 2.6);
  tone(hz(186), t, 0.032, { type: "triangle", peak: peak * 0.75, attack: 0.001 });
  tone(hz(88), t, 0.045, { type: "sine", peak: peak * 0.4, attack: 0.001 });
}

// pentatonic C: bậc thang combo (đúng liên tiếp = nốt leo cao dần)
const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
const comboSemi = (combo: number) => PENTA[Math.min(Math.max(combo - 1, 0), PENTA.length - 1)];

// tap xoay vòng note pool — mỗi lần bấm một nốt khác
let tapStep = 0;

// note thường dùng
const C5 = 523.25, E5 = 659.25, G5 = 783.99, A5 = 880, C6 = 1046.5, E6 = 1318.51, G6 = 1567.98, C7 = 2093, E7 = 2637;

// ============================================================
// VOICE 1 — GAME (NEON arcade: zap điện, sub-kick, sparkle chip)
// ============================================================
const game = {
  tap(t: number) {
    const roots = [660, 742, 880];
    const f = roots[tapStep++ % roots.length];
    thump(t, 104, 0.085);
    tone(hz(f), t, 0.06, { type: "square", peak: 0.085, glide: f * 2.1, filterStart: 1700, filterEnd: 5600, q: 3.5, attack: 0.002, send: 0.1 });
    click(t, 5200, 0.035);
  },
  pop(t: number) {
    tone(hz(520), t, 0.07, { type: "square", peak: 0.06, glide: 990, filterStart: 1300, filterEnd: 4200, q: 3, send: 0.1 });
    click(t, 4400, 0.03);
  },
  flip(t: number) {
    thump(t, 120, 0.1);
    tone(hz(240), t, 0.13, { type: "sawtooth", peak: 0.13, glide: 1450, filterStart: 800, filterEnd: 3800, q: 7, send: 0.12 });
    tone(hz(C6), t + 0.1, 0.18, { type: "square", peak: 0.07, send: 0.15 });
    tone(hz(G6), t + 0.16, 0.16, { type: "sine", peak: 0.06, send: 0.2 });
  },
  swipe(t: number) {
    tone(hz(2000), t, 0.16, { type: "sawtooth", peak: 0.1, glide: 420, filterStart: 6200, filterEnd: 800, q: 11, send: 0.1 });
    noiseHit(t, 0.12, 0.05, 3400, 800, 1.5);
    thump(t + 0.02, 92, 0.07);
  },
  correct(t: number, combo: number) {
    const up = comboSemi(combo);
    // kick nặng → dyad chip root+5th → spark
    tone(hz(150), t, 0.11, { type: "sine", peak: 0.17, glide: 50, attack: 0.001 });
    click(t, 3400, 0.05);
    duo(semi(hz(C5), up), t + 0.02, 0.2, { type: "square", peak: 0.13, filterStart: 2400, filterEnd: 5200, q: 2, send: 0.14 });
    duo(semi(hz(G5), up), t + 0.09, 0.22, { type: "square", peak: 0.12, filterStart: 2600, filterEnd: 5600, q: 2, send: 0.16 });
    tone(semi(hz(E7), up), t + 0.16, 0.18, { type: "sine", peak: 0.06, send: 0.3 });
    if (combo >= 5) {
      [0, 4, 7, 12].forEach((s, i) => tone(semi(hz(C7), up + s), t + 0.22 + i * 0.042, 0.13, { type: "sine", peak: 0.045, send: 0.35, pan: rand(-0.4, 0.4) }));
    }
  },
  wrong(t: number) {
    tone(hz(330), t, 0.2, { type: "square", peak: 0.12, glide: 208, filterStart: 1600, filterEnd: 420, q: 6 });
    tone(hz(112), t + 0.03, 0.18, { type: "sine", peak: 0.12, glide: 66 });
    noiseHit(t + 0.01, 0.1, 0.045, 520, 150, 1.8);
  },
  complete(t: number) {
    tone(hz(130), t, 0.14, { type: "sine", peak: 0.15, glide: 55 });
    [392, C5, E5, G5, C6].forEach((f, i) => {
      duo(hz(f), t + 0.05 + i * 0.085, 0.3, { type: "square", peak: 0.1, filterStart: 2200 + i * 500, filterEnd: 5200, q: 2.5, send: 0.16 });
    });
    [C7, E7, 3136].forEach((f, i) => tone(hz(f), t + 0.5 + i * 0.055, 0.26, { type: "sine", peak: 0.05, send: 0.35, pan: rand(-0.4, 0.4) }));
    noiseHit(t + 0.45, 0.28, 0.035, 3200, 7800, 1, "highpass", 0.3);
  },
  levelup(t: number) {
    tone(hz(180), t, 0.44, { type: "sawtooth", peak: 0.11, glide: 740, filterStart: 400, filterEnd: 3400, q: 9, send: 0.15 });
    thump(t + 0.44, 130, 0.14);
    [C5, E5, G5, C6].forEach((f, i) =>
      duo(hz(f), t + 0.46 + i * 0.09, 0.34, { type: "square", peak: 0.1, filterStart: 2400, filterEnd: 5200, q: 2.5, send: 0.18 }),
    );
    [C7, E7, 3136, 4186].forEach((f, i) => tone(hz(f), t + 0.86 + i * 0.05, 0.3, { type: "sine", peak: 0.05, send: 0.4, pan: rand(-0.45, 0.45) }));
  },
  goal(t: number) {
    thump(t, 120, 0.11);
    [E5, G5, C6].forEach((f, i) => duo(hz(f), t + i * 0.08, 0.24, { type: "square", peak: 0.09, filterStart: 2600, filterEnd: 4800, q: 2, send: 0.15 }));
    noiseHit(t + 0.26, 0.2, 0.035, 2600, 6800, 1, "highpass", 0.25);
  },
  tick(t: number) {
    tone(hz(1760), t, 0.04, { type: "square", peak: 0.05, attack: 0.001 });
  },
  timeup(t: number) {
    tone(hz(392), t, 0.26, { type: "square", peak: 0.1, glide: 330, filterStart: 2000, filterEnd: 700, q: 4 });
    tone(hz(196), t + 0.14, 0.32, { type: "sawtooth", peak: 0.1, glide: 98, filterStart: 900, filterEnd: 220, q: 6 });
  },
  switch_(t: number) {
    tone(hz(220), t, 0.36, { type: "sawtooth", peak: 0.1, glide: 1760, filterStart: 500, filterEnd: 6000, q: 8, send: 0.12 });
    noiseHit(t + 0.05, 0.26, 0.045, 900, 5400, 1.3, "bandpass", 0.2);
    thump(t + 0.34, 120, 0.12);
    duo(hz(C6), t + 0.36, 0.22, { type: "square", peak: 0.09, filterStart: 2600, filterEnd: 5000, q: 2, send: 0.2 });
    tone(hz(G6), t + 0.44, 0.2, { type: "sine", peak: 0.055, send: 0.3 });
  },
};

// ============================================================
// VOICE 2 — APPLE (THUỶ TINH: chuông pha lê, bloom lạnh)
// ============================================================
const apple = {
  tap(t: number) {
    const roots = [1976, C7, 2349];
    bell(hz(roots[tapStep++ % roots.length]), t, 0.055, 0.16, 0.3);
  },
  pop(t: number) {
    bell(hz(G6), t, 0.045, 0.12, 0.25);
  },
  flip(t: number) {
    bell(hz(1174.7), t, 0.06, 0.3, 0.35);
    bell(hz(1760), t + 0.07, 0.05, 0.4, 0.4);
    noiseHit(t, 0.05, 0.012, 5200, 7000, 1, "highpass", 0.3);
  },
  swipe(t: number) {
    noiseHit(t, 0.14, 0.035, 3600, 520, 0.9, "lowpass", 0.15);
    bell(hz(A5), t + 0.02, 0.03, 0.16, 0.3);
  },
  correct(t: number, combo: number) {
    const up = comboSemi(combo);
    tone(hz(196), t, 0.05, { type: "sine", peak: 0.09, attack: 0.002 }); // thock nỉ
    bell(semi(hz(E5), up), t + 0.02, 0.1, 0.42, 0.42);
    bell(semi(hz(987.77), up), t + 0.1, 0.09, 0.55, 0.46);
    if (combo >= 5) bell(semi(hz(E6), up), t + 0.2, 0.07, 0.6, 0.5);
  },
  wrong(t: number) {
    // đặt ly xuống bàn — trầm, có nỉ, không gắt
    tone(hz(233), t, 0.22, { type: "sine", peak: 0.1, glide: 200, send: 0.2 });
    tone(hz(116), t + 0.02, 0.14, { type: "sine", peak: 0.07 });
    noiseHit(t, 0.03, 0.02, 700, 380, 1.2, "lowpass");
  },
  complete(t: number) {
    [C5, E5, G5, C6].forEach((f, i) => bell(hz(f), t + i * 0.1, 0.08, 0.6, 0.42));
    bell(hz(C7), t + 0.46, 0.055, 1.1, 0.55);
    [261.63, 392].forEach((f) => tone(hz(f), t + 0.4, 0.9, { type: "sine", peak: 0.045, attack: 0.08, send: 0.4 }));
  },
  levelup(t: number) {
    [C5, G5, C6, E6, G6].forEach((f, i) => bell(hz(f), t + i * 0.09, 0.07, 0.7, 0.48));
    bell(hz(C7), t + 0.5, 0.05, 1.3, 0.6);
  },
  goal(t: number) {
    [E5, 987.77, E6].forEach((f, i) => bell(hz(f), t + i * 0.1, 0.065, 0.55, 0.45));
  },
  tick(t: number) {
    bell(hz(G6), t, 0.035, 0.08, 0.15);
  },
  timeup(t: number) {
    bell(hz(440), t, 0.08, 0.4, 0.4);
    tone(hz(220), t + 0.12, 0.28, { type: "sine", peak: 0.07, glide: 185, send: 0.25 });
  },
  switch_(t: number) {
    noiseHit(t, 0.2, 0.03, 600, 4200, 0.8, "lowpass", 0.2);
    [G5, 1174.7, G6].forEach((f, i) => bell(hz(f), t + 0.1 + i * 0.09, 0.06, 0.6, 0.5));
  },
};

// ============================================================
// VOICE 3 — COZY (ẤM ÁP: kalimba gỗ, music-box, vỗ tay mềm)
// ============================================================
const cozy = {
  tap(t: number) {
    const pool = [G5, A5, C6, 1174.7];
    thump(t, 96, 0.05);
    pluck(hz(pool[tapStep++ % pool.length]), t, 0.12, 0.32);
  },
  pop(t: number) {
    pluck(hz(E6), t, 0.08, 0.2);
  },
  flip(t: number) {
    pluck(hz(C5), t, 0.13, 0.35);
    pluck(hz(E5), t + 0.07, 0.11, 0.4);
    noiseHit(t + 0.01, 0.05, 0.02, 900, 500, 0.8, "lowpass"); // sột soạt giấy
  },
  swipe(t: number) {
    tone(hz(480), t, 0.13, { type: "sine", peak: 0.07, glide: 900, send: 0.15 }); // huýt nhẹ
    noiseHit(t, 0.1, 0.03, 1100, 420, 0.8, "lowpass");
  },
  correct(t: number, combo: number) {
    const up = comboSemi(combo);
    thump(t, 100, 0.12);
    tone(semi(hz(130.8), Math.min(up, 12)), t, 0.2, { type: "sine", peak: 0.1, attack: 0.003, send: 0.15 }); // marimba trầm
    pluck(semi(hz(C5), up), t + 0.01, 0.15, 0.4);
    pluck(semi(hz(E5), up), t + 0.08, 0.14, 0.42);
    pluck(semi(hz(G5), up), t + 0.15, 0.14, 0.5);
    if (combo >= 5) pluck(semi(hz(C6), up), t + 0.24, 0.12, 0.55, 0.3);
  },
  wrong(t: number) {
    // "aww" tròn trịa: 2 nốt tụt vibrato qua lowpass — dịu như bông
    tone(hz(329.6), t, 0.16, { type: "triangle", peak: 0.1, vibHz: 7, vibCents: 35, filterStart: 1400, filterEnd: 700, q: 1 });
    tone(hz(311.1), t + 0.14, 0.26, { type: "triangle", peak: 0.1, vibHz: 6, vibCents: 45, filterStart: 1200, filterEnd: 600, q: 1 });
    thump(t + 0.02, 84, 0.07);
  },
  complete(t: number) {
    // music-box + vỗ tay lụp bụp
    [C5, E5, G5, A5, G5, C6].forEach((f, i) => pluck(hz(f), t + i * 0.082, 0.13, 0.5, 0.28));
    [261.63, 329.63, 392].forEach((f) => tone(hz(f), t + 0.52, 0.7, { type: "triangle", peak: 0.06, attack: 0.03, send: 0.3 }));
    [0.6, 0.7, 0.82].forEach((d) => noiseHit(t + d, 0.045, 0.055, 1050, 680, 1.2, "bandpass", 0.2));
  },
  levelup(t: number) {
    [C5, 587.33, E5, G5, A5, C6, 1174.7, E6].forEach((f, i) => pluck(hz(f), t + i * 0.055, 0.12, 0.45, 0.3));
    [261.63, 329.63, 392].forEach((f) => tone(hz(f), t + 0.5, 0.6, { type: "triangle", peak: 0.08, attack: 0.02, send: 0.3 }));
    [0.75, 0.85, 0.97, 1.07].forEach((d) => noiseHit(t + d, 0.045, 0.05, 1100, 700, 1.2, "bandpass", 0.2));
  },
  goal(t: number) {
    [E5, G5, C6].forEach((f, i) => pluck(hz(f), t + i * 0.08, 0.13, 0.5, 0.3));
    [0.32, 0.42].forEach((d) => noiseHit(t + d, 0.04, 0.045, 1100, 700, 1.2, "bandpass", 0.2));
  },
  tick(t: number) {
    pluck(hz(E6), t, 0.055, 0.12, 0.08);
  },
  timeup(t: number) {
    tone(hz(392), t, 0.18, { type: "triangle", peak: 0.09, vibHz: 6, vibCents: 35, filterStart: 1400, filterEnd: 700 });
    tone(hz(349.2), t + 0.16, 0.28, { type: "triangle", peak: 0.09, vibHz: 6, vibCents: 45, filterStart: 1200, filterEnd: 600 });
  },
  switch_(t: number) {
    [C5, E5, G5, C6].forEach((f, i) => pluck(hz(f), t + i * 0.05, 0.11, 0.4, 0.3));
    noiseHit(t, 0.16, 0.02, 700, 2200, 0.7, "bandpass", 0.15);
  },
};

// ============================================================
// VOICE 4 — DREAMY (MỘNG MƠ: celesta + pad, vang dài bay bổng)
// ============================================================
const dreamy = {
  tap(t: number) {
    const pool = [E6, G6, 1760, C7];
    cel(hz(pool[tapStep++ % pool.length]), t, 0.05, 0.5);
    click(t, 3400, 0.012); // định vị nhẹ cho khỏi "mất hút"
  },
  pop(t: number) {
    cel(hz(G6), t, 0.04, 0.4);
  },
  flip(t: number) {
    cel(hz(A5), t, 0.06, 0.7);
    cel(hz(E6), t + 0.08, 0.05, 0.8);
    noiseHit(t, 0.18, 0.012, 2800, 5200, 0.7, "highpass", 0.4); // gió thoảng
  },
  swipe(t: number) {
    noiseHit(t, 0.2, 0.024, 1800, 4600, 0.6, "highpass", 0.35);
    cel(hz(C6), t + 0.04, 0.03, 0.5);
  },
  correct(t: number, combo: number) {
    const up = comboSemi(combo);
    tone(hz(220), t, 0.45, { type: "sine", peak: 0.05, attack: 0.04, send: 0.4 }); // pad nền
    cel(semi(hz(G5), up), t + 0.01, 0.08, 0.8);
    cel(semi(hz(1174.7), up), t + 0.09, 0.07, 0.9);
    cel(semi(hz(G6), up), t + 0.18, 0.06, 1);
    if (combo >= 5) cel(semi(hz(C7), up), t + 0.28, 0.05, 1.1, 0.6);
  },
  wrong(t: number) {
    // thở dài dịu — 2 nốt xuống attack mềm
    tone(hz(392), t, 0.28, { type: "sine", peak: 0.07, attack: 0.025, glide: 372, send: 0.3 });
    tone(hz(311.1), t + 0.2, 0.4, { type: "sine", peak: 0.07, attack: 0.03, vibHz: 4.5, vibCents: 22, send: 0.35 });
  },
  complete(t: number) {
    [C5, 587.33, E5, G5, A5, C6, E6].forEach((f, i) => cel(hz(f), t + i * 0.068, 0.06, 1, 0.55));
    [261.63, 329.63, 392].forEach((f) => tone(hz(f), t + 0.42, 1.1, { type: "sine", peak: 0.045, attack: 0.1, send: 0.5 }));
  },
  levelup(t: number) {
    [C5, E5, G5, C6, E6, G6, C7].forEach((f, i) => cel(hz(f), t + i * 0.075, 0.055, 1.1, 0.6));
    [329.63, 415.3, 493.88].forEach((f) => tone(hz(f), t + 0.56, 1.2, { type: "sine", peak: 0.05, attack: 0.12, send: 0.55 }));
  },
  goal(t: number) {
    [E5, A5, E6].forEach((f, i) => cel(hz(f), t + i * 0.1, 0.055, 0.9, 0.55));
  },
  tick(t: number) {
    cel(hz(1760), t, 0.028, 0.14, 0.15);
  },
  timeup(t: number) {
    cel(hz(C6), t, 0.06, 0.6);
    tone(hz(261.63), t + 0.16, 0.45, { type: "sine", peak: 0.06, attack: 0.03, glide: 233, send: 0.35 });
  },
  switch_(t: number) {
    noiseHit(t, 0.35, 0.018, 1400, 5400, 0.5, "highpass", 0.4);
    [G5, C6, E6, G6].forEach((f, i) => cel(hz(f), t + 0.06 + i * 0.085, 0.05, 0.9, 0.6));
  },
};

// ============================================================
// VOICE 5 — STUDIO (XƯỞNG: thock phím cơ, snap, gần như KHÔ)
// ============================================================
const studio = {
  tap(t: number) {
    const brights = [2100, 2600, 3200];
    thock(t, brights[tapStep++ % brights.length], 0.08);
  },
  pop(t: number) {
    thock(t, 1900, 0.06);
  },
  flip(t: number) {
    thock(t, 2400, 0.07);
    tone(hz(587.33), t + 0.03, 0.12, { type: "triangle", peak: 0.08, filterStart: 2400, filterEnd: 1200, q: 2 });
    tone(hz(A5), t + 0.09, 0.14, { type: "triangle", peak: 0.06 });
  },
  swipe(t: number) {
    noiseHit(t, 0.09, 0.04, 4000, 1000, 1.4); // trượt thước
    thock(t + 0.09, 2800, 0.06); // snap cuối
  },
  correct(t: number, combo: number) {
    const up = comboSemi(combo);
    thock(t, 3000, 0.085); // snap!
    tone(semi(hz(E5), up), t + 0.025, 0.14, { type: "triangle", peak: 0.1, attack: 0.002 });
    tone(semi(hz(987.77), up), t + 0.095, 0.17, { type: "triangle", peak: 0.09 });
    tone(semi(hz(E6), up), t + 0.165, 0.2, { type: "sine", peak: 0.065, send: 0.08 });
    if (combo >= 5) {
      thock(t + 0.24, 3600, 0.05);
      tone(semi(hz(1975.5), up), t + 0.26, 0.16, { type: "sine", peak: 0.05, send: 0.1 });
    }
  },
  wrong(t: number) {
    // donk cao su + buzz lỗi cụt
    tone(hz(196), t, 0.14, { type: "triangle", peak: 0.12, glide: 138 });
    tone(hz(98), t + 0.08, 0.16, { type: "square", peak: 0.055, filterStart: 460, filterEnd: 190, q: 4 });
    thock(t, 900, 0.05);
  },
  complete(t: number) {
    [0, 0.08, 0.16].forEach((d, i) => thock(t + d, 2600 + i * 500, 0.065));
    [C5, E5, G5, C6, E6].forEach((f, i) =>
      duo(hz(f), t + 0.24 + i * 0.078, 0.26, { type: "triangle", peak: 0.09 }, 6),
    );
    tone(hz(C7), t + 0.66, 0.26, { type: "sine", peak: 0.05, send: 0.1 });
  },
  levelup(t: number) {
    [0, 0.07].forEach((d) => thock(t + d, 3000, 0.06));
    [392, C5, E5, G5, C6, E6].forEach((f, i) =>
      duo(hz(f), t + 0.14 + i * 0.082, 0.3, { type: "triangle", peak: 0.085 }, 6),
    );
    [G6, C7].forEach((f, i) => tone(hz(f), t + 0.72 + i * 0.06, 0.24, { type: "sine", peak: 0.05, send: 0.1 }));
  },
  goal(t: number) {
    thock(t, 3000, 0.065);
    [E5, A5, C6].forEach((f, i) => tone(hz(f), t + 0.04 + i * 0.08, 0.2, { type: "triangle", peak: 0.075 }));
  },
  tick(t: number) {
    thock(t, 1500, 0.045); // metronome
  },
  timeup(t: number) {
    tone(hz(440), t, 0.2, { type: "triangle", peak: 0.09, glide: 220 });
    thock(t + 0.18, 1300, 0.07);
  },
  switch_(t: number) {
    // màn trập máy ảnh: click - whoosh - click
    thock(t, 3400, 0.07);
    noiseHit(t + 0.04, 0.15, 0.035, 2600, 700, 1);
    thock(t + 0.18, 2700, 0.065);
    [G5, 1174.7].forEach((f, i) => tone(hz(f), t + 0.24 + i * 0.07, 0.18, { type: "triangle", peak: 0.06 }));
  },
};

const voices = { game, apple, cozy, dreamy, studio };
const v = () => voices[theme()];

// ---------- API công khai ----------
export function playTap() {
  audio((t) => v().tap(t));
}
export function playFlip() {
  audio((t) => v().flip(t));
}
export function playSwipe() {
  audio((t) => v().swipe(t));
}
/** combo: số câu đúng LIÊN TIẾP hiện tại (>=1) — cao độ leo pentatonic */
export function playCorrect(combo = 1) {
  audio((t) => v().correct(t, combo));
}
export function playWrong() {
  audio((t) => v().wrong(t));
}
export function playComplete() {
  audio((t) => v().complete(t));
}
/** mở sheet / toggle nhỏ */
export function playPop() {
  audio((t) => v().pop(t));
}
/** đổi theme — phát bằng VOICE MỚI (gọi sau khi set data-theme) */
export function playSwitch() {
  audio((t) => v().switch_(t));
}
export function playLevelUp() {
  audio((t) => v().levelup(t));
}
export function playGoal() {
  audio((t) => v().goal(t));
}
/** tick đếm ngược 5s cuối blitz */
export function playTick() {
  audio((t) => v().tick(t));
}
export function playTimeUp() {
  audio((t) => v().timeup(t));
}

// FIX mobile "lúc có lúc không": mở khoá + giữ AudioContext luôn chạy;
// đồng thời đổi theme là đổi luôn KHÔNG GIAN VANG (IR).
if (typeof window !== "undefined") {
  const keepAlive = () => {
    ac();
  };
  window.addEventListener("pointerdown", keepAlive, { capture: true, passive: true });
  window.addEventListener("touchstart", keepAlive, { capture: true, passive: true });
  window.addEventListener("keydown", keepAlive, { capture: true });
  window.addEventListener("lw:theme", () => {
    if (ctx) ensureVerb();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") keepAlive();
  });
}
