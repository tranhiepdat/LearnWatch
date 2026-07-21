"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import QuizRunner from "@/components/QuizRunner";
import FilterSelect from "@/components/FilterSelect";
import JuicyButton from "@/components/JuicyButton";
import { generateQuiz, type QuizCategory, type QuizQuestion } from "@/lib/quiz";
import { playTap, playPop } from "@/lib/sound";
import { mistakeIds, getProgress } from "@/lib/progress";
import { visibleWatches } from "@/data/watches";
import { useTheme } from "@/lib/theme";
import { IconQuiz, IconBolt, IconRedo } from "@/components/icons";
import type { Brand } from "@/data/types";

type BrandOpt = "Tất cả" | Brand;
type CatOpt = "Tất cả" | QuizCategory;
type Mode = "normal" | "blitz" | "mistakes";

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

function QuizSetup() {
  const params = useSearchParams();
  const { meta } = useTheme();
  const [mode, setMode] = useState<Mode>("normal");
  const [brand, setBrand] = useState<BrandOpt>("Rolex");
  const [cat, setCat] = useState<CatOpt>("Tất cả");
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [nMistakes, setNMistakes] = useState(0);
  const [blitzBest, setBlitzBest] = useState(0);

  useEffect(() => {
    setNMistakes(mistakeIds().length);
    setBlitzBest(getProgress().blitzBest);
    const m = params.get("mode");
    if (m === "blitz") setMode("blitz");
    else if (m === "mistakes" && mistakeIds().length > 0) setMode("mistakes");
  }, [params]);

  function start() {
    playTap();
    if (mode === "mistakes") {
      setQuestions(generateQuiz(Math.min(Math.max(nMistakes * 2, 5), 20), { ids: mistakeIds() }));
    } else if (mode === "blitz") {
      setQuestions(
        generateQuiz(60, {
          brand: brand === "Tất cả" ? undefined : brand,
          category: cat === "Tất cả" ? undefined : cat,
        }),
      );
    } else {
      setQuestions(
        generateQuiz(count, {
          brand: brand === "Tất cả" ? undefined : brand,
          category: cat === "Tất cả" ? undefined : cat,
        }),
      );
    }
  }

  if (questions) {
    return (
      <div className="mx-auto h-full w-full max-w-2xl">
        <QuizRunner
          questions={questions}
          mode={mode}
          onRestart={() => {
            setQuestions(null);
            setNMistakes(mistakeIds().length);
            setBlitzBest(getProgress().blitzBest);
          }}
        />
      </div>
    );
  }

  const modes: { id: Mode; Icon: typeof IconQuiz; title: string; desc: string; disabled?: boolean }[] = [
    { id: "normal", Icon: IconQuiz, title: "Cổ điển", desc: "Chọn hãng, chủ đề, số câu — có giải thích sâu." },
    {
      id: "blitz",
      Icon: IconBolt,
      title: "Blitz 60 giây",
      desc: blitzBest > 0 ? `Đua với thời gian · Kỷ lục: ${blitzBest} câu` : "Đua với thời gian — càng đúng nhanh càng nhiều XP.",
    },
    {
      id: "mistakes",
      Icon: IconRedo,
      title: `Ôn lỗi sai (${nMistakes})`,
      desc: nMistakes > 0 ? "Trả lời đúng để xoá nợ — cách nhớ lâu nhất." : "Chưa có câu sai nào. Quá đỉnh!",
      disabled: nMistakes === 0,
    },
  ];

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="label-luxe">Trắc nghiệm</p>
        <h1 className="font-display text-3xl font-semibold text-ivory">Thử tài nhận diện</h1>
        <p className="mt-1 text-sm text-taupe">Mỗi câu đúng +10 XP · đúng liên tiếp có combo thưởng thêm.</p>
      </div>

      {/* chọn CHẾ ĐỘ chơi */}
      <div className="grid gap-2.5">
        {modes.map((m, i) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...meta.motion.spring, delay: i * 0.05 }}
            disabled={m.disabled}
            onClick={() => {
              if (m.disabled) return;
              setMode(m.id);
              playPop();
            }}
            className={`cyber flex items-center gap-3 rounded-[var(--r-md)] border p-3.5 text-left transition active:scale-[0.98] ${
              mode === m.id
                ? "border-gold-400 bg-gold-400"
                : m.disabled
                  ? "border-hairline opacity-45"
                  : "border-hairline bg-surface"
            }`}
          >
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-[var(--r-sm)] ${
                mode === m.id ? "bg-white/25 text-onaccent" : "bg-surface-2 text-taupe"
              }`}
            >
              <m.Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-sm font-bold ${mode === m.id ? "text-onaccent" : "text-ivory"}`}>{m.title}</span>
              <span className={`block text-[11px] ${mode === m.id ? "text-onaccent/75" : "text-taupe"}`}>{m.desc}</span>
            </span>
            {mode === m.id && (
              <motion.span layoutId="mode-dot" className="h-2.5 w-2.5 shrink-0 rounded-[var(--r-full)] bg-onaccent" />
            )}
          </motion.button>
        ))}
      </div>

      {mode !== "mistakes" && (
        <>
          <div>
            <p className="label-luxe mb-2">Hãng</p>
            <FilterSelect value={brand} options={BRANDS} counts={QB_COUNTS} onChange={(v) => setBrand(v as BrandOpt)} />
          </div>
          <Picker label="Chủ đề" options={CATS} value={cat} onChange={setCat} />
        </>
      )}

      {mode === "normal" && (
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
      )}

      <JuicyButton
        onClick={start}
        className="w-full rounded-[var(--r-md)] bg-gold-foil py-4 font-display text-lg font-semibold text-onaccent shadow-glow"
      >
        {mode === "blitz" ? "⚡ Vào đua!" : mode === "mistakes" ? "Xoá nợ thôi!" : "Bắt đầu"}
      </JuicyButton>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={null}>
      <QuizSetup />
    </Suspense>
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
      className={`cyber chip text-sm ${active ? "chip-on" : ""}`}
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
