"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Transition } from "framer-motion";

/**
 * Hệ 3 THEME — ít hơn nhưng LÀM TỚI: mỗi theme một thế giới trọn vẹn
 * (màu + chất liệu + font + motion + sound cùng kể MỘT câu chuyện).
 *
 *  · cozy — ẤM ÁP · "creamy keyboard": kem bơ + caramel, thock trầm êm,
 *           motion BUBBLY POPPY — mọi thứ pop tại chỗ, không trượt không lắc
 *  · game — DIGITAL · motion-graphic: nền gần đen, outline mảnh 1px,
 *           LINE REVEAL (kẻ tự vẽ), shape morph, phản hồi wipe/clip — không bay
 *  · lux  — BOUTIQUE · quiet luxury: emerald + champagne, serif, chuông
 *           đồng hồ, motion GLIDE êm như mở khay nhung
 *
 * NGUYÊN TẮC MOTION CHUNG (chống tiền đình):
 *  · Phản hồi TẠI CHỖ: scale/opacity/clip — không có indicator trượt ngang
 *  · Di chuyển chỉ DỌC và ngắn; nảy = overshoot spring tắt nhanh
 *  · Không xoay mảng lớn, không dao động qua lại
 */

export type ThemeId = "cozy" | "game" | "lux";
export const THEME_IDS: ThemeId[] = ["cozy", "game", "lux"];
const KEY = "lw_theme";
/** người dùng cũ còn lưu id theme đã gỡ → dồn về theme gần chất nhất */
const LEGACY: Record<string, ThemeId> = { apple: "lux", dreamy: "cozy", studio: "game" };

export interface ThemeMotion {
  /** scale khi đè nút chính */
  tap: number;
  /** spring chung cho phần tử UI */
  spring: Transition;
  /** spring nảy cho khoảnh khắc thưởng */
  bouncy: Transition;
  /** cú nảy khi THẢ nút chính — keyframes scale/y (không rotate, không x) */
  pop: { keyframes: Record<string, number[]>; transition: Transition };
  /** hiệu ứng vào trang */
  page: {
    initial: Record<string, number | string>;
    animate: Record<string, number | string>;
    transition: Transition;
  };
  /** card nội dung (câu hỏi mới…) vào màn — dọc hoặc reveal, KHÔNG ngang */
  card: {
    initial: Record<string, number | string>;
    animate: Record<string, number | string>;
    exit: Record<string, number | string>;
    transition: Transition;
  };
}

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  tagline: string;
  emoji: string;
  preview: { bg: string; card: string; text: string; accent: string; extra: string[] };
  bar: string;
  motion: ThemeMotion;
}

export const THEMES: Record<ThemeId, ThemeMeta> = {
  cozy: {
    id: "cozy",
    name: "Ấm áp",
    tagline: "Kem bơ & caramel · thock trầm êm · pop tại chỗ",
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
      spring: { type: "spring", stiffness: 420, damping: 19 },
      bouncy: { type: "spring", stiffness: 500, damping: 13 },
      pop: {
        keyframes: { y: [0, -6, 0, -2, 0], scale: [0.9, 1.06, 0.98, 1.015, 1], scaleY: [0.88, 1.08, 0.97, 1.01, 1] },
        transition: { duration: 0.48, ease: "easeOut" },
      },
      page: {
        initial: { opacity: 0, y: 12, scale: 0.985 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { type: "spring", stiffness: 400, damping: 22 },
      },
      // pop nở từ 0.93 — cảm giác "bong bóng nổi lên" chứ không trượt tới
      card: {
        initial: { opacity: 0, scale: 0.93, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.97 },
        transition: { type: "spring", stiffness: 460, damping: 17 },
      },
    },
  },
  game: {
    id: "game",
    name: "Digital",
    tagline: "Outline mảnh · line reveal · shape morph",
    emoji: "▞",
    preview: {
      bg: "#07080f",
      card: "#0d0f1a",
      text: "#eef1ff",
      accent: "#35e0ff",
      extra: ["#ffffff", "#5b6cff", "#ffe14d"],
    },
    bar: "#07080f",
    motion: {
      tap: 0.96,
      spring: { type: "spring", stiffness: 650, damping: 34 },
      bouncy: { type: "spring", stiffness: 700, damping: 22 },
      pop: { keyframes: { scale: [0.96, 1.015, 1] }, transition: { duration: 0.18, ease: "easeOut" } },
      page: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.16, ease: "linear" },
      },
      // WIPE REVEAL: nội dung đứng yên, chỉ "mở màn" từ trái sang — đúng chất
      // motion graphic và tuyệt đối không gây tiền đình (zero translation)
      card: {
        initial: { opacity: 1, clipPath: "inset(0 100% 0 0)" },
        animate: { opacity: 1, clipPath: "inset(0 0% 0 0)" },
        exit: { opacity: 0 },
        transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] },
      },
    },
  },
  lux: {
    id: "lux",
    name: "Boutique",
    tagline: "Emerald & champagne · serif · lịm như nhung",
    emoji: "🥃",
    preview: {
      bg: "#0a1712",
      card: "#12271e",
      text: "#f3ecdd",
      accent: "#d9b978",
      extra: ["#ecd9a8", "#8fb59b", "#b3808a"],
    },
    bar: "#0a1712",
    motion: {
      tap: 0.97,
      spring: { type: "spring", stiffness: 300, damping: 30 },
      bouncy: { type: "spring", stiffness: 340, damping: 22 },
      pop: { keyframes: { scale: [0.97, 1.012, 1] }, transition: { duration: 0.42, ease: [0.25, 0.8, 0.25, 1] } },
      page: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.32, ease: [0.25, 0.8, 0.25, 1] },
      },
      card: {
        initial: { opacity: 0, y: 12, scale: 0.99 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -6 },
        transition: { type: "spring", stiffness: 300, damping: 30 },
      },
    },
  },
};

function normalize(t: string | null): ThemeId {
  if (t && t in LEGACY) return LEGACY[t];
  return (THEME_IDS as string[]).includes(t ?? "") ? (t as ThemeId) : "game";
}

export function readTheme(): ThemeId {
  if (typeof document === "undefined") return "game";
  return normalize(document.documentElement.getAttribute("data-theme"));
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
