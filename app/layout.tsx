import type { Metadata, Viewport } from "next";
import {
  Architects_Daughter,
  Caveat,
  Inter,
  JetBrains_Mono,
  Lexend_Mega,
  Playfair_Display,
  Staatliches,
  VT323,
} from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

// Above-the-fold fonts are preloaded; the rest load when their section renders.
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "700", "900"], variable: "--font-sans", display: "swap" });
const mega = Lexend_Mega({ subsets: ["latin"], weight: ["800", "900"], variable: "--font-mega", display: "swap" });
const staat = Staatliches({ subsets: ["latin"], weight: "400", variable: "--font-staat", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-hand", display: "swap", preload: false });
const sketch = Architects_Daughter({ subsets: ["latin"], weight: "400", variable: "--font-sketch", display: "swap", preload: false });
const pixel = VT323({ subsets: ["latin"], weight: "400", variable: "--font-pixel", display: "swap", preload: false });
const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "800"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.fullTitle,
  description: SITE.description,
  alternates: { canonical: "/" },
  authors: [{ name: SITE.name, url: SITE.url }],
  keywords: [
    "freelance web developer Chennai",
    "web developer Chennai",
    "business website developer",
    "landing page developer",
    "React developer",
    "Next.js developer",
    "website redesign",
  ],
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${SITE.name} — Web Developer`,
    title: SITE.fullTitle,
    description: SITE.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.fullTitle,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#18181b",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  jobTitle: SITE.role,
  url: SITE.url,
  email: `mailto:${SITE.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  sameAs: [SITE.github, SITE.linkedin],
  knowsAbout: ["React", "Next.js", "Tailwind CSS", "JavaScript", "TypeScript", "Web design", "AI integration"],
};

const fontVars = [inter, mega, staat, mono, caveat, sketch, pixel, serif].map((f) => f.variable).join(" ");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 border-2 border-black bg-sun px-4 py-3 font-mono text-sm font-bold uppercase text-black transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
