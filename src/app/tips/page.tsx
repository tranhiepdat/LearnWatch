"use client";

import { useEffect, useMemo, useState } from "react";
import LearnDeck from "@/components/LearnDeck";
import { tips, tipsOfDay, TIP_CATS, type SaleTip, type TipCat } from "@/data/tips";
import { getProgress, toggleLearned } from "@/lib/progress";
import { playTap } from "@/lib/sound";
import { hTap } from "@/lib/haptics";
import { shuffle } from "@/lib/quiz";
import { IconBulb, IconCheck } from "@/components/icons";

type Deck = "today" | "all" | TipCat;
const tipKey = (id: string) => `tip:${id}`;

export default function TipsPage() {
  const [learned, setLearned] = useState<string[]>([]);
  const [deck, setDeck] = useState<Deck>("today");
  const [today, setToday] = useState<SaleTip[]>([]);
  const [order, setOrder] = useState(0); // đổi để xáo lại
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setToday(tipsOfDay(new Date().toISOString().slice(0, 10), 3));
    setLearned(getProgress().learned);
  }, []);

  const isKnown = (t: SaleTip) => learned.includes(tipKey(t.id));

  const items = useMemo(() => {
    const base = deck === "today" ? today : deck === "all" ? tips : tips.filter((t) => t.cat === deck);
    return order === 0 ? base : shuffle(base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, today, order]);

  return (
    <div className="mx-auto flex h-full max-w-xl flex-col">
      <div className="shrink-0">
        <div className="flex items-end justify-between">
          <div>
            <p className="label-luxe">Tips &amp; Tricks</p>
            <h1 className="font-display text-2xl font-semibold text-ivory">Mẹo bán đồng hồ</h1>
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

        {/* chọn bộ thẻ */}
        <div className="mt-3 flex flex-wrap gap-2">
          {(["today", "all", ...TIP_CATS] as Deck[]).map((d) => (
            <button
              key={d}
              onClick={() => {
                setDeck(d);
                playTap();
                hTap();
              }}
              className={`cyber chip ${deck === d ? "chip-on" : ""}`}
            >
              {d === "today" ? `Hôm nay (${today.length})` : d === "all" ? `Tất cả (${tips.length})` : d}
            </button>
          ))}
        </div>
      </div>

      {showList ? (
        // danh sách tra cứu nhanh (phụ) — mặc định vẫn là học thẻ
        <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto">
          {tips.map((t) => (
            <div key={t.id} className="card-lux p-3.5">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-[var(--r-full)] ${isKnown(t) ? "bg-gold-400" : "bg-surface-3"}`} />
                <span className="label-luxe text-[9px]">{t.cat}</span>
              </div>
              <p className="mt-1 text-[13px] font-semibold leading-snug text-ivory">{t.short}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-ivory/80">{t.detail}</p>
              {t.say && <p className="mt-1.5 text-[12px] italic text-champagne">💬 “{t.say}”</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 min-h-0 flex-1">
          <LearnDeck
            items={items}
            isKnown={isKnown}
            onKnow={(t) => setLearned(toggleLearned(tipKey(t.id)).learned)}
            onReshuffle={() => setOrder((o) => o + 1)}
            knowLabel="Đã ôn"
            skipLabel="Ôn lại"
            emptyText="Chưa có mẹo trong nhóm này"
            hint="Chạm để xem chi tiết · Vuốt phải nếu đã thuộc"
            renderFront={(t) => (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <span className="tile h-12 w-12">
                  <IconBulb className="h-6 w-6" />
                </span>
                <p className="label-luxe mt-3">{t.cat}</p>
                <p className="mt-2 font-display text-xl font-bold leading-snug text-ivory">{t.short}</p>
                {isKnown(t) && (
                  <span className="stat mt-3 text-gold-300">
                    <IconCheck className="h-3.5 w-3.5" /> đã ôn
                  </span>
                )}
              </div>
            )}
            renderBack={(t) => (
              <div className="flex flex-1 flex-col">
                <p className="label-luxe">{t.cat} · vì sao</p>
                <p className="mt-2 text-[15px] font-bold leading-snug text-ivory">{t.short}</p>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ivory/85">{t.detail}</p>
                {t.say && (
                  <div className="mt-3 rounded-[var(--r-md)] bg-surface-2 p-3">
                    <p className="label-luxe text-[9px]">Nói với khách</p>
                    <p className="mt-1 text-[13.5px] italic leading-snug text-champagne">“{t.say}”</p>
                  </div>
                )}
              </div>
            )}
          />
        </div>
      )}

    </div>
  );
}
