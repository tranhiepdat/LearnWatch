"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

/**
 * Vào trang: MỘT nhịp fade + trồi nhẹ, dịu mắt — cả 5 theme chung cấu trúc,
 * chỉ khác đường cong/độ đàn hồi (đọc từ meta.motion.page).
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
      className="h-full overflow-y-auto overflow-x-hidden px-4 pb-28 pt-1"
    >
      {children}
    </motion.div>
  );
}
