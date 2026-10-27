import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-paper px-4 text-center text-ink">
      <p className="label">[ Error // 404 ]</p>
      <h1 className="mt-5 border-3 border-ink bg-sun px-4 py-2 font-display text-[clamp(2.5rem,9vw,5rem)] uppercase leading-none shadow-brut-lg">
        Page not found
      </h1>
      <p className="mt-6 max-w-md text-lg text-ink-soft">
        That page doesn&apos;t exist or has moved. The homepage has everything: work, services and contact.
      </p>
      <Link href="/" className="btn btn-dark mt-8">
        Back to homepage
      </Link>
    </main>
  );
}
