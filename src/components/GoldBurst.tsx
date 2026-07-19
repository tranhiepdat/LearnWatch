"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

/**
 * Bùng nổ khoảnh khắc thưởng — mỗi theme một chất liệu:
 *  · game   — flash neon + tia cyan + mảnh magenta (arcade)
 *  · apple  — vòng kính khúc xạ + giọt sáng băng
 *  · cozy   — confetti kẹo bơ (sao/tim caramel) rơi mềm
 *  · dreamy — cánh ngọc iridescent + bokeh trôi lên
 *  · studio — hình khối vector + khung chọn flash
 * Mảnh nhỏ chỉ xoay ≤160° và bay quãng ngắn — sống động nhưng không chóng mặt.
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

const DREAM_TILES = ["#b78cfa", "#f086c8", "#8ec5ff", "#e9d5ff", "#ffd9ae"];
const STUDIO_SHAPES = ["#4ade87", "#ff8a5c", "#d9f99d", "#ffffff"];
const GAME_FLAKES = ["#41f0ff", "#ff3df0", "#ffe14d", "#8a5cff"];

const rr = (a: number, b: number) => a + Math.random() * (b - a);

export default function GoldBurst({ small = false }: { small?: boolean }) {
  const { theme } = useTheme();

  if (theme === "dreamy") {
    const N = small ? 7 : 14;
    const tiles = Array.from({ length: N }).map((_, i) => ({
      c: DREAM_TILES[i % DREAM_TILES.length],
      x: rr(-1, 1) * (small ? 76 : 140),
      y: -(20 + Math.random() * (small ? 76 : 130)),
      r: rr(-90, 90),
      d: 0.9 + Math.random() * 0.45,
      delay: Math.random() * 0.12,
      size: small ? 8 + Math.random() * 6 : 10 + Math.random() * 9,
    }));
    return (
      <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center overflow-hidden">
        <motion.div
          initial={{ scale: 0.2, opacity: 0.5 }}
          animate={{ scale: small ? 1.6 : 2.4, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`absolute rounded-full bg-gold-400/30 blur-2xl ${small ? "h-20 w-20" : "h-32 w-32"}`}
        />
        {tiles.map((b, i) => (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.3 }}
            animate={{ x: b.x, y: b.y, opacity: [0, 0.95, 0], rotate: b.r, scale: [0.3, 1, 0.85] }}
            transition={{ duration: b.d, ease: [0.16, 0.7, 0.3, 1], delay: b.delay, times: [0, 0.4, 1] }}
            className="absolute"
            style={{ width: b.size, height: b.size, borderRadius: i % 3 === 0 ? "9999px" : "30%", background: b.c }}
          />
        ))}
      </div>
    );
  }

  if (theme === "studio") {
    const N = small ? 8 : 15;
    const shapes = Array.from({ length: N }).map((_, i) => ({
      c: STUDIO_SHAPES[i % STUDIO_SHAPES.length],
      kind: i % 3, // 0 tam giác, 1 bi, 2 vuông
      x: rr(-1, 1) * (small ? 84 : 150),
      y: rr(-1, 1) * (small ? 64 : 110) - 28,
      r: rr(-140, 140),
      d: 0.5 + Math.random() * 0.3,
      delay: Math.random() * 0.08,
      size: small ? 7 + Math.random() * 5 : 9 + Math.random() * 8,
    }));
    return (
      <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center overflow-hidden">
        {/* khung chọn flash quanh tâm */}
        <motion.div
          initial={{ scale: 0.4, opacity: 1 }}
          animate={{ scale: small ? 1.5 : 2.1, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute border-[1.5px] border-white/90 ${small ? "h-16 w-16" : "h-24 w-24"}`}
        >
          {["-left-[3px] -top-[3px]", "-right-[3px] -top-[3px]", "-left-[3px] -bottom-[3px]", "-right-[3px] -bottom-[3px]"].map(
            (pos) => (
              <span key={pos} className={`absolute h-[6px] w-[6px] bg-white ${pos}`} />
            ),
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0.45, scale: 0.2 }}
          animate={{ opacity: 0, scale: small ? 1.6 : 2.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`absolute rounded-full bg-gold-300 blur-2xl ${small ? "h-20 w-20" : "h-32 w-32"}`}
        />
        {shapes.map((s, i) => (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{ x: s.x, y: s.y, opacity: 0, rotate: s.r, scale: 0.4 }}
            transition={{ duration: s.d, ease: "easeOut", delay: s.delay }}
            className="absolute"
            style={
              s.kind === 0
                ? { width: 0, height: 0, borderLeft: `${s.size / 2}px solid transparent`, borderRight: `${s.size / 2}px solid transparent`, borderBottom: `${s.size}px solid ${s.c}` }
                : { width: s.size, height: s.size, background: s.c, borderRadius: s.kind === 1 ? "9999px" : "2px" }
            }
          />
        ))}
      </div>
    );
  }

  if (theme === "apple") {
    return (
      <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0.35, scale: 0.3 }}
          animate={{ opacity: 0, scale: small ? 1.4 : 2 }}
          transition={{ duration: 0.5, ease: [0.3, 0.7, 0.3, 1] }}
          className={`absolute rounded-full bg-white blur-2xl ${small ? "h-16 w-16" : "h-28 w-28"}`}
        />
        {[0, 0.12].map((d, k) => (
          <motion.div
            key={k}
            initial={{ scale: 0.2, opacity: 0.6 }}
            animate={{ scale: small ? 1.6 : 2.4, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.3, 0.7, 0.3, 1], delay: d }}
            className={`absolute rounded-full border border-white/80 ${small ? "h-14 w-14" : "h-24 w-24"}`}
          />
        ))}
        {!small &&
          Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
                animate={{ x: Math.cos(a) * 72, y: Math.sin(a) * 72 - 14, opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute h-1.5 w-1.5 rounded-full bg-white"
              />
            );
          })}
      </div>
    );
  }

  if (theme === "cozy") {
    const N = small ? 8 : 16;
    const bits = Array.from({ length: N }).map((_, i) => ({
      g: COZY_GLYPHS[i % COZY_GLYPHS.length],
      x: rr(-1, 1) * (small ? 84 : 150),
      y: -(30 + Math.random() * (small ? 84 : 140)),
      fall: 55 + Math.random() * 70,
      r: rr(-160, 160),
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

  // ===== GAME (NEON arcade) =====
  const RAYS = small ? 10 : 16;
  const reach = small ? 74 : 122;
  const rays = Array.from({ length: RAYS }).map((_, i) => {
    const a = (i / RAYS) * Math.PI * 2;
    return { x: Math.cos(a), y: Math.sin(a), big: i % 3 === 0 };
  });
  const flakes = small
    ? []
    : Array.from({ length: 14 }).map((_, i) => ({
        c: GAME_FLAKES[i % GAME_FLAKES.length],
        x: rr(-1, 1) * 140,
        y: -36 - Math.random() * 110,
        r: rr(-150, 150),
        d: 0.5 + Math.random() * 0.35,
        delay: Math.random() * 0.08,
      }));

  return (
    <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center overflow-hidden">
      {/* flash neon trung tâm */}
      <motion.div
        initial={{ opacity: small ? 0.4 : 0.55, scale: 0.2 }}
        animate={{ opacity: 0, scale: small ? 1.6 : 2.3 }}
        transition={{ duration: small ? 0.35 : 0.45, ease: "easeOut" }}
        className={`absolute rounded-full bg-gold-300 blur-2xl ${small ? "h-20 w-20" : "h-36 w-36"}`}
      />
      {/* vòng sóng cyan + vòng magenta lệch pha — chất "chromatic" arcade */}
      <motion.div
        initial={{ scale: 0, opacity: 0.7 }}
        animate={{ scale: small ? 1.8 : 2.6, opacity: 0 }}
        transition={{ duration: small ? 0.45 : 0.6, ease: "easeOut" }}
        className={`absolute rounded-full border-2 border-gold-300 ${small ? "h-16 w-16" : "h-28 w-28"}`}
      />
      {!small && (
        <motion.div
          initial={{ scale: 0.1, opacity: 0.5 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.06 }}
          className="absolute h-28 w-28 rounded-full border border-[#ff3df0]"
        />
      )}
      {/* tia */}
      {rays.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x * (p.big ? reach + 18 : reach), y: p.y * (p.big ? reach + 18 : reach), opacity: 0, scale: 0.3 }}
          transition={{ duration: small ? 0.5 : 0.68, ease: "easeOut" }}
          className={`absolute rounded-full shadow-glow ${p.big ? "h-2.5 w-2.5 bg-gold-300" : "h-1.5 w-1.5 bg-gold-100"}`}
        />
      ))}
      {/* vảy neon rơi (chỉ bản lớn) */}
      {flakes.map((f, i) => (
        <motion.span
          key={`f${i}`}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: f.x, y: f.y, opacity: 0, rotate: f.r }}
          transition={{ duration: f.d, ease: "easeOut", delay: f.delay }}
          className="absolute h-2.5 w-1 rounded-[1px]"
          style={{ background: f.c }}
        />
      ))}
    </div>
  );
}
