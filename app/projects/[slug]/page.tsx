import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LoopVideo from "@/components/LoopVideo";
import { ACCENT_BG, PROJECTS } from "@/lib/projects";
import { SITE } from "@/lib/site";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const p = PROJECTS.find((x) => x.slug === params.slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${p.tag} by Rahul`,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.title} — ${p.tag} by Rahul`, description: p.summary, url: `/projects/${p.slug}`, images: [p.image] },
  };
}

export default function ProjectPage({ params }: Props) {
  const i = PROJECTS.findIndex((x) => x.slug === params.slug);
  if (i < 0) notFound();
  const p = PROJECTS[i];
  const next = PROJECTS[(i + 1) % PROJECTS.length];

  return (
    <main id="main" className="min-h-screen bg-grape bg-grid-purple pb-20 text-black">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <Link
          href="/#work"
          className="inline-flex min-h-[44px] items-center gap-2 border-[3px] border-black bg-white px-4 font-mono text-xs font-bold uppercase shadow-[3px_3px_0_#000]"
        >
          ← All projects
        </Link>

        <p className="mt-8 font-mono text-xs font-bold text-black/70">{`// PROJECT_${String(i + 1).padStart(2, "0")}`}</p>
        <h1 className="mt-2 inline-block max-w-full break-words border-[4px] border-black bg-white px-3 py-2 font-mega text-[clamp(1.2rem,5vw,3.4rem)] sm:px-4 font-black uppercase leading-none shadow-[8px_8px_0_#000]">
          {p.title}
        </h1>
        <p className={`ml-3 inline-block -rotate-2 border-2 border-black px-2 py-1 font-mono text-xs font-bold uppercase ${ACCENT_BG[p.accent]}`}>{p.tag}</p>

        <div className="mt-8 border-[4px] border-black bg-black shadow-[8px_8px_0_#000]">
          <div className="relative aspect-video">
            {p.video ? (
              <LoopVideo
                src={p.video}
                poster={p.image}
                speed={p.videoSpeed}
                controls
                label={`${p.title} demo video`}
                className="absolute inset-0 h-full w-full object-contain"
              />
            ) : (
              <Image src={p.image} alt={p.imageAlt} fill priority sizes="(min-width: 1024px) 1000px, 100vw" className="object-contain" />
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section aria-labelledby="about" className="border-[3px] border-black bg-[#fbf8f1] bg-grid-card p-6 shadow-[6px_6px_0_#000]">
            <h2 id="about" className="font-mega text-sm font-black uppercase">About this project</h2>
            <p className="mt-3 font-mono text-[14px] leading-[1.75] text-black/85">{p.summary}</p>
            <h2 className="mt-6 font-mega text-sm font-black uppercase">Highlights</h2>
            <ul className="mt-3 space-y-1.5 font-mono text-[13px] text-black/85">
              {p.highlights.map((h) => (
                <li key={h}>✓ {h}</li>
              ))}
            </ul>
          </section>

          <aside className="border-[3px] border-black bg-white p-6 shadow-[6px_6px_0_#000]">
            <h2 className="font-mega text-sm font-black uppercase">Built with</h2>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Technologies used">
              {p.stack.map((s) => (
                <li key={s} className="border-2 border-black bg-sun px-2 py-1 font-mono text-xs font-bold">
                  {s}
                </li>
              ))}
            </ul>
            {p.demo ? (
              <a
                href={p.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 flex min-h-[48px] items-center justify-center border-[3px] border-black font-mega text-xs font-black uppercase shadow-[4px_4px_0_#000] ${ACCENT_BG[p.accent]}`}
              >
                Visit live site ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}
            <a
              href={`mailto:${SITE.email}?subject=${encodeURIComponent(`A project like ${p.title}`)}`}
              className="mt-3 flex min-h-[48px] items-center justify-center border-[3px] border-black bg-white font-mega text-xs font-black uppercase shadow-[4px_4px_0_#000]"
            >
              Want something similar?
            </a>
          </aside>
        </div>

        <nav aria-label="More projects" className="mt-12 flex flex-wrap justify-between gap-3">
          <Link href="/#work" className="inline-flex min-h-[44px] items-center border-[3px] border-black bg-white px-4 font-mono text-xs font-bold uppercase shadow-[3px_3px_0_#000]">
            ← Back to portfolio
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="inline-flex min-h-[44px] items-center border-[3px] border-black bg-sun px-4 font-mono text-xs font-bold uppercase shadow-[3px_3px_0_#000]"
          >
            Next: {next.title} →
          </Link>
        </nav>
      </div>
    </main>
  );
}
