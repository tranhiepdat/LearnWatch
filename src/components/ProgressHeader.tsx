"use client";

import { useEffect, useState } from "react";
import { getProgress, type Progress } from "@/lib/progress";

export default function ProgressHeader() {
  const [p, setP] = useState<Progress | null>(null);

  useEffect(() => {
    setP(getProgress());
  }, []);

  const xp = p?.xp ?? 0;
  const streak = p?.streak ?? 0;
  const learned = p?.learned.length ?? 0;

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
        <p className="text-2xl font-extrabold text-amber-500">{xp}</p>
        <p className="text-xs text-slate-500">XP</p>
      </div>
      <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
        <p className="text-2xl font-extrabold text-orange-500">🔥 {streak}</p>
        <p className="text-xs text-slate-500">Chuỗi ngày</p>
      </div>
      <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
        <p className="text-2xl font-extrabold text-emerald-500">{learned}</p>
        <p className="text-xs text-slate-500">Đã thuộc</p>
      </div>
    </div>
  );
}
