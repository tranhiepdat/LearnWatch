"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

/**
 * Chuyển trang = 2 lớp: (1) nội dung vào theo "tính cách" theme,
 * (2) LỚP QUÉT phủ màn riêng từng theme — không còn na ná nhau:
 *  · game   — 2 thanh neon cyan/magenta quét chéo lệch pha + chớp nền
 *  · apple  — vệt sáng kính to bản quét chéo qua màn (lens flare)
 *  · cozy   — 3 viên kẹo màu đặc NẢY ngang qua màn như bóng rơi
 *  · dreamy — màn sương lilac phủ rồi tan + 3 ô khảm rơi chậm
 *  · studio — khung chọn VẼ quanh viewport (4 cạnh + 4 handle) rồi nhả
 */

function GameSweep() {
  return (
    <>
      <motion.div
        initial={{ x: "-120%", opacity: 1 }}
        animate={{ x: "120vw", opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.3, 1] }}
        className="fixed top-[18%] h-[3px] w-[70vw] -skew-x-[24deg] bg-[#00d9ff]"
        style={{ boxShadow: "0 0 18px 2px rgba(0,217,255,0.9)" }}
      />
      <motion.div
        initial={{ x: "-140%", opacity: 1 }}
        animate={{ x: "130vw", opacity: 0 }}
        transition={{ duration: 0.55, delay: 0.07, ease: [0.2, 0.8, 0.3, 1] }}
        className="fixed top-[64%] h-[2px] w-[52vw] -skew-x-[24deg] bg-[#ff4d9a]"
        style={{ boxShadow: "0 0 14px 2px rgba(255,77,154,0.8)" }}
      />
      <motion.div
        initial={{ opacity: 0.22 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-[#00d9ff] mix-blend-plus-lighter"
      />
    </>
  );
}

function GlassSweep() {
  return (
    <motion.div
      initial={{ x: "-150%" }}
      animate={{ x: "180vw" }}
      transition={{ duration: 0.7, ease: [0.3, 0.6, 0.25, 1] }}
      className="fixed -top-[20%] h-[140vh] w-[34vw] -rotate-[18deg] bg-gradient-to-r from-transparent via-white/45 to-transparent blur-2xl"
    />
  );
}

function CozySweep() {
  const balls = [
    { c: "#ff5e3a", d: 0, s: 22 },
    { c: "#ffb020", d: 0.08, s: 16 },
    { c: "#00c48c", d: 0.16, s: 12 },
  ];
  return (
    <>
      {balls.map((b, i) => (
        <motion.div
          key={i}
          initial={{ x: "-12vw", y: 0, opacity: 1 }}
          animate={{ x: "112vw", y: [0, -46, 0, -22, 0, -9, 0], opacity: [1, 1, 1, 0.9, 0] }}
          transition={{ duration: 0.9, delay: b.d, ease: "easeOut", y: { duration: 0.9, delay: b.d, ease: "easeOut" } }}
          className="fixed bottom-[22%] rounded-full"
          style={{ width: b.s, height: b.s, background: b.c, boxShadow: `0 4px 0 0 ${b.c}55` }}
        />
      ))}
    </>
  );
}

function DreamySweep() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0.65 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="fixed inset-0 bg-gradient-to-b from-[#e9d5ff] via-[#f0e6ff] to-transparent"
      />
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ y: -60, opacity: 0.9, rotate: 0 }}
          animate={{ y: "30vh", opacity: 0, rotate: 40 }}
          transition={{ duration: 1, delay: i * 0.12, ease: "easeOut" }}
          className="fixed top-0"
          style={{ left: `${22 + i * 26}%`, width: 18 - i * 4, height: 18 - i * 4, borderRadius: "26%", background: "#c084fc" }}
        />
      ))}
    </>
  );
}

function StudioSweep() {
  const line = "fixed bg-white/70";
  const handle = "fixed h-[7px] w-[7px] bg-white";
  return (
    <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.3, delay: 0.42 }}>
      {/* 4 cạnh vẽ vào */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.22, ease: "easeOut" }}
        className={`${line} left-3 right-3 top-2 h-[1.5px] origin-left`} />
      <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.22, delay: 0.1, ease: "easeOut" }}
        className={`${line} bottom-2 right-3 top-2 w-[1.5px] origin-top`} />
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.22, delay: 0.2, ease: "easeOut" }}
        className={`${line} bottom-2 left-3 right-3 h-[1.5px] origin-right`} />
      <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.22, delay: 0.3, ease: "easeOut" }}
        className={`${line} bottom-2 left-3 top-2 w-[1.5px] origin-bottom`} />
      {/* 4 handle pop */}
      {[
        "left-[9px] top-[5px]",
        "right-[9px] top-[5px]",
        "left-[9px] bottom-[5px]",
        "right-[9px] bottom-[5px]",
      ].map((pos, i) => (
        <motion.span key={pos} initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.08 + i * 0.09, type: "spring", stiffness: 700, damping: 22 }}
          className={`${handle} ${pos}`} />
      ))}
    </motion.div>
  );
}

const SWEEPS = { game: GameSweep, apple: GlassSweep, cozy: CozySweep, dreamy: DreamySweep, studio: StudioSweep };

export default function Template({ children }: { children: React.ReactNode }) {
  const { theme, meta } = useTheme();
  const pg = meta.motion.page;
  const Sweep = SWEEPS[theme];
  return (
    // key={theme}: đổi theme là REMOUNT — không bị kẹt transform dở dang của
    // theme trước (x/skew/blur đóng băng), và được xem enter-animation mới.
    <div key={theme} className="h-full">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-40">
        <Sweep />
      </div>
      <motion.div
        initial={pg.initial}
        animate={pg.animate}
        transition={pg.transition}
        className="h-full overflow-y-auto overflow-x-hidden px-4 pb-28 pt-1"
      >
        {children}
      </motion.div>
    </div>
  );
}
