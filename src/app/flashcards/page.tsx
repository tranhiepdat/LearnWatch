"use client";

import { useEffect, useMemo, useState } from "react";
import Flashcard from "@/components/Flashcard";
import { watches } from "@/data/watches";
import { shuffle } from "@/lib/quiz";
import { getProgress, toggleLearned } from "@/lib/progress";
import type { Brand } from "@/data/types";

type Filter = "Tất cả" | Brand;
const FILTERS: Filter[] = ["Tất cả", "Rolex", "Omega"];

export default function FlashcardsPage() {
  const [filter, setFilter] = useState<Filter>("Tất cả");
  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [learned, setLearned] = useState<string[]>([]);

  const deck = useMemo(() => {
    const base = watches.filter((w) => filter === "Tất cả" || w.brand === filter);
    return base;
  }, [filter]);

  // Khoi tao thu tu the moi khi doi bo loc
  useEffect(() => {
    setOrder(deck.map((w) => w.id));
    setIndex(0);
  }, [deck]);

  useEffect(() => {
    setLearned(getProgress().learned);
  }, []);

  const orderedDeck = useMemo(
    () => order.map((id) => deck.find((w) => w.id === id)).filter(Boolean) as typeof watches,
    [order, deck],
  );

  const current = orderedDeck[index];
  const learnedInDeck = orderedDeck.filter((w) => learned.includes(w.id)).length;

  function handleToggle(id: string) {
    const p = toggleLearned(id);
    setLearned(p.learned);
  }

  function go(delta: number) {
    setIndex((i) => Math.min(Math.max(i + delta, 0), orderedDeck.length - 1));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-slate-900">Flashcard 🃏</h1>
        <button
          onClick={() => {
            setOrder(shuffle(deck.map((w) => w.id)));
            setIndex(0);
          }}
          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        >
          🔀 Xáo trộn
        </button>
      </div>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === f ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {current ? (
        <>
          <Flashcard
            key={current.id}
            watch={current}
            learned={learned.includes(current.id)}
            onToggleLearned={handleToggle}
          />

          <div className="flex items-center justify-between">
            <button
              onClick={() => go(-1)}
              disabled={index === 0}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm disabled:opacity-40"
            >
              ← Trước
            </button>
            <span className="text-sm text-slate-500">
              {index + 1} / {orderedDeck.length} · đã thuộc {learnedInDeck}
            </span>
            <button
              onClick={() => go(1)}
              disabled={index >= orderedDeck.length - 1}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm disabled:opacity-40"
            >
              Tiếp →
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-slate-500">Không có thẻ nào.</p>
      )}
    </div>
  );
}
