/**
 * Engine âm thanh 3 THEME — tổng hợp 100% Web Audio (không file, không bản quyền).
 *  · game  — sci-fi arcade: sóng cưa/vuông, quét laser, filter cộng hưởng
 *  · apple — thuỷ tinh tinh giản: sine ngắn, êm, lịch sự
 *  · cozy  — kalimba/marimba gỗ ấm: pluck pentatonic, tròn trịa
 *
 * CHỐNG NHÀM (khác Duolingo): mọi tiếng random ±detune & ±volume nhẹ,
 * tap xoay vòng note pool, tiếng "đúng" LEO THANG pentatonic theo combo.
 */

type ThemeId = "game" | "apple" | "cozy";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let _muted: boolean | null = null;

function theme(): ThemeId {
  if (typeof document === "undefined") return "game";
  const t = document.documentElement.getAttribute("data-theme");
  return t === "apple" || t === "cozy" ? t : "game";
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
  if (master && ctx) master.gain.setValueAtTime(m ? 0 : 0.5, ctx.currentTime);
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    master = ctx.createGain();
    master.gain.value = muted() ? 0 : 0.5;
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
const hz = (f: number) => cents(f, rand(-9, 9));
const semi = (f: number, s: number) => f * Math.pow(2, s / 12);

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
  const peak = (o.peak ?? 0.12) * rand(0.9, 1.08);
  const atk = o.attack ?? Math.min(0.012, dur * 0.25);
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
  g.connect(master);
  osc.start(t);
  osc.stop(t + (o.release ?? dur) + 0.06);
}

function noiseHit(t: number, dur: number, peak: number, fStart: number, fEnd: number, q = 1, type: BiquadFilterType = "bandpass") {
  const c = ac();
  if (!c || !master) return;
  const n = Math.floor(c.sampleRate * dur);
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
  g.gain.exponentialRampToValueAtTime(peak * rand(0.9, 1.1), t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp);
  bp.connect(g);
  g.connect(master);
  src.start(t);
  src.stop(t + dur + 0.02);
}

/** Pluck kalimba: triangle + partial hơi lệch điệu + "thịch" gỗ — voice cozy */
function pluck(freq: number, t: number, peak = 0.14, dur = 0.5) {
  tone(freq, t, dur, { type: "triangle", peak, attack: 0.002, release: dur, filterStart: freq * 5, filterEnd: freq * 2, q: 1 });
  tone(freq * 3.93, t, 0.14, { type: "sine", peak: peak * 0.22, attack: 0.001 });
  noiseHit(t, 0.02, peak * 0.3, freq * 2.2, freq * 1.4, 2);
}

/** Chuông thuỷ tinh: sine + hoạ âm 3 nhẹ — voice apple */
function glass(freq: number, t: number, peak = 0.07, dur = 0.5) {
  tone(freq, t, dur, { type: "sine", peak, attack: 0.004, release: dur });
  tone(freq * 3.01, t, dur * 0.4, { type: "sine", peak: peak * 0.14, attack: 0.004 });
}

// pentatonic C: bậc thang combo (đúng liên tiếp = nốt leo cao dần)
const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
const comboSemi = (combo: number) => PENTA[Math.min(Math.max(combo - 1, 0), PENTA.length - 1)];

// tap xoay vòng note pool — mỗi lần bấm một nốt khác
let tapStep = 0;

// ============================================================
// VOICE 1 — GAME (sci-fi arcade)
// ============================================================
const game = {
  tap(t: number) {
    const roots = [740, 830, 988];
    const f = roots[tapStep++ % roots.length];
    tone(hz(f), t, 0.055, { type: "square", peak: 0.055, glide: f * 2.6, filterStart: 1800, filterEnd: 7000, q: 4, attack: 0.003 });
    tone(hz(2637), t + 0.004, 0.05, { type: "sine", peak: 0.04, glide: 3520 });
  },
  flip(t: number) {
    tone(hz(160), t, 0.1, { type: "sine", peak: 0.1, glide: 250 });
    tone(hz(420), t, 0.16, { type: "sawtooth", peak: 0.12, glide: 1300, filterStart: 800, filterEnd: 3600, q: 6 });
    tone(hz(1046.5), t + 0.1, 0.24, { type: "triangle", peak: 0.08 });
    tone(hz(1568), t + 0.17, 0.2, { type: "sine", peak: 0.055 });
  },
  swipe(t: number) {
    tone(hz(2200), t, 0.2, { type: "sawtooth", peak: 0.1, glide: 380, filterStart: 6500, filterEnd: 800, q: 12 });
    tone(hz(1100), t, 0.13, { type: "square", peak: 0.045, glide: 2600 });
    noiseHit(t, 0.12, 0.045, 3500, 900, 1.6);
  },
  correct(t: number, combo: number) {
    const up = comboSemi(combo);
    tone(hz(120), t, 0.12, { type: "sine", peak: 0.13, glide: 190 });
    tone(hz(300), t, 0.16, { type: "sawtooth", peak: 0.14, glide: 1500, filterStart: 700, filterEnd: 4000, q: 7 });
    tone(semi(hz(1046.5), up), t + 0.12, 0.26, { type: "square", peak: 0.075, detune: 8 });
    tone(semi(hz(1318.5), up), t + 0.12, 0.26, { type: "square", peak: 0.065, detune: -8 });
    tone(semi(hz(2637), up), t + 0.2, 0.2, { type: "sine", peak: 0.055 });
    if (combo >= 5) {
      // combo cháy: sparkle arp thêm
      [0, 4, 7].forEach((s, i) => tone(semi(hz(2093), up + s), t + 0.26 + i * 0.045, 0.14, { type: "sine", peak: 0.04 }));
    }
  },
  wrong(t: number) {
    tone(hz(340), t, 0.24, { type: "sawtooth", peak: 0.15, glide: 90, filterStart: 1400, filterEnd: 180, q: 9 });
    tone(hz(150), t + 0.05, 0.16, { type: "square", peak: 0.11, glide: 70 });
    noiseHit(t + 0.02, 0.12, 0.05, 600, 140, 2);
  },
  complete(t: number) {
    tone(hz(110), t, 0.16, { type: "sine", peak: 0.13, glide: 165 });
    [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
      tone(hz(f), t + i * 0.075, 0.34, { type: "sawtooth", peak: 0.1, detune: i % 2 ? 7 : -7, filterStart: 900 + i * 500, filterEnd: 2600, q: 5 });
    });
    [2093, 2637, 3136].forEach((f, i) => tone(hz(f), t + 0.34 + i * 0.05, 0.3, { type: "sine", peak: 0.05 }));
  },
  pop(t: number) {
    tone(hz(520), t, 0.09, { type: "square", peak: 0.05, glide: 980, filterStart: 1200, filterEnd: 4200, q: 3 });
  },
  switch_(t: number) {
    tone(hz(220), t, 0.4, { type: "sawtooth", peak: 0.1, glide: 1760, filterStart: 500, filterEnd: 6000, q: 8 });
    noiseHit(t + 0.05, 0.3, 0.05, 900, 5200, 1.4);
    [1046.5, 1568, 2093].forEach((f, i) => tone(hz(f), t + 0.3 + i * 0.06, 0.22, { type: "sine", peak: 0.05 }));
  },
  levelup(t: number) {
    tone(hz(80), t, 0.5, { type: "sawtooth", peak: 0.12, glide: 320, filterStart: 300, filterEnd: 2600, q: 10 });
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone(hz(f), t + 0.32 + i * 0.09, 0.5, { type: "square", peak: 0.08, detune: i % 2 ? 6 : -6, filterStart: 1200, filterEnd: 3400, q: 4 }),
    );
    [2093, 2637, 3136, 4186].forEach((f, i) => tone(hz(f), t + 0.7 + i * 0.055, 0.34, { type: "sine", peak: 0.05 }));
  },
  goal(t: number) {
    [659.25, 830.6, 987.77, 1318.5].forEach((f, i) => tone(hz(f), t + i * 0.08, 0.3, { type: "square", peak: 0.07, filterStart: 2000, filterEnd: 3800, q: 3 }));
    noiseHit(t + 0.3, 0.24, 0.04, 2400, 6400, 1.2);
  },
  tick(t: number) {
    tone(hz(1660), t, 0.045, { type: "square", peak: 0.045, attack: 0.002 });
  },
  timeup(t: number) {
    tone(hz(392), t, 0.3, { type: "square", peak: 0.1, glide: 196 });
    tone(hz(196), t + 0.14, 0.34, { type: "sawtooth", peak: 0.1, glide: 98, filterStart: 900, filterEnd: 220, q: 6 });
  },
};

// ============================================================
// VOICE 2 — APPLE (thuỷ tinh, tinh giản, mềm)
// ============================================================
const apple = {
  tap(t: number) {
    const roots = [1975, 2093, 2217];
    const f = roots[tapStep++ % roots.length];
    glass(hz(f), t, 0.035, 0.07);
    noiseHit(t, 0.008, 0.018, 5200, 6800, 1, "highpass");
  },
  flip(t: number) {
    glass(hz(1174.7), t, 0.05, 0.16);
    glass(hz(1760), t + 0.07, 0.045, 0.22);
  },
  swipe(t: number) {
    noiseHit(t, 0.16, 0.035, 3800, 500, 0.9, "lowpass");
    glass(hz(880), t + 0.02, 0.02, 0.1);
  },
  correct(t: number, combo: number) {
    const up = comboSemi(combo);
    tone(hz(196), t, 0.05, { type: "sine", peak: 0.08, attack: 0.003 }); // "thock" nỉ
    glass(semi(hz(659.25), up), t + 0.02, 0.075, 0.3);
    glass(semi(hz(987.77), up), t + 0.1, 0.065, 0.42);
    if (combo >= 5) glass(semi(hz(1318.5), up), t + 0.2, 0.05, 0.4);
  },
  wrong(t: number) {
    tone(hz(164.8), t, 0.16, { type: "sine", peak: 0.1, glide: 146 });
    noiseHit(t, 0.02, 0.02, 900, 500, 1);
  },
  complete(t: number) {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => glass(hz(f), t + i * 0.11, 0.06, 0.6));
    glass(hz(2093), t + 0.5, 0.035, 0.8);
  },
  pop(t: number) {
    glass(hz(1318.5), t, 0.03, 0.09);
  },
  switch_(t: number) {
    noiseHit(t, 0.22, 0.03, 600, 4200, 0.8, "lowpass");
    [783.99, 1174.7].forEach((f, i) => glass(hz(f), t + 0.12 + i * 0.09, 0.05, 0.4));
  },
  levelup(t: number) {
    [523.25, 783.99, 1046.5, 1568, 2093].forEach((f, i) => glass(hz(f), t + i * 0.09, 0.055, 0.7));
  },
  goal(t: number) {
    [659.25, 987.77, 1318.5].forEach((f, i) => glass(hz(f), t + i * 0.1, 0.05, 0.55));
  },
  tick(t: number) {
    glass(hz(1567.98), t, 0.028, 0.05);
  },
  timeup(t: number) {
    glass(hz(440), t, 0.06, 0.3);
    tone(hz(220), t + 0.12, 0.26, { type: "sine", peak: 0.07, glide: 180 });
  },
};

// ============================================================
// VOICE 3 — COZY (kalimba gỗ ấm, pentatonic)
// ============================================================
const C5 = 523.25;
const cozy = {
  tap(t: number) {
    const pool = [783.99, 880, 987.77, 1174.7]; // G5 A5 B5 D6
    const f = pool[tapStep++ % pool.length];
    pluck(hz(f), t, 0.09, 0.3);
  },
  flip(t: number) {
    pluck(hz(C5), t, 0.11, 0.35);
    pluck(hz(659.25), t + 0.08, 0.1, 0.4);
    noiseHit(t + 0.01, 0.05, 0.02, 1800, 900, 0.8); // sột soạt giấy
  },
  swipe(t: number) {
    tone(hz(420), t, 0.16, { type: "sine", peak: 0.07, glide: 940 }); // huýt nhẹ
    noiseHit(t, 0.12, 0.03, 1400, 500, 0.8);
  },
  correct(t: number, combo: number) {
    const up = comboSemi(combo);
    tone(semi(hz(130.8), Math.min(up, 12)), t, 0.22, { type: "sine", peak: 0.1, attack: 0.004 }); // marimba trầm
    pluck(semi(hz(C5), up), t + 0.01, 0.13, 0.4);
    pluck(semi(hz(659.25), up), t + 0.09, 0.12, 0.42);
    pluck(semi(hz(783.99), up), t + 0.18, 0.12, 0.5);
    if (combo >= 5) pluck(semi(hz(1046.5), up), t + 0.28, 0.1, 0.55);
  },
  wrong(t: number) {
    // "aww" dễ thương: 2 nốt tụt + wobble — không gắt
    tone(hz(329.6), t, 0.18, { type: "triangle", peak: 0.1, vibHz: 7, vibCents: 40 });
    tone(hz(311.1), t + 0.16, 0.3, { type: "triangle", peak: 0.1, vibHz: 6, vibCents: 55 });
    tone(hz(98), t + 0.02, 0.12, { type: "sine", peak: 0.07 });
  },
  complete(t: number) {
    [C5, 587.3, 659.25, 783.99, 880, 1046.5].forEach((f, i) => pluck(hz(f), t + i * 0.08, 0.12, 0.5));
    // vỗ tay lụp bụp ×3
    [0.55, 0.64, 0.76].forEach((d) => noiseHit(t + d, 0.045, 0.05, 1100, 700, 1.2));
  },
  pop(t: number) {
    pluck(hz(1046.5), t, 0.07, 0.2);
  },
  switch_(t: number) {
    [C5, 659.25, 783.99, 1046.5].forEach((f, i) => pluck(hz(f), t + i * 0.06, 0.1, 0.4));
    noiseHit(t, 0.2, 0.02, 800, 2600, 0.7);
  },
  levelup(t: number) {
    [C5, 587.3, 659.25, 783.99, 880, 1046.5, 1174.7, 1318.5].forEach((f, i) => pluck(hz(f), t + i * 0.055, 0.11, 0.45));
    tone(hz(261.6), t + 0.48, 0.5, { type: "triangle", peak: 0.09 });
    tone(hz(329.6), t + 0.48, 0.5, { type: "triangle", peak: 0.08 });
    tone(hz(392), t + 0.48, 0.5, { type: "triangle", peak: 0.08 });
  },
  goal(t: number) {
    [659.25, 783.99, 1046.5].forEach((f, i) => pluck(hz(f), t + i * 0.09, 0.12, 0.5));
    [0.35, 0.44].forEach((d) => noiseHit(t + d, 0.04, 0.04, 1100, 700, 1.2));
  },
  tick(t: number) {
    pluck(hz(1318.5), t, 0.05, 0.12);
  },
  timeup(t: number) {
    tone(hz(392), t, 0.2, { type: "triangle", peak: 0.09, vibHz: 6, vibCents: 40 });
    tone(hz(349.2), t + 0.18, 0.3, { type: "triangle", peak: 0.09, vibHz: 6, vibCents: 50 });
  },
};

const voices = { game, apple, cozy };
const v = () => voices[theme()];

// ---------- API công khai (giữ tên cũ + thêm mới) ----------
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

// FIX mobile "lúc có lúc không": mở khoá + giữ AudioContext luôn chạy.
// Lắng nghe ở pha CAPTURE để resume TRƯỚC mọi handler phát tiếng.
if (typeof window !== "undefined") {
  const keepAlive = () => {
    ac();
  };
  window.addEventListener("pointerdown", keepAlive, { capture: true, passive: true });
  window.addEventListener("touchstart", keepAlive, { capture: true, passive: true });
  window.addEventListener("keydown", keepAlive, { capture: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") keepAlive();
  });
}
