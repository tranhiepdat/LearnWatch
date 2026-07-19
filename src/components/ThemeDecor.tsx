"use client";

import { useTheme } from "@/lib/theme";

/**
 * Artwork nền TĨNH — nhận diện theme, nép ở rìa màn, KHÔNG animation,
 * KHÔNG parallax. Nền đứng yên = mắt được nghỉ.
 */
export default function ThemeDecor() {
  const { theme } = useTheme();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {theme === "game" && (
        <>
          {/* hình khối outline mảnh + dấu cộng đo đạc — ngôn ngữ bản vẽ kỹ thuật */}
          <svg className="absolute -right-5 top-[9%] opacity-[0.14]" width="84" height="84" viewBox="0 0 100 100">
            <rect x="12" y="12" width="76" height="76" fill="none" stroke="#35e0ff" strokeWidth="1.5" />
            <rect x="26" y="26" width="48" height="48" fill="none" stroke="#eef1ff" strokeWidth="0.8" opacity="0.5" />
          </svg>
          <svg className="absolute -left-5 bottom-[13%] opacity-[0.12]" width="76" height="76" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#5b6cff" strokeWidth="1.5" strokeDasharray="10 8" />
            <circle cx="50" cy="50" r="3" fill="#5b6cff" />
          </svg>
          {["top-[22%] left-[8%]", "top-[46%] right-[6%]", "bottom-[26%] left-[14%]"].map((pos) => (
            <span key={pos} className={`absolute ${pos} opacity-25`}>
              <span className="absolute h-3 w-px bg-white/80" style={{ left: "50%" }} />
              <span className="absolute h-px w-3 bg-white/80" style={{ top: "50%", marginTop: 5.5 }} />
            </span>
          ))}
        </>
      )}

      {theme === "cozy" && (
        <>
          {/* nắng caramel + hơi ấm — góc quán quen buổi chiều */}
          <div
            className="absolute -right-16 -top-10 h-56 w-56 rounded-full opacity-[0.22]"
            style={{ background: "radial-gradient(circle, #ffc06a 0%, rgba(255,192,106,0) 70%)" }}
          />
          <div className="absolute -right-6 top-[8%] h-20 w-20 rounded-full opacity-[0.2]" style={{ background: "#ffb84d" }} />
          <div
            className="absolute -left-10 bottom-[15%] h-24 w-24 rounded-full opacity-[0.14]"
            style={{ border: "14px solid #6fae7f" }}
          />
          <div className="absolute left-[12%] bottom-[9%] h-3.5 w-3.5 rounded-full opacity-[0.25]" style={{ background: "#d95d55" }} />
        </>
      )}

      {theme === "lux" && (
        <>
          {/* vành bezel vàng hairline — mô-típ đồng hồ, rất kín đáo */}
          <svg className="absolute -right-24 -top-24 opacity-[0.2]" width="280" height="280" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="88" stroke="#d9b978" strokeWidth="0.8" />
            <circle cx="100" cy="100" r="72" stroke="#d9b978" strokeWidth="0.5" opacity="0.7" />
            {Array.from({ length: 60 }).map((_, i) => {
              const a = (i / 60) * Math.PI * 2;
              const long = i % 5 === 0;
              const r1 = long ? 80 : 84;
              return (
                <line
                  key={i}
                  x1={100 + Math.cos(a) * r1}
                  y1={100 + Math.sin(a) * r1}
                  x2={100 + Math.cos(a) * 88}
                  y2={100 + Math.sin(a) * 88}
                  stroke="#d9b978"
                  strokeWidth={long ? 1 : 0.5}
                />
              );
            })}
          </svg>
          <div
            className="absolute -left-14 bottom-[12%] h-40 w-40 rounded-full opacity-[0.12]"
            style={{ border: "1px solid #d9b978" }}
          />
          <span
            className="absolute left-[10%] bottom-[24%] h-2 w-2 rotate-45 opacity-30"
            style={{ background: "#ecd9a8" }}
          />
          {/* vignette êm cho chiều sâu nhung */}
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(120% 90% at 50% 30%, transparent 55%, rgba(0,0,0,0.32) 100%)" }}
          />
        </>
      )}
    </div>
  );
}
