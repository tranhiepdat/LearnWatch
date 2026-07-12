"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

const COZY_GLYPHS = [
  { ch: "✦", c: "#ffb63d" },
  { ch: "★", c: "#ff8a70" },
  { ch: "♥", c: "#ff5c8a" },
  { ch: "●", c: "#2fbf9b" },
  { ch: "✿", c: "#b983ff" },
  { ch: "▲", c: "#ffd166" },
];

/**
 * Bùng nổ khi trả lời đúng / vuốt thẻ — mỗi theme một kiểu:
 *  · game  — flash neon + tia + mảnh vụn (nguyên bản arcade)
 *  · apple — vòng sóng thanh lịch + vài chấm nhỏ, tối giản
 *  · cozy  — MƯA CONFETTI tim/sao pastel nảy tưng
 * `small` = bản nhẹ (lật thẻ / vuốt trái).
 */
export default function GoldBurst({ small = false }: { small?: boolean }) {
  const { theme } = useTheme();

  if (theme === "apple") {
    return (
      <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0.35, scale: 0.3 }}
          animate={{ opacity: 0, scale: small ? 1.4 : 2 }}
          transition={{ duration: 0.5, ease: [0.3, 0.7, 0.3, 1] }}
          className={`absolute rounded-full bg-gold-400 blur-2xl ${small ? "h-16 w-16" : "h-28 w-28"}`}
        />
        {[0, 0.12].map((d, k) => (
          <motion.div
            key={k}
            initial={{ scale: 0.2, opacity: 0.6 }}
            animate={{ scale: small ? 1.6 : 2.4, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.3, 0.7, 0.3, 1], delay: d }}
            className={`absolute rounded-full border border-gold-400 ${small ? "h-14 w-14" : "h-24 w-24"}`}
          />
        ))}
        {!small &&
          Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
                animate={{ x: Math.cos(a) * 70, y: Math.sin(a) * 70, opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute h-1.5 w-1.5 rounded-full bg-gold-400"
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
      x: (Math.random() * 2 - 1) * (small ? 90 : 160),
      y: -(30 + Math.random() * (small ? 90 : 150)),
      fall: 60 + Math.random() * 80,
      r: (Math.random() * 2 - 1) * 320,
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

  // ===== GAME (arcade neon) =====
  const RAYS = small ? 10 : 18;
  const reach = small ? 78 : 130;
  const rays = Array.from({ length: RAYS }).map((_, i) => {
    const a = (i / RAYS) * Math.PI * 2;
    return { x: Math.cos(a), y: Math.sin(a), big: i % 3 === 0 };
  });
  const flakes = small
    ? []
    : Array.from({ length: 14 }).map(() => ({
        x: (Math.random() * 2 - 1) * 150,
        y: -40 - Math.random() * 120,
        r: Math.random() * 360,
        d: 0.5 + Math.random() * 0.4,
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
      {/* vòng sóng */}
      <motion.div
        initial={{ scale: 0, opacity: 0.7 }}
        animate={{ scale: small ? 1.8 : 2.6, opacity: 0 }}
        transition={{ duration: small ? 0.45 : 0.6, ease: "easeOut" }}
        className={`absolute rounded-full border-2 border-gold-300 ${small ? "h-16 w-16" : "h-28 w-28"}`}
      />
      {/* tia */}
      {rays.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x * (p.big ? reach + 20 : reach), y: p.y * (p.big ? reach + 20 : reach), opacity: 0, scale: 0.3 }}
          transition={{ duration: small ? 0.5 : 0.7, ease: "easeOut" }}
          className={`absolute rounded-full bg-gold-300 shadow-glow ${p.big ? "h-2.5 w-2.5" : "h-1.5 w-1.5"}`}
        />
      ))}
      {/* vảy rơi (chỉ bản lớn) */}
      {flakes.map((f, i) => (
        <motion.span
          key={`f${i}`}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: f.x, y: f.y, opacity: 0, rotate: f.r }}
          transition={{ duration: f.d, ease: "easeOut", delay: f.delay }}
          className="absolute h-2.5 w-1 rounded-[1px] bg-gold-foil"
        />
      ))}
    </div>
  );
}
