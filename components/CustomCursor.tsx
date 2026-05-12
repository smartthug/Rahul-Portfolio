"use client";

import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "hover" | "view" | "drag" | "text";
type CursorSurface = "light" | "dark";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [surface, setSurface] = useState<CursorSurface>("light");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { x: target.x, y: target.y };
    const ringPos = { x: target.x, y: target.y };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) setVisible(true);
    };

    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest(
        "a, button, [data-cursor], input, textarea, select, [role='button']"
      ) as HTMLElement | null;
      if (interactive) {
        const cMode = interactive.dataset.cursor as CursorMode | undefined;
        const cLabel = interactive.dataset.cursorLabel || "";
        setMode(cMode || "hover");
        setLabel(cLabel);
      } else {
        setMode("default");
        setLabel("");
      }
      const surfaceEl = t.closest("[data-cursor-surface]") as HTMLElement | null;
      const s = (surfaceEl?.dataset.cursorSurface as CursorSurface | undefined) || "light";
      setSurface(s);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    let raf = 0;
    const tick = () => {
      dotPos.x += (target.x - dotPos.x) * 0.6;
      dotPos.y += (target.y - dotPos.y) * 0.6;
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [visible]);

  const ringSize =
    mode === "view"
      ? 120
      : mode === "drag"
      ? 96
      : mode === "hover"
      ? 64
      : mode === "text"
      ? 6
      : 36;

  const isDark = surface === "dark";

  const ringBg =
    mode === "view"
      ? "rgba(235,89,57,0.95)"
      : mode === "hover"
      ? isDark
        ? "rgba(246,241,232,0.12)"
        : "rgba(13,13,13,0.08)"
      : "transparent";

  const ringBorder =
    mode === "view"
      ? "transparent"
      : mode === "hover"
      ? isDark
        ? "rgba(246,241,232,0.65)"
        : "rgba(13,13,13,0.55)"
      : isDark
      ? "rgba(246,241,232,0.45)"
      : "rgba(13,13,13,0.35)";

  const labelColor =
    mode === "view"
      ? "#f6f1e8"
      : isDark
      ? "rgba(246,241,232,0.92)"
      : "rgba(13,13,13,0.85)";

  const ringBlend: "multiply" | "normal" | "screen" =
    mode === "view" ? "normal" : isDark ? "screen" : "multiply";

  const dotColor = isDark ? "#f6f1e8" : "#0d0d0d";
  const dotBlend: "multiply" | "screen" = isDark ? "screen" : "multiply";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease" }}
    >
      <div
        ref={ringRef}
        className="fixed left-0 top-0 rounded-full will-change-transform transition-[width,height,background-color,border-color] duration-300 ease-out"
        style={{
          width: ringSize,
          height: ringSize,
          background: ringBg,
          border: `1px solid ${ringBorder}`,
          mixBlendMode: ringBlend,
        }}
      >
        <span
          ref={labelRef}
          className="absolute inset-0 flex items-center justify-center text-[10px] font-mono uppercase tracking-[0.18em]"
          style={{
            color: labelColor,
            opacity: label ? 1 : 0,
            transition: "opacity 250ms ease",
          }}
        >
          {label}
        </span>
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 rounded-full will-change-transform"
        style={{
          width: mode === "view" ? 0 : 6,
          height: mode === "view" ? 0 : 6,
          background: dotColor,
          mixBlendMode: dotBlend,
          transition: "width 200ms ease, height 200ms ease, background-color 200ms ease",
        }}
      />
      <style jsx>{`
        .is-down {
          transform: translate(-50%, -50%) scale(0.85) !important;
        }
      `}</style>
    </div>
  );
}
