"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
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
 * Tab bar — chỉ báo active KHÔNG TRƯỢT NGANG (hết tiền đình): mỗi tab tự
 * pop chỉ báo TẠI CHỖ khi thành active, tab cũ fade đi.
 *  · cozy — bong bóng caramel POP nở ra (bubbly poppy)
 *  · game — ô vuông outline tự vẽ + morph bo góc (shape morph)
 *  · lux  — vạch champagne nở từ tâm + chấm kim cương
 */
function Tab({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
  active: boolean;
}) {
  const { theme, meta } = useTheme();
  const bounce = useAnimationControls();
  const press = useAnimationControls();
  const cozyActive = theme === "cozy" && active;

  function onTap() {
    playTap();
    hTap();
    // NẢY cả nút (icon + label) — squash & stretch theo theme
    bounce.start(
      theme === "cozy"
        ? { scaleX: [1, 1.18, 0.9, 1.03, 1], scaleY: [1, 0.82, 1.12, 0.97, 1], transition: { duration: 0.42, ease: "easeOut" } }
        : theme === "game"
          ? { scale: [1, 0.88, 1.06, 1], transition: { duration: 0.2, ease: "easeOut" } }
          : { scale: [1, 0.95, 1.02, 1], transition: { duration: 0.34, ease: "easeOut" } },
    );
    // highlight bao CẢ icon + text, bo góc theo theme (cozy tròn, digital vuông)
    press.set({ opacity: theme === "game" ? 0.85 : 0.92, scale: 0.86 });
    press.start({ opacity: 0, scale: 1, transition: { duration: 0.42, ease: "easeOut" } });
  }

  return (
    <Link
      href={href}
      onClick={onTap}
      data-no-pop
      data-no-ripple
      className={`cyber relative flex flex-1 flex-col items-center gap-1 py-2.5 ${
        active ? "text-gold-300" : "text-taupe"
      }`}
    >
      {/* PRESS HIGHLIGHT — phủ cả icon + label, shape theo theme */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={press}
        className="pointer-events-none absolute inset-x-1 inset-y-0.5 z-0 rounded-[var(--r-md)]"
        style={{ background: "rgb(var(--c-accent))", mixBlendMode: theme === "game" ? "screen" : "normal" }}
      />
      <AnimatePresence>
        {cozyActive && (
          <motion.span
            key="cozy-ind"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.12 } }}
            transition={meta.motion.bouncy}
            className="absolute top-0.5 h-[34px] w-[46px] rounded-[var(--r-full)]"
            style={{ background: "var(--grad-primary)", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.45), var(--sh-glow)" }}
          />
        )}
        {active && theme === "game" && (
          <motion.span
            key="game-ind"
            initial={{ opacity: 0, scale: 0.6, borderRadius: 12 }}
            animate={{ opacity: 1, scale: 1, borderRadius: 2 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.22, ease: [0.65, 0, 0.35, 1] }}
            className="absolute top-0.5 h-[34px] w-[38px] border border-gold-400/80"
          >
            <span className="absolute -left-px -top-px h-[5px] w-[5px] border-l border-t border-gold-300" />
            <span className="absolute -right-px -top-px h-[5px] w-[5px] border-r border-t border-gold-300" />
            <span className="absolute -bottom-px -left-px h-[5px] w-[5px] border-b border-l border-gold-300" />
            <span className="absolute -bottom-px -right-px h-[5px] w-[5px] border-b border-r border-gold-300" />
          </motion.span>
        )}
        {active && theme === "lux" && (
          <motion.span key="lux-ind" className="absolute inset-x-3 top-0" initial="off" animate="on" exit="off">
            <motion.span
              variants={{ off: { scaleX: 0, opacity: 0 }, on: { scaleX: 1, opacity: 1 } }}
              transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
              className="block h-px bg-gold-foil"
            />
            <motion.span
              variants={{ off: { scale: 0, opacity: 0 }, on: { scale: 1, opacity: 1 } }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="absolute left-1/2 top-[-2.5px] h-[6px] w-[6px] -translate-x-1/2 rotate-45 bg-gold-400"
            />
          </motion.span>
        )}
      </AnimatePresence>

      <motion.span animate={bounce} className="relative z-10">
        <Icon
          className="h-[22px] w-[22px]"
          style={
            cozyActive
              ? { color: "rgb(var(--c-on-accent))" }
              : active && theme === "game"
                ? { filter: "drop-shadow(0 0 5px rgb(var(--c-accent) / 0.7))" }
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
        <div className="flex items-center justify-around rounded-[var(--r-lg)] border border-hairline bg-surface/90 shadow-lux backdrop-blur-xl">
          {tabs.map(({ href, label, Icon }) => (
            <Tab
              key={href}
              href={href}
              label={label}
              Icon={Icon}
              active={href === "/" ? path === "/" : path.startsWith(href)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
