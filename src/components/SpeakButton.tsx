"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { speak, canSpeak, hasVoiceFor } from "@/lib/speech";
import { hTap } from "@/lib/haptics";
import { IconSound, IconClose } from "./icons";

/**
 * Nút LOA — nghe phát âm câu đang học, dùng giọng có sẵn của máy.
 *
 * Nếu máy KHÔNG phát được (thiếu gói giọng, đang bật chế độ im lặng…) thì nói
 * thẳng cho người dùng biết cách khắc phục, thay vì im lặng để họ tưởng app hỏng.
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
  const [supported, setSupported] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [warn, setWarn] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    setSupported(canSpeak());
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  if (!supported) return null;

  const langName = lang.startsWith("ja") ? "tiếng Nhật" : lang.startsWith("en") ? "tiếng Anh" : lang;

  return (
    <span className={`relative inline-flex ${className}`}>
      <motion.button
        type="button"
        data-no-flip
        data-no-pop
        aria-label={label}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          // speak() phải chạy ĐỒNG BỘ ngay trong cử chỉ này (yêu cầu của iOS)
          const r = speak(text, lang);
          hTap();
          setPlaying(true);
          setWarn(null);
          timers.current.push(window.setTimeout(() => setPlaying(false), 900));

          if (!r.started) {
            setWarn("Máy không hỗ trợ đọc.");
          } else if (!r.hasVoice && !hasVoiceFor(lang)) {
            // engine vẫn có thể tự chọn giọng — chỉ cảnh báo khi thật sự trống
            timers.current.push(
              window.setTimeout(() => {
                if (!hasVoiceFor(lang)) {
                  setWarn(`Máy chưa có giọng ${langName}. Kiểm tra nút gạt im lặng, hoặc tải giọng trong Cài đặt → Ngôn ngữ.`);
                }
              }, 500),
            );
          }
          timers.current.push(window.setTimeout(() => setWarn(null), 5200));
        }}
        whileTap={{ scale: 0.88 }}
        animate={playing ? { scale: [1, 1.12, 1] } : { scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="cyber inline-flex h-9 items-center gap-1.5 rounded-[var(--r-full)] bg-gold-400 px-3 text-[11px] font-bold text-onaccent"
      >
        <IconSound className="h-4 w-4" />
        Nghe
      </motion.button>

      {warn && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 top-full z-30 mt-1.5 w-52 rounded-[var(--r-sm)] bg-surface-3 p-2 text-[10.5px] font-medium leading-snug text-ivory shadow-lux"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setWarn(null);
            }}
            aria-label="Đóng"
            className="float-right -mr-0.5 -mt-0.5 text-taupe"
          >
            <IconClose className="h-3 w-3" />
          </button>
          {warn}
        </motion.span>
      )}
    </span>
  );
}
