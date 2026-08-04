"use client";

import { useRef, useState, type ReactNode } from "react";
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

  /**
   * MỘT CHỦ SỞ HỮU TRANSFORM DUY NHẤT — `body`.
   *
   * Trước đây nút này có BỐN thứ cùng ghi `scale`: whileTap (0.96), whileHover
   * (1.012), body lúc pointerdown (1→0.94→1), body lúc pointerup (0.96→1.015→1)
   * — và fireRelease còn gắn cả vào onPointerLeave nên chạy hai lần. Chuỗi thật
   * của một cú bấm là 1 → 0.94/0.96 → 1.015 → 1 → 1.012: BỐN lần đảo chiều.
   * Mỗi lần đảo chiều mắt đọc thành "lắc" — đó chính là thứ user chê.
   *
   * Nay whileTap/whileHover bị bỏ hẳn; mọi trạng thái đi qua đúng `body` nên
   * không bao giờ có hai animation tranh nhau một giá trị.
   */
  const held = useRef(false);
  const hovering = useRef(false);

  /** scale lúc rê chuột (digital ĐỨNG YÊN tuyệt đối) */
  const hoverScale = theme === "game" ? 1 : meta.motion.hover.scale;

  function toRest() {
    // reset CẢ scaleX lẫn scaleY: framer cộng dồn scale × scaleX × scaleY, bỏ
    // sót một trục là nút đứng ở tỉ lệ méo vĩnh viễn.
    body.start({
      scale: hovering.current ? hoverScale : 1,
      scaleX: 1,
      scaleY: 1,
      transition: meta.motion.hover.transition,
    });
  }

  function firePress() {
    if (disabled) return;
    if (sound) playTap();
    hTap();
    held.current = true;
    setFxKey((k) => k + 1); // remount 4 góc đặc
    // solid highlight SOLID 100% màu theme chớp lên khi bấm rồi tắt — mọi theme
    flash.set({ opacity: 1 });
    flash.start({ opacity: 0, transition: { duration: theme === "cozy" ? 0.32 : 0.24, ease: "easeOut" } });
    // Phản hồi bắt đầu ngay lúc ĐÈ XUỐNG (trước đây digital không nhúc nhích
    // lúc đè, thả ra mới giật một cái — đọc ra là "chết rồi nhảy").
    //
    // Cozy đè xuống là NÉN BẸT (rộng ra + thấp xuống) — đúng vật lý squash, và
    // quan trọng hơn: dùng CÙNG BỘ KHOÁ scaleX/scaleY với keyframe lúc thả.
    // Trước đây đè bằng `scale` mà thả bằng `scaleX/scaleY` — hai bộ khác nhau
    // nên framer phải NHẢY từ trạng thái đang có sang giá trị đầu của keyframe
    // kia, sinh thêm mấy lần đảo chiều thừa. Đó là chỗ "bounce chưa ổn".
    body.start(
      theme === "cozy"
        ? { scaleX: 1.06, scaleY: 0.9, transition: { duration: 0.09, ease: "easeOut" } }
        : { scale: meta.motion.tap, transition: { duration: 0.09, ease: "easeOut" } },
    );
  }

  function fireRelease() {
    if (disabled || !held.current) return; // chốt: không chạy hai lần
    held.current = false;
    const pop = meta.motion.pop;
    body.start({ ...pop.keyframes, transition: pop.transition }).then(toRest);
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerDown={firePress}
      onPointerUp={fireRelease}
      onPointerEnter={() => {
        hovering.current = true;
        if (!held.current && !disabled) toRest();
      }}
      onPointerLeave={() => {
        hovering.current = false;
        // CHỈ dọn trạng thái — KHÔNG bắn fireRelease như bản cũ (trên desktop,
        // bấm xong rê chuột ra là pop chạy lần thứ hai).
        held.current = false;
        if (!disabled) toRest();
      }}
      animate={body}
      /* KHÔNG dùng .cyber ở đây: .cyber ép overflow:hidden sẽ cắt mất 4 khối
         góc (.crn) của theme digital, và ripple sẽ tranh chấp với flash sẵn có.
         data-fx="hero" nhận tầng hover CSS (glow/scanline) — transform thì do
         MỘT MÌNH `body` sở hữu. */
      data-fx="hero"
      data-no-pop
      data-no-ripple
      className={`relative isolate ${theme === "game" ? "" : "overflow-hidden"} ${
        variant === "primary" ? (theme === "cozy" ? "btn3d" : theme === "lux" ? "btn-lux" : "") : ""
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
      {/* DIGITAL: 4 KHỐI ĐẶC ở góc bay vào rồi hội tụ.
          Thay cho .brk-line (nguyên khung = 4 cạnh) + .hl-sweep (vệt chéo bay
          ra ngoài nút) → bớt hẳn 5 line, và đúng ý "shape solid là chính". */}
      {theme === "game" && fxKey > 0 && (
        <span key={`cr${fxKey}`} aria-hidden>
          <span className="crn crn-tl" />
          <span className="crn crn-tr" />
          <span className="crn crn-bl" />
          <span className="crn crn-br" />
        </span>
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
