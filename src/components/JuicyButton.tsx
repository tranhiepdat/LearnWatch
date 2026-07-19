"use client";

import { useState, type ReactNode } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { playTap } from "@/lib/sound";
import { hTap } from "@/lib/haptics";

/**
 * Nút chính — cùng MỘT khung hành vi, tính cách theo theme:
 *  · cozy — KEYCAP kem: lún sâu 3D, thả ra nảy squash & stretch (bubbly)
 *  · game — DIGITAL: phẳng, khung chọn 4 góc chớp + làn kẻ sắc quét qua
 *  · lux  — BOUTIQUE: glow champagne, vệt sáng lụa quét chậm
 * Mọi phản hồi đều scale/y TẠI CHỖ — không rotate, không lắc ngang.
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
    setFxKey((k) => k + 1); // remount hl-sweep + brackets
    // solid highlight SOLID 100% màu theme chớp lên khi bấm rồi tắt — mọi theme
    flash.set({ opacity: 1 });
    flash.start({ opacity: 0, transition: { duration: theme === "cozy" ? 0.32 : 0.24, ease: "easeOut" } });
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
      className={`relative isolate ${theme === "game" ? "" : "overflow-hidden"} ${
        variant === "primary" && theme === "cozy" ? "btn3d" : ""
      } ${className}`}
    >
      {/* SOLID highlight — phủ kín màu đặc rồi tắt (không gradient, không mờ) */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={flash}
        className={`pointer-events-none absolute inset-0 z-0 ${theme === "game" ? "bg-gold-300 mix-blend-plus-lighter" : "bg-white"}`}
        style={{ borderRadius: "inherit" }}
      />
      {/* scanline sắc quét — CHỈ digital (cyberpunk), các theme khác không dùng vệt gradient */}
      {theme === "game" && fxKey > 0 && <span key={`sw${fxKey}`} aria-hidden className="hl-sweep" />}
      {/* khung chọn 4 góc (digital) */}
      {theme === "game" && fxKey > 0 && (
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
