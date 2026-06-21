"use client";

import { useState } from "react";
import CollectionInfo from "./CollectionInfo";
import { IconBook, IconChevron } from "./icons";
import { playTap } from "@/lib/sound";

/**
 * Nut bam de XO RA khoi "Ve dong" (uu tien doc thap hon thong tin cu the cua mau).
 * data-no-flip: the flashcard se BO QUA tap o khoi nay (khong lat the).
 */
export default function CollectionToggle({
  collection,
  className = "",
}: {
  collection: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className} data-no-flip>
      <button
        onClick={() => {
          setOpen((o) => !o);
          playTap();
        }}
        className="cyber flex w-full items-center justify-between rounded-[6px] border border-gold-700/40 bg-gold-500/10 px-3 py-2.5 text-xs font-bold text-gold-300 active:scale-[0.99]"
      >
        <span className="flex items-center gap-1.5">
          <IconBook className="h-4 w-4" />
          {open ? `Ẩn thông tin dòng ${collection}` : `Về dòng ${collection} — nhấn để xem`}
        </span>
        <IconChevron className={`h-4 w-4 transition-transform ${open ? "-rotate-90" : "rotate-90"}`} />
      </button>
      {open && <CollectionInfo collection={collection} variant="full" className="mt-2" />}
    </div>
  );
}
