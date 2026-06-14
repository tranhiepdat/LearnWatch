import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnWatch — Học đồng hồ cho Sale",
  description:
    "App học đồng hồ kiểu Duolingo: mẫu mã, biệt danh dân chơi, chất liệu. Tập trung Rolex & Omega.",
};

export const viewport: Viewport = {
  themeColor: "#006039",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-slate-900">
              <span className="text-xl">⌚</span>
              <span>LearnWatch</span>
            </Link>
            <nav className="flex gap-1 text-sm font-semibold">
              <Link href="/flashcards" className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100">
                Flashcard
              </Link>
              <Link href="/quiz" className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100">
                Trắc nghiệm
              </Link>
              <Link href="/browse" className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100">
                Tra cứu
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-3xl px-4 py-10 text-center text-xs text-slate-400">
          LearnWatch · Công cụ đào tạo sale đồng hồ · Rolex &amp; Omega
        </footer>
      </body>
    </html>
  );
}
