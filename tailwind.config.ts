import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rolex: "#006039",
        omega: "#b8132e",
      },
    },
  },
  plugins: [],
};

export default config;
