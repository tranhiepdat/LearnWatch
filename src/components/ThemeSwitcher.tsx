"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { THEMES, THEME_IDS, useTheme, type ThemeId } from "@/lib/theme";
import { playPop, playSwitch, playTap } from "@/lib/sound";
import { hFlip, hTap } from "@/lib/haptics";
import { IconPalette, IconCheck } from "./icons";

/**
 * Nút đổi giao diện: mở sheet 3 lựa chọn (mỗi card tự vẽ bằng MÀU CỦA THEME
 * ĐÓ), chọn xong màn hình được "nuốt" bởi một vòng tròn morph màu theme mới
 * lan ra từ đúng điểm chạm → cảm giác biến hình mượt.
 */
export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [morph, setMorph] = useState<{ x: number; y: number; color: string; key: number; d: number } | null>(null);
  const busy = useRef(false);
  // Portal ra body: giữ position:fixed của sheet luôn tính theo viewport, không
  // bị "nhốt" nếu header sau này lại có thuộc tính tạo containing block.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function pick(id: ThemeId, e: React.PointerEvent) {
    if (busy.current || id === theme) {
      setOpen(false);
      return;
    }
    busy.current = true;
    hFlip();
    // Bỏ `* 2`: đường chéo màn hình đã đủ phủ kín từ MỌI điểm xuất phát.
    // Nhân đôi làm texture phình 4 lần (~13.8MB trên máy 390×844) và phải cấp
    // phát ngay lúc chạm → khựng một nhịp đúng lúc người dùng vừa bấm.
    const d = Math.ceil(Math.hypot(window.innerWidth, window.innerHeight));
    setMorph({ x: e.clientX, y: e.clientY, color: THEMES[id].preview.bg, key: Date.now(), d });
    // đổi theme khi vòng tròn đã che ~nửa màn → không thấy "nhảy" màu
    window.setTimeout(() => {
      setTheme(id);
      playSwitch(); // chào bằng giọng của theme MỚI
    }, 200);
    window.setTimeout(() => {
      setOpen(false);
      busy.current = false;
    }, 380);
    window.setTimeout(() => setMorph(null), 900);
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          playPop();
          hTap();
        }}
        aria-label="Đổi giao diện"
        className="cyber grid h-9 w-9 place-items-center rounded-[var(--r-sm)] bg-surface-2 text-gold-300 transition-colors"
      >
        <IconPalette className="h-[18px] w-[18px]" />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="sheet"
            className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/90" onClick={() => { setOpen(false); playTap(); }} />
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              /* will-change: tự cấp layer riêng → bóng nhiều lớp (cozy có 3 lớp)
                 raster đúng 1 lần thay vì repaint mỗi khung hình khi trồi lên */
              style={{ willChange: "transform, opacity" }}
              className="relative z-10 max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-t-[var(--r-xl)] border border-hairline bg-surface p-5 pb-[max(20px,env(safe-area-inset-bottom))] shadow-lux sm:rounded-[var(--r-xl)]"
            >
              <p className="label-luxe">Giao diện</p>
              <h2 className="font-display text-xl font-bold text-ivory">Chọn vibe của bạn</h2>
              <p className="mt-0.5 text-xs text-taupe">Mỗi giao diện có màu, chuyển động & bộ âm thanh riêng.</p>

              <div className="mt-4 space-y-2.5">
                {THEME_IDS.map((id, i) => {
                  const m = THEMES[id];
                  const active = id === theme;
                  return (
                    <motion.button
                      key={id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.06, type: "spring", stiffness: 400, damping: 26 }}
                      whileTap={{ scale: 0.97 }}
                      onPointerUp={(e) => pick(id, e)}
                      data-fx="preview"
                      data-no-pop
                      className="cyber relative flex w-full items-center gap-3.5 overflow-hidden border p-3.5 text-left"
                      style={{
                        background: m.preview.bg,
                        borderColor: active ? m.preview.accent : "rgba(128,128,128,0.25)",
                        borderRadius: "var(--r-md)",
                        boxShadow: active ? `0 0 0 1.5px ${m.preview.accent}, 0 8px 24px -10px ${m.preview.accent}88` : undefined,
                      }}
                    >
                      {/* mini preview: card + nút + chấm màu */}
                      <span
                        className="grid h-12 w-12 shrink-0 place-items-center text-xl"
                        style={{
                          background: m.preview.card,
                          // preview nói đúng ngôn ngữ bo góc của từng theme
                          borderRadius: id === "cozy" ? 20 : id === "lux" ? 10 : 0,
                          border: `1px solid ${m.preview.accent}44`,
                        }}
                      >
                        {m.emoji}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-bold leading-tight" style={{ color: m.preview.text }}>
                          {m.name}
                        </span>
                        <span className="block text-[11px] leading-snug" style={{ color: `${m.preview.text}99` }}>
                          {m.tagline}
                        </span>
                        <span className="mt-1.5 flex items-center gap-1.5">
                          <span className="h-2.5 w-8 rounded-full" style={{ background: m.preview.accent }} />
                          {m.preview.extra.map((c) => (
                            <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                          ))}
                        </span>
                      </span>
                      {active && (
                        <span
                          className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
                          style={{ background: m.preview.accent, color: m.preview.bg }}
                        >
                          <IconCheck className="h-4 w-4" />
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* vòng tròn morph nuốt màn hình khi đổi theme — cũng portal ra body */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {morph && (
              <motion.div
                key={morph.key}
                className="pointer-events-none fixed z-[70]"
                /* base LỚN + scale 0→1 thay cho base 40px scale 90× :
                   cùng hiệu ứng thị giác nhưng texture ~1.4MB thay vì ~52MB */
                style={{
                  left: morph.x,
                  top: morph.y,
                  width: morph.d,
                  height: morph.d,
                  marginLeft: -morph.d / 2,
                  marginTop: -morph.d / 2,
                  background: morph.color,
                  borderRadius: "50%",
                  willChange: "transform",
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.35 } }}
                transition={{ duration: 0.55, ease: [0.3, 0.6, 0.2, 1] }}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
