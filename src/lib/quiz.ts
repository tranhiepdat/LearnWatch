import { watches } from "@/data/watches";
import { terms } from "@/data/terms";
import { watchPhotos } from "@/data/photos";
import type { Brand } from "@/data/types";

export type QuizCategory = "Biệt danh" | "Mẫu mã" | "Chất liệu" | "Nhìn hình";
export type QuizBrand = Brand | "Chung";

export interface QuizQuestion {
  id: string;
  brand: QuizBrand;
  category: QuizCategory;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  /** Duong dan anh /watches/<id>.jpg cho cau hoi nhin hinh */
  image?: string;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(pool: string[], correct: string, n = 3): string[] {
  const uniq = Array.from(new Set(pool.filter((x) => x && x !== correct)));
  return shuffle(uniq).slice(0, n);
}

function assemble(
  id: string,
  brand: QuizBrand,
  category: QuizCategory,
  prompt: string,
  correct: string,
  pool: string[],
  explanation: string,
  image?: string,
): QuizQuestion | null {
  const distractors = pickDistractors(pool, correct);
  if (distractors.length < 3) return null;
  const options = shuffle([correct, ...distractors]);
  return { id, brand, category, prompt, options, correctIndex: options.indexOf(correct), explanation, image };
}

/** Sinh toan bo kho cau hoi co the co tu data. */
export function buildPool(): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  const allNicknames = watches.map((w) => w.nickname).filter(Boolean) as string[];

  for (const w of watches) {
    if (w.nickname && w.reference) {
      const sameBrandNicks = watches
        .filter((x) => x.brand === w.brand && x.nickname && x.id !== w.id)
        .map((x) => x.nickname!);
      const q1 = assemble(
        `nick-${w.id}`,
        w.brand,
        "Biệt danh",
        `${w.brand} ${w.collection} — ref ${w.reference} có biệt danh dân chơi là gì?`,
        w.nickname,
        [...sameBrandNicks, ...allNicknames],
        `${w.model}${w.nicknameMeaning ? `: ${w.nicknameMeaning}` : ""}`,
      );
      if (q1) out.push(q1);

      const sameBrandRefs = watches
        .filter((x) => x.brand === w.brand && x.reference && x.id !== w.id)
        .map((x) => x.reference!);
      const q2 = assemble(
        `ref-${w.id}`,
        w.brand,
        "Mẫu mã",
        `Biệt danh '${w.nickname}' (${w.brand}) ứng với mã reference nào?`,
        w.reference,
        sameBrandRefs,
        `${w.nickname} = ${w.brand} ${w.collection}, ref ${w.reference}.`,
      );
      if (q2) out.push(q2);
    }

    if (w.nickname && w.nicknameMeaning) {
      const pool = watches.filter((x) => x.id !== w.id && x.nicknameMeaning).map((x) => x.nicknameMeaning!);
      const q5 = assemble(
        `why-${w.id}`,
        w.brand,
        "Biệt danh",
        `Vì sao ${w.brand} ${w.collection} có biệt danh '${w.nickname}'?`,
        w.nicknameMeaning,
        pool,
        `${w.model}.`,
      );
      if (q5) out.push(q5);
    }
  }

  for (const t of terms) {
    const brand: QuizBrand = t.brand;
    const defPool = terms.filter((x) => x.id !== t.id).map((x) => x.short);
    const q3 = assemble(
      `term-${t.id}`,
      brand,
      "Chất liệu",
      `'${t.term}' là gì?`,
      t.short,
      defPool,
      `${t.term} (${t.brand}) — ${t.detail}`,
    );
    if (q3) out.push(q3);

    const termPool = terms.filter((x) => x.id !== t.id).map((x) => x.term);
    const q4 = assemble(
      `def-${t.id}`,
      brand,
      "Chất liệu",
      `Mô tả sau nói về thuật ngữ nào? "${t.short}"`,
      t.term,
      termPool,
      `${t.term} (${t.brand}) — ${t.detail}`,
    );
    if (q4) out.push(q4);
  }

  // ----- Cau hoi NHIN HINH (chi cho mau co anh that) -----
  const labelOf = (w: (typeof watches)[number]) => w.nickname ?? w.model;
  for (const w of watches) {
    if (!watchPhotos.has(w.id)) continue;
    const img = `/watches/${w.id}.jpg`;

    // 1) Nhin anh -> doan ten mau
    const sameColl = watches
      .filter((x) => x.id !== w.id && x.collection === w.collection)
      .map(labelOf);
    const allLabels = watches.filter((x) => x.id !== w.id).map(labelOf);
    const idPool = sameColl.length >= 3 ? sameColl : [...sameColl, ...allLabels];
    const qImg = assemble(
      `img-${w.id}`,
      w.brand,
      "Nhìn hình",
      "Đồng hồ trong ảnh là mẫu nào?",
      labelOf(w),
      idPool,
      `${w.brand} ${w.model}${w.reference ? ` — ref ${w.reference}` : ""}.`,
      img,
    );
    if (qImg) out.push(qImg);

    // 2) Nhin anh -> doan biet danh (neu co)
    if (w.nickname) {
      const nickPool = watches.filter((x) => x.id !== w.id && x.nickname).map((x) => x.nickname!);
      const qNick = assemble(
        `imgnick-${w.id}`,
        w.brand,
        "Nhìn hình",
        "Biệt danh của đồng hồ trong ảnh là gì?",
        w.nickname,
        nickPool,
        `${w.model}${w.nicknameMeaning ? `: ${w.nicknameMeaning}` : ""}`,
        img,
      );
      if (qNick) out.push(qNick);
    }
  }

  return out;
}

export interface QuizFilter {
  brand?: Brand;
  category?: QuizCategory;
}

export function generateQuiz(count = 10, filter: QuizFilter = {}): QuizQuestion[] {
  let pool = buildPool();
  if (filter.brand) {
    pool = pool.filter((q) => q.brand === filter.brand || q.brand === "Chung");
  }
  if (filter.category) {
    pool = pool.filter((q) => q.category === filter.category);
  }
  return shuffle(pool).slice(0, count);
}
