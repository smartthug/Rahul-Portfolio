"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Trigger = "hover" | "view" | "mount";

interface ScrambleTextProps {
  text: string;
  /** What kicks the animation off. */
  trigger?: Trigger;
  /** Total animation duration (ms). */
  duration?: number;
  /** How fast random characters cycle (ms per frame). */
  tick?: number;
  /** Characters pulled from while scrambling. */
  charset?: string;
  /** Optional delay before starting (mount / view triggers). */
  delay?: number;
  className?: string;
  /** Preserve case in the source string (scrambler defaults to uppercase). */
  preserveCase?: boolean;
  /** Wrap the rendered text in a specific tag. */
  as?: "span" | "div";
}

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>";

/**
 * Character-by-character text scramble — the "decode/encode" effect
 * used on premium developer portfolios. Lightweight, no GSAP dependency.
 */
export default function ScrambleText({
  text,
  trigger = "hover",
  duration = 700,
  tick = 32,
  charset = DEFAULT_CHARSET,
  delay = 0,
  className,
  preserveCase = true,
  as = "span",
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement | HTMLDivElement>(null);
  const [out, setOut] = useState(text);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const pool = useMemo(
    () => (preserveCase ? charset + charset.toLowerCase() : charset),
    [charset, preserveCase]
  );

  useEffect(() => {
    setOut(text);
  }, [text]);

  const stop = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startRef.current = null;
    setOut(text);
  };

  const run = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const chars = Array.from(text);
    const total = chars.length;
    startRef.current = null;
    let lastTick = 0;

    const frame = (t: number) => {
      if (startRef.current === null) startRef.current = t + delay;
      const elapsed = Math.max(0, t - startRef.current);
      const progress = Math.min(1, elapsed / duration);
      // How many characters are locked in to their final value.
      const locked = Math.floor(progress * total);

      if (t - lastTick >= tick) {
        lastTick = t;
        const next = chars
          .map((c, i) => {
            if (i < locked) return c;
            if (c === " " || c === "\u00a0" || c === "\n") return c;
            return pool[Math.floor(Math.random() * pool.length)];
          })
          .join("");
        setOut(next);
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setOut(text);
        rafRef.current = null;
        startRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  };

  // mount / view triggers
  useEffect(() => {
    if (trigger === "mount") {
      run();
      return () => stop();
    }
    if (trigger === "view") {
      const el = ref.current;
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            run();
            io.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      io.observe(el);
      return () => {
        io.disconnect();
        stop();
      };
    }
    return () => stop();
    // re-running on text change reseats the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger]);

  const hoverProps =
    trigger === "hover"
      ? {
          onPointerEnter: run,
          onFocus: run,
        }
      : {};

  const Tag = as;
  return (
    <Tag
      ref={ref as React.RefObject<HTMLSpanElement & HTMLDivElement>}
      className={className}
      data-scramble
      {...hoverProps}
    >
      {out}
    </Tag>
  );
}
