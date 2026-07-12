import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Orbitron, Baloo_2 } from "next/font/google";
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

// Font "tech" cho SỐ & nhãn latin (sci-fi) — chỉ theme Arcade dùng.
const tech = Orbitron({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-tech",
  display: "swap",
});

// Font tròn trịa cho theme Ấm áp (có dấu tiếng Việt đầy đủ).
const round = Baloo_2({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-round",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LearnWatch — Học đồng hồ cho Sale",
  description:
    "Học mẫu mã, biệt danh, chất liệu & thuật ngữ đồng hồ cao cấp. Rolex · Omega · TAG Heuer · Cartier · Hublot.",
};

export const viewport: Viewport = {
  themeColor: "#050818",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

// Đặt data-theme TRƯỚC khi React chạy → không chớp màu khi mở app
const themeInit = `(function(){try{var t=localStorage.getItem("lw_theme");if(t!=="apple"&&t!=="cozy"&&t!=="game")t="game";document.documentElement.setAttribute("data-theme",t);var m={game:"#050818",apple:"#f2f2f7",cozy:"#fff4e4"};var el=document.querySelector('meta[name="theme-color"]');if(el)el.setAttribute("content",m[t]);}catch(e){document.documentElement.setAttribute("data-theme","game")}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" data-theme="game" suppressHydrationWarning className={`${sans.variable} ${tech.variable} ${round.variable}`}>
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
