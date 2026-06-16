"use client";

import { motion } from "framer-motion";

const RAYS = 18;
const rays = Array.from({ length: RAYS }).map((_, i) => {
  const a = (i / RAYS) * Math.PI * 2;
  return { x: Math.cos(a), y: Math.sin(a), big: i % 3 === 0 };
});

const FLAKES = 14;
const flakes = Array.from({ length: FLAKES }).map((_, i) => ({
  x: (Math.random() * 2 - 1) * 150,
  y: -40 - Math.random() * 120,
  r: Math.random() * 360,
  d: 0.5 + Math.random() * 0.4,
  delay: Math.random() * 0.08,
}));

/** Hieu ung "bung vang" khi chon dung. Doi `trigger` (key) de phat lai. */
export default function GoldBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center overflow-hidden">
      {/* vong song vang */}
      <motion.div
        initial={{ scale: 0, opacity: 0.7 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute h-28 w-28 rounded-full border-2 border-gold-300"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 3.4, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
        className="absolute h-28 w-28 rounded-full border border-gold-400/60"
      />
      {/* tia vang */}
      {rays.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x * (p.big ? 150 : 110), y: p.y * (p.big ? 150 : 110), opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`absolute rounded-full bg-gold-300 shadow-glow ${p.big ? "h-2.5 w-2.5" : "h-1.5 w-1.5"}`}
        />
      ))}
      {/* vay vang roi */}
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
