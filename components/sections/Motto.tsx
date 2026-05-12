"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrambleText from "@/components/ScrambleText";

export default function Motto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-motto-line]",
        { yPercent: 110, rotate: 3 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        "[data-motto-meta]",
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          delay: 0.4,
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="motto"
      data-cursor-surface="dark"
      className="relative w-full bg-ink-950 py-32 text-cream-50 md:py-44"
    >
      <div className="mx-auto max-w-[1700px] px-6 md:px-10">
        <span className="mono-eyebrow text-cream-50/55">
          / 07 · How I work
        </span>

        <div className="mt-10 sm:mt-14 md:mt-20">
          <div className="display text-[20vw] tracking-tightest sm:text-[16vw] md:text-[10vw]">
            <div className="md:overflow-hidden">
              <div
                data-motto-line
                className="inline-flex flex-wrap items-baseline gap-x-[0.18em]"
              >
                <span>ship</span>
                <ScrambleText
                  text="clean,"
                  trigger="view"
                  delay={350}
                  duration={780}
                  tick={32}
                  className="inline-block"
                />
              </div>
            </div>
            <div className="md:overflow-hidden">
              <div
                data-motto-line
                className="inline-flex flex-wrap items-baseline gap-x-[0.18em]"
              >
                <span
                  className="text-stroke"
                  style={{ WebkitTextStroke: "1.5px #f6f1e8" }}
                >
                  ship
                </span>
                <ScrambleText
                  text="fast,"
                  trigger="view"
                  delay={650}
                  duration={780}
                  tick={32}
                  className="inline-block"
                />
              </div>
            </div>
            <div className="md:overflow-hidden">
              <div
                data-motto-line
                className="inline-flex flex-wrap items-baseline gap-x-[0.18em]"
              >
                <span>ship</span>
                <ScrambleText
                  text="honest."
                  trigger="view"
                  delay={950}
                  duration={900}
                  tick={32}
                  className="inline-block text-red"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          data-motto-meta
          className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-cream-50/15 pt-8 md:flex-row md:items-end"
        >
          <p className="max-w-md text-cream-50/75">
            I focus on clear communication, clean code and understanding
            what the client actually needs — not just what they asked for.
            Then I build it, ship it, and stay around to keep it running.
          </p>
          <p className="mono-eyebrow text-cream-50/55">
            — Rahul · Full Stack Developer
          </p>
        </div>
      </div>
    </section>
  );
}
