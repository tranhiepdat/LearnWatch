"use client";

import { useState, type ReactNode } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { playTap } from "@/lib/sound";
import { hTap } from "@/lib/haptics";

/**
 * Nút chính "mọng nước" — cùng MỘT khung hành vi, tính cách đổi theo theme:
 *  · đè      → lún (scale theo meta.motion.tap; cozy squash thêm scaleY)
 *  · bấm     → vệt sáng hl-sweep quét qua (màu/tốc độ theo --hl-sheen/--hl-dur)
 *              + hiệu ứng chữ ký riêng: game chớp neon · dreamy bloom tím
 *              · studio khung chọn 4 góc
 *  · thả     → cú nảy DỌC từ meta.motion.pop (scale/y, KHÔNG rotate, KHÔNG lắc)
 */
export default function JuicyButton({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  ariaLabel,
  sound = true,
  variant = "primary",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
  sound?: boolean;
  variant?: "primary" | "ghost";
}) {
  const { theme, meta } = useTheme();
  const flash = useAnimationControls();
  const body = useAnimationControls();
  const [fxKey, setFxKey] = useState(0);

  function firePress() {
    if (disabled) return;
    if (sound) playTap();
    hTap();
    setFxKey((k) => k + 1); // remount hl-sweep + bloom/bracket
    if (theme === "game") {
      flash.set({ opacity: 0.7 });
      flash.start({ opacity: 0, transition: { duration: 0.32, ease: "easeOut" } });
    } else if (theme === "apple") {
      flash.set({ opacity: 0.2 });
      flash.start({ opacity: 0, transition: { duration: 0.4 } });
    }
  }

  function fireRelease() {
    if (disabled) return;
    const pop = meta.motion.pop;
    body.start({ ...pop.keyframes, transition: pop.transition });
  }

  const press = disabled
    ? undefined
    : theme === "cozy"
      ? { scale: meta.motion.tap, scaleY: meta.motion.tap - 0.02 }
      : { scale: meta.motion.tap };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerDown={firePress}
      onPointerUp={fireRelease}
      onPointerLeave={fireRelease}
      whileTap={press}
      animate={body}
      className={`relative isolate ${theme === "studio" ? "" : "overflow-hidden"} ${
        variant === "primary" && theme !== "apple" && theme !== "dreamy" ? "btn3d" : ""
      } ${className}`}
    >
      {/* chớp màu (game) / tint kính (apple) */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={flash}
        className={`pointer-events-none absolute inset-0 z-0 ${
          theme === "game" ? "bg-gold-300 mix-blend-plus-lighter" : "bg-white"
        }`}
        style={{ borderRadius: "inherit" }}
      />
      {/* vệt sáng quét — CSS theo theme, remount mỗi lần bấm */}
      {fxKey > 0 && theme !== "studio" && <span key={`sw${fxKey}`} aria-hidden className="hl-sweep" />}
      {/* bloom hồng-tím nở từ tâm (dreamy) */}
      {theme === "dreamy" && fxKey > 0 && <span key={`bl${fxKey}`} aria-hidden className="bloom" style={{ borderRadius: "inherit" }} />}
      {/* khung chọn flash 4 góc (studio) */}
      {theme === "studio" && fxKey > 0 && (
        <span key={`br${fxKey}`} aria-hidden className="pointer-events-none absolute inset-0 z-[5]">
          <span className="brk brk-tl" style={{ "--ox": "-6px", "--oy": "-6px" } as React.CSSProperties} />
          <span className="brk brk-tr" style={{ "--ox": "6px", "--oy": "-6px" } as React.CSSProperties} />
          <span className="brk brk-bl" style={{ "--ox": "-6px", "--oy": "6px" } as React.CSSProperties} />
          <span className="brk brk-br" style={{ "--ox": "6px", "--oy": "6px" } as React.CSSProperties} />
        </span>
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
