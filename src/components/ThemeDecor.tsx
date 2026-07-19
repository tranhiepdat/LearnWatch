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
          {/* nắng caramel ấm — bình minh trên đảo */}
          <div
            className="absolute -right-16 -top-12 h-56 w-56 rounded-full opacity-[0.24]"
            style={{ background: "radial-gradient(circle, #ffc873 0%, rgba(255,200,115,0) 70%)" }}
          />
          {/* lá Nook (Animal Crossing) lớn nép góc trên */}
          <svg className="absolute -right-4 top-[6%] opacity-[0.16]" width="94" height="94" viewBox="0 0 100 100">
            <path d="M50 6 C22 24 22 66 50 94 C78 66 78 24 50 6 Z" fill="#6fae7f" />
            <path d="M50 14 L50 88" stroke="#4d8a5f" strokeWidth="2.5" fill="none" />
            <path d="M50 40 L34 30 M50 54 L66 44 M50 68 L36 60" stroke="#4d8a5f" strokeWidth="2" fill="none" />
          </svg>
          {/* lá nhỏ trôi mép trái */}
          <svg className="absolute -left-3 top-[42%] opacity-[0.14]" width="52" height="52" viewBox="0 0 100 100" style={{ transform: "rotate(-24deg)" }}>
            <path d="M50 8 C26 24 26 62 50 92 C74 62 74 24 50 8 Z" fill="#8fb59b" />
            <path d="M50 16 L50 86" stroke="#5f9270" strokeWidth="2.5" fill="none" />
          </svg>
          {/* trái cây bé (chấm) rải rác */}
          <div className="absolute left-[16%] top-[14%] h-3 w-3 rounded-full opacity-[0.3]" style={{ background: "#d95d55" }} />
          <div className="absolute right-[24%] bottom-[24%] h-2.5 w-2.5 rounded-full opacity-[0.28]" style={{ background: "#ef9b3f" }} />
          {/* "đảo nhỏ" — gò cỏ tròn mềm nép đáy màn */}
          <div
            className="absolute -bottom-24 left-1/2 h-44 w-[150%] -translate-x-1/2 rounded-[50%] opacity-[0.14]"
            style={{ background: "radial-gradient(circle at 50% 0%, #8fbf93 0%, rgba(143,191,147,0) 68%)" }}
          />
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
