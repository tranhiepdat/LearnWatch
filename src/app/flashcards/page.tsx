"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SwipeDeck from "@/components/SwipeDeck";
import FilterSelect from "@/components/FilterSelect";
import JuicyButton from "@/components/JuicyButton";
import { visibleWatches as watches } from "@/data/watches";
import { shuffle } from "@/lib/quiz";
import { getProgress, toggleLearned } from "@/lib/progress";
import { playTap, playPop } from "@/lib/sound";
import type { Brand } from "@/data/types";

/** Hướng dẫn 1 LẦN ĐẦU trên mọi màn hình (trước đây chỉ desktop thấy) */
function CoachOverlay({ onDone }: { onDone: () => void }) {
  const rows = [
    { icon: "👉", text: "Vuốt PHẢI = đã thuộc (+5 XP)", dir: 26 },
    { icon: "👈", text: "Vuốt TRÁI = ôn lại sau", dir: -26 },
    { icon: "👆", text: "Chạm thẻ = lật xem chi tiết", dir: 0 },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 grid place-items-center rounded-[var(--r-lg)] bg-ink/85 p-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-xs text-center">
        <p className="font-display text-xl font-bold text-ivory">Cách học thẻ</p>
        <div className="mt-5 space-y-4">
          {rows.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.12 }}
              className="flex items-center gap-3 rounded-[var(--r-md)] border border-hairline bg-surface p-3"
            >
              <motion.span
                // gợi ý MỘT CHIỀU: trôi theo hướng vuốt rồi fade, quay lại bằng
                // opacity (không kéo ngược) — chỉ hướng mà không lắc qua lại
                animate={
                  r.dir !== 0
                    ? { x: [0, r.dir * 0.55, r.dir], opacity: [1, 1, 0] }
                    : { y: [0, -6, 0], opacity: [1, 1, 1] }
                }
                transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 0.45, ease: "easeOut", delay: i * 0.2 }}
                className="text-2xl"
              >
                {r.icon}
              </motion.span>
              <span className="text-left text-sm font-semibold text-ivory">{r.text}</span>
            </motion.div>
          ))}
        </div>
        <JuicyButton
          onClick={onDone}
          className="mt-6 w-full rounded-[var(--r-md)] bg-gold-foil py-3 font-bold text-onaccent shadow-glow"
        >
          Hiểu rồi, học thôi!
        </JuicyButton>
      </div>
    </motion.div>
  );
}

type Filter = "Tất cả" | Brand;
type Mode = "Tất cả" | "Chưa thuộc" | "Đã thuộc";
const MODES: Mode[] = ["Tất cả", "Chưa thuộc", "Đã thuộc"];

const FC_COUNTS: Record<string, number> = { "Tất cả": watches.length };
watches.forEach((w) => (FC_COUNTS[w.brand] = (FC_COUNTS[w.brand] ?? 0) + 1));
const FILTERS: Filter[] = [
  "Tất cả",
  ...(Object.keys(FC_COUNTS).filter((b) => b !== "Tất cả") as Brand[]).sort(
    (a, b) => (FC_COUNTS[b] ?? 0) - (FC_COUNTS[a] ?? 0),
  ),
];

export default function FlashcardsPage() {
  const [filter, setFilter] = useState<Filter>("Rolex");
  const [mode, setMode] = useState<Mode>("Tất cả");
  const [order, setOrder] = useState<string[]>([]);
  const [learned, setLearned] = useState<string[]>([]);
  const [deckKey, setDeckKey] = useState(0);
  const [coach, setCoach] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem("lw_coach_fc")) setCoach(true);
  }, []);

  const base = useMemo(() => watches.filter((w) => filter === "Tất cả" || w.brand === filter), [filter]);

  const rebuild = (list: typeof watches) => {
    setOrder(shuffle(list.map((w) => w.id)));
    setDeckKey((k) => k + 1);
  };

  // Xây bộ thẻ theo hãng + trạng thái thuộc (chụp ảnh 'learned' tại thời điểm đổi bộ lọc)
  useEffect(() => {
    const pool =
      mode === "Chưa thuộc"
        ? base.filter((w) => !learned.includes(w.id))
        : mode === "Đã thuộc"
          ? base.filter((w) => learned.includes(w.id))
          : base;
    rebuild(pool);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, mode]);

  useEffect(() => setLearned(getProgress().learned), []);

  const deck = useMemo(
    () => order.map((id) => base.find((w) => w.id === id)).filter(Boolean) as typeof watches,
    [order, base],
  );

  const learnedCount = useMemo(() => base.filter((w) => learned.includes(w.id)).length, [base, learned]);

  function rebuildCurrent() {
    const pool =
      mode === "Chưa thuộc"
        ? base.filter((w) => !learned.includes(w.id))
        : mode === "Đã thuộc"
          ? base.filter((w) => learned.includes(w.id))
          : base;
    rebuild(pool);
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div>
        <p className="label-luxe">Flashcard</p>
        <h1 className="font-display text-2xl font-semibold text-ivory">Lật &amp; vuốt thẻ</h1>
      </div>

      {/* Hang loc gon: Hang (dropdown, mac dinh Rolex) + trang thai thuoc */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          label="Hãng"
          value={filter}
          options={FILTERS}
          counts={FC_COUNTS}
          onChange={(f) => setFilter(f as Filter)}
        />
        <span className="text-hairline">·</span>
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              playTap();
            }}
            className={`cyber chip ${mode === m ? "chip-on" : ""}`}
          >
            {m}
            {m === "Đã thuộc" ? ` (${learnedCount})` : ""}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 lg:flex lg:items-stretch lg:justify-center lg:gap-8">
        <div className="relative mx-auto h-full w-full max-w-md lg:mx-0">
          <AnimatePresence>
            {coach && deck.length > 0 && (
              <CoachOverlay
                onDone={() => {
                  window.localStorage.setItem("lw_coach_fc", "1");
                  setCoach(false);
                  playPop();
                }}
              />
            )}
          </AnimatePresence>
          {deck.length > 0 ? (
            <SwipeDeck
              key={deckKey}
              deck={deck}
              learned={learned}
              onToggleLearned={(id) => setLearned(toggleLearned(id).learned)}
              onReshuffle={rebuildCurrent}
            />
          ) : (
            <div className="grid h-full place-items-center text-center text-taupe">
              <p>
                {mode === "Đã thuộc"
                  ? "Chưa đánh dấu 'thuộc' mẫu nào. Vuốt PHẢI khi học để đánh dấu nhé!"
                  : mode === "Chưa thuộc"
                    ? "Bạn đã thuộc hết rồi 🎉 Chuyển sang 'Đã thuộc' để ôn lại."
                    : "Không có thẻ nào."}
              </p>
            </div>
          )}
        </div>
        <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:justify-center">
          <div className="card-lux p-5">
            <p className="label-luxe">Cách dùng</p>
            <ul className="mt-3 space-y-2.5 text-sm text-ivory/90">
              <li className="flex gap-2">
                <span className="text-gold-300">→</span> Vuốt PHẢI = đã thuộc (+XP)
              </li>
              <li className="flex gap-2">
                <span className="text-taupe">←</span> Vuốt TRÁI = ôn lại sau
              </li>
              <li className="flex gap-2">
                <span className="text-gold-300">⟳</span> Chạm thẻ = lật xem chi tiết
              </li>
              <li className="flex gap-2">
                <span className="text-gold-300">✦</span> Lọc &quot;Đã thuộc&quot; để ôn lại mẫu đã học
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
