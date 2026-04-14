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
        // Light-mode palette matching Legora brand: cream + sage + forest
        bg: "#FAFAF7",
        "bg-alt": "#F1EEE6",
        surface: "#FFFFFF",
        "surface-2": "#F6F3EB",
        border: "#E4E0D6",
        "border-strong": "#C9C3B4",
        ink: "#0B0F0C",
        "ink-muted": "#5A6359",
        "ink-subtle": "#8F988E",
        nav: "#FFFFFF",
        // `gold` retained as the accent token name to avoid renaming
        // across 26 files; values are now Legora forest/sage green.
        gold: "#1F3D2E", // forest (accent, logo star)
        "gold-deep": "#0F2B1F",
        "gold-soft": "#E4EDDB", // light sage tint for soft fills
        sage: "#C5D4B9", // signature sage green
        "sage-soft": "#E4EDDB",
        "sage-deep": "#8BA585",
        rag: {
          green: "#4A7C59",
          "green-soft": "#E4EDDB",
          amber: "#B88720",
          "amber-soft": "#F5EAD2",
          red: "#A8453F",
          "red-soft": "#F4DEDC",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"],
        serif: [
          "var(--font-serif)",
          "Instrument Serif",
          "ui-serif",
          "Georgia",
          "serif",
        ],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,43,31,0.04), 0 1px 3px rgba(15,43,31,0.06)",
        card: "0 1px 2px rgba(15,43,31,0.04)",
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
