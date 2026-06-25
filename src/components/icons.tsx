import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

/** Logo: vương miện tối giản (old-money crest, góc cạnh) */
export const IconCrest = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8l3.5 2.5L12 5l4.5 5.5L20 8l-1.5 9.5h-13L4 8Z" />
    <path d="M6 20h12" />
    <rect x="11" y="11.4" width="2" height="2" fill="currentColor" stroke="none" />
  </svg>
);

/** HOME — nhà góc cạnh + cửa */
export const IconHome = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 11 12 4l8.5 7" />
    <path d="M6 9.6V20h12V9.6" />
    <path d="M10 20v-4.5h4V20" />
  </svg>
);

/** HỌC — chồng thẻ có góc vát (notch HUD) */
export const IconCards = (p: P) => (
  <svg {...base(p)}>
    <path d="M7.5 5H16l2 2v12H7.5V5Z" />
    <path d="M16 5v2h2" />
    <path d="M4.5 8v9A2 2 0 0 0 6.5 19" opacity="0.55" />
    <path d="M10 9.5h4M10 12.5h4.5" opacity="0.8" />
  </svg>
);

/** ĐỐ — tâm ngắm crosshair (HUD sci-fi) */
export const IconQuiz = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="6.5" />
    <path d="M12 2.2v3.3M12 18.5v3.3M2.2 12h3.3M18.5 12h3.3" />
    <rect x="10.6" y="10.6" width="2.8" height="2.8" fill="currentColor" stroke="none" />
  </svg>
);

/** TRA CỨU — data-pad / tài liệu kẻ dòng */
export const IconBook = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3.5h10l2 2V20.5H6V3.5Z" />
    <path d="M9 8h6M9 11.5h6M9 15h3.5" opacity="0.85" />
    <path d="M16 3.5v2h2" />
  </svg>
);

export const IconSound = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 9h3L11 6v12L7.5 15h-3V9Z" />
    <path d="M14.5 8.6a4 4 0 0 1 0 6.8M17 6.2a7 7 0 0 1 0 11.6" />
  </svg>
);

export const IconMute = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 9h3L11 6v12L7.5 15h-3V9Z" />
    <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" />
  </svg>
);

export const IconFlame = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.2c2.6 3 4.6 4.9 4.6 8.3A4.6 4.6 0 0 1 12 20.6a4.6 4.6 0 0 1-4.6-4.9c0-1.6.7-2.8 1.7-3.8.3 1 .9 1.6 1.6 1.9-.2-2.5.5-4.5 1.9-6Z" />
  </svg>
);

/** Kim cương lục giác (XP) */
export const IconGem = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 4h10l3.2 5L12 20.5 3.8 9 7 4Z" />
    <path d="M3.8 9h16.4M8.5 4l-1.2 5L12 20.5 16.7 9 15.5 4" opacity="0.6" />
  </svg>
);

export const IconBox = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" />
    <path d="M3 7.5 12 12l9-4.5M12 12v9" opacity="0.55" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)} strokeWidth={2.3}>
    <path d="M5 12.5 10 17l9-10" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base(p)} strokeWidth={2.3}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const IconShuffle = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h3.5l9 10H20M4 17h3.5l3-3.3M14 7h6m0 0-2.2-2.2M20 7l-2.2 2.2M14 17h6m0 0-2.2 2.2M20 17l-2.2-2.2" />
  </svg>
);

export const IconSwipe = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 12h9m0 0-3-3m3 3-3 3" />
    <path d="M4.5 8.5v7" opacity="0.5" />
  </svg>
);

/** Tia sáng 4 cánh sắc (sci-fi) */
export const IconSparkle = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Z" />
  </svg>
);

/** Trợ lý AI — bong bóng chat + tia */
export const IconChat = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 6A1.8 1.8 0 0 1 6.3 4.2h11.4A1.8 1.8 0 0 1 19.5 6v8a1.8 1.8 0 0 1-1.8 1.8H9.2L5 19.4V15.8h-.3A1.8 1.8 0 0 1 4.5 14V6Z" />
    <path d="M9 9.2h6M9 12h3.5" opacity="0.85" />
  </svg>
);

export const IconSend = (p: P) => (
  <svg {...base(p)} strokeWidth={1.9}>
    <path d="M4 11.5 19 5l-4.5 14-3.2-5.6L4 11.5Z" />
    <path d="M11.3 13.4 19 5" opacity="0.6" />
  </svg>
);
