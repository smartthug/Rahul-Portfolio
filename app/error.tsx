"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/site";

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
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-paper px-4 text-center text-ink">
      <p className="label">[ Error // 500 ]</p>
      <h1 className="mt-5 border-3 border-ink bg-coral px-4 py-2 font-display text-[clamp(2.5rem,9vw,5rem)] uppercase leading-none shadow-brut-lg">
        Something broke
      </h1>
      <p className="mt-6 max-w-md text-lg text-ink-soft">
        Try again, or email me at{" "}
        <a className="link" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-dark">
          Try again
        </button>
        <a href="/" className="btn btn-light">
          Back to homepage
        </a>
      </div>
    </main>
  );
}
