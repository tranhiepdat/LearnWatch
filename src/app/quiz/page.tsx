"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import QuizRunner from "@/components/QuizRunner";
import FilterSelect from "@/components/FilterSelect";
import { generateQuiz, type QuizCategory, type QuizQuestion } from "@/lib/quiz";
import { playTap } from "@/lib/sound";
import { visibleWatches } from "@/data/watches";
import type { Brand } from "@/data/types";

type BrandOpt = "Tất cả" | Brand;
type CatOpt = "Tất cả" | QuizCategory;

const QB_COUNTS: Record<string, number> = { "Tất cả": visibleWatches.length };
visibleWatches.forEach((w) => (QB_COUNTS[w.brand] = (QB_COUNTS[w.brand] ?? 0) + 1));
const BRANDS: BrandOpt[] = [
  "Tất cả",
  ...(Object.keys(QB_COUNTS).filter((b) => b !== "Tất cả") as Brand[]).sort(
    (a, b) => (QB_COUNTS[b] ?? 0) - (QB_COUNTS[a] ?? 0),
  ),
];
const CATS: CatOpt[] = ["Tất cả", "Nhìn hình", "Thật/Giả", "Dòng", "Biệt danh", "Mẫu mã", "Chất liệu"];
const LENGTHS = [5, 10, 15, 20, 30];

export default function QuizPage() {
  const [brand, setBrand] = useState<BrandOpt>("Rolex");
  const [cat, setCat] = useState<CatOpt>("Tất cả");
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);

  function start() {
    playTap();
    setQuestions(
      generateQuiz(count, {
        brand: brand === "Tất cả" ? undefined : brand,
        category: cat === "Tất cả" ? undefined : cat,
      }),
    );
  }

  if (questions) {
    return (
      <div className="mx-auto h-full w-full max-w-2xl">
        <QuizRunner questions={questions} onRestart={() => setQuestions(null)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-7">
      <div>
        <p className="label-luxe">Trắc nghiệm</p>
        <h1 className="font-display text-3xl font-semibold text-ivory">Thử tài nhận diện</h1>
        <p className="mt-1 text-sm text-taupe">Có cả câu nhìn hình. Mỗi câu đúng +10 XP.</p>
      </div>

      <div>
        <p className="label-luxe mb-2">Hãng</p>
        <FilterSelect value={brand} options={BRANDS} counts={QB_COUNTS} onChange={(v) => setBrand(v as BrandOpt)} />
      </div>
      <Picker label="Chủ đề" options={CATS} value={cat} onChange={setCat} />

      <div>
        <p className="label-luxe mb-2">Số câu</p>
        <div className="flex gap-2">
          {LENGTHS.map((n) => (
            <Chip key={n} active={count === n} onClick={() => setCount(n)}>
              {n} câu
            </Chip>
          ))}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={start}
        className="cyber w-full rounded-[6px] bg-gold-foil py-4 font-display text-lg font-semibold text-ink shadow-glow"
      >
        Bắt đầu
      </motion.button>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => {
        onClick();
        playTap();
      }}
      className={`cyber rounded-[5px] px-4 py-1.5 text-sm font-semibold transition active:scale-95 ${
        active ? "bg-gold-foil text-ink shadow-glow" : "border border-hairline text-taupe"
      }`}
    >
      {children}
    </button>
  );
}

function Picker<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="label-luxe mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Chip key={o} active={value === o} onClick={() => onChange(o)}>
            {o}
          </Chip>
        ))}
      </div>
    </div>
  );
}
