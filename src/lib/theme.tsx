"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Transition } from "framer-motion";

/**
 * Hệ 5 theme — mỗi theme đổi cả bảng màu (CSS vars trong globals.css) LẪN
 * "tính cách chuyển động": độ nảy spring, mức scale khi bấm, kiểu vào trang,
 * artwork nền, bộ âm thanh. Component đọc qua useTheme().motion.
 *
 *  · game   — Arcade: neon tối, sắc, giật điện
 *  · apple  — Kính mờ: glassmorphism xanh dương, blur focus-in mượt
 *  · cozy   — Đất sét: MÀU ĐẶC rực rỡ, nhún claymorphism
 *  · dreamy — Mộng mơ: lilac mosaic, trôi lơ lửng chậm rãi
 *  · studio — Studio: xanh rêu 3D design-tool, khung chọn snap
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
  /** hiệu ứng vào trang (animate cho phép keyframes để nảy nhiều nhịp) */
  page: {
    initial: Record<string, number | string>;
    animate: Record<string, number | string | Array<number | string>>;
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
        initial: { opacity: 0, x: 26, skewX: -2 },
        animate: { opacity: 1, x: 0, skewX: 0 },
        transition: { type: "spring", stiffness: 430, damping: 30 },
      },
    },
  },
  apple: {
    id: "apple",
    name: "Kính mờ",
    tagline: "Glass xanh dương · ánh sáng xuyên · lơ lửng",
    emoji: "🫧",
    preview: {
      bg: "#5b86f7",
      card: "rgba(255,255,255,0.35)",
      text: "#ffffff",
      accent: "#eaf2ff",
      extra: ["#bfe0ff", "#8fd6ff", "#dcd4ff"],
    },
    bar: "#5b86f7",
    motion: {
      tap: 0.96,
      spring: { type: "spring", stiffness: 340, damping: 28 },
      bouncy: { type: "spring", stiffness: 380, damping: 22 },
      page: {
        // kính lấy nét: từ mờ nhoè phóng nhẹ → sắc nét
        initial: { opacity: 0, scale: 1.04, filter: "blur(10px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        transition: { duration: 0.5, ease: [0.22, 0.68, 0.26, 1] },
      },
    },
  },
  cozy: {
    id: "cozy",
    name: "Đất sét",
    tagline: "Màu đặc rực rỡ · nhún clay · kẹo ngọt",
    emoji: "🍭",
    preview: {
      bg: "#ffefd6",
      card: "#ffffff",
      text: "#4a2e1e",
      accent: "#ff5e3a",
      extra: ["#00c48c", "#ffc53d", "#8b5cf6"],
    },
    bar: "#ffefd6",
    motion: {
      tap: 0.86,
      spring: { type: "spring", stiffness: 360, damping: 15 },
      bouncy: { type: "spring", stiffness: 430, damping: 9 },
      page: {
        // đất sét RƠI xuống đập đất rồi NẢY TƯNG nhiều nhịp giảm dần
        initial: { opacity: 0, y: -70, scale: 0.92 },
        animate: {
          opacity: 1,
          y: [-70, 0, -22, 0, -9, 0, -3, 0],
          scale: [0.92, 1.025, 0.985, 1.012, 0.995, 1.005, 1, 1],
        },
        transition: { duration: 0.85, ease: "easeOut", opacity: { duration: 0.22 } },
      },
    },
  },
  dreamy: {
    id: "dreamy",
    name: "Mộng mơ",
    tagline: "Lilac mơ màng · khảm gương · trôi lững lờ",
    emoji: "🌷",
    preview: {
      bg: "#f2e7fe",
      card: "#ffffff",
      text: "#3b2c4f",
      accent: "#a855f7",
      extra: ["#c084fc", "#ec4899", "#e9d5ff"],
    },
    bar: "#f2e7fe",
    motion: {
      tap: 0.965,
      spring: { type: "spring", stiffness: 220, damping: 26 },
      bouncy: { type: "spring", stiffness: 260, damping: 18 },
      page: {
        // sương tan: nổi lên chậm, mờ → rõ
        initial: { opacity: 0, y: 30, filter: "blur(7px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        transition: { duration: 0.65, ease: [0.16, 0.68, 0.24, 1] },
      },
    },
  },
  studio: {
    id: "studio",
    name: "Studio",
    tagline: "Xanh rêu 3D · khung chọn · chất designer",
    emoji: "📐",
    preview: {
      bg: "#052014",
      card: "#0a3320",
      text: "#eaf7ee",
      accent: "#53e08b",
      extra: ["#ff8a5c", "#d9f99d", "#ffffff"],
    },
    bar: "#052014",
    motion: {
      tap: 0.94,
      spring: { type: "spring", stiffness: 560, damping: 32 },
      bouncy: { type: "spring", stiffness: 600, damping: 20 },
      page: {
        // khung canvas snap vào vị trí — dứt khoát như design tool
        initial: { opacity: 0, scale: 0.965 },
        animate: { opacity: 1, scale: 1 },
        transition: { type: "spring", stiffness: 640, damping: 34 },
      },
    },
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
