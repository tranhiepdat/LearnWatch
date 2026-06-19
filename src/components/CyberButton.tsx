"use client";

import type { ReactNode } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { playTap } from "@/lib/sound";

/**
 * Nút bấm phong cách cyberpunk: khi bấm phát chớp khối màu đặc (emerald) +
 * tia quét chéo + nhún + âm thanh. Dùng thay <button> cho các nút chính.
 */
export default function CyberButton({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  ariaLabel,
  sound = true,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
  sound?: boolean;
}) {
  const flash = useAnimationControls();
  const sweep = useAnimationControls();

  function fire() {
    if (disabled) return;
    flash.set({ opacity: 0.9 });
    flash.start({ opacity: 0, transition: { duration: 0.36, ease: "easeOut" } });
    sweep.set({ x: "-140%", opacity: 1 });
    sweep.start({ x: "210%", opacity: 0, transition: { duration: 0.45, ease: "easeOut" } });
    if (sound) playTap();
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerDown={fire}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      className={`relative isolate overflow-hidden ${className}`}
    >
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={flash}
        className="pointer-events-none absolute inset-0 z-0 bg-gold-400 mix-blend-plus-lighter"
      />
      <motion.span
        aria-hidden
        initial={{ opacity: 0, x: "-140%" }}
        animate={sweep}
        className="pointer-events-none absolute inset-y-0 left-0 z-0 w-1/3 -skew-x-12 bg-white/55 blur-[2px]"
      />
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
