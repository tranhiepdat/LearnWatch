"use client";

import { useTheme } from "@/lib/theme";

/**
 * Artwork nền TĨNH — nhận diện theme mà không tranh chú ý với nội dung:
 * vài hình độ mờ thấp nép ở RÌA màn, KHÔNG animation, KHÔNG parallax.
 * Nền đứng yên = mắt được nghỉ; bản sắc nằm ở CHẤT LIỆU, không ở chuyển động.
 */

function Sphere({ size, from, mid, to }: { size: number; from: string; mid: string; to: string }) {
  return (
    <div
      className="rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 32% 28%, ${from} 0%, ${mid} 48%, ${to} 100%)`,
      }}
    />
  );
}

function SelectFrame({ children }: { children: React.ReactNode }) {
  const handle = "absolute h-[6px] w-[6px] bg-white/90";
  return (
    <div className="relative p-2.5" style={{ transform: "rotate(7deg)" }}>
      <div className="absolute inset-0 border-[1.5px] border-white/70" />
      <span className={`${handle} -left-[3px] -top-[3px]`} />
      <span className={`${handle} -right-[3px] -top-[3px]`} />
      <span className={`${handle} -left-[3px] -bottom-[3px]`} />
      <span className={`${handle} -right-[3px] -bottom-[3px]`} />
      {children}
    </div>
  );
}

export default function ThemeDecor() {
  const { theme } = useTheme();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {theme === "game" && (
        <>
          {/* cặp neon cyan × magenta — chữ ký arcade */}
          <svg className="absolute -right-5 top-[9%] opacity-[0.16]" width="88" height="88" viewBox="0 0 100 100">
            <path d="M50 8 L92 86 H8 Z" fill="none" stroke="#41f0ff" strokeWidth="2" />
          </svg>
          <svg className="absolute -left-4 bottom-[13%] opacity-[0.13]" width="72" height="72" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#ff3df0" strokeWidth="2" strokeDasharray="12 9" />
          </svg>
          {/* quầng magenta mờ góc dưới — cân với horizon cyan phía trên */}
          <div
            className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full opacity-[0.14]"
            style={{ background: "#ff3df0", filter: "blur(90px)" }}
          />
        </>
      )}

      {theme === "apple" && (
        <>
          {/* 2 vệt sáng chéo xuyên kính + quầng màu lạnh */}
          <div
            className="absolute -left-24 top-[-10%] h-[130%] w-24 opacity-[0.12]"
            style={{ background: "linear-gradient(#ffffff, transparent)", transform: "rotate(18deg)", filter: "blur(26px)" }}
          />
          <div
            className="absolute left-[28%] top-[-10%] h-[120%] w-10 opacity-[0.08]"
            style={{ background: "#ffffff", transform: "rotate(18deg)", filter: "blur(22px)" }}
          />
          <div
            className="absolute -right-16 top-[6%] h-56 w-56 rounded-full opacity-25"
            style={{ background: "#9fe8ff", filter: "blur(70px)" }}
          />
          <div
            className="absolute -left-20 top-[46%] h-64 w-64 rounded-full opacity-20"
            style={{ background: "#7dffc4", filter: "blur(80px)" }}
          />
          <div
            className="absolute -right-12 bottom-[8%] h-48 w-48 rounded-full opacity-20"
            style={{ background: "#dcd4ff", filter: "blur(70px)" }}
          />
        </>
      )}

      {theme === "cozy" && (
        <>
          {/* nắng caramel + hơi ấm — như góc quán quen buổi chiều */}
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

      {theme === "dreamy" && (
        <>
          {/* dải aurora pastel TĨNH vắt chéo màn + ngọc trai nhỏ */}
          <div
            className="absolute -left-[20%] top-[4%] h-24 w-[150%] opacity-[0.2]"
            style={{
              background: "linear-gradient(90deg, #b78cfa, #f086c8 50%, #8ec5ff)",
              transform: "rotate(-9deg)",
              filter: "blur(38px)",
            }}
          />
          <div
            className="absolute -left-[25%] bottom-[12%] h-20 w-[150%] opacity-[0.16]"
            style={{
              background: "linear-gradient(90deg, #8ec5ff, #f086c8 45%, #ffd9ae)",
              transform: "rotate(7deg)",
              filter: "blur(42px)",
            }}
          />
          {[
            { top: "18%", right: "7%", s: 10, o: 0.5 },
            { top: "34%", left: "5%", s: 7, o: 0.4 },
            { bottom: "24%", right: "12%", s: 8, o: 0.45 },
          ].map((m, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                ...m,
                width: m.s,
                height: m.s,
                opacity: m.o,
                background: "radial-gradient(circle at 30% 30%, #ffffff, #e9d5ff 70%)",
                boxShadow: "0 0 10px rgba(183,140,250,0.6)",
              } as React.CSSProperties}
            />
          ))}
        </>
      )}

      {theme === "studio" && (
        <>
          <svg className="absolute -left-7 top-[11%] opacity-[0.3]" width="120" height="127" viewBox="0 0 100 106" fill="none">
            <defs>
              <linearGradient id="coneg2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3ddb84" />
                <stop offset="55%" stopColor="#1e9c58" />
                <stop offset="100%" stopColor="#0c6136" />
              </linearGradient>
            </defs>
            <path d="M50 4 L88 90 Q50 103 12 90 Z" fill="url(#coneg2)" />
          </svg>
          <div className="absolute -right-3 bottom-[14%] opacity-40">
            <SelectFrame>
              <Sphere size={62} from="#f3ffb8" mid="#d3ee4e" to="#8aa621" />
            </SelectFrame>
          </div>
          {/* thước đo dọc mép phải — ngôn ngữ design-tool */}
          <div
            className="absolute right-0 top-[20%] h-[52%] w-3 opacity-[0.22]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, rgba(255,255,255,0.9) 0 1px, transparent 1px 12px), repeating-linear-gradient(180deg, rgba(255,255,255,0.9) 0 1px, transparent 1px 48px)",
              backgroundSize: "6px 100%, 12px 100%",
              backgroundPosition: "right top, right top",
              backgroundRepeat: "no-repeat",
            }}
          />
        </>
      )}
    </div>
  );
}
