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
  { ch: "✦", c: "#ffb63d" },
  { ch: "★", c: "#ff8a70" },
  { ch: "♥", c: "#ff5c8a" },
  { ch: "●", c: "#2fbf9b" },
  { ch: "✿", c: "#b983ff" },
];

function currentTheme(): string {
  return document.documentElement.getAttribute("data-theme") ?? "game";
}

function spawnBits(x: number, y: number) {
  const theme = currentTheme();
  if (theme === "apple") return;
  const isGame = theme === "game";
  const n = isGame ? 5 : 3;
  for (let i = 0; i < n; i++) {
    const el = document.createElement("span");
    el.className = "fx-bit";
    const ang = Math.random() * Math.PI * 2;
    const dist = 26 + Math.random() * 34;
    el.style.setProperty("--x0", `${x}px`);
    el.style.setProperty("--y0", `${y}px`);
    el.style.setProperty("--x1", `${x + Math.cos(ang) * dist}px`);
    el.style.setProperty("--y1", `${y + Math.sin(ang) * dist - (isGame ? 0 : 18)}px`);
    el.style.setProperty("--rot", `${(Math.random() * 2 - 1) * 220}deg`);
    if (isGame) {
      const s = 3 + Math.random() * 3;
      el.style.width = `${s}px`;
      el.style.height = `${s}px`;
      el.style.background = GAME_SPARKS[Math.floor(Math.random() * GAME_SPARKS.length)];
      el.style.boxShadow = "0 0 6px currentColor";
      el.style.setProperty("--s1", "0.2");
    } else {
      const bit = COZY_BITS[Math.floor(Math.random() * COZY_BITS.length)];
      el.textContent = bit.ch;
      el.style.color = bit.c;
      el.style.fontSize = `${10 + Math.random() * 6}px`;
      el.style.lineHeight = "1";
      el.style.setProperty("--s1", "0.5");
    }
    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), 680);
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
