"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { tips, tipsOfDay, TIP_CATS, type SaleTip, type TipCat } from "@/data/tips";
import { getProgress, toggleLearned } from "@/lib/progress";
import { playTap, playPop, playCorrect } from "@/lib/sound";
import { hTap, hSuccess } from "@/lib/haptics";
import { useTheme } from "@/lib/theme";
import { IconBulb, IconCheck, IconChevron } from "@/components/icons";

type Filter = "Tất cả" | TipCat;
const FILTERS: Filter[] = ["Tất cả", ...TIP_CATS];
const tipKey = (id: string) => `tip:${id}`;

export default function TipsPage() {
  const { meta } = useTheme();
  const [today, setToday] = useState<SaleTip[]>([]);
  const [learned, setLearned] = useState<string[]>([]);
  const [filter, setFilter] = useState<Filter>("Tất cả");

  // Mọi thứ phụ thuộc NGÀY phải chạy sau mount → tránh hydration mismatch
  useEffect(() => {
    const dayKey = new Date().toISOString().slice(0, 10);
    setToday(tipsOfDay(dayKey, 3));
    setLearned(getProgress().learned);
  }, []);

  const done = (id: string) => learned.includes(tipKey(id));

  function markDone(t: SaleTip) {
    if (done(t.id)) return;
    setLearned(toggleLearned(tipKey(t.id)).learned);
    playCorrect(1);
    hSuccess();
  }

  const list = useMemo(
    () => (filter === "Tất cả" ? tips : tips.filter((t) => t.cat === filter)),
    [filter],
  );
  const doneToday = today.length > 0 && today.every((t) => done(t.id));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="label-luxe">Tips &amp; Tricks</p>
        <h1 className="font-display text-3xl font-semibold text-ivory">Mẹo bán đồng hồ</h1>
        <p className="mt-1 text-sm text-taupe">
          Mỗi ngày 3 mẹo mới để ôn · đánh dấu đã ôn được <span className="font-semibold text-gold-300">+5 XP</span>
        </p>
      </div>

      {/* ————— TIP HÔM NAY ————— */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="label-luxe">Hôm nay</p>
            <h2 className="font-display text-lg font-bold text-ivory">3 mẹo cần nhớ</h2>
          </div>
          {doneToday && (
            <span className="stat text-gold-300">
              <IconCheck className="h-4 w-4" /> Xong hôm nay
            </span>
          )}
        </div>

        {today.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...meta.motion.spring, delay: i * 0.06 }}
            className="card-lux p-4"
          >
            <div className="flex items-start gap-3">
              <span className="tile h-9 w-9">
                <IconBulb className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="label-luxe">{t.cat}</p>
                <p className="mt-0.5 text-[15px] font-bold leading-snug text-ivory">{t.short}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ivory/85">{t.detail}</p>
                {t.say && (
                  <p className="mt-2 rounded-[var(--r-md)] bg-surface-2 p-2.5 text-[13px] italic leading-snug text-champagne">
                    💬 “{t.say}”
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => markDone(t)}
              disabled={done(t.id)}
              className={`cyber mt-3 flex w-full items-center justify-center gap-1.5 rounded-[var(--r-md)] py-2.5 text-xs font-bold transition ${
                done(t.id) ? "bg-surface-2 text-taupe" : "bg-gold-400 text-onaccent"
              }`}
            >
              <IconCheck className="h-4 w-4" />
              {done(t.id) ? "Đã ôn" : "Đánh dấu đã ôn"}
            </button>
          </motion.div>
        ))}
      </section>

      {/* ————— KHO TIP ————— */}
      <section className="space-y-3">
        <div>
          <p className="label-luxe">Kho mẹo</p>
          <h2 className="font-display text-lg font-bold text-ivory">Tất cả {tips.length} mẹo</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                playTap();
                hTap();
              }}
              className={`cyber chip ${filter === f ? "chip-on" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {list.map((t) => (
            <details key={t.id} className="card-lux group overflow-hidden">
              <summary
                onClick={() => {
                  playPop();
                  hTap();
                }}
                className="cyber flex cursor-pointer list-none items-center gap-2.5 p-3.5 [&::-webkit-details-marker]:hidden"
              >
                <span className={`h-2 w-2 shrink-0 rounded-[var(--r-full)] ${done(t.id) ? "bg-gold-400" : "bg-surface-3"}`} />
                <span className="min-w-0 flex-1">
                  <span className="label-luxe block text-[9px]">{t.cat}</span>
                  <span className="block text-[13px] font-semibold leading-snug text-ivory">{t.short}</span>
                </span>
                <IconChevron className="h-4 w-4 shrink-0 rotate-90 text-taupe transition-transform group-open:-rotate-90" />
              </summary>
              <div className="px-3.5 pb-3.5">
                <p className="text-[13px] leading-relaxed text-ivory/85">{t.detail}</p>
                {t.say && (
                  <p className="mt-2 rounded-[var(--r-md)] bg-surface-2 p-2.5 text-[13px] italic leading-snug text-champagne">
                    💬 “{t.say}”
                  </p>
                )}
                <button
                  onClick={() => markDone(t)}
                  disabled={done(t.id)}
                  className={`cyber mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-[var(--r-md)] py-2 text-xs font-bold ${
                    done(t.id) ? "bg-surface-2 text-taupe" : "bg-gold-400 text-onaccent"
                  }`}
                >
                  <IconCheck className="h-4 w-4" />
                  {done(t.id) ? "Đã ôn" : "Đánh dấu đã ôn"}
                </button>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
