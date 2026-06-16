"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconCrest, IconFlame } from "./icons";
import SoundToggle from "./SoundToggle";
import { getProgress } from "@/lib/progress";

export default function TopBar() {
  const [streak, setStreak] = useState(0);
  useEffect(() => setStreak(getProgress().streak), []);

  return (
    <header className="sticky top-0 z-30 bg-ink/70 backdrop-blur-xl">
      <div className="app-frame flex items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <IconCrest className="h-6 w-6 text-gold-400" />
          <span className="font-display text-xl font-semibold tracking-wide gold-text">LearnWatch</span>
        </Link>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <span className="flex items-center gap-1 rounded-full border border-hairline px-2.5 py-1 text-xs font-semibold text-gold-300">
              <IconFlame className="h-3.5 w-3.5" />
              {streak}
            </span>
          )}
          <SoundToggle />
        </div>
      </div>
    </header>
  );
}
