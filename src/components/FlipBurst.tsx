"use client";

import { motion } from "framer-motion";

const N = 8;
const rays = Array.from({ length: N }).map((_, i) => {
  const a = (i / N) * Math.PI * 2;
  return { x: Math.cos(a), y: Math.sin(a) };
});

/** Hiệu ứng lật thẻ: khối màu ĐẶC bung từ TÂM ra + lõi sáng + vòng + tia. */
export default function FlipBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center overflow-hidden">
      {/* khoi mau dac tu tam */}
      <motion.div
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: 3.6, opacity: [0.9, 0.7, 0] }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute h-44 w-44 rounded-full bg-gold-400"
      />
      {/* loi sang trang-xanh */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
        className="absolute h-24 w-24 rounded-full bg-gold-100 blur-md"
      />
      {/* vong song */}
      <motion.div
        initial={{ scale: 0.25, opacity: 0.85 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute h-28 w-28 rounded-full border-2 border-gold-200"
      />
      {/* tia */}
      {rays.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x * 130, y: p.y * 130, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="absolute h-2 w-2 rounded-full bg-gold-200 shadow-glow"
        />
      ))}
    </div>
  );
}
