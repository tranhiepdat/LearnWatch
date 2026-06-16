"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { IconHome, IconCards, IconQuiz, IconBook } from "./icons";
import { playTap } from "@/lib/sound";

const tabs = [
  { href: "/", label: "Trang chủ", Icon: IconHome },
  { href: "/flashcards", label: "Học", Icon: IconCards },
  { href: "/quiz", label: "Đố", Icon: IconQuiz },
  { href: "/browse", label: "Tra cứu", Icon: IconBook },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30">
      <div className="app-frame px-4 pb-[max(10px,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around rounded-[22px] border border-hairline bg-surface/85 shadow-lux backdrop-blur-xl">
          {tabs.map(({ href, label, Icon }) => {
            const active = href === "/" ? path === "/" : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => playTap()}
                className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 transition active:scale-90 ${
                  active ? "text-gold-300" : "text-taupe"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute -top-px h-0.5 w-9 rounded-full bg-gold-foil"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className="h-[22px] w-[22px]" />
                <span className="text-[10px] font-medium tracking-wide">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
