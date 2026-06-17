"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import QuizRunner from "@/components/QuizRunner";
import { generateQuiz, type QuizCategory, type QuizQuestion } from "@/lib/quiz";
import { playTap } from "@/lib/sound";
import type { Brand } from "@/data/types";

type BrandOpt = "Tất cả" | Brand;
type CatOpt = "Tất cả" | QuizCategory;

const BRANDS: BrandOpt[] = ["Tất cả", "Rolex", "TAG Heuer", "Omega"];
const CATS: CatOpt[] = ["Tất cả", "Nhìn hình", "Biệt danh", "Mẫu mã", "Chất liệu"];
const LENGTHS = [5, 10, 15];

export default function QuizPage() {
  const [brand, setBrand] = useState<BrandOpt>("Tất cả");
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
      <div className="h-full">
        <QuizRunner questions={questions} onRestart={() => setQuestions(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="label-luxe">Trắc nghiệm</p>
        <h1 className="font-display text-3xl font-semibold text-ivory">Thử tài nhận diện</h1>
        <p className="mt-1 text-sm text-taupe">Có cả câu nhìn hình. Mỗi câu đúng +10 XP.</p>
      </div>

      <Picker label="Hãng" options={BRANDS} value={brand} onChange={setBrand} />
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
        className="w-full rounded-2xl bg-gold-foil py-4 font-display text-lg font-semibold text-ink shadow-glow"
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
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition active:scale-95 ${
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
