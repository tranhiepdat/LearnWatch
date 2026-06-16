import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LearnWatch — Học đồng hồ cho Sale",
  description:
    "Học mẫu mã, biệt danh, chất liệu & thuật ngữ đồng hồ cao cấp. Flashcard, trắc nghiệm nhìn hình. Rolex & Omega.",
};

export const viewport: Viewport = {
  themeColor: "#0B0A0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={sans.variable}>
      <body>
        <div className="app-frame relative flex h-[100dvh] flex-col">
          <TopBar />
          <main className="relative z-10 min-h-0 flex-1 overflow-y-auto px-5 pb-28 pt-1">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
