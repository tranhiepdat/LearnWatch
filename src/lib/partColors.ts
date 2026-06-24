import type { Watch } from "@/data/types";
import { colorBreakdown } from "./colorParts";

/**
 * BẢNG MÀU rõ ràng theo bộ phận: Vỏ / Vành / Mặt số (+ Mặt phụ nếu suy ra được),
 * dịch sang tiếng Việt dễ hiểu, kèm chú thích tên màu đặc biệt.
 */

const CASE_VI: Record<string, string> = {
  steel: "Thép không gỉ (Oystersteel)",
  yellowgold: "Vàng vàng 18k",
  rosegold: "Vàng hồng (Everose)",
  whitegold: "Vàng trắng 18k",
  platinum: "Bạch kim (Platinum)",
  titanium: "Titan",
  blackceramic: "Gốm đen / phủ đen (coating)",
};

/** hex -> tên màu tiếng Việt (xấp xỉ theo HSL) */
export function colorName(hex?: string): string {
  if (!hex) return "";
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) return "";
  const num = parseInt(m[1], 16);
  const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const l = (mx + mn) / 2 / 255;
  const sat = mx === mn ? 0 : (mx - mn) / 255;

  if (sat < 0.12) {
    if (l > 0.85) return "Trắng";
    if (l > 0.6) return "Bạc / trắng ánh kim";
    if (l > 0.4) return "Xám";
    if (l > 0.18) return "Xám đậm (slate)";
    return "Đen";
  }
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const d = mx / 255 - mn / 255;
  let h = 0;
  if (mx / 255 === rn) h = ((gn - bn) / d) % 6;
  else if (mx / 255 === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  h *= 60; if (h < 0) h += 360;

  if (h < 18 || h >= 345) return l < 0.4 ? "Đỏ đậm" : "Đỏ";
  if (h < 35) return l < 0.4 ? "Nâu sô-cô-la (chocolate)" : "Nâu / đồng";
  if (h < 70) {
    if (l > 0.72) return "Champagne (vàng nhạt)";
    if (l > 0.45) return "Vàng champagne";
    return "Vàng đậm";
  }
  if (h < 160) return l < 0.3 ? "Xanh lá đậm" : "Xanh lá";
  if (h < 200) return "Xanh ngọc (turquoise)";
  if (h < 255) return l < 0.35 ? "Xanh dương đậm" : "Xanh dương";
  if (h < 290) return "Tím";
  return "Hồng";
}

export interface ColorRow {
  part: string; // Vỏ / Vành / Mặt số / Mặt phụ
  partEn: string;
  value: string; // màu tiếng Việt
  notes: string[]; // chú thích tên màu đặc biệt
}

export function colorTable(w: Watch): { rows: ColorRow[]; chronoNote: boolean } {
  const bd = colorBreakdown(w);
  const notesFor = (vi: string) =>
    bd.filter((b) => b.part.includes(vi)).map((b) => `${b.display}: ${b.note}`);

  const rows: ColorRow[] = [];

  const caseVi = CASE_VI[w.caseColor ?? ""] ?? "";
  if (caseVi) rows.push({ part: "Vỏ", partEn: "case", value: caseVi, notes: notesFor("Vỏ") });

  let bez = w.bezelEn ?? "";
  if (!bez && w.bezelColors?.length) {
    bez = w.bezelColors.length >= 2
      ? `${colorName(w.bezelColors[0])} / ${colorName(w.bezelColors[1])}`
      : colorName(w.bezelColors[0]);
  }
  if (bez) rows.push({ part: "Vành", partEn: "bezel", value: bez, notes: notesFor("Vành") });

  const dial = colorName(w.dialColor);
  if (dial) rows.push({ part: "Mặt số", partEn: "dial", value: dial, notes: notesFor("Mặt số") });

  // Mặt phụ (sub-dial) cho chronograph: suy từ Panda/Reverse Panda nếu có
  const tag = `${w.colorEn ?? ""} ${w.nickname ?? ""} ${w.model}`.toLowerCase();
  const isChrono = !!w.subdials && /chronograph|bấm giờ|tachymeter/i.test(`${w.subdials} ${w.bezelEn ?? ""}`);
  if (/reverse panda/.test(tag)) rows.push({ part: "Mặt phụ", partEn: "sub-dial", value: "Bạc/trắng (tương phản mặt đen)", notes: [] });
  else if (/\bpanda\b/.test(tag)) rows.push({ part: "Mặt phụ", partEn: "sub-dial", value: "Đen (tương phản mặt trắng)", notes: [] });

  // chú thích thêm cho chronograph chưa rõ màu mặt phụ
  const chronoNote = isChrono && !rows.some((r) => r.part === "Mặt phụ");
  return { rows, chronoNote };
}
