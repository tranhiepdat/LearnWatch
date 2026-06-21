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
        ` · ${x.movement ?? ""}${x.bezelEn ? ` · bezel: ${x.bezelEn}` : ""}${x.strapEn ? ` · dây: ${x.strapEn}` : ""}` +
        (x.subdials ? ` · mặt số: ${x.subdials.replace(/ \| /g, "; ")}` : ""),
    )
    .join("\n");
  const t = terms.map((x) => `- ${x.term}: ${x.short}`).join("\n");
  return `DANH MỤC (${visibleWatches.length} mẫu):\n${w}\n\nTHUẬT NGỮ:\n${t}`;
}
const CONTEXT = buildContext();

type Turn = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ configured: false });

  let body: { question?: string; history?: Turn[] } = {};
  try {
    body = (await req.json()) as { question?: string; history?: Turn[] };
  } catch {
    /* ignore */
  }
  const question = (body.question ?? "").trim();
  if (!question) return NextResponse.json({ configured: true, answer: "Bạn muốn hỏi về mẫu nào?" });

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  const system =
    "Bạn là CHUYÊN GIA đồng hồ kiêm trợ lý SALE (app LearnWatch). Trả lời bằng TIẾNG VIỆT, thực dụng, " +
    "đủ chi tiết khi được hỏi kỹ (so sánh, gợi ý theo ngân sách, cách chốt, ưu/nhược). Ưu tiên dựa vào DANH MỤC; " +
    "nếu ngoài danh mục thì nói rõ là kiến thức chung. Khi nhắc mẫu hãy kèm hãng + biệt danh + giá (nếu có).\n\n" +
    CONTEXT;

  const history: Turn[] = (body.history ?? [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-10);
  // dam bao bat dau bang 'user'
  while (history.length && history[0].role !== "user") history.shift();
  const messages = [...history, { role: "user" as const, content: question }];

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model, max_tokens: 1024, system, messages }),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      return NextResponse.json({ configured: true, error: `API ${r.status}`, detail: detail.slice(0, 300), answer: "" });
    }
    const data = (await r.json()) as { content?: { text?: string }[] };
    const answer = data.content?.map((c) => c.text ?? "").join("") ?? "";
    return NextResponse.json({ configured: true, answer });
  } catch (e) {
    return NextResponse.json({ configured: true, error: String(e), answer: "" });
  }
}
