import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "rahuldeva5555@gmail.com";
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
// Always-works fallback sender on Resend (no domain verification required).
const FALLBACK_FROM = "Portfolio <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Very simple per-IP rate limit. Persists for the life of the serverless instance.
const HITS = new Map<string, { count: number; reset: number }>();
const MAX_PER_WINDOW = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = HITS.get(ip);
  if (!entry || entry.reset < now) {
    HITS.set(ip, { count: 1, reset: now + WINDOW_MS });
    return { ok: true, remaining: MAX_PER_WINDOW - 1 };
  }
  if (entry.count >= MAX_PER_WINDOW) {
    return { ok: false, remaining: 0, retryIn: Math.max(0, entry.reset - now) };
  }
  entry.count += 1;
  return { ok: true, remaining: MAX_PER_WINDOW - entry.count };
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, message, company } = (body ?? {}) as Record<
    string,
    unknown
  >;

  // Honeypot — bots love filling every input. Real users never see this field.
  if (typeof company === "string" && company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const errors: Record<string, string> = {};
  if (typeof name !== "string" || name.trim().length < 2) {
    errors.name = "Please enter your name.";
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    errors.email = "Please enter a valid email.";
  }
  if (typeof message !== "string" || message.trim().length < 10) {
    errors.message = "Tell me a bit more (min 10 characters).";
  }
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", errors }, { status: 422 });
  }

  // Trust common edge proxies; fall back to a per-instance bucket.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: "Too many messages — please try again later.",
        retryIn: rl.retryIn,
      },
      { status: 429 }
    );
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json(
      {
        error:
          "Email service isn't configured yet. Please mail me directly at " +
          TO_EMAIL,
        fallback: TO_EMAIL,
      },
      { status: 503 }
    );
  }

  const cleanName = (name as string).trim().slice(0, 120);
  const cleanEmail = (email as string).trim().slice(0, 200);
  const cleanMessage = (message as string).trim().slice(0, 4000);

  const subject = `New portfolio enquiry — ${cleanName}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#0d0d0d; line-height:1.55;">
      <h2 style="margin:0 0 12px; font-size:18px;">New message from your portfolio</h2>
      <table style="border-collapse:collapse; margin: 6px 0 14px;">
        <tr><td style="padding:4px 10px 4px 0; color:#555;">Name</td><td style="padding:4px 0;"><strong>${escape(cleanName)}</strong></td></tr>
        <tr><td style="padding:4px 10px 4px 0; color:#555;">Email</td><td style="padding:4px 0;"><a href="mailto:${escape(cleanEmail)}">${escape(cleanEmail)}</a></td></tr>
      </table>
      <p style="white-space:pre-wrap; margin:0; padding:14px 16px; border-left:3px solid #eb5939; background:#f6f1e8; border-radius:6px;">${escape(cleanMessage)}</p>
      <p style="margin:18px 0 0; font-size:12px; color:#888;">— sent from rahul.dev portfolio · reply to land directly in their inbox.</p>
    </div>
  `;

  const text =
    `New message from your portfolio\n\n` +
    `Name:  ${cleanName}\n` +
    `Email: ${cleanEmail}\n\n` +
    `${cleanMessage}\n`;

  const send = (from: string) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [TO_EMAIL],
        reply_to: [cleanEmail],
        subject,
        html,
        text,
      }),
      // Resend is fast but we don't want serverless cold-start to hang.
      signal: AbortSignal.timeout(10_000),
    });

  try {
    let res = await send(FROM_EMAIL);

    // Resend rejects unverified custom domains with 403 + "validation_error".
    // Transparently retry with the always-allowed onboarding sender so the
    // form keeps working while a domain is still being set up.
    if (res.status === 403 && FROM_EMAIL !== FALLBACK_FROM) {
      const peek = await res.clone().text().catch(() => "");
      if (/not verified|verify your domain|validation_error/i.test(peek)) {
        console.warn(
          `[contact] CONTACT_FROM_EMAIL "${FROM_EMAIL}" rejected by Resend ` +
            `(domain not verified). Falling back to "${FALLBACK_FROM}".`
        );
        res = await send(FALLBACK_FROM);
      }
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[contact] resend error", res.status, detail);

      // Sandbox mode: Resend only delivers to the account email until a
      // domain is verified. Tell the dev exactly what to do.
      if (
        res.status === 403 &&
        /testing emails to your own email address|verify a domain/i.test(detail)
      ) {
        const m = detail.match(/your own email address \(([^)]+)\)/i);
        const acctEmail = m?.[1];
        console.error(
          "[contact] Resend is in sandbox mode. Either:\n" +
            `  • set CONTACT_TO_EMAIL=${acctEmail ?? "your-resend-account-email"} in .env.local, or\n` +
            "  • verify a domain at https://resend.com/domains and set\n" +
            '    CONTACT_FROM_EMAIL="Name <hi@yourdomain.com>".'
        );
      }

      return NextResponse.json(
        {
          error:
            "Couldn't send the message right now. Please try again or mail me at " +
            TO_EMAIL,
          fallback: TO_EMAIL,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] network error", err);
    return NextResponse.json(
      {
        error:
          "Network error sending the message. Please try again or mail me at " +
          TO_EMAIL,
        fallback: TO_EMAIL,
      },
      { status: 502 }
    );
  }
}
