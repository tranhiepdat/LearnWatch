"use client";

import { useState } from "react";
import type { Watch } from "@/data/types";

const CASE_FILL: Record<NonNullable<Watch["caseColor"]>, [string, string]> = {
  steel: ["#dfe3e7", "#9aa1a8"],
  yellowgold: ["#f1d27a", "#c79a2e"],
  rosegold: ["#e7b394", "#bd7551"],
  whitegold: ["#e8ebee", "#b8bec4"],
  platinum: ["#edecea", "#c2c1bd"],
  titanium: ["#c2c6ca", "#83898f"],
  blackceramic: ["#3a3a3d", "#161618"],
};

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function polar(angleDeg: number, len: number, cx = 100, cy = 100) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + len * Math.sin(rad), y: cy - len * Math.cos(rad) };
}

export default function WatchVisual({
  watch,
  size = 200,
  className = "",
}: {
  watch: Watch;
  size?: number;
  className?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = watch.image ?? `/watches/${watch.id}.jpg`;

  if (!imgFailed) {
    // Thu tai anh that; neu khong co file se tu chuyen sang ve SVG.
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={watch.model}
        width={size}
        height={size}
        onError={() => setImgFailed(true)}
        className={`rounded-full object-cover shadow-inner ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const [c1, c2] = CASE_FILL[watch.caseColor ?? "steel"];
  const bezel = watch.bezelColors && watch.bezelColors.length > 0 ? watch.bezelColors : ["#1a1a1a"];
  const dial = watch.dialColor ?? "#101010";
  const handColor = luminance(dial) > 0.6 ? "#1a1a1a" : "#f3f3f3";
  const markerColor = handColor;
  const uid = watch.id;

  const min = polar(60, 58); // 10:10 phut
  const hr = polar(305, 40); // 10:10 gio
  const sec = polar(180, 64); // kim giay

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label={watch.model}
      className={className}
    >
      <defs>
        <radialGradient id={`case-${uid}`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </radialGradient>
        <radialGradient id={`dial-${uid}`} cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor={dial} stopOpacity={0.92} />
          <stop offset="100%" stopColor={dial} />
        </radialGradient>
      </defs>

      {/* vo + tai vau */}
      <circle cx="100" cy="100" r="98" fill={`url(#case-${uid})`} />
      {/* vanh bezel */}
      <circle cx="100" cy="100" r="92" fill={bezel[0]} />
      {bezel[1] && <path d="M100,8 A92,92 0 0 1 100,192 Z" fill={bezel[1]} />}
      {/* vien trong bezel */}
      <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
      {/* mat so */}
      <circle cx="100" cy="100" r="68" fill={`url(#dial-${uid})`} />

      {/* coc gio */}
      {Array.from({ length: 12 }).map((_, i) => {
        const p = polar(i * 30, 58);
        const isCardinal = i % 3 === 0;
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={isCardinal ? 3.4 : 2.2}
            fill={markerColor}
            opacity={0.9}
          />
        );
      })}

      {/* kim */}
      <line x1="100" y1="100" x2={hr.x} y2={hr.y} stroke={handColor} strokeWidth="5" strokeLinecap="round" />
      <line x1="100" y1="100" x2={min.x} y2={min.y} stroke={handColor} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2={sec.x} y2={sec.y} stroke="#e0463c" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="100" cy="100" r="4" fill={handColor} />
    </svg>
  );
}
