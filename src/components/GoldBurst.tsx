"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

/**
 * Bùng nổ khoảnh khắc thưởng — mỗi theme một chất liệu:
 *  · cozy — confetti kẹo bơ (sao/tim caramel) POP rồi rơi mềm
 *  · game — SHAPE HIGHLIGHT: hình khối OUTLINE mảnh (vuông/tròn/chữ thập)
 *           nở ra từ tâm + khung vuông tự vẽ — đúng chất motion graphic
 *  · lux  — bụi champagne & tia vàng mảnh, tiết chế quý phái
 * Mảnh nhỏ xoay tối đa ~140° và bay quãng ngắn — sống động, không chóng mặt.
 * `small` = bản nhẹ (lật thẻ / vuốt trái).
 */

const COZY_GLYPHS = [
  { ch: "✦", c: "#ffb84d" },
  { ch: "★", c: "#ef9b3f" },
  { ch: "♥", c: "#d95d55" },
  { ch: "●", c: "#6fae7f" },
  { ch: "✿", c: "#e8b04b" },
  { ch: "▲", c: "#c47118" },
];

const rr = (a: number, b: number) => a + Math.random() * (b - a);

export default function GoldBurst({ small = false }: { small?: boolean }) {
  const { theme } = useTheme();

  if (theme === "cozy") {
    const N = small ? 8 : 16;
    const bits = Array.from({ length: N }).map((_, i) => ({
      g: COZY_GLYPHS[i % COZY_GLYPHS.length],
      x: rr(-1, 1) * (small ? 84 : 150),
      y: -(30 + Math.random() * (small ? 84 : 140)),
      fall: 55 + Math.random() * 70,
      r: rr(-140, 140),
      d: 0.7 + Math.random() * 0.4,
      delay: Math.random() * 0.1,
      size: small ? 12 + Math.random() * 6 : 14 + Math.random() * 10,
    }));
    return (
      <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center overflow-hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: small ? 1.5 : 2.2, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute rounded-[45%_55%_60%_40%/55%_45%_55%_45%] bg-gold-foil blur-xl ${small ? "h-20 w-20" : "h-32 w-32"}`}
        />
        {bits.map((b, i) => (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
            animate={{
              x: b.x,
              y: [0, b.y, b.y + b.fall],
              opacity: [1, 1, 0],
              rotate: b.r,
              scale: [0.4, 1.15, 0.9],
            }}
            transition={{ duration: b.d, ease: [0.22, 0.9, 0.36, 1], delay: b.delay, times: [0, 0.55, 1] }}
            className="absolute font-bold"
            style={{ color: b.g.c, fontSize: b.size, lineHeight: 1 }}
          >
            {b.g.ch}
          </motion.span>
        ))}
      </div>
    );
  }

  if (theme === "lux") {
    const N = small ? 8 : 14;
    const dust = Array.from({ length: N }).map(() => ({
      x: rr(-1, 1) * (small ? 70 : 130),
      y: -(16 + Math.random() * (small ? 70 : 120)),
      d: 0.8 + Math.random() * 0.5,
      delay: Math.random() * 0.15,
      size: 2.5 + Math.random() * 3.5,
    }));
    const RAYS = small ? 6 : 10;
    return (
      <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center overflow-hidden">
        {/* quầng champagne mềm */}
        <motion.div
          initial={{ opacity: 0.4, scale: 0.25 }}
          animate={{ opacity: 0, scale: small ? 1.5 : 2.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`absolute rounded-full bg-gold-400/60 blur-2xl ${small ? "h-16 w-16" : "h-28 w-28"}`}
        />
        {/* vòng hairline vàng nở ra */}
        <motion.div
          initial={{ scale: 0.25, opacity: 0.8 }}
          animate={{ scale: small ? 1.7 : 2.5, opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.25, 0.8, 0.25, 1] }}
          className={`absolute rounded-full border border-gold-400/80 ${small ? "h-14 w-14" : "h-24 w-24"}`}
        />
        {/* tia kim mảnh */}
        {Array.from({ length: RAYS }).map((_, i) => {
          const a = (i / RAYS) * Math.PI * 2;
          const reach = small ? 62 : 104;
          return (
            <motion.span
              key={i}
              initial={{ x: 0, y: 0, opacity: 0.9, scaleY: 1 }}
              animate={{ x: Math.cos(a) * reach, y: Math.sin(a) * reach, opacity: 0, scaleY: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute h-[9px] w-px bg-gold-300"
              style={{ rotate: `${(a * 180) / Math.PI + 90}deg` }}
            />
          );
        })}
        {/* bụi champagne lơ lửng bay lên */}
        {dust.map((p, i) => (
          <motion.span
            key={`d${i}`}
            initial={{ x: 0, y: 6, opacity: 0, scale: 0.4 }}
            animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: [0.4, 1, 0.7] }}
            transition={{ duration: p.d, ease: [0.2, 0.7, 0.3, 1], delay: p.delay, times: [0, 0.35, 1] }}
            className="absolute rounded-full bg-gold-100"
            style={{ width: p.size, height: p.size, boxShadow: "0 0 6px rgb(var(--c-accent) / 0.8)" }}
          />
        ))}
      </div>
    );
  }

  // ===== GAME (digital: shape highlight — outline mảnh nở từ tâm) =====
  const N = small ? 7 : 12;
  const KINDS = ["square", "circle", "plus", "dot"] as const;
  const shapes = Array.from({ length: N }).map((_, i) => ({
    kind: KINDS[i % KINDS.length],
    x: rr(-1, 1) * (small ? 80 : 145),
    y: rr(-1, 1) * (small ? 62 : 110),
    r: rr(-90, 90),
    d: 0.45 + Math.random() * 0.3,
    delay: Math.random() * 0.08,
    size: small ? 6 + Math.random() * 5 : 8 + Math.random() * 8,
    c: i % 3 === 0 ? "#ffffff" : "#35e0ff",
  }));

  return (
    <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center overflow-hidden">
      {/* khung vuông tự vẽ quanh tâm (line reveal) */}
      <motion.div
        initial={{ scale: 0.4, opacity: 1 }}
        animate={{ scale: small ? 1.4 : 2, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
        className={`absolute border border-gold-400 ${small ? "h-14 w-14" : "h-24 w-24"}`}
      >
        <span className="absolute -left-px -top-px h-[6px] w-[6px] border-l border-t border-white" />
        <span className="absolute -right-px -top-px h-[6px] w-[6px] border-r border-t border-white" />
        <span className="absolute -bottom-px -left-px h-[6px] w-[6px] border-b border-l border-white" />
        <span className="absolute -bottom-px -right-px h-[6px] w-[6px] border-b border-r border-white" />
      </motion.div>
      {/* flash lõi nhỏ, sắc */}
      <motion.div
        initial={{ opacity: 0.5, scale: 0.2 }}
        animate={{ opacity: 0, scale: small ? 1.2 : 1.7 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`absolute bg-gold-300 blur-xl ${small ? "h-14 w-14" : "h-24 w-24"}`}
      />
      {/* hình khối outline văng ra */}
      {shapes.map((s, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.5 }}
          animate={{ x: s.x, y: s.y, opacity: 0, rotate: s.r, scale: 1 }}
          transition={{ duration: s.d, ease: [0.2, 0.8, 0.3, 1], delay: s.delay }}
          className="absolute grid place-items-center"
          style={{ width: s.size, height: s.size }}
        >
          {s.kind === "square" && <span className="h-full w-full border" style={{ borderColor: s.c }} />}
          {s.kind === "circle" && <span className="h-full w-full rounded-full border" style={{ borderColor: s.c }} />}
          {s.kind === "dot" && <span className="h-[45%] w-[45%]" style={{ background: s.c }} />}
          {s.kind === "plus" && (
            <>
              <span className="absolute h-full w-px" style={{ background: s.c }} />
              <span className="absolute h-px w-full" style={{ background: s.c }} />
            </>
          )}
        </motion.span>
      ))}
    </div>
  );
}
