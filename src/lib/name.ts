import type { Watch } from "@/data/types";

/**
 * Ten tieng Anh "chuan" de noi voi khach TAY: Brand + Collection + co + (biet danh
 * HOAC mo ta mat/chat lieu tieng Anh). Vd:
 *   Rolex GMT-Master II 40 "Pepsi"
 *   Rolex Datejust 36 · Black, Roman numerals
 */
function sizeOf(w: Watch): string {
  const m = w.caseSize?.match(/^(\d+)/);
  return m ? ` ${m[1]}` : "";
}

/** Ten KHONG co hang (cho quiz/option cung hang). */
export function enLabel(w: Watch): string {
  let s = `${w.collection}${sizeOf(w)}`;
  if (w.nickname) s += ` “${w.nickname}”`;
  else if (w.colorEn) s += ` · ${w.colorEn}`;
  return s;
}

/** Ten day du co hang (cho tieu de the/chi tiet). */
export function englishName(w: Watch): string {
  return `${w.brand} ${enLabel(w)}`;
}
