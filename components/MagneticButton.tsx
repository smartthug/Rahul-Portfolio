"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  variant?: "default" | "ghost";
  className?: string;
};

export default function MagneticButton({
  href,
  onClick,
  children,
  ariaLabel,
  variant = "default",
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const target = targetRef.current;
    if (!wrap || !target) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const setX = gsap.quickTo(target, "x", { duration: 0.7, ease: "expo.out" });
    const setY = gsap.quickTo(target, "y", { duration: 0.7, ease: "expo.out" });

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setX(x * 0.35);
      setY(y * 0.35);
    };
    const onLeave = () => {
      setX(0);
      setY(0);
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const cls =
    variant === "ghost"
      ? "group inline-flex w-full items-center justify-between gap-4 rounded-full border border-ink-950/20 px-5 py-4 text-ink-950 transition-colors hover:border-red hover:text-red sm:w-auto sm:px-7 sm:py-5"
      : "group inline-flex w-full items-center justify-between gap-4 rounded-full bg-ink-950 px-5 py-4 text-cream-50 transition-colors hover:bg-red sm:w-auto sm:px-7 sm:py-5";

  const inner = (
    <span className="flex w-full items-center justify-between gap-3 sm:gap-6">
      <span className="display-tight break-all text-xl tracking-tight sm:text-3xl md:text-5xl">
        {children}
      </span>
    </span>
  );

  return (
    <div ref={wrapRef} className={`block w-full sm:inline-block sm:w-auto ${className}`}>
      {href ? (
        <a
          ref={targetRef as React.RefObject<HTMLAnchorElement>}
          href={href}
          aria-label={ariaLabel}
          data-cursor="hover"
          className={cls}
        >
          {inner}
        </a>
      ) : (
        <button
          ref={targetRef as React.RefObject<HTMLButtonElement>}
          onClick={onClick}
          aria-label={ariaLabel}
          data-cursor="hover"
          className={cls}
        >
          {inner}
        </button>
      )}
    </div>
  );
}
