"use client";

import { useEffect, useState } from "react";
import { isMuted, setMuted, playTap } from "@/lib/sound";
import { IconSound, IconMute } from "./icons";

export default function SoundToggle() {
  const [m, setM] = useState(false);
  useEffect(() => setM(isMuted()), []);

  return (
    <button
      onClick={() => {
        const nm = !m;
        setMuted(nm);
        setM(nm);
        if (!nm) playTap();
      }}
      aria-label={m ? "Bật âm thanh" : "Tắt âm thanh"}
      className="cyber grid h-9 w-9 place-items-center rounded-[var(--r-sm)] border border-hairline text-gold-300 transition active:scale-90"
    >
      {m ? <IconMute className="h-[18px] w-[18px]" /> : <IconSound className="h-[18px] w-[18px]" />}
    </button>
  );
}
