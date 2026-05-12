import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
  // Next ships no metric override file for Nunito Sans, which logs a noisy
  // warning on every dev cold-start. The font still loads fine — we just
  // opt out of the metric-adjusted fallback.
  adjustFontFallback: false,
});

const display = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rahul — Full Stack Developer & Freelancer",
  description:
    "Full Stack Developer building modern, high-performance web apps with the MERN stack, Next.js, AI integration and interactive frontends.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Rahul — Full Stack Developer & Freelancer",
    description:
      "Full Stack Developer building modern, high-performance web apps with the MERN stack and AI.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f6f1e8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="font-sans bg-cream-50 text-ink-950 antialiased">
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
