"use client";

/**
 * Haptics nhẹ cho mobile (Android hỗ trợ navigator.vibrate; iOS Safari bỏ qua
 * êm ái). Pattern ngắn, tinh tế — "cảm" được nhưng không phiền.
 */
function buzz(pattern: number | number[]) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}

export const hTap = () => buzz(4);
export const hFlip = () => buzz(9);
export const hSwipe = () => buzz(7);
export const hSuccess = () => buzz([10, 40, 16]);
export const hError = () => buzz([45, 55, 45]);
export const hComplete = () => buzz([12, 45, 12, 45, 30]);
export const hLevelUp = () => buzz([10, 40, 10, 40, 10, 70, 45]);
export const hGoal = () => buzz([14, 50, 22]);
