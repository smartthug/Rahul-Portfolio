import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#f6f1e8",
          100: "#efe7d6",
          200: "#e6dcc6",
        },
        ink: {
          950: "#0d0d0d",
          900: "#1a1a1a",
          800: "#2a2a2a",
          700: "#4d4d4d",
        },
        primary: {
          DEFAULT: "#b7ab98",
          50: "#ece7dd",
          100: "#d8cfbe",
        },
        red: {
          DEFAULT: "#eb5939",
          dark: "#c5462b",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.055em",
        tighter2: "-0.035em",
      },
      keyframes: {
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        ticker: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
      },
      animation: {
        spinSlow: "spinSlow 22s linear infinite",
        marquee: "marquee 35s linear infinite",
        float: "float 6s ease-in-out infinite",
        ticker: "ticker 8s steps(8) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
