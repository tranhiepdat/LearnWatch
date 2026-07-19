import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Baloo_2, IBM_Plex_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import RippleProvider from "@/components/RippleProvider";
import ThemeDecor from "@/components/ThemeDecor";
import { ThemeProvider } from "@/lib/theme";

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

// Font tròn trịa cho theme Ấm áp (có dấu tiếng Việt đầy đủ).
const round = Baloo_2({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-round",
  display: "swap",
});

// Font mono kỹ thuật cho SỐ & nhãn theme Digital.
const mono2 = IBM_Plex_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-mono2",
  display: "swap",
});

// Serif sang trọng cho theme Boutique (có dấu tiếng Việt đầy đủ).
const serif = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LearnWatch — Học đồng hồ cho Sale",
  description:
    "Học mẫu mã, biệt danh, chất liệu & thuật ngữ đồng hồ cao cấp. Rolex · Omega · TAG Heuer · Cartier · Hublot.",
};

export const viewport: Viewport = {
  themeColor: "#07080f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

// Đặt data-theme TRƯỚC khi React chạy → không chớp màu khi mở app.
// Kèm migrate id theme cũ (5 theme → 3): apple→lux, dreamy→cozy, studio→game.
const themeInit = `(function(){try{var mg={apple:"lux",dreamy:"cozy",studio:"game"};var ok=["cozy","game","lux"];var t=localStorage.getItem("lw_theme");t=mg[t]||t;if(ok.indexOf(t)<0)t="game";document.documentElement.setAttribute("data-theme",t);var m={game:"#07080f",cozy:"#f8eedd",lux:"#0a1712"};var el=document.querySelector('meta[name="theme-color"]');if(el)el.setAttribute("content",m[t]);}catch(e){document.documentElement.setAttribute("data-theme","game")}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      data-theme="game"
      suppressHydrationWarning
      className={`${sans.variable} ${round.variable} ${mono2.variable} ${serif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <ThemeProvider>
          <ThemeDecor />
          <RippleProvider />
          <div className="app-frame relative flex h-[100dvh] flex-col">
            <TopBar />
            {/* scroll container thật nằm trong template.tsx (per-page) — để
                pb tránh BottomNav được tính SAU nội dung của chính trang */}
            <main className="relative z-10 min-h-0 flex-1 overflow-hidden">{children}</main>
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
