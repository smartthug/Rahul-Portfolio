import type { Metadata, Viewport } from "next";
// Fonts are bundled from npm (@fontsource) instead of fetched from Google at
// build time, so builds never depend on the Google Fonts network response.
import "@fontsource/inter/latin-300.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-900.css";
import "@fontsource/lexend-mega/latin-800.css";
import "@fontsource/lexend-mega/latin-900.css";
import "@fontsource/staatliches/latin-400.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "@fontsource/jetbrains-mono/latin-700.css";
import "@fontsource/caveat/latin-600.css";
import "@fontsource/caveat/latin-700.css";
import "@fontsource/architects-daughter/latin-400.css";
import "@fontsource/vt323/latin-400.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/playfair-display/latin-800.css";
import "@fontsource/playfair-display/latin-600-italic.css";
import "@fontsource/playfair-display/latin-800-italic.css";
import { SITE } from "@/lib/site";
import "./globals.css";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
