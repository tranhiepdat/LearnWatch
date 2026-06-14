# ⌚ LearnWatch

App học đồng hồ kiểu **Duolingo** dành cho nhân viên sale — nắm chắc **mẫu mã (reference)**, **tên dân chơi (biệt danh)** và **chất liệu**. Tập trung **Rolex & Omega**.

## Tính năng

- 🃏 **Flashcard** — lật thẻ học từng mẫu, đánh dấu "đã thuộc".
- 🎯 **Trắc nghiệm** — đố 4 đáp án (biệt danh / mẫu mã / chất liệu), có giải thích, cộng XP & giữ chuỗi ngày học (streak).
- 📖 **Tra cứu** — tìm nhanh mẫu & thuật ngữ khi đang tư vấn khách.
- 🎨 **Hình minh hoạ thông minh** — vẽ đúng màu bezel/mặt số nên dùng được ngay **không cần ảnh**; thả ảnh thật vào `public/watches/` là tự thay.

## Chạy local

```bash
npm install
npm run dev
# mở http://localhost:3000
```

Build production:

```bash
npm run build && npm start
```

## Deploy Vercel

Repo này là Next.js chuẩn — Vercel tự nhận diện. Mỗi lần push lên nhánh là Vercel build & deploy. Không cần cấu hình thêm.

## Cấu trúc

```
src/
  app/                # các trang: trang chủ, /flashcards, /quiz, /browse
  components/         # WatchVisual, Flashcard, QuizRunner, ProgressHeader
  data/
    watches.ts        # ⭐ DỮ LIỆU mẫu đồng hồ (sửa/thêm ở đây)
    terms.ts          # ⭐ DỮ LIỆU chất liệu & thuật ngữ
    types.ts          # định nghĩa kiểu dữ liệu
  lib/
    quiz.ts           # tự sinh câu hỏi trắc nghiệm từ data
    progress.ts       # lưu XP / streak / đã thuộc (localStorage)
public/watches/       # thả ảnh thật vào đây (xem README trong thư mục)
docs/IMAGES.md        # hướng dẫn lấy ảnh hợp pháp
```

## Thêm / sửa nội dung

**Thêm một mẫu đồng hồ:** mở `src/data/watches.ts`, copy một khối `{ ... }` rồi sửa. Các trường quan trọng:

- `id` — mã không dấu, không trùng (cũng là tên file ảnh).
- `nickname`, `nicknameMeaning` — tên dân chơi và lý do.
- `reference`, `materials`, `caseSize`, `movement`, `year`.
- `bezelColors` (1 hoặc 2 mã màu) + `dialColor` + `caseColor` — để vẽ hình minh hoạ.
- `facts` — gạch đầu dòng để sale nói với khách.

**Thêm thuật ngữ/chất liệu:** mở `src/data/terms.ts`.

Quiz tự động tạo câu hỏi mới từ dữ liệu bạn thêm — không phải sửa gì khác.

---

> Lưu ý: nội dung biên soạn để đào tạo nội bộ, vui lòng đối chiếu thông số chính thức từ hãng khi tư vấn khách.
