"use client";

import { useEffect } from "react";

/**
 * Tạo hiệu ứng "gợn sóng" (ripple) lan ra TỪ ĐIỂM CHẠM trên mọi phần tử có class .cyber.
 * Lắng nghe toàn cục nên không phải gắn vào từng nút.
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
      window.setTimeout(() => span.remove(), 650);
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
