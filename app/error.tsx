"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center bg-cream-50 px-6 text-center text-ink-950">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/45">
        Error · 500
      </span>
      <h1 className="display mt-6 text-[18vw] tracking-tightest md:text-[10vw]">
        something <span className="text-red">cracked.</span>
      </h1>
      <p className="mt-6 max-w-md text-ink-950/65">
        A frame glitched on its way to the screen. Try again, or head back
        home — both routes are smooth.
      </p>
      <div className="mt-10 flex items-center gap-4">
        <button
          onClick={reset}
          className="rounded-full bg-ink-950 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream-50 transition hover:bg-red"
        >
          Try again
        </button>
        <a
          href="/"
          className="hover-line font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/70"
        >
          Back to home ↗
        </a>
      </div>
    </div>
  );
}
