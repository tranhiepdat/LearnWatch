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

/**
 * Tab bar — MỘT cấu trúc: nền chỉ báo trượt spring sau icon; chất chỉ báo
 * đổi theo theme (neon vạch / kính / kẹo đặc / khảm / khung chọn) nhưng
 * kích thước & hành vi thống nhất. Tap = một nhịp scale nhỏ, không nhảy múa.
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
  const cozyColors = ["#ff5e3a", "#ffb020", "#00c48c", "#38bdf8", "#8b5cf6", "#ec4899"];
  const cozyColor = cozyColors[index % cozyColors.length];
  const cozyActive = theme === "cozy" && active;

  function onTap() {
    playTap();
    hTap();
    bounce.start({ scale: [1, 0.88, 1.04, 1], transition: { duration: 0.28, ease: "easeOut" } });
  }

  return (
    <Link
      href={href}
      onClick={onTap}
      className={`cyber relative flex flex-1 flex-col items-center gap-1 py-2.5 transition active:scale-95 ${
        active ? "text-gold-300" : "text-taupe"
      }`}
      style={cozyActive ? { color: cozyColor } : undefined}
    >
      {active && theme === "game" && (
        <motion.span
          layoutId="nav-active"
          className="absolute -top-px h-0.5 w-9 bg-gold-foil"
          transition={meta.motion.spring}
        />
      )}
      {active && theme === "apple" && (
        <motion.span
          layoutId="nav-active"
          className="absolute top-1 h-[32px] w-14 rounded-[var(--r-full)]"
          style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)" }}
          transition={meta.motion.spring}
        />
      )}
      {cozyActive && (
        <motion.span
          layoutId="nav-active"
          className="absolute top-0.5 h-[34px] w-[34px] rounded-[var(--r-full)]"
          style={{ background: cozyColor, boxShadow: `inset 0 2px 0 rgba(255,255,255,0.4)` }}
          transition={meta.motion.bouncy}
        />
      )}
      {active && theme === "dreamy" && (
        <motion.span
          layoutId="nav-active"
          className="absolute top-1 h-[32px] w-[32px]"
          style={{ background: "rgb(var(--c-accent) / 0.14)", borderRadius: "26%", rotate: 6 }}
          transition={meta.motion.spring}
        />
      )}
      {active && theme === "studio" && (
        <motion.span layoutId="nav-active" className="absolute top-1 h-[32px] w-[36px]" transition={meta.motion.spring}>
          <span className="absolute inset-0 border-[1.5px] border-white/75" />
          {["-left-[3px] -top-[3px]", "-right-[3px] -top-[3px]", "-left-[3px] -bottom-[3px]", "-right-[3px] -bottom-[3px]"].map(
            (pos) => (
              <span key={pos} className={`absolute h-[5px] w-[5px] bg-white ${pos}`} />
            ),
          )}
        </motion.span>
      )}
      <motion.span animate={bounce} className="relative z-10">
        <Icon className="h-[22px] w-[22px]" style={cozyActive ? { color: "#fff" } : undefined} />
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
        <div className="flex items-center justify-around rounded-[var(--r-lg)] border border-hairline bg-surface/90 shadow-lux backdrop-blur-xl">
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
