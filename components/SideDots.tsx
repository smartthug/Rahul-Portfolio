"use client";

import { useEffect, useState } from "react";

// Each section has its own active marker, matching that section's style.
const SECTIONS = [
  { id: "top", label: "Intro", on: "h-3 w-3 rotate-45 bg-teal shadow-[0_0_10px_2px_rgba(79,209,197,0.8)] ring-2 ring-black" },
  { id: "about", label: "About", on: "h-3 w-3 rounded-full bg-[#d946ef] shadow-[0_0_10px_2px_rgba(217,70,239,0.8)]" },
  { id: "work", label: "Projects", on: "h-3.5 w-3.5 border-2 border-black bg-sun" },
  { id: "skills", label: "Services & skills", on: "h-3.5 w-3.5 border-2 border-[#3b2410] bg-wood-light" },
  { id: "contact", label: "Contact", on: "h-3.5 w-3.5 rounded-full bg-black ring-2 ring-white" },
];

/** Fixed section navigation on the right edge; the active dot becomes a glowing diamond. */
export default function SideDots() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="Sections" className="fixed right-3 top-1/2 z-50 hidden -translate-y-1/2 md:block">
      <ul className="flex flex-col items-center gap-1">
        {SECTIONS.map((s) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-label={s.label}
                aria-current={on ? "true" : undefined}
                className="group relative flex h-9 w-9 items-center justify-center"
              >
                <span
                  className={`block transition-all duration-300 ${
                    on
                      ? s.on
                      : "h-2 w-2 rounded-full bg-neutral-400 ring-1 ring-black/60 group-hover:bg-white"
                  }`}
                />
                <span className="pointer-events-none absolute right-10 hidden whitespace-nowrap border-2 border-black bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-black group-hover:block group-focus-visible:block">
                  {s.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
