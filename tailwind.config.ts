import type { Config } from "tailwindcss";

// Token "gold-*" được giữ TÊN nhưng mang GIÁ TRỊ XANH LÁ (brand emerald)
// để đổi màu toàn app mà không phải sửa từng class.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0A0F0C", 2: "#0E140F" },
        surface: { DEFAULT: "#111A14", 2: "#17241C", 3: "#1F2F26" },
        hairline: "rgba(52,211,153,0.18)",
        gold: {
          50: "#E7F8EF",
          100: "#C9F0DC",
          300: "#6FE0A6",
          400: "#34D399",
          500: "#12B886",
          DEFAULT: "#12B886",
          600: "#0E9C70",
          700: "#0B7A57",
        },
        champagne: "#C9E8D5",
        ivory: "#EAF2EC",
        taupe: "#8C988F",
        sage: "#5FBF8A",
        bordeaux: "#E0726A",
        rolex: "#1E7A4D",
        omega: "#B23A3A",
      },
      fontFamily: {
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.22em",
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(52,211,153,0.22), 0 10px 34px -12px rgba(0,0,0,0.7)",
        lux: "0 26px 70px -24px rgba(0,0,0,0.8)",
        glow: "0 0 24px -2px rgba(52,211,153,0.5)",
      },
      backgroundImage: {
        "gold-foil": "linear-gradient(135deg,#6FE0A6 0%,#34D399 38%,#0B7A57 60%,#12B886 100%)",
        "gold-line": "linear-gradient(90deg,transparent,rgba(52,211,153,0.55),transparent)",
        "ink-radial": "radial-gradient(120% 80% at 50% -10%, #123524 0%, #0A0F0C 60%)",
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
