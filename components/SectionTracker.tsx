"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TrackedSection {
  /** DOM id of the <section> */
  id: string;
  /** Two-digit slot like 01, 02 ... */
  n: string;
  /** Human-readable label */
  label: string;
}

const SECTIONS: TrackedSection[] = [
  { id: "top", n: "01", label: "Intro" },
  { id: "about", n: "02", label: "About" },
  { id: "services", n: "03", label: "What I do" },
  { id: "experience", n: "04", label: "Experience" },
  { id: "build-loop", n: "05", label: "Build loop" },
  { id: "projects", n: "06", label: "Projects" },
  { id: "reel", n: "07", label: "Featured · DocRAG" },
  { id: "stack", n: "08", label: "Tech stack" },
  { id: "motto", n: "09", label: "Motto" },
  { id: "connect", n: "10", label: "Connect" },
];

export default function SectionTracker() {
  const [activeId, setActiveId] = useState<string>("top");

  useEffect(() => {
    // Resolve only the section elements that actually exist on the page.
    const tracked = SECTIONS.map((s) => ({
      ...s,
      el: typeof document !== "undefined" ? document.getElementById(s.id) : null,
    })).filter((s): s is TrackedSection & { el: HTMLElement } => !!s.el);

    if (tracked.length === 0) return;

    let raf = 0;
    const recompute = () => {
      raf = 0;
      const viewportH = window.innerHeight;
      const target = viewportH * 0.45; // a line ~45% down the viewport
      let best = tracked[0];
      let bestDist = Infinity;
      for (const s of tracked) {
        const rect = s.el.getBoundingClientRect();
        // Distance from the target line to the section's mid-point, clamped to the section's bounds.
        const top = rect.top;
        const bottom = rect.bottom;
        let dist: number;
        if (target < top) dist = top - target;
        else if (target > bottom) dist = target - bottom;
        else dist = 0;
        if (dist < bestDist) {
          bestDist = dist;
          best = s;
        }
      }
      setActiveId((curr) => (curr === best.id ? curr : best.id));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(recompute);
    };

    recompute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const active = SECTIONS.find((s) => s.id === activeId) ?? SECTIONS[0];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-4 left-4 z-[60] hidden sm:left-6 sm:bottom-6 md:block"
    >
      <div className="flex items-center gap-3 rounded-full border border-ink-950/15 bg-cream-50/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-950/80 shadow-[0_8px_24px_-12px_rgba(13,13,13,0.25)] backdrop-blur-md">
        <span className="text-ink-950/45">{active.n}</span>
        <span className="h-3 w-px bg-ink-950/15" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={active.id}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.7, 0, 0.2, 1] }}
            className="text-ink-950"
          >
            {active.label}
          </motion.span>
        </AnimatePresence>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red shadow-[0_0_10px_rgba(235,89,57,0.7)]" />
      </div>
    </div>
  );
}
