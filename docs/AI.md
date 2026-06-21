# Bật "Hỏi AI thật" (Claude) cho tab Trợ lý

Tab **Trợ lý** chạy ngay không cần cấu hình: tìm kiếm + trả lời từ dữ liệu 98 mẫu (local).
Muốn **AI thật, hỏi sâu nhiều lượt** thì gắn **API key**.

## ⚠️ Quan trọng: Gói Max ≠ API
- **Claude Max / Pro** (bạn mua) là để dùng **claude.ai** và **Claude Code**. Nó **KHÔNG**
  cho phép gọi **API** từ app của bạn.
- **API** là dịch vụ **riêng**, tính tiền **theo token**, lấy key ở **console.anthropic.com**
  (nạp credit riêng, không liên quan gói Max).

## Cách gắn API (1 lần)
1. Vào **console.anthropic.com** → **API Keys** → tạo key `sk-ant-...` (và nạp ít credit).
2. Trên **Vercel** → project LearnWatch → **Settings → Environment Variables**, thêm:
   - `ANTHROPIC_API_KEY` = `sk-ant-...`
   - (tuỳ chọn) `ANTHROPIC_MODEL`:
     - `claude-sonnet-4-6` — **mặc định**, thông minh + cân đối (khuyên dùng)
     - `claude-opus-4-8` — thông minh nhất (đắt hơn), hợp hỏi sâu/khó
     - `claude-haiku-4-5-20251001` — rẻ & nhanh nhất
3. **Redeploy**. Xong — Trợ lý dùng Claude (nhãn "✦ Claude AI"), nhớ hội thoại nhiều lượt.

## Chi phí (rất rẻ cho app này)
- Mỗi câu hỏi kèm danh mục 98 mẫu (~vài nghìn token). Haiku gần như không đáng kể;
  Sonnet/Opus nhỉnh hơn nhưng vẫn rất nhỏ cho nhu cầu cá nhân.

## Kỹ thuật
- Route: `src/app/api/ask/route.ts` (server-side, key KHÔNG lộ ra client).
- Gửi kèm lịch sử hội thoại để hỏi nối tiếp (follow-up).
- Không có key → tự fallback bản local.
