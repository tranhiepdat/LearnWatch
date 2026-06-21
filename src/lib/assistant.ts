import { visibleWatches, getWatch } from "@/data/watches";
import { terms } from "@/data/terms";
import { englishName } from "./name";
import type { Watch } from "@/data/types";

export interface AssistantResult {
  text: string;
  watches: Watch[];
}

/** Bo dau tieng Viet de so khop linh hoat */
export const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");

function watchHaystack(w: Watch): string {
  return norm(
    [w.model, w.nickname, w.reference, w.collection, w.brand, w.colorEn, w.tier, w.movement, ...(w.materials ?? [])]
      .filter(Boolean)
      .join(" "),
  );
}

const SUGGESTIONS = [
  "Mẫu nhập môn / giá mềm?",
  "Rolex mặt xanh lá",
  "Cerachrom là gì?",
  "Đồng hồ vuông",
  "Máy 3235 dùng cho mẫu nào?",
  "Hublot Big Bang giá bao nhiêu?",
];

export function suggestions(): string[] {
  return SUGGESTIONS;
}

/** Tra loi tuc thi tu du lieu (khong can AI). */
export function localAnswer(qRaw: string): AssistantResult {
  const q = norm(qRaw.trim());
  const all = visibleWatches;
  if (!q) return { text: "Hỏi mình về mẫu, biệt danh, chất liệu, giá, hãng, hay máy/calibre nhé!", watches: [] };

  // 1) Thuat ngu / chat lieu
  const term = terms.find((t) => q.includes(norm(t.term).split(" ")[0]) && norm(t.term).split(" ")[0].length > 3) || terms.find((t) => q.includes(norm(t.term)));
  if (term && /(la gi|nghia|giai thich|what|\?)/.test(q + "?")) {
    const related = all.filter((w) => watchHaystack(w).includes(norm(term.term).split(" ")[0])).slice(0, 6);
    return { text: `${term.term} — ${term.short}\n\n${term.detail}`, watches: related };
  }

  // 1b) Khop dung BIET DANH cu the (vd nut "Hoi AI ve mau nay")
  const nickHit = visibleWatches.find(
    (w) => w.nickname && norm(w.nickname).length >= 3 && q.includes(norm(w.nickname)),
  );
  if (nickHit) {
    const more = all.filter((w) => w.collection === nickHit.collection && w.id !== nickHit.id).slice(0, 5);
    return {
      text:
        `${nickHit.brand} ${nickHit.model}` +
        (nickHit.tier ? ` — ${nickHit.tier}.` : ".") +
        (nickHit.resale ? ` Giá tham khảo ${nickHit.resale}.` : "") +
        (nickHit.nicknameMeaning ? `\n“${nickHit.nickname}”: ${nickHit.nicknameMeaning}` : "") +
        (nickHit.tip ? `\n💡 ${nickHit.tip}` : ""),
      watches: [nickHit, ...more],
    };
  }

  // 2) Calibre / may dung chung
  const cal = q.match(/\b(\d{3,4})\b/);
  if (cal && /(may|calibre|cal|movement|dung chung)/.test(q)) {
    const num = cal[1];
    const list = all.filter((w) => norm(w.movement ?? "").includes(num) || norm(w.movementNote ?? "").includes(num));
    if (list.length)
      return { text: `Các mẫu dùng máy Cal. ${num} (hoặc nhắc tới nó):`, watches: list.slice(0, 16) };
  }

  // 3) Nhap mon / pho thong / gia re
  if (/(nhap mon|entry|re nhat|gia re|de mua|pho thong|fashion|tier|mam tien|tam tien)/.test(q)) {
    const list = all.filter((w) => /(nhap mon|pho thong|re|entry|fashion|mem)/i.test(norm(w.tier ?? "")));
    return {
      text: `Các mẫu nhập môn / phổ thông / giá mềm (dễ tư vấn người mới):`,
      watches: list.slice(0, 16),
    };
  }

  // 4) Grail / cao cap / dat
  if (/(grail|cao cap|dat nhat|xa xi|flagship|sang nhat)/.test(q)) {
    const list = all.filter((w) => /(grail|dinh cao|cao cap|flagship)/i.test(norm(w.tier ?? "")));
    return { text: `Các mẫu cao cấp / grail (đẳng cấp nhất):`, watches: list.slice(0, 16) };
  }

  // 5) Vuong vuc
  if (/(vuong|square|tonneau|chu nhat|rectangle)/.test(q)) {
    const list = all.filter((w) => /(tank|monaco|square bang|spirit)/i.test(norm(w.collection)));
    return { text: `Các mẫu vỏ VUÔNG / tonneau:`, watches: list.slice(0, 16) };
  }

  // 6) Hang
  const brandMap: [RegExp, string][] = [
    [/rolex/, "Rolex"],
    [/omega/, "Omega"],
    [/(tag|heuer|carrera|monaco|aquaracer|formula)/, "TAG Heuer"],
    [/(cartier|tank)/, "Cartier"],
    [/(hublot|big bang|classic fusion)/, "Hublot"],
    [/diesel/, "Diesel"],
    [/movado/, "Movado"],
  ];
  const brandHit = brandMap.find(([re]) => re.test(q));

  // 7) Mau sac
  const colorMap: [RegExp, string[]][] = [
    [/(xanh la|green|luc)/, ["green", "xanh la", "1b7d3e", "mint"]],
    [/(xanh duong|blue|xanh nuoc)/, ["blue", "xanh duong"]],
    [/(den|black)/, ["black", "den"]],
    [/(trang|white|bac|silver)/, ["white", "silver", "trang", "bac"]],
    [/(vang|gold|champagne)/, ["gold", "vang", "champagne", "yellow"]],
    [/(hong|rose|everose|pink)/, ["rose", "hong", "everose", "pink"]],
    [/(xa cu|mop|mother of pearl)/, ["mop", "xa cu", "mother of pearl"]],
    [/(xanh ngoc|tiffany|turquoise)/, ["tiffany", "turquoise", "xanh ngoc"]],
    [/(nau|chocolate|brown|root beer)/, ["chocolate", "nau", "brown", "root beer"]],
  ];
  const colorHit = colorMap.find(([re]) => re.test(q));

  if (brandHit || colorHit) {
    let list = all;
    if (brandHit) list = list.filter((w) => w.brand === brandHit[1]);
    if (colorHit) list = list.filter((w) => colorHit[1].some((c) => watchHaystack(w).includes(norm(c))));
    if (list.length) {
      const label = `${brandHit ? brandHit[1] + " " : ""}${colorHit ? "(màu đã chọn) " : ""}`.trim();
      return { text: `${list.length} mẫu ${label}:`, watches: list.slice(0, 18) };
    }
  }

  // 8) Tim truc tiep (model/nickname/ref/...)
  const tokens = q.split(/\s+/).filter((t) => t.length >= 2);
  const matches = all
    .map((w) => {
      const h = watchHaystack(w);
      const score = tokens.reduce((s, t) => s + (h.includes(t) ? 1 : 0), 0) + (h.includes(q) ? 2 : 0);
      return { w, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.w);

  if (term) {
    return { text: `${term.term} — ${term.short}\n\n${term.detail}`, watches: matches.slice(0, 8) };
  }
  if (matches.length) {
    return { text: `Tìm thấy ${matches.length} mẫu khớp “${qRaw.trim()}”:`, watches: matches.slice(0, 18) };
  }

  return {
    text: "Mình chưa rõ câu hỏi 😅 Thử: 'mẫu nhập môn', 'Rolex xanh lá', 'Cerachrom là gì', 'Daytona giá bao nhiêu', 'máy 3235 dùng cho mẫu nào'.",
    watches: [],
  };
}

/** Mô tả CHI TIẾT 1 mẫu cụ thể (cho nút "Hỏi AI về mẫu này"). */
export function watchDetail(w: Watch): AssistantResult {
  const lines: string[] = [`${englishName(w)}${w.colorEn ? ` · ${w.colorEn}` : ""}`];
  if (w.tier) lines.push(`▸ Phân khúc: ${w.tier}`);
  const specs: string[] = [];
  if (w.year) specs.push(`Năm ${w.year}`);
  if (w.caseSize) specs.push(w.caseSize);
  if (w.movement) specs.push(`Máy ${w.movement}`);
  if (specs.length) lines.push(specs.join(" · "));
  if (w.bezelEn) lines.push(`Bezel: ${w.bezelEn}`);
  if (w.strapEn) lines.push(`Dây: ${w.strapEn}`);
  if (w.resale) lines.push(`Giá tham khảo: ${w.resale}`);
  if (w.movementNote) lines.push(`⚙ ${w.movementNote}`);
  if (w.nickname && w.nicknameMeaning) lines.push(`“${w.nickname}”: ${w.nicknameMeaning}`);
  if (w.facts?.length) lines.push("\n" + w.facts.join(" "));
  if (w.funFact) lines.push(`✦ ${w.funFact}`);
  if (w.tip) lines.push(`💡 ${w.tip}`);
  return { text: lines.join("\n"), watches: [w] };
}

export { getWatch };
