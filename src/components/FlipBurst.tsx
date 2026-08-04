"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

/**
 * Hiệu ứng khi LẬT thẻ — thay lớp glow gradient cũ bằng chất hợp từng theme:
 *  · game — DIGITAL: viền tự vẽ OFFSET chromatic (cyan + magenta lệch) chạy
 *    quanh ô + lớp solid highlight QUÉT LÊN (như ref Framer/Klickhat).
 *  · cozy — vệt sáng ấm QUÉT NGANG, khớp nhịp với cú nén ngang "lật giấy"
 *    của thẻ ở LearnDeck/SwipeDeck.
 *  · lux  — vành champagne mảnh nở ra + ánh nhung quét lên nhẹ.
 */
export default function FlipBurst() {
  const { theme } = useTheme();

  if (theme === "game") {
    return (
      <div className="pointer-events-none absolute inset-0 z-30">
        {/* MẢNG SOLID quét lên — nhân vật chính của cú lật.
            PHẢI có overflow-hidden bọc RIÊNG: mảng này chạy y từ 110% → -110%,
            để hở là nó tràn LÊN TRÊN thẻ, phủ xanh cả tiêu đề + hàng chip.
            (bỏ mixBlendMode: blend làm mất đường composite nhanh) */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: "-110%" }}
            transition={{ duration: 0.42, ease: [0.6, 0, 0.4, 1] }}
            className="absolute inset-x-0 top-0 h-2/3"
            style={{
              background: "linear-gradient(0deg, transparent, rgb(var(--c-accent) / 0.5) 65%, rgb(var(--c-accent)) 100%)",
            }}
          />
        </div>
        {/* 4 KHỐI ĐẶC ở góc bay vào rồi hội tụ. Nằm NGOÀI lớp cắt ở trên, nhưng
            đặt sát mép trong (inset dương) nên không thò ra khỏi thẻ.
            TRƯỚC chỗ này vẽ HAI hình chữ nhật SVG đầy đủ (8 cạnh) lệch nhau 2px
            bằng `pathLength` — framer hiện thực pathLength bằng
            strokeDashoffset, tức PAINT lại mỗi khung hình. */}
        <span className="crn crn-in crn-tl" />
        <span className="crn crn-in crn-tr" />
        <span className="crn crn-in crn-bl" />
        <span className="crn crn-in crn-br" />
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

  // cozy — LẬT GIẤY: một vệt sáng ấm QUÉT NGANG, cùng nhịp 0.34s với cú nén
  // ngang của thẻ, như ánh sáng bắt vào trang giấy đang lật.
  // Trước đây chỗ này là một vòng VIỀN 4px bung ra với ease [0.34, 1.5, 0.6, 1]
  // — cp2y = 1.5 nghĩa là vọt QUA đích rồi lùi lại, tức là lại thêm một cú nảy
  // nữa chồng lên cú nảy của thẻ; mà nó cũng chính là thêm một cái viền.
  // Vệt quét chỉ đi MỘT chiều, không đảo chiều lần nào.
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <motion.div
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-y-0 left-0 w-1/2"
        style={{
          background: "linear-gradient(90deg, transparent, rgb(var(--c-accent) / 0.26), transparent)",
        }}
      />
    </div>
  );
}
