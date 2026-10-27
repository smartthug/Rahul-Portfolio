import Doodle from "@/components/Doodle";

/*
 * Six "fractured" panels, each in a different design style. On large screens
 * they are clip-path polygons over a black base, with lines drawn on the
 * seams. Below lg they stack as slanted bands.
 *
 * Corners (percent of the hero box): A(45,0) · B(40,52) · C(0,45) · D(70,48)
 * E(100,40) · F(35,100) · G(65,100) · H(84,44.27) · I(84,100)
 *
 * On scroll, --m (0→1, set in globals.css from ScrollFX's --p) slides the
 * H–I seam to the right edge: the dark panel collapses and the sketch panel
 * widens, while each panel's content drifts at its own speed.
 */
const HX = "calc(84% + var(--m) * 16%)"; // seam x
const HY = "calc(44.27% - var(--m) * 4.27%)"; // where the seam meets the D–E edge

const POLY = {
  minimal: "polygon(0 0, 45% 0, 40% 52%, 0 45%)",
  brutal: "polygon(45% 0, 100% 0, 100% 40%, 70% 48%, 40% 52%)",
  build: "polygon(0 45%, 40% 52%, 35% 100%, 0 100%)",
  swiss: "polygon(40% 52%, 70% 48%, 65% 100%, 35% 100%)",
  sketch: `polygon(70% 48%, ${HX} ${HY}, ${HX} 100%, 65% 100%)`,
  dark: `polygon(${HX} ${HY}, 100% 40%, 100% 100%, ${HX} 100%)`,
};

const SEAMS = ["M45 0 L40 52", "M0 45 L40 52 L70 48 L100 40", "M40 52 L35 100", "M70 48 L65 100"];

/** Parallax helper: translate by `n` px per unit of --m */
const drift = (x: number, y: number, extra = "") =>
  ({ transform: `translate(calc(var(--m) * ${x}px), calc(var(--m) * ${y}px)) ${extra}` }) as React.CSSProperties;

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative bg-black">
      <h1 id="hero-title" className="sr-only">
        Rahul — freelance web developer in Chennai. I build fast, modern websites, landing pages and React web apps
        that turn visitors into enquiries.
      </h1>

      {/* ---------- Desktop: fractured panels ---------- */}
      <div data-fx className="hero-fx relative hidden h-[100dvh] min-h-[660px] overflow-hidden lg:block">
        <Panel poly={POLY.minimal} className="bg-night bg-dots-dark" delay={0}>
          <div className="absolute left-[12%] top-[16%] w-[26%]" style={drift(0, -120)}>
            <MinimalCopy />
          </div>
        </Panel>

        <Panel poly={POLY.brutal} className="bg-sun bg-grid-yellow" delay={80}>
          <div className="absolute right-[15%] top-[13%] text-right" style={drift(-40, 70)}>
            <BrutalCopy />
          </div>
        </Panel>

        <Panel poly={POLY.build} className="bg-beige" delay={160}>
          <div className="absolute inset-0" style={drift(-60, 30)}>
            <BuildArt />
          </div>
          <div className="absolute left-[10%] top-[68%]" style={drift(40, -90, "rotate(calc(var(--m) * -6deg))")}>
            <BuildCopy />
          </div>
        </Panel>

        <Panel poly={POLY.swiss} className="bg-crimson" delay={240}>
          <div className="absolute left-[43%] top-[67%]" style={drift(0, -140)}>
            <SwissCopy />
          </div>
        </Panel>

        <Panel poly={POLY.sketch} className="bg-paper-sketch bg-dots-paper" delay={320}>
          <div className="absolute left-[68.5%] top-[64%] w-[15%]" style={{ transform: "translate(calc(var(--m) * 8vw), calc(var(--m) * -160px))" }}>
            <SketchCopy />
          </div>
        </Panel>

        <Panel poly={POLY.dark} className="bg-night bg-dots-dark" delay={400}>
          <p
            className="absolute bottom-10 left-[91%] font-mono text-[11px] uppercase tracking-[0.3em] text-white/60 [writing-mode:vertical-rl]"
            style={{ opacity: "calc(1 - var(--m) * 1.5)" }}
          >
            scroll to explore →
          </p>
        </Panel>

        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {SEAMS.map((d) => (
            <path key={d} d={d} stroke="#000" strokeWidth="7" fill="none" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        {/* moving seam */}
        <span aria-hidden className="absolute bottom-0 w-[7px] -translate-x-1/2 bg-black" style={{ left: HX, top: HY }} />

        <div className="absolute left-[40%] top-[52%] z-10 -translate-x-[45%] -translate-y-[96%]">
          <Doodle />
        </div>
      </div>

      {/* ---------- Mobile / tablet: slanted bands ---------- */}
      <div className="flex flex-col bg-black lg:hidden">
        <Band className="bg-night bg-dots-dark pb-20 pt-20" first>
          <div className="mx-auto max-w-sm px-6 text-center">
            <MinimalCopy />
          </div>
        </Band>
        <Band className="bg-sun bg-grid-yellow pb-16 pt-14">
          <BandRise>
            <div className="relative mx-auto flex max-w-sm justify-center px-6 text-center">
              <BrutalCopy />
            </div>
          </BandRise>
          <div className="absolute bottom-3 right-4 scale-[0.7] sm:right-[12%]">
            <Doodle />
          </div>
        </Band>
        <Band className="relative overflow-hidden bg-beige py-24">
          <BuildArt />
          <BandRise>
            <div className="relative flex justify-center">
              <BuildCopy />
            </div>
          </BandRise>
        </Band>
        <Band className="bg-crimson py-16">
          <BandRise>
            <div className="flex justify-center px-6">
              <SwissCopy />
            </div>
          </BandRise>
        </Band>
        <Band className="bg-paper-sketch bg-dots-paper pb-16 pt-14" last>
          <BandRise>
            <div className="mx-auto max-w-xs px-6">
              <SketchCopy />
            </div>
          </BandRise>
        </Band>
      </div>
    </section>
  );
}

function Panel({ poly, className, delay, children }: { poly: string; className: string; delay: number; children: React.ReactNode }) {
  return (
    <div className={`absolute inset-0 animate-panelIn ${className}`} style={{ clipPath: poly, animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** A slanted band; consecutive bands overlap by the slant so a black seam shows between them. */
function Band({ className, children, first, last }: { className: string; children: React.ReactNode; first?: boolean; last?: boolean }) {
  const top = first ? "0 0, 100% 0" : "0 28px, 100% 0";
  const bottom = last ? "100% 100%, 0 100%" : "100% calc(100% - 28px), 0 100%";
  return (
    <div className={`relative ${className} ${first ? "" : "-mt-[22px]"}`} style={{ clipPath: `polygon(${top}, ${bottom})` }}>
      {children}
    </div>
  );
}

/** Mobile band content rises and fades in as the band scrolls into view. */
function BandRise({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-fx
      className="relative"
      style={{ transform: "translateY(calc((1 - var(--pe)) * 60px))", opacity: "calc(0.2 + var(--pe) * 0.8)" }}
    >
      {children}
    </div>
  );
}

/* ---------- panel contents (shared by both layouts) ---------- */

function MinimalCopy() {
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/50">[ style 01 : minimalism ]</p>
      <p aria-hidden className="mt-3 font-sans text-[clamp(3.4rem,6.4vw,6.2rem)] font-light leading-none tracking-[0.05em] text-white/85">
        rahul
      </p>
      <p className="mt-4 font-sans text-sm font-light leading-relaxed tracking-[0.12em] text-white/70">
        websites that turn visitors into enquiries.
      </p>
      <p className="mt-4 flex flex-wrap justify-center gap-x-6 font-sans text-sm font-light tracking-[0.14em] text-white/80 lg:justify-start">
        <a href="#work" className="inline-flex min-h-[44px] items-center underline-offset-8 hover:text-white hover:underline">
          view work ↓
        </a>
        <a href="#contact" className="inline-flex min-h-[44px] items-center underline-offset-8 hover:text-white hover:underline">
          hire me →
        </a>
      </p>
    </>
  );
}

function BrutalCopy() {
  return (
    <div>
      <p className="inline-block border-2 border-black bg-black px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-sun shadow-[3px_3px_0_#000]">
        style 02 // neobrutalism
      </p>
      <p aria-hidden className="mt-5 font-mega text-[clamp(4.2rem,8.5vw,8.5rem)] font-black leading-[0.85] text-black [text-shadow:-3px_3px_0_#000,_-7px_7px_0_rgba(0,0,0,0.22)]">
        DEV
      </p>
      <p className="mt-4 font-mono text-xs font-bold uppercase leading-relaxed text-black/80">
        Freelance web developer
        <br />
        Chennai, India · IST
      </p>
    </div>
  );
}

function BuildArt() {
  return (
    <>
      <div aria-hidden className="absolute -left-[20%] top-[46%] h-[24%] w-[140%] -rotate-[22deg] bg-brick lg:top-[62%] lg:h-[20%]" />
      <div aria-hidden className="absolute bottom-0 left-0 h-[22%] w-[9%] bg-[#b04545] [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
      <div aria-hidden className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border-[14px] border-black/85 lg:hidden" />
    </>
  );
}

function BuildCopy() {
  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[#0f766e]">структура / 03</p>
      <p aria-hidden className="mt-2 -rotate-[8deg] font-staat text-[clamp(4.2rem,6.5vw,6.5rem)] leading-none text-teal [text-shadow:6px_4px_0_#111]">
        BUILD
      </p>
    </div>
  );
}

function SwissCopy() {
  return (
    <div className="text-white">
      <p className="font-swiss text-sm font-bold text-white/85">[04]&nbsp;&nbsp;IN-600001</p>
      <p aria-hidden className="mt-1 font-swiss text-[clamp(3.8rem,5.6vw,5.6rem)] font-black leading-none tracking-tight">
        SHIP
      </p>
      <div className="mt-4 flex gap-6 border-t border-white/70 pt-3 font-swiss text-[11px] uppercase tracking-wide text-white">
        <span>React</span>
        <span>Next.js</span>
        <span>Tailwind</span>
      </div>
    </div>
  );
}

function SketchCopy() {
  return (
    <div className="text-center">
      <p className="inline-block border-b border-dashed border-black/40 pb-1 font-mono text-[11px] tracking-[0.2em] text-black/65">
        * aesthetic #05 *
      </p>
      <p className="mt-4 font-hand text-[clamp(1.7rem,2.1vw,2.2rem)] font-bold leading-tight text-black">your next website</p>
      <svg aria-hidden viewBox="0 0 80 10" className="mx-auto mt-1 h-3 w-16">
        <path d="M2 6 C 12 2, 22 9, 32 5 S 52 2, 62 6 S 74 8, 78 4" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
      <a href="#contact" className="mt-5 inline-flex min-h-[48px] items-center gap-1 font-hand text-2xl font-bold text-[#1d4ed8] hover:underline">
        let&rsquo;s talk
        <svg aria-hidden viewBox="0 0 40 30" className="h-8 w-10">
          <path d="M6 4 L18 15 L6 26 M20 4 L32 15 L20 26" stroke="#1d4ed8" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}
