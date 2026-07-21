"use client";

import { useEffect, useRef, useState } from "react";
import { IconChevron } from "./icons";
import { playTap } from "@/lib/sound";

/**
 * Dropdown gon (thay cho hang chip dai): hien lua chon hien tai, bam moi xo ra
 * danh sach de chon. Tiet kiem khong gian (vd chon HANG: mac dinh Rolex).
 */
export default function FilterSelect({
  value,
  options,
  onChange,
  label,
  counts,
  className = "",
}: {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  label?: string;
  counts?: Record<string, number>;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => {
          setOpen((o) => !o);
          playTap();
        }}
        className="cyber flex items-center gap-2 rounded-[var(--r-sm)] bg-gold-foil px-4 py-1.5 text-sm font-bold text-onaccent shadow-glow active:scale-95"
      >
        {label && <span className="text-[10px] font-semibold uppercase tracking-luxe opacity-70">{label}</span>}
        <span>{value}</span>
        <IconChevron className={`h-3.5 w-3.5 transition-transform ${open ? "-rotate-90" : "rotate-90"}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 mt-1.5 max-h-[55vh] w-52 overflow-y-auto rounded-[var(--r-md)] border border-hairline bg-surface p-1 shadow-2xl">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => {
                onChange(o);
                setOpen(false);
                playTap();
              }}
              className={`flex w-full items-center justify-between rounded-[var(--r-xs)] px-3 py-2 text-left text-sm transition active:scale-[0.98] ${
                o === value ? "bg-gold-400 font-semibold text-onaccent" : "text-ivory hover:bg-surface-2"
              }`}
            >
              <span>{o}</span>
              {counts && counts[o] != null && <span className="font-tech text-[11px] text-taupe">{counts[o]}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
