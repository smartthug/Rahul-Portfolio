"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TiltCard from "@/components/TiltCard";

type Project = {
  name: string;
  category: string;
  scope: string;
  year: string;
  stack: string[];
  image: string;
  href?: string;
  accent: string;
};

const PROJECTS: Project[] = [
  {
    name: "DocRAG",
    category: "AI · PDF Intelligence Engine",
    scope:
      "An AI-powered document intelligence engine. Upload any PDF and chat with it — strict context-only answers grounded in your own documents, with re-ranking and source attribution baked in.",
    year: "26",
    stack: ["Next.js", "Groq", "HuggingFace", "Pinecone", "LangChain"],
    image: "/projects/docrag.png",
    accent: "#9ef01a",
  },
  {
    name: "Job Trainer AI",
    category: "AI Coaching · Career",
    scope:
      "Turns freshers into job-ready candidates with AI-driven coaching — communication practice, a personalized roadmap, HR conversation simulations and progress tracking in one dashboard.",
    year: "26",
    stack: ["Next.js", "OpenAI", "MongoDB", "Auth"],
    image: "/projects/job-trainer-ai.png",
    accent: "#6b2a4a",
  },
  {
    name: "MoneyBuddy AI",
    category: "FinTech · Personal Finance",
    scope:
      "A needs-first personal-finance planner with live updates as you type and AI suggestions for savings, plus a calm spending limit on your wants. Money clarity, zero stress.",
    year: "25",
    stack: ["React", "Node", "Express", "AI"],
    image: "/projects/money-buddy-ai.png",
    accent: "#c46cff",
  },
  {
    name: "DietAI",
    category: "Health · Diet Planning",
    scope:
      "AI-powered diet and fitness plans tailored to the user — daily meal recommendations, nutrition tracking and a simple, clean dashboard to keep people consistent.",
    year: "25",
    stack: ["React", "Node", "MongoDB", "OpenAI"],
    image: "/projects/diet-ai.png",
    accent: "#ff3b30",
  },
  {
    name: "FitnessTrainerAI",
    category: "Health · AI Workouts",
    scope:
      "Personalized AI workout plans based on level, goals and schedule. < 30 second plan generation, home + gym options and a high-intent demo flow.",
    year: "25",
    stack: ["Next.js", "Three.js", "AI", "Tailwind"],
    image: "/projects/fitness-trainer-ai.png",
    accent: "#00d26a",
  },
  {
    name: "HabitCrack AI",
    category: "Productivity · Discipline Engine",
    scope:
      "An AI discipline engine that tracks habits, keeps you consistent and serves up AI-powered motivation — or honest reality checks — when streaks start slipping.",
    year: "25",
    stack: ["React", "Node", "Mongo", "Three.js"],
    image: "/projects/habit-crack-ai.png",
    accent: "#a78bfa",
  },
];

export default function Clients() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-tile]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 80, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            delay: i * 0.04,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 92%" },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="projects"
      className="relative w-full bg-cream-50 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1700px] px-6 md:px-10">
        <div className="mb-14 grid grid-cols-12 gap-6 border-t border-ink-950/15 pt-6">
          <div className="col-span-12 md:col-span-3">
            <span className="mono-eyebrow">/ 04 · Selected Projects</span>
          </div>
          <div className="col-span-12 md:col-span-7">
            <p className="display-tight text-2xl text-ink-950 md:text-3xl">
              Six real builds — from a PDF-grounded RAG engine to AI coaching,
              finance and fitness apps. Each one shipped end-to-end.
            </p>
          </div>
          <div className="col-span-12 md:col-span-2 md:text-right">
            <span className="mono-eyebrow text-ink-950/45">
              Hover any tile
            </span>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <li
              key={p.name}
              data-tile
              className="relative list-none"
              style={{ perspective: "1100px" }}
            >
              <TiltCard
              data-cursor="view"
              data-cursor-label="View"
              max={4.5}
              className="group relative isolate flex h-full flex-col overflow-hidden rounded-xl border border-ink-950/15 bg-cream-50 transition-colors hover:border-ink-950/40"
            >
              <div
                className="relative aspect-[2/1] w-full overflow-hidden bg-ink-950"
                style={{
                  backgroundImage: `radial-gradient(120% 110% at 50% 0%, ${p.accent}22, transparent 60%), linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 100%)`,
                  transform: "translateZ(40px)",
                }}
              >
                {/* Faint grid backdrop */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 32px)",
                  }}
                />

                <div className="absolute inset-3 sm:inset-4 md:inset-5">
                  <Image
                    src={p.image}
                    alt={`${p.name} screenshot`}
                    fill
                    sizes="(min-width: 1024px) 850px, 100vw"
                    className="object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                    style={{
                      filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.55))",
                    }}
                    priority={i < 2}
                  />
                </div>

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(70% 50% at 50% 80%, ${p.accent}33, transparent 70%)`,
                  }}
                />

                <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-cream-50/25 bg-ink-950/60 px-3 py-1 backdrop-blur-md">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: p.accent,
                      boxShadow: `0 0 10px ${p.accent}`,
                    }}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-50/90">
                    {p.category}
                  </span>
                </div>
                <span className="pointer-events-none absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.22em] text-cream-50/70">
                  ' {p.year}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-5 p-6 md:p-7">
                <div>
                  <div className="slide-pair display text-[12vw] leading-[0.9] md:text-[3.8vw]">
                    <span>{p.name.toLowerCase()}</span>
                    <span className="alt">{p.name.toLowerCase()}</span>
                  </div>
                  <p className="mt-4 max-w-[44ch] text-base text-ink-950/70">
                    {p.scope}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-ink-950/10 pt-4">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-ink-950/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-950/75 transition-colors group-hover:border-red group-hover:text-red"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              </TiltCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
