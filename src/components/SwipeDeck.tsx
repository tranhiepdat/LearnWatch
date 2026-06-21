"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";
import type { Watch } from "@/data/types";
import { hasPhoto } from "@/data/photos";
import WatchVisual from "./WatchVisual";
import FlipBurst from "./FlipBurst";
import GoldBurst from "./GoldBurst";
import Link from "next/link";
import { IconCheck, IconClose, IconShuffle, IconSparkle, IconChat } from "./icons";
import { playFlip, playSwipe, playCorrect, playComplete, playTap } from "@/lib/sound";
import { englishName } from "@/lib/name";
import { colorBreakdown } from "@/lib/colorParts";
import CollectionToggle from "./CollectionToggle";

function BrandTag({ brand }: { brand: Watch["brand"] }) {
  return (
    <span className="rounded-[9px] border border-hairline px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-luxe text-gold-300">
      {brand}
    </span>
  );
}

function Spec({ label, value, accent }: { label: string; value?: string; accent?: boolean }) {
  if (!value) return null;
  return (
    <div className="rounded-[4px] border border-hairline px-2 py-1 leading-tight">
      <span className="label-luxe block text-[9px]">{label}</span>
      <span className={accent ? "text-gold-300" : "text-ivory"}>{value}</span>
    </div>
  );
}

export default function SwipeDeck({
  deck,
  learned,
  onToggleLearned,
  onReshuffle,
}: {
  deck: Watch[];
  learned: string[];
  onToggleLearned: (id: string) => void;
  onReshuffle: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [flipBurst, setFlipBurst] = useState(0);
  const [swipeBurst, setSwipeBurst] = useState<{ k: number; dir: 1 | -1 }>({ k: 0, dir: 1 });
  const busy = useRef(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-16, 16]);
  const likeOpacity = useTransform(x, [15, 90], [0, 1]);
  const nopeOpacity = useTransform(x, [-90, -15], [1, 0]);

  const current = deck[index];
  const next = deck[index + 1];
  const done = index >= deck.length;

  useEffect(() => {
    if (done) playComplete();
  }, [done]);

  // Tai truoc anh cac the sap toi -> khong bi "chop" khi swipe
  useEffect(() => {
    [0, 1, 2, 3].forEach((d) => {
      const w = deck[index + d];
      if (w && hasPhoto(w.id) && typeof window !== "undefined") {
        const im = new window.Image();
        im.src = `/watches/${w.id}.jpg`;
      }
    });
  }, [index, deck]);

  function fling(dir: 1 | -1) {
    if (busy.current || !current) return;
    busy.current = true;
    setSwipeBurst((s) => ({ k: s.k + 1, dir }));
    if (dir > 0) {
      playCorrect();
      if (!learned.includes(current.id)) onToggleLearned(current.id);
    } else {
      playSwipe();
    }
    animate(x, dir * 680, {
      duration: 0.24,
      ease: "easeIn",
      onComplete: () => {
        setFlipped(false);
        setIndex((i) => i + 1);
        x.set(0);
        busy.current = false;
      },
    });
  }

  function onDragEnd(_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (info.offset.x > 75 || info.velocity.x > 300) fling(1);
    else if (info.offset.x < -75 || info.velocity.x < -300) fling(-1);
    else animate(x, 0, { type: "spring", stiffness: 520, damping: 30 });
  }

  if (done) {
    const learnedCount = deck.filter((w) => learned.includes(w.id)).length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-lux flex h-full min-h-[420px] flex-col items-center justify-center gap-4 p-8 text-center"
      >
        <IconSparkle className="h-10 w-10 text-gold-300" />
        <h2 className="font-display text-3xl font-semibold gold-text">Hoàn thành bộ thẻ</h2>
        <p className="text-taupe">
          Bạn đã đánh dấu thuộc <span className="font-bold text-ivory">{learnedCount}</span>/{deck.length} mẫu.
        </p>
        <button
          onClick={() => {
            setIndex(0);
            setFlipped(false);
            x.set(0);
            onReshuffle();
          }}
          className="cyber mt-2 rounded-[6px] bg-gold-foil px-6 py-3 font-bold text-ink shadow-glow active:scale-95"
        >
          Học lại (xáo trộn)
        </button>
      </motion.div>
    );
  }

  const colorLines = colorBreakdown(current);

  return (
    <div className="flex h-full select-none flex-col">
      <div className="relative min-h-0 flex-1">
        {/* the nen phia sau (chieu sau) */}
        {next && (
          <div className="absolute inset-x-3 top-3 h-full origin-top scale-[0.94] opacity-40">
            <div className="card-lux flex h-full items-center justify-center overflow-hidden">
              {hasPhoto(next.id) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/watches/${next.id}.jpg`}
                  alt=""
                  aria-hidden
                  className="h-[55%] w-auto rounded-[6px] object-cover blur-[1px]"
                />
              ) : null}
            </div>
          </div>
        )}

        {/* the tren cung - vuot duoc */}
        <motion.div
          key={current.id}
          drag="x"
          dragMomentum={false}
          style={{ x, rotate }}
          onDragEnd={onDragEnd}
          onTap={(e) => {
            if (busy.current) return;
            // Bo qua tap trong vung "data-no-flip" (vd nut "Ve dong") -> khong lat the
            if ((e.target as HTMLElement)?.closest?.("[data-no-flip]")) return;
            if (Math.abs(x.get()) < 8) {
              setFlipped((f) => !f);
              setFlipBurst((k) => k + 1);
              playFlip();
            }
          }}
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing [perspective:1600px]"
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0, scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1], scale: { duration: 0.45, ease: "easeOut" } }}
            className="relative h-full w-full [transform-style:preserve-3d]"
          >
            {/* MAT TRUOC */}
            <div className="card-lux absolute inset-0 flex flex-col items-center justify-between overflow-hidden p-6 [backface-visibility:hidden]">
              {current.warning && (
                <div className="absolute left-3 top-3 z-10 rounded-[4px] bg-bordeaux px-2 py-1 text-[10px] font-extrabold uppercase tracking-luxe text-ivory shadow-glow">
                  ⚠ Custom / Rep
                </div>
              )}
              <div className="h-px w-full bg-gold-line" />
              <div className="flex w-full items-center justify-between">
                <BrandTag brand={current.brand} />
                <span className="label-luxe">{current.collection}</span>
              </div>

              {hasPhoto(current.id) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/watches/${current.id}.jpg`}
                  alt={current.model}
                  draggable={false}
                  className="aspect-square w-[min(232px,40vh)] rounded-[6px] object-cover shadow-gold ring-1 ring-hairline"
                />
              ) : (
                <div className="grid aspect-square w-[min(224px,40vh)] place-items-center">
                  <WatchVisual watch={current} size={210} forceSvg className="h-full w-full" />
                </div>
              )}

              <div className="text-center">
                {current.nickname ? (
                  <>
                    <p className="label-luxe">Biệt danh</p>
                    <p className="font-display text-4xl font-semibold gold-text">{current.nickname}</p>
                  </>
                ) : (
                  <p className="font-display text-2xl font-semibold leading-tight text-ivory">{current.collection}</p>
                )}
                {current.colorEn && <p className="mt-0.5 text-sm font-medium text-champagne">{current.colorEn}</p>}
                <p className="mt-0.5 font-tech text-[11px] text-taupe">
                  {englishName(current)}
                  {current.reference ? ` · ${current.reference}` : ""}
                </p>
              </div>

              <p className="text-[11px] text-taupe">Chạm để lật · Vuốt phải nếu đã thuộc</p>
            </div>

            {/* MAT SAU */}
            <div className="card-lux absolute inset-0 flex flex-col overflow-y-auto p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="mb-1 flex items-center justify-between">
                <BrandTag brand={current.brand} />
                {current.reference && <span className="font-mono text-xs text-taupe">Ref. {current.reference}</span>}
              </div>
              <h3 className="font-display text-xl font-semibold leading-tight text-ivory">{current.model}</h3>

              {current.warning && (
                <div className="mt-2 rounded-[6px] border border-bordeaux bg-bordeaux/15 p-2.5 text-[12px] leading-snug text-ivory">
                  <span className="font-extrabold uppercase tracking-luxe text-bordeaux">⚠ Cảnh báo xác thực</span>
                  <span className="mt-0.5 block">{current.warning}</span>
                </div>
              )}

              {current.tier && (
                <p className="mt-1.5 text-xs font-semibold text-gold-300">▸ {current.tier}</p>
              )}

              <div className="mt-2 rounded-[6px] border border-gold-700/50 bg-gold-500/10 px-3 py-2">
                <span className="label-luxe block text-[9px]">Tên tiếng Anh · English name</span>
                <span className="text-sm font-semibold text-gold-200">{englishName(current)}</span>
                {current.colorEn && <span className="text-[11px] text-taupe"> · {current.colorEn}</span>}
              </div>

              {current.nickname && current.nicknameMeaning && (
                <p className="mt-2 rounded-[6px] border border-hairline bg-surface-2 p-3 text-sm text-champagne">
                  <span className="font-bold">“{current.nickname}”</span> — {current.nicknameMeaning}
                </p>
              )}

              {/* Spec sheet (thuật ngữ tiếng Anh) */}
              <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px]">
                <Spec label="Năm · Year" value={current.year} accent />
                <Spec label="Cỡ · Size" value={current.caseSize} />
                <Spec label="Máy · Movement" value={current.movement} accent />
                <Spec label="Bezel" value={current.bezelEn} />
                <Spec label="Dây · Strap" value={current.strapEn} />
                <Spec label="Màu · Color (EN)" value={current.colorEn} />
                <Spec label="Giá · Resale" value={current.resale} accent />
              </div>

              {colorLines.length > 0 && (
                <div className="mt-3 rounded-[6px] border border-hairline bg-surface-2 p-3">
                  <p className="label-luxe text-[9px]">Màu nằm ở đâu? · Color location</p>
                  <ul className="mt-1.5 space-y-1.5 text-[11.5px] leading-snug">
                    {colorLines.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-px shrink-0 rounded-[3px] border border-gold-700/50 bg-gold-500/10 px-1.5 py-px text-[9px] font-bold uppercase tracking-luxe text-gold-300">
                          {c.part}
                        </span>
                        <span className="text-ivory/90">
                          <b className="text-champagne">{c.display}</b>
                          {c.note ? ` — ${c.note}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {current.movementNote && (
                <p className="mt-2 text-[11px] text-taupe">⚙ {current.movementNote}</p>
              )}

              {current.subdials && (
                <div className="mt-3 rounded-[6px] border border-gold-700/40 bg-surface-2 p-3">
                  <p className="label-luxe text-[9px]">Mặt số &amp; cách dùng · Dials</p>
                  <ul className="mt-1.5 space-y-1 text-[11.5px] leading-snug text-ivory/90">
                    {current.subdials.split(" | ").map((line, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-gold-400">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {current.materials.map((m) => (
                  <span key={m} className="rounded-[9px] border border-hairline px-2.5 py-1 text-xs text-taupe">
                    {m}
                  </span>
                ))}
              </div>

              <ul className="mt-3 space-y-1.5 text-sm text-ivory/90">
                {current.facts.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-gold-400">◆</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {current.funFact && (
                <p className="mt-3 rounded-[6px] border border-hairline bg-surface-2 p-3 text-sm text-champagne">
                  ✦ {current.funFact}
                </p>
              )}

              {current.tip && (
                <p className="mt-3 rounded-[6px] border border-gold-700/40 bg-gold-500/10 p-2.5 text-xs text-gold-300">
                  💡 {current.tip}
                </p>
              )}

              {/* Ve dong: uu tien thap hon -> de duoi cung, an sau nut bam */}
              <CollectionToggle key={current.id} collection={current.collection} className="mt-3" />

              <div className="h-2 shrink-0" />
            </div>
          </motion.div>

          {/* overlay THUOC / ON LAI */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="pointer-events-none absolute left-5 top-6 rotate-[-12deg] rounded-[6px] border-2 border-gold-300 px-3 py-1 text-sm font-extrabold uppercase tracking-luxe text-gold-300"
          >
            Thuộc
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="pointer-events-none absolute right-5 top-6 rotate-[12deg] rounded-[6px] border-2 border-taupe px-3 py-1 text-sm font-extrabold uppercase tracking-luxe text-taupe"
          >
            Ôn lại
          </motion.div>
        </motion.div>

        {flipBurst > 0 && <FlipBurst key={flipBurst} />}
        {swipeBurst.k > 0 && <GoldBurst key={`sw${swipeBurst.k}`} small={swipeBurst.dir < 0} />}
      </div>

      <Link
        href={`/assistant?id=${current.id}`}
        onClick={() => playTap()}
        className="cyber mt-3 flex shrink-0 items-center justify-center gap-1.5 rounded-[6px] border border-gold-700/50 bg-gold-500/10 py-2 text-xs font-semibold text-gold-300 active:scale-95"
      >
        <IconChat className="h-4 w-4" /> Hỏi AI về mẫu này
      </Link>

      {/* nut dieu khien + tien do */}
      <div className="mt-4 flex shrink-0 items-center justify-center gap-5">
        <button
          onClick={() => fling(-1)}
          aria-label="Ôn lại"
          className="grid h-14 w-14 cyber place-items-center rounded-[9px] border border-hairline text-taupe transition active:scale-90"
        >
          <IconClose className="h-6 w-6" />
        </button>
        <button
          onClick={onReshuffle}
          aria-label="Xáo trộn"
          className="grid h-11 w-11 cyber place-items-center rounded-[9px] border border-hairline text-gold-300 transition active:scale-90"
        >
          <IconShuffle className="h-5 w-5" />
        </button>
        <button
          onClick={() => fling(1)}
          aria-label="Đã thuộc"
          className="grid h-14 w-14 cyber place-items-center rounded-[9px] bg-gold-foil text-ink shadow-glow transition active:scale-90"
        >
          <IconCheck className="h-6 w-6" />
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-taupe">
        {index + 1} / {deck.length} · đã thuộc {deck.filter((w) => learned.includes(w.id)).length}
      </p>
    </div>
  );
}
