"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useAnimationControls, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";
import FlipBurst from "./FlipBurst";
import GoldBurst from "./GoldBurst";
import { IconCheck, IconClose, IconShuffle } from "./icons";
import { playFlip, playSwipe, playCorrect, playComplete } from "@/lib/sound";
import { hFlip, hSwipe, hSuccess, hComplete } from "@/lib/haptics";
import { useTheme, type ThemeId } from "@/lib/theme";

/**
 * Deck thẻ vuốt DÙNG CHUNG cho mọi loại nội dung học (mẹo bán hàng, câu tiếng
 * Nhật…). Tách riêng khỏi SwipeDeck (vốn gắn chặt với dữ liệu đồng hồ) nhưng
 * dùng CÙNG cơ chế & cùng "tính cách" chuyển động theo theme:
 *   · vuốt PHẢI = đã thuộc · vuốt TRÁI = ôn lại sau · chạm = lật xem mặt sau
 * Chỉ animate transform/opacity → không gây tụt FPS.
 */

const DRAG_FEEL: Record<ThemeId, { rot: number; dur: number; ease: "easeIn" | "easeOut" }> = {
  cozy: { rot: 14, dur: 0.3, ease: "easeIn" },
  game: { rot: 7, dur: 0.2, ease: "easeIn" },
  lux: { rot: 9, dur: 0.34, ease: "easeOut" },
};

export default function LearnDeck<T extends { id: string }>({
  items,
  renderFront,
  renderBack,
  onKnow,
  isKnown,
  onReshuffle,
  knowLabel = "Đã thuộc",
  skipLabel = "Ôn lại",
  emptyText = "Hết thẻ rồi!",
  hint = "Chạm để lật · Vuốt phải nếu đã thuộc",
}: {
  items: T[];
  renderFront: (item: T) => ReactNode;
  renderBack: (item: T) => ReactNode;
  onKnow: (item: T) => void;
  isKnown: (item: T) => boolean;
  onReshuffle?: () => void;
  knowLabel?: string;
  skipLabel?: string;
  emptyText?: string;
  hint?: string;
}) {
  const { theme } = useTheme();
  const feel = DRAG_FEEL[theme];
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [flipBurst, setFlipBurst] = useState(0);
  const [swipeBurst, setSwipeBurst] = useState<{ k: number; dir: 1 | -1 }>({ k: 0, dir: 1 });
  const busy = useRef(false);
  const cardFx = useAnimationControls();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-feel.rot, feel.rot]);
  const likeOpacity = useTransform(x, [15, 90], [0, 1]);
  const nopeOpacity = useTransform(x, [-90, -15], [1, 0]);

  const current = items[index];
  const next = items[index + 1];
  const done = index >= items.length;

  // reset khi đổi bộ thẻ
  useEffect(() => {
    setIndex(0);
    setFlipped(false);
    x.set(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    if (done && items.length > 0) {
      playComplete();
      hComplete();
    }
  }, [done, items.length]);

  function fling(dir: 1 | -1) {
    if (busy.current || !current) return;
    busy.current = true;
    setSwipeBurst((s) => ({ k: s.k + 1, dir }));
    if (dir > 0) {
      playCorrect(1);
      hSuccess();
      if (!isKnown(current)) onKnow(current);
    } else {
      playSwipe();
      hSwipe();
    }
    animate(x, dir * 680, {
      duration: feel.dur,
      ease: feel.ease,
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

  if (items.length === 0 || done) {
    const knownCount = items.filter((i) => isKnown(i)).length;
    return (
      <div className="card-lux flex min-h-[380px] flex-col items-center justify-center gap-3 p-8 text-center">
        <span className="text-4xl">{items.length === 0 ? "📭" : "🎉"}</span>
        <h2 className="font-display text-2xl font-semibold text-ivory">
          {items.length === 0 ? emptyText : "Xong bộ thẻ!"}
        </h2>
        {items.length > 0 && (
          <p className="text-sm text-taupe">
            Đã thuộc <span className="font-bold text-gold-300">{knownCount}</span>/{items.length} thẻ
          </p>
        )}
        {onReshuffle && (
          <button
            onClick={() => {
              setIndex(0);
              setFlipped(false);
              x.set(0);
              onReshuffle();
            }}
            className="cyber mt-2 rounded-[var(--r-md)] bg-gold-400 px-6 py-3 font-bold text-onaccent shadow-glow"
          >
            Học lại (xáo trộn)
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        {/* thẻ nền phía sau — tạo chiều sâu */}
        {next && (
          <div className="absolute inset-x-3 top-3 h-full origin-top scale-[0.94] opacity-40">
            <div className="card-lux h-full" />
          </div>
        )}

        <motion.div
          key={current.id}
          drag="x"
          dragMomentum={false}
          style={{ x, rotate }}
          onDragEnd={onDragEnd}
          onTap={(e) => {
            if (busy.current) return;
            if ((e.target as HTMLElement)?.closest?.("[data-no-flip]")) return;
            if (Math.abs(x.get()) < 8) {
              setFlipped((f) => !f);
              setFlipBurst((k) => k + 1);
              if (theme === "cozy") {
                cardFx.start({
                  scaleX: [1, 1.05, 0.97, 1.01, 1],
                  scaleY: [1, 0.95, 1.04, 0.99, 1],
                  transition: { duration: 0.5, ease: "easeOut" },
                });
              }
              playFlip();
              hFlip();
            }
          }}
          initial={theme === "cozy" ? { scaleX: 0.97, scaleY: 0.92, opacity: 0, y: 10 } : { scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, scaleX: 1, scaleY: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 26 }}
          className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        >
          <motion.div animate={cardFx} className="relative h-full w-full">
            <AnimatePresence initial={false}>
              {!flipped ? (
                <motion.div
                  key="front"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                  className={`card-lux absolute inset-0 flex flex-col overflow-y-auto p-6 ${theme === "game" ? "glitch-in" : ""}`}
                >
                  {renderFront(current)}
                  <p className="mt-auto pt-4 text-center text-[11px] text-taupe">{hint}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="back"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                  className={`card-lux absolute inset-0 flex touch-pan-y flex-col overflow-y-auto overscroll-contain p-6 ${
                    theme === "game" ? "glitch-in" : ""
                  }`}
                >
                  {renderBack(current)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* tem THUỘC / ÔN LẠI bám theo ngón tay */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="pointer-events-none absolute left-5 top-6 rounded-[var(--r-md)] border-[3px] border-gold-300 px-3 py-1 text-sm font-extrabold uppercase tracking-luxe text-gold-300"
          >
            {knowLabel}
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="pointer-events-none absolute right-5 top-6 rounded-[var(--r-md)] border-[3px] border-taupe px-3 py-1 text-sm font-extrabold uppercase tracking-luxe text-taupe"
          >
            {skipLabel}
          </motion.div>
        </motion.div>

        {flipBurst > 0 && <FlipBurst key={flipBurst} />}
        {swipeBurst.k > 0 && <GoldBurst key={`sw${swipeBurst.k}`} small={swipeBurst.dir < 0} />}
      </div>

      {/* nút điều khiển */}
      <div className="mt-3 flex shrink-0 items-center justify-center gap-5">
        <button
          onClick={() => fling(-1)}
          aria-label={skipLabel}
          className="cyber grid h-14 w-14 place-items-center rounded-[var(--r-lg)] bg-surface-2 text-taupe transition"
        >
          <IconClose className="h-6 w-6" />
        </button>
        {onReshuffle && (
          <button
            onClick={() => {
              setIndex(0);
              setFlipped(false);
              x.set(0);
              onReshuffle();
            }}
            aria-label="Xáo trộn"
            className="cyber grid h-11 w-11 place-items-center rounded-[var(--r-lg)] bg-surface-2 text-gold-300 transition"
          >
            <IconShuffle className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={() => fling(1)}
          aria-label={knowLabel}
          className="cyber grid h-14 w-14 place-items-center rounded-[var(--r-lg)] bg-gold-400 text-onaccent shadow-glow transition"
        >
          <IconCheck className="h-6 w-6" />
        </button>
      </div>

      <p className="mt-2 shrink-0 text-center text-[11px] text-taupe">
        {index + 1} / {items.length} · đã thuộc {items.filter((i) => isKnown(i)).length}
      </p>
    </div>
  );
}
