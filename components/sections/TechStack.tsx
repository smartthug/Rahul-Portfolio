"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type StackGroup = {
  n: string;
  title: string;
  items: { name: string; level: string }[];
};

const STACK: StackGroup[] = [
  {
    n: "01",
    title: "Frontend",
    items: [
      { name: "React.js", level: "Daily" },
      { name: "Next.js", level: "Daily" },
      { name: "TypeScript", level: "Strong" },
      { name: "Tailwind CSS", level: "Daily" },
      { name: "Three.js / R3F", level: "Comfortable" },
      { name: "GSAP", level: "Comfortable" },
    ],
  },
  {
    n: "02",
    title: "Backend",
    items: [
      { name: "Node.js", level: "Daily" },
      { name: "Express.js", level: "Daily" },
      { name: "Java", level: "Strong" },
      { name: "REST APIs", level: "Daily" },
      { name: "Socket.io", level: "Comfortable" },
      { name: "JWT / Auth", level: "Strong" },
    ],
  },
  {
    n: "03",
    title: "Database",
    items: [
      { name: "MongoDB", level: "Daily" },
      { name: "MySQL", level: "Strong" },
      { name: "Mongoose", level: "Strong" },
      { name: "Indexing", level: "Comfortable" },
      { name: "Schema Design", level: "Strong" },
    ],
  },
  {
    n: "04",
    title: "AI & Tools",
    items: [
      { name: "Prompt Engineering", level: "Strong" },
      { name: "RAG Systems", level: "Comfortable" },
      { name: "OpenAI APIs", level: "Strong" },
      { name: "Git / GitHub", level: "Daily" },
      { name: "Vercel / Render", level: "Daily" },
      { name: "Postman", level: "Daily" },
    ],
  },
];

export default function TechStack() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-stack]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 50, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            delay: i * 0.06,
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
      id="stack"
      className="relative w-full bg-cream-50 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1700px] px-6 md:px-10">
        <div className="mb-14 grid grid-cols-12 gap-6 border-t border-ink-950/15 pt-6">
          <div className="col-span-12 md:col-span-3">
            <span className="mono-eyebrow">/ 05 · Tech stack</span>
          </div>
          <div className="col-span-12 md:col-span-7">
            <p className="display-tight text-2xl text-ink-950 md:text-3xl">
              The tools I reach for to ship clean UI, scalable backends and
              AI features that actually make it to production.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STACK.map((group) => (
            <li
              key={group.title}
              data-stack
              className="group flex flex-col rounded-lg border border-ink-950/15 bg-cream-50 p-6 transition-colors hover:bg-ink-950 hover:text-cream-50 md:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="mono-eyebrow opacity-65">{group.n}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-45 transition-colors group-hover:text-red">
                  {group.items.length} items
                </span>
              </div>

              <h3 className="display mt-6 text-[12vw] leading-[0.9] md:text-[3.2vw]">
                {group.title.toLowerCase()}
              </h3>

              <ul className="mt-6 space-y-2 border-t border-current/10 pt-4">
                {group.items.map((it) => (
                  <li
                    key={it.name}
                    className="flex items-center justify-between"
                  >
                    <span className="font-display text-base font-semibold">
                      {it.name}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-55">
                      {it.level}
                    </span>
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
