"use client";

import { useTheme } from "@/lib/theme";

/**
 * Artwork nền TĨNH — nhận diện theme mà không tranh chú ý với nội dung:
 * 2-3 hình, độ mờ thấp, nép ở RÌA màn (không nằm sau vùng chữ chính),
 * KHÔNG animation, KHÔNG parallax. Nền đứng yên = mắt được nghỉ.
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
          <svg className="absolute -right-5 top-[9%] opacity-[0.14]" width="88" height="88" viewBox="0 0 100 100">
            <path d="M50 8 L92 86 H8 Z" fill="none" stroke="#00d9ff" strokeWidth="2" />
          </svg>
          <svg className="absolute -left-4 bottom-[13%] opacity-[0.1]" width="72" height="72" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#8a5cff" strokeWidth="2" strokeDasharray="12 9" />
          </svg>
        </>
      )}

      {theme === "apple" && (
        <>
          {/* quầng sáng màu — blur mạnh thành GLOW mềm, không thành hình rõ */}
          <div
            className="absolute -right-16 top-[6%] h-56 w-56 rounded-full opacity-30"
            style={{ background: "#ff9ad5", filter: "blur(70px)" }}
          />
          <div
            className="absolute -left-20 top-[46%] h-64 w-64 rounded-full opacity-25"
            style={{ background: "#7df0c8", filter: "blur(80px)" }}
          />
          <div
            className="absolute -right-12 bottom-[8%] h-48 w-48 rounded-full opacity-25"
            style={{ background: "#c4b5ff", filter: "blur(70px)" }}
          />
        </>
      )}

      {theme === "cozy" && (
        <>
          <div className="absolute -right-8 top-[10%] h-24 w-24 rounded-full opacity-[0.16]" style={{ background: "#ffb020" }} />
          <div
            className="absolute -left-9 bottom-[16%] h-24 w-24 rounded-full opacity-[0.14]"
            style={{ border: "15px solid #00c48c" }}
          />
        </>
      )}

      {theme === "dreamy" && (
        <>
          {[
            { top: "6%", right: "-3%", s: 108, c: "#c084fc", o: 0.12 },
            { top: "38%", left: "-5%", s: 92, c: "#e9d5ff", o: 0.35 },
            { bottom: "12%", right: "6%", s: 76, c: "#f0abfc", o: 0.14 },
          ].map((m, i) => (
            <div
              key={i}
              className="absolute"
              style={{ ...m, width: m.s, height: m.s, background: m.c, opacity: m.o, borderRadius: "24%" } as React.CSSProperties}
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
        </>
      )}
    </div>
  );
}
