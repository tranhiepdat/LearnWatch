# Bật "Hỏi AI thật" (Claude) cho tab Trợ lý

Tab **Trợ lý** hoạt động ngay mà KHÔNG cần cấu hình gì: nó tìm kiếm + trả lời tức thì
từ dữ liệu 98 mẫu + thuật ngữ trong app (miễn phí, offline).

Muốn câu trả lời **thông minh hơn (AI thật của Claude)** thì thêm API key:

## Cách bật
1. Lấy API key tại **console.anthropic.com** (Anthropic / Claude).
2. Trên **Vercel** → project LearnWatch → **Settings → Environment Variables** → thêm:
   - `ANTHROPIC_API_KEY` = `sk-ant-...` (key của bạn)
   - (tuỳ chọn) `ANTHROPIC_MODEL` = `claude-haiku-4-5-20251001` (mặc định, rẻ & nhanh)
3. **Redeploy**. Xong — tab Trợ lý sẽ tự dùng Claude (thấy nhãn "✦ Claude AI").

Nếu không có key, app tự dùng bản trợ lý local (nhãn "✦ Trợ lý (dữ liệu app)").

## Lưu ý
- Gọi Claude tốn phí theo token (Haiku rất rẻ). Câu hỏi được kèm danh mục 98 mẫu để
  trả lời sát dữ liệu của bạn.
- Route xử lý: `src/app/api/ask/route.ts` (chạy server-side, key không lộ ra client).
