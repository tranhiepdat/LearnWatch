"use client";

import { useRef, type ReactNode } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { playTap } from "@/lib/sound";
import { hTap } from "@/lib/haptics";

/**
 * Nút "mọng nước" — tính cách đổi theo theme:
 *  · game  — 3D lún xuống (cạnh dưới), chớp neon + tia quét chéo, spark văng
 *  · apple — spring scale mượt kiềm chế + vệt sáng specular chạy qua
 *  · cozy  — squash & stretch như thạch + gợn blob, sao nhỏ bung
 * Âm thanh + haptic đi kèm. Dùng cho mọi CTA chính.
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
  const sweep = useAnimationControls();
  const body = useAnimationControls();
  const ref = useRef<HTMLButtonElement>(null);

  function firePress() {
    if (disabled) return;
    if (sound) playTap();
    hTap();
    if (theme === "game") {
      flash.set({ opacity: 0.85 });
      flash.start({ opacity: 0, transition: { duration: 0.34, ease: "easeOut" } });
      sweep.set({ x: "-140%", opacity: 1 });
      sweep.start({ x: "210%", opacity: 0, transition: { duration: 0.42, ease: "easeOut" } });
    } else if (theme === "apple") {
      sweep.set({ x: "-130%", opacity: 0.7 });
      sweep.start({ x: "200%", opacity: 0, transition: { duration: 0.55, ease: [0.3, 0.7, 0.3, 1] } });
      flash.set({ opacity: 0.18 });
      flash.start({ opacity: 0, transition: { duration: 0.4 } });
    }
  }

  function fireRelease() {
    if (disabled) return;
    if (theme === "cozy") {
      // squash & stretch thả tay — nhún như thạch
      body.start({
        scale: [0.88, 1.07, 0.965, 1.015, 1],
        scaleY: [0.86, 1.1, 0.95, 1.02, 1],
        transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
      });
    } else if (theme === "game") {
      body.start({ scale: [0.94, 1.03, 1], transition: { duration: 0.28, ease: "easeOut" } });
    }
  }

  const press = disabled
    ? undefined
    : theme === "cozy"
      ? { scale: 0.88, scaleY: 0.86 }
      : { scale: meta.motion.tap };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerDown={firePress}
      onPointerUp={fireRelease}
      onPointerLeave={fireRelease}
      whileTap={press}
      animate={body}
      className={`relative isolate overflow-hidden ${variant === "primary" && theme !== "apple" ? "btn3d" : ""} ${className}`}
    >
      {/* chớp màu (game) / tint (apple) */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={flash}
        className={`pointer-events-none absolute inset-0 z-0 ${
          theme === "game" ? "bg-gold-400 mix-blend-plus-lighter" : "bg-white"
        }`}
      />
      {/* vệt sáng quét chéo */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, x: "-140%" }}
        animate={sweep}
        className={`pointer-events-none absolute inset-y-0 left-0 z-0 w-1/3 -skew-x-12 ${
          theme === "apple" ? "bg-white/70 blur-[6px]" : "bg-white/55 blur-[2px]"
        }`}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
