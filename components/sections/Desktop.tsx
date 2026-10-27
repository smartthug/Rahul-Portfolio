"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CopyEmail from "@/components/CopyEmail";
import { SITE } from "@/lib/site";

type WinId = "links" | "portrait" | "terminal" | "services" | "process";

type WinDef = {
  id: WinId;
  file: string;
  title: string;
  icon: string;
  /** Desktop position as % of the desktop box, and width in px */
  x: number;
  y: number;
  w: number;
  /** Extra classes for the stacked (mobile) layout */
  mobile?: string;
};

const WINDOWS: WinDef[] = [
  { id: "links", file: "links.zip", title: "links.zip — Contact Atlas", icon: "🧳", x: 13, y: 6, w: 520 },
  { id: "services", file: "services.txt", title: "services.txt — Notepad", icon: "📝", x: 56, y: 4, w: 420 },
  { id: "terminal", file: "skills.exe", title: "C:\\RAHUL\\skills.exe", icon: "💻", x: 42, y: 62, w: 420 },
  { id: "portrait", file: "rahul.bmp", title: "rahul.bmp — Paint", icon: "🖼️", x: 82, y: 63, w: 220, mobile: "mx-auto max-w-[280px]" },
  { id: "process", file: "process.txt", title: "process.txt — Notepad", icon: "🗂️", x: 13, y: 60, w: 360 },
];

const SKILLS = [
  ["react.js", "ACTIVE"],
  ["next.js", "ACTIVE"],
  ["tailwind.css", "ACTIVE"],
  ["javascript / ts", "ACTIVE"],
  ["node + express", "READY"],
  ["mongodb / supabase", "READY"],
  ["ai apis (groq, openai)", "READY"],
  ["vercel deploy", "ACTIVE"],
] as const;

const SERVICES = [
  ["Business & company websites", "Explain what you do, build trust, get enquiries."],
  ["Landing pages", "One focused page around one action."],
  ["Portfolio websites", "Your best work behind a single link."],
  ["Website redesigns", "Modern look, mobile fixes, faster loads."],
  ["React / Next.js front-ends", "Figma or rough idea → responsive UI."],
  ["AI-powered features", "Chat over documents, AI plans, smart forms."],
] as const;

const STEPS = [
  ["Brief", "You share goals + sites you like. I reply with scope & timeline."],
  ["Design", "I propose structure and look. You give feedback first."],
  ["Build", "Responsive & fast, with a live preview link along the way."],
  ["Launch", "Live on your domain. I show you how to update it."],
] as const;

export default function Desktop() {
  const [open, setOpen] = useState<Record<WinId, boolean>>({
    links: true,
    services: true,
    terminal: true,
    portrait: true,
    process: true,
  });
  const [order, setOrder] = useState<WinId[]>(WINDOWS.map((w) => w.id));
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }).format(
          new Date()
        )
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const focus = (id: WinId) => setOrder((o) => [...o.filter((x) => x !== id), id]);
  const show = (id: WinId) => {
    setOpen((s) => ({ ...s, [id]: true }));
    focus(id);
  };
  const hide = (id: WinId) => setOpen((s) => ({ ...s, [id]: false }));

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="relative overflow-hidden border-t-[3px] border-black bg-sage bg-scanlines"
    >
      <h2 id="skills-title" className="sr-only">
        Services, skills, process and links
      </h2>

      {/* emblem */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[36%] hidden -translate-x-1/2 -translate-y-1/2 select-none text-center lg:block">
        <div
          data-fx
          className="absolute left-1/2 top-1/2 h-[480px] w-[480px] rounded-full border-[3px] border-dashed border-forest/15"
          style={{ transform: "translate(-50%, -50%) rotate(calc(var(--pp) * 120deg))" }}
        />
        <p className="relative font-serif text-xl italic tracking-[0.15em] text-forest/40">realm 04 // rahulOS 95</p>
        <p className="relative mt-2 font-serif text-[88px] font-extrabold leading-[0.95] text-sage [text-shadow:2px_2px_0_rgba(47,107,85,0.25),-1px_-1px_0_rgba(255,255,255,0.8)]">
          BUILD &amp;
          <br />
          SHIP
        </p>
        <p className="relative mt-3 font-mono text-xs tracking-[0.12em] text-forest/45">plan the pages · write the code · ship it live</p>
      </div>

      <div className="relative lg:h-[1020px]">
        {/* desktop icons */}
        <ul className="relative z-10 flex flex-wrap justify-center gap-2 px-4 pt-6 lg:absolute lg:left-4 lg:top-6 lg:flex-col lg:px-0 lg:pt-0">
          {WINDOWS.map((w) => (
            <li key={w.id}>
              <button
                type="button"
                onClick={() => show(w.id)}
                className="flex min-h-[64px] w-[84px] flex-col items-center justify-center gap-1 rounded px-1 py-1.5 font-mono text-[11px] text-forest-dark hover:bg-white/50 focus-visible:bg-white/60"
              >
                <span aria-hidden className="text-2xl leading-none">
                  {w.icon}
                </span>
                {w.file}
              </button>
            </li>
          ))}
        </ul>

        {/* windows: absolutely placed + draggable on lg, stacked below */}
        <div className="relative flex flex-col gap-6 px-4 pb-10 pt-6 sm:px-8 lg:static lg:block lg:p-0">
          {WINDOWS.map((w) =>
            open[w.id] ? (
              <Win key={w.id} def={w} z={order.indexOf(w.id) + 1} onFocus={() => focus(w.id)} onClose={() => hide(w.id)}>
                {w.id === "links" && <LinksBody />}
                {w.id === "services" && <ServicesBody />}
                {w.id === "terminal" && <Terminal />}
                {w.id === "portrait" && <PortraitBody />}
                {w.id === "process" && <ProcessBody />}
              </Win>
            ) : null
          )}
        </div>
      </div>

      {/* taskbar */}
      <div className="relative z-20 flex items-center gap-2 border-t-[3px] border-black bg-forest px-2 py-1.5">
        <a
          href="#contact"
          className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 border-2 border-wood-dark bg-wood-light px-3 font-mono text-sm font-bold text-[#3b2410] shadow-[2px_2px_0_#16382d] hover:bg-white"
        >
          <span aria-hidden>✉</span> Hire me
        </a>
        <span aria-hidden className="mx-1 h-7 w-px bg-black/40" />
        <div className="no-scrollbar flex min-w-0 flex-1 gap-1.5 overflow-x-auto">
          {WINDOWS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => (open[w.id] ? focus(w.id) : show(w.id))}
              aria-pressed={open[w.id]}
              className={`inline-flex min-h-[40px] shrink-0 items-center gap-1 border-2 px-2.5 font-mono text-xs ${
                open[w.id]
                  ? "border-wood-dark bg-wood-light text-[#3b2410]"
                  : "border-black/40 bg-forest-dark text-white/80"
              }`}
            >
              <span aria-hidden>{w.icon}</span> {w.file}
            </button>
          ))}
        </div>
        <span className="shrink-0 border-2 border-black/50 bg-forest-dark px-2.5 py-1.5 font-pixel text-lg leading-none text-white" aria-label={`Chennai time ${time}`}>
          {time || "--:--"}
        </span>
      </div>
    </section>
  );
}

/* ---------- window frame with drag (desktop only) ---------- */

function Win({
  def,
  z,
  onFocus,
  onClose,
  children,
}: {
  def: WinDef;
  z: number;
  onFocus: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const titleId = `win-${def.id}`;

  const onPointerDown = (e: React.PointerEvent) => {
    onFocus();
    if (e.pointerType !== "mouse" || !window.matchMedia("(min-width: 1024px)").matches) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const el = ref.current;
    if (!el) return;
    const start = { x: e.clientX, y: e.clientY };
    const base = { ...offset.current };
    const move = (ev: PointerEvent) => {
      offset.current = { x: base.x + ev.clientX - start.x, y: base.y + ev.clientY - start.y };
      el.style.translate = `${offset.current.x}px ${offset.current.y}px`;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div
      ref={ref}
      role="group"
      data-fx
      aria-labelledby={titleId}
      onPointerDownCapture={onFocus}
      className={`win w-full ${def.mobile ?? ""} lg:mx-0 lg:max-w-none lg:absolute lg:left-[min(var(--x),calc(100%_-_var(--w)_-_56px))] lg:top-[var(--y)] lg:w-[var(--w)]`}
      style={{
        zIndex: z,
        ["--x" as string]: `${def.x}%`,
        ["--y" as string]: `${def.y}%`,
        ["--w" as string]: `${def.w}px`,
        // pop in like an opening window as it scrolls into view (drag uses the separate `translate` property)
        transform: "translateY(calc((1 - var(--pe)) * 90px)) scale(calc(0.86 + var(--pe) * 0.14))",
        opacity: "calc(var(--pe) * 1.6)",
      }}
    >
      <div className="win-bar lg:cursor-move" onPointerDown={onPointerDown}>
        <span id={titleId} className="truncate">
          <span aria-hidden>{def.icon} </span>
          {def.title}
        </span>
        <span className="flex shrink-0 gap-1">
          <button type="button" className="win-btn" aria-label={`Minimise ${def.file}`} onClick={onClose}>
            _
          </button>
          <button type="button" className="win-btn" aria-label={`Close ${def.file}`} onClick={onClose}>
            ×
          </button>
        </span>
      </div>
      {children}
    </div>
  );
}

/* ---------- window bodies ---------- */

function LinksBody() {
  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center gap-3 border-2 border-wood-light bg-white/70 p-3">
        <Image src="/logo.gif" alt="" width={44} height={44} unoptimized className="h-11 w-11 rounded-full border-2 border-wood-dark" />
        <div className="min-w-0 flex-1">
          <p className="font-serif text-lg font-extrabold text-[#3b2410]">Rahul&rsquo;s link satchel</p>
          <p className="font-mono text-[11px] text-[#6b4a2b]">Three portals. One builder.</p>
        </div>
        <span className="shrink-0 rounded-full border-2 border-forest px-2 py-0.5 font-mono text-[10px] font-bold text-forest">● OPEN TO WORK</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid gap-3">
          <Portal href={SITE.github} name="GitHub" handle={SITE.githubHandle} icon="⌘" />
          <Portal href={SITE.linkedin} name="LinkedIn" handle={SITE.linkedinHandle} icon="in" />
        </div>
        <div className="flex flex-col justify-between border-2 border-black bg-forest-dark p-3 text-[#f3e7cf]">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#e7c49a]">build log · ✦ connected</p>
          <p className="mt-2 font-serif text-xl font-extrabold">Email</p>
          <p className="font-mono text-[11px] text-[#f3e7cf]/80">The fastest way to start a project.</p>
          <div className="mt-2 [&_a]:break-normal [&_a]:text-[13px] [&_a]:text-[#f3e7cf] [&_a]:hover:bg-transparent [&_button]:text-black">
            <CopyEmail />
          </div>
        </div>
      </div>
      <p className="flex justify-between border-t border-dashed border-wood pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6b4a2b]">
        <span>meet me beyond the desktop</span>
        <span>safe links only ✦</span>
      </p>
    </div>
  );
}

function Portal({ href, name, handle, icon }: { href: string; name: string; handle: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-[64px] items-center gap-3 border-2 border-wood-light bg-white/80 px-3 shadow-[2px_2px_0_#c38e57] hover:bg-[#fff3df]"
    >
      <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-wood-dark font-mono text-sm font-bold text-[#3b2410]">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-serif text-base font-extrabold text-[#3b2410]">{name}</span>
        <span className="block truncate font-mono text-[11px] text-[#6b4a2b]">{handle}</span>
      </span>
      <span aria-hidden className="ml-auto text-[#8a5a2b]">↗</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function ServicesBody() {
  return (
    <div className="bg-white p-4 font-mono text-[12.5px] leading-relaxed text-black">
      <h3 className="font-bold">WHAT I CAN BUILD FOR YOU</h3>
      <p className="text-black/60">=========================</p>
      <ol className="mt-2 space-y-2">
        {SERVICES.map(([t, d], i) => (
          <li key={t}>
            <span className="font-bold">
              {i + 1}. {t}
            </span>
            <br />
            <span className="text-black/75">   {d}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-black/70">Not sure which? Describe the problem — I&rsquo;ll suggest the simplest option.</p>
    </div>
  );
}

function ProcessBody() {
  return (
    <div className="bg-white p-4 font-mono text-[12.5px] leading-relaxed text-black">
      <h3 className="font-bold">HOW WE&rsquo;D WORK TOGETHER</h3>
      <ol className="mt-2 space-y-2">
        {STEPS.map(([t, d], i) => (
          <li key={t}>
            <span className="bg-sun px-1 font-bold">
              [{i + 1}] {t}
            </span>{" "}
            <span className="text-black/75">{d}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-black/70">No agency layers — you talk directly to the developer.</p>
    </div>
  );
}

function PortraitBody() {
  return (
    <div className="bg-white p-3">
      <div className="relative aspect-square border-2 border-[#e9d6b8] bg-[#7c83f7] p-4">
        <span aria-hidden className="absolute left-1 top-1 text-xs">✿</span>
        <span aria-hidden className="absolute bottom-1 right-1 text-xs">✿</span>
        <div className="relative h-full w-full">
          <Image src="/logo.gif" alt="Rahul's cat avatar, pixel-art style" fill unoptimized sizes="200px" className="object-contain [image-rendering:pixelated]" />
        </div>
      </div>
      <p className="mt-2 text-center font-mono text-[10px] text-[#6b4a2b]">rahul.bmp — the face behind the code</p>
    </div>
  );
}

function Terminal() {
  const lines = SKILLS.length;
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(lines);
      return;
    }
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting && !timer) {
        timer = setInterval(() => setShown((s) => (s >= lines ? s : s + 1)), 260);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [lines]);

  return (
    <div ref={ref} className="min-h-[300px] overflow-x-auto whitespace-pre border-[6px] border-[#fdf6e9] bg-forest-dark p-3 font-pixel text-[15px] leading-tight text-[#e9f5d0] sm:text-lg">
      <p>RahulOS 95 [Version 2026.10]</p>
      <p>C:\RAHUL&gt; load skills --all</p>
      {/* full list for assistive tech; the animated copy is decorative */}
      <ul className="sr-only">
        {SKILLS.map(([s]) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div aria-hidden>
        {SKILLS.slice(0, shown).map(([s, st]) => (
          <p key={s}>
            [##########] {s.padEnd(22, ".")} <span className={st === "ACTIVE" ? "text-sun" : "text-mint"}>{st}</span>
          </p>
        ))}
        <p>
          C:\RAHUL&gt; <span className="animate-blink">█</span>
        </p>
      </div>
    </div>
  );
}
