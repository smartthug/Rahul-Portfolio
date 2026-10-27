"use client";

import { useRef, useState } from "react";
import { SITE } from "@/lib/site";

export const PROJECT_TYPES = [
  "Business / company website",
  "Landing page",
  "Portfolio website",
  "Website redesign",
  "React / Next.js front-end",
  "AI feature or web app",
  "Something else",
] as const;

type Field = "name" | "email" | "projectType" | "message";
type Errors = Partial<Record<Field | "form", string>>;
type Status = "idle" | "sending" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(d: Record<string, string>): Errors {
  const e: Errors = {};
  if ((d.name ?? "").trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test((d.email ?? "").trim())) e.email = "Please enter a valid email so I can reply.";
  if (!d.projectType) e.projectType = "Pick the closest option.";
  if ((d.message ?? "").trim().length < 20) e.message = "A couple of sentences helps (20+ characters).";
  return e;
}

/**
 * Enquiry form in the sketch-paper style. `getDrawing` returns the visitor's
 * background doodle as a JPEG data URL (or null) when they opt in to sending it.
 */
export default function ContactForm({ getDrawing }: { getDrawing?: () => string | null }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [sentTo, setSentTo] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;

    const clientErrors = validate(data);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      const first = Object.keys(clientErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const drawing = data.attachDrawing ? getDrawing?.() ?? null : null;
    delete data.attachDrawing;

    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, drawing }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; errors?: Errors };
      if (res.ok) {
        setSentTo(data.email.trim());
        setStatus("success");
        return;
      }
      setErrors({ ...(body.errors ?? {}), form: body.error ?? "Something went wrong sending your message." });
      setStatus("error");
    } catch {
      setErrors({ form: "Network error — your message wasn't sent." });
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="py-8 text-center">
        <p aria-hidden className="font-hand text-6xl font-bold">✓</p>
        <h3 className="mt-2 font-hand text-4xl font-bold">Message sent!</h3>
        <p className="mx-auto mt-3 max-w-sm font-sketch text-base text-black/75">
          Thanks! I&rsquo;ll reply to <strong className="break-all text-black">{sentTo}</strong>, usually within 24
          hours. Check your spam folder if you don&rsquo;t see it.
        </p>
        <button
          type="button"
          className="mt-6 min-h-[48px] border-2 border-black bg-white px-5 font-sketch text-lg shadow-[3px_3px_0_#111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          onClick={() => {
            formRef.current?.reset();
            setStatus("idle");
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="space-y-5">
      {/* Honeypot — hidden from people and assistive tech; bots fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="cf-company">Company (leave blank)</label>
        <input id="cf-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <TextField id="cf-name" name="name" label="your name:" placeholder="e.g. Priya from Café Mylapore" autoComplete="name" error={errors.name} maxLength={120} />
      <TextField id="cf-email" name="email" type="email" label="email address:" placeholder="e.g. hello@yourbusiness.in" autoComplete="email" error={errors.email} maxLength={200} />

      <div>
        <Label htmlFor="cf-type">what do you need?</Label>
        <select
          id="cf-type"
          name="projectType"
          defaultValue=""
          aria-invalid={!!errors.projectType}
          aria-describedby={errors.projectType ? "cf-type-err" : undefined}
          className={inputCls(errors.projectType)}
        >
          <option value="" disabled>
            choose one…
          </option>
          {PROJECT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <ErrorText id="cf-type-err" error={errors.projectType} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="cf-budget" name="budget" label="budget" optional placeholder="e.g. ₹15k–25k" maxLength={80} />
        <TextField id="cf-timeline" name="timeline" label="timeline" optional placeholder="e.g. 3 weeks" maxLength={80} />
      </div>

      <div>
        <Label htmlFor="cf-message">write your message:</Label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          maxLength={4000}
          aria-invalid={!!errors.message}
          aria-describedby={`cf-message-hint${errors.message ? " cf-message-err" : ""}`}
          placeholder="what does your business do, what should the site achieve, any sites you like?"
          className={`${inputCls(errors.message)} resize-y`}
        />
        <p id="cf-message-hint" className="mt-1 font-sketch text-sm text-black/60">
          Links to your current site or sites you like help a lot.
        </p>
        <ErrorText id="cf-message-err" error={errors.message} />
      </div>

      <label className="flex min-h-[44px] cursor-pointer items-center gap-3 font-sketch text-base">
        <input type="checkbox" name="attachDrawing" value="1" className="h-5 w-5 accent-black" />
        Add my background drawing to the email! <span aria-hidden>🎨</span>
      </label>

      {errors.form ? (
        <div role="alert" className="border-2 border-dashed border-[#b42318] bg-[#fff1ee] p-3 font-sketch text-base">
          <p className="font-bold text-[#b42318]">
            {errors.form.includes(SITE.email) ? "Sorry — your message couldn't be sent." : errors.form}
          </p>
          <p className="mt-1">
            You can email me directly at{" "}
            <a className="font-bold underline decoration-2 underline-offset-2" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            .
          </p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex min-h-[56px] w-full items-center justify-center gap-2 bg-[#1c1c1c] font-hand text-2xl font-bold text-white shadow-[3px_3px_0_#888] [clip-path:polygon(0_3%,100%_0,99.5%_97%,0.5%_100%)] hover:bg-black disabled:cursor-wait disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Send message"}
        <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 11 21 3l-6 18-3-8-9-2Z" strokeLinejoin="round" />
        </svg>
      </button>
      <p className="text-center font-sketch text-sm text-black/60">Your details are only used to reply to you.</p>
    </form>
  );
}

function inputCls(error?: string) {
  return `block w-full min-h-[48px] border-2 border-dashed bg-white/70 px-3 py-2.5 font-mono text-[15px] text-black placeholder:text-black/40 focus:border-solid focus:bg-white ${
    error ? "border-[#b42318]" : "border-black/45"
  }`;
}

function Label({ htmlFor, children, optional }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-sketch text-[17px] font-bold text-black">
      {children}
      {optional ? <span className="font-normal text-black/55"> (optional)</span> : <span aria-hidden> *</span>}
    </label>
  );
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  return error ? (
    <p id={id} className="mt-1 font-sketch text-base font-bold text-[#b42318]">
      {error}
    </p>
  ) : null;
}

function TextField({
  id,
  name,
  label,
  type = "text",
  error,
  optional,
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  error?: string;
  optional?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <input
        id={id}
        name={name}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={inputCls(error)}
        {...rest}
      />
      <ErrorText id={`${id}-err`} error={error} />
    </div>
  );
}
