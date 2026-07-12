import type { Config } from "tailwindcss";

// ===== TOKEN → CSS VARIABLE =====
// Mọi màu đọc từ biến CSS theo [data-theme] (globals.css) nên đổi theme là
// đổi TOÀN BỘ app. Tên token giữ nguyên (gold-*, ivory, taupe…) để không phải
// sửa hàng trăm class — chỉ Ý NGHĨA đổi: gold = accent chính của theme.
const v = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: v("--c-bg"), 2: v("--c-bg2") },
        surface: { DEFAULT: v("--c-surface"), 2: v("--c-surface2"), 3: v("--c-surface3") },
        hairline: "var(--c-hairline)",
        gold: {
          50: v("--c-accent-50"),
          100: v("--c-accent-100"),
          300: v("--c-accent-hi"),
          400: v("--c-accent"),
          500: v("--c-accent-lo"),
          DEFAULT: v("--c-accent-lo"),
          600: v("--c-accent-600"),
          700: v("--c-accent-700"),
        },
        champagne: v("--c-soft"),
        ivory: v("--c-fg"),
        taupe: v("--c-muted"),
        sage: v("--c-second"),
        bordeaux: v("--c-danger"),
        onaccent: v("--c-on-accent"),
        rolex: "#1E7A4D",
        omega: "#B23A3A",
      },
      fontFamily: {
        display: ["var(--font-display-active)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        tech: ["var(--font-tech-active)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        luxe: "var(--track-luxe)",
      },
      boxShadow: {
        gold: "var(--sh-ring)",
        lux: "var(--sh-lux)",
        glow: "var(--sh-glow)",
      },
      backgroundImage: {
        "gold-foil": "var(--grad-primary)",
        "gold-line": "var(--grad-line)",
        "ink-radial": "var(--bg-wash)",
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "200% 50%" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        pop: { "0%": { transform: "scale(0.6)", opacity: "0" }, "100%": { transform: "scale(1)", opacity: "1" } },
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        floaty: "floaty 5s ease-in-out infinite",
        pop: "pop 0.35s cubic-bezier(0.2,0.9,0.3,1.4)",
      },
    },
  },
  plugins: [],
};

export default config;
