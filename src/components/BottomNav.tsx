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

// cozy: mỗi tab một màu KẸO ĐẶC riêng khi active
const COZY_TAB = ["#ff5e3a", "#ffb020", "#00c48c", "#38bdf8", "#8b5cf6", "#ec4899"];

/**
 * Tab bar — "tính cách" active đổi theo theme:
 *  · game   — vạch neon trên đỉnh + icon phát sáng, nảy điện
 *  · apple  — viên kính trắng mờ trượt spring, icon nổi
 *  · cozy   — ĐỒNG XU MÀU ĐẶC riêng từng tab, icon trắng, lúc lắc
 *  · dreamy — ô khảm lilac xoay nhẹ + trôi lững lờ
 *  · studio — KHUNG CHỌN trắng + 4 chấm handle quanh icon, snap
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
      // kẹo nảy TUNG lên + lúc lắc
      bounce.start({
        y: [0, -12, 0, -5, 0],
        rotate: [0, -12, 10, -5, 0],
        scale: [1, 1.28, 0.94, 1.1, 1],
        transition: { duration: 0.65, ease: "easeOut" },
      });
    } else if (theme === "game") {
      bounce.start({ y: [0, -7, 0, -2.5, 0], transition: { duration: 0.45, ease: "easeOut" } });
    } else if (theme === "studio") {
      bounce.start({ scale: [1, 0.85, 1.06, 1], transition: { duration: 0.3, ease: "easeOut" } });
    } else if (theme === "dreamy") {
      bounce.start({ y: [0, -6, 0], rotate: [0, 4, 0], transition: { duration: 0.7, ease: "easeInOut" } });
    } else {
      bounce.start({ scale: [1, 1.14, 1], transition: { duration: 0.32, ease: [0.3, 0.7, 0.3, 1] } });
    }
  }

  const cozyActive = theme === "cozy" && active;

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
          className="absolute -top-px h-0.5 w-9 rounded-[var(--r-full)] bg-gold-foil"
          style={{ boxShadow: "0 0 12px 1px rgb(var(--c-accent) / 0.8)" }}
          transition={meta.motion.spring}
        />
      )}
      {active && theme === "apple" && (
        <motion.span
          layoutId="nav-active"
          className="absolute top-1 h-[32px] w-14 rounded-[var(--r-full)]"
          style={{
            background: "rgba(255,255,255,0.32)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
            backdropFilter: "blur(6px)",
          }}
          transition={meta.motion.spring}
        />
      )}
      {cozyActive && (
        <motion.span
          layoutId="nav-active"
          className="absolute top-0.5 h-[36px] w-[36px] rounded-[var(--r-full)]"
          style={{ background: cozyColor, boxShadow: `0 4px 0 0 ${cozyColor}55, inset 0 2px 0 rgba(255,255,255,0.45)` }}
          transition={meta.motion.bouncy}
        />
      )}
      {active && theme === "dreamy" && (
        <motion.span
          layoutId="nav-active"
          className="absolute top-1 h-[34px] w-[34px]"
          style={{ background: "rgb(var(--c-accent) / 0.16)", borderRadius: "26%", rotate: 8 }}
          transition={meta.motion.spring}
        />
      )}
      {active && theme === "studio" && (
        <motion.span layoutId="nav-active" className="absolute top-0.5 h-[36px] w-[38px]" transition={meta.motion.spring}>
          <span className="absolute inset-0 border-[1.5px] border-white/85" />
          {["-left-[3px] -top-[3px]", "-right-[3px] -top-[3px]", "-left-[3px] -bottom-[3px]", "-right-[3px] -bottom-[3px]"].map(
            (pos) => (
              <span key={pos} className={`absolute h-[6px] w-[6px] bg-white ${pos}`} />
            ),
          )}
        </motion.span>
      )}
      <motion.span animate={bounce} className="relative z-10">
        <Icon
          className="h-[22px] w-[22px]"
          style={
            theme === "game" && active
              ? { filter: "drop-shadow(0 0 6px rgb(var(--c-accent) / 0.9))" }
              : cozyActive
                ? { color: "#fff" }
                : undefined
          }
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
