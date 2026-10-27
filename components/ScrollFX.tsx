"use client";

import { useEffect } from "react";

/**
 * Drives scroll animations with two CSS custom properties on every
 * `[data-fx]` element, updated once per frame while scrolling:
 *
 *   --p  0 → 1 as the element travels from the bottom of the viewport to the top
 *   --e  0 → 1 as the element's top edge enters (viewport bottom → 35% from top)
 *
 * Styles read them with fallbacks (`var(--e, 1)`), so content is in its final
 * position without JavaScript. Transforms that use them are wrapped in
 * `motion-safe:` so reduced-motion users get a static page.
 */
export default function ScrollFX() {
  useEffect(() => {
    let els: HTMLElement[] = [];
    let raf = 0;

    const collect = () => {
      els = [...document.querySelectorAll<HTMLElement>("[data-fx]")];
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue;
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        const e = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.65)));
        el.style.setProperty("--p", p.toFixed(4));
        el.style.setProperty("--e", e.toFixed(4));
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    collect();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const mo = new MutationObserver(() => {
      collect();
      schedule();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
