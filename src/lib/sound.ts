/**
 * Engine âm thanh 3 THEME — tổng hợp 100% Web Audio (không file, không bản quyền).
 *
 * CÔNG THỨC "ĐÃ TAI" (mọi tiếng đều 3 lớp):
 *  1. TRANSIENT — cú chạm cực ngắn (click/thump) cho cảm giác vật lý
 *  2. BODY     — thân nốt
 *  3. AIR      — đuôi vang: reverb convolver sinh IR riêng theo theme
 *  + humanize (±cents, ±volume, pan nhẹ) → không bao giờ nghe "máy"
 *
 * GIỌNG THEO THEME:
 *  · cozy — CREAMY KEYBOARD: thock TRẦM đầm tay (noise tối + body gỗ + sub),
 *           marimba âm khu thấp ấm áp, music-box, vỗ tay mềm — heartful
 *  · game — DIGITAL: blip vuông ngắn chính xác như thiết bị đo, sub-tick,
 *           data burst — sạch, khô, dứt khoát
 *  · lux  — BOUTIQUE: gõ nỉ + chuông đồng hồ (Westminster khi xong bài),
 *           tick kim máy cho blitz — quiet luxury
 */

type ThemeId = "cozy" | "game" | "lux";
const THEME_SET = new Set<ThemeId>(["cozy", "game", "lux"]);
const LEGACY: Record<string, ThemeId> = { apple: "lux", dreamy: "cozy", studio: "game" };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let verbIn: ConvolverNode | null = null;
let verbOut: GainNode | null = null;
let verbTheme: ThemeId | null = null;
let _muted: boolean | null = null;

function theme(): ThemeId {
  if (typeof document === "undefined") return "game";
  const t = document.documentElement.getAttribute("data-theme");
  if (t && t in LEGACY) return LEGACY[t];
  return t && THEME_SET.has(t as ThemeId) ? (t as ThemeId) : "game";
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

/** Không gian vang: cozy = phòng gỗ nhỏ ấm · game = gần như khô · lux = sảnh đá */
const VERB: Record<ThemeId, { dur: number; decay: number; damp: number; wet: number }> = {
  cozy: { dur: 0.8, decay: 3.0, damp: 0.1, wet: 0.18 },
  game: { dur: 0.32, decay: 3.8, damp: 0.3, wet: 0.09 },
  lux: { dur: 2.1, decay: 2.4, damp: 0.16, wet: 0.32 },
};

/** IR tổng hợp: noise × decay mũ + one-pole lowpass (damp) → vang tự nhiên */
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
  release?: number;
  vibHz?: number;
  vibCents?: number;
  send?: number;
  pan?: number;
}
function tone(freq: number, t: number, dur: number, o: ToneOpts = {}) {
  const c = ac();
  if (!c || !master) return;
  const osc = c.createOscillator();
  osc.type = o.type ?? "sine";
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

// pentatonic: bậc thang combo (đúng liên tiếp = nốt leo cao dần)
const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
const comboSemi = (combo: number) => PENTA[Math.min(Math.max(combo - 1, 0), PENTA.length - 1)];

let tapStep = 0;

// note thường dùng
const A3 = 220, C4 = 261.63, E4 = 329.63, G4 = 392, A4 = 440,
  C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880, B5 = 987.77, C6 = 1046.5,
  E6 = 1318.51;

// ============================================================
// VOICE 1 — COZY (creamy keyboard: thock trầm, warm, heartful)
// ============================================================
/** Thock KEM CREAMY: "poof" tròn mềm — noise TỐI decay hơi dài + body triangle
 *  attack MỀM + sine tròn. BỎ partial sáng gây tiếng "cọc"; nghe muffled ấm
 *  như gõ trên deskmat foam, keycap PBT lube — không đanh, không kim loại. */
function creamThock(t: number, toneHz = 232, peak = 0.13) {
  noiseHit(t, 0.026, peak * 0.38, 1100, 460, 0.7, "lowpass");                             // poof tối mềm, hơi dài
  tone(hz(toneHz), t, 0.064, { type: "triangle", peak: peak * 0.95, attack: 0.006, filterStart: 1350, filterEnd: 620, q: 0.8 });
  tone(hz(toneHz * 0.75), t, 0.05, { type: "sine", peak: peak * 0.55, attack: 0.005 });   // thân tròn ấm (rounded, không click)
}
/** Marimba/music-box ấm — sáng vừa đủ creamy, không chìm xuống bass */
function warmNote(freq: number, t: number, peak = 0.13, dur = 0.4, send = 0.24) {
  const pan = rand(-0.15, 0.15);
  tone(freq, t, dur, { type: "triangle", peak, attack: 0.002, filterStart: freq * 3.6, filterEnd: freq * 1.7, q: 1, send, pan });
  tone(freq * 2, t, 0.06, { type: "sine", peak: peak * 0.14, attack: 0.001, pan });        // hoạ âm 2 → chất music-box
  noiseHit(t, 0.011, peak * 0.16, 1300, 650, 1, "lowpass");
}
const cozy = {
  tap(t: number) {
    const tones = [222, 240, 262, 210];
    creamThock(t, tones[tapStep++ % tones.length], 0.14);
  },
  pop(t: number) {
    creamThock(t, 258, 0.1);
  },
  flip(t: number) {
    creamThock(t, 232, 0.12);
    warmNote(hz(C5), t + 0.04, 0.1, 0.3);
    noiseHit(t + 0.01, 0.05, 0.018, 900, 520, 0.8, "lowpass"); // sột soạt giấy
  },
  swipe(t: number) {
    noiseHit(t, 0.11, 0.035, 950, 420, 0.8, "lowpass");
    creamThock(t + 0.1, 205, 0.1);
  },
  correct(t: number, combo: number) {
    const up = Math.min(comboSemi(combo), 12); // giữ âm khu sáng-ấm, không chói
    creamThock(t, 238, 0.12);
    warmNote(semi(hz(C5), up), t + 0.015, 0.14, 0.42);
    warmNote(semi(hz(E5), up), t + 0.085, 0.13, 0.44);
    warmNote(semi(hz(G5), up), t + 0.155, 0.13, 0.52, 0.3);
    if (combo >= 5) warmNote(semi(hz(C6), up), t + 0.24, 0.1, 0.55, 0.32);
  },
  wrong(t: number) {
    // "uh-uh" hai gõ trầm hơn tap chút — dịu, không rên rỉ
    creamThock(t, 150, 0.13);
    creamThock(t + 0.14, 128, 0.14);
    tone(hz(220), t + 0.02, 0.2, { type: "sine", peak: 0.05, glide: 186, send: 0.15 });
  },
  complete(t: number) {
    // music-box sáng ấm + vỗ tay lụp bụp
    [C5, E5, G5, A5, G5, C6].forEach((f, i) => warmNote(hz(f), t + i * 0.085, 0.13, 0.5, 0.28));
    [C4, E4, G4].forEach((f) => tone(hz(f), t + 0.55, 0.8, { type: "triangle", peak: 0.05, attack: 0.03, send: 0.3 }));
    [0.62, 0.72, 0.84].forEach((d) => noiseHit(t + d, 0.05, 0.05, 1000, 650, 1, "bandpass", 0.2));
  },
  levelup(t: number) {
    [C5, D5, E5, G5, A5, C6, D5 * 2, E6].forEach((f, i) => warmNote(hz(f), t + i * 0.06, 0.12, 0.45, 0.3));
    [C4, E4, G4].forEach((f) => tone(hz(f), t + 0.52, 0.7, { type: "triangle", peak: 0.06, attack: 0.02, send: 0.3 }));
    [0.78, 0.88, 1.0, 1.1].forEach((d) => noiseHit(t + d, 0.05, 0.045, 1000, 650, 1, "bandpass", 0.2));
  },
  goal(t: number) {
    [E5, G5, C6].forEach((f, i) => warmNote(hz(f), t + i * 0.08, 0.13, 0.5, 0.3));
    [0.34, 0.44].forEach((d) => noiseHit(t + d, 0.045, 0.04, 1000, 650, 1, "bandpass", 0.2));
  },
  tick(t: number) {
    creamThock(t, 288, 0.07);
  },
  timeup(t: number) {
    warmNote(hz(G5), t, 0.11, 0.3);
    warmNote(hz(E5), t + 0.16, 0.12, 0.45);
  },
  switch_(t: number) {
    [C5, E5, G5, C6].forEach((f, i) => warmNote(hz(f), t + i * 0.055, 0.11, 0.4, 0.3));
    creamThock(t, 232, 0.12);
  },
};

// ============================================================
// VOICE 2 — GAME (CYBERPUNK: supersaw gằn, sub neon, laser zap, glitch)
// ============================================================
/** Supersaw stab — 3 saw lệch điệu qua lowpass cộng hưởng: synth chất Blade Runner */
function sawStab(freq: number, t: number, dur: number, peak = 0.08, fEnd = 1500, q = 8, send = 0.1) {
  [-16, 0, 16].forEach((d, i) =>
    tone(freq, t, dur, {
      type: "sawtooth",
      peak: peak * (i === 1 ? 0.72 : 0.5),
      detune: d,
      attack: 0.002,
      filterStart: 5600,
      filterEnd: fEnd,
      q,
      send,
      pan: (i - 1) * 0.28,
    }),
  );
}
/** Sub bass gằn — square + sine trầm cho sức nặng "neon night" */
function gritSub(freq: number, t: number, dur = 0.16, peak = 0.14) {
  tone(freq, t, dur, { type: "square", peak, attack: 0.002, glide: freq * 0.72, filterStart: 640, filterEnd: 150, q: 4 });
  tone(freq, t, dur * 0.9, { type: "sine", peak: peak * 0.85, attack: 0.002 });
}
/** Laser zap — saw glide xuống nhanh qua bandpass Q cao */
function zap(t: number, from: number, to: number, peak = 0.08) {
  tone(from, t, 0.15, { type: "sawtooth", peak, glide: to, filterStart: from * 1.4, filterEnd: Math.max(to, 200), q: 10, send: 0.12 });
}
/** Glitch — vài hạt noise cực ngắn stutter, chất data-corrupt */
function glitch(t: number, n = 3, peak = 0.03) {
  for (let i = 0; i < n; i++) noiseHit(t + i * 0.028, 0.013, peak, 1600 + i * 800, 700, 2.4, "bandpass");
}
const game = {
  tap(t: number) {
    // 8 nốt + đổi timbre/brightness/sub theo bước → mỗi lần bấm mỗi khác, hết lặp
    const notes = [330, 392, 440, 294, 349, 466, 392, 262];
    const s = tapStep++;
    const f = notes[s % notes.length];
    sawStab(hz(f), t, 0.07, 0.07, 1900 + (s % 4) * 650, 5 + (s % 3));
    gritSub(60 + (s % 3) * 8, t, 0.055, 0.06);
    noiseHit(t, 0.006, 0.026, 2500 + (s % 3) * 600, 1700, 2.2);
    if (s % 4 === 2) tone(hz(f * 3), t + 0.02, 0.05, { type: "sine", peak: 0.028, send: 0.18 }); // chirp accent thi thoảng
  },
  pop(t: number) {
    const notes = [392, 466, 349, 440];
    sawStab(hz(notes[tapStep % notes.length]), t, 0.055, 0.06, 2200, 5);
  },
  flip(t: number) {
    zap(t, 820, 300, 0.055);
    sawStab(hz(330), t + 0.03, 0.09, 0.055, 1900, 6);
  },
  swipe(t: number) {
    zap(t, 1500, 240, 0.06);
    noiseHit(t, 0.1, 0.028, 3000, 700, 1.2, "bandpass", 0.06);
  },
  correct(t: number, combo: number) {
    const up = comboSemi(combo);
    gritSub(semi(62, up % 12), t, 0.22, 0.16); // neon kick trầm
    noiseHit(t, 0.006, 0.04, 3400, 1900, 2.2);
    // power chord DÀY: root + quãng 5 + quãng 8
    sawStab(semi(hz(A3), up), t + 0.01, 0.18, 0.09, 3000, 8);
    sawStab(semi(hz(E4), up), t + 0.01, 0.18, 0.06, 3000, 8);
    sawStab(semi(hz(A4), up), t + 0.02, 0.16, 0.045, 3400, 6);
    // arp leo GIẢI QUYẾT (resolve) — cảm giác "thắng"
    [0, 7, 12].forEach((s, i) =>
      tone(semi(hz(E5), up + s), t + 0.13 + i * 0.05, 0.14, {
        type: "sawtooth",
        peak: 0.05,
        detune: 10,
        filterStart: 4200,
        filterEnd: 2400,
        q: 4,
        send: 0.22,
      }),
    );
    // đuôi sparkle sáng bay lên
    tone(semi(hz(A5), up), t + 0.3, 0.2, { type: "sine", peak: 0.045, send: 0.3, pan: -0.15 });
    if (combo >= 3) tone(semi(hz(1318.51), up), t + 0.34, 0.16, { type: "sine", peak: 0.035, send: 0.34, pan: 0.2 });
    if (combo >= 5)
      [0, 4, 7, 12].forEach((s, i) =>
        tone(semi(hz(A5), up + s), t + 0.38 + i * 0.045, 0.12, { type: "sine", peak: 0.03, send: 0.32, pan: (i - 1.5) * 0.25 }),
      );
  },
  wrong(t: number) {
    // system error: saw gằn tụt xuống + glitch stutter
    tone(hz(200), t, 0.2, { type: "sawtooth", peak: 0.11, glide: 84, filterStart: 1500, filterEnd: 260, q: 9 });
    tone(hz(100), t, 0.22, { type: "square", peak: 0.09, detune: 22 });
    glitch(t + 0.02, 3, 0.035);
  },
  complete(t: number) {
    gritSub(55, t, 0.34, 0.14);
    [220, 262, 330, 392].forEach((f, i) => sawStab(hz(f), t + 0.05 + i * 0.09, 0.24, 0.075, 2400 + i * 500, 7));
    zap(t + 0.5, 1800, 700, 0.05);
    noiseHit(t + 0.46, 0.14, 0.02, 3400, 6400, 1, "highpass", 0.2);
  },
  levelup(t: number) {
    // riser sweep dài + supersaw fanfare
    tone(hz(180), t, 0.5, { type: "sawtooth", peak: 0.09, glide: 1400, filterStart: 300, filterEnd: 4200, q: 10, send: 0.12 });
    glitch(t + 0.2, 4, 0.025);
    gritSub(58, t + 0.5, 0.3, 0.14);
    [262, 330, 392, 523].forEach((f, i) => sawStab(hz(f), t + 0.52 + i * 0.08, 0.26, 0.08, 3000, 6));
    zap(t + 0.9, 2200, 900, 0.045);
  },
  goal(t: number) {
    gritSub(72, t, 0.14, 0.11);
    [330, 415, 523].forEach((f, i) => sawStab(hz(f), t + i * 0.07, 0.18, 0.07, 2600, 6));
  },
  tick(t: number) {
    noiseHit(t, 0.009, 0.045, 2600, 1600, 2.6);
  },
  timeup(t: number) {
    zap(t, 700, 150, 0.09);
    gritSub(60, t + 0.12, 0.26, 0.12);
  },
  switch_(t: number) {
    // data burst: zap + glitch + stab
    zap(t, 1400, 360, 0.06);
    glitch(t + 0.04, 3, 0.03);
    sawStab(hz(330), t + 0.14, 0.16, 0.07, 2600, 6);
  },
};

// ============================================================
// VOICE 3 — LUX (boutique: gõ nỉ + chuông đồng hồ, quiet luxury)
// ============================================================
/** Gõ nỉ: thud rất mềm + ping vàng nhỏ xíu phía trên */
function felt(t: number, peak = 0.12) {
  noiseHit(t, 0.018, peak * 0.5, 620, 300, 0.8, "lowpass");
  tone(hz(170), t, 0.05, { type: "sine", peak, attack: 0.002, glide: 135 });
  tone(hz(2620), t + 0.004, 0.05, { type: "sine", peak: peak * 0.16, attack: 0.001, send: 0.3 });
}
/** Chuông đồng hồ: sine + hoạ âm 2.0 & 2.98 (chuông ống) — ngân quý phái */
function chime(freq: number, t: number, peak = 0.09, dur = 0.8, send = 0.4) {
  const pan = rand(-0.22, 0.22);
  tone(freq, t, dur, { type: "sine", peak, attack: 0.004, send, pan });
  tone(freq * 2.0, t, dur * 0.55, { type: "sine", peak: peak * 0.28, attack: 0.003, send: send * 0.85, pan });
  tone(freq * 2.98, t, dur * 0.3, { type: "sine", peak: peak * 0.12, attack: 0.002, send: send * 0.7, pan });
  noiseHit(t, 0.01, peak * 0.2, 4200, 2800, 2);
}
const lux = {
  tap(t: number) {
    felt(t, 0.12);
  },
  pop(t: number) {
    felt(t, 0.09);
  },
  flip(t: number) {
    felt(t, 0.11);
    chime(hz(A5), t + 0.05, 0.05, 0.5);
  },
  swipe(t: number) {
    noiseHit(t, 0.12, 0.03, 1200, 400, 0.8, "lowpass", 0.15); // lụa trượt
    felt(t + 0.11, 0.08);
  },
  correct(t: number, combo: number) {
    const up = comboSemi(combo);
    felt(t, 0.11);
    chime(semi(hz(E5), up), t + 0.02, 0.1, 0.6);
    chime(semi(hz(B5), up), t + 0.11, 0.09, 0.75, 0.45);
    if (combo >= 5) chime(semi(hz(E6), up), t + 0.22, 0.07, 0.85, 0.5);
  },
  wrong(t: number) {
    // trầm ngâm — thud nỉ + nốt trầm lắng xuống, cực kỳ tiết chế
    felt(t, 0.12);
    tone(hz(233), t + 0.03, 0.28, { type: "sine", peak: 0.08, glide: 196, send: 0.2 });
    tone(hz(116.5), t + 0.05, 0.2, { type: "sine", peak: 0.06 });
  },
  complete(t: number) {
    // Westminster quarters — E C D G, rồi G D E C (đúng chất đồng hồ)
    const seq = [E5, C5, D5, G4];
    seq.forEach((f, i) => chime(hz(f), t + i * 0.16, 0.09, 0.9));
    [G4, D5, E5, C5].forEach((f, i) => chime(hz(f), t + 0.72 + i * 0.16, 0.08, 1));
    tone(hz(C4), t + 1.35, 1.1, { type: "sine", peak: 0.05, attack: 0.06, send: 0.4 });
  },
  levelup(t: number) {
    [C5, E5, G5, C6].forEach((f, i) => chime(hz(f), t + i * 0.12, 0.09, 0.9));
    chime(hz(E6), t + 0.55, 0.06, 1.2, 0.55);
    [C4, G4].forEach((f) => tone(hz(f), t + 0.5, 1, { type: "sine", peak: 0.05, attack: 0.08, send: 0.4 }));
  },
  goal(t: number) {
    [E5, G5, C6].forEach((f, i) => chime(hz(f), t + i * 0.11, 0.08, 0.8));
  },
  tick(t: number) {
    // tick kim máy: click kép rất khẽ (tick-tock của escapement)
    noiseHit(t, 0.008, 0.05, 4600, 3400, 2.6);
    noiseHit(t + 0.012, 0.006, 0.03, 2400, 1700, 2.2);
  },
  timeup(t: number) {
    chime(hz(G4), t, 0.09, 0.7);
    chime(hz(C4 * 1.335), t + 0.2, 0.09, 0.9); // F4 — kết lửng trang nhã
  },
  switch_(t: number) {
    noiseHit(t, 0.14, 0.025, 1000, 380, 0.8, "lowpass", 0.15);
    [G4, C5, E5].forEach((f, i) => chime(hz(f), t + 0.08 + i * 0.1, 0.08, 0.8));
  },
};

const voices = { cozy, game, lux };
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

// FIX mobile: mở khoá + giữ AudioContext chạy; đổi theme = đổi luôn IR vang.
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
