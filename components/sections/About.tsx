import Image from "next/image";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

const SERVICES = [
  "Business websites",
  "Landing pages",
  "Portfolio sites",
  "Website redesigns",
  "React / Next.js UI",
  "AI features",
];

export default function About() {
  return (
    <section
      id="about"
      data-fx
      aria-labelledby="about-title"
      className="relative isolate overflow-hidden bg-[#0c0c0c] pb-28 pt-24 text-white lg:min-h-[120dvh] lg:pt-32"
    >
      {/* red parallelogram */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-blood [clip-path:polygon(70%_0,100%_0,100%_100%,40%_100%)] lg:[clip-path:polygon(60%_0,100%_0,100%_32%,88%_82%,37%_88%)]"
        style={{ transform: "translateX(calc((1 - var(--pe)) * 40%))" }}
      />
      {/* translucent sweep */}
      <div
        aria-hidden
        className="absolute left-[-10%] top-[46%] -z-10 h-24 w-[130%] bg-white/[0.07]"
        style={{ transform: "translateX(calc((0.5 - var(--pp)) * 30%)) rotate(-4deg)" }}
      />
      {/* L-frame that draws itself as the section enters */}
      <svg aria-hidden viewBox="0 0 700 380" className="absolute left-6 top-0 -z-10 hidden h-[34%] w-[48%] lg:block" preserveAspectRatio="none">
        <path
          d="M4 0 V296 Q4 304 12 304 H690 L640 366 H600"
          pathLength={1}
          fill="none"
          stroke="#d42222"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ strokeDasharray: 1, strokeDashoffset: "calc(1 - var(--pe))" }}
        />
      </svg>

      <div className="mx-auto grid max-w-[1240px] grid-cols-[minmax(0,1fr)] gap-14 px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:px-16">
        <div className="lg:pt-[22vh]">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-blood sm:tracking-[0.5em]">[ access code // 02_about_me ]</p>

          <h2 id="about-title" className="mt-6 flex flex-col items-start gap-3">
            <span className="sr-only">About Rahul: developer by trade, builder by nature.</span>
            <Word text="DEVELOPER" by i={0} />
            <Word text="BY TRADE." dark i={1} />
            <Word text="BUILDER" by i={2} />
            <Word text="BY NATURE." dark i={3} />
          </h2>

          <p className="mt-10 max-w-xl font-sans text-2xl font-black uppercase leading-tight tracking-wide text-[#ff3b3b]">
            Studied the code, obsessed over the details.
          </p>
          <p className="mt-4 max-w-xl font-sans text-base font-light leading-relaxed text-white/85">
            I&rsquo;m Rahul, a web developer in Chennai. By day I&rsquo;m a full stack developer at Jaxpat Technology;
            on the side I build websites and web apps for small businesses, founders and creators. I care about clear
            communication, clean code and understanding what you actually need &mdash; then I design it, build it and
            ship it live.
          </p>

          <div className="mt-10">
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.4em] text-white/70">{"// what i build"}</h3>
            <ul className="mt-4 flex max-w-xl flex-wrap gap-2.5">
              {SERVICES.map((s, i) => (
                <li
                  key={s}
                  className={`border-2 border-black px-3 py-1.5 font-sans text-sm font-black uppercase shadow-[3px_3px_0_#d42222] ${
                    i % 2 ? "-rotate-1 bg-white text-black" : "rotate-1 bg-black text-white"
                  }`}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="inline-flex min-h-[48px] items-center border-2 border-black bg-white px-5 font-sans text-sm font-black uppercase tracking-wider text-black shadow-[5px_5px_0_#d42222] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Discuss a project →
            </a>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center border-2 border-white/80 px-5 font-sans text-sm font-black uppercase tracking-wider text-white hover:bg-white/10"
            >
              LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <Reveal className="relative mx-auto w-full max-w-[380px] self-start lg:mt-[34vh]">
          <div style={{ transform: "translateY(calc((1 - var(--pe)) * 120px)) rotate(calc((1 - var(--pe)) * 10deg))" }}>
          <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rotate-[4deg] border-[3px] border-black bg-blood" />
          <figure className="relative -rotate-[3deg] border-[3px] border-black bg-white p-3 shadow-[10px_10px_0_#000]">
            <div className="relative aspect-square overflow-hidden border-2 border-black bg-[#d9d9d9] bg-[radial-gradient(rgba(0,0,0,0.18)_1px,transparent_1px)] [background-size:6px_6px]">
              <Image
                src="/logo.gif"
                alt="Rahul's avatar: a black cat silhouette in a circle"
                fill
                unoptimized
                sizes="380px"
                className="object-contain p-6 [image-rendering:pixelated]"
              />
            </div>
            <figcaption className="mt-2 flex items-center justify-between font-mono text-[11px] font-bold uppercase text-black">
              <span>rahul.exe</span>
              <span>Chennai · IN</span>
            </figcaption>
          </figure>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Word({ text, by, dark, i }: { text: string; by?: boolean; dark?: boolean; i: number }) {
  // Each line slides in from the left a little later than the one above it.
  const t = `clamp(0, (var(--pe) - ${0.12 * i}) * 2, 1)`;
  return (
    <span
      className="flex items-center gap-3"
      aria-hidden
      style={{ transform: `translateX(calc((1 - ${t}) * -120%))`, opacity: t }}
    >
      <span
        className={`border-[3px] px-4 py-1 font-sans text-[clamp(2rem,4.4vw,3.4rem)] font-black leading-none shadow-[5px_5px_0_#d42222] ${
          dark ? "border-white bg-black text-white" : "-rotate-1 border-black bg-white text-black"
        }`}
      >
        {text}
      </span>
      {by ? (
        <span className="rotate-2 border-2 border-black bg-blood px-2.5 py-0.5 font-serif text-[clamp(1.4rem,2.6vw,2rem)] font-extrabold italic leading-none text-white">
          by
        </span>
      ) : null}
    </span>
  );
}
