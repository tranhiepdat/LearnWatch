import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0B0A0F", 2: "#121017" },
        surface: { DEFAULT: "#17151F", 2: "#1F1B28", 3: "#272231" },
        hairline: "rgba(212,185,120,0.16)",
        gold: {
          50: "#F8EFD5",
          100: "#F0E1B6",
          300: "#E2C98A",
          400: "#D4B978",
          500: "#C6A35E",
          DEFAULT: "#C6A35E",
          600: "#A8843F",
          700: "#836528",
        },
        champagne: "#E8D8A8",
        ivory: "#F3ECDC",
        taupe: "#A39A8A",
        sage: "#6FA585",
        bordeaux: "#B45448",
        rolex: "#1E7A4D",
        omega: "#B23A3A",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.22em",
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(212,185,120,0.22), 0 10px 34px -12px rgba(0,0,0,0.7)",
        lux: "0 26px 70px -24px rgba(0,0,0,0.78)",
        glow: "0 0 24px -2px rgba(212,185,120,0.45)",
      },
      backgroundImage: {
        "gold-foil":
          "linear-gradient(135deg,#F0E1B6 0%,#C6A35E 38%,#9A7B2E 55%,#E2C98A 80%,#C6A35E 100%)",
        "gold-line": "linear-gradient(90deg,transparent,rgba(212,185,120,0.55),transparent)",
        "ink-radial": "radial-gradient(120% 80% at 50% -10%, #1B1726 0%, #0B0A0F 60%)",
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "200% 50%" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        "pulse-gold": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(212,185,120,0.0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(212,185,120,0.10)" },
        },
        pop: { "0%": { transform: "scale(0.6)", opacity: "0" }, "100%": { transform: "scale(1)", opacity: "1" } },
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        floaty: "floaty 5s ease-in-out infinite",
        "pulse-gold": "pulse-gold 2.4s ease-in-out infinite",
        pop: "pop 0.35s cubic-bezier(0.2,0.9,0.3,1.4)",
      },
    },
  },
  plugins: [],
};

export default config;
