"use client";

import { useMemo, useState } from "react";
import WatchVisual from "@/components/WatchVisual";
import { watches } from "@/data/watches";
import { terms } from "@/data/terms";
import { playTap } from "@/lib/sound";

type Tab = "Đồng hồ" | "Thuật ngữ";

export default function BrowsePage() {
  const [tab, setTab] = useState<Tab>("Đồng hồ");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const fWatches = useMemo(() => {
    if (!query) return watches;
    return watches.filter((w) =>
      [w.model, w.collection, w.nickname, w.reference, w.brand, w.colorEn, ...w.materials]
        .filter(Boolean)
        .some((s) => (s as string).toLowerCase().includes(query)),
    );
  }, [query]);

  const fTerms = useMemo(() => {
    if (!query) return terms;
    return terms.filter((t) =>
      [t.term, t.short, t.detail, t.brand, t.category].some((s) => s.toLowerCase().includes(query)),
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <div>
        <p className="label-luxe">Tra cứu</p>
        <h1 className="font-display text-3xl font-semibold text-ivory">Sổ tay tư vấn</h1>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Pepsi · Cerachrom · 126710 · Wimbledon · VSF…"
        className="w-full rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm text-ivory outline-none placeholder:text-taupe focus:border-gold-600"
      />

      <div className="flex gap-2">
        {(["Đồng hồ", "Thuật ngữ"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              playTap();
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition active:scale-95 ${
              tab === t ? "bg-gold-foil text-ink shadow-glow" : "border border-hairline text-taupe"
            }`}
          >
            {t} ({t === "Đồng hồ" ? fWatches.length : fTerms.length})
          </button>
        ))}
      </div>

      {tab === "Đồng hồ" ? (
        <div className="space-y-2.5">
          {fWatches.map((w) => (
            <div key={w.id} className="card-lux p-4">
              <div className="flex gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-hairline">
                  <WatchVisual watch={w} size={64} className="h-16 w-16" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-hairline px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-luxe text-gold-300">
                      {w.brand}
                    </span>
                    <span className="truncate font-display text-base font-semibold text-ivory">
                      {w.nickname ?? w.collection}
                    </span>
                  </div>
                  <p className="truncate text-xs text-taupe">{w.model}</p>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 text-[11px]">
                    {w.reference && <span className="font-mono text-taupe">Ref. {w.reference}</span>}
                    {w.colorEn && <span className="text-gold-300">EN: {w.colorEn}</span>}
                    {w.resale && <span className="text-sage">{w.resale}</span>}
                  </div>
                </div>
              </div>
              {w.nicknameMeaning && <p className="mt-2 text-xs text-taupe">{w.nicknameMeaning}</p>}
            </div>
          ))}
          {fWatches.length === 0 && <Empty />}
        </div>
      ) : (
        <div className="space-y-2.5">
          {fTerms.map((t) => (
            <details key={t.id} className="card-lux p-4">
              <summary className="flex cursor-pointer items-center justify-between gap-2">
                <span className="font-display text-base font-semibold text-ivory">{t.term}</span>
                <span className="rounded-full border border-hairline px-2 py-0.5 text-[10px] text-taupe">
                  {t.brand} · {t.category}
                </span>
              </summary>
              <p className="mt-2 text-sm font-medium text-champagne">{t.short}</p>
              <p className="mt-1 text-sm text-taupe">{t.detail}</p>
            </details>
          ))}
          {fTerms.length === 0 && <Empty />}
        </div>
      )}
    </div>
  );
}

function Empty() {
  return <p className="py-10 text-center text-taupe">Không tìm thấy kết quả.</p>;
}
