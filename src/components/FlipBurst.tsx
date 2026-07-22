"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

/**
 * Hiệu ứng khi LẬT thẻ — thay lớp glow gradient cũ bằng chất hợp từng theme:
 *  · game — DIGITAL: viền tự vẽ OFFSET chromatic (cyan + magenta lệch) chạy
 *    quanh ô + lớp solid highlight QUÉT LÊN (như ref Framer/Klickhat).
 *  · cozy — vòng bo tròn NẢY bật ra (card tự squash-stretch ở SwipeDeck).
 *  · lux  — vành champagne mảnh nở ra + ánh nhung quét lên nhẹ.
 */
export default function FlipBurst() {
  const { theme } = useTheme();

  if (theme === "game") {
    return (
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        {/* solid highlight quét LÊN */}
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: "-110%" }}
          transition={{ duration: 0.5, ease: [0.6, 0, 0.4, 1] }}
          className="absolute inset-x-0 top-0 h-2/3"
          style={{
            background: "linear-gradient(0deg, transparent, rgb(var(--c-accent) / 0.55) 65%, rgb(var(--c-accent)) 100%)",
            mixBlendMode: "screen",
          }}
        />
        {/* viền offset chromatic tự vẽ quanh ô (cyan + magenta lệch nhau) */}
        {(
          [
            ["#35e0ff", "translate(0px,0px)", 0],
            ["#ff3df0", "translate(3px,-2px)", 0.05],
          ] as const
        ).map(([c, tf, delay], i) => (
          <svg
            key={i}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            style={{ transform: tf }}
          >
            <motion.rect
              x="1.5"
              y="1.5"
              width="97"
              height="97"
              fill="none"
              stroke={c}
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1, opacity: [1, 1, 0] }}
              transition={{
                pathLength: { duration: 0.5, ease: [0.6, 0, 0.4, 1], delay },
                opacity: { duration: 0.62, times: [0, 0.7, 1], delay },
              }}
            />
          </svg>
        ))}
      </div>
    );
  }

  if (theme === "lux") {
    return (
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        <motion.div
          initial={{ scale: 0.85, opacity: 0.5 }}
          animate={{ scale: 1.08, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-2 rounded-[var(--r-lg)] border"
          style={{ borderColor: "rgb(var(--c-accent))" }}
        />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.72, ease: [0.25, 0.8, 0.25, 1] }}
          className="absolute inset-x-0 top-0 h-1/3"
          style={{ background: "linear-gradient(0deg, transparent, rgb(var(--c-accent) / 0.28))" }}
        />
      </div>
    );
  }

  // cozy — vòng bo tròn NẢY bật ra (card tự nảy squash-stretch ở SwipeDeck)
  return (
    <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center overflow-hidden">
      <motion.div
        initial={{ scale: 0.72, opacity: 0.55 }}
        animate={{ scale: 1.12, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.5, 0.6, 1] }}
        className="absolute inset-3 rounded-[var(--r-lg)] border-4"
        style={{ borderColor: "rgb(var(--c-accent))" }}
      />
    </div>
  );
}
