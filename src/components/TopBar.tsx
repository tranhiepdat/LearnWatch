"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconFlame, IconGem } from "./icons";
import SoundToggle from "./SoundToggle";
import ThemeSwitcher from "./ThemeSwitcher";
import { getProgress } from "@/lib/progress";

/**
 * Thanh trên GỌN: logo trái · XP + streak (không viền) · 2 nút icon phải.
 * Level/danh hiệu để ở card tiến độ trang chủ — TopBar không ôm hết.
 */
export default function TopBar() {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    const read = () => {
      const p = getProgress();
      setXp((old) => {
        if (p.xp !== old) setBump((b) => b + 1);
        return p.xp;
      });
      setStreak(p.streak);
    };
    read();
    window.addEventListener("lw:progress", read);
    return () => window.removeEventListener("lw:progress", read);
  }, []);

  return (
    <header className="z-30 shrink-0 bg-ink/70 backdrop-blur-xl">
      <div className="app-frame flex items-center justify-between gap-3 px-5 py-2.5">
        <span className="whitespace-nowrap font-display text-sm font-extrabold gold-text">LearnWatch</span>

        <div className="flex shrink-0 items-center gap-3">
          <motion.span
            key={bump}
            animate={bump > 0 ? { scale: [1, 1.15, 1] } : undefined}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="stat text-gold-300"
          >
            <IconGem className="h-3.5 w-3.5" />
            <span className="font-tech text-xs">{xp}</span>
          </motion.span>
          {streak > 0 && (
            <span className="stat text-gold-300">
              <IconFlame className="h-3.5 w-3.5" />
              <span className="font-tech text-xs">{streak}</span>
            </span>
          )}
          <ThemeSwitcher />
          <SoundToggle />
        </div>
      </div>
    </header>
  );
}
