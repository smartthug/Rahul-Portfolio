"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  /** Email shown as a direct fallback below the form. */
  fallbackEmail?: string;
}

type Errors = Partial<Record<"name" | "email" | "message" | "form", string>>;
type Status = "idle" | "sending" | "success" | "error";

export default function ContactDialog({
  open,
  onClose,
  fallbackEmail = "rahuldeva5555@gmail.com",
}: ContactDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll + close on ESC while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = (window as unknown as { __lenis?: { stop: () => void } })
      .__lenis;
    lenis?.stop();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    // Move focus into the dialog for keyboard users.
    const t = setTimeout(() => firstFieldRef.current?.focus(), 80);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      const lenis2 = (window as unknown as { __lenis?: { start: () => void } })
        .__lenis;
      lenis2?.start();
      clearTimeout(t);
    };
  }, [open, onClose]);

  // Reset form 600ms after closing so the swap is invisible.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      if (status === "success" || status === "error") {
        setName("");
        setEmail("");
        setMessage("");
        setCompany("");
        setErrors({});
        setStatus("idle");
      }
    }, 600);
    return () => clearTimeout(t);
  }, [open, status]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setErrors({});
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });

      const data = await res.json().catch(() => ({}) as Record<string, unknown>);

      if (res.ok) {
        setStatus("success");
        return;
      }

      const fieldErrors = (data?.errors as Errors) ?? {};
      setErrors({
        ...fieldErrors,
        form:
          (data?.error as string) ??
          "Something went wrong. Try again or mail me directly.",
      });
      setStatus("error");
    } catch {
      setErrors({
        form:
          "Network error — please try again, or mail me directly at " +
          fallbackEmail,
      });
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="contact-dialog"
          className="fixed inset-0 z-[120] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.7, 0, 0.2, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-title"
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close contact form"
            onClick={onClose}
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-cursor="hover"
            data-cursor-label="Close"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: 32, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.42, ease: [0.7, 0, 0.2, 1] }}
            className="relative z-10 mx-4 my-8 w-full max-w-xl overflow-hidden rounded-2xl border border-ink-950/15 bg-cream-50 shadow-[0_30px_80px_-20px_rgba(13,13,13,0.55)] sm:mx-6"
          >
            <header className="flex items-start justify-between gap-4 border-b border-ink-950/10 px-6 py-5 md:px-8">
              <div>
                <p className="mono-eyebrow text-ink-950/55">/ Connect</p>
                <h2
                  id="contact-title"
                  className="display-tight mt-2 text-2xl text-ink-950 md:text-3xl"
                >
                  let&rsquo;s build something
                  <span className="text-red">.</span>
                </h2>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                data-cursor="hover"
                data-cursor-label="Close"
                className="-mr-2 -mt-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-950/70 transition hover:bg-ink-950 hover:text-cream-50"
              >
                <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
                  <path
                    d="M1 1 L11 11 M11 1 L1 11"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
            </header>

            <div className="px-6 pb-7 pt-6 md:px-8">
              {status === "success" ? (
                <SuccessState onClose={onClose} email={email} />
              ) : (
                <form onSubmit={submit} noValidate>
                  {/* Honeypot — hidden from real users + assistive tech */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                    }}
                  >
                    <label htmlFor="contact-company">Company (leave blank)</label>
                    <input
                      id="contact-company"
                      tabIndex={-1}
                      autoComplete="off"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  <Field
                    label="Your name"
                    htmlFor="contact-name"
                    error={errors.name}
                  >
                    <input
                      ref={firstFieldRef}
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={120}
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className={inputCls(errors.name)}
                    />
                  </Field>

                  <Field
                    label="Email"
                    htmlFor="contact-email"
                    error={errors.email}
                  >
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      maxLength={200}
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className={inputCls(errors.email)}
                    />
                  </Field>

                  <Field
                    label="Message"
                    htmlFor="contact-message"
                    error={errors.message}
                  >
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      minLength={10}
                      maxLength={4000}
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell me a bit about the project, timeline and budget."
                      className={`${inputCls(errors.message)} resize-y`}
                    />
                  </Field>

                  {errors.form ? (
                    <p className="mt-2 rounded-md border border-red/30 bg-red/[0.06] px-3 py-2 text-sm text-red">
                      {errors.form}
                    </p>
                  ) : null}

                  <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <a
                      href={`mailto:${fallbackEmail}`}
                      data-cursor="hover"
                      className="hover-line text-center font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/60 sm:text-left"
                    >
                      or email me directly ↗
                    </a>

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      data-cursor="hover"
                      data-cursor-label={
                        status === "sending" ? "Sending" : "Send"
                      }
                      className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-ink-950 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-cream-50 transition hover:bg-red disabled:cursor-not-allowed disabled:opacity-60 sm:py-3"
                    >
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                          status === "sending"
                            ? "animate-pulse bg-cream-50"
                            : "bg-red shadow-[0_0_10px_rgba(235,89,57,0.9)] group-hover:bg-cream-50"
                        }`}
                      />
                      {status === "sending" ? "Sending…" : "Send message"}
                      <ArrowDR />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={htmlFor}
        className="mono-eyebrow mb-2 block text-ink-950/65"
      >
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-[12px] text-red">{error}</p> : null}
    </div>
  );
}

function inputCls(error?: string) {
  return [
    "w-full rounded-md border bg-cream-50 px-3.5 py-3 text-[15px] text-ink-950 outline-none transition placeholder:text-ink-950/35",
    error
      ? "border-red/60 focus:border-red"
      : "border-ink-950/15 hover:border-ink-950/30 focus:border-ink-950",
  ].join(" ");
}

function ArrowDR() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="transition-transform duration-500 group-hover:rotate-[-45deg]"
    >
      <path
        d="M2 10 L10 2 M4 2 H10 V8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

function SuccessState({
  email,
  onClose,
}: {
  email: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.7, 0, 0.2, 1] }}
      className="py-6 text-center"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-950 text-cream-50">
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
          <path
            d="M5 12 L10 17 L19 8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      <h3 className="display-tight mt-5 text-2xl text-ink-950">
        Message landed.
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink-950/70">
        Thanks — I&rsquo;ll get back to{" "}
        <span className="font-mono">{email || "you"}</span> within ~24 hours.
      </p>
      <button
        type="button"
        onClick={onClose}
        data-cursor="hover"
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink-950/15 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/80 transition hover:border-ink-950 hover:bg-ink-950 hover:text-cream-50"
      >
        Close
      </button>
    </motion.div>
  );
}
