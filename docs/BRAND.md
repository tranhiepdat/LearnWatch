# LearnWatch — Brand Guideline

> Tinh thần: **old money · luxurious · modern · thoughtful**. Tối giản nhưng tinh xảo,
> như một maison đồng hồ cao cấp. Vàng dùng *điểm xuyết*, không loè loẹt.

## 1. Bảng màu (design tokens — `tailwind.config.ts`)

| Token | Hex | Dùng cho |
|---|---|---|
| `ink` | `#0B0A0F` | Nền chính (obsidian) |
| `ink-2` | `#121017` | Nền phụ |
| `surface` | `#17151F` | Thẻ (card) |
| `surface-2` | `#1F1B28` | Lớp nổi trong thẻ |
| `gold-300/400/500` | `#E2C98A` → `#C6A35E` | Nhấn, CTA, icon active |
| `champagne` | `#E8D8A8` | Chữ nhấn ấm |
| `ivory` | `#F3ECDC` | Chữ chính |
| `taupe` | `#A39A8A` | Chữ phụ |
| `sage` | `#6FA585` | Đúng / tích cực (nhẹ) |
| `bordeaux` | `#B45448` | Sai / cảnh báo |
| `hairline` | `rgba(212,185,120,.16)` | Đường kẻ vàng mảnh |

- Foil vàng: class `.gold-text` (chữ) và `bg-gold-foil` (nền nút).
- Hạt bẫng (grain) phủ toàn trang ở opacity ~3.5% cho chiều sâu.

## 2. Typography
- **Display / số / tiêu đề**: **Playfair Display** (serif high-contrast, chất "old money"). Class `font-display`.
- **Body / UI**: **Inter**. Class `font-sans`.
- Nhãn nhỏ: IN HOA, giãn chữ `tracking-luxe` (0.22em), màu vàng mờ → class `.label-luxe`.

## 3. Iconography
- Bộ icon line riêng trong `src/components/icons.tsx`: nét 1.6, bo tròn, dùng `currentColor`.
- Logo: `IconCrest` (vương miện tối giản) + wordmark "LearnWatch" foil vàng.

## 4. Motion (Framer Motion)
- Vào màn: trượt + mờ dần, spring êm (stiffness ~320, damping ~30).
- Flashcard: **vuốt** (drag) trái/phải, **chạm** để lật 3D.
- Chọn **đúng** → `GoldBurst` (tia + vảy vàng + vòng sóng) + đếm XP chạy số.
- Chọn **sai** → rung nhẹ (shake), viền bordeaux.
- Tôn trọng `prefers-reduced-motion` (tắt animation cho người nhạy cảm).

## 5. Sound (Web Audio — `src/lib/sound.ts`)
- Tổng hợp 100% bằng code, không file nhạc (không lo bản quyền).
- `correct`: arpeggio C–E–G–C + lấp lánh. `wrong`: trầm ngắn. `flip`/`swipe`: whoosh. `complete`: hợp âm vàng.
- Có nút bật/tắt (lưu localStorage). Phát trong cử chỉ người dùng (đúng chuẩn trình duyệt).

## 6. UX nguyên tắc
- **App-first**: khung tối đa 480px, **bottom nav** 4 tab, hạn chế scroll.
- Tương tác: **swipe / drag / tap**, không chỉ bấm nút.
- Phản hồi tức thì: âm thanh + motion cho mọi hành động chính.
- Nội dung song ngữ: tên màu & thuật ngữ **tiếng Anh** cho sale quốc tế, giải thích tiếng Việt.

## 7. Nên / Không nên
- ✅ Vàng điểm xuyết trên nền tối; khoảng trống rộng rãi; serif cho điểm nhấn.
- ✅ Một hành động chính mỗi màn (nút foil vàng).
- ❌ Không nhồi nhiều vàng đặc; không gradient sặc sỡ; không nền sáng.
- ❌ Không icon emoji trong UI chính (dùng bộ icon thương hiệu).
