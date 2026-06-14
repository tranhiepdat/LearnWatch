"use client";

const KEY = "learnwatch_progress_v1";

export interface Progress {
  xp: number;
  quizPlayed: number;
  bestScore: number;
  learned: string[];
  lastPlayed: string | null;
  streak: number;
}

const empty: Progress = {
  xp: 0,
  quizPlayed: 0,
  bestScore: 0,
  learned: [],
  lastPlayed: null,
  streak: 0,
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
    if (!raw) return { ...empty };
    return { ...empty, ...(JSON.parse(raw) as Partial<Progress>) };
  } catch {
    return { ...empty };
  }
}

function save(p: Progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
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

export function recordQuiz(correct: number, total: number): Progress {
  const p = getProgress();
  p.xp += correct * 10;
  p.quizPlayed += 1;
  p.bestScore = Math.max(p.bestScore, total > 0 ? Math.round((correct / total) * 100) : 0);
  touchStreak(p);
  save(p);
  return p;
}

export function toggleLearned(id: string): Progress {
  const p = getProgress();
  if (p.learned.includes(id)) {
    p.learned = p.learned.filter((x) => x !== id);
  } else {
    p.learned = [...p.learned, id];
    p.xp += 5;
    touchStreak(p);
  }
  save(p);
  return p;
}

export function resetProgress(): Progress {
  save({ ...empty });
  return { ...empty };
}
