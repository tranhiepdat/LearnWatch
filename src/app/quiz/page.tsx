"use client";

import { useState } from "react";
import QuizRunner from "@/components/QuizRunner";
import { generateQuiz, type QuizCategory, type QuizQuestion } from "@/lib/quiz";
import type { Brand } from "@/data/types";

type BrandOpt = "Tất cả" | Brand;
type CatOpt = "Tất cả" | QuizCategory;

const BRANDS: BrandOpt[] = ["Tất cả", "Rolex", "Omega"];
const CATS: CatOpt[] = ["Tất cả", "Biệt danh", "Mẫu mã", "Chất liệu"];
const LENGTHS = [5, 10, 15];

export default function QuizPage() {
  const [brand, setBrand] = useState<BrandOpt>("Tất cả");
  const [cat, setCat] = useState<CatOpt>("Tất cả");
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);

  function start() {
    const qs = generateQuiz(count, {
      brand: brand === "Tất cả" ? undefined : brand,
      category: cat === "Tất cả" ? undefined : cat,
    });
    setQuestions(qs);
  }

  if (questions) {
    return (
      <div className="space-y-4">
        <QuizRunner questions={questions} onRestart={() => setQuestions(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Trắc nghiệm 🎯</h1>
        <p className="mt-1 text-slate-600">Chọn phạm vi rồi bắt đầu. Mỗi câu đúng +10 XP.</p>
      </div>

      <Picker label="Hãng" options={BRANDS} value={brand} onChange={setBrand} />
      <Picker label="Chủ đề" options={CATS} value={cat} onChange={setCat} />

      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-400">Số câu</p>
        <div className="flex gap-2">
          {LENGTHS.map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`rounded-full px-5 py-1.5 text-sm font-semibold transition ${
                count === n ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {n} câu
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={start}
        className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 py-4 text-lg font-extrabold text-white shadow-lg transition hover:opacity-95"
      >
        Bắt đầu →
      </button>
    </div>
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
      <p className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              value === o ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
