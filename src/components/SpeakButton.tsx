"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { speak, canSpeak } from "@/lib/speech";
import { hTap } from "@/lib/haptics";
import { IconSound } from "./icons";

/**
 * Nút LOA — nghe phát âm câu đang học. Dùng giọng có sẵn của máy.
 * Bấm không lật thẻ (data-no-flip) và không kéo thẻ theo.
 */
export default function SpeakButton({
  text,
  lang = "ja-JP",
  label = "Nghe phát âm",
  className = "",
}: {
  text: string;
  lang?: string;
  label?: string;
  className?: string;
}) {
  const [ok, setOk] = useState(true);
  const [playing, setPlaying] = useState(false);

  // Chỉ ẩn khi máy KHÔNG có Web Speech API. Không ẩn theo danh sách giọng:
  // nhiều máy vẫn đọc được qua giọng hệ thống dù getVoices() trả rỗng lúc đầu.
  useEffect(() => setOk(canSpeak()), []);

  if (!ok) return null;

  return (
    <motion.button
      type="button"
      data-no-flip
      data-no-pop
      aria-label={label}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        speak(text, lang);
        hTap();
        setPlaying(true);
        window.setTimeout(() => setPlaying(false), 900);
      }}
      whileTap={{ scale: 0.88 }}
      animate={playing ? { scale: [1, 1.12, 1] } : { scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`cyber inline-flex h-9 items-center gap-1.5 rounded-[var(--r-full)] bg-gold-400 px-3 text-[11px] font-bold text-onaccent ${className}`}
    >
      <IconSound className="h-4 w-4" />
      Nghe
    </motion.button>
  );
}
