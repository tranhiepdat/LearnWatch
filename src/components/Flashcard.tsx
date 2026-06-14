"use client";

import { useState } from "react";
import type { Watch } from "@/data/types";
import WatchVisual from "./WatchVisual";

function BrandTag({ brand }: { brand: Watch["brand"] }) {
  const cls = brand === "Rolex" ? "bg-rolex text-white" : "bg-omega text-white";
  return <span className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${cls}`}>{brand}</span>;
}

export default function Flashcard({
  watch,
  learned = false,
  onToggleLearned,
}: {
  watch: Watch;
  learned?: boolean;
  onToggleLearned?: (id: string) => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="[perspective:1600px]">
      <div
        className={`relative h-[480px] w-full cursor-pointer transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
      >
        {/* MAT TRUOC */}
        <div className="absolute inset-0 flex flex-col items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xl [backface-visibility:hidden]">
          <div className="flex w-full items-center justify-between">
            <BrandTag brand={watch.brand} />
            <span className="text-xs font-medium text-slate-400">{watch.collection}</span>
          </div>

          <WatchVisual watch={watch} size={210} />

          <div className="text-center">
            {watch.nickname ? (
              <>
                <p className="text-xs uppercase tracking-widest text-slate-400">Biệt danh</p>
                <p className="text-3xl font-extrabold text-slate-900">{watch.nickname}</p>
              </>
            ) : (
              <p className="text-2xl font-bold text-slate-900">{watch.collection}</p>
            )}
            {watch.reference && <p className="mt-1 text-sm text-slate-500">Ref. {watch.reference}</p>}
          </div>

          <p className="text-xs text-slate-400">↻ Chạm để xem chi tiết</p>
        </div>

        {/* MAT SAU */}
        <div className="absolute inset-0 flex flex-col overflow-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="mb-2 flex items-center justify-between">
            <BrandTag brand={watch.brand} />
            {watch.reference && (
              <span className="font-mono text-xs text-slate-500">Ref. {watch.reference}</span>
            )}
          </div>

          <h3 className="text-lg font-bold leading-tight text-slate-900">{watch.model}</h3>

          {watch.nickname && watch.nicknameMeaning && (
            <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              <span className="font-bold">“{watch.nickname}”</span> — {watch.nicknameMeaning}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {watch.materials.map((m) => (
              <span key={m} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                {m}
              </span>
            ))}
          </div>

          <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
            {watch.facts.map((f, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-rolex">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {watch.funFact && (
            <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">💡 {watch.funFact}</p>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
            {watch.caseSize && <span>📐 Đường kính: {watch.caseSize}</span>}
            {watch.movement && <span>⚙️ Máy: {watch.movement}</span>}
            {watch.year && <span>📅 Năm: {watch.year}</span>}
          </div>

          {onToggleLearned && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLearned(watch.id);
              }}
              className={`mt-auto w-full rounded-xl py-2.5 text-sm font-bold transition ${
                learned
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {learned ? "✓ Đã thuộc" : "Đánh dấu đã thuộc (+5 XP)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
