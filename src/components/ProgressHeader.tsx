"use client";

import { useEffect, useRef, useState } from "react";
import { motion, animate } from "framer-motion";
import { getProgress, levelFromXp, todayXp, type Progress } from "@/lib/progress";
import { playGoal } from "@/lib/sound";
import { hGoal } from "@/lib/haptics";
import { IconFlame, IconCheck, IconTarget, IconTrophy } from "./icons";
import GoldBurst from "./GoldBurst";

function Num({ to }: { to: number }) {
  const [v, setV] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const c = animate(prev.current, to, { duration: 0.7, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    prev.current = to;
    return () => c.stop();
  }, [to]);
  return <>{v}</>;
}

/** Vòng mục tiêu ngày — đầy dần theo XP hôm nay, chạm mốc thì bùng + kêu 1 lần/ngày */
function GoalRing({ value, goal }: { value: number; goal: number }) {
  const R = 34;
  const C = 2 * Math.PI * R;
  const pct = Math.min(value / Math.max(goal, 1), 1);
  const done = pct >= 1;
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (!done) return;
    const key = `lw_goal_cel_${new Date().toISOString().slice(0, 10)}`;
    if (window.localStorage.getItem(key)) return;
    window.localStorage.setItem(key, "1");
    setCelebrate(true);
    playGoal();
    hGoal();
    const t = window.setTimeout(() => setCelebrate(false), 1400);
    return () => window.clearTimeout(t);
  }, [done]);

  return (
    <div className="relative grid h-[104px] w-[104px] shrink-0 place-items-center">
      <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
        <circle cx="42" cy="42" r={R} fill="none" strokeWidth="7" className="stroke-surface-3" />
        <motion.circle
          cx="42"
          cy="42"
          r={R}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          stroke="url(#goalgrad)"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - pct) }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
        />
        <defs>
          <linearGradient id="goalgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--c-accent-hi))" />
            <stop offset="100%" stopColor="rgb(var(--c-accent))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        {done ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 14 }}>
            <IconCheck className="mx-auto h-6 w-6 text-gold-300" />
            <p className="text-[9px] font-bold uppercase tracking-wide text-gold-300">Đạt mục tiêu!</p>
          </motion.div>
        ) : (
          <div>
            <p className="font-tech text-xl font-bold text-ivory">
              <Num to={value} />
            </p>
            <p className="text-[9px] text-taupe">/{goal} XP hôm nay</p>
          </div>
        )}
      </div>
      {celebrate && <GoldBurst />}
    </div>
  );
}

/**
 * Bảng điều khiển học: vòng MỤC TIÊU NGÀY + level & thanh XP + streak + đã thuộc.
 * Nghe lw:progress → cộng XP ở đâu cũng nhảy số ngay.
 */
export default function ProgressHeader() {
  const [p, setP] = useState<Progress | null>(null);

  useEffect(() => {
    const read = () => setP(getProgress());
    read();
    window.addEventListener("lw:progress", read);
    return () => window.removeEventListener("lw:progress", read);
  }, []);

  const lv = levelFromXp(p?.xp ?? 0);
  const lvPct = Math.min(lv.into / Math.max(lv.span, 1), 1);

  return (
    <div className="card-lux flex items-center gap-4 p-4">
      <GoalRing value={p ? todayXp(p) : 0} goal={p?.goal ?? 60} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <IconTrophy className="h-4 w-4 shrink-0 text-gold-300" />
          <p className="truncate text-sm font-bold text-ivory">
            Lv.{lv.level} · <span className="gold-text">{lv.name}</span>
          </p>
        </div>
        {/* thanh XP tới level sau */}
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-3">
          <motion.div
            className="h-full rounded-full bg-gold-foil"
            initial={{ width: 0 }}
            animate={{ width: `${lvPct * 100}%` }}
            transition={{ type: "spring", stiffness: 70, damping: 18 }}
          />
        </div>
        <p className="mt-1 text-[10px] text-taupe">
          Còn <span className="font-semibold text-gold-300">{Math.max(lv.span - lv.into, 0)} XP</span> lên cấp tiếp theo
        </p>

        <div className="mt-2 flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1 rounded-full border border-hairline px-2 py-0.5 font-semibold text-gold-300">
            <IconFlame className={`h-3 w-3 ${(p?.streak ?? 0) > 0 ? "flame-beat" : ""}`} />
            <Num to={p?.streak ?? 0} /> ngày
          </span>
          <span className="flex items-center gap-1 rounded-full border border-hairline px-2 py-0.5 font-semibold text-sage">
            <IconCheck className="h-3 w-3" />
            <Num to={p?.learned.length ?? 0} /> thuộc
          </span>
          <span className="flex items-center gap-1 rounded-full border border-hairline px-2 py-0.5 font-semibold text-taupe">
            <IconTarget className="h-3 w-3" />
            <Num to={p?.bestCombo ?? 0} /> combo
          </span>
        </div>
      </div>
    </div>
  );
}
