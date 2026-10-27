/** Single source of truth for identity, contact details and links. */
export const SITE = {
  name: "Rahul",
  fullTitle: "Rahul — Freelance Web Developer in Chennai",
  role: "Freelance Web Developer",
  description:
    "Freelance web developer in Chennai building fast, responsive business websites, landing pages and React / Next.js web apps — including AI-powered features.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://rahul-portfolio-liard.vercel.app").replace(/\/$/, ""),
  email: "rahuldeva5555@gmail.com",
  location: "Chennai, India",
  timezone: "IST (UTC+5:30)",
  github: "https://github.com/smartthug",
  githubHandle: "@smartthug",
  linkedin: "https://www.linkedin.com/in/rahuldeva5/",
  linkedinHandle: "/in/rahuldeva5",
} as const;
