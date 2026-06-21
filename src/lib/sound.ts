/**
 * Engine âm thanh SCI-FI / FUTURISTIC tổng hợp 100% bằng Web Audio (không file, không bản quyền).
 * Đặc trưng: sóng cưa/vuông, quét tần số (laser), filter cộng hưởng, lớp detune.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let _muted: boolean | null = null;

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
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

interface ToneOpts {
  type?: OscillatorType;
  peak?: number;
  glide?: number; // tan so cuoi (quet)
  detune?: number;
  filterStart?: number;
  filterEnd?: number;
  q?: number;
  attack?: number;
}
function tone(freq: number, t: number, dur: number, o: ToneOpts = {}) {
  const c = ac();
  if (!c || !master) return;
  const osc = c.createOscillator();
  osc.type = o.type ?? "sawtooth";
  osc.frequency.setValueAtTime(freq, t);
  if (o.glide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.glide), t + dur);
  if (o.detune) osc.detune.setValueAtTime(o.detune, t);

  const g = c.createGain();
  const peak = o.peak ?? 0.12;
  const atk = o.attack ?? Math.min(0.012, dur * 0.25);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + atk);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

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
  osc.stop(t + dur + 0.04);
}

function noiseHit(t: number, dur: number, peak: number, fStart: number, fEnd: number, q = 1) {
  const c = ac();
  if (!c || !master) return;
  const n = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, n, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(fStart, t);
  bp.frequency.exponentialRampToValueAtTime(Math.max(80, fEnd), t + dur);
  bp.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp);
  bp.connect(g);
  g.connect(master);
  src.start(t);
  src.stop(t + dur + 0.02);
}

/** Tick UI CYBERPUNK: zap sáng đi lên + lấp lánh cao (không còn trầm) */
export function playTap() {
  if (muted()) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  tone(740, t, 0.055, { type: "square", peak: 0.055, glide: 1950, filterStart: 1800, filterEnd: 7000, q: 4, attack: 0.003 });
  tone(2637, t + 0.004, 0.05, { type: "sine", peak: 0.045, glide: 3520 });
}

/** Lật thẻ: "power-up" thoả mãn (giống correct nhưng nhẹ hơn) */
export function playFlip() {
  if (muted()) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  tone(160, t, 0.1, { type: "sine", peak: 0.1, glide: 250 });
  tone(420, t, 0.16, { type: "sawtooth", peak: 0.12, glide: 1300, filterStart: 800, filterEnd: 3600, q: 6 });
  tone(1046.5, t + 0.1, 0.24, { type: "triangle", peak: 0.08 });
  tone(1568, t + 0.17, 0.2, { type: "sine", peak: 0.055 });
}

/** Laser swipe CYBERPUNK (sáng, zap cao, cộng hưởng) */
export function playSwipe() {
  if (muted()) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  tone(2200, t, 0.2, { type: "sawtooth", peak: 0.11, glide: 380, filterStart: 6500, filterEnd: 800, q: 12 });
  tone(1100, t, 0.13, { type: "square", peak: 0.05, glide: 2600 });
  noiseHit(t, 0.12, 0.045, 3500, 900, 1.6);
}

/** "Power-up confirm" futuristic: sub đập + quét lên + hợp âm vuông + lấp lánh */
export function playCorrect() {
  if (muted()) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  tone(120, t, 0.12, { type: "sine", peak: 0.13, glide: 190 });
  tone(300, t, 0.18, { type: "sawtooth", peak: 0.15, glide: 1500, filterStart: 700, filterEnd: 4000, q: 7 });
  tone(1046.5, t + 0.13, 0.28, { type: "square", peak: 0.08, detune: 8 });
  tone(1318.5, t + 0.13, 0.28, { type: "square", peak: 0.07, detune: -8 });
  tone(2637, t + 0.22, 0.22, { type: "sine", peak: 0.06 });
}

/** Lỗi số hoá: quét xuống + glitch vuông */
export function playWrong() {
  if (muted()) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  tone(340, t, 0.24, { type: "sawtooth", peak: 0.16, glide: 90, filterStart: 1400, filterEnd: 180, q: 9 });
  tone(150, t + 0.05, 0.16, { type: "square", peak: 0.12, glide: 70 });
  noiseHit(t + 0.02, 0.12, 0.05, 600, 140, 2);
}

/** Hoàn thành: arpeggio sóng cưa đi lên + shimmer (level-up) */
export function playComplete() {
  if (muted()) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  tone(110, t, 0.16, { type: "sine", peak: 0.13, glide: 165 });
  [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
    tone(f, t + i * 0.075, 0.34, {
      type: "sawtooth",
      peak: 0.1,
      detune: i % 2 ? 7 : -7,
      filterStart: 900 + i * 500,
      filterEnd: 2600,
      q: 5,
    });
  });
  [2093, 2637, 3136].forEach((f, i) => tone(f, t + 0.34 + i * 0.05, 0.3, { type: "sine", peak: 0.05 }));
}

// FIX mobile "lúc có lúc không": mở khoá + giữ AudioContext luôn chạy.
// Lắng nghe ở pha CAPTURE để resume TRƯỚC mọi handler phát tiếng.
if (typeof window !== "undefined") {
  const keepAlive = () => {
    ac(); // tạo nếu chưa có + resume nếu đang suspended
  };
  window.addEventListener("pointerdown", keepAlive, { capture: true, passive: true });
  window.addEventListener("touchstart", keepAlive, { capture: true, passive: true });
  window.addEventListener("keydown", keepAlive, { capture: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") keepAlive();
  });
}
