"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

/**
 * Vào trang: mỗi theme một tính cách (đọc từ meta.motion.page). Riêng Digital
 * dùng CSS .glitch-cut để "cắt lát" vào trang đúng chất cyberpunk.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const { theme, meta } = useTheme();
  const pg = meta.motion.page;
  return (
    // key={theme}: đổi theme là remount — không kẹt transform dở dang
    <motion.div
      key={theme}
      initial={pg.initial}
      animate={pg.animate}
      transition={pg.transition}
      className={`h-full overflow-y-auto overflow-x-hidden px-4 pb-28 pt-1 ${theme === "game" ? "glitch-cut" : ""}`}
    >
      {children}
    </motion.div>
  );
}
