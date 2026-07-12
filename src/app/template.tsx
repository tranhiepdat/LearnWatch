"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

/**
 * Hiệu ứng VÀO TRANG theo theme (template remount mỗi lần điều hướng):
 *  · game  — trượt ngang kèm nghiêng nhẹ kiểu HUD
 *  · apple — fade + phóng to 0.988→1 êm như iOS
 *  · cozy  — nhún lên spring nảy
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const { theme, meta } = useTheme();
  const pg = meta.motion.page;
  return (
    // key={theme}: đổi theme là REMOUNT — không bị kẹt transform dở dang của
    // theme trước (x/skew/blur đóng băng), và được xem enter-animation mới.
    <motion.div
      key={theme}
      initial={pg.initial}
      animate={pg.animate}
      transition={pg.transition}
      className="h-full overflow-y-auto overflow-x-hidden px-4 pb-28 pt-1"
    >
      {children}
    </motion.div>
  );
}
