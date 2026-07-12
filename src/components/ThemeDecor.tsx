"use client";

import { useTheme } from "@/lib/theme";

const BLOBS = [
  { size: 260, color: "#ffc894", top: "-6%", left: "-12%", delay: "0s" },
  { size: 220, color: "#ffb3c7", top: "34%", left: "72%", delay: "-6s" },
  { size: 240, color: "#9fe7cd", top: "72%", left: "-8%", delay: "-11s" },
  { size: 180, color: "#d6c4ff", top: "8%", left: "68%", delay: "-15s" },
];

const STARS = [
  { top: "12%", left: "8%", s: 10, d: "0s" },
  { top: "22%", left: "86%", s: 8, d: "-1.2s" },
  { top: "58%", left: "12%", s: 9, d: "-2.1s" },
  { top: "70%", left: "82%", s: 11, d: "-0.6s" },
  { top: "42%", left: "48%", s: 7, d: "-1.7s" },
];

/**
 * Lớp trang trí nền theo theme:
 *  · game  — scanline quét dọc (lưới HUD + grain nằm ở CSS body)
 *  · cozy  — blob pastel morph trôi lơ lửng + sao lấp lánh
 *  · apple — sạch trơn, đúng chất tối giản
 */
export default function ThemeDecor() {
  const { theme } = useTheme();

  if (theme === "game") return <div aria-hidden className="scanline" />;

  if (theme === "cozy") {
    return (
      <div aria-hidden>
        {BLOBS.map((b, i) => (
          <span
            key={i}
            className="cozy-blob"
            style={{
              width: b.size,
              height: b.size,
              background: b.color,
              top: b.top,
              left: b.left,
              animationDelay: `${b.delay}, ${b.delay}`,
            }}
          />
        ))}
        {STARS.map((s, i) => (
          <svg
            key={`s${i}`}
            className="cozy-star"
            style={{ top: s.top, left: s.left, width: s.s, height: s.s, animationDelay: s.d }}
            viewBox="0 0 24 24"
            fill="#ffb63d"
          >
            <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
          </svg>
        ))}
      </div>
    );
  }

  return null;
}
