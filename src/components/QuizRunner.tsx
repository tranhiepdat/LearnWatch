"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { QuizQuestion } from "@/lib/quiz";
import { recordQuiz } from "@/lib/progress";

const CAT_COLOR: Record<string, string> = {
  "Biệt danh": "bg-amber-100 text-amber-800",
  "Mẫu mã": "bg-sky-100 text-sky-800",
  "Chất liệu": "bg-violet-100 text-violet-800",
  "Nhìn hình": "bg-rose-100 text-rose-800",
};

export default function QuizRunner({
  questions,
  onRestart,
}: {
  questions: QuizQuestion[];
  onRestart: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedXp, setSavedXp] = useState(0);
  const [streak, setStreak] = useState(0);

  const q = questions[index];
  const total = questions.length;
  const answered = selected !== null;

  function choose(i: number) {
    if (answered) return;
    setSelected(i);
    if (i === q.correctIndex) setCorrectCount((c) => c + 1);
  }

  function next() {
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      const p = recordQuiz(correctCount, total);
      setSavedXp(correctCount * 10);
      setStreak(p.streak);
      setFinished(true);
    }
  }

  const pct = useMemo(() => Math.round((correctCount / Math.max(total, 1)) * 100), [correctCount, total]);

  if (total === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow">
        <p className="text-slate-600">Chưa có câu hỏi cho bộ lọc này.</p>
        <button onClick={onRestart} className="mt-4 rounded-xl bg-slate-900 px-5 py-2 text-white">
          Chọn lại
        </button>
      </div>
    );
  }

  if (finished) {
    const passed = pct >= 70;
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
        <div className="text-6xl">{passed ? "🎉" : "💪"}</div>
        <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
          {passed ? "Tuyệt vời!" : "Cố thêm chút nữa!"}
        </h2>
        <p className="mt-1 text-slate-600">
          Đúng <span className="font-bold text-slate-900">{correctCount}</span>/{total} câu ({pct}%)
        </p>

        <div className="mx-auto mt-5 grid max-w-xs grid-cols-2 gap-3">
          <div className="rounded-2xl bg-amber-50 p-4">
            <p className="text-2xl font-extrabold text-amber-600">+{savedXp}</p>
            <p className="text-xs text-amber-700">XP nhận được</p>
          </div>
          <div className="rounded-2xl bg-orange-50 p-4">
            <p className="text-2xl font-extrabold text-orange-600">🔥 {streak}</p>
            <p className="text-xs text-orange-700">Chuỗi ngày học</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={onRestart}
            className="flex-1 rounded-xl bg-rolex py-3 font-bold text-white transition hover:opacity-90"
          >
            Làm bộ mới
          </button>
          <Link
            href="/"
            className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* thanh tien do */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-rolex transition-all duration-300"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-slate-500">
          {index + 1}/{total}
        </span>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-xl">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${CAT_COLOR[q.category] ?? "bg-slate-100 text-slate-700"}`}>
          {q.category}
        </span>
        <h2 className="mt-3 text-lg font-bold leading-snug text-slate-900">{q.prompt}</h2>

        {q.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={q.image}
            alt="Đồng hồ cần nhận diện"
            className="mx-auto mt-3 h-60 w-60 rounded-2xl object-cover shadow-md"
          />
        )}

        <div className="mt-4 grid gap-2.5">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isSelected = i === selected;
            let style = "border-slate-200 bg-white hover:border-slate-400";
            if (answered) {
              if (isCorrect) style = "border-emerald-500 bg-emerald-50 text-emerald-900";
              else if (isSelected) style = "border-red-400 bg-red-50 text-red-900";
              else style = "border-slate-200 bg-white opacity-60";
            }
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={answered}
                className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition ${style}`}
              >
                <span>{opt}</span>
                {answered && isCorrect && <span>✓</span>}
                {answered && isSelected && !isCorrect && <span>✕</span>}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">
              {selected === q.correctIndex ? "✅ Chính xác!" : "❌ Chưa đúng"}
            </p>
            <p className="mt-1">{q.explanation}</p>
          </div>
        )}
      </div>

      {answered && (
        <button
          onClick={next}
          className="mt-4 w-full rounded-2xl bg-rolex py-3.5 font-bold text-white transition hover:opacity-90"
        >
          {index + 1 < total ? "Câu tiếp theo →" : "Xem kết quả"}
        </button>
      )}
    </div>
  );
}
