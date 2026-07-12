"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

const COZY_GLYPHS = [
  { ch: "✦", c: "#ffc53d" },
  { ch: "★", c: "#ff5e3a" },
  { ch: "♥", c: "#ec4899" },
  { ch: "●", c: "#00c48c" },
  { ch: "✿", c: "#8b5cf6" },
  { ch: "▲", c: "#38bdf8" },
];

const DREAM_TILES = ["#c084fc", "#a855f7", "#d8b4fe", "#e9d5ff", "#f0abfc"];
const STUDIO_SHAPES = ["#53e08b", "#ff8a5c", "#d9f99d", "#ffffff"];

/**
 * Bùng nổ khi trả lời đúng / vuốt thẻ — mỗi theme một kiểu:
 *  · game   — flash neon + tia + mảnh vụn (arcade)
 *  · apple  — vòng kính + giọt sáng trắng lơ lửng
 *  · cozy   — MƯA CONFETTI kẹo màu đặc nảy tưng
 *  · dreamy — ô khảm lilac bung ra rồi trôi lên như sương
 *  · studio — HÌNH KHỐI vector (tam giác/bi/vuông) + khung chọn flash
 * `small` = bản nhẹ (lật thẻ / vuốt trái).
 */
export default function GoldBurst({ small = false }: { small?: boolean }) {
  const { theme } = useTheme();

  if (theme === "dreamy") {
    const N = small ? 7 : 14;
    const tiles = Array.from({ length: N }).map((_, i) => ({
      c: DREAM_TILES[i % DREAM_TILES.length],
      x: (Math.random() * 2 - 1) * (small ? 80 : 150),
      y: -(20 + Math.random() * (small ? 80 : 140)),
      r: (Math.random() * 2 - 1) * 200,
      d: 0.9 + Math.random() * 0.5,
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
            style={{ width: b.size, height: b.size, borderRadius: "26%", background: b.c }}
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
      x: (Math.random() * 2 - 1) * (small ? 90 : 160),
      y: (Math.random() * 2 - 1) * (small ? 70 : 120) - 30,
      r: (Math.random() * 2 - 1) * 300,
      d: 0.55 + Math.random() * 0.35,
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
