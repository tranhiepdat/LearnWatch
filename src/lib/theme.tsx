"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Transition } from "framer-motion";

/**
 * Hệ 3 theme — mỗi theme không chỉ đổi màu (CSS vars trong globals.css)
 * mà đổi cả "tính cách chuyển động": độ nảy spring, mức scale khi bấm,
 * kiểu vào trang… Component đọc qua useTheme().motion.
 */

export type ThemeId = "game" | "apple" | "cozy";
export const THEME_IDS: ThemeId[] = ["game", "apple", "cozy"];
const KEY = "lw_theme";

export interface ThemeMotion {
  /** scale khi đè nút chính */
  tap: number;
  /** spring chung cho phần tử UI (nav pill, card…) */
  spring: Transition;
  /** spring nảy mạnh cho khoảnh khắc thưởng */
  bouncy: Transition;
  /** hiệu ứng vào trang */
  page: { initial: Record<string, number | string>; animate: Record<string, number | string>; transition: Transition };
}

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  tagline: string;
  emoji: string;
  /** màu preview trong sheet chọn theme (hardcode, không theo vars) */
  preview: { bg: string; card: string; text: string; accent: string; extra: string[] };
  /** meta theme-color cho thanh trình duyệt mobile */
  bar: string;
  motion: ThemeMotion;
}

export const THEMES: Record<ThemeId, ThemeMeta> = {
  game: {
    id: "game",
    name: "Arcade",
    tagline: "Neon tối · combo cháy · chất game thủ",
    emoji: "🕹️",
    preview: {
      bg: "#050818",
      card: "#0d1430",
      text: "#e8eeff",
      accent: "#00d9ff",
      extra: ["#8a5cff", "#a3f553", "#ff4d6d"],
    },
    bar: "#050818",
    motion: {
      tap: 0.92,
      spring: { type: "spring", stiffness: 520, damping: 26 },
      bouncy: { type: "spring", stiffness: 640, damping: 14 },
      page: {
        initial: { opacity: 0, x: 22, skewX: -1.5 },
        animate: { opacity: 1, x: 0, skewX: 0 },
        transition: { type: "spring", stiffness: 420, damping: 32 },
      },
    },
  },
  apple: {
    id: "apple",
    name: "Tinh giản",
    tagline: "Sáng sạch · mượt như lụa · kiểu iOS",
    emoji: "",
    preview: {
      bg: "#f2f2f7",
      card: "#ffffff",
      text: "#16161a",
      accent: "#0a7aff",
      extra: ["#34c759", "#ff9f0a", "#af52de"],
    },
    bar: "#f2f2f7",
    motion: {
      tap: 0.97,
      spring: { type: "spring", stiffness: 380, damping: 32 },
      bouncy: { type: "spring", stiffness: 420, damping: 26 },
      page: {
        initial: { opacity: 0, y: 8, scale: 0.988 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.34, ease: [0.32, 0.72, 0.24, 1] },
      },
    },
  },
  cozy: {
    id: "cozy",
    name: "Ấm áp",
    tagline: "Kem pastel · nhún như thạch · dễ thương",
    emoji: "🧸",
    preview: {
      bg: "#fff4e4",
      card: "#fffdf7",
      text: "#4c3527",
      accent: "#ff6b57",
      extra: ["#2fbf9b", "#ffb63d", "#b983ff"],
    },
    bar: "#fff4e4",
    motion: {
      tap: 0.88,
      spring: { type: "spring", stiffness: 340, damping: 18 },
      bouncy: { type: "spring", stiffness: 400, damping: 11 },
      page: {
        initial: { opacity: 0, y: 16, scale: 0.955 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { type: "spring", stiffness: 320, damping: 17 },
      },
    },
  },
};

export function readTheme(): ThemeId {
  if (typeof document === "undefined") return "game";
  const t = document.documentElement.getAttribute("data-theme");
  return t === "apple" || t === "cozy" ? t : "game";
}

function applyTheme(id: ThemeId) {
  document.documentElement.setAttribute("data-theme", id);
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    /* ignore */
  }
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", THEMES[id].bar);
  window.dispatchEvent(new CustomEvent("lw:theme", { detail: id }));
}

const ThemeCtx = createContext<{ theme: ThemeId; meta: ThemeMeta; setTheme: (id: ThemeId) => void }>({
  theme: "game",
  meta: THEMES.game,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Attr đã được inline-script trong layout đặt TRƯỚC hydration → đọc lại là khớp
  const [theme, setThemeState] = useState<ThemeId>("game");

  useEffect(() => {
    setThemeState(readTheme());
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    applyTheme(id);
    setThemeState(id);
  }, []);

  return <ThemeCtx.Provider value={{ theme, meta: THEMES[theme], setTheme }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}
