import Link from "next/link";
import ProgressHeader from "@/components/ProgressHeader";
import { watches, rolexWatches, omegaWatches } from "@/data/watches";
import { terms } from "@/data/terms";

const MODES = [
  {
    href: "/flashcards",
    emoji: "🃏",
    title: "Flashcard",
    desc: "Lật thẻ học mẫu mã, biệt danh & chất liệu. Đánh dấu “đã thuộc”.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    href: "/quiz",
    emoji: "🎯",
    title: "Trắc nghiệm",
    desc: "Đố 4 đáp án + nhìn hình đoán mẫu. Có giải thích, cộng XP.",
    color: "from-amber-500 to-orange-600",
  },
  {
    href: "/browse",
    emoji: "📖",
    title: "Tra cứu nhanh",
    desc: "Toàn bộ mẫu & thuật ngữ, tìm kiếm tức thì khi tư vấn khách.",
    color: "from-sky-500 to-indigo-600",
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Học đồng hồ cho Sale ⌚
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-600">
          Nắm chắc <b>mẫu mã</b>, <b>tên dân chơi</b> và <b>chất liệu</b> để tư vấn khách tự tin.
          Tập trung <span className="font-semibold text-rolex">Rolex</span> &amp;{" "}
          <span className="font-semibold text-omega">Omega</span>.
        </p>
      </section>

      <ProgressHeader />

      <section className="grid gap-3">
        {MODES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl ${m.color}`}
            >
              {m.emoji}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900">{m.title}</h2>
              <p className="text-sm text-slate-500">{m.desc}</p>
            </div>
            <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500">
              →
            </span>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Thư viện hiện có</h3>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat n={watches.length} label="Mẫu đồng hồ" />
          <Stat n={terms.length} label="Thuật ngữ" />
          <Stat n={rolexWatches.length} label="Rolex" />
          <Stat n={omegaWatches.length} label="Omega" />
        </div>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-extrabold text-slate-900">{n}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
