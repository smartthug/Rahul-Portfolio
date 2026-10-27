/**
 * Every fact here comes from the project's live site (title, description, page
 * text), the promo clip in /public/projects, or the previous version of this
 * portfolio. Do not add clients, metrics or results that can't be verified.
 * Source-code links are intentionally not shown.
 */

export type Accent = "violet" | "rose" | "sky" | "sun" | "mint" | "coral";

export type Project = {
  slug: string;
  /** Short title for the hanging card */
  title: string;
  /** Corner sticker */
  tag: string;
  summary: string;
  highlights: string[];
  stack: string[];
  image: string;
  imageAlt: string;
  /** Short demo clip, played in a media-player window */
  video?: string;
  /** Playback speed for the clip (default 1) */
  videoSpeed?: number;
  /** Live site */
  demo?: string;
  accent: Accent;
};

export const PROJECTS: Project[] = [
  {
    slug: "jg-antony",
    title: "JG Antony",
    tag: "Business site",
    summary:
      "Official website of financial educator Dr. Jaya George Antony: courses, workshops and books, plus free SIP and EMI calculators and a goal planner.",
    highlights: ["Academy, workshops & books", "SIP / EMI calculators + goal planner", "Light & dark theme"],
    stack: ["Next.js", "Tailwind"],
    image: "/projects/jg-antony.jpg",
    imageAlt: "JG Antony website hero: 'Build wealth. Create freedom. Leave a legacy.' beside a portrait of the founder.",
    video: "/projects/George_Portflio_clip.mp4",
    demo: "https://jgantony.com/",
    accent: "sun",
  },
  {
    slug: "babybite",
    title: "BabyBite",
    tag: "Web app",
    summary:
      "Meal planner for mothers of kids aged 4–12. A six-step, two-minute form creates thirty days of Indian breakfast, snacks, lunch and dinner for the child's age and kitchen.",
    highlights: ["Six-step plan builder", "English, Tamil & Hindi", "30-day Indian meal plans"],
    stack: ["Next.js"],
    image: "/projects/babybite.jpg",
    imageAlt: "BabyBite plan builder on a phone: step 1 of 6, 'Your child next to other kids'.",
    video: "/projects/BabyBite_Clip.mp4",
    demo: "https://baby-bite.vercel.app/",
    accent: "rose",
  },
  {
    slug: "stamina-booster",
    title: "Stamina Booster",
    tag: "Wellness app",
    summary:
      "Personalised stamina and wellness plan delivered as a PDF, with exercise photos, nutrition visuals and honest 4–8 week timelines. Takes about four minutes; no account needed to start.",
    highlights: ["Personalised PDF plan", "Movement, food, sleep & stress", "No account to start"],
    stack: ["Next.js", "Tailwind"],
    image: "/projects/stamina-booster.jpg",
    imageAlt: "Stamina Booster landing page: 'Boost your stamina' with a weekly plan note and a photo of a woman jogging.",
    video: "/projects/Stamina_Booster_clip.mp4",
    demo: "https://stamina-bosster.vercel.app/",
    accent: "mint",
  },
  {
    slug: "prompt-kit",
    title: "Prompt Kit",
    tag: "Learning site",
    summary:
      "A 15-day course that takes you from vague prompts to briefs that work. Learn the AIM method, then use it for writing, images, video and coding. Days 1–2 are free.",
    highlights: ["Plan built around your goal", "Days 1–2 free", "About 20 minutes a day"],
    stack: ["Next.js", "Tailwind"],
    image: "/projects/prompt-kit.jpg",
    imageAlt: "Prompt Kit plan screen: '15 days. Built for you.' with a grid of daily lessons.",
    video: "/projects/Prompt_Kit_Clip.mp4",
    demo: "https://prompt-kit-psi.vercel.app/",
    accent: "violet",
  },
  {
    slug: "trade-analysis",
    title: "TradeAnalysis",
    tag: "Dashboard",
    summary:
      "Stock technical-analysis dashboard for NSE, BSE and index research. It is for authorised users only, so the live link opens the sign-in screen.",
    highlights: ["Sign-in protected", "NSE · BSE · index coverage", "Dark, data-dense UI"],
    stack: ["Next.js"],
    image: "/projects/trade-analysis.jpg",
    imageAlt: "TradeAnalysis sign-in screen: 'Stock Technical Analysis' on a dark background with a yellow Continue button.",
    demo: "https://trade-analysis-zl52.vercel.app/",
    accent: "sun",
  },
  {
    slug: "docrag",
    title: "DocRAG",
    tag: "AI app",
    summary:
      "Upload PDFs and ask questions across everything indexed. Answers come only from your documents, re-ranked, with sources shown for every reply.",
    highlights: ["PDF ingestion + embeddings", "Re-ranking & source attribution", "Context-only answers"],
    stack: ["Next.js", "LangChain", "Pinecone", "Groq"],
    image: "/projects/docrag.jpg",
    imageAlt: "DocRAG interface with an uploaded PDF and a chat answer with sources.",
    video: "/docrag.mp4",
    videoSpeed: 1.5,
    demo: "https://rag-pdf-llm.vercel.app/",
    accent: "sky",
  },
  {
    slug: "fitai-trainer",
    title: "FitAI Trainer",
    tag: "AI + landing",
    summary:
      "AI fitness product with a conversion-focused landing page: answer a few questions, get a personalised home or gym workout plan.",
    highlights: ["Multi-step form + BMI logic", "AI plan with PDF download", "Pricing / unlock flow UI"],
    stack: ["Next.js", "Groq", "Framer Motion", "pdf-lib"],
    image: "/projects/fitness-trainer-ai.png",
    imageAlt: "FitAI Trainer landing page with the headline 'Transform Your Body with AI' over a 3D dumbbell.",
    demo: "https://fitness-trainer-ai-rust.vercel.app",
    accent: "coral",
  },
];

export const ACCENT_BG: Record<Accent, string> = {
  violet: "bg-violet",
  rose: "bg-rose",
  sky: "bg-sky",
  sun: "bg-sun",
  mint: "bg-mint",
  coral: "bg-coral",
};
