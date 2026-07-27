"use client";

import { useEffect, useMemo, useState } from "react";
import LearnDeck from "@/components/LearnDeck";
import { jpSteps, jpPhrases, type JpPhrase } from "@/data/nihongo";
import { getProgress, toggleLearned } from "@/lib/progress";
import { playTap } from "@/lib/sound";
import { hTap } from "@/lib/haptics";
import { shuffle } from "@/lib/quiz";
import { IconCheck } from "@/components/icons";

const jpKey = (id: string) => `jp:${id}`;

export default function NihongoPage() {
  const [learned, setLearned] = useState<string[]>([]);
  /** 0 = tất cả các chặng */
  const [step, setStep] = useState(1);
  /** false = chỉ câu LÕI (ngắn) — học ngắn trước cho dễ nhớ */
  const [withLong, setWithLong] = useState(false);
  const [order, setOrder] = useState(0);
  const [showList, setShowList] = useState(false);

  useEffect(() => setLearned(getProgress().learned), []);

  const isKnown = (p: JpPhrase) => learned.includes(jpKey(p.id));

  const items = useMemo(() => {
    let base = step === 0 ? jpPhrases : jpPhrases.filter((p) => p.step === step);
    if (!withLong) base = base.filter((p) => p.len === "short");
    return order === 0 ? base : shuffle(base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, withLong, order]);

  const cur = jpSteps.find((s) => s.id === step);

  return (
    <div className="mx-auto flex h-full max-w-xl flex-col">
      <div className="shrink-0">
        <div className="flex items-end justify-between">
          <div className="min-w-0">
            <p className="label-luxe">Tiếng Nhật bán hàng</p>
            <h1 className="font-display text-2xl font-semibold text-ivory">接客日本語</h1>
          </div>
          <button
            onClick={() => {
              setShowList((v) => !v);
              playTap();
              hTap();
            }}
            className="cyber chip shrink-0"
          >
            {showList ? "Học thẻ" : "Xem tất cả"}
          </button>
        </div>

        {/* chọn CHẶNG — lộ trình đúng thứ tự tiếp khách */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {jpSteps.map((s) => {
            const all = jpPhrases.filter((p) => p.step === s.id);
            const n = all.filter((p) => isKnown(p)).length;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setStep(s.id);
                  playTap();
                  hTap();
                }}
                className={`cyber chip text-[11px] ${step === s.id ? "chip-on" : ""}`}
                title={s.goal}
              >
                {s.emoji} {s.id}. {s.title}
                <span className="ml-1 opacity-70">
                  {n}/{all.length}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => {
              setWithLong((v) => !v);
              playTap();
              hTap();
            }}
            className={`cyber chip text-[11px] ${withLong ? "chip-on" : ""}`}
          >
            {withLong ? "Đang học cả câu dài" : "Chỉ câu lõi (ngắn)"}
          </button>
          {cur && <span className="min-w-0 flex-1 truncate text-[11px] text-taupe">{cur.goal}</span>}
        </div>
      </div>

      {showList ? (
        <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto">
          {jpPhrases.map((p) => (
            <div key={p.id} className="card-lux p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-base font-semibold leading-snug text-ivory">{p.jp}</p>
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-[var(--r-full)] ${isKnown(p) ? "bg-gold-400" : "bg-surface-3"}`} />
              </div>
              <p className="text-[11.5px] italic text-gold-300">{p.romaji}</p>
              <p className="text-[12.5px] text-ivory/85">{p.vi}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 min-h-0 flex-1">
          <LearnDeck
            items={items}
            isKnown={isKnown}
            onKnow={(p) => setLearned(toggleLearned(jpKey(p.id)).learned)}
            onReshuffle={() => setOrder((o) => o + 1)}
            knowLabel="Đã thuộc"
            skipLabel="Ôn lại"
            emptyText="Chặng này chưa có câu"
            hint="Chạm để xem nghĩa · Vuốt phải nếu đã thuộc"
            /* MẶT TRƯỚC: chỉ tiếng Nhật — tự nhớ nghĩa trước khi lật */
            renderFront={(p) => (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <p className="label-luxe">
                  Chặng {p.step} · {p.len === "short" ? "câu lõi" : "câu dài"}
                </p>
                <p className="mt-3 font-display text-3xl font-bold leading-snug text-ivory">{p.jp}</p>
                {isKnown(p) && (
                  <span className="stat mt-4 text-gold-300">
                    <IconCheck className="h-3.5 w-3.5" /> đã thuộc
                  </span>
                )}
              </div>
            )}
            renderBack={(p) => (
              <div className="flex flex-1 flex-col justify-center">
                <p className="font-display text-2xl font-bold leading-snug text-ivory">{p.jp}</p>
                <p className="mt-1.5 text-base italic text-gold-300">{p.romaji}</p>
                <div className="mt-3 rounded-[var(--r-md)] bg-surface-2 p-3">
                  <p className="label-luxe text-[9px]">Nghĩa</p>
                  <p className="mt-1 text-[15px] font-semibold leading-snug text-ivory">{p.vi}</p>
                </div>
                {p.note && <p className="mt-2.5 text-[12px] leading-relaxed text-taupe">💡 {p.note}</p>}
              </div>
            )}
          />
        </div>
      )}

    </div>
  );
}
