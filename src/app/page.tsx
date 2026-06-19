import Link from "next/link";
import ProgressHeader from "@/components/ProgressHeader";
import { IconCards, IconQuiz, IconBook, IconChevron } from "@/components/icons";
import { visibleWatches } from "@/data/watches";
import { terms } from "@/data/terms";

const MODES = [
  { href: "/flashcards", Icon: IconCards, title: "Flashcard", desc: "Vuốt & lật thẻ học mẫu mã, biệt danh, chất liệu." },
  { href: "/quiz", Icon: IconQuiz, title: "Trắc nghiệm", desc: "Nhìn hình đoán mẫu, có giải thích sâu & giá resale." },
  { href: "/browse", Icon: IconBook, title: "Tra cứu", desc: "Tìm nhanh mẫu & thuật ngữ khi đang tư vấn khách." },
];

export default function Home() {
  const rx = visibleWatches.filter((w) => w.brand === "Rolex").length;
  const brandCount = new Set(visibleWatches.map((w) => w.brand)).size;

  return (
    <div className="space-y-6 pt-2">
      <ProgressHeader />

      <section className="space-y-3">
        {MODES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="cyber group flex items-center gap-4 rounded-[6px] border border-hairline bg-surface p-4 transition active:scale-[0.98]"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[6px] border border-hairline text-gold-300">
              <m.Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-ivory">{m.title}</h2>
              <p className="text-xs text-taupe">{m.desc}</p>
            </div>
            <IconChevron className="h-5 w-5 text-taupe transition group-hover:translate-x-0.5 group-hover:text-gold-300" />
          </Link>
        ))}
      </section>

      <section className="card-lux p-5">
        <p className="label-luxe">Thư viện</p>
        <div className="mt-3 grid grid-cols-4 gap-3 text-center">
          <Stat n={visibleWatches.length} label="Mẫu" />
          <Stat n={brandCount} label="Hãng" />
          <Stat n={rx} label="Rolex" />
          <Stat n={terms.length} label="Thuật ngữ" />
        </div>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p className="font-tech text-2xl font-extrabold gold-text">{n}</p>
      <p className="text-[11px] text-taupe">{label}</p>
    </div>
  );
}
