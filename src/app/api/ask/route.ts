import { NextResponse } from "next/server";
import { visibleWatches } from "@/data/watches";
import { terms } from "@/data/terms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildContext(): string {
  const w = visibleWatches
    .map(
      (x) =>
        `- ${x.brand} ${x.collection} "${x.model}"${x.nickname ? ` [biệt danh: ${x.nickname}]` : ""}` +
        ` · ${x.year ?? "?"} · ${x.tier ?? ""} · màu: ${x.colorEn ?? ""} · giá: ${x.resale ?? "?"}` +
        ` · ${x.movement ?? ""}${x.bezelEn ? ` · bezel: ${x.bezelEn}` : ""}${x.strapEn ? ` · dây: ${x.strapEn}` : ""}`,
    )
    .join("\n");
  const t = terms.map((x) => `- ${x.term}: ${x.short}`).join("\n");
  return `DANH MỤC (${visibleWatches.length} mẫu):\n${w}\n\nTHUẬT NGỮ:\n${t}`;
}
const CONTEXT = buildContext();

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ configured: false });

  let question = "";
  try {
    question = ((await req.json()) as { question?: string }).question ?? "";
  } catch {
    /* ignore */
  }
  if (!question.trim()) return NextResponse.json({ configured: true, answer: "Bạn muốn hỏi về mẫu nào?" });

  const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
  const system =
    "Bạn là trợ lý chuyên gia đồng hồ cho nhân viên SALE (app LearnWatch). Trả lời bằng TIẾNG VIỆT, " +
    "ngắn gọn, thực dụng để sale tư vấn khách. Ưu tiên dựa vào DANH MỤC bên dưới; nếu ngoài danh mục thì " +
    "nói rõ là kiến thức chung. Khi nhắc mẫu hãy kèm hãng + biệt danh + giá (nếu có).\n\n" +
    CONTEXT;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 800,
        system,
        messages: [{ role: "user", content: question }],
      }),
    });
    if (!r.ok) {
      return NextResponse.json({ configured: true, error: `API ${r.status}`, answer: "" });
    }
    const data = (await r.json()) as { content?: { text?: string }[] };
    const answer = data.content?.[0]?.text ?? "";
    return NextResponse.json({ configured: true, answer });
  } catch (e) {
    return NextResponse.json({ configured: true, error: String(e), answer: "" });
  }
}
