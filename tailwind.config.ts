import type { Config } from "tailwindcss";

/**
 * Multi-style design system (direction: creativeed.dev). Each section has its
 * own palette — minimalism, neobrutalism, constructivism, Swiss, retro OS and
 * sketch paper — tied together by thick black seams and hard shadows.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // shared
        paper: { DEFAULT: "#f5f1e8", dim: "#ebe5d6", sketch: "#fbf7f0" },
        ink: { DEFAULT: "#111111", soft: "#3d3d3d", mute: "#5c5c5c" },
        night: "#1c1c1f",
        sun: "#ffde4a",
        coral: "#ff8a6b",
        // hero panels
        beige: "#e8e2d6",
        brick: "#9b1c1c",
        teal: "#4fd1c5",
        crimson: "#e11d48",
        // about
        blood: "#d42222",
        // projects
        grape: { DEFAULT: "#a855f7", deep: "#6d28d9", ink: "#2e1065" },
        violet: "#c4a5ff",
        rose: "#ff8fab",
        sky: "#8ee8f5",
        mint: "#9fe3c3",
        // retro OS
        sage: "#d3e9df",
        wood: { DEFAULT: "#c38e57", dark: "#8a5a2b", light: "#e7c49a" },
        forest: { DEFAULT: "#2f6b55", dark: "#16382d" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mega: ["var(--font-mega)", "ui-sans-serif", "system-ui"],
        staat: ["var(--font-staat)", "Impact", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        hand: ["var(--font-hand)", "cursive"],
        sketch: ["var(--font-sketch)", "cursive"],
        pixel: ["var(--font-pixel)", "ui-monospace", "monospace"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        swiss: ["'Helvetica Neue'", "Helvetica", "Arial", "sans-serif"],
        // legacy alias used by error / 404 pages
        display: ["var(--font-mega)", "ui-sans-serif", "system-ui"],
      },
      borderWidth: { 3: "3px", 6: "6px" },
      boxShadow: {
        brut: "4px 4px 0 0 #111111",
        "brut-sm": "2px 2px 0 0 #111111",
        "brut-lg": "8px 8px 0 0 #111111",
        win: "3px 3px 0 0 rgba(60, 35, 10, 0.45)",
      },
      keyframes: {
        sway: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        panelIn: {
          from: { opacity: "0", transform: "scale(1.04)" },
          to: { opacity: "1", transform: "none" },
        },
        blink: { "50%": { opacity: "0" } },
      },
      animation: {
        sway: "sway 3.2s ease-in-out infinite",
        panelIn: "panelIn 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        blink: "blink 1s steps(1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
