import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

/** Logo: vuong mien toi gian (old-money crest) */
export const IconCrest = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8l3.5 2.5L12 5l4.5 5.5L20 8l-1.5 9.5h-13L4 8Z" />
    <path d="M6 20h12" />
    <circle cx="12" cy="12.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconHome = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 11.5 12 4l8 7.5" />
    <path d="M6 10.5V20h12v-9.5" />
  </svg>
);

/** The bai (flashcard) chong nhau */
export const IconCards = (p: P) => (
  <svg {...base(p)}>
    <rect x="6.5" y="5" width="11" height="14" rx="2.5" />
    <path d="M4 8.5v8.5A2.5 2.5 0 0 0 6.5 19.5" opacity="0.5" />
  </svg>
);

/** Trac nghiem: kim cuong / muc tieu */
export const IconQuiz = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5 19 9l-7 11.5L5 9l7-5.5Z" />
    <path d="M5 9h14M9.5 9 12 3.6 14.5 9 12 20" opacity="0.55" />
  </svg>
);

export const IconBook = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 5.5A2 2 0 0 1 7 4h11v14.5H7a2 2 0 0 0-2 2V5.5Z" />
    <path d="M5 18.5A2 2 0 0 1 7 16.5h11" opacity="0.55" />
  </svg>
);

export const IconSound = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 9.5h3l4-3.5v12l-4-3.5H5v-5Z" />
    <path d="M15.5 8.5a4 4 0 0 1 0 7M17.8 6a7 7 0 0 1 0 12" />
  </svg>
);

export const IconMute = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 9.5h3l4-3.5v12l-4-3.5H5v-5Z" />
    <path d="M16 9.5l5 5M21 9.5l-5 5" />
  </svg>
);

export const IconFlame = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5c2.5 3 4.5 4.8 4.5 8.2A4.5 4.5 0 0 1 12 20.5a4.5 4.5 0 0 1-4.5-4.8c0-1.6.7-2.7 1.6-3.7.3 1 .9 1.6 1.6 1.9-.2-2.4.5-4.4 1.8-5.9Z" />
  </svg>
);

export const IconGem = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 4h10l3 5-8 11L4 9l3-5Z" />
    <path d="M4 9h16M9 4l-2 5 5 11 5-11-2-5" opacity="0.55" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)} strokeWidth={2.2}>
    <path d="M5 12.5 10 17l9-10" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base(p)} strokeWidth={2.2}>
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

export const IconSparkle = (p: P) => (
  <svg {...base(p)} strokeWidth={1.4}>
    <path d="M12 4c.6 3.4 1.6 4.4 5 5-3.4.6-4.4 1.6-5 5-.6-3.4-1.6-4.4-5-5 3.4-.6 4.4-1.6 5-5Z" />
  </svg>
);
