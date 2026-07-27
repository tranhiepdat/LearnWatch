"use client";

import { useEffect } from "react";

/**
 * TAP FX toàn cục cho mọi phần tử .cyber:
 *  1. HIGHLIGHT: đĩa màu ĐẶC (accent) lan từ điểm chạm — solid, không mờ.
 *  2. SQUASH & STRETCH: khi THẢ tay, gắn class .tap-pop chạy keyframe trọn vẹn
 *     (bất kể tap nhanh hay chậm) rồi tự gỡ khi animationend.
 *
 * Bản cũ dùng transition trên pointerdown → tap nhanh (~60ms) xoá transform
 * trước khi kịp chạy nên KHÔNG thấy pop. Bản này dùng keyframe trigger lúc thả.
 * Bỏ qua phần tử do framer tự transform ([data-no-pop] / đã có inline transform)
 * và khối lớn (card) để không giật.
 */
export default function RippleProvider() {
  useEffect(() => {
    function onDown(e: PointerEvent) {
      const target = e.target as HTMLElement | null;
      const el = target?.closest?.(".cyber, [data-fx]") as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return;

      // 1) đĩa highlight màu đặc lan ra (nút tự lo highlight riêng thì gắn data-no-ripple)
      if (!el.hasAttribute("data-no-ripple")) {
        const d = Math.max(rect.width, rect.height) * 2.2;
        const span = document.createElement("span");
        span.className = "ripple";
        span.style.width = `${d}px`;
        span.style.height = `${d}px`;
        span.style.left = `${e.clientX - rect.left}px`;
        span.style.top = `${e.clientY - rect.top}px`;
        el.appendChild(span);
        window.setTimeout(() => span.remove(), 550);
      }

      // 2) pop khi THẢ. Bỏ qua nút framer (nó tự lo transform).
      if (el.hasAttribute("data-no-pop") || el.style.transform) return;
      // Khối LỚN (card) không squash được — scale 2% trên 340px = 7px, chóng mặt.
      // Cho nó lớp riêng chỉ đánh ánh sáng, không transform → vẫn có phản hồi.
      const cls = rect.height > 220 ? "tap-pop-lg" : "tap-pop";
      const release = () => {
        window.removeEventListener("pointerup", release);
        window.removeEventListener("pointercancel", release);
        el.classList.remove(cls);
        void el.offsetWidth; // ép reflow để re-trigger animation mỗi lần thả
        el.classList.add(cls);
        const done = (ev: AnimationEvent) => {
          if (ev.target !== el) return; // bỏ qua animationend nổi bọt từ .ripple con
          el.classList.remove(cls);
          el.removeEventListener("animationend", done);
        };
        el.addEventListener("animationend", done);
      };
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", release);
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
