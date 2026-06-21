"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { localAnswer, suggestions, watchDetail, getWatch, type AssistantResult } from "@/lib/assistant";
import { englishName } from "@/lib/name";
import type { Watch } from "@/data/types";
import { playTap, playFlip } from "@/lib/sound";
import { IconSend, IconChat } from "@/components/icons";

interface Msg {
  role: "user" | "assistant";
  text: string;
  watches?: Watch[];
  via?: "ai" | "local";
}

function ResultCard({ w }: { w: Watch }) {
  return (
    <div className="card-lux flex items-center gap-3 p-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/watches/${w.id}.jpg`} alt={w.model} className="h-12 w-12 shrink-0 rounded-[5px] object-cover ring-1 ring-hairline" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ivory">
          {w.nickname ? `${w.nickname} · ` : ""}
          {w.collection}
        </p>
        <p className="truncate text-[11px] text-taupe">
          {w.brand}
          {w.year ? ` · ${w.year}` : ""}
          {w.resale ? ` · ` : ""}
          {w.resale && <span className="text-gold-300">{w.resale}</span>}
        </p>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Tu dong hoi khi vao tu nut "Hoi AI ve mau nay" (?id=...) hoac tim (?q=...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      const w = getWatch(id);
      if (w) {
        askWatch(w);
        return;
      }
    }
    const q = params.get("q");
    if (q && q.trim()) ask(q.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function ask(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    playTap();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);

    const local: AssistantResult = localAnswer(q);
    let answer = local.text;
    let via: "ai" | "local" = "local";
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.text }));
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      const d = (await r.json()) as { configured?: boolean; answer?: string };
      if (d.configured && d.answer) {
        answer = d.answer;
        via = "ai";
      }
    } catch {
      /* fallback local */
    }
    setMessages((m) => [...m, { role: "assistant", text: answer, watches: local.watches, via }]);
    setLoading(false);
    playFlip();
  }

  async function askWatch(w: Watch) {
    if (loading) return;
    playTap();
    setMessages((m) => [...m, { role: "user", text: `Mẫu này là gì? · ${englishName(w)}` }]);
    setLoading(true);
    const local = watchDetail(w);
    let answer = local.text;
    let via: "ai" | "local" = "local";
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.text }));
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question: `Tư vấn bán mẫu ${englishName(w)}${w.colorEn ? ` (${w.colorEn})` : ""} cho khách: điểm nổi bật, hợp đối tượng nào, mẹo chốt sale.`,
          history,
        }),
      });
      const d = (await r.json()) as { configured?: boolean; answer?: string };
      if (d.configured && d.answer) {
        answer = d.answer;
        via = "ai";
      }
    } catch {
      /* fallback local */
    }
    setMessages((m) => [...m, { role: "assistant", text: answer, watches: local.watches, via }]);
    setLoading(false);
    playFlip();
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-3">
      <div className="shrink-0">
        <p className="label-luxe">Trợ lý đồng hồ</p>
        <h1 className="font-display text-2xl font-semibold text-ivory">Hỏi gì về đồng hồ?</h1>
      </div>

      {/* Goi y */}
      <div className="flex shrink-0 flex-wrap gap-2">
        {suggestions().map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            className="cyber rounded-[5px] border border-hairline px-3 py-1.5 text-xs text-taupe transition active:scale-95"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Hoi dap */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-1">
        {messages.length === 0 && (
          <div className="card-lux flex flex-col items-center gap-2 p-6 text-center text-taupe">
            <IconChat className="h-8 w-8 text-gold-300" />
            <p className="text-sm">
              Hỏi về mẫu, biệt danh, chất liệu, giá, hãng, hay máy/calibre. Mình trả lời ngay từ dữ liệu 98 mẫu.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={m.role === "user" ? "flex justify-end" : ""}
            >
              {m.role === "user" ? (
                <div className="max-w-[85%] rounded-[6px] bg-gold-foil px-3.5 py-2 text-sm font-semibold text-ink">
                  {m.text}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="card-lux p-3.5">
                    {m.via && (
                      <span className="label-luxe mb-1 block text-[9px]">
                        {m.via === "ai" ? "✦ Claude AI" : "✦ Trợ lý (dữ liệu app)"}
                      </span>
                    )}
                    <p className="whitespace-pre-line text-sm text-ivory/90">{m.text}</p>
                  </div>
                  {m.watches && m.watches.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {m.watches.slice(0, 8).map((w) => (
                        <ResultCard key={w.id} w={w} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="card-lux flex items-center gap-2 p-3 text-sm text-taupe">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold-400" />
            Đang nghĩ…
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* O nhap */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex shrink-0 items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Vd: Rolex xanh lá, Cerachrom là gì, mẫu nhập môn…"
          className="min-w-0 flex-1 rounded-[6px] border border-hairline bg-surface px-3.5 py-3 text-sm text-ivory outline-none placeholder:text-taupe focus:border-gold-600"
        />
        <button
          type="submit"
          aria-label="Gửi"
          className="cyber grid h-12 w-12 shrink-0 place-items-center rounded-[6px] bg-gold-foil text-ink shadow-glow transition active:scale-90"
        >
          <IconSend className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
