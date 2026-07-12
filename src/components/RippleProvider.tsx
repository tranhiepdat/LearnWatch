"use client";

import { useEffect } from "react";

/**
 * FX toàn cục cho mọi phần tử .cyber — lắng nghe pointerdown 1 lần, không cần
 * gắn từng nút. Hiệu ứng đổi theo theme:
 *  · ripple lan từ ĐIỂM CHẠM (màu/blend/hình theo --fx-* trong globals.css;
 *    cozy ripple là blob méo, không phải hình tròn)
 *  · game: mảnh neon (spark) văng ra từ điểm chạm
 *  · cozy: sao/tim pastel bung ra
 *  · apple: chỉ ripple mờ, tối giản đúng chất
 */

const GAME_SPARKS = ["#5cf2ff", "#8a5cff", "#a3f553", "#ff4d6d", "#ffffff"];
const COZY_BITS = [
  { ch: "✦", c: "#ffc53d" },
  { ch: "★", c: "#ff5e3a" },
  { ch: "♥", c: "#ec4899" },
  { ch: "●", c: "#00c48c" },
  { ch: "✿", c: "#8b5cf6" },
];
const DREAM_TILES = ["#c084fc", "#a855f7", "#e9d5ff", "#f0abfc"];

function currentTheme(): string {
  return document.documentElement.getAttribute("data-theme") ?? "game";
}

/** Hạt văng từ điểm chạm — chất liệu khác nhau từng theme */
function spawnBits(x: number, y: number) {
  const theme = currentTheme();
  const n = theme === "game" ? 5 : theme === "apple" ? 2 : 3;
  for (let i = 0; i < n; i++) {
    const el = document.createElement("span");
    el.className = "fx-bit";
    const ang = Math.random() * Math.PI * 2;
    const dist = 26 + Math.random() * 34;
    el.style.setProperty("--x0", `${x}px`);
    el.style.setProperty("--y0", `${y}px`);
    el.style.setProperty("--x1", `${x + Math.cos(ang) * dist}px`);
    el.style.setProperty("--rot", `${(Math.random() * 2 - 1) * 220}deg`);

    if (theme === "game") {
      // mảnh neon vuông
      el.style.setProperty("--y1", `${y + Math.sin(ang) * dist}px`);
      const s = 3 + Math.random() * 3;
      el.style.width = `${s}px`;
      el.style.height = `${s}px`;
      el.style.background = GAME_SPARKS[Math.floor(Math.random() * GAME_SPARKS.length)];
      el.style.boxShadow = "0 0 6px currentColor";
      el.style.setProperty("--s1", "0.2");
    } else if (theme === "apple") {
      // giọt kính trắng lấp lánh
      el.style.setProperty("--y1", `${y + Math.sin(ang) * dist - 12}px`);
      const s = 5 + Math.random() * 4;
      el.style.width = `${s}px`;
      el.style.height = `${s}px`;
      el.style.borderRadius = "9999px";
      el.style.background = "radial-gradient(circle at 35% 30%, #ffffff, rgba(255,255,255,0.35))";
      el.style.setProperty("--s1", "0.3");
      el.style.setProperty("--rot", "0deg");
    } else if (theme === "dreamy") {
      // ô khảm lilac bồng bềnh
      el.style.setProperty("--y1", `${y + Math.sin(ang) * dist - 26}px`);
      const s = 7 + Math.random() * 6;
      el.style.width = `${s}px`;
      el.style.height = `${s}px`;
      el.style.borderRadius = "26%";
      el.style.background = DREAM_TILES[Math.floor(Math.random() * DREAM_TILES.length)];
      el.style.opacity = "0.85";
      el.style.setProperty("--s1", "0.45");
      el.style.animationDuration = "0.9s";
    } else if (theme === "studio") {
      // dấu cộng/chấm handle trắng — chất design tool
      el.style.setProperty("--y1", `${y + Math.sin(ang) * dist}px`);
      if (i % 2 === 0) {
        el.textContent = "+";
        el.style.color = "rgba(255,255,255,0.95)";
        el.style.fontSize = `${11 + Math.random() * 5}px`;
        el.style.fontWeight = "800";
        el.style.lineHeight = "1";
      } else {
        el.style.width = "5px";
        el.style.height = "5px";
        el.style.background = "#fff";
      }
      el.style.setProperty("--s1", "0.4");
    } else {
      // cozy: kẹo glyph màu đặc
      const bit = COZY_BITS[Math.floor(Math.random() * COZY_BITS.length)];
      el.textContent = bit.ch;
      el.style.color = bit.c;
      el.style.fontSize = `${11 + Math.random() * 7}px`;
      el.style.lineHeight = "1";
      el.style.setProperty("--y1", `${y + Math.sin(ang) * dist - 18}px`);
      el.style.setProperty("--s1", "0.5");
    }
    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), 920);
  }
}

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
      spawnBits(e.clientX, e.clientY);
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
