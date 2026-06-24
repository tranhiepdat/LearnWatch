"use client";

import Link from "next/link";
import type { Watch } from "@/data/types";
import { hasPhoto } from "@/data/photos";
import WatchVisual from "./WatchVisual";
import CollectionInfo from "./CollectionInfo";
import { englishName } from "@/lib/name";
import ColorTable from "./ColorTable";
import { playTap } from "@/lib/sound";
import { IconChat } from "./icons";

function Spec({ label, value, accent }: { label: string; value?: string; accent?: boolean }) {
  if (!value) return null;
  return (
    <div className="rounded-[4px] border border-hairline px-2 py-1 leading-tight">
      <span className="label-luxe block text-[9px]">{label}</span>
      <span className={accent ? "text-gold-300" : "text-ivory"}>{value}</span>
    </div>
  );
}

/** Khoi THONG TIN DAY DU cua 1 mau — dung o modal Tra cuu (va co the tai su dung). */
export default function WatchDetail({ watch: w }: { watch: Watch }) {
  return (
    <div className="space-y-3">
      {/* Anh + ten */}
      <div className="flex flex-col items-center text-center">
        {hasPhoto(w.id) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/watches/${w.id}.jpg`}
            alt={w.model}
            className="aspect-square w-[min(240px,55vw)] rounded-[8px] object-cover shadow-gold ring-1 ring-hairline"
          />
        ) : (
          <div className="grid aspect-square w-[min(220px,55vw)] place-items-center">
            <WatchVisual watch={w} size={200} forceSvg className="h-full w-full" />
          </div>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-[9px] border border-hairline px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-luxe text-gold-300">
            {w.brand}
          </span>
          <span className="label-luxe">{w.collection}</span>
        </div>
        {w.nickname ? (
          <p className="mt-1 font-display text-3xl font-semibold gold-text">{w.nickname}</p>
        ) : (
          <p className="mt-1 font-display text-xl font-semibold leading-tight text-ivory">{w.model}</p>
        )}
        <p className="mt-0.5 font-tech text-[11px] text-taupe">
          {englishName(w)}
          {w.reference ? ` · ${w.reference}` : ""}
        </p>
      </div>

      {w.warning && (
        <div className="rounded-[6px] border border-bordeaux bg-bordeaux/15 p-2.5 text-[12px] leading-snug text-ivory">
          <span className="font-extrabold uppercase tracking-luxe text-bordeaux">⚠ Cảnh báo xác thực</span>
          <span className="mt-0.5 block">{w.warning}</span>
        </div>
      )}

      {w.tier && <p className="text-xs font-semibold text-gold-300">▸ {w.tier}</p>}

      <div className="rounded-[6px] border border-gold-700/50 bg-gold-500/10 px-3 py-2">
        <span className="label-luxe block text-[9px]">Tên tiếng Anh · English name</span>
        <span className="text-sm font-semibold text-gold-200">{englishName(w)}</span>
        {w.colorEn && <span className="text-[11px] text-taupe"> · {w.colorEn}</span>}
      </div>

      {w.nickname && w.nicknameMeaning && (
        <p className="rounded-[6px] border border-hairline bg-surface-2 p-3 text-sm text-champagne">
          <span className="font-bold">“{w.nickname}”</span> — {w.nicknameMeaning}
        </p>
      )}

      {/* Spec sheet */}
      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
        <Spec label="Năm · Year" value={w.year} accent />
        <Spec label="Cỡ · Size" value={w.caseSize} />
        <Spec label="Máy · Movement" value={w.movement} accent />
        <Spec label="Bezel" value={w.bezelEn} />
        <Spec label="Dây · Strap" value={w.strapEn} />
        <Spec label="Màu · Color (EN)" value={w.colorEn} />
        <Spec label="Giá · Resale" value={w.resale} accent />
      </div>

      <ColorTable watch={w} />

      {w.movementNote && <p className="text-[11px] text-taupe">⚙ {w.movementNote}</p>}

      {w.subdials && (
        <div className="rounded-[6px] border border-gold-700/40 bg-surface-2 p-3">
          <p className="label-luxe text-[9px]">Mặt số &amp; cách dùng · Dials</p>
          <ul className="mt-1.5 space-y-1 text-[11.5px] leading-snug text-ivory/90">
            {w.subdials.split(" | ").map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-gold-400">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {w.materials?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {w.materials.map((m) => (
            <span key={m} className="rounded-[9px] border border-hairline px-2.5 py-1 text-xs text-taupe">
              {m}
            </span>
          ))}
        </div>
      )}

      {w.facts?.length > 0 && (
        <ul className="space-y-1.5 text-sm text-ivory/90">
          {w.facts.map((f, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-gold-400">◆</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      {w.funFact && (
        <p className="rounded-[6px] border border-hairline bg-surface-2 p-3 text-sm text-champagne">✦ {w.funFact}</p>
      )}

      {w.tip && (
        <p className="rounded-[6px] border border-gold-700/40 bg-gold-500/10 p-2.5 text-xs text-gold-300">💡 {w.tip}</p>
      )}

      <CollectionInfo collection={w.collection} variant="full" />

      <Link
        href={`/assistant?id=${w.id}`}
        onClick={() => playTap()}
        className="cyber flex items-center justify-center gap-1.5 rounded-[6px] border border-gold-700/50 bg-gold-500/10 py-2.5 text-xs font-semibold text-gold-300 active:scale-95"
      >
        <IconChat className="h-4 w-4" /> Hỏi AI về mẫu này
      </Link>
    </div>
  );
}
