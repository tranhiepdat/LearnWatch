"use client";

import { useEffect, useMemo, useState } from "react";
import WatchVisual from "@/components/WatchVisual";
import CollectionInfo from "@/components/CollectionInfo";
import WatchDetail from "@/components/WatchDetail";
import FilterSelect from "@/components/FilterSelect";
import { visibleWatches as watches } from "@/data/watches";
import { terms } from "@/data/terms";
import { collectionInfos, getCollectionInfo } from "@/data/collections";
import { playTap } from "@/lib/sound";
import { enLabel } from "@/lib/name";
import { IconClose, IconChevron } from "@/components/icons";
import type { Watch } from "@/data/types";

type Tab = "Đồng hồ" | "Dòng" | "Thuật ngữ";
const TABS: Tab[] = ["Đồng hồ", "Dòng", "Thuật ngữ"];

// So mau (co anh) theo dong + hang
const COUNTS = new Map<string, number>();
watches.forEach((w) => COUNTS.set(w.collection, (COUNTS.get(w.collection) ?? 0) + 1));
const BRAND_COUNTS: Record<string, number> = { "Tất cả": watches.length };
watches.forEach((w) => (BRAND_COUNTS[w.brand] = (BRAND_COUNTS[w.brand] ?? 0) + 1));
const BRANDS: string[] = ["Tất cả", ...Object.keys(BRAND_COUNTS).filter((b) => b !== "Tất cả").sort((a, b) => BRAND_COUNTS[b] - BRAND_COUNTS[a])];

export default function BrowsePage() {
  const [tab, setTab] = useState<Tab>("Đồng hồ");
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("Tất cả");
  const [selected, setSelected] = useState<Watch | null>(null);
  const query = q.trim().toLowerCase();

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t === "dong" || t === "Dòng") setTab("Dòng");
    else if (t === "thuat-ngu" || t === "Thuật ngữ") setTab("Thuật ngữ");
  }, []);

  // dong ho: loc theo search + hang, roi GOM theo DONG
  const fWatches = useMemo(() => {
    let list = watches;
    if (brand !== "Tất cả") list = list.filter((w) => w.brand === brand);
    if (query)
      list = list.filter((w) =>
        [w.model, w.collection, w.nickname, w.reference, w.brand, w.colorEn, ...w.materials]
          .filter(Boolean)
          .some((s) => (s as string).toLowerCase().includes(query)),
      );
    return list;
  }, [query, brand]);

  const groups = useMemo(() => {
    const m = new Map<string, Watch[]>();
    for (const w of fWatches) {
      if (!m.has(w.collection)) m.set(w.collection, []);
      m.get(w.collection)!.push(w);
    }
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [fWatches]);

  const fCollections = useMemo(() => {
    const list = collectionInfos.filter((c) => COUNTS.has(c.collection) && (brand === "Tất cả" || c.brand === brand));
    if (!query) return list;
    return list.filter((c) =>
      [c.collection, c.brand, c.tagline, c.purpose, c.forWho, c.terms ?? "", ...c.signature].some((s) =>
        s.toLowerCase().includes(query),
      ),
    );
  }, [query, brand]);

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
        placeholder="Pepsi · Submariner · lặn · Cerachrom · 126710…"
        className="w-full rounded-[var(--r-md)] border border-hairline bg-surface px-4 py-3 text-sm text-ivory outline-none placeholder:text-taupe focus:border-gold-600"
      />

      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              playTap();
            }}
            className={`cyber rounded-[var(--r-sm)] px-4 py-1.5 text-sm font-semibold transition active:scale-95 ${
              tab === t ? "bg-gold-foil text-onaccent shadow-glow" : "border border-hairline text-taupe"
            }`}
          >
            {t} ({t === "Đồng hồ" ? fWatches.length : t === "Dòng" ? fCollections.length : fTerms.length})
          </button>
        ))}
        {tab !== "Thuật ngữ" && (
          <FilterSelect label="Hãng" value={brand} options={BRANDS} counts={BRAND_COUNTS} onChange={setBrand} />
        )}
      </div>

      {/* ====== DONG HO: hang -> dong -> bam xem chi tiet ====== */}
      {tab === "Đồng hồ" && (
        <div className="space-y-5">
          {groups.map(([coll, list]) => {
            const info = getCollectionInfo(coll);
            return (
              <section key={coll}>
                <div className="mb-1.5 flex items-baseline gap-2 px-0.5">
                  <h3 className="font-display text-base font-semibold text-ivory">{coll}</h3>
                  <span className="font-tech text-[11px] text-taupe">{list.length} mẫu</span>
                  {info && <span className="truncate text-[11px] text-sage">· {info.tagline}</span>}
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((w) => (
                    <WatchCard key={w.id} w={w} onClick={() => { setSelected(w); playTap(); }} />
                  ))}
                </div>
              </section>
            );
          })}
          {groups.length === 0 && <Empty />}
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
                <button
                  onClick={() => { setBrand(c.brand); setTab("Đồng hồ"); setQ(c.collection); playTap(); }}
                  className="cyber rounded-[var(--r-xs)] border border-hairline px-2 py-0.5 text-[11px] text-gold-300 active:scale-95"
                >
                  Xem {COUNTS.get(c.collection)} mẫu →
                </button>
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
                <span className="rounded-[var(--r-sm)] border border-hairline px-2 py-0.5 text-[10px] text-taupe">
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

      {/* ====== MODAL CHI TIET ====== */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-ink/85 backdrop-blur-sm" />
          <div
            className="relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-[var(--r-xl)] border border-hairline bg-surface p-5 pb-8 shadow-2xl sm:rounded-[var(--r-xl)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { setSelected(null); playTap(); }}
              aria-label="Đóng"
              className="cyber sticky top-0 z-20 ml-auto grid h-9 w-9 place-items-center rounded-[var(--r-full)] border border-hairline bg-surface text-taupe active:scale-90"
            >
              <IconClose className="h-5 w-5" />
            </button>
            <div className="-mt-7">
              <WatchDetail watch={selected} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WatchCard({ w, onClick }: { w: Watch; onClick: () => void }) {
  return (
    <button onClick={onClick} className="cyber card-lux group p-4 text-left transition active:scale-[0.98]">
      <div className="flex gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[var(--r-lg)] ring-1 ring-hairline">
          <WatchVisual watch={w} size={64} className="h-16 w-16" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded border border-hairline px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-luxe text-gold-300">
              {w.brand}
            </span>
            <span className="truncate font-display text-[15px] font-semibold text-ivory">{enLabel(w)}</span>
          </div>
          <p className="truncate text-[11px] text-taupe">VN: {w.model}</p>
          <div className="mt-0.5 flex flex-wrap gap-x-3 text-[11px]">
            {w.reference && <span className="font-mono text-taupe">Ref. {w.reference}</span>}
            {w.colorEn && <span className="text-gold-300">EN: {w.colorEn}</span>}
            {w.resale && <span className="text-sage">{w.resale}</span>}
          </div>
        </div>
        <IconChevron className="h-4 w-4 shrink-0 self-center text-taupe transition group-hover:translate-x-0.5 group-hover:text-gold-300" />
      </div>
      {w.warning && (
        <p className="mt-2 rounded-[var(--r-xs)] border border-bordeaux bg-bordeaux/15 px-2 py-1 text-[11px] text-ivory">
          <span className="font-bold text-bordeaux">⚠ Custom/Rep</span>
        </p>
      )}
      <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-luxe text-gold-300/70">Bấm xem chi tiết →</p>
    </button>
  );
}

function Empty() {
  return <p className="py-10 text-center text-taupe">Không tìm thấy kết quả.</p>;
}
