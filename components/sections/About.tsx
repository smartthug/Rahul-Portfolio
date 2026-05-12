"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-line]").forEach((el) => {
        const inner = el.querySelector<HTMLElement>("[data-line-inner]");
        if (!inner) return;
        gsap.fromTo(
          inner,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
            },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="about"
      className="relative isolate w-full overflow-hidden bg-cream-50 py-28 md:py-44"
    >
      <div className="mx-auto grid max-w-[1700px] grid-cols-12 gap-6 px-6 md:px-10">
        <div className="col-span-12 mb-10 flex items-center justify-between">
          <span className="mono-eyebrow">/ 01 · About me</span>
          <span className="mono-eyebrow hidden md:inline">
            ※ Currently @ Jaxpat Technology
          </span>
        </div>

        <div className="col-span-12 md:col-span-3">
          <span className="mono-eyebrow text-ink-950/65">About</span>
          <p className="mt-3 max-w-[26ch] font-display text-2xl font-extrabold leading-[1.1] tracking-tighter2 text-ink-950 md:text-3xl">
            Full Stack · MERN · AI integration · genuinely curious.
          </p>
        </div>

        <div className="col-span-12 md:col-span-9">
          <div className="display text-[6.2vw] tracking-tightest sm:text-[5.4vw] md:text-[4.6vw]">
            {[
              "I'm a passionate Full Stack Developer",
              <>
                building modern, <em className="text-red">high-performance</em> web
              </>,
              "apps with the MERN stack, Next.js, Java",
              "and AI — auth systems, chat apps, RAG",
              "pipelines and the occasional Three.js scene.",
            ].map((line, i) => (
              <div
                key={i}
                data-line
                className="md:overflow-hidden"
                style={{ paddingBottom: "0.05em" }}
              >
                <span data-line-inner className="block md:inline-block">
                  {line}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
            {[
              { k: "Role", v: "Full Stack Developer" },
              { k: "Company", v: "Jaxpat Technology" },
              { k: "Focus", v: "MERN · Next · AI" },
              { k: "Open to", v: "Freelance · Contract" },
            ].map((m) => (
              <div key={m.k} className="border-t border-ink-950/15 pt-3">
                <span className="mono-eyebrow text-ink-950/45">{m.k}</span>
                <p className="mt-1 font-display text-base font-bold text-ink-950 md:text-lg">
                  {m.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
