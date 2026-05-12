"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum rotation on each axis (degrees). Default 6. */
  max?: number;
  /** CSS perspective in px. Default 1100. */
  perspective?: number;
  /** Lerp factor (0..1) — lower = smoother / slower. Default 0.12. */
  lerp?: number;
  /** Optional accent shine that follows the cursor. */
  glare?: boolean;
  children?: React.ReactNode;
}

/**
 * Subtle 3D tilt on cursor move. Uses RAF-lerped state directly on the DOM
 * so it never triggers React re-renders. Auto-disables for touch input
 * and honours `prefers-reduced-motion`.
 */
const TiltCard = forwardRef<HTMLDivElement, TiltCardProps>(function TiltCard(
  {
    max = 6,
    perspective = 1100,
    lerp = 0.12,
    glare = true,
    style,
    children,
    ...rest
  },
  outerRef
) {
  const innerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(outerRef, () => innerRef.current as HTMLDivElement);

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const mouse = useRef({ mx: 50, my: 50 });
  const raf = useRef<number | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * lerp;
      current.current.y += (target.current.y - current.current.y) * lerp;

      const rx = -current.current.y * max;
      const ry = current.current.x * max;
      el.style.transform = `perspective(${perspective}px) rotateX(${rx.toFixed(
        2
      )}deg) rotateY(${ry.toFixed(2)}deg)`;

      if (glare) {
        el.style.setProperty("--mx", `${mouse.current.mx}%`);
        el.style.setProperty("--my", `${mouse.current.my}%`);
      }

      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001 || activeRef.current) {
        raf.current = requestAnimationFrame(tick);
      } else {
        raf.current = null;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      target.current.x = (nx - 0.5) * 2; // -1..1
      target.current.y = (ny - 0.5) * 2;
      mouse.current.mx = nx * 100;
      mouse.current.my = ny * 100;
      activeRef.current = true;
      if (raf.current === null) raf.current = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
      mouse.current.mx = 50;
      mouse.current.my = 50;
      activeRef.current = false;
      if (raf.current === null) raf.current = requestAnimationFrame(tick);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointercancel", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointercancel", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [lerp, max, perspective, glare]);

  return (
    <div
      ref={innerRef}
      {...rest}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
      {glare ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.18), transparent 60%)",
            mixBlendMode: "soft-light",
          }}
        />
      ) : null}
    </div>
  );
});

export default TiltCard;
