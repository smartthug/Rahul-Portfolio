import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center bg-cream-50 px-6 text-center text-ink-950">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/45">
        Error · 404
      </span>
      <h1 className="display mt-6 text-[18vw] tracking-tightest md:text-[10vw]">
        lost in <span className="text-red">orbit.</span>
      </h1>
      <p className="mt-6 max-w-md text-ink-950/65">
        That page drifted somewhere we can&apos;t reach. Let&apos;s get you
        back to the launch pad.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-ink-950 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream-50 transition hover:bg-red"
      >
        Return home ↗
      </Link>
    </div>
  );
}
