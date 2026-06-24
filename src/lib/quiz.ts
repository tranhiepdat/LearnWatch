import { visibleWatches as watches } from "@/data/watches";
import { terms } from "@/data/terms";
import { watchPhotos } from "@/data/photos";
import { collectionInfos } from "@/data/collections";
import { colorName } from "@/lib/partColors";
import { englishName } from "@/lib/name";
import type { Brand } from "@/data/types";

export type QuizCategory = "Biệt danh" | "Mẫu mã" | "Chất liệu" | "Nhìn hình" | "Dòng" | "Thật/Giả";
export type QuizBrand = Brand | "Chung";

export interface QuizQuestion {
  id: string;
  brand: QuizBrand;
  category: QuizCategory;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  /** Mau dong ho cau hoi nhac toi (de hien info chi tiet khi tra loi) */
  watchId?: string;
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
  watchId?: string,
  image?: string,
): QuizQuestion | null {
  const distractors = pickDistractors(pool, correct);
  if (distractors.length < 3) return null;
  const options = shuffle([correct, ...distractors]);
  return { id, brand, category, prompt, options, correctIndex: options.indexOf(correct), explanation, watchId, image };
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
        w.id,
        `/watches/${w.id}.jpg`,
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
        w.id,
        `/watches/${w.id}.jpg`,
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
        w.id,
        `/watches/${w.id}.jpg`,
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
  // Nhan TIENG ANH (ban hang khach Tay). Chi dung biet danh khi nó DUY NHẤT trong
  // dòng (tránh "President" chung cả dòng); còn lại dùng collection + size + colorEn.
  const collNick = new Map<string, number>();
  watches.forEach((w) => {
    if (w.nickname) {
      const k = `${w.collection}|${w.nickname}`;
      collNick.set(k, (collNick.get(k) ?? 0) + 1);
    }
  });
  const labelOf = (w: (typeof watches)[number]) => {
    const size = w.caseSize?.match(/^(\d+)/)?.[0];
    const base = `${w.collection}${size ? ` ${size}` : ""}`;
    if (w.nickname && collNick.get(`${w.collection}|${w.nickname}`) === 1) return `${base} “${w.nickname}”`;
    if (w.colorEn) return `${base} · ${w.colorEn}`;
    return base;
  };
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
      w.id,
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
        w.id,
        img,
      );
      if (qNick) out.push(qNick);
    }
  }

  // ====== MỞ RỘNG: nhiều dạng câu hỏi mới (thư viện lớn) ======
  const allBrands = Array.from(new Set(watches.map((w) => w.brand)));
  const allColls = Array.from(new Set(watches.map((w) => w.collection)));
  const DIAL_PALETTE = ["Đen", "Trắng / bạc", "Xám", "Xanh dương", "Xanh lá", "Vàng / champagne", "Nâu", "Hồng", "Xanh ngọc", "Đỏ"];
  const baseColor = (hex?: string): string => {
    const n = colorName(hex);
    if (!n) return "";
    if (/đen/i.test(n)) return "Đen";
    if (/trắng|bạc/i.test(n)) return "Trắng / bạc";
    if (/xám|slate/i.test(n)) return "Xám";
    if (/xanh ngọc|turquoise/i.test(n)) return "Xanh ngọc";
    if (/xanh lá/i.test(n)) return "Xanh lá";
    if (/xanh dương/i.test(n)) return "Xanh dương";
    if (/champagne|vàng/i.test(n)) return "Vàng / champagne";
    if (/nâu|chocolate|đồng/i.test(n)) return "Nâu";
    if (/hồng/i.test(n)) return "Hồng";
    if (/đỏ/i.test(n)) return "Đỏ";
    if (/tím/i.test(n)) return "Tím";
    return "";
  };

  // 1) Nhìn hình -> HÃNG / DÒNG / MÀU MẶT SỐ
  for (const w of watches) {
    if (!watchPhotos.has(w.id)) continue;
    const img = `/watches/${w.id}.jpg`;

    const qBrand = assemble(`imgbrand-${w.id}`, w.brand, "Nhìn hình", "Đồng hồ trong ảnh là HÃNG nào?", w.brand, allBrands, `${englishName(w)}.`, w.id, img);
    if (qBrand) out.push(qBrand);

    const collDistract = watches.filter((x) => x.brand === w.brand && x.collection !== w.collection).map((x) => x.collection);
    const qColl = assemble(`imgcoll-${w.id}`, w.brand, "Nhìn hình", "Đồng hồ trong ảnh thuộc DÒNG (collection) nào?", w.collection, [...collDistract, ...allColls], `${englishName(w)}.`, w.id, img);
    if (qColl) out.push(qColl);

    const dc = baseColor(w.dialColor);
    if (dc) {
      const qDial = assemble(`imgdial-${w.id}`, w.brand, "Nhìn hình", "Mặt số (dial) trong ảnh chủ yếu màu gì?", dc, DIAL_PALETTE, `${w.brand} ${w.model} — mặt ${dc.toLowerCase()}.`, w.id, img);
      if (qDial) out.push(qDial);
    }
  }

  // 2) DÒNG: công dụng / định vị (2 chiều)
  const collsWithData = collectionInfos.filter((c) => watches.some((w) => w.collection === c.collection));
  const allTaglines = collsWithData.map((c) => c.tagline);
  for (const c of collsWithData) {
    const qTag = assemble(`coll-tag-${c.collection}`, c.brand, "Dòng", `Dòng ${c.collection} (${c.brand}) nổi tiếng / định vị là gì?`, c.tagline, allTaglines, `${c.collection}: ${c.purpose}`);
    if (qTag) out.push(qTag);
    const qWhat = assemble(`coll-what-${c.collection}`, c.brand, "Dòng", `Dòng nào được mô tả: "${c.tagline}"?`, c.collection, allColls, `${c.collection} (${c.brand}): ${c.purpose}`);
    if (qWhat) out.push(qWhat);
  }

  // 3) MÁY / Calibre (1 câu mỗi dòng)
  const seenMovColl = new Set<string>();
  const allMovs = Array.from(new Set(watches.map((w) => w.movement).filter(Boolean) as string[]));
  for (const w of watches) {
    if (!w.movement || seenMovColl.has(w.collection)) continue;
    seenMovColl.add(w.collection);
    const qMov = assemble(`mov-${w.collection}`, w.brand, "Chất liệu", `${w.brand} ${w.collection} dùng bộ máy (calibre) nào?`, w.movement, allMovs, `${w.collection} dùng ${w.movement}.`);
    if (qMov) out.push(qMov);
  }

  // 4) THẬT/GIẢ: nhìn ẢNH đoán chính hãng hay hàng độ/rep (cân bằng 2 loại)
  const AUTH_GENUINE = "Chính hãng — cấu hình CÓ thật";
  const AUTH_FAKE = "Hàng ĐỘ/REP — cấu hình KHÔNG có thật";
  let gi = 0;
  for (const w of watches) {
    if (!watchPhotos.has(w.id)) continue;
    const img = `/watches/${w.id}.jpg`;
    if (w.warning) {
      const qa = assemble(`auth-${w.id}`, w.brand, "Thật/Giả", "Đồng hồ trong ảnh là loại nào?", AUTH_FAKE, [AUTH_GENUINE, "Chính hãng — bản grail hiếm", "Chính hãng — bản giới hạn"], w.warning, w.id, img);
      if (qa) out.push(qa);
    } else if (gi++ % 4 === 0) {
      // lấy mẫu ~1/4 mẫu thật để cân bằng (đáp án 'chính hãng')
      const qg = assemble(`authg-${w.id}`, w.brand, "Thật/Giả", "Đồng hồ trong ảnh là loại nào?", AUTH_GENUINE, [AUTH_FAKE, "Cấu hình lai (Frankenwatch)", "Không rõ nguồn gốc"], `${englishName(w)} — cấu hình chính hãng.`, w.id, img);
      if (qg) out.push(qg);
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
