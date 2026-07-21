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
  { href: "/flashcards", Icon: IconCards, title: "Flashcard", desc: "Vuốt & lật thẻ" },
  { href: "/quiz", Icon: IconQuiz, title: "Trắc nghiệm", desc: "Combo thưởng XP" },
  { href: "/browse", Icon: IconBook, title: "Tra cứu", desc: "Tìm nhanh khi tư vấn" },
  { href: "/assistant", Icon: IconChat, title: "Trợ lý AI", desc: "Hỏi mẫu, giá, thuật ngữ" },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 11) return "Chào buổi sáng ☀️";
  if (h < 13) return "Chào buổi trưa 🍜";
  if (h < 18) return "Chào buổi chiều 🌤";
  return "Chào buổi tối 🌙";
}

/** Tiêu đề mục CHUẨN — dùng thống nhất mọi section */
function SectionHeader({ label, title, action }: { label: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <p className="label-luxe">{label}</p>
        <h2 className="font-display text-lg font-bold text-ivory">{title}</h2>
      </div>
      {action}
    </div>
  );
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
        <p className="text-[13px] text-taupe">{greet}</p>
        <h1 className="font-display text-2xl font-bold text-ivory">Hôm nay học gì?</h1>
      </div>

      <ProgressHeader />

      {/* CTA thông minh — MỘT dòng mảnh, không tranh sân khấu */}
      {mistakes > 0 ? (
        <Link
          href="/quiz?mode=mistakes"
          onClick={() => playTap()}
          className="cyber flex items-center gap-3 rounded-[var(--r-md)] bg-bordeaux px-4 py-3 active:scale-[0.99]"
        >
          <IconRedo className="h-5 w-5 shrink-0 text-white" />
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-white">
            Ôn {mistakes} câu từng sai — xoá nợ cho nhớ lâu
          </span>
          <IconChevron className="h-4 w-4 shrink-0 text-white" />
        </Link>
      ) : (
        <Link
          href="/quiz?mode=blitz"
          onClick={() => playTap()}
          className="cyber flex items-center gap-3 rounded-[var(--r-md)] bg-gold-500 px-4 py-3 active:scale-[0.99]"
        >
          <IconBolt className="h-5 w-5 shrink-0 text-onaccent" />
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-onaccent">
            Blitz 60 giây — phá kỷ lục của chính bạn
          </span>
          <IconChevron className="h-4 w-4 shrink-0 text-onaccent" />
        </Link>
      )}

      {/* 4 chế độ — lưới 2×2, MỘT kiểu tile cho mọi theme */}
      <section className="grid grid-cols-2 gap-3">
        {MODES.map((m, i) => (
          <motion.div
            key={m.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...meta.motion.spring, delay: 0.04 * i }}
          >
            <Link
              href={m.href}
              onClick={() => playTap()}
              className="cyber flex flex-col items-start gap-3 rounded-[var(--r-lg)] border border-hairline bg-surface p-4 shadow-lux transition active:scale-[0.97]"
            >
              <span className="tile h-12 w-12">
                <m.Icon className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-[15px] font-bold leading-tight text-ivory">{m.title}</span>
                <span className="mt-0.5 block text-[11px] text-taupe">{m.desc}</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Kho — card số liệu phẳng */}
      <Link href="/inventory" onClick={() => playTap()} className="cyber card-lux block p-4 active:scale-[0.99]">
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
        <SectionHeader
          label="Các dòng đồng hồ"
          title="Dòng này để làm gì?"
          action={
            <Link
              href="/browse?tab=dong"
              onClick={() => playTap()}
              className="cyber chip shrink-0 text-gold-300"
            >
              Tất cả {collCount} dòng →
            </Link>
          }
        />
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
      <p className="font-tech text-xl font-extrabold text-gold-300">{n}</p>
      <p className="text-[11px] text-taupe">{label}</p>
    </div>
  );
}
