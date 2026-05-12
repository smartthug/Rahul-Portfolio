"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Marquee({
  items,
  reverse = false,
  variant = "light",
}: {
  items: string[];
  reverse?: boolean;
  variant?: "light" | "dark";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const track = trackRef.current;
    if (!track) return;

    const dir = reverse ? 1 : -1;
    const tween = gsap.to(track, {
      xPercent: dir * 50,
      duration: 42,
      ease: "none",
      repeat: -1,
    });

    const onScroll = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate(self) {
        const v = self.getVelocity() / -1200;
        gsap.to(tween, {
          timeScale: 1 + Math.min(Math.abs(v), 6),
          duration: 0.3,
          overwrite: true,
        });
        gsap.to(tween, {
          timeScale: 1,
          duration: 1.2,
          delay: 0.4,
          overwrite: false,
        });
      },
    });

    return () => {
      tween.kill();
      onScroll.kill();
    };
  }, [reverse]);

  const isLight = variant === "light";

  return (
    <div
      ref={wrapRef}
      className={`relative w-full overflow-hidden border-y py-7 md:py-9 ${
        isLight
          ? "border-ink-950/15 bg-cream-50 text-ink-950"
          : "border-cream-50/15 bg-ink-950 text-cream-50"
      }`}
    >
      <div
        ref={trackRef}
        className="flex w-max items-center gap-12 will-change-transform"
      >
        {[...items, ...items, ...items, ...items].map((label, i) => (
          <div
            key={`${label}-${i}`}
            className="flex items-center gap-12 whitespace-nowrap"
          >
            <span className="display text-[11vw] md:text-[7vw]">{label}</span>
            <span className="inline-block h-3 w-3 rounded-full bg-red shadow-[0_0_24px_rgba(235,89,57,0.65)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
