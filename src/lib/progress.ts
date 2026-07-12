"use client";

const KEY = "learnwatch_progress_v2";
const OLD_KEY = "learnwatch_progress_v1";

export interface Progress {
  xp: number;
  quizPlayed: number;
  bestScore: number;
  learned: string[];
  lastPlayed: string | null;
  streak: number;
  /** mục tiêu XP mỗi ngày */
  goal: number;
  /** XP kiếm được theo ngày (giữ 30 ngày gần nhất) */
  dayXp: Record<string, number>;
  /** watchId trả lời SAI trong quiz → kho "ôn lỗi sai" (đếm số lần sai) */
  mistakes: Record<string, number>;
  bestCombo: number;
  blitzBest: number;
}

const empty: Progress = {
  xp: 0,
  quizPlayed: 0,
  bestScore: 0,
  learned: [],
  lastPlayed: null,
  streak: 0,
  goal: 60,
  dayXp: {},
  mistakes: {},
  bestCombo: 0,
  blitzBest: 0,
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86_400_000);
}

export function getProgress(): Progress {
  if (typeof window === "undefined") return { ...empty };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return { ...empty, ...(JSON.parse(raw) as Partial<Progress>) };
    // migrate v1 → v2 (giữ nguyên XP/streak/đã thuộc của người dùng cũ)
    const old = window.localStorage.getItem(OLD_KEY);
    if (old) {
      const p = { ...empty, ...(JSON.parse(old) as Partial<Progress>) };
      save(p);
      return p;
    }
    return { ...empty };
  } catch {
    return { ...empty };
  }
}

function save(p: Progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
    // các component (TopBar, vòng mục tiêu…) tự cập nhật realtime
    window.dispatchEvent(new CustomEvent("lw:progress"));
  } catch {
    /* ignore quota errors */
  }
}

/** Cap nhat chuoi ngay hoc (streak) khi co hoat dong. */
function touchStreak(p: Progress): Progress {
  const today = todayStr();
  if (p.lastPlayed === today) return p;
  if (p.lastPlayed && daysBetween(p.lastPlayed, today) === 1) {
    p.streak += 1;
  } else {
    p.streak = 1;
  }
  p.lastPlayed = today;
  return p;
}

// ===== LEVEL & DANH HIỆU (đường cong bậc 2 — lên cấp đầu nhanh, sau chậm) =====
export const LEVEL_NAMES = [
  "Tập sự",
  "Học việc",
  "Nhân viên mới",
  "Tư vấn viên",
  "Sale cứng",
  "Chuyên viên",
  "Cao thủ",
  "Chuyên gia",
  "Bậc thầy",
  "Huyền thoại tủ kính",
];

/** tổng XP cần để ĐẠT level L (L>=1) */
export function xpForLevel(l: number): number {
  const n = Math.max(0, l - 1);
  return 30 * n * n + 50 * n; // L1=0, L2=80, L3=220, L4=420, L5=680…
}

export interface LevelInfo {
  level: number;
  name: string;
  /** XP đã tích trong level hiện tại */
  into: number;
  /** XP cần cho cả level hiện tại */
  span: number;
}

export function levelFromXp(xp: number): LevelInfo {
  let l = 1;
  while (xpForLevel(l + 1) <= xp && l < 99) l++;
  const base = xpForLevel(l);
  const next = xpForLevel(l + 1);
  return {
    level: l,
    name: LEVEL_NAMES[Math.min(l - 1, LEVEL_NAMES.length - 1)],
    into: xp - base,
    span: next - base,
  };
}

export function todayXp(p: Progress): number {
  return p.dayXp[todayStr()] ?? 0;
}

export interface XpResult {
  p: Progress;
  /** vừa vượt mốc level trong lần cộng này */
  leveledUp: boolean;
  level: LevelInfo;
  /** vừa CHẠM mục tiêu ngày trong lần cộng này */
  goalJustHit: boolean;
}

/** Cộng XP + streak + XP theo ngày. Trả cờ level-up / đạt mục tiêu để ăn mừng. */
export function addXp(n: number): XpResult {
  const p = getProgress();
  const before = levelFromXp(p.xp).level;
  const today = todayStr();
  const dayBefore = p.dayXp[today] ?? 0;

  p.xp += n;
  p.dayXp[today] = dayBefore + n;
  // giữ gọn 30 ngày
  const keys = Object.keys(p.dayXp).sort();
  while (keys.length > 30) delete p.dayXp[keys.shift()!];
  touchStreak(p);
  save(p);

  const level = levelFromXp(p.xp);
  return {
    p,
    leveledUp: level.level > before,
    level,
    goalJustHit: dayBefore < p.goal && dayBefore + n >= p.goal,
  };
}

export function recordQuiz(correct: number, total: number, bonus = 0): XpResult {
  const r = addXp(correct * 10 + bonus);
  r.p.quizPlayed += 1;
  r.p.bestScore = Math.max(r.p.bestScore, total > 0 ? Math.round((correct / total) * 100) : 0);
  save(r.p);
  return r;
}

export function toggleLearned(id: string): Progress {
  const p = getProgress();
  if (p.learned.includes(id)) {
    p.learned = p.learned.filter((x) => x !== id);
    save(p);
    return p;
  }
  p.learned = [...p.learned, id];
  save(p);
  return addXp(5).p;
}

// ===== KHO LỖI SAI (trả lời sai trong quiz → ôn lại) =====
export function recordMistake(watchId: string): void {
  const p = getProgress();
  p.mistakes[watchId] = (p.mistakes[watchId] ?? 0) + 1;
  save(p);
}

/** Trả lời ĐÚNG trong chế độ ôn lỗi sai → trừ dần, hết nợ thì xoá khỏi kho */
export function resolveMistake(watchId: string): void {
  const p = getProgress();
  if (p.mistakes[watchId] == null) return;
  p.mistakes[watchId] -= 1;
  if (p.mistakes[watchId] <= 0) delete p.mistakes[watchId];
  save(p);
}

export function mistakeIds(): string[] {
  return Object.keys(getProgress().mistakes);
}

export function recordCombo(c: number): void {
  const p = getProgress();
  if (c > p.bestCombo) {
    p.bestCombo = c;
    save(p);
  }
}

export function recordBlitz(score: number): boolean {
  const p = getProgress();
  const isBest = score > p.blitzBest;
  if (isBest) {
    p.blitzBest = score;
    save(p);
  }
  return isBest;
}

export function setGoal(goal: number): Progress {
  const p = getProgress();
  p.goal = goal;
  save(p);
  return p;
}

export function resetProgress(): Progress {
  save({ ...empty });
  return { ...empty };
}
