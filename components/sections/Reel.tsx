"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Reel() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const PLAYBACK_RATE = 1.5;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const width = useTransform(
    scrollYProgress,
    [0.05, 0.45],
    isDesktop ? ["60%", "100%"] : ["92%", "100%"]
  );
  const height = useTransform(
    scrollYProgress,
    [0.05, 0.45],
    isDesktop ? ["55vh", "92vh"] : ["50vh", "72vh"]
  );
  const radius = useTransform(scrollYProgress, [0.05, 0.45], [24, 0]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1]);

  // Pause when the panel is fully off-screen, resume when visible — saves CPU on long pages.
  useEffect(() => {
    const v = videoRef.current;
    const w = wrapRef.current;
    if (!v || !w) return;

    const applyRate = () => {
      v.playbackRate = PLAYBACK_RATE;
    };
    applyRate();
    v.addEventListener("loadedmetadata", applyRate);
    v.addEventListener("play", applyRate);
    v.addEventListener("ratechange", () => {
      // Re-assert if the browser resets it (Safari quirk)
      if (Math.abs(v.playbackRate - PLAYBACK_RATE) > 0.01) {
        v.playbackRate = PLAYBACK_RATE;
      }
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && playing) {
          v.play().catch(() => {
            /* autoplay blocked — keep state in sync */
            setPlaying(false);
          });
        } else {
          v.pause();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(w);
    return () => {
      io.disconnect();
      v.removeEventListener("loadedmetadata", applyRate);
      v.removeEventListener("play", applyRate);
    };
  }, [playing]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-reel-title]",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section
      ref={ref}
      id="reel"
      className="relative isolate w-full bg-cream-50 py-24 md:py-28"
    >
      <div className="mx-auto max-w-[1700px] px-4 sm:px-6 md:px-10">
        <div className="mb-8 flex flex-col gap-2 border-t border-ink-950/15 pt-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-0">
          <span className="mono-eyebrow">/ 06 · Featured project</span>
          <span className="mono-eyebrow text-ink-950/45">
            DocRAG · PDF Intelligence Engine
          </span>
        </div>

        <div className="mb-10 overflow-hidden sm:mb-12">
          <h2
            data-reel-title
            className="display text-[20vw] tracking-tightest sm:text-[18vw] md:text-[10vw]"
          >
            <span>doc</span>
            <span className="text-stroke">rag</span>
            <span className="text-red">.</span>
          </h2>
        </div>
      </div>

      <div className="flex justify-center">
        <motion.div
          ref={wrapRef}
          style={{ width, height, borderRadius: radius }}
          className="relative overflow-hidden bg-ink-950"
          data-cursor="view"
          data-cursor-label={playing ? "Pause" : "Play"}
          data-cursor-surface="dark"
        >
          {/* Video layer with scroll-driven zoom */}
          <motion.div
            style={{ scale: imgScale }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              src="/docrag.mp4"
              poster="/projects/docrag.png"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/25 via-transparent to-ink-950/70" />
            <div
              className="pointer-events-none absolute inset-0 mix-blend-overlay"
              style={{
                background:
                  "radial-gradient(60% 50% at 50% 50%, rgba(158,240,26,0.22), transparent 70%)",
              }}
            />
          </motion.div>

          {/* Big play / pause button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause video" : "Play video"}
            aria-pressed={playing}
            data-cursor="hover"
            data-cursor-label={playing ? "Pause" : "Play"}
            className="group absolute inset-0 flex items-center justify-center"
          >
            <span
              className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-opacity duration-300 sm:h-28 sm:w-28 md:h-36 md:w-36 ${
                playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
              }`}
            >
              <span className="absolute inset-0 rounded-full border border-cream-50/40 backdrop-blur-sm" />
              <span className="absolute inset-2 animate-spinSlow rounded-full">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <defs>
                    <path
                      id="reelCirc"
                      d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                    />
                  </defs>
                  <text className="fill-cream-50/85 font-mono text-[6.2px] uppercase tracking-[0.4em]">
                    <textPath href="#reelCirc">
                      {playing
                        ? "pause · docrag · live · pause · docrag · live ·"
                        : "play · docrag · 2026 · play · docrag · 2026 ·"}
                    </textPath>
                  </text>
                </svg>
              </span>
              {playing ? (
                <svg
                  width="22"
                  height="24"
                  viewBox="0 0 22 24"
                  className="relative text-cream-50 transition-transform duration-500 group-hover:scale-110"
                  fill="currentColor"
                >
                  <rect x="2" y="2" width="6" height="20" rx="1" />
                  <rect x="14" y="2" width="6" height="20" rx="1" />
                </svg>
              ) : (
                <svg
                  width="22"
                  height="26"
                  viewBox="0 0 22 26"
                  className="relative translate-x-[2px] text-cream-50 transition-transform duration-500 group-hover:scale-110"
                  fill="currentColor"
                >
                  <path d="M0 0L22 13L0 26V0Z" />
                </svg>
              )}
            </span>
          </button>

          {/* Mute toggle (top-right) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            aria-label={muted ? "Unmute video" : "Mute video"}
            aria-pressed={!muted}
            data-cursor="hover"
            className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-cream-50/30 bg-ink-950/55 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-cream-50/90 backdrop-blur-md transition-colors hover:border-red hover:text-red sm:right-6 sm:top-6"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                muted ? "bg-cream-50/40" : "bg-red shadow-[0_0_10px_rgba(235,89,57,0.8)]"
              }`}
            />
            {muted ? "Sound off" : "Sound on"}
          </button>

          {/* Bottom caption */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-cream-50 sm:p-6 md:p-10">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-cream-50/70 sm:text-[10px] sm:tracking-[0.3em]">
                Next.js · Groq · Pinecone · LangChain · 2026
              </p>
              <p className="display-tight mt-2 max-w-2xl text-lg leading-tight sm:text-2xl md:text-4xl">
                Chat with any PDF — strict context-only, source-attributed.
              </p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  playing
                    ? "bg-red shadow-[0_0_10px_rgba(235,89,57,0.9)] animate-pulse"
                    : "bg-cream-50/40"
                }`}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream-50/70">
                {playing ? "Live · v1" : "Paused"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
