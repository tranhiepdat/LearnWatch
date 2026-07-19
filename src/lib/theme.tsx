"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Transition } from "framer-motion";

/**
 * Hệ 5 theme — mỗi theme là MỘT THẾ GIỚI riêng: bảng màu + chất liệu + font
 * (CSS vars trong globals.css), tính cách chuyển động (motion tokens ở đây)
 * và bộ âm thanh (sound.ts đọc data-theme).
 *
 * NGUYÊN TẮC MOTION (chống "tiền đình"):
 *  · Chỉ di chuyển DỌC (y) + scale/squash — KHÔNG lắc ngang, KHÔNG xoay mảng lớn
 *  · Nảy = overshoot của spring, tắt nhanh — không dao động qua lại
 *  · Nhanh & sống động nhờ stiffness cao, KHÔNG nhờ biên độ lớn
 *
 *  · game   — NEON: arcade đêm, cyan × magenta, snap điện
 *  · apple  — THUỶ TINH: kính băng xanh, lướt êm
 *  · cozy   — ẤM ÁP: caramel mật ong, nảy mềm squash & stretch
 *  · dreamy — MỘNG MƠ: bình minh pastel ánh ngọc, trôi nhẹ
 *  · studio — XƯỞNG: design-tool xanh rêu, snap chuẩn px
 */

export type ThemeId = "game" | "apple" | "cozy" | "dreamy" | "studio";
export const THEME_IDS: ThemeId[] = ["game", "apple", "cozy", "dreamy", "studio"];
const KEY = "lw_theme";

export interface ThemeMotion {
  /** scale khi đè nút chính */
  tap: number;
  /** spring chung cho phần tử UI (nav pill, card…) */
  spring: Transition;
  /** spring nảy mạnh cho khoảnh khắc thưởng */
  bouncy: Transition;
  /** cú nảy khi THẢ nút chính — keyframes scale/y (không rotate, không x) */
  pop: { keyframes: Record<string, number[]>; transition: Transition };
  /** hiệu ứng vào trang — fade + trồi dọc nhẹ */
  page: {
    initial: Record<string, number | string>;
    animate: Record<string, number | string>;
    transition: Transition;
  };
  /** card nội dung (câu hỏi mới, thẻ mới) vào màn — DỌC, không ngang */
  card: {
    initial: Record<string, number>;
    animate: Record<string, number>;
    exit: Record<string, number>;
    transition: Transition;
  };
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
    name: "Neon",
    tagline: "Arcade đêm · cyan × hồng cháy · snap điện",
    emoji: "🕹️",
    preview: {
      bg: "#070312",
      card: "#150c2e",
      text: "#f2edff",
      accent: "#22e4ff",
      extra: ["#ff3df0", "#8a5cff", "#ffe14d"],
    },
    bar: "#070312",
    motion: {
      tap: 0.93,
      spring: { type: "spring", stiffness: 640, damping: 30 },
      bouncy: { type: "spring", stiffness: 700, damping: 18 },
      pop: { keyframes: { scale: [0.93, 1.045, 1] }, transition: { duration: 0.24, ease: "easeOut" } },
      page: {
        initial: { opacity: 0, y: 8, scale: 0.996 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.18, ease: [0.2, 0.9, 0.25, 1] },
      },
      card: {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.99 },
        transition: { type: "spring", stiffness: 640, damping: 32 },
      },
    },
  },
  apple: {
    id: "apple",
    name: "Thuỷ tinh",
    tagline: "Kính băng xanh · ánh sáng xuyên · lướt êm",
    emoji: "🧊",
    preview: {
      bg: "#5b83f2",
      card: "rgba(30,48,116,0.78)",
      text: "#ffffff",
      accent: "#ffffff",
      extra: ["#9fe8ff", "#7dffc4", "#dcd4ff"],
    },
    bar: "#7fa4ff",
    motion: {
      tap: 0.965,
      spring: { type: "spring", stiffness: 330, damping: 30 },
      bouncy: { type: "spring", stiffness: 370, damping: 22 },
      pop: { keyframes: { scale: [0.965, 1.015, 1] }, transition: { duration: 0.38, ease: [0.25, 0.8, 0.25, 1] } },
      page: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] },
      },
      card: {
        initial: { opacity: 0, y: 14, scale: 0.985 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -8 },
        transition: { type: "spring", stiffness: 330, damping: 30 },
      },
    },
  },
  cozy: {
    id: "cozy",
    name: "Ấm áp",
    tagline: "Caramel & mật ong · nảy mềm · như ổ chăn",
    emoji: "☕",
    preview: {
      bg: "#f8eedd",
      card: "#fffdf8",
      text: "#3f2d20",
      accent: "#ef9b3f",
      extra: ["#d95d55", "#6fae7f", "#b5691a"],
    },
    bar: "#f8eedd",
    motion: {
      tap: 0.9,
      spring: { type: "spring", stiffness: 400, damping: 17 },
      bouncy: { type: "spring", stiffness: 460, damping: 12 },
      pop: {
        keyframes: { y: [0, -7, 0, -2, 0], scale: [0.9, 1.06, 0.98, 1.015, 1], scaleY: [0.88, 1.08, 0.97, 1.01, 1] },
        transition: { duration: 0.5, ease: "easeOut" },
      },
      page: {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { type: "spring", stiffness: 380, damping: 20 },
      },
      card: {
        initial: { opacity: 0, y: 22, scale: 0.955 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.985 },
        transition: { type: "spring", stiffness: 420, damping: 16 },
      },
    },
  },
  dreamy: {
    id: "dreamy",
    name: "Mộng mơ",
    tagline: "Bình minh pastel · ánh ngọc trai · trôi nhẹ",
    emoji: "🌸",
    preview: {
      bg: "#f3eeff",
      card: "#ffffff",
      text: "#43315e",
      accent: "#a06bf5",
      extra: ["#f086c8", "#8ec5ff", "#ffd9ae"],
    },
    bar: "#f3eeff",
    motion: {
      tap: 0.97,
      spring: { type: "spring", stiffness: 250, damping: 26 },
      bouncy: { type: "spring", stiffness: 290, damping: 17 },
      pop: { keyframes: { scale: [0.97, 1.03, 1] }, transition: { duration: 0.48, ease: [0.2, 0.7, 0.25, 1] } },
      page: {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.36, ease: [0.2, 0.7, 0.25, 1] },
      },
      card: {
        initial: { opacity: 0, y: 16, scale: 0.985 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -8 },
        transition: { type: "spring", stiffness: 250, damping: 24 },
      },
    },
  },
  studio: {
    id: "studio",
    name: "Xưởng",
    tagline: "Design-tool xanh rêu · snap chuẩn từng px",
    emoji: "📐",
    motion: {
      tap: 0.95,
      spring: { type: "spring", stiffness: 600, damping: 34 },
      bouncy: { type: "spring", stiffness: 620, damping: 24 },
      pop: { keyframes: { scale: [0.95, 1.012, 1] }, transition: { duration: 0.17, ease: "easeOut" } },
      page: {
        initial: { opacity: 0, scale: 0.992 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.16, ease: "easeOut" },
      },
      card: {
        initial: { opacity: 0, y: 10, scale: 0.99 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -6 },
        transition: { type: "spring", stiffness: 600, damping: 34 },
      },
    },
    preview: {
      bg: "#04190f",
      card: "#0b2c1c",
      text: "#eaf7ee",
      accent: "#4ade87",
      extra: ["#ff8a5c", "#d9f99d", "#ffffff"],
    },
    bar: "#04190f",
  },
};

export function readTheme(): ThemeId {
  if (typeof document === "undefined") return "game";
  const t = document.documentElement.getAttribute("data-theme");
  return (THEME_IDS as string[]).includes(t ?? "") ? (t as ThemeId) : "game";
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
