"use client";

import { useEffect, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useTheme } from "@/lib/theme";

/**
 * ARTWORK NỀN theo theme — không còn nền trơn nhiều chữ:
 *  · game   — wireframe neon (tam giác/vòng/chữ thập) trôi + scanline
 *  · apple  — quả cầu kính + tia sáng xuyên (glassmorphism)
 *  · cozy   — khối MÀU ĐẶC (bi, bánh donut, chữ thập) xoay nhún + sao
 *  · dreamy — khảm gương lilac phập phồng như poster mosaic
 *  · studio — nón 3D + bi cam/lime + KHUNG CHỌN design-tool (theo ref)
 * Tất cả lớp đều PARALLAX theo con trỏ/ngón tay — nền "sống" và reactive.
 */

function useParallax() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 55, damping: 18, mass: 0.6 });
  useEffect(() => {
    function onMove(e: PointerEvent) {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);
  return { sx, sy };
}

/** Lớp trôi theo con trỏ — depth càng lớn càng "gần mắt", di chuyển càng nhiều */
function Layer({
  sx,
  sy,
  depth,
  className = "",
  style,
  children,
}: {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  depth: number;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const x = useTransform(sx, (v) => v * depth);
  const y = useTransform(sy, (v) => v * depth * 0.7);
  return (
    <motion.div className={`absolute ${className}`} style={{ ...style, x, y }}>
      {children}
    </motion.div>
  );
}

/* ============ STUDIO: cảnh 3D design-tool (theo ref) ============ */
function Cone({ size = 190 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.06} viewBox="0 0 100 106" fill="none">
      <defs>
        <linearGradient id="coneg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3ddb84" />
          <stop offset="55%" stopColor="#1e9c58" />
          <stop offset="100%" stopColor="#0c6136" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="98" rx="40" ry="7" fill="#031b10" opacity="0.55" />
      <path d="M50 4 L88 90 Q50 103 12 90 Z" fill="url(#coneg)" />
      <path d="M50 4 L88 90 Q69 96.5 50 97.5 Z" fill="#0a5530" opacity="0.35" />
    </svg>
  );
}

function Sphere({ size, from, mid, to }: { size: number; from: string; mid: string; to: string }) {
  return (
    <div
      className="rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 32% 28%, ${from} 0%, ${mid} 48%, ${to} 100%)`,
        boxShadow: "0 18px 30px -12px rgba(0,0,0,0.5)",
      }}
    />
  );
}

/** khung chọn design-tool: viền + 4 chấm handle trắng */
function SelectFrame({ children, rotate = 8 }: { children: ReactNode; rotate?: number }) {
  const handle = "absolute h-[7px] w-[7px] bg-white shadow-sm";
  return (
    <div className="relative p-3" style={{ transform: `rotate(${rotate}deg)` }}>
      <div className="absolute inset-0 border-[1.5px] border-white/85" />
      <span className={`${handle} -left-[3px] -top-[3px]`} />
      <span className={`${handle} -right-[3px] -top-[3px]`} />
      <span className={`${handle} -left-[3px] -bottom-[3px]`} />
      <span className={`${handle} -right-[3px] -bottom-[3px]`} />
      {children}
    </div>
  );
}

function StudioScene({ sx, sy }: { sx: MotionValue<number>; sy: MotionValue<number> }) {
  return (
    <>
      <Layer sx={sx} sy={sy} depth={10} className="left-[-34px] top-[16%] opacity-70" style={{ zIndex: 0 }}>
        <div className="decor-float" style={{ "--dur": "11s", "--rot0": "-6deg", "--rot1": "3deg", "--dy": "-16px" } as React.CSSProperties}>
          <Cone />
        </div>
      </Layer>
      <Layer sx={sx} sy={sy} depth={22} className="right-[12%] top-[12%] opacity-80">
        <div className="decor-float" style={{ "--dur": "8s", "--dy": "-20px" } as React.CSSProperties}>
          <Sphere size={56} from="#ffc4a3" mid="#ff8a5c" to="#b34c22" />
        </div>
      </Layer>
      <Layer sx={sx} sy={sy} depth={30} className="bottom-[15%] right-[6%] opacity-90">
        <div className="decor-float" style={{ "--dur": "10s", "--dy": "-14px", "--rot0": "-3deg", "--rot1": "5deg" } as React.CSSProperties}>
          <SelectFrame>
            <Sphere size={86} from="#f3ffb8" mid="#d3ee4e" to="#8aa621" />
          </SelectFrame>
        </div>
      </Layer>
      {/* ngoặc crop lớn mờ giữa nền */}
      <Layer sx={sx} sy={sy} depth={6} className="left-[10%] top-[42%] opacity-25">
        <div className="h-40 w-56 border-[1.5px] border-white/60 [border-image:none]"
          style={{ clipPath: "polygon(0 0, 22px 0, 22px 1.5px, 1.5px 1.5px, 1.5px 22px, 0 22px, 0 0)" }} />
      </Layer>
      <Layer sx={sx} sy={sy} depth={16} className="left-[16%] bottom-[10%] opacity-60">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" className="decor-spin" style={{ "--dur": "14s" } as React.CSSProperties}>
          <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2z" />
        </svg>
      </Layer>
    </>
  );
}

/* ============ GAME: wireframe neon trôi ============ */
function GameScene({ sx, sy }: { sx: MotionValue<number>; sy: MotionValue<number> }) {
  return (
    <>
      <Layer sx={sx} sy={sy} depth={18} className="left-[6%] top-[14%] opacity-30">
        <svg width="70" height="70" viewBox="0 0 100 100" className="decor-float" style={{ "--dur": "9s", "--rot0": "-8deg", "--rot1": "10deg" } as React.CSSProperties}>
          <path d="M50 8 L92 86 H8 Z" fill="none" stroke="#00d9ff" strokeWidth="2.5" />
        </svg>
      </Layer>
      <Layer sx={sx} sy={sy} depth={28} className="right-[8%] top-[24%] opacity-30">
        <svg width="56" height="56" viewBox="0 0 100 100" className="decor-spin" style={{ "--dur": "22s" } as React.CSSProperties}>
          <circle cx="50" cy="50" r="40" fill="none" stroke="#ff4d9a" strokeWidth="2.5" strokeDasharray="14 10" />
        </svg>
      </Layer>
      <Layer sx={sx} sy={sy} depth={12} className="bottom-[18%] right-[16%] opacity-25">
        <svg width="44" height="44" viewBox="0 0 100 100" className="decor-float" style={{ "--dur": "7s", "--dy": "-18px" } as React.CSSProperties}>
          <path d="M50 12 V88 M12 50 H88" stroke="#a3f553" strokeWidth="3" />
        </svg>
      </Layer>
      <Layer sx={sx} sy={sy} depth={22} className="left-[14%] bottom-[10%] opacity-25">
        <svg width="52" height="52" viewBox="0 0 100 100" className="decor-spin" style={{ "--dur": "18s" } as React.CSSProperties}>
          <rect x="18" y="18" width="64" height="64" fill="none" stroke="#8a5cff" strokeWidth="2.5" transform="rotate(20 50 50)" />
        </svg>
      </Layer>
      <div aria-hidden className="scanline" />
    </>
  );
}

/* ============ GLASS: quả cầu kính + tia sáng ============ */
function GlassOrb({ size }: { size: number }) {
  return (
    <div
      className="rounded-full"
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 32% 26%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.18) 42%, rgba(255,255,255,0.05) 100%)",
        border: "1px solid rgba(255,255,255,0.45)",
        boxShadow: "inset 0 -10px 24px rgba(255,255,255,0.25), 0 16px 34px -14px rgba(20,40,120,0.5)",
        backdropFilter: "blur(3px)",
      }}
    />
  );
}
function GlassScene({ sx, sy }: { sx: MotionValue<number>; sy: MotionValue<number> }) {
  return (
    <>
      <Layer sx={sx} sy={sy} depth={20} className="right-[8%] top-[12%] opacity-90">
        <div className="decor-float" style={{ "--dur": "9s", "--dy": "-24px" } as React.CSSProperties}>
          <GlassOrb size={92} />
        </div>
      </Layer>
      <Layer sx={sx} sy={sy} depth={12} className="left-[4%] top-[34%] opacity-70">
        <div className="decor-float" style={{ "--dur": "12s", "--dy": "-16px" } as React.CSSProperties}>
          <GlassOrb size={58} />
        </div>
      </Layer>
      <Layer sx={sx} sy={sy} depth={28} className="bottom-[14%] right-[20%] opacity-80">
        <div className="decor-float" style={{ "--dur": "7.5s", "--dy": "-20px" } as React.CSSProperties}>
          <GlassOrb size={40} />
        </div>
      </Layer>
      <div className="glass-beam left-[22%] top-0 h-[46%] w-10 -rotate-[16deg]" />
      <div className="glass-beam right-[30%] top-0 h-[38%] w-6 rotate-[10deg]" style={{ animationDelay: "-2.4s" }} />
    </>
  );
}

/* ============ COZY: khối MÀU ĐẶC vui nhộn ============ */
function CozyScene({ sx, sy }: { sx: MotionValue<number>; sy: MotionValue<number> }) {
  return (
    <>
      {/* bi vàng đặc */}
      <Layer sx={sx} sy={sy} depth={16} className="right-[6%] top-[12%] opacity-[0.32]">
        <div className="decor-float h-20 w-20 rounded-full" style={{ background: "#ffc53d", "--dur": "8s", "--dy": "-18px" } as React.CSSProperties} />
      </Layer>
      {/* bánh donut mint */}
      <Layer sx={sx} sy={sy} depth={24} className="left-[4%] top-[30%] opacity-[0.3]">
        <div
          className="decor-spin h-24 w-24 rounded-full"
          style={{ border: "16px solid #00c48c", "--dur": "30s" } as React.CSSProperties}
        />
      </Layer>
      {/* nửa vầng trăng nho */}
      <Layer sx={sx} sy={sy} depth={12} className="bottom-[20%] right-[14%] opacity-[0.28]">
        <div className="decor-float h-20 w-20 rounded-t-full" style={{ background: "#8b5cf6", "--dur": "10s", "--rot0": "-8deg", "--rot1": "6deg" } as React.CSSProperties} />
      </Layer>
      {/* chữ thập coral */}
      <Layer sx={sx} sy={sy} depth={30} className="left-[16%] bottom-[10%] opacity-[0.3]">
        <svg width="52" height="52" viewBox="0 0 100 100" className="decor-spin" style={{ "--dur": "20s" } as React.CSSProperties}>
          <path d="M38 8 h24 v30 h30 v24 h-30 v30 h-24 v-30 H8 v-24 h30 Z" fill="#ff5e3a" />
        </svg>
      </Layer>
      {[
        { top: "14%", left: "12%", s: 12, d: "0s", c: "#ffb63d" },
        { top: "48%", left: "84%", s: 10, d: "-1.4s", c: "#ff5e3a" },
        { top: "72%", left: "8%", s: 11, d: "-2.2s", c: "#00c48c" },
      ].map((st, i) => (
        <svg key={i} className="cozy-star" style={{ top: st.top, left: st.left, width: st.s, height: st.s, animationDelay: st.d }} viewBox="0 0 24 24" fill={st.c}>
          <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
        </svg>
      ))}
    </>
  );
}

/* ============ DREAMY: khảm gương lilac ============ */
const MOSAIC = [
  { top: "4%", left: "-4%", s: 120, o0: 0.1, o1: 0.3, d: 8 },
  { top: "2%", left: "30%", s: 84, o0: 0.06, o1: 0.2, d: 10 },
  { top: "10%", left: "62%", s: 132, o0: 0.12, o1: 0.34, d: 7 },
  { top: "26%", left: "84%", s: 92, o0: 0.08, o1: 0.26, d: 9 },
  { top: "34%", left: "-6%", s: 100, o0: 0.1, o1: 0.28, d: 11 },
  { top: "46%", left: "22%", s: 74, o0: 0.05, o1: 0.16, d: 8.5 },
  { top: "56%", left: "70%", s: 116, o0: 0.1, o1: 0.3, d: 9.5 },
  { top: "72%", left: "6%", s: 96, o0: 0.09, o1: 0.24, d: 10.5 },
  { top: "80%", left: "44%", s: 80, o0: 0.06, o1: 0.2, d: 7.5 },
  { top: "78%", left: "82%", s: 104, o0: 0.1, o1: 0.28, d: 8 },
];
const MOSAIC_COLORS = ["#c084fc", "#a855f7", "#d8b4fe", "#e9d5ff", "#f0abfc"];
function DreamyScene({ sx, sy }: { sx: MotionValue<number>; sy: MotionValue<number> }) {
  return (
    <>
      {MOSAIC.map((m, i) => (
        <Layer key={i} sx={sx} sy={sy} depth={6 + (i % 4) * 7} className="" style={{ top: m.top, left: m.left }}>
          <div
            className="mosaic-cell"
            style={{
              position: "relative",
              width: m.s,
              height: m.s,
              background: MOSAIC_COLORS[i % MOSAIC_COLORS.length],
              "--dur": `${m.d}s`,
              "--o0": m.o0,
              "--o1": m.o1,
              animationDelay: `${-i * 1.3}s`,
              filter: "blur(0.5px)",
            } as React.CSSProperties}
          />
        </Layer>
      ))}
    </>
  );
}

export default function ThemeDecor() {
  const { theme } = useTheme();
  const { sx, sy } = useParallax();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {theme === "game" && <GameScene sx={sx} sy={sy} />}
      {theme === "apple" && <GlassScene sx={sx} sy={sy} />}
      {theme === "cozy" && <CozyScene sx={sx} sy={sy} />}
      {theme === "dreamy" && <DreamyScene sx={sx} sy={sy} />}
      {theme === "studio" && <StudioScene sx={sx} sy={sy} />}
    </div>
  );
}
