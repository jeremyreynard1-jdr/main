import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Expansion Center — Legora",
  description:
    "Operating system for Legora's market expansion function: launches, coverage, competitive intel, signals, playbooks, and the 30-60-90.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg text-ink">
        <TopNav />
        <main className="pb-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
