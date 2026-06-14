"use client";

import { useMemo, useState } from "react";
import WatchVisual from "@/components/WatchVisual";
import { watches } from "@/data/watches";
import { terms } from "@/data/terms";

type Tab = "Đồng hồ" | "Thuật ngữ";

export default function BrowsePage() {
  const [tab, setTab] = useState<Tab>("Đồng hồ");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const filteredWatches = useMemo(() => {
    if (!query) return watches;
    return watches.filter((w) =>
      [w.model, w.collection, w.nickname, w.reference, w.brand, ...w.materials]
        .filter(Boolean)
        .some((s) => (s as string).toLowerCase().includes(query)),
    );
  }, [query]);

  const filteredTerms = useMemo(() => {
    if (!query) return terms;
    return terms.filter((t) =>
      [t.term, t.short, t.detail, t.brand, t.category].some((s) => s.toLowerCase().includes(query)),
    );
  }, [query]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-slate-900">Tra cứu 📖</h1>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm: Pepsi, Cerachrom, 126710, Co-Axial…"
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-slate-400"
      />

      <div className="flex gap-2">
        {(["Đồng hồ", "Thuật ngữ"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              tab === t ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t} ({t === "Đồng hồ" ? filteredWatches.length : filteredTerms.length})
          </button>
        ))}
      </div>

      {tab === "Đồng hồ" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredWatches.map((w) => (
            <div key={w.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex gap-3">
                <WatchVisual watch={w} size={68} className="shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${
                        w.brand === "Rolex" ? "bg-rolex" : "bg-omega"
                      }`}
                    >
                      {w.brand}
                    </span>
                    {w.nickname && (
                      <span className="truncate text-sm font-bold text-slate-900">{w.nickname}</span>
                    )}
                  </div>
                  <p className="truncate text-sm text-slate-700">{w.collection}</p>
                  {w.reference && <p className="font-mono text-xs text-slate-400">Ref. {w.reference}</p>}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {w.materials.map((m) => (
                  <span key={m} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                    {m}
                  </span>
                ))}
              </div>
              {w.nicknameMeaning && <p className="mt-2 text-xs text-slate-500">{w.nicknameMeaning}</p>}
            </div>
          ))}
          {filteredWatches.length === 0 && <Empty />}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTerms.map((t) => (
            <details key={t.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between gap-2">
                <span className="font-bold text-slate-900">{t.term}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                  {t.brand} · {t.category}
                </span>
              </summary>
              <p className="mt-2 text-sm font-medium text-slate-700">{t.short}</p>
              <p className="mt-1 text-sm text-slate-500">{t.detail}</p>
            </details>
          ))}
          {filteredTerms.length === 0 && <Empty />}
        </div>
      )}
    </div>
  );
}

function Empty() {
  return <p className="col-span-full py-8 text-center text-slate-400">Không tìm thấy kết quả.</p>;
}
