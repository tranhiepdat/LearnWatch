"use client";

import { useEffect, useRef, useState } from "react";
import { motion, animate } from "framer-motion";
import { getProgress, levelFromXp, todayXp, type Progress } from "@/lib/progress";
import { playGoal } from "@/lib/sound";
import { hGoal } from "@/lib/haptics";
import { IconFlame, IconCheck, IconBolt, IconTrophy } from "./icons";
import GoldBurst from "./GoldBurst";

function Num({ to }: { to: number }) {
  const [v, setV] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const c = animate(prev.current, to, { duration: 0.6, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    prev.current = to;
    return () => c.stop();
  }, [to]);
  return <>{v}</>;
}

/** Vòng mục tiêu ngày — đầy theo XP hôm nay; chạm mốc bùng 1 lần/ngày */
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
    <div className="relative grid h-[96px] w-[96px] shrink-0 place-items-center">
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
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
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
          <div>
            <IconCheck className="mx-auto h-6 w-6 text-gold-300" />
            <p className="text-[9px] font-bold uppercase tracking-wide text-gold-300">Đạt mục tiêu</p>
          </div>
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
 * Card tiến độ: vòng mục tiêu + level & thanh XP + MỘT hàng chỉ số phẳng
 * (không pill viền). Nghe lw:progress → số nhảy realtime.
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
            Lv.{lv.level} · <span className="text-gold-300">{lv.name}</span>
          </p>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-[var(--r-full)] bg-surface-3">
          <motion.div
            className="h-full rounded-[var(--r-full)] bg-gold-foil"
            initial={{ width: 0 }}
            animate={{ width: `${lvPct * 100}%` }}
            transition={{ type: "spring", stiffness: 70, damping: 20 }}
          />
        </div>
        <p className="mt-1 text-[11px] text-taupe">
          Còn <span className="font-semibold text-gold-300">{Math.max(lv.span - lv.into, 0)} XP</span> lên cấp
        </p>

        {/* chỉ số PHẲNG — icon + số, không hộp không viền */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="stat">
            <IconFlame className="h-3.5 w-3.5 text-gold-300" />
            <Num to={p?.streak ?? 0} /> ngày
          </span>
          <span className="stat">
            <IconCheck className="h-3.5 w-3.5 text-sage" />
            <Num to={p?.learned.length ?? 0} /> thuộc
          </span>
          <span className="stat">
            <IconBolt className="h-3.5 w-3.5 text-gold-300" />
            combo <Num to={p?.bestCombo ?? 0} />
          </span>
        </div>
      </div>
    </div>
  );
}
