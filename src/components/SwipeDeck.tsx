"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";
import type { Watch } from "@/data/types";
import { hasPhoto } from "@/data/photos";
import WatchVisual from "./WatchVisual";
import { IconCheck, IconClose, IconShuffle, IconSparkle } from "./icons";
import { playFlip, playSwipe, playCorrect, playComplete } from "@/lib/sound";

function BrandTag({ brand }: { brand: Watch["brand"] }) {
  return (
    <span className="rounded-[9px] border border-hairline px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-luxe text-gold-300">
      {brand}
    </span>
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
  const busy = useRef(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-13, 13]);
  const likeOpacity = useTransform(x, [30, 130], [0, 1]);
  const nopeOpacity = useTransform(x, [-130, -30], [1, 0]);

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
    if (dir > 0) {
      playCorrect();
      if (!learned.includes(current.id)) onToggleLearned(current.id);
    } else {
      playSwipe();
    }
    animate(x, dir * 660, {
      duration: 0.28,
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
    if (info.offset.x > 110 || info.velocity.x > 600) fling(1);
    else if (info.offset.x < -110 || info.velocity.x < -600) fling(-1);
    else animate(x, 0, { type: "spring", stiffness: 420, damping: 34 });
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
          className="mt-2 rounded-[6px] bg-gold-foil px-6 py-3 font-bold text-ink shadow-glow active:scale-95"
        >
          Học lại (xáo trộn)
        </button>
      </motion.div>
    );
  }

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
          dragDirectionLock
          dragElastic={0.55}
          dragConstraints={{ left: 0, right: 0 }}
          style={{ x, rotate }}
          onDragEnd={onDragEnd}
          onTap={() => {
            if (busy.current) return;
            if (Math.abs(x.get()) < 8) {
              setFlipped((f) => !f);
              playFlip();
            }
          }}
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing [perspective:1600px]"
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative h-full w-full [transform-style:preserve-3d]"
          >
            {/* MAT TRUOC */}
            <div className="card-lux absolute inset-0 flex flex-col items-center justify-between overflow-hidden p-6 [backface-visibility:hidden]">
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
                  <p className="font-display text-2xl font-semibold text-ivory">{current.collection}</p>
                )}
                {current.reference && (
                  <p className="mt-1 font-mono text-xs text-taupe">Ref. {current.reference}</p>
                )}
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

              {current.nickname && current.nicknameMeaning && (
                <p className="mt-2 rounded-[6px] border border-hairline bg-surface-2 p-3 text-sm text-champagne">
                  <span className="font-bold">“{current.nickname}”</span> — {current.nicknameMeaning}
                </p>
              )}

              {(current.colorEn || current.resale) && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  {current.colorEn && (
                    <div className="rounded-lg border border-hairline px-2.5 py-1.5">
                      <span className="label-luxe block">Color name</span>
                      <span className="text-ivory">{current.colorEn}</span>
                    </div>
                  )}
                  {current.resale && (
                    <div className="rounded-lg border border-hairline px-2.5 py-1.5">
                      <span className="label-luxe block">Resale</span>
                      <span className="text-gold-300">{current.resale}</span>
                    </div>
                  )}
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

              <div className="mt-auto grid grid-cols-2 gap-y-1 pt-3 text-xs text-taupe">
                {current.year && <span className="text-gold-300">📅 {current.year}</span>}
                {current.caseSize && <span>◷ {current.caseSize}</span>}
                {current.movement && <span className="col-span-2">⚙ {current.movement}</span>}
              </div>
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
      </div>

      {/* nut dieu khien + tien do */}
      <div className="mt-4 flex shrink-0 items-center justify-center gap-5">
        <button
          onClick={() => fling(-1)}
          aria-label="Ôn lại"
          className="grid h-14 w-14 place-items-center rounded-[9px] border border-hairline text-taupe transition active:scale-90"
        >
          <IconClose className="h-6 w-6" />
        </button>
        <button
          onClick={onReshuffle}
          aria-label="Xáo trộn"
          className="grid h-11 w-11 place-items-center rounded-[9px] border border-hairline text-gold-300 transition active:scale-90"
        >
          <IconShuffle className="h-5 w-5" />
        </button>
        <button
          onClick={() => fling(1)}
          aria-label="Đã thuộc"
          className="grid h-14 w-14 place-items-center rounded-[9px] bg-gold-foil text-ink shadow-glow transition active:scale-90"
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
