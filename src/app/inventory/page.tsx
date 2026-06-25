"use client";

import { useMemo, useState } from "react";
import WatchVisual from "@/components/WatchVisual";
import WatchDetail from "@/components/WatchDetail";
import FilterSelect from "@/components/FilterSelect";
import { visibleWatches as watches } from "@/data/watches";
import { enLabel } from "@/lib/name";
import { playTap } from "@/lib/sound";
import { IconClose, IconChevron } from "@/components/icons";
import type { Watch } from "@/data/types";

// ===== Thống kê kho (tĩnh từ thư viện) =====
const TOTAL = watches.length;
const CUSTOM = watches.filter((w) => w.warning).length;
const GENUINE = TOTAL - CUSTOM;
const BRAND_COUNTS: Record<string, number> = {};
watches.forEach((w) => (BRAND_COUNTS[w.brand] = (BRAND_COUNTS[w.brand] ?? 0) + 1));
const BRANDS_SORTED = Object.entries(BRAND_COUNTS).sort((a, b) => b[1] - a[1]);
const MAXB = BRANDS_SORTED[0]?.[1] ?? 1;
const BRAND_OPTIONS = ["Tất cả", ...BRANDS_SORTED.map(([b]) => b)];
const BRAND_OPT_COUNTS: Record<string, number> = { "Tất cả": TOTAL, ...BRAND_COUNTS };
const AUTHS = ["Tất cả", "Chính hãng", "Custom/Rep"] as const;
type Auth = (typeof AUTHS)[number];

export default function InventoryPage() {
  const [brand, setBrand] = useState("Tất cả");
  const [auth, setAuth] = useState<Auth>("Tất cả");
  const [selected, setSelected] = useState<Watch | null>(null);

  const list = useMemo(
    () =>
      watches.filter(
        (w) =>
          (brand === "Tất cả" || w.brand === brand) &&
          (auth === "Tất cả" || (auth === "Custom/Rep" ? !!w.warning : !w.warning)),
      ),
    [brand, auth],
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="label-luxe">Kho hàng · Inventory</p>
        <h1 className="font-display text-3xl font-semibold text-ivory">Tồn kho trong app</h1>
      </div>

      {/* Thống kê tổng */}
      <section className="grid grid-cols-4 gap-2">
        <Stat n={TOTAL} label="Tổng" accent />
        <Stat n={GENUINE} label="Chính hãng" />
        <Stat n={CUSTOM} label="Custom/Rep" warn />
        <Stat n={BRANDS_SORTED.length} label="Hãng" />
      </section>

      {/* Phân bổ theo hãng (thanh ngang) */}
      <section className="card-lux p-4">
        <p className="label-luxe">Theo hãng</p>
        <div className="mt-3 space-y-2">
          {BRANDS_SORTED.map(([b, n]) => (
            <button
              key={b}
              onClick={() => {
                setBrand(b);
                setAuth("Tất cả");
                playTap();
              }}
              className="cyber block w-full text-left active:scale-[0.99]"
            >
              <div className="flex items-center justify-between text-[12px]">
                <span className={brand === b ? "font-semibold text-gold-300" : "text-ivory"}>{b}</span>
                <span className="font-tech text-taupe">{n}</span>
              </div>
              <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-gold-foil" style={{ width: `${(n / MAXB) * 100}%` }} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Bộ lọc */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect label="Hãng" value={brand} options={BRAND_OPTIONS} counts={BRAND_OPT_COUNTS} onChange={setBrand} />
        {AUTHS.map((a) => (
          <button
            key={a}
            onClick={() => {
              setAuth(a);
              playTap();
            }}
            className={`cyber rounded-[5px] px-3 py-1 text-xs font-semibold transition active:scale-95 ${
              auth === a
                ? a === "Custom/Rep"
                  ? "border border-bordeaux bg-bordeaux/15 text-bordeaux"
                  : "border border-gold-500 text-gold-300"
                : "border border-hairline text-taupe"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <p className="text-[12px] text-taupe">
        Đang hiện <span className="font-tech text-gold-300">{list.length}</span> / {TOTAL} mẫu
      </p>

      {/* Lưới mẫu */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((w) => (
          <button
            key={w.id}
            onClick={() => {
              setSelected(w);
              playTap();
            }}
            className="cyber card-lux group p-2.5 text-left transition active:scale-[0.98]"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-[6px] ring-1 ring-hairline">
              <WatchVisual watch={w} size={150} className="h-full w-full" />
              {w.warning && (
                <span className="absolute left-1 top-1 rounded-[3px] bg-bordeaux px-1 py-px text-[8px] font-bold uppercase tracking-luxe text-ivory">
                  ⚠ Rep
                </span>
              )}
            </div>
            <p className="mt-1.5 truncate text-[9px] font-bold uppercase tracking-luxe text-gold-300">{w.brand}</p>
            <p className="line-clamp-2 text-[11px] font-semibold leading-tight text-ivory">{enLabel(w)}</p>
          </button>
        ))}
        {list.length === 0 && <p className="col-span-full py-10 text-center text-taupe">Không có mẫu nào.</p>}
      </div>

      {/* Modal chi tiết */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-ink/85 backdrop-blur-sm" />
          <div
            className="relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-hairline bg-surface p-5 pb-8 shadow-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setSelected(null);
                playTap();
              }}
              aria-label="Đóng"
              className="cyber sticky top-0 z-20 ml-auto grid h-9 w-9 place-items-center rounded-full border border-hairline bg-surface text-taupe active:scale-90"
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

function Stat({ n, label, accent, warn }: { n: number; label: string; accent?: boolean; warn?: boolean }) {
  return (
    <div className="card-lux p-2.5 text-center">
      <p className={`font-tech text-2xl font-extrabold ${warn ? "text-bordeaux" : accent ? "gold-text" : "text-ivory"}`}>{n}</p>
      <p className="text-[10px] text-taupe">{label}</p>
    </div>
  );
}
