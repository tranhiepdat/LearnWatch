import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Orbitron } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import RippleProvider from "@/components/RippleProvider";

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

// Font "tech" cho SỐ & nhãn latin (sci-fi). Không dùng cho tiếng Việt.
const tech = Orbitron({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-tech",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LearnWatch — Học đồng hồ cho Sale",
  description:
    "Học mẫu mã, biệt danh, chất liệu & thuật ngữ đồng hồ cao cấp. Rolex · Omega · TAG Heuer · Cartier · Hublot.",
};

export const viewport: Viewport = {
  themeColor: "#0A0F0C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sans.variable} ${tech.variable}`}>
      <body>
        <div aria-hidden className="scanline" />
        <RippleProvider />
        <div className="app-frame relative flex h-[100dvh] flex-col">
          <TopBar />
          <main className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-28 pt-1">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
