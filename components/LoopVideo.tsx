"use client";

import { useEffect, useRef } from "react";

/**
 * Silent, looping preview that plays while it is on screen and pauses when it
 * isn't (saves battery and data). With reduced motion it stays on the poster.
 * Decorative: the surrounding card already describes the project.
 */
export default function LoopVideo({
  src,
  poster,
  speed = 1,
  className = "",
  controls = false,
  label,
}: {
  src: string;
  poster: string;
  speed?: number;
  className?: string;
  controls?: boolean;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.playbackRate = speed;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && !controls) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [speed, controls]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      controls={controls}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      tabIndex={controls ? 0 : -1}
      className={className}
    />
  );
}
