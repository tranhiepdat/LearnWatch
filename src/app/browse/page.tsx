"use client";

import { useEffect, useMemo, useState } from "react";
import WatchVisual from "@/components/WatchVisual";
import CollectionInfo from "@/components/CollectionInfo";
import { visibleWatches as watches } from "@/data/watches";
import { terms } from "@/data/terms";
import { collectionInfos, getCollectionInfo } from "@/data/collections";
import { playTap } from "@/lib/sound";

type Tab = "Đồng hồ" | "Dòng" | "Thuật ngữ";
const TABS: Tab[] = ["Đồng hồ", "Dòng", "Thuật ngữ"];

// So mau (co anh) theo tung dong
const COUNTS = new Map<string, number>();
watches.forEach((w) => COUNTS.set(w.collection, (COUNTS.get(w.collection) ?? 0) + 1));

export default function BrowsePage() {
  const [tab, setTab] = useState<Tab>("Đồng hồ");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  // Cho phep mo thang tab qua ?tab=Dong
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t === "dong" || t === "Dòng") setTab("Dòng");
    else if (t === "thuat-ngu" || t === "Thuật ngữ") setTab("Thuật ngữ");
  }, []);

  const fWatches = useMemo(() => {
    if (!query) return watches;
    return watches.filter((w) =>
      [w.model, w.collection, w.nickname, w.reference, w.brand, w.colorEn, ...w.materials]
        .filter(Boolean)
        .some((s) => (s as string).toLowerCase().includes(query)),
    );
  }, [query]);

  const fCollections = useMemo(() => {
    const list = collectionInfos.filter((c) => COUNTS.has(c.collection));
    if (!query) return list;
    return list.filter((c) =>
      [c.collection, c.brand, c.tagline, c.purpose, c.forWho, c.terms ?? "", ...c.signature].some((s) =>
        s.toLowerCase().includes(query),
      ),
    );
  }, [query]);

  const fTerms = useMemo(() => {
    if (!query) return terms;
    return terms.filter((t) =>
      [t.term, t.short, t.detail, t.brand, t.category].some((s) => s.toLowerCase().includes(query)),
    );
  }, [query]);

  const count = tab === "Đồng hồ" ? fWatches.length : tab === "Dòng" ? fCollections.length : fTerms.length;

  return (
    <div className="space-y-4">
      <div>
        <p className="label-luxe">Tra cứu</p>
        <h1 className="font-display text-3xl font-semibold text-ivory">Sổ tay tư vấn</h1>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Pepsi · Submariner · lặn · Cerachrom · 126710…"
        className="w-full rounded-[6px] border border-hairline bg-surface px-4 py-3 text-sm text-ivory outline-none placeholder:text-taupe focus:border-gold-600"
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              playTap();
            }}
            className={`cyber rounded-[5px] px-4 py-1.5 text-sm font-semibold transition active:scale-95 ${
              tab === t ? "bg-gold-foil text-ink shadow-glow" : "border border-hairline text-taupe"
            }`}
          >
            {t} ({t === "Đồng hồ" ? fWatches.length : t === "Dòng" ? fCollections.length : fTerms.length})
          </button>
        ))}
      </div>

      {tab === "Đồng hồ" && (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {fWatches.map((w) => {
            const info = getCollectionInfo(w.collection);
            return (
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
                    {info && <p className="truncate text-[11px] text-sage">{w.collection} · {info.tagline}</p>}
                    <div className="mt-0.5 flex flex-wrap gap-x-3 text-[11px]">
                      {w.reference && <span className="font-mono text-taupe">Ref. {w.reference}</span>}
                      {w.colorEn && <span className="text-gold-300">EN: {w.colorEn}</span>}
                      {w.resale && <span className="text-sage">{w.resale}</span>}
                    </div>
                  </div>
                </div>
                {w.warning && (
                  <p className="mt-2 rounded-[4px] border border-bordeaux bg-bordeaux/15 px-2 py-1 text-[11px] text-ivory">
                    <span className="font-bold text-bordeaux">⚠ Custom/Rep:</span> {w.warning}
                  </p>
                )}
                {w.nicknameMeaning && <p className="mt-2 text-xs text-taupe">{w.nicknameMeaning}</p>}
              </div>
            );
          })}
          {fWatches.length === 0 && <Empty />}
        </div>
      )}

      {tab === "Dòng" && (
        <div className="grid gap-2.5 lg:grid-cols-2">
          {fCollections.map((c) => (
            <div key={`${c.brand}-${c.collection}`}>
              <div className="mb-1 flex items-center gap-2 px-1">
                <span className="rounded border border-hairline px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-luxe text-gold-300">
                  {c.brand}
                </span>
                <span className="text-[11px] text-taupe">{COUNTS.get(c.collection)} mẫu trong app</span>
              </div>
              <CollectionInfo collection={c.collection} variant="full" />
            </div>
          ))}
          {fCollections.length === 0 && <Empty />}
        </div>
      )}

      {tab === "Thuật ngữ" && (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {fTerms.map((t) => (
            <details key={t.id} className="card-lux p-4">
              <summary className="flex cursor-pointer items-center justify-between gap-2">
                <span className="font-display text-base font-semibold text-ivory">{t.term}</span>
                <span className="rounded-[5px] border border-hairline px-2 py-0.5 text-[10px] text-taupe">
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

      <p className="pb-2 text-center text-[11px] text-taupe">{count} kết quả</p>
    </div>
  );
}

function Empty() {
  return <p className="py-10 text-center text-taupe">Không tìm thấy kết quả.</p>;
}
