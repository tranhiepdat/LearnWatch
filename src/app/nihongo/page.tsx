"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jpSteps, jpPhrases, phrasesOfStep, type JpPhrase } from "@/data/nihongo";
import { getProgress, toggleLearned } from "@/lib/progress";
import { playTap, playPop, playCorrect } from "@/lib/sound";
import { hTap, hSuccess } from "@/lib/haptics";
import { useTheme } from "@/lib/theme";
import { IconCheck, IconChevron, IconLang } from "@/components/icons";

const jpKey = (id: string) => `jp:${id}`;

export default function NihongoPage() {
  const { meta } = useTheme();
  const [learned, setLearned] = useState<string[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  /** false = chỉ hiện câu LÕI (ngắn) — mặc định, học ngắn trước cho dễ nhớ */
  const [showLong, setShowLong] = useState(false);

  useEffect(() => setLearned(getProgress().learned), []);

  const done = (id: string) => learned.includes(jpKey(id));

  function mark(p: JpPhrase) {
    if (done(p.id)) return;
    setLearned(toggleLearned(jpKey(p.id)).learned);
    playCorrect(1);
    hSuccess();
  }

  const total = jpPhrases.length;
  const doneCount = useMemo(() => jpPhrases.filter((p) => done(p.id)).length, [learned]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="label-luxe">Tiếng Nhật bán hàng</p>
        <h1 className="font-display text-3xl font-semibold text-ivory">接客日本語</h1>
        <p className="mt-1 text-sm text-taupe">
          Lộ trình 6 chặng theo đúng thứ tự tiếp khách · câu <span className="font-semibold text-gold-300">ngắn trước, dài sau</span>
        </p>
      </div>

      {/* tiến độ tổng */}
      <div className="card-lux p-4">
        <div className="flex items-center justify-between">
          <span className="stat text-ivory">
            <IconLang className="h-4 w-4 text-gold-300" /> Đã thuộc
          </span>
          <span className="font-tech text-sm font-bold text-gold-300">
            {doneCount}/{total}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-[var(--r-full)] bg-surface-3">
          <motion.div
            className="h-full rounded-[var(--r-full)] bg-gold-foil"
            initial={{ width: 0 }}
            animate={{ width: `${(doneCount / total) * 100}%` }}
            transition={{ type: "spring", stiffness: 70, damping: 20 }}
          />
        </div>
      </div>

      {/* công tắc ngắn/dài */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setShowLong(false);
            playTap();
            hTap();
          }}
          className={`cyber chip ${!showLong ? "chip-on" : ""}`}
        >
          Câu lõi (ngắn)
        </button>
        <button
          onClick={() => {
            setShowLong(true);
            playTap();
            hTap();
          }}
          className={`cyber chip ${showLong ? "chip-on" : ""}`}
        >
          Tất cả (có câu dài)
        </button>
      </div>

      {/* 6 chặng */}
      <div className="space-y-2.5">
        {jpSteps.map((s, i) => {
          const all = phrasesOfStep(s.id);
          const list = showLong ? all : all.filter((p) => p.len === "short");
          const nDone = all.filter((p) => done(p.id)).length;
          const pct = Math.round((nDone / all.length) * 100);
          const isOpen = open === s.id;

          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...meta.motion.spring, delay: i * 0.04 }}
              className="card-lux overflow-hidden"
            >
              <button
                onClick={() => {
                  setOpen(isOpen ? null : s.id);
                  playPop();
                  hTap();
                }}
                className="cyber flex w-full items-center gap-3 p-4 text-left"
              >
                <span className="tile h-10 w-10 text-base">{s.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="label-luxe block text-[9px]">Chặng {s.id}</span>
                  <span className="block text-[15px] font-bold leading-tight text-ivory">{s.title}</span>
                  <span className="mt-0.5 block text-[11px] text-taupe">{s.goal}</span>
                  <span className="mt-1.5 flex items-center gap-2">
                    <span className="h-1.5 w-20 overflow-hidden rounded-[var(--r-full)] bg-surface-3">
                      <span className="block h-full rounded-[var(--r-full)] bg-gold-foil" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="font-tech text-[10px] text-taupe">
                      {nDone}/{all.length}
                    </span>
                  </span>
                </span>
                <IconChevron
                  className={`h-4 w-4 shrink-0 text-taupe transition-transform ${isOpen ? "-rotate-90" : "rotate-90"}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.25, 0.8, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 px-4 pb-4">
                      {list.map((p) => (
                        <div key={p.id} className="rounded-[var(--r-md)] bg-surface-2 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-display text-lg font-semibold leading-snug text-ivory">{p.jp}</p>
                            {p.len === "long" && (
                              <span className="label-luxe shrink-0 text-[9px] text-taupe">dài</span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[12px] italic text-gold-300">{p.romaji}</p>
                          <p className="mt-1 text-[13px] text-ivory/85">{p.vi}</p>
                          {p.note && <p className="mt-1.5 text-[11px] leading-snug text-taupe">💡 {p.note}</p>}
                          <button
                            onClick={() => mark(p)}
                            disabled={done(p.id)}
                            className={`cyber mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-[var(--r-md)] py-2 text-xs font-bold ${
                              done(p.id) ? "bg-surface-3 text-taupe" : "bg-gold-400 text-onaccent"
                            }`}
                          >
                            <IconCheck className="h-4 w-4" />
                            {done(p.id) ? "Đã thuộc" : "Đánh dấu thuộc"}
                          </button>
                        </div>
                      ))}
                      {!showLong && all.some((p) => p.len === "long") && (
                        <p className="pt-1 text-center text-[11px] text-taupe">
                          Còn {all.filter((p) => p.len === "long").length} câu dài — bật &quot;Tất cả&quot; khi đã thuộc câu lõi
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
