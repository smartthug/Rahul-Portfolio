"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ContactForm from "@/components/ContactForm";
import CopyEmail from "@/components/CopyEmail";
import { SITE } from "@/lib/site";

const COLORS = [
  { name: "black", value: "#111111" },
  { name: "blue", value: "#2563eb" },
  { name: "red", value: "#dc2626" },
  { name: "green", value: "#16a34a" },
  { name: "orange", value: "#ea580c" },
];

const CHECKLIST = [
  "What your business does",
  "What the site should achieve",
  "Your current website (if any)",
  "2–3 sites you like",
  "Rough budget & launch date",
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawnRef = useRef(false);
  const [color, setColor] = useState(COLORS[0].value);
  const [eraser, setEraser] = useState(false);
  const [touchDraw, setTouchDraw] = useState(false);
  const [folded, setFolded] = useState(false);
  const toolRef = useRef({ color, eraser, touchDraw });
  toolRef.current = { color, eraser, touchDraw };
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  // Only the visible side of the card can receive focus.
  useEffect(() => {
    if (frontRef.current) frontRef.current.inert = folded;
    if (backRef.current) backRef.current.inert = !folded;
  }, [folded]);

  // Keep the canvas sized to the section (and keep what was drawn on resize).
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = section.getBoundingClientRect();
      const copy = document.createElement("canvas");
      copy.width = canvas.width;
      copy.height = canvas.height;
      copy.getContext("2d")?.drawImage(canvas, 0, 0);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.drawImage(copy, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);
    return () => ro.disconnect();
  }, []);

  // Freehand drawing. Mouse and pen draw directly; touch only in "draw mode"
  // so the page can still be scrolled with a finger.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let drawing = false;
    let last = { x: 0, y: 0 };

    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === "touch" && !toolRef.current.touchDraw) return;
      drawing = true;
      last = pos(e);
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* ignore — drawing continues via move events */
      }
    };
    const move = (e: PointerEvent) => {
      if (!drawing) return;
      const p = pos(e);
      const { eraser: er, color: c } = toolRef.current;
      ctx.globalCompositeOperation = er ? "destination-out" : "source-over";
      ctx.strokeStyle = c;
      ctx.lineWidth = er ? 22 : 3;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
      if (!er) drawnRef.current = true;
    };
    const up = () => {
      drawing = false;
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, []);

  const clear = () => {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    drawnRef.current = false;
  };

  /** Flattens the doodle onto paper colour and returns a small JPEG data URL. */
  const getDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !drawnRef.current) return null;
    const scale = Math.min(1, 1000 / canvas.width);
    const out = document.createElement("canvas");
    out.width = Math.round(canvas.width * scale);
    out.height = Math.round(canvas.height * scale);
    const ctx = out.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#fbf7f0";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(canvas, 0, 0, out.width, out.height);
    return out.toDataURL("image/jpeg", 0.72);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden border-t-[3px] border-black bg-paper-sketch bg-dots-paper pb-16 pt-14 text-black lg:pt-20"
    >
      <canvas
        ref={canvasRef}
        aria-label="Drawing area — draw anywhere on the paper"
        className={`absolute inset-0 z-0 ${touchDraw ? "touch-none" : ""} cursor-crosshair`}
      />

      {/* "draw something" scribble */}
      <svg aria-hidden viewBox="0 0 420 90" className="pointer-events-none absolute left-2 top-4 hidden h-20 w-[380px] lg:block">
        <path d="M14 0 C 10 30, 4 60, 20 70 L 80 72" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" />
        <text x="88" y="78" fontFamily="var(--font-hand), cursive" fontSize="46" fill="#111">
          draw something
        </text>
      </svg>

      {/* palette */}
      <div
        role="toolbar"
        aria-label="Drawing palette"
        className="relative z-10 mx-4 mb-8 flex flex-wrap items-center justify-center gap-1.5 border-[3px] sm:mx-auto sm:w-max sm:gap-2 border-black bg-white px-3 py-2 shadow-[4px_4px_0_#111] lg:absolute lg:left-6 lg:top-[34%] lg:mb-0 lg:flex-col lg:px-2 lg:py-3"
      >
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-black/50 lg:[writing-mode:vertical-rl]">palette</span>
        {COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            aria-label={`Pen colour ${c.name}`}
            aria-pressed={!eraser && color === c.value}
            onClick={() => {
              setColor(c.value);
              setEraser(false);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-full ${!eraser && color === c.value ? "ring-2 ring-black ring-offset-2" : ""}`}
          >
            <span className="h-7 w-7 rounded-full border-2 border-black/20" style={{ background: c.value }} />
          </button>
        ))}
        <span aria-hidden className="h-6 w-px bg-black/20 lg:h-px lg:w-6" />
        <ToolButton label="Eraser" pressed={eraser} onClick={() => setEraser((v) => !v)}>
          ⌫
        </ToolButton>
        <ToolButton label="Clear drawing" onClick={clear}>
          🗑
        </ToolButton>
        <ToolButton label="Draw with finger (touch screens)" pressed={touchDraw} onClick={() => setTouchDraw((v) => !v)} className="lg:hidden">
          ✏️
        </ToolButton>
      </div>

      <div className="pointer-events-none relative z-10 mx-auto max-w-[560px] px-4 text-center">
        <p className="inline-block border-b-2 border-dashed border-black/30 pb-1 font-mono text-xs tracking-[0.2em] text-black/65">
          * aesthetic #05 *
        </p>
        <h2
          id="contact-title"
          data-fx
          className="mt-3 font-hand text-[clamp(3rem,7vw,4.5rem)] font-bold leading-none"
          style={{ transform: "rotate(calc((1 - var(--pe)) * -8deg)) scale(calc(0.7 + var(--pe) * 0.3))" }}
        >
          say hello! <span aria-hidden>✏️</span>
        </h2>
        <p className="mt-3 font-sketch text-base text-black/70">
          Tell me about your project. Click &amp; drag to doodle on the paper, then send!
        </p>
      </div>

      {/* paper card with fold-over back side */}
      <div
        data-fx
        className="pointer-events-none relative z-10 mx-auto mt-10 w-full max-w-[540px] px-4 [perspective:1600px]"
        style={{ transform: "translateY(calc((1 - var(--pe)) * 140px)) rotate(calc((1 - var(--pe)) * -5deg))" }}
      >
        <div
          className={`pointer-events-auto relative grid transition-transform duration-700 [transform-style:preserve-3d] motion-reduce:transition-none ${
            folded ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* front */}
          <div
            className="relative border-[3px] border-black bg-[#fdfdfb] py-8 pl-12 pr-6 shadow-[6px_6px_0_#111] [backface-visibility:hidden] [grid-area:1/1] sm:pl-14 sm:pr-10"
            ref={frontRef}
            aria-hidden={folded}
          >
            <Holes />
            <FoldCorner label="fold me →" onClick={() => setFolded(true)} />
            <ContactForm getDrawing={getDrawing} />
          </div>

          {/* back */}
          <div
            className="relative flex flex-col border-[3px] border-black bg-[#fff8e5] py-8 pl-12 pr-6 shadow-[6px_6px_0_#111] [backface-visibility:hidden] [grid-area:1/1] [transform:rotateY(180deg)] sm:pl-14 sm:pr-10"
            ref={backRef}
            aria-hidden={!folded}
          >
            <Holes />
            <FoldCorner label="← unfold" onClick={() => setFolded(false)} />
            <h3 className="font-hand text-4xl font-bold">prefer email?</h3>
            <p className="mt-2 font-sketch text-base text-black/75">Write to me directly — I usually reply within 24 hours.</p>
            <div className="mt-3 font-sketch">
              <CopyEmail />
            </div>
            <h4 className="mt-8 font-hand text-3xl font-bold">helpful to include:</h4>
            <ul className="mt-2 space-y-2 font-sketch text-base">
              {CHECKLIST.map((c) => (
                <li key={c} className="flex gap-2">
                  <span aria-hidden>☐</span>
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center border-2 border-black bg-white px-4 font-sketch text-base shadow-[3px_3px_0_#111]">
                LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center border-2 border-black bg-white px-4 font-sketch text-base shadow-[3px_3px_0_#111]">
                GitHub ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="pointer-events-none relative z-10 mt-16 text-center font-mono text-xs text-black/60">
        © {new Date().getFullYear()} Rahul · {SITE.role} · {SITE.location} · Built with Next.js
      </footer>
    </section>
  );
}

function Holes() {
  return (
    <div aria-hidden className="absolute bottom-6 left-3 top-6 flex flex-col justify-between">
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="h-4 w-4 rounded-full border-2 border-black bg-paper-sketch" />
      ))}
    </div>
  );
}

function FoldCorner({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute -right-[3px] -top-[3px] flex min-h-[44px] items-start gap-2 pl-3 font-hand text-lg text-black/60 hover:text-black"
    >
      <span className="pt-2">{label}</span>
      <span aria-hidden className="block h-10 w-10 border-b-[3px] border-l-[3px] border-black bg-[#e9e2cf] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
    </button>
  );
}

function ToolButton({
  label,
  pressed,
  onClick,
  className = "",
  children,
}: {
  label: string;
  pressed?: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center border-2 border-black text-lg ${pressed ? "bg-sun" : "bg-white"} ${className}`}
    >
      {children}
    </button>
  );
}
