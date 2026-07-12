import { getCollectionInfo } from "@/data/collections";

/**
 * Khoi thong tin theo DONG (collection): dong nay de lam gi, dac trung, lich su, hop ai.
 * variant "compact" = tagline + cong dung; "full" = day du.
 */
export default function CollectionInfo({
  collection,
  variant = "full",
  className = "",
}: {
  collection: string;
  variant?: "compact" | "full";
  className?: string;
}) {
  const info = getCollectionInfo(collection);
  if (!info) return null;

  if (variant === "compact") {
    return (
      <div className={`rounded-[var(--r-md)] border border-hairline bg-surface-2 p-3 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="rounded-[3px] border border-gold-700/50 bg-gold-500/10 px-1.5 py-px text-[9px] font-bold uppercase tracking-luxe text-gold-300">
            Dòng
          </span>
          <span className="font-display text-sm font-semibold text-ivory">{info.collection}</span>
          <span className="text-[11px] text-gold-300">· {info.tagline}</span>
        </div>
        <p className="mt-1.5 text-[12px] leading-snug text-ivory/90">
          <b className="text-champagne">Để làm gì:</b> {info.purpose}
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-[var(--r-md)] border border-gold-700/40 bg-surface-2 p-3.5 ${className}`}>
      <p className="label-luxe text-[9px]">Về dòng · About the line</p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="font-display text-base font-semibold text-ivory">{info.collection}</span>
        <span className="text-[11px] font-semibold text-gold-300">{info.tagline}</span>
      </div>

      <p className="mt-2 text-[12.5px] leading-snug text-ivory/90">
        <b className="text-champagne">Để làm gì · Purpose:</b> {info.purpose}
      </p>

      <p className="mt-2 text-[11px] font-semibold uppercase tracking-luxe text-taupe">Đặc trưng nhận diện</p>
      <ul className="mt-1 space-y-1 text-[12px] leading-snug text-ivory/90">
        {info.signature.map((s, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-gold-400">◆</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>

      {info.variants && (
        <p className="mt-2 text-[12px] leading-snug text-ivory/85">
          <b className="text-champagne">Biến thể nên biết:</b> {info.variants}
        </p>
      )}

      <p className="mt-2 text-[12px] leading-snug text-ivory/85">
        <b className="text-champagne">Lịch sử:</b> {info.heritage}
      </p>

      {info.priceNote && (
        <p className="mt-1.5 text-[12px] leading-snug text-ivory/85">
          <b className="text-champagne">Giá &amp; định vị:</b> {info.priceNote}
        </p>
      )}

      <p className="mt-1.5 rounded-[var(--r-sm)] border border-gold-700/40 bg-gold-500/10 p-2 text-[12px] leading-snug text-gold-200">
        <b>Hợp ai / cách chốt:</b> {info.forWho}
      </p>

      {info.terms && (
        <p className="mt-2 rounded-[var(--r-sm)] border border-hairline bg-ink/40 px-2 py-1 font-tech text-[10.5px] text-gold-200">
          EN: {info.terms}
        </p>
      )}
    </div>
  );
}
