"use client";

import { motion } from "framer-motion";

/** Hiệu ứng "bùng" particle. `small` = bản nhẹ cho lật thẻ; mặc định = bản lớn khi trả lời đúng. */
export default function GoldBurst({ small = false }: { small?: boolean }) {
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
