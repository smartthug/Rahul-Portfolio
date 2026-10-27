"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import CatPlayground from "@/components/CatPlayground";
import LoopVideo from "@/components/LoopVideo";
import Link from "next/link";
import { ACCENT_BG, PROJECTS, type Project } from "@/lib/projects";

export default function Projects() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  // --- swing physics: scroll velocity kicks a damped spring shared by all cards
  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let angle = 0;
    let vel = 0;
    let lastX = scroller.scrollLeft;
    let raf = 0;

    const step = () => {
      const x = scroller.scrollLeft;
      const dx = x - lastX;
      lastX = x;
      vel += -dx * 0.025; // kick opposite to travel, like a hanging sign
      vel += -angle * 0.08; // spring
      vel *= 0.86; // damping
      angle = Math.max(-12, Math.min(12, angle + vel));
      track.style.setProperty("--swing", angle.toFixed(2));
      if (Math.abs(angle) > 0.02 || Math.abs(vel) > 0.02 || dx !== 0) {
        raf = requestAnimationFrame(step);
      } else {
        track.style.setProperty("--swing", "0");
        raf = 0;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // --- active card index (for the counter widget)
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onScroll = () => {
      const cards = [...scroller.querySelectorAll<HTMLElement>("[data-card]")];
      const left = scroller.getBoundingClientRect().left;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.getBoundingClientRect().left - left - 24);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  // --- mouse drag-to-scroll (touch and trackpads use native scrolling)
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if ((e.target as HTMLElement).closest("a, button")) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = scroller.scrollLeft;
      try {
        scroller.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      scroller.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      scroller.scrollLeft = startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      if (scroller.hasPointerCapture(e.pointerId)) scroller.releasePointerCapture(e.pointerId);
      scroller.style.cursor = "";
    };
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    scroller.addEventListener("pointerdown", onDown);
    scroller.addEventListener("pointermove", onMove);
    scroller.addEventListener("pointerup", onUp);
    scroller.addEventListener("pointercancel", onUp);
    scroller.addEventListener("click", onClick, true);
    return () => {
      scroller.removeEventListener("pointerdown", onDown);
      scroller.removeEventListener("pointermove", onMove);
      scroller.removeEventListener("pointerup", onUp);
      scroller.removeEventListener("pointercancel", onUp);
      scroller.removeEventListener("click", onClick, true);
    };
  }, []);

  const goTo = useCallback((i: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const n = (i + PROJECTS.length) % PROJECTS.length;
    const card = scroller.querySelectorAll<HTMLElement>("[data-card]")[n];
    if (!card) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({ left: card.offsetLeft - 24, behavior: smooth ? "smooth" : "auto" });
  }, []);


  return (
    <section id="work" aria-labelledby="work-title" className="relative overflow-hidden bg-grape bg-grid-purple">
      {/* framed header */}
      <div className="relative px-4 pb-14 pt-16 sm:px-8 lg:pt-20">
        <div aria-hidden className="absolute bottom-6 left-4 top-0 w-[calc(100%-1rem)] border-b-[6px] border-l-[6px] border-grape-deep sm:left-8 sm:w-[calc(100%-2rem)]" />
        <div data-fx className="relative flex flex-col items-center text-center">
          <p className="border-2 border-black bg-black px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-violet">
            portfolio // section 03
          </p>
          <h2
            id="work-title"
            className="mt-6 border-[4px] border-black bg-white px-5 py-3 font-mega text-[clamp(1.5rem,4.6vw,3.4rem)] font-black uppercase leading-none tracking-wide text-black shadow-[8px_8px_0_#000]"
            style={{ transform: "rotate(calc((1 - var(--pe)) * -6deg)) scale(calc(0.8 + var(--pe) * 0.2))" }}
          >
            Selected Projects
          </h2>
          <div className="mt-6 flex items-center gap-3">
            <ArrowButton label="Previous project" onClick={() => goTo(active - 1)}>
              ◀
            </ArrowButton>
            <p className="border-2 border-black bg-sun px-3 py-1.5 font-mono text-xs font-bold uppercase text-black shadow-[3px_3px_0_#000]">
              <span aria-hidden>↔️ </span>Drag the track to slide &amp; swing the cards
            </p>
            <ArrowButton label="Next project" onClick={() => goTo(active + 1)}>
              ▶
            </ArrowButton>
          </div>
          <p className="mt-3 font-mono text-xs font-bold text-black/70" aria-live="polite">
            <span className="sr-only">Showing project </span>
            {String(active + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* rope + hanging cards */}
      <div
        ref={scrollerRef}
        className="no-scrollbar relative cursor-grab touch-pan-x overflow-x-auto overscroll-x-contain"
        role="region"
        aria-label="Projects — scroll horizontally"
        tabIndex={0}
      >
        <ul ref={trackRef} data-fx className="relative flex w-max gap-10 px-6 pb-10 pt-3 sm:gap-16 sm:px-10" style={{ ["--swing" as string]: "0" }}>
          <li
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[30px] h-2.5 origin-left bg-grape-deep shadow-[0_3px_0_rgba(0,0,0,0.35)]"
            style={{ transform: "scaleX(clamp(0, var(--pe) * 1.5, 1))" }}
          />
          {PROJECTS.map((p, i) => (
            <Card key={p.slug} project={p} index={i} />
          ))}
        </ul>
      </div>

      {/* pet playground with hazard-stripe floor */}
      <CatPlayground />

    </section>
  );
}

function ArrowButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center border-[3px] border-black bg-white text-sm font-black text-black shadow-[3px_3px_0_#000] hover:bg-sky active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
    >
      {children}
    </button>
  );
}

function Card({ project: p, index }: { project: Project; index: number }) {
  const n = String(index + 1).padStart(2, "0");
  // Neighbouring cards swing by slightly different amounts so the row feels physical.
  const factor = [1, 0.8, 1.15, 0.9][index % 4];

  return (
    <li
      data-card
      className="relative w-[290px] shrink-0 sm:w-[330px]"
      // Cards drop onto the rope one after another as the track scrolls into view.
      style={{ transform: `translateY(calc((1 - clamp(0, (var(--pe) - ${Math.min(index, 4) * 0.08}) * 2.2, 1)) * -220px))` }}
    >
      <div
        className="origin-[50%_-6px] [filter:drop-shadow(0_3px_0_#000)_drop-shadow(6px_6px_0_#000)]"
        style={{ transform: `rotate(calc(var(--swing) * ${factor} * 1deg)) rotate(${index % 2 ? 1.2 : -1}deg)` }}
      >
        <article
          aria-labelledby={`${p.slug}-title`}
          className="torn relative border-x-[3px] border-t-[3px] border-black bg-[#fbf8f1] bg-grid-card px-5 pb-8 pt-9"
        >
          <span aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-rose/70" />
          {/* punch holes on the rope */}
          <span aria-hidden className="absolute left-[30%] top-3 h-5 w-5 rounded-full border-[3px] border-black bg-[linear-gradient(#a855f7_0_30%,#6d28d9_30%_75%,#a855f7_75%)]" />
          <span aria-hidden className="absolute right-[34%] top-3 h-5 w-5 rounded-full border-[3px] border-black bg-[linear-gradient(#a855f7_0_30%,#6d28d9_30%_75%,#a855f7_75%)]" />
          <span
            className={`absolute -top-[2px] right-4 rotate-[-4deg] border-2 border-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-black ${ACCENT_BG[p.accent]}`}
          >
            {p.tag}
          </span>

          <p className="relative mt-2 flex items-center justify-between font-mono text-[10px] text-black/55">
            <span>{`// PROJECT_${n}`}</span>
            <span aria-hidden className="text-sm text-black">✦</span>
          </p>
          <h3 id={`${p.slug}-title`} className="relative mt-3 border-b-[3px] border-black pb-2 font-mega text-lg font-black uppercase leading-tight text-black">
            {p.title}
          </h3>
          <p className="relative mt-3 font-mono text-[12px] leading-[1.65] text-black/85">{p.summary}</p>

          <div className="relative mx-1 mt-4 -rotate-1 border-2 border-black bg-black">
            <span aria-hidden className="absolute -top-2 left-1/2 z-10 h-4 w-14 -translate-x-1/2 rotate-2 bg-sun/80" />
            <div className="relative aspect-[16/10]">
              {p.video ? (
                <LoopVideo src={p.video} poster={p.image} speed={p.videoSpeed} className="absolute inset-0 h-full w-full object-contain" />
              ) : (
                <Image src={p.image} alt={p.imageAlt} fill sizes="330px" className="object-contain" />
              )}
            </div>
          </div>

          <ul className="relative mt-4 space-y-0.5 font-mono text-[11px] text-black/80">
            {p.highlights.map((h) => (
              <li key={h}>✓ {h}</li>
            ))}
          </ul>

          <ul className="relative mt-3 flex flex-wrap gap-1.5" aria-label="Technologies used">
            {p.stack.map((s) => (
              <li key={s} className="border-2 border-black bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-black">
                #{s.replace(/\s/g, "")}
              </li>
            ))}
          </ul>

          <div className="relative mt-5 flex flex-col gap-2">
            <Link
              href={`/projects/${p.slug}`}
              className={`flex min-h-[46px] items-center justify-center gap-2 border-[3px] border-black font-mega text-xs font-black uppercase text-black shadow-[4px_4px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none ${ACCENT_BG[p.accent]}`}
            >
              View details →<span className="sr-only">: {p.title}</span>
            </Link>
            {p.demo ? (
              <a
                href={p.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[46px] items-center justify-center gap-2 border-[3px] border-black bg-white font-mega text-xs font-black uppercase text-black shadow-[4px_4px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                View live ↗
                <span className="sr-only">: {p.title} (opens in a new tab)</span>
              </a>
            ) : null}
            {!p.demo ? (
              <p className="border-2 border-dashed border-black/40 px-2 py-2 text-center font-mono text-[11px] font-bold uppercase text-black/60">
                Live link coming soon
              </p>
            ) : null}
          </div>
        </article>
      </div>
    </li>
  );
}
