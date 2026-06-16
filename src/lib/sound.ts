/**
 * Engine am thanh tong hop bang Web Audio (khong can file nhac, khong lo ban quyen).
 * Tat ca phat ra trong su kien cham/keo cua nguoi dung nen duoc phep tu dong.
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
    master = ctx.createGain();
    master.gain.value = muted() ? 0 : 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function osc(freq: number, t: number, dur: number, peak: number, type: OscillatorType, glideTo?: number) {
  const c = ac();
  if (!c || !master) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + Math.min(0.02, dur * 0.3));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + dur + 0.03);
}

function noise(t: number, dur: number, peak: number, freq: number, q: number, sweepTo?: number) {
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
  bp.frequency.setValueAtTime(freq, t);
  bp.Q.value = q;
  if (sweepTo) bp.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp);
  bp.connect(g);
  g.connect(master);
  src.start(t);
  src.stop(t + dur + 0.02);
}

export function playTap() {
  if (muted()) return;
  const c = ac();
  if (c) osc(660, c.currentTime, 0.05, 0.06, "sine");
}

export function playFlip() {
  if (muted()) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  noise(t, 0.12, 0.05, 1200, 1.2, 500);
  osc(900, t, 0.08, 0.05, "triangle", 520);
}

export function playSwipe() {
  if (muted()) return;
  const c = ac();
  if (c) noise(c.currentTime, 0.22, 0.09, 720, 0.8, 260);
}

/** Tieng "vang" thoa man khi chon dung: arpeggio C-E-G-C + lap lanh */
export function playCorrect() {
  if (muted()) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => {
    osc(f, t + i * 0.07, 0.5, 0.15, "sine");
    osc(f * 2, t + i * 0.07, 0.3, 0.045, "triangle");
  });
  osc(1567.98, t + 0.3, 0.5, 0.06, "sine");
}

export function playWrong() {
  if (muted()) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  osc(196, t, 0.18, 0.15, "sawtooth", 150);
  osc(146.83, t + 0.1, 0.22, 0.13, "sawtooth", 110);
}

/** Hoan thanh man: hop am vang + chuoi lap lanh di len */
export function playComplete() {
  if (muted()) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((f) => osc(f, t, 0.7, 0.12, "sine"));
  [1046.5, 1318.5, 1568, 2093].forEach((f, i) => osc(f, t + 0.18 + i * 0.06, 0.4, 0.06, "triangle"));
}
