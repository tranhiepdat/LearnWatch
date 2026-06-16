"use client";

import { useEffect, useState } from "react";
import { IconFlame } from "./icons";
import SoundToggle from "./SoundToggle";
import { getProgress } from "@/lib/progress";

export default function TopBar() {
  const [streak, setStreak] = useState(0);
  useEffect(() => setStreak(getProgress().streak), []);

  return (
    <header className="z-30 shrink-0 bg-ink/70 backdrop-blur-xl">
      <div className="app-frame flex items-center justify-end gap-2 px-5 py-2.5">
        {streak > 0 && (
          <span className="flex items-center gap-1 rounded-full border border-hairline px-2.5 py-1 text-xs font-semibold text-gold-300">
            <IconFlame className="h-3.5 w-3.5" />
            {streak}
          </span>
        )}
        <SoundToggle />
      </div>
    </header>
  );
}
