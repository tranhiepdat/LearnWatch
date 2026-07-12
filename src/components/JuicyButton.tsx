"use client";

import { useState, type ReactNode } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { playTap } from "@/lib/sound";
import { hTap } from "@/lib/haptics";

/**
 * Nút "mọng nước" — 5 tính cách theo theme:
 *  · game   — 3D lún + chớp neon + tia quét chéo (spark từ FxProvider)
 *  · apple  — kính: sheen trắng chạy chậm + nảy nhẹ như bong bóng
 *  · cozy   — đất sét: lún sâu inset + squash & stretch thả tay
 *  · dreamy — quầng bloom tím nở từ tâm + nghiêng nhẹ mơ màng
 *  · studio — KHUNG CHỌN trắng flash quanh nút + snap dứt khoát
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
  const [fxKey, setFxKey] = useState(0);

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
      sweep.set({ x: "-130%", opacity: 0.8 });
      sweep.start({ x: "200%", opacity: 0, transition: { duration: 0.6, ease: [0.3, 0.7, 0.3, 1] } });
      flash.set({ opacity: 0.22 });
      flash.start({ opacity: 0, transition: { duration: 0.45 } });
    } else if (theme === "studio" || theme === "dreamy") {
      setFxKey((k) => k + 1); // bracket flash / bloom
      if (theme === "dreamy") {
        sweep.set({ x: "-130%", opacity: 0.5 });
        sweep.start({ x: "200%", opacity: 0, transition: { duration: 0.8, ease: "easeOut" } });
      }
    }
  }

  function fireRelease() {
    if (disabled) return;
    if (theme === "cozy") {
      // đất sét: NẢY BẬT LÊN khỏi mặt đất + squash & stretch giảm dần
      body.start({
        y: [0, -14, 0, -6, 0, -2, 0],
        scale: [0.86, 1.09, 0.97, 1.04, 0.99, 1.01, 1],
        scaleY: [0.84, 1.14, 0.93, 1.06, 0.97, 1.02, 1],
        transition: { duration: 0.72, ease: "easeOut" },
      });
    } else if (theme === "game") {
      body.start({ scale: [0.94, 1.03, 1], transition: { duration: 0.28, ease: "easeOut" } });
    } else if (theme === "studio") {
      body.start({ scale: [0.96, 1.015, 1], transition: { duration: 0.2, ease: "easeOut" } });
    } else if (theme === "apple") {
      body.start({ scale: [0.97, 1.02, 1], transition: { duration: 0.4, type: "spring", stiffness: 300, damping: 16 } });
    } else {
      body.start({ rotate: [0, -0.8, 0.6, 0], transition: { duration: 0.6, ease: "easeOut" } });
    }
  }

  const press = disabled
    ? undefined
    : theme === "cozy"
      ? { scale: 0.86, scaleY: 0.84 }
      : theme === "dreamy"
        ? { scale: meta.motion.tap, rotate: -1.2 }
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
          theme === "game" ? "bg-gold-400 mix-blend-plus-lighter" : "bg-white"
        }`}
        style={{ borderRadius: "inherit" }}
      />
      {/* vệt sáng quét chéo */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, x: "-140%" }}
        animate={sweep}
        className={`pointer-events-none absolute inset-y-0 left-0 z-0 w-1/3 -skew-x-12 ${
          theme === "apple" ? "bg-white/80 blur-[7px]" : theme === "dreamy" ? "bg-white/60 blur-[8px]" : "bg-white/55 blur-[2px]"
        }`}
      />
      {/* bloom tím (dreamy) */}
      {theme === "dreamy" && fxKey > 0 && <span key={`bl${fxKey}`} aria-hidden className="bloom" style={{ borderRadius: "inherit" }} />}
      {/* khung chọn flash (studio) */}
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
