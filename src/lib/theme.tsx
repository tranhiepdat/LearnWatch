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
  /** hover nút chính — framer SỞ HỮU transform (inline style thắng CSS class),
   *  nên scale khi rê chuột phải khai ở đây; CSS chỉ lo filter/outline/glow */
  hover: { scale: number; transition: Transition };
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
    tagline: "Đảo nhỏ ấm cúng · phím creamy · pop tròn dễ thương",
    emoji: "🍃",
    preview: {
      bg: "#f8eedd",
      card: "#fffdf8",
      text: "#3f2d20",
      // TRƯỚC là #ef9b3f (cam) trong khi --c-accent thật là #f7bb2f (vàng mật
      // ong) → ô màu trong bảng chọn theme hiện SAI màu so với theme thật.
      accent: "#f7bb2f",
      // đúng bảng 7 màu đang dùng trên UI
      extra: ["#6aaf82", "#e08bb4", "#7fb3d5", "#e27268", "#c79ae0"],
    },
    bar: "#f8eedd",
    motion: {
      // Animal Crossing: pop tròn trịa, dễ thương — boing MỀM biên độ nhỏ
      tap: 0.94,
      spring: { type: "spring", stiffness: 420, damping: 24 },
      bouncy: { type: "spring", stiffness: 480, damping: 16 },
      pop: {
        // Squash & stretch GIỮ NGUYÊN chất, nhưng lắng nhanh hơn:
        // trước ±14% với BỐN lần đảo chiều → đọc ra "rung" chứ không phải "nảy".
        // Nay ±8% và chỉ HAI lần đảo chiều: vẫn nảy mềm kiểu đệm bông, dứt khoát
        // hơn, không còn đoạn lắc đuôi.
        // Bắt đầu ĐÚNG chỗ nút đang đứng lúc đè (1.06 / 0.90) → nối liền mạch,
        // không có cú nhảy. Rồi bung cao gầy, rồi lắng. Mỗi trục chỉ 2 lần đảo
        // chiều: vẫn "boing" kiểu Animal Crossing nhưng không còn đuôi rung.
        keyframes: { scaleX: [1.06, 0.96, 1.008, 1], scaleY: [0.9, 1.05, 0.994, 1] },
        transition: { duration: 0.38, ease: [0.25, 0.85, 0.35, 1] },
      },
      // bật lên như keycap kem
      hover: { scale: 1.03, transition: { type: "spring", stiffness: 380, damping: 18 } },
      page: {
        initial: { opacity: 0, y: 10, scale: 0.99 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { type: "spring", stiffness: 420, damping: 24 },
      },
      // vào màn: nén nhẹ rồi "bung" tròn kiểu hộp thoại AC — overshoot NHỎ
      card: {
        initial: { opacity: 0, y: 6, scaleX: 0.97, scaleY: 0.9 },
        animate: { opacity: 1, y: 0, scaleX: 1, scaleY: 1 },
        exit: { opacity: 0, scaleY: 0.96 },
        transition: { type: "spring", stiffness: 440, damping: 20 },
      },
    },
  },
  game: {
    id: "game",
    name: "Digital",
    tagline: "Phosphor CRT · lân quang xanh dương · sắc gọn",
    emoji: "▞",
    preview: {
      bg: "#040710",
      card: "#081020",
      text: "#E4EEFF",
      accent: "#38A0FF",
      extra: ["#E4EEFF", "#7DE0F5", "#FFB000"],
    },
    bar: "#040710",
    motion: {
      tap: 0.96,
      // damping đủ cao để ζ ≥ 1 → tới nơi là DỪNG, không vọt qua rồi lùi lại.
      // (trước 650/34 = ζ≈0.67 và 700/22 = ζ≈0.42 — cả hai đều nảy.)
      spring: { type: "spring", stiffness: 650, damping: 52 },
      bouncy: { type: "spring", stiffness: 700, damping: 54 },
      // ĐƠN ĐIỆU: 0.96 → 1, không vượt qua 1. Trước là [0.96, 1.015, 1] —
      // bản CSS `popGame` đã bỏ vọt lố từ lần trước mà bản JS này thì chưa,
      // nên nút chính vẫn lắc dù CSS đã đúng.
      pop: { keyframes: { scale: [0.96, 1] }, transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] } },
      // CRT: nút ĐỨNG YÊN tuyệt đối khi rê chuột — chuyển động 100% do lớp
      // scanline (CSS ::after) lo. scale 1 = không ghi transform nào.
      hover: { scale: 1, transition: { duration: 0.09, ease: [0.9, 0, 0.1, 1] } },
      // reveal do CSS .glitch-cut / .glitch-in lo (cắt lát + RGB split) —
      // framer chỉ giữ opacity để không tranh transform/clip với glitch
      page: {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0.01 },
      },
      card: {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.01 },
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
      tap: 0.955,
      spring: { type: "spring", stiffness: 300, damping: 30 },
      bouncy: { type: "spring", stiffness: 340, damping: 22 },
      pop: {
        // y tính bằng px TUYỆT ĐỐI nên không teo theo kích thước nút → thấy rõ
        keyframes: { scale: [0.955, 1.028, 0.996, 1], y: [3, -2.5, 0.5, 0] },
        transition: { duration: 0.44, ease: [0.2, 0.9, 0.25, 1] },
      },
      // mở khay nhung — chậm, sang
      hover: { scale: 1.018, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
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
