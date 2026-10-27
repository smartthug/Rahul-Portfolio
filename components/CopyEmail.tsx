"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

/** Email as a mailto link plus a copy button — many clients prefer copying. */
export default function CopyEmail({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${className}`}>
      <a href={`mailto:${SITE.email}`} className="link inline-flex min-h-[44px] items-center break-all text-base">
        {SITE.email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-[44px] items-center border-2 border-ink bg-paper px-2.5 font-mono text-xs font-bold uppercase tracking-[0.08em] shadow-brut-sm transition-transform hover:bg-sun active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
