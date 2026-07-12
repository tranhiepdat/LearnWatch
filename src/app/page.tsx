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

const MODES = [
  { href: "/assistant", Icon: IconChat, title: "Trợ lý AI", desc: "Hỏi gì về đồng hồ — tìm mẫu, giá, thuật ngữ, máy/calibre." },
  { href: "/flashcards", Icon: IconCards, title: "Flashcard", desc: "Vuốt & lật thẻ học mẫu mã, biệt danh, chất liệu." },
  { href: "/quiz", Icon: IconQuiz, title: "Trắc nghiệm", desc: "Nhìn hình đoán mẫu, có combo thưởng XP & giải thích sâu." },
  { href: "/browse", Icon: IconBook, title: "Tra cứu", desc: "Tìm nhanh mẫu & thuật ngữ khi đang tư vấn khách." },
];

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

      <section className="grid gap-3 md:grid-cols-2">
        {MODES.map((m, i) => (
          <motion.div
            key={m.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...meta.motion.spring, delay: 0.04 * i }}
          >
            <Link
              href={m.href}
              onClick={() => playTap()}
              className="cyber group flex items-center gap-4 rounded-[var(--r-md)] border border-hairline bg-surface p-4 transition active:scale-[0.98]"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--r-sm)] border border-hairline text-gold-300 transition group-active:scale-110">
                <m.Icon className="h-6 w-6" />
              </span>
              <span className="flex-1">
                <span className="block text-lg font-bold text-ivory">{m.title}</span>
                <span className="block text-xs text-taupe">{m.desc}</span>
              </span>
              <IconChevron className="h-5 w-5 text-taupe transition group-hover:translate-x-0.5 group-hover:text-gold-300" />
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
