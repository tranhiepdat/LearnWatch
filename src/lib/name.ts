import type { Watch } from "@/data/types";

/**
 * Ten tieng Anh "chuan" de noi voi khach: Brand + Collection (von da la tieng Anh)
 * + co + bien danh. Vd: Rolex Datejust 36, Rolex GMT-Master II "Pepsi".
 * Chi tiet bien the (chat lieu/mau) lay tu colorEn + materials.
 */
export function englishName(w: Watch): string {
  const sizeMatch = w.caseSize?.match(/^(\d+)/);
  const size = sizeMatch ? ` ${sizeMatch[1]}` : "";
  let s = `${w.brand} ${w.collection}${size}`;
  if (w.nickname) s += ` “${w.nickname}”`;
  return s;
}
