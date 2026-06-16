"use client";

import { useEffect, useState } from "react";
import { getProgress, type Progress } from "@/lib/progress";
import { IconGem, IconFlame, IconCheck } from "./icons";

export default function ProgressHeader() {
  const [p, setP] = useState<Progress | null>(null);
  useEffect(() => setP(getProgress()), []);

  const items = [
    { Icon: IconGem, v: p?.xp ?? 0, l: "XP" },
    { Icon: IconFlame, v: p?.streak ?? 0, l: "Chuỗi ngày" },
    { Icon: IconCheck, v: p?.learned.length ?? 0, l: "Đã thuộc" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(({ Icon, v, l }, i) => (
        <div key={i} className="card-lux flex flex-col items-center gap-1 py-4">
          <Icon className="h-5 w-5 text-gold-300" />
          <p className="font-display text-2xl font-semibold text-ivory">{v}</p>
          <p className="text-[11px] text-taupe">{l}</p>
        </div>
      ))}
    </div>
  );
}
