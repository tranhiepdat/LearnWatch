import Link from "next/link";
import ProgressHeader from "@/components/ProgressHeader";
import CollectionInfo from "@/components/CollectionInfo";
import { IconCards, IconQuiz, IconBook, IconChat, IconChevron } from "@/components/icons";
import { visibleWatches } from "@/data/watches";
import { terms } from "@/data/terms";
import { collectionInfos } from "@/data/collections";

const FEATURED = ["Submariner", "GMT-Master II", "Cosmograph Daytona", "Speedmaster", "Royal Oak", "Nautilus"];

const MODES = [
  { href: "/assistant", Icon: IconChat, title: "Trợ lý AI", desc: "Hỏi gì về đồng hồ — tìm mẫu, giá, thuật ngữ, máy/calibre." },
  { href: "/flashcards", Icon: IconCards, title: "Flashcard", desc: "Vuốt & lật thẻ học mẫu mã, biệt danh, chất liệu." },
  { href: "/quiz", Icon: IconQuiz, title: "Trắc nghiệm", desc: "Nhìn hình đoán mẫu, có giải thích sâu & giá resale." },
  { href: "/browse", Icon: IconBook, title: "Tra cứu", desc: "Tìm nhanh mẫu & thuật ngữ khi đang tư vấn khách." },
];

export default function Home() {
  const rx = visibleWatches.filter((w) => w.brand === "Rolex").length;
  const brandCount = new Set(visibleWatches.map((w) => w.brand)).size;
  const collCount = collectionInfos.filter((c) => visibleWatches.some((w) => w.collection === c.collection)).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pt-2">
      <ProgressHeader />

      <section className="grid gap-3 md:grid-cols-2">
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

      <Link href="/inventory" className="cyber card-lux group block p-5 active:scale-[0.99]">
        <div className="flex items-center justify-between">
          <p className="label-luxe">Kho hàng · Thư viện</p>
          <span className="text-xs font-semibold text-gold-300">Xem kho →</span>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3 text-center">
          <Stat n={visibleWatches.length} label="Mẫu" />
          <Stat n={brandCount} label="Hãng" />
          <Stat n={rx} label="Rolex" />
          <Stat n={terms.length} label="Thuật ngữ" />
        </div>
      </Link>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="label-luxe">Các dòng đồng hồ</p>
            <h2 className="font-display text-xl font-semibold text-ivory">Dòng này để làm gì?</h2>
          </div>
          <Link href="/browse?tab=dong" className="cyber rounded-[5px] border border-hairline px-3 py-1.5 text-xs font-semibold text-gold-300 active:scale-95">
            Xem tất cả {collCount} dòng →
          </Link>
        </div>
        <div className="grid gap-2.5 md:grid-cols-2">
          {FEATURED.map((c) => (
            <CollectionInfo key={c} collection={c} variant="compact" />
          ))}
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
