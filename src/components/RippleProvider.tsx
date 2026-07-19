"use client";

import { useEffect } from "react";

/**
 * Ripple lan từ điểm chạm trên mọi phần tử .cyber — phản hồi tương tác
 * TOÀN CỤC DUY NHẤT (màu/blend theo --fx-* của theme). Hạt văng chỉ còn
 * ở nút chính (JuicyButton) và khoảnh khắc thưởng (GoldBurst) — không
 * bắn mỗi lần chạm nữa cho đỡ nhiễu.
 */
export default function RippleProvider() {
  useEffect(() => {
    function onDown(e: PointerEvent) {
      const target = e.target as HTMLElement | null;
      const el = target?.closest?.(".cyber") as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return;
      const d = Math.max(rect.width, rect.height) * 2.2;
      const span = document.createElement("span");
      span.className = "ripple";
      span.style.width = `${d}px`;
      span.style.height = `${d}px`;
      span.style.left = `${e.clientX - rect.left}px`;
      span.style.top = `${e.clientY - rect.top}px`;
      el.appendChild(span);
      window.setTimeout(() => span.remove(), 600);

      // PRESS-POP: nút nhỏ nào cũng có motion — lún nhẹ khi bấm rồi bật nảy lại.
      // Bỏ qua phần tử framer đã tự transform (data-no-pop / đang có inline
      // transform) và khối lớn (card) để không giật.
      if (el.hasAttribute("data-no-pop") || el.style.transform || rect.height > 220) return;
      const prevT = el.style.transition;
      el.style.transition = "transform 0.17s cubic-bezier(0.34, 1.55, 0.6, 1)";
      el.style.transform = "scale(0.93)";
      const release = () => {
        el.style.transform = "";
        window.setTimeout(() => {
          if (!el.style.transform) el.style.transition = prevT;
        }, 190);
        window.removeEventListener("pointerup", release);
        window.removeEventListener("pointercancel", release);
      };
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", release);
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
