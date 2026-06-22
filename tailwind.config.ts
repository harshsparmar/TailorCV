import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans:  ["var(--font-sans)",  "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia",   "serif"],
      },
      colors: {
        primary: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
      },
      boxShadow: {
        "warm":    "0 1px 3px rgba(28,25,23,0.08), 0 1px 2px rgba(28,25,23,0.05)",
        "warm-md": "0 4px 12px rgba(28,25,23,0.08), 0 2px 4px rgba(28,25,23,0.04)",
        "warm-lg": "0 8px 24px rgba(28,25,23,0.10), 0 3px 8px rgba(28,25,23,0.06)",
      },
      animation: {
        "fade-in":  "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" },   "100%": { opacity: "1" } },
        slideUp: { "0%": { transform: "translateY(12px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
      },
    },
  },
  plugins: [],
};

export default config;
