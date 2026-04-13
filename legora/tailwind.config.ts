import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark-mode palette, Legora-adjacent (navy + muted gold)
        bg: "#0B1220",
        "bg-alt": "#0D1528",
        surface: "#111A2E",
        "surface-2": "#15203A",
        border: "#1E2A44",
        "border-strong": "#2A3958",
        ink: "#E6EAF2",
        "ink-muted": "#9AA4B8",
        "ink-subtle": "#6B7591",
        nav: "#060B17",
        gold: "#D4AF7A",
        "gold-deep": "#B88F55",
        "gold-soft": "#3A2E1E",
        rag: {
          green: "#3EB489",
          "green-soft": "#143A30",
          amber: "#E3B341",
          "amber-soft": "#3B2F14",
          red: "#E5534B",
          "red-soft": "#3A1A18",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.3), 0 2px 12px rgba(0,0,0,0.25)",
        card: "0 1px 3px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
