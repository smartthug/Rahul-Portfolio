"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Row = {
  year: string;
  role: string;
  org: string;
  note: string;
};

const ROWS: Row[] = [
  {
    year: "NOW",
    role: "Full Stack Developer",
    org: "Jaxpat Technology",
    note: "MERN · Next.js · AI features",
  },
  {
    year: "NOW",
    role: "Freelance Developer",
    org: "Independent · Remote",
    note: "Business sites · MVPs · Custom apps",
  },
  {
    year: "2026",
    role: "Built DocRAG · AI Engine",
    org: "Personal · Open project",
    note: "Groq · Pinecone · LangChain",
  },
  {
    year: "2025",
    role: "Shipped 5 AI products",
    org: "Job Trainer · MoneyBuddy · DietAI · Fitness · HabitCrack",
    note: "Solo design + build",
  },
  {
    year: "Start",
    role: "Self-taught Developer",
    org: "MERN · Java · 3D for the web",
    note: "Built, broke, rebuilt — repeat.",
  },
];

export default function Experience() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-row]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 50, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            delay: i * 0.05,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="experience"
      className="relative w-full bg-cream-50 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1700px] px-6 md:px-10">
        <div className="mb-12 grid grid-cols-12 gap-6 border-t border-ink-950/15 pt-6">
          <div className="col-span-12 md:col-span-3">
            <span className="mono-eyebrow">/ 03 · Experience</span>
          </div>
          <div className="col-span-12 md:col-span-6">
            <p className="display-tight text-2xl text-ink-950 md:text-3xl">
              Building production web apps by day, exploring AI and 3D for
              the web by night — and freelancing on top of both.
            </p>
          </div>
          <div className="col-span-12 md:col-span-3 md:text-right">
            <a
              href="#"
              data-cursor="hover"
              className="hover-line font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/65"
            >
              Download Resume ↗
            </a>
          </div>
        </div>

        <ol className="flex flex-col">
          {ROWS.map((r, i) => (
            <li
              key={r.year + r.role}
              data-row
              className="group grid grid-cols-12 items-start gap-x-3 gap-y-1 border-b border-ink-950/15 py-6 sm:gap-x-4 sm:py-7 md:items-center md:py-9"
              style={{ borderTop: i === 0 ? "1px solid rgba(13,13,13,0.15)" : undefined }}
            >
              <span className="col-span-4 display-tight text-xl text-red sm:col-span-3 sm:text-2xl md:col-span-2 md:text-3xl">
                {r.year}
              </span>
              <span className="col-span-8 display-tight text-xl text-ink-950 transition-colors group-hover:text-red sm:col-span-9 sm:text-2xl md:col-span-4 md:text-4xl">
                {r.role}
              </span>
              <span className="col-span-12 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-950/70 sm:col-span-7 sm:col-start-4 sm:text-[12px] md:col-span-4 md:col-start-auto">
                {r.org}
              </span>
              <span className="col-span-12 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-950/45 sm:col-span-5 sm:col-start-4 sm:text-[11px] md:col-span-2 md:col-start-auto md:text-right">
                {r.note}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
