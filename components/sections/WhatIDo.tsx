"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrambleText from "@/components/ScrambleText";

type Capability = {
  n: string;
  title: string;
  primary: string;
  alt: string;
  tools: string[];
};

const CAPS: Capability[] = [
  {
    n: "01",
    title: "Frontend",
    primary:
      "Pixel-perfect, fully responsive interfaces built with React and Next.js — fast, accessible, and animated where it matters.",
    alt: "Component libraries, design-system-driven UI, smooth scroll experiences and the occasional Three.js / WebGL touch.",
    tools: ["React", "Next.js", "Tailwind"],
  },
  {
    n: "02",
    title: "Backend",
    primary:
      "Scalable, secure APIs and auth systems with Node, Express and Java — designed to keep working long after launch day.",
    alt: "REST & real-time architectures, role-based auth, sockets, queues, and the database design behind the scenes.",
    tools: ["Node.js", "Express", "Java"],
  },
  {
    n: "03",
    title: "Database",
    primary:
      "MongoDB or MySQL — schemas modeled around how the app actually grows, with the indexes and queries to back them up.",
    alt: "From quick-start collections to relational normalization, migrations and the inevitable refactor at scale.",
    tools: ["MongoDB", "MySQL", "Mongoose"],
  },
  {
    n: "04",
    title: "AI",
    primary:
      "AI features that ship — chat, RAG search, content pipelines and prompt engineering wired into the products you already have.",
    alt: "OpenAI / open-source models, vector stores, embeddings, streaming responses and the guardrails to keep them safe.",
    tools: ["RAG", "Prompts", "Vector DB"],
  },
  {
    n: "05",
    title: "Freelance",
    primary:
      "End-to-end builds for businesses, founders and creators — from discovery and design to deploy, on a clear timeline.",
    alt: "I work as an embedded engineer or a solo shop, talk to clients directly, and keep things moving without ceremony.",
    tools: ["MVP", "Websites", "Apps"],
  },
];

export default function WhatIDo() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-cap]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 60, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
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
      id="services"
      className="relative w-full bg-cream-50 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1700px] px-6 md:px-10">
        <div className="mb-12 flex items-end justify-between border-t border-ink-950/15 pt-6">
          <span className="mono-eyebrow">/ 02 · What we do</span>
          <span className="mono-eyebrow text-ink-950/45 hidden md:inline">
            Hover any tile
          </span>
        </div>

        <ul className="flex flex-col">
          {CAPS.map((c, i) => (
            <li
              key={c.title}
              data-cap
              data-cursor="hover"
              className="group relative grid grid-cols-12 items-start gap-x-4 gap-y-4 border-b border-ink-950/15 py-8 transition-colors hover:bg-cream-100 sm:gap-x-6 md:py-14"
              style={{ borderTop: i === 0 ? "1px solid rgba(13,13,13,0.15)" : undefined }}
            >
              <span className="col-span-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/40 sm:col-span-2 md:col-span-1">
                {c.n}
              </span>

              <div className="col-span-10 md:col-span-3">
                <div className="display text-[15vw] leading-[0.88] sm:text-[12vw] md:text-[7vw]">
                  <ScrambleText
                    text={c.title.toLowerCase()}
                    trigger="hover"
                    duration={600}
                    tick={28}
                    className="inline-block transition-colors duration-500 group-hover:text-red"
                  />
                </div>
              </div>

              <p className="col-span-12 max-w-[44ch] text-[15px] leading-snug text-ink-950/75 sm:text-base md:col-span-5 md:col-start-6 md:text-lg">
                <span className="relative block transition-opacity duration-500 md:group-hover:opacity-0">
                  {c.primary}
                </span>
                <span className="pointer-events-none absolute inset-0 hidden opacity-0 transition-opacity duration-500 md:block md:group-hover:opacity-100">
                  {c.alt}
                </span>
              </p>

              <ul className="col-span-12 flex flex-wrap gap-2 md:col-span-3 md:col-start-11 md:justify-end">
                {c.tools.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-ink-950/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-950/75 transition-colors group-hover:border-red group-hover:text-red"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
