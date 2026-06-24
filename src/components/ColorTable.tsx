import type { Watch } from "@/data/types";
import { colorTable } from "@/lib/partColors";

/** Bảng MÀU theo bộ phận: Vỏ / Vành / Mặt số / Mặt phụ — rõ ràng, kèm chú thích tên màu đặc biệt. */
export default function ColorTable({ watch }: { watch: Watch }) {
  const { rows, chronoNote } = colorTable(watch);
  if (!rows.length) return null;
  return (
    <div className="rounded-[6px] border border-hairline bg-surface-2 p-3">
      <p className="label-luxe text-[9px]">Màu sắc từng bộ phận · Colors</p>
      <ul className="mt-1.5 space-y-1.5 text-[12px] leading-snug">
        {rows.map((r, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-px w-[58px] shrink-0 rounded-[3px] border border-gold-700/50 bg-gold-500/10 px-1.5 py-px text-center text-[9px] font-bold uppercase tracking-luxe text-gold-300">
              {r.part}
            </span>
            <span className="min-w-0 text-ivory/90">
              <b className="text-champagne">{r.value}</b>
              {r.notes.map((n, j) => (
                <span key={j} className="mt-0.5 block text-[10.5px] text-taupe">↳ {n}</span>
              ))}
            </span>
          </li>
        ))}
      </ul>
      {chronoNote && (
        <p className="mt-1.5 text-[10.5px] leading-snug text-taupe">
          ↳ Chronograph: 3 mặt phụ (sub-dial) — màu thường TƯƠNG PHẢN hoặc cùng tông với mặt số (xem ảnh để rõ).
        </p>
      )}
    </div>
  );
}
