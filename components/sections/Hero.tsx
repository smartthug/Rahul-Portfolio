"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrambleText from "@/components/ScrambleText";

const Scene3D = dynamic(() => import("@/components/three/Scene3D"), {
  ssr: false,
});

const ease = [0.7, 0, 0.2, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const planetY = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal-word]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 115, rotate: 5 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.4,
            ease: "expo.out",
            delay: parseFloat(el.dataset.delay || "0"),
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-cream-50 text-ink-950"
    >
      {/* 3D background */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{ opacity }}
      >
        <Scene3D />
      </motion.div>

      {/* Floating planet asset */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.8, ease, delay: 0.4 }}
        className="pointer-events-none absolute -right-[35vw] top-32 h-[80vw] w-[80vw] opacity-50 mix-blend-multiply sm:-right-[20vw] sm:opacity-70 md:right-8 md:top-28 md:h-[55vh] md:w-[55vh] md:opacity-100"
        style={{ y: planetY }}
      >
        <Image
          src="/planet-1-1.png"
          alt=""
          fill
          sizes="(min-width: 768px) 55vh, 80vw"
          className="animate-spinSlow object-contain"
          priority
        />
      </motion.div>

      {/* Top meta row */}
      <div className="absolute left-0 right-0 top-24 z-10 mx-auto flex max-w-[1700px] items-start justify-between px-4 sm:px-6 sm:top-28 md:px-10">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mono-eyebrow flex items-center gap-2 sm:gap-3"
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red shadow-[0_0_10px_rgba(235,89,57,0.8)]" />
          <span className="hidden sm:inline">Full Stack Developer · Freelancer</span>
          <span className="sm:hidden">Full Stack · Freelance</span>
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="hidden text-right md:block"
        >
          <p className="mono-eyebrow text-ink-950/55">
            Currently —{" "}
            <span className="text-ink-950">@ Jaxpat Technology</span>
          </p>
          <p className="mono-eyebrow mt-1 text-ink-950/35">
            MERN · Next.js · AI · Three.js
          </p>
        </motion.div>
      </div>

      {/* Big tagline */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1700px] flex-col justify-between px-4 pb-12 pt-36 sm:px-6 sm:pb-16 sm:pt-40 md:px-10 md:pb-20 md:pt-44">
        <div>
          <motion.div
            style={{ y }}
            className="display text-[17vw] tracking-tightest sm:text-[18vw] md:text-[12.5vw] lg:text-[11.5vw]"
          >
            <div className="overflow-hidden">
              <div
                data-reveal-word
                data-delay="0.18"
                className="inline-flex items-baseline gap-[0.2em]"
              >
                <span>hi,</span>
                <span>i'm</span>
              </div>
            </div>
            <div className="overflow-hidden">
              <div
                data-reveal-word
                data-delay="0.30"
                className="inline-flex flex-wrap items-baseline gap-x-[0.2em]"
              >
                <ScrambleText
                  text="rahul"
                  trigger="view"
                  delay={400}
                  duration={780}
                  tick={28}
                  className="inline-block"
                />
                <span className="inline-block h-[0.45em] w-[0.45em] translate-y-[-0.15em] rounded-full bg-red shadow-[0_0_30px_rgba(235,89,57,0.55)]" />
                <span className="text-stroke">a full</span>
              </div>
            </div>
            <div className="overflow-hidden">
              <div
                data-reveal-word
                data-delay="0.44"
                className="inline-flex flex-wrap items-baseline gap-x-[0.2em]"
              >
                <span>stack</span>
                <span className="text-red">developer.</span>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1, ease }}
            className="body-l mt-8 max-w-md text-ink-950/65 sm:mt-10 md:mt-12"
          >
            I build modern, high-performance web applications and digital
            solutions with the MERN stack, Next.js, and AI integration —
            shipping clean UI, scalable backends and the occasional Three.js
            scene along the way.
          </motion.p>
        </div>

        <div className="mt-10 flex flex-col gap-8 sm:mt-14 md:mt-0 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 1, ease }}
            className="flex flex-wrap items-center gap-4 sm:gap-5"
          >
            <a
              href="#projects"
              data-cursor="view"
              data-cursor-label="See projects"
              className="group relative inline-flex items-center gap-3 rounded-full bg-ink-950 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream-50 transition hover:bg-red sm:px-6"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-red shadow-[0_0_10px_rgba(235,89,57,0.9)] group-hover:bg-cream-50" />
              View Projects
              <ArrowDR />
            </a>
            <a
              href="#connect"
              data-cursor="hover"
              className="hover-line font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/70"
            >
              Hire me ↗
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55, duration: 0.8 }}
            className="flex items-end justify-between gap-6 sm:justify-start sm:gap-12"
          >
            <Stat n="20+" label="Projects" />
            <Stat n="MERN" label="Stack" />
            <Stat n="AI" label="Integrated" />
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="mono-eyebrow text-ink-950/45">Scroll</span>
          <span className="relative h-10 w-px overflow-hidden bg-ink-950/15">
            <span className="absolute left-0 top-0 h-3 w-px animate-[float_1.6s_ease-in-out_infinite] bg-red" />
          </span>
        </div>
      </motion.div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="display-tight text-3xl text-ink-950 md:text-4xl">
        {n}
      </span>
      <span className="mono-eyebrow mt-1 text-ink-950/50">{label}</span>
    </div>
  );
}

function ArrowDR() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="transition-transform duration-500 group-hover:rotate-[-45deg]"
    >
      <path
        d="M2 10 L10 2 M4 2 H10 V8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}
