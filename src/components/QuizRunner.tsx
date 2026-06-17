"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useAnimationControls, animate } from "framer-motion";
import type { QuizQuestion } from "@/lib/quiz";
import { getWatch } from "@/data/watches";
import { hasPhoto } from "@/data/photos";
import { recordQuiz } from "@/lib/progress";
import { playTap, playCorrect, playWrong, playComplete } from "@/lib/sound";
import GoldBurst from "./GoldBurst";
import { IconCheck, IconClose, IconFlame, IconGem } from "./icons";

const CAT_COLOR: Record<string, string> = {
  "Biệt danh": "text-gold-300",
  "Mẫu mã": "text-sage",
  "Chất liệu": "text-champagne",
  "Nhìn hình": "text-bordeaux",
};

function Counter({ to }: { to: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(0, to, { duration: 0.9, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [to]);
  return <>{v}</>;
}

export default function QuizRunner({ questions, onRestart }: { questions: QuizQuestion[]; onRestart: () => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedXp, setSavedXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const shake = useAnimationControls();

  const q = questions[index];
  const total = questions.length;
  const answered = selected !== null;
  const watch = q?.watchId ? getWatch(q.watchId) : undefined;
  const pct = useMemo(() => Math.round((correctCount / Math.max(total, 1)) * 100), [correctCount, total]);

  function choose(i: number) {
    if (answered) return;
    setSelected(i);
    if (i === q.correctIndex) {
      setCorrectCount((c) => c + 1);
      setBurstKey((k) => k + 1);
      playCorrect();
    } else {
      playWrong();
      shake.start({ x: [0, -10, 10, -7, 7, 0], transition: { duration: 0.42 } });
    }
  }

  function next() {
    playTap();
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      const p = recordQuiz(correctCount, total);
      setSavedXp(correctCount * 10);
      setStreak(p.streak);
      setFinished(true);
      playComplete();
    }
  }

  if (total === 0) {
    return (
      <div className="card-lux p-8 text-center">
        <p className="text-taupe">Chưa có câu hỏi cho bộ lọc này.</p>
        <button onClick={onRestart} className="mt-4 rounded-2xl bg-gold-foil px-5 py-2.5 font-bold text-ink">
          Chọn lại
        </button>
      </div>
    );
  }

  if (finished) {
    const passed = pct >= 70;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-lux p-8 text-center">
        <p className="label-luxe">{passed ? "Xuất sắc" : "Tiếp tục cố gắng"}</p>
        <h2 className="mt-1 font-display text-4xl font-semibold gold-text">
          {correctCount}/{total}
        </h2>
        <p className="mt-1 text-taupe">{pct}% chính xác</p>

        <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-3">
          <div className="rounded-2xl border border-hairline p-4">
            <IconGem className="mx-auto h-5 w-5 text-gold-300" />
            <p className="mt-1 font-display text-2xl font-semibold text-gold-300">
              +<Counter to={savedXp} />
            </p>
            <p className="text-[11px] text-taupe">XP</p>
          </div>
          <div className="rounded-2xl border border-hairline p-4">
            <IconFlame className="mx-auto h-5 w-5 text-gold-300" />
            <p className="mt-1 font-display text-2xl font-semibold text-gold-300">{streak}</p>
            <p className="text-[11px] text-taupe">chuỗi ngày</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button onClick={onRestart} className="flex-1 rounded-2xl bg-gold-foil py-3 font-bold text-ink shadow-glow active:scale-95">
            Bộ câu mới
          </button>
          <Link href="/" className="flex-1 rounded-2xl border border-hairline py-3 font-bold text-ivory active:scale-95">
            Về trang chủ
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex shrink-0 items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
          <motion.div
            className="h-full rounded-full bg-gold-foil"
            animate={{ width: `${(index / total) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>
        <span className="font-mono text-xs text-taupe">
          {index + 1}/{total}
        </span>
      </div>

      <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div animate={shake} className="card-lux relative overflow-hidden p-6">
            {burstKey > 0 && answered && selected === q.correctIndex && <GoldBurst key={burstKey} />}

            <span className={`label-luxe ${CAT_COLOR[q.category] ?? "text-taupe"}`}>{q.category}</span>
            <h2 className="mt-2 text-lg font-bold leading-snug text-ivory">{q.prompt}</h2>

            {q.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <motion.img
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                src={q.image}
                alt="Đồng hồ cần nhận diện"
                className="mx-auto mt-3 aspect-square w-[min(280px,56vw)] rounded-2xl object-cover shadow-gold ring-1 ring-hairline"
              />
            )}

            <div className="mt-4 grid gap-2.5">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correctIndex;
                const isSelected = i === selected;
                let cls = "border-hairline text-ivory";
                if (answered) {
                  if (isCorrect) cls = "border-gold-400 bg-gold-500/12 text-champagne neon-correct";
                  else if (isSelected) cls = "border-bordeaux bg-bordeaux/10 text-ivory";
                  else cls = "border-hairline text-taupe opacity-55";
                }
                return (
                  <motion.button
                    key={i}
                    onClick={() => choose(i)}
                    disabled={answered}
                    whileTap={{ scale: answered ? 1 : 0.97 }}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${cls}`}
                  >
                    <span>{opt}</span>
                    {answered && isCorrect && <IconCheck className="h-5 w-5 text-gold-300" />}
                    {answered && isSelected && !isCorrect && <IconClose className="h-5 w-5 text-bordeaux" />}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="rounded-2xl border border-hairline bg-surface-2 p-4 text-sm">
                    <p className={`font-semibold ${selected === q.correctIndex ? "text-gold-300" : "text-bordeaux"}`}>
                      {selected === q.correctIndex ? "Chính xác" : "Chưa đúng"}
                    </p>

                    {watch ? (
                      <div className="mt-2.5">
                        <div className="flex gap-3">
                          {hasPhoto(watch.id) && !q.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`/watches/${watch.id}.jpg`}
                              alt={watch.model}
                              className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-hairline"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-display text-base font-semibold leading-tight text-ivory">{watch.model}</p>
                            <p className="text-[11px] text-taupe">
                              {watch.reference && <span className="font-mono">Ref. {watch.reference} · </span>}
                              {watch.year && <span className="text-gold-300">Năm {watch.year}</span>}
                            </p>
                            {watch.colorEn && <p className="text-[11px] text-gold-300">EN: {watch.colorEn}</p>}
                          </div>
                        </div>
                        <p className="mt-2 text-ivory/85">
                          {watch.nickname && watch.nicknameMeaning
                            ? `“${watch.nickname}” — ${watch.nicknameMeaning}`
                            : "Mẫu này không có biệt danh dân chơi phổ biến — dân trong nghề gọi theo cấu hình (chất liệu + màu mặt số), vd “Daytona vàng vàng mặt champagne”."}
                        </p>
                        <p className="mt-1.5 text-champagne">✦ {watch.funFact ?? watch.facts[0]}</p>
                        {watch.resale && (
                          <p className="mt-1.5 text-xs text-taupe">
                            Giá resale tham khảo: <span className="text-gold-300">{watch.resale}</span>
                          </p>
                        )}
                        {watch.tip && <p className="mt-1.5 text-xs text-gold-300">💡 {watch.tip}</p>}
                      </div>
                    ) : (
                      <p className="mt-1 text-ivory/85">{q.explanation}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      </div>

      <AnimatePresence>
        {answered && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={next}
            className="mt-3 w-full shrink-0 rounded-2xl bg-gold-foil py-3.5 font-bold text-ink shadow-glow active:scale-[0.98]"
          >
            {index + 1 < total ? "Câu tiếp theo" : "Xem kết quả"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
