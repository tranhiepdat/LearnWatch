"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useAnimationControls, animate } from "framer-motion";
import type { QuizQuestion } from "@/lib/quiz";
import { getWatch } from "@/data/watches";
import { hasPhoto } from "@/data/photos";
import { recordQuiz, recordMistake, resolveMistake, recordCombo, recordBlitz, type XpResult } from "@/lib/progress";
import { playTap, playCorrect, playWrong, playComplete, playLevelUp, playGoal, playTick, playTimeUp } from "@/lib/sound";
import { hSuccess, hError, hComplete, hLevelUp } from "@/lib/haptics";
import { useTheme } from "@/lib/theme";
import GoldBurst from "./GoldBurst";
import CollectionToggle from "./CollectionToggle";
import WatchDetail from "./WatchDetail";
import JuicyButton from "./JuicyButton";
import { IconCheck, IconClose, IconFlame, IconGem, IconBook, IconBolt, IconTrophy } from "./icons";

const CAT_COLOR: Record<string, string> = {
  "Biệt danh": "text-gold-300",
  "Mẫu mã": "text-sage",
  "Chất liệu": "text-champagne",
  "Nhìn hình": "text-bordeaux",
  "Dòng": "text-sage",
  "Thật/Giả": "text-bordeaux",
};

/** thưởng combo: từ chuỗi 3 câu đúng liên tiếp có XP cộng thêm */
function comboBonus(combo: number): number {
  if (combo >= 8) return 8;
  if (combo >= 5) return 5;
  if (combo >= 3) return 3;
  return 0;
}

function Counter({ to }: { to: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(0, to, { duration: 0.9, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [to]);
  return <>{v}</>;
}

const BLITZ_SECONDS = 60;

export default function QuizRunner({
  questions,
  onRestart,
  mode = "normal",
}: {
  questions: QuizQuestion[];
  onRestart: () => void;
  /** blitz = đua 60s tự chuyển câu · mistakes = ôn lỗi sai (đúng thì xoá nợ) */
  mode?: "normal" | "blitz" | "mistakes";
}) {
  const { theme, meta } = useTheme();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedXp, setSavedXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [bonusTotal, setBonusTotal] = useState(0);
  const [floats, setFloats] = useState<{ id: number; text: string }[]>([]);
  const [dangerKey, setDangerKey] = useState(0);
  const [levelUp, setLevelUp] = useState<XpResult["level"] | null>(null);
  const [goalHit, setGoalHit] = useState(false);
  const [blitzLeft, setBlitzLeft] = useState(BLITZ_SECONDS);
  const [blitzBestNew, setBlitzBestNew] = useState(false);
  const shake = useAnimationControls();
  const floatId = useRef(0);
  const finRef = useRef(false);
  // refs song song với state — finish() gọi từ setTimeout (blitz) không bị closure cũ
  const correctRef = useRef(0);
  const bonusRef = useRef(0);
  const maxComboRef = useRef(0);

  const isBlitz = mode === "blitz";
  const q = questions[index];
  const total = questions.length;
  const answered = selected !== null;
  const watch = q?.watchId ? getWatch(q.watchId) : undefined;
  const pct = useMemo(() => Math.round((correctCount / Math.max(total, 1)) * 100), [correctCount, total]);

  // ===== đồng hồ BLITZ: đếm ngược, 5s cuối tick, hết giờ chốt sổ =====
  useEffect(() => {
    if (!isBlitz || finished) return;
    if (blitzLeft <= 0) {
      playTimeUp();
      finish();
      return;
    }
    const t = window.setTimeout(() => {
      if (blitzLeft <= 6) playTick();
      setBlitzLeft((s) => s - 1);
    }, 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blitzLeft, isBlitz, finished]);

  function pushFloat(text: string) {
    const id = ++floatId.current;
    setFloats((f) => [...f, { id, text }]);
    window.setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1050);
  }

  function choose(i: number) {
    if (answered || finished) return;
    setSelected(i);
    if (i === q.correctIndex) {
      const newCombo = combo + 1;
      const bonus = comboBonus(newCombo);
      correctRef.current += 1;
      bonusRef.current += bonus;
      maxComboRef.current = Math.max(maxComboRef.current, newCombo);
      setCombo(newCombo);
      setMaxCombo((m) => Math.max(m, newCombo));
      setBonusTotal((b) => b + bonus);
      setCorrectCount((c) => c + 1);
      setBurstKey((k) => k + 1);
      playCorrect(newCombo);
      hSuccess();
      pushFloat(`+${10 + bonus} XP${newCombo >= 3 ? ` · combo x${newCombo}` : ""}`);
      if (mode === "mistakes" && q.watchId) resolveMistake(q.watchId);
      if (isBlitz) window.setTimeout(nextBlitz, 620);
    } else {
      setCombo(0);
      playWrong();
      hError();
      setDangerKey((k) => k + 1);
      shake.start({ x: [0, -10, 10, -7, 7, 0], transition: { duration: 0.42 } });
      if (q.watchId && mode !== "mistakes") recordMistake(q.watchId);
      if (isBlitz) window.setTimeout(nextBlitz, 900);
    }
  }

  function finish() {
    if (finRef.current) return;
    finRef.current = true;
    const correct = correctRef.current;
    const bonus = bonusRef.current;
    const r = recordQuiz(correct, total, bonus);
    recordCombo(maxComboRef.current);
    if (isBlitz) setBlitzBestNew(recordBlitz(correct));
    setSavedXp(correct * 10 + bonus);
    setCorrectCount(correct);
    setMaxCombo(maxComboRef.current);
    setBonusTotal(bonus);
    setStreak(r.p.streak);
    setFinished(true);
    playComplete();
    hComplete();
    if (r.leveledUp) {
      window.setTimeout(() => {
        setLevelUp(r.level);
        playLevelUp();
        hLevelUp();
      }, 900);
    } else if (r.goalJustHit) {
      window.setTimeout(() => {
        setGoalHit(true);
        playGoal();
      }, 900);
    }
  }

  function nextBlitz() {
    setShowDetail(false);
    if (index + 1 < total) {
      setSelected(null);
      setIndex(index + 1);
    } else {
      finish();
    }
  }

  function next() {
    playTap();
    setShowDetail(false);
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      finish();
    }
  }

  if (total === 0) {
    return (
      <div className="card-lux p-8 text-center">
        <p className="text-taupe">
          {mode === "mistakes" ? "Kho lỗi sai trống trơn — quá đỉnh! 🎉" : "Chưa có câu hỏi cho bộ lọc này."}
        </p>
        <JuicyButton onClick={onRestart} className="mt-4 rounded-[var(--r-md)] bg-gold-foil px-5 py-2.5 font-bold text-onaccent">
          Chọn lại
        </JuicyButton>
      </div>
    );
  }

  // ===== MÀN KẾT QUẢ =====
  if (finished) {
    const passed = pct >= 70;
    return (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={meta.motion.bouncy}
          className="card-lux relative overflow-hidden p-8 text-center"
        >
          {passed && <GoldBurst />}
          <p className="label-luxe">
            {isBlitz ? "Blitz 60 giây" : mode === "mistakes" ? "Ôn lỗi sai" : passed ? "Xuất sắc" : "Tiếp tục cố gắng"}
          </p>
          <h2
            className="glitch-flash mt-1 font-tech text-4xl font-semibold gold-text"
            data-text={isBlitz ? `${correctCount} câu` : `${correctCount}/${total}`}
          >
            {isBlitz ? `${correctCount} câu` : `${correctCount}/${total}`}
          </h2>
          <p className="mt-1 text-taupe">{isBlitz ? "trong 60 giây" : `${pct}% chính xác`}</p>
          {isBlitz && blitzBestNew && (
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={meta.motion.bouncy}
              className="mx-auto mt-2 w-fit rounded-[var(--r-full)] bg-gold-foil px-3 py-1 text-xs font-extrabold text-onaccent"
            >
              🏆 KỶ LỤC MỚI!
            </motion.p>
          )}

          <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-3">
            <div className="rounded-[var(--r-md)] border border-hairline p-3.5">
              <IconGem className="mx-auto h-5 w-5 text-gold-300" />
              <p className="mt-1 font-tech text-xl font-semibold text-gold-300">
                +<Counter to={savedXp} />
              </p>
              <p className="text-[11px] text-taupe">XP{bonusTotal > 0 ? ` (+${bonusTotal} combo)` : ""}</p>
            </div>
            <div className="rounded-[var(--r-md)] border border-hairline p-3.5">
              <IconBolt className="mx-auto h-5 w-5 text-gold-300" />
              <p className="mt-1 font-tech text-xl font-semibold text-gold-300">x{maxCombo}</p>
              <p className="text-[11px] text-taupe">combo dài nhất</p>
            </div>
            <div className="rounded-[var(--r-md)] border border-hairline p-3.5">
              <IconFlame className="mx-auto h-5 w-5 text-gold-300" />
              <p className="mt-1 font-tech text-xl font-semibold text-gold-300">{streak}</p>
              <p className="text-[11px] text-taupe">chuỗi ngày</p>
            </div>
          </div>

          {goalHit && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-[var(--r-md)] border border-gold-700/50 bg-gold-500/10 p-2.5 text-sm font-bold text-gold-300"
            >
              🎯 Đạt mục tiêu XP hôm nay — giữ nhịp nhé!
            </motion.p>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <JuicyButton
              onClick={onRestart}
              className="flex-1 rounded-[var(--r-md)] bg-gold-foil py-3 font-bold text-onaccent shadow-glow"
            >
              {isBlitz ? "Đua lại ⚡" : "Bộ câu mới"}
            </JuicyButton>
            <Link
              href="/"
              className="cyber flex-1 rounded-[var(--r-md)] border border-hairline py-3 text-center font-bold text-ivory active:scale-95"
            >
              Về trang chủ
            </Link>
          </div>
        </motion.div>

        {/* ===== KHOẢNH KHẮC LÊN CẤP — mỗi theme một kiểu ===== */}
        <AnimatePresence>
          {levelUp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] grid place-items-center"
              onClick={() => setLevelUp(null)}
            >
              <div className="absolute inset-0 bg-ink/85 backdrop-blur-sm" />
              <motion.div
                initial={theme === "cozy" ? { scale: 0, rotate: -10 } : { scale: 0.6, opacity: 0 }}
                animate={theme === "cozy" ? { scale: 1, rotate: 0 } : { scale: 1, opacity: 1 }}
                transition={meta.motion.bouncy}
                className="card-lux relative z-10 mx-6 max-w-xs overflow-hidden p-8 text-center"
              >
                <GoldBurst />
                <IconTrophy className="mx-auto h-12 w-12 text-gold-300" />
                <p className="label-luxe mt-3">Lên cấp!</p>
                <h3 className="glitch-flash mt-1 font-display text-3xl font-extrabold gold-text" data-text={`Level ${levelUp.level}`}>
                  Level {levelUp.level}
                </h3>
                <p className="mt-1 text-lg font-bold text-ivory">“{levelUp.name}”</p>
                <p className="mt-2 text-xs text-taupe">Chạm để đóng</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ===== MÀN CHƠI =====
  return (
    <div className="flex h-full flex-col">
      {/* viền đỏ nháy khi sai */}
      {dangerKey > 0 && <div key={dangerKey} className="danger-edge" />}

      <div className="mb-3 flex shrink-0 items-center gap-3">
        {isBlitz ? (
          <>
            <div className="h-2.5 flex-1 overflow-hidden rounded-[var(--r-full)] bg-surface-2">
              <motion.div
                className={`h-full rounded-[var(--r-full)] ${blitzLeft <= 10 ? "bg-bordeaux" : "bg-gold-foil"}`}
                animate={{ width: `${(blitzLeft / BLITZ_SECONDS) * 100}%` }}
                transition={{ duration: 0.9, ease: "linear" }}
              />
            </div>
            <motion.span
              key={blitzLeft <= 10 ? blitzLeft : "calm"}
              animate={blitzLeft <= 10 ? { scale: [1, 1.3, 1] } : {}}
              className={`flex items-center gap-1 font-tech text-sm font-bold ${blitzLeft <= 10 ? "text-bordeaux" : "text-gold-300"}`}
            >
              <IconBolt className="h-4 w-4" />
              {blitzLeft}s
            </motion.span>
            <span className="font-tech text-xs text-taupe">{correctCount} ✓</span>
          </>
        ) : (
          <>
            <div className="h-2 flex-1 overflow-hidden rounded-[var(--r-full)] bg-surface-2">
              <motion.div
                className="h-full rounded-[var(--r-full)] bg-gold-foil"
                animate={{ width: `${(index / total) * 100}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              />
            </div>
            <span className="font-tech text-xs text-gold-300">
              {index + 1}/{total}
            </span>
          </>
        )}

        {/* huy hiệu combo — bùng to dần theo chuỗi */}
        <AnimatePresence>
          {combo >= 2 && (
            <motion.span
              key={combo}
              initial={{ scale: 0.4, rotate: theme === "cozy" ? -14 : 0, opacity: 0 }}
              animate={{ scale: combo >= 5 ? 1.15 : 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={meta.motion.bouncy}
              className={`flex items-center gap-1 rounded-[var(--r-full)] px-2.5 py-1 text-xs font-extrabold ${
                combo >= 5 ? "bg-gold-foil text-onaccent shadow-glow" : "border border-gold-500 text-gold-300"
              }`}
            >
              <IconFlame className={`h-3.5 w-3.5 ${combo >= 5 ? "flame-beat" : ""}`} />
              x{combo}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="-mx-1 relative min-h-0 flex-1 overflow-y-auto px-1">
        {/* XP bay lên */}
        <div className="pointer-events-none absolute inset-x-0 top-10 z-40 flex justify-center">
          {floats.map((f) => (
            <span key={f.id} className="xp-float absolute font-tech text-lg font-extrabold gold-text drop-shadow">
              {f.text}
            </span>
          ))}
        </div>

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

              <span className={`label-luxe ${CAT_COLOR[q.category] ?? "text-taupe"}`}>
                {q.category}
                {mode === "mistakes" && " · ôn lỗi sai"}
              </span>
              <h2 className="mt-2 text-lg font-bold leading-snug text-ivory">{q.prompt}</h2>

              {q.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <motion.img
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={q.image}
                  alt="Đồng hồ cần nhận diện"
                  className="mx-auto mt-3 aspect-square w-[min(280px,56vw)] rounded-[var(--r-md)] object-cover shadow-gold ring-1 ring-hairline"
                />
              )}

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...meta.motion.spring, delay: 0.05 + i * 0.045 }}
                      onClick={() => choose(i)}
                      disabled={answered}
                      whileTap={{ scale: answered ? 1 : theme === "cozy" ? 0.94 : 0.97 }}
                      className={`cyber flex items-center justify-between rounded-[var(--r-md)] border px-4 py-3 text-left text-sm font-medium transition ${cls}`}
                    >
                      <span>{opt}</span>
                      {answered && isCorrect && <IconCheck className="h-5 w-5 text-gold-300" />}
                      {answered && isSelected && !isCorrect && <IconClose className="h-5 w-5 text-bordeaux" />}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {answered && !isBlitz && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="rounded-[var(--r-md)] border border-hairline bg-surface-2 p-4 text-sm">
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
                                className="h-16 w-16 shrink-0 rounded-[var(--r-md)] object-cover ring-1 ring-hairline"
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
                          {watch.warning && (
                            <p className="mt-2 rounded-[var(--r-md)] border border-bordeaux bg-bordeaux/15 p-2.5 text-[12px] leading-snug text-ivory">
                              <span className="font-extrabold uppercase tracking-luxe text-bordeaux">⚠ Cảnh báo xác thực:</span>{" "}
                              {watch.warning}
                            </p>
                          )}
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
                          <CollectionToggle collection={watch.collection} className="mt-3" />
                          <button
                            onClick={() => { setShowDetail(true); playTap(); }}
                            className="cyber mt-2 flex w-full items-center justify-center gap-1.5 rounded-[var(--r-md)] border border-gold-700/50 bg-gold-500/10 py-2.5 text-xs font-bold text-gold-300 active:scale-[0.98]"
                          >
                            <IconBook className="h-4 w-4" /> Xem đầy đủ thông tin mẫu này
                          </button>
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
        {answered && !isBlitz && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="shrink-0">
            <JuicyButton
              onClick={next}
              className="mt-3 w-full rounded-[var(--r-md)] bg-gold-foil py-3.5 font-bold text-onaccent shadow-glow"
            >
              {index + 1 < total ? "Câu tiếp theo" : "Xem kết quả"}
            </JuicyButton>
          </motion.div>
        )}
      </AnimatePresence>

      {showDetail && watch && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={() => setShowDetail(false)}>
          <div className="absolute inset-0 bg-ink/85 backdrop-blur-sm" />
          <div
            className="relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-[var(--r-xl)] border border-hairline bg-surface p-5 pb-8 shadow-2xl sm:rounded-[var(--r-xl)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { setShowDetail(false); playTap(); }}
              aria-label="Đóng"
              className="cyber sticky top-0 z-20 ml-auto grid h-9 w-9 place-items-center rounded-[var(--r-full)] border border-hairline bg-surface text-taupe active:scale-90"
            >
              <IconClose className="h-5 w-5" />
            </button>
            <div className="-mt-7">
              <WatchDetail watch={watch} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
