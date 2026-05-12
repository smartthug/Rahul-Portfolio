"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/MagneticButton";
import ScrambleText from "@/components/ScrambleText";
import ContactDialog from "@/components/ContactDialog";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [year, setYear] = useState("2026");
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-foot-line]",
        { yPercent: 110, rotate: 4 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top 70%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={ref}
      id="connect"
      className="relative isolate w-full overflow-hidden bg-cream-50 pb-10 pt-28 text-ink-950 md:pt-40"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 opacity-60"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,13,13,0) 0%, rgba(13,13,13,0) 100%)",
        }}
      />

      <div className="mx-auto max-w-[1700px] px-4 sm:px-6 md:px-10">
        <div className="flex items-center justify-between border-t border-ink-950/15 pt-6">
          <span className="mono-eyebrow">/ 08 · Connect</span>
          <span className="mono-eyebrow text-ink-950/45">
            Replies within ~ 24h
          </span>
        </div>

        <h2 className="display mt-10 text-[22vw] tracking-tightest sm:mt-14 sm:text-[20vw] md:text-[14vw]">
          <span className="block overflow-hidden">
            <span data-foot-line className="inline-block">
              let's
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              data-foot-line
              className="inline-flex flex-wrap items-baseline gap-x-[0.2em]"
            >
              <ScrambleText
                text="build"
                trigger="view"
                delay={350}
                duration={780}
                tick={32}
                className="inline-block text-stroke"
              />
              <ScrambleText
                text="something"
                trigger="view"
                delay={680}
                duration={900}
                tick={32}
                className="inline-block"
              />
              <span className="text-red">.</span>
            </span>
          </span>
        </h2>

        <div className="mt-14 grid grid-cols-12 gap-6 md:mt-20">
          <div className="col-span-12 flex flex-col gap-6 md:col-span-7">
            <MagneticButton
              onClick={() => setContactOpen(true)}
              ariaLabel="Open contact form"
            >
              <ScrambleText
                text="send a message"
                trigger="hover"
                duration={620}
                tick={28}
                className="inline-block"
              />
              <span className="text-ink-950/30 group-hover:text-cream-50">
                ↗
              </span>
            </MagneticButton>
            <a
              href="mailto:rahuldeva5555@gmail.com"
              data-cursor="hover"
              className="hover-line w-fit font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/55"
            >
              or email rahuldeva5555@gmail.com ↗
            </a>

            <div className="grid grid-cols-2 gap-4 md:max-w-md">
              <SocialLink
                label="GitHub"
                handle="@smartthug"
                href="https://github.com/smartthug"
              />
              <SocialLink
                label="LinkedIn"
                handle="/in/rahuldeva5"
                href="https://www.linkedin.com/in/rahuldeva5/"
              />
              <SocialLink
                label="Email"
                handle="rahuldeva5555"
                href="mailto:rahuldeva5555@gmail.com"
              />
              <SocialLink
                label="Resume"
                handle="Download ↗"
                href="#"
              />
            </div>
          </div>

          <div className="col-span-12 grid grid-cols-2 gap-y-8 md:col-span-5">
            <Detail
              title="Currently"
              lines={["Full Stack Dev", "@ Jaxpat Technology"]}
            />
            <Detail
              title="Available"
              lines={["Freelance · Contract", "Remote · Hybrid"]}
            />
            <Detail
              title="Stack"
              lines={["MERN · Next.js · Java", "AI · Three.js"]}
            />
            <Detail
              title="Based in"
              lines={["India · IST (UTC+5:30)"]}
            />
          </div>
        </div>

        <div className="relative mt-20 overflow-hidden border-y border-ink-950/15 py-6">
          <motion.div
            className="flex w-max items-center gap-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 26, ease: "linear", repeat: Infinity }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="display text-[6vw] text-ink-950/85 md:text-[3.6vw]"
              >
                open for freelance · full stack · ai · 2026{" "}
                <span className="text-red">·</span>{" "}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-ink-950/15 bg-cream-100">
                <Image
                  src="/logo.gif"
                  alt=""
                  width={36}
                  height={36}
                  unoptimized
                  className="h-full w-full object-cover opacity-90"
                />
              </span>
              <span className="font-display text-lg font-extrabold leading-none">
                rahul<span className="text-red">.</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/55">
              Full Stack Developer · Freelancer · Building modern web apps
              with MERN, Next.js and AI.
            </p>
          </div>

          <ul className="col-span-12 grid grid-cols-2 gap-2 md:col-span-4 md:grid-cols-2">
            {[
              { label: "Home", href: "#top" },
              { label: "About", href: "#about" },
              { label: "Services", href: "#services" },
              { label: "Experience", href: "#experience" },
              { label: "Projects", href: "#projects" },
              { label: "Stack", href: "#stack" },
            ].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  data-cursor="hover"
                  className="hover-line font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/65"
                >
                  → {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="col-span-12 md:col-span-4 md:text-right">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/55">
              © {year} Rahul. All rights reserved.
            </span>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/35">
              Built with Next.js · GSAP · R3F · Lenis
            </p>
          </div>
        </div>

        <div className="pointer-events-none mt-20 overflow-hidden">
          <h3 className="display text-stroke text-[28vw] leading-[0.78] tracking-tightest md:text-[22vw]">
            rahul.
          </h3>
        </div>
      </div>

      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        fallbackEmail="rahuldeva5555@gmail.com"
      />
    </footer>
  );
}

function Detail({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div>
      <span className="mono-eyebrow text-ink-950/55">{title}</span>
      <ul className="mt-2 space-y-1">
        {lines.map((l) => (
          <li key={l} className="font-mono text-[12px] text-ink-950/85">
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  label,
  handle,
  href = "#",
}: {
  label: string;
  handle: string;
  href?: string;
}) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      data-cursor="hover"
      className="group flex items-center justify-between rounded-md border border-ink-950/15 bg-cream-50 px-4 py-3 transition hover:border-red hover:bg-red/[0.06]"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-950/55">
        {label}
      </span>
      <span className="font-mono text-[12px] text-ink-950/90 transition-colors group-hover:text-red">
        {handle} {isExternal ? "↗" : ""}
      </span>
    </a>
  );
}
