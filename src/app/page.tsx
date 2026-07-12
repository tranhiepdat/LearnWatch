"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProgressHeader from "@/components/ProgressHeader";
import CollectionInfo from "@/components/CollectionInfo";
import { IconCards, IconQuiz, IconBook, IconChat, IconChevron, IconRedo, IconBolt } from "@/components/icons";
import { visibleWatches } from "@/data/watches";
import { terms } from "@/data/terms";
import { collectionInfos } from "@/data/collections";
import { mistakeIds } from "@/lib/progress";
import { playTap } from "@/lib/sound";
import { useTheme } from "@/lib/theme";

const FEATURED = ["Submariner", "GMT-Master II", "Cosmograph Daytona", "Speedmaster", "Royal Oak", "Nautilus"];

// desc NGẮN — đỡ rối chữ, để hình khối nói chuyện
const MODES = [
  { href: "/flashcards", Icon: IconCards, title: "Flashcard", desc: "Vuốt & lật thẻ", tint: 0 },
  { href: "/quiz", Icon: IconQuiz, title: "Trắc nghiệm", desc: "Combo thưởng XP", tint: 1 },
  { href: "/browse", Icon: IconBook, title: "Tra cứu", desc: "Tìm nhanh khi tư vấn", tint: 2 },
  { href: "/assistant", Icon: IconChat, title: "Trợ lý AI", desc: "Hỏi mẫu, giá, thuật ngữ", tint: 3 },
];

// màu tile cozy (kẹo đặc) & dreamy (lilac nhạt dần)
const TILE_COZY = ["#ff5e3a", "#00c48c", "#ffb020", "#8b5cf6"];
const TILE_DREAM = ["#a855f7", "#c084fc", "#ec4899", "#8b5cf6"];

/** Ô icon có "phông nền" trang trí riêng từng theme — vector thay cho chữ */
function IconTile({ Icon, tint }: { Icon: typeof IconCards; tint: number }) {
  const { theme } = useTheme();
  if (theme === "cozy") {
    return (
      <span
        className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--r-sm)] text-white"
        style={{ background: TILE_COZY[tint], boxShadow: `0 5px 0 0 ${TILE_COZY[tint]}55, inset 0 2px 0 rgba(255,255,255,0.4)` }}
      >
        <Icon className="h-7 w-7" />
      </span>
    );
  }
  if (theme === "dreamy") {
    return (
      <span className="relative grid h-14 w-14 shrink-0 place-items-center text-onaccent">
        <span className="absolute inset-0 rotate-6" style={{ background: TILE_DREAM[tint], borderRadius: "26%" }} />
        <span className="absolute inset-0 -rotate-3 opacity-40" style={{ background: TILE_DREAM[(tint + 1) % 4], borderRadius: "26%" }} />
        <Icon className="relative z-10 h-7 w-7" />
      </span>
    );
  }
  if (theme === "apple") {
    return (
      <span
        className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--r-sm)] text-white"
        style={{
          background: "rgba(255,255,255,0.22)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 20px -8px rgba(20,40,120,0.4)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Icon className="h-7 w-7 drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
      </span>
    );
  }
  if (theme === "studio") {
    return (
      <span className="relative grid h-14 w-14 shrink-0 place-items-center text-gold-300">
        <span className="absolute inset-0 border-[1.5px] border-white/70" />
        {["-left-[3px] -top-[3px]", "-right-[3px] -top-[3px]", "-left-[3px] -bottom-[3px]", "-right-[3px] -bottom-[3px]"].map((pos) => (
          <span key={pos} className={`absolute h-[6px] w-[6px] bg-white ${pos}`} />
        ))}
        <Icon className="h-7 w-7" />
      </span>
    );
  }
  return (
    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--r-sm)] border border-hairline text-gold-300 shadow-glow">
      <Icon className="h-7 w-7" style={{ filter: "drop-shadow(0 0 6px rgb(var(--c-accent) / 0.8))" }} />
    </span>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 11) return "Chào buổi sáng ☀️";
  if (h < 13) return "Chào buổi trưa 🍜";
  if (h < 18) return "Chào buổi chiều 🌤";
  return "Chào buổi tối 🌙";
}

export default function Home() {
  const { meta } = useTheme();
  const [mistakes, setMistakes] = useState(0);
  const [greet, setGreet] = useState("Chào bạn 👋");

  useEffect(() => {
    setGreet(greeting());
    const read = () => setMistakes(mistakeIds().length);
    read();
    window.addEventListener("lw:progress", read);
    return () => window.removeEventListener("lw:progress", read);
  }, []);

  const rx = visibleWatches.filter((w) => w.brand === "Rolex").length;
  const brandCount = new Set(visibleWatches.map((w) => w.brand)).size;
  const collCount = collectionInfos.filter((c) => visibleWatches.some((w) => w.collection === c.collection)).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pt-2">
      <div>
        <p className="text-sm text-taupe">{greet}</p>
        <h1 className="font-display text-2xl font-bold text-ivory">Hôm nay học gì?</h1>
      </div>

      <ProgressHeader />

      {/* CTA thông minh: có nợ lỗi sai → ôn ngay; không thì rủ chơi Blitz */}
      {mistakes > 0 ? (
        <Link
          href="/quiz?mode=mistakes"
          onClick={() => playTap()}
          className="cyber flex items-center gap-3 rounded-[var(--r-md)] border border-bordeaux/60 bg-bordeaux/10 p-3.5 active:scale-[0.98]"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--r-sm)] bg-bordeaux/15 text-bordeaux">
            <IconRedo className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-ivory">Ôn {mistakes} câu từng sai</span>
            <span className="block text-[11px] text-taupe">Trả lời đúng để xoá nợ — nhớ lâu gấp đôi đó!</span>
          </span>
          <IconChevron className="h-5 w-5 shrink-0 text-bordeaux" />
        </Link>
      ) : (
        <Link
          href="/quiz?mode=blitz"
          onClick={() => playTap()}
          className="cyber flex items-center gap-3 rounded-[var(--r-md)] border border-gold-700/50 bg-gold-500/10 p-3.5 active:scale-[0.98]"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--r-sm)] bg-gold-500/15 text-gold-300">
            <IconBolt className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-ivory">Thử thách Blitz 60 giây ⚡</span>
            <span className="block text-[11px] text-taupe">Trả lời nhanh nhất có thể — phá kỷ lục của chính bạn!</span>
          </span>
          <IconChevron className="h-5 w-5 shrink-0 text-gold-300" />
        </Link>
      )}

      {/* 4 chế độ — lưới 2×2, icon to, chữ tối giản */}
      <section className="grid grid-cols-2 gap-3">
        {MODES.map((m, i) => (
          <motion.div
            key={m.href}
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...meta.motion.spring, delay: 0.05 * i }}
          >
            <Link
              href={m.href}
              onClick={() => playTap()}
              className="cyber group flex flex-col items-start gap-3 rounded-[var(--r-md)] border border-hairline bg-surface p-4 transition active:scale-[0.96]"
            >
              <IconTile Icon={m.Icon} tint={m.tint} />
              <span>
                <span className="block text-base font-bold leading-tight text-ivory">{m.title}</span>
                <span className="mt-0.5 block text-[11px] text-taupe">{m.desc}</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </section>

      <Link href="/inventory" onClick={() => playTap()} className="cyber card-lux group block p-5 active:scale-[0.99]">
        <div className="flex items-center justify-between">
          <p className="label-luxe">Kho hàng · Thư viện</p>
          <span className="text-xs font-semibold text-gold-300">Xem kho →</span>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3 text-center">
          <Stat n={visibleWatches.length} label="Mẫu" />
          <Stat n={brandCount} label="Hãng" />
          <Stat n={rx} label="Rolex" />
          <Stat n={terms.length} label="Thuật ngữ" />
        </div>
      </Link>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="label-luxe">Các dòng đồng hồ</p>
            <h2 className="font-display text-xl font-semibold text-ivory">Dòng này để làm gì?</h2>
          </div>
          <Link
            href="/browse?tab=dong"
            onClick={() => playTap()}
            className="cyber rounded-[var(--r-sm)] border border-hairline px-3 py-1.5 text-xs font-semibold text-gold-300 active:scale-95"
          >
            Xem tất cả {collCount} dòng →
          </Link>
        </div>
        <div className="grid gap-2.5 md:grid-cols-2">
          {FEATURED.map((c) => (
            <CollectionInfo key={c} collection={c} variant="compact" />
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p className="font-tech text-2xl font-extrabold gold-text">{n}</p>
      <p className="text-[11px] text-taupe">{label}</p>
    </div>
  );
}
