"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useAnimationControls } from "framer-motion";
import { IconHome, IconCards, IconQuiz, IconBook, IconChat, IconBox } from "./icons";
import { playTap } from "@/lib/sound";
import { hTap } from "@/lib/haptics";
import { useTheme } from "@/lib/theme";

const tabs = [
  { href: "/", label: "Trang chủ", Icon: IconHome },
  { href: "/flashcards", label: "Học", Icon: IconCards },
  { href: "/quiz", label: "Đố", Icon: IconQuiz },
  { href: "/browse", label: "Tra cứu", Icon: IconBook },
  { href: "/inventory", label: "Kho", Icon: IconBox },
  { href: "/assistant", label: "Trợ lý", Icon: IconChat },
];

// cozy: mỗi tab một màu pastel riêng khi active — nhìn như hộp kẹo
const COZY_TAB = ["#ff6b57", "#ffb63d", "#2fbf9b", "#5aa9ff", "#b983ff", "#ff5c8a"];

/**
 * Tab bar — "tính cách" active đổi theo theme:
 *  · game  — vạch neon trên đỉnh + icon phát sáng, nảy điện
 *  · apple — viên pill xám sau icon, trượt spring mượt
 *  · cozy  — blob tròn màu RIÊNG TỪNG TAB, icon lúc lắc
 */
function Tab({
  href,
  label,
  Icon,
  active,
  index,
}: {
  href: string;
  label: string;
  Icon: (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
  active: boolean;
  index: number;
}) {
  const { theme, meta } = useTheme();
  const bounce = useAnimationControls();
  const cozyColor = COZY_TAB[index % COZY_TAB.length];

  function onTap() {
    playTap();
    hTap();
    if (theme === "cozy") {
      bounce.start({ rotate: [0, -12, 10, -6, 0], scale: [1, 1.25, 0.95, 1.08, 1], transition: { duration: 0.55 } });
    } else if (theme === "game") {
      bounce.start({ y: [0, -7, 0, -2.5, 0], transition: { duration: 0.45, ease: "easeOut" } });
    } else {
      bounce.start({ scale: [1, 1.14, 1], transition: { duration: 0.32, ease: [0.3, 0.7, 0.3, 1] } });
    }
  }

  return (
    <Link
      href={href}
      onClick={onTap}
      className={`cyber relative flex flex-1 flex-col items-center gap-1 py-2.5 transition active:scale-90 ${
        active ? "text-gold-300" : "text-taupe"
      }`}
      style={theme === "cozy" && active ? { color: cozyColor } : undefined}
    >
      {/* chỉ báo active theo theme */}
      {active && theme === "game" && (
        <motion.span
          layoutId="nav-active"
          className="absolute -top-px h-0.5 w-9 rounded-full bg-gold-foil"
          style={{ boxShadow: "0 0 12px 1px rgb(var(--c-accent) / 0.8)" }}
          transition={meta.motion.spring}
        />
      )}
      {active && theme === "apple" && (
        <motion.span
          layoutId="nav-active"
          className="absolute top-1.5 h-[30px] w-14 rounded-full bg-surface-3"
          transition={meta.motion.spring}
        />
      )}
      {active && theme === "cozy" && (
        <motion.span
          layoutId="nav-active"
          className="absolute top-1 h-[34px] w-[34px]"
          style={{ background: `${cozyColor}2e`, borderRadius: "46% 54% 58% 42% / 52% 44% 56% 48%" }}
          transition={meta.motion.bouncy}
        />
      )}
      <motion.span animate={bounce} className="relative z-10">
        <Icon
          className="h-[22px] w-[22px]"
          style={theme === "game" && active ? { filter: "drop-shadow(0 0 6px rgb(var(--c-accent) / 0.9))" } : undefined}
        />
      </motion.span>
      <span className={`relative z-10 text-[10px] tracking-wide ${active ? "font-bold" : "font-medium"}`}>{label}</span>
    </Link>
  );
}

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto w-full max-w-lg px-4 pb-[max(10px,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around rounded-[var(--r-lg)] border border-hairline bg-surface/85 shadow-lux backdrop-blur-xl">
          {tabs.map(({ href, label, Icon }, i) => (
            <Tab
              key={href}
              href={href}
              label={label}
              Icon={Icon}
              index={i}
              active={href === "/" ? path === "/" : path.startsWith(href)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
