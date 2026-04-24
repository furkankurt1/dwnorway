import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const MAX_LENGTHS = {
  name: 100,
  email: 200,
  country: 100,
  phone: 30,
  message: 2000,
} as const;

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;

function sanitizeLine(value: string): string {
  return value.replace(/[\r\n\t\0]+/g, " ").trim();
}

function sanitizeMultiline(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/[\0\x08\x0b\x0c\x0e-\x1f]/g, "").trim();
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      }
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function checkRateLimit(
  kv: KVNamespace | undefined,
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  if (!kv) return { allowed: true, remaining: RATE_LIMIT_MAX };
  const key = `contact:${ip}`;
  const raw = await kv.get(key);
  const count = raw ? parseInt(raw, 10) : 0;
  if (count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }
  await kv.put(key, String(count + 1), {
    expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
  });
  return { allowed: true, remaining: RATE_LIMIT_MAX - count - 1 };
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  let env: CloudflareEnv | undefined;
  try {
    env = getCloudflareContext().env as unknown as CloudflareEnv;
  } catch {
    env = undefined;
  }
  const kv = (env as unknown as { CONTACT_RATE_LIMIT?: KVNamespace })
    ?.CONTACT_RATE_LIMIT;

  const rl = await checkRateLimit(kv, ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(RATE_LIMIT_WINDOW_SECONDS) } }
    );
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ error: "invalid_content_type" }, { status: 415 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const honeypot = typeof body.website === "string" ? body.website : "";
  if (honeypot.length > 0) {
    return NextResponse.json({ success: true });
  }

  const turnstileToken =
    typeof body["cf-turnstile-response"] === "string"
      ? (body["cf-turnstile-response"] as string)
      : "";
  const turnstileOk = await verifyTurnstile(turnstileToken, ip);
  if (!turnstileOk) {
    return NextResponse.json({ error: "turnstile_failed" }, { status: 403 });
  }

  const name = typeof body.name === "string" ? body.name : "";
  const email = typeof body.email === "string" ? body.email : "";
  const country = typeof body.country === "string" ? body.country : "";
  const phone = typeof body.phone === "string" ? body.phone : "";
  const message = typeof body.message === "string" ? body.message : "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (
    name.length > MAX_LENGTHS.name ||
    email.length > MAX_LENGTHS.email ||
    country.length > MAX_LENGTHS.country ||
    phone.length > MAX_LENGTHS.phone ||
    message.length > MAX_LENGTHS.message
  ) {
    return NextResponse.json({ error: "too_long" }, { status: 413 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const cleanName = sanitizeLine(name);
  const cleanEmail = sanitizeLine(email);
  const cleanCountry = sanitizeLine(country);
  const cleanPhone = sanitizeLine(phone);
  const cleanMessage = sanitizeMultiline(message);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY missing");
    return NextResponse.json({ error: "mail_unavailable" }, { status: 503 });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Dawah Norway Website <noreply@dawahnorway.com>",
      to: ["info@dawahnorway.com"],
      replyTo: cleanEmail,
      subject: `Contact form — ${cleanName}`,
      text: [
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        cleanCountry ? `Country: ${cleanCountry}` : "",
        cleanPhone ? `Phone: ${cleanPhone}` : "",
        `IP: ${ip}`,
        "",
        "Message:",
        cleanMessage,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("contact email send failed:", error);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }
}
