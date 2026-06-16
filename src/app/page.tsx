import Link from "next/link";
import ProgressHeader from "@/components/ProgressHeader";
import { IconCards, IconQuiz, IconBook, IconChevron } from "@/components/icons";
import { watches, rolexWatches, omegaWatches } from "@/data/watches";
import { terms } from "@/data/terms";
import { watchPhotos } from "@/data/photos";

const MODES = [
  { href: "/flashcards", Icon: IconCards, title: "Flashcard", desc: "Lật & vuốt thẻ học mẫu mã, biệt danh, chất liệu." },
  { href: "/quiz", Icon: IconQuiz, title: "Trắc nghiệm", desc: "Đố 4 đáp án, nhìn hình đoán mẫu, có giải thích sâu." },
  { href: "/browse", Icon: IconBook, title: "Tra cứu", desc: "Tìm nhanh mẫu & thuật ngữ khi đang tư vấn khách." },
];

export default function Home() {
  return (
    <div className="space-y-7">
      <section className="pt-3 text-center">
        <p className="label-luxe">Maison d&apos;Horlogerie</p>
        <h1 className="mt-2 font-display text-[34px] font-semibold leading-tight text-ivory">
          Học đồng hồ như <span className="gold-text">dân trong nghề</span>
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-taupe">
          Mẫu mã · biệt danh · chất liệu · thuật ngữ tiếng Anh · giá resale. Tập trung Rolex &amp; Omega.
        </p>
      </section>

      <ProgressHeader />

      <section className="space-y-3">
        {MODES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group flex items-center gap-4 rounded-[22px] border border-hairline bg-surface p-4 transition active:scale-[0.99]"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-hairline text-gold-300">
              <m.Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg font-semibold text-ivory">{m.title}</h2>
              <p className="text-xs text-taupe">{m.desc}</p>
            </div>
            <IconChevron className="h-5 w-5 text-taupe transition group-hover:translate-x-0.5 group-hover:text-gold-300" />
          </Link>
        ))}
      </section>

      <section className="card-lux p-5">
        <p className="label-luxe">Thư viện</p>
        <div className="mt-3 grid grid-cols-4 gap-3 text-center">
          <Stat n={watches.length} label="Mẫu" />
          <Stat n={watchPhotos.size} label="Có ảnh" />
          <Stat n={terms.length} label="Thuật ngữ" />
          <Stat n={rolexWatches.length + omegaWatches.length} label="R + O" />
        </div>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold gold-text">{n}</p>
      <p className="text-[11px] text-taupe">{label}</p>
    </div>
  );
}
