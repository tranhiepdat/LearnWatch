/**
 * BẢNG MÀU NHÓM — nguồn sự thật DUY NHẤT.
 *
 * Số 1–7 tương ứng 7 màu trong `:root[data-theme="cozy"]` (--c-h1…--c-h7).
 * Gắn `data-hue={n}` lên bất kỳ phần tử nào là cả nhánh con đổi màu theo.
 * Ở theme game/lux không có khối [data-hue] nên các số này bị bỏ qua — hai
 * theme đó giữ nguyên bản sắc một-màu.
 *
 * Trước đây map này bị chép ra ba nơi (QuizRunner, tips, nihongo) nên rất dễ
 * lệch: chọn "Chủ đề" ở màn setup ra một màu, vào chơi lại ra màu khác.
 */

export const HUE = {
  honey: 1, // vàng mật ong
  grass: 2, // xanh cỏ
  peach: 3, // hồng đào
  sky: 4, // xanh trời
  red: 5, // đỏ ấm
  lavender: 6, // tím oải hương
  sun: 7, // vàng nắng
} as const;

/** Nhóm câu hỏi trắc nghiệm → màu. Dùng CHUNG cho màn chọn và màn chơi. */
export const QUIZ_CAT_HUE: Record<string, number> = {
  "Biệt danh": HUE.honey,
  "Mẫu mã": HUE.grass,
  "Chất liệu": HUE.peach,
  "Nhìn hình": HUE.sky,
  "Thật/Giả": HUE.red,
  Dòng: HUE.lavender,
};

/** Chế độ chơi → màu. Blitz đỏ vì gấp gáp, ôn lỗi tím cho khác hẳn. */
export const QUIZ_MODE_HUE: Record<string, number> = {
  normal: HUE.sky,
  blitz: HUE.red,
  mistakes: HUE.lavender,
};

/** Nhóm mẹo bán hàng → màu (chọn các sắc cách xa nhau để dễ phân biệt). */
export const TIP_CAT_HUE: Record<string, number> = {
  "Tư vấn": HUE.honey,
  "Chốt deal": HUE.red,
  "Nhận diện": HUE.sky,
  "Chăm sóc": HUE.grass,
  "Kiến thức": HUE.lavender,
};

/** Rải màu đều cho một danh sách bất kỳ (chip số câu, tab…) theo thứ tự. */
export function hueByIndex(i: number, total = 7): number {
  return (i % total) + 1;
}
