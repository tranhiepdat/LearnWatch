"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconFlame, IconGem } from "./icons";
import SoundToggle from "./SoundToggle";
import ThemeSwitcher from "./ThemeSwitcher";
import { getProgress, levelFromXp } from "@/lib/progress";

/**
 * Thanh trên: nhận diện app + XP/streak CẬP NHẬT SỐNG (lắng nghe sự kiện
 * lw:progress — cộng XP ở bất kỳ đâu là số nhảy ngay, kèm nhún).
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

  const lv = levelFromXp(xp);

  return (
    <header className="z-30 shrink-0 bg-ink/70 backdrop-blur-xl">
      <div className="app-frame flex items-center justify-between gap-2 px-5 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="whitespace-nowrap font-display text-sm font-extrabold gold-text">LearnWatch</span>
          <span className="whitespace-nowrap rounded-[var(--r-full)] border border-hairline px-2 py-0.5 text-[10px] font-bold text-taupe">
            Lv.{lv.level}
            <span className="hidden sm:inline"> · {lv.name}</span>
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={bump}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.22, 1] }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center gap-1 rounded-[var(--r-sm)] border border-hairline px-2.5 py-1 text-xs font-semibold text-gold-300"
            >
              <IconGem className="h-3.5 w-3.5" />
              <span className="font-tech">{xp}</span>
            </motion.span>
          </AnimatePresence>
          {streak > 0 && (
            <span className="flex items-center gap-1 rounded-[var(--r-sm)] border border-hairline px-2.5 py-1 text-xs font-semibold text-gold-300">
              <IconFlame className="flame-beat h-3.5 w-3.5" />
              {streak}
            </span>
          )}
          <ThemeSwitcher />
          <SoundToggle />
        </div>
      </div>
    </header>
  );
}
