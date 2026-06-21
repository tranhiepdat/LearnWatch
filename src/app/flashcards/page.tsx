"use client";

import { useEffect, useMemo, useState } from "react";
import SwipeDeck from "@/components/SwipeDeck";
import { visibleWatches as watches } from "@/data/watches";
import { shuffle } from "@/lib/quiz";
import { getProgress, toggleLearned } from "@/lib/progress";
import { playTap } from "@/lib/sound";
import type { Brand } from "@/data/types";

type Filter = "Tất cả" | Brand;
const _fcCounts = new Map<Brand, number>();
watches.forEach((w) => _fcCounts.set(w.brand, (_fcCounts.get(w.brand) ?? 0) + 1));
const FILTERS: Filter[] = [
  "Tất cả",
  ...Array.from(_fcCounts.keys()).sort((a, b) => (_fcCounts.get(b) ?? 0) - (_fcCounts.get(a) ?? 0)),
];

export default function FlashcardsPage() {
  const [filter, setFilter] = useState<Filter>("Tất cả");
  const [order, setOrder] = useState<string[]>([]);
  const [learned, setLearned] = useState<string[]>([]);
  const [deckKey, setDeckKey] = useState(0);

  const base = useMemo(() => watches.filter((w) => filter === "Tất cả" || w.brand === filter), [filter]);

  const rebuild = (list: typeof watches) => {
    setOrder(shuffle(list.map((w) => w.id)));
    setDeckKey((k) => k + 1);
  };

  useEffect(() => {
    rebuild(base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base]);

  useEffect(() => setLearned(getProgress().learned), []);

  const deck = useMemo(
    () => order.map((id) => base.find((w) => w.id === id)).filter(Boolean) as typeof watches,
    [order, base],
  );

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-end justify-between">
        <div>
          <p className="label-luxe">Flashcard</p>
          <h1 className="font-display text-2xl font-semibold text-ivory">Lật &amp; vuốt thẻ</h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              playTap();
            }}
            className={`cyber rounded-[5px] px-4 py-1.5 text-sm font-semibold transition active:scale-95 ${
              filter === f ? "bg-gold-foil text-ink shadow-glow" : "border border-hairline text-taupe"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 lg:flex lg:items-stretch lg:justify-center lg:gap-8">
        <div className="mx-auto h-full w-full max-w-md lg:mx-0">
          {deck.length > 0 ? (
            <SwipeDeck
              key={deckKey}
              deck={deck}
              learned={learned}
              onToggleLearned={(id) => setLearned(toggleLearned(id).learned)}
              onReshuffle={() => rebuild(base)}
            />
          ) : (
            <p className="text-center text-taupe">Không có thẻ nào.</p>
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
                <span className="text-gold-300">✦</span> Nút &quot;Hỏi AI&quot; để hỏi nhanh về mẫu đang xem
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
