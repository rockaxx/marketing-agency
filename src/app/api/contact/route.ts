import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { processContact } from "@/lib/contact";
export const runtime = "nodejs";
const attempts = new Map<string, { count: number; until: number }>();
export async function POST(request: NextRequest) {
  const respond = (status: number, code: string) =>
    NextResponse.json(
      { code },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  const origin = request.headers.get("origin");
  const allowed = new Set([new URL(request.url).origin]);
  // Next's bound request URL may use 0.0.0.0 during local previews.
  if (!process.env.NEXT_PUBLIC_SITE_URL) allowed.add("http://localhost:3000");
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
    } catch {
      return respond(503, "configuration");
    }
  }
  if (origin && !allowed.has(origin)) return respond(403, "origin");
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return respond(415, "validation");
  const now = Date.now();
  // Vercel overwrites this header. No arbitrary client proxy headers trusted elsewhere.
  const ip = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for") || "unknown"
    : "local";
  const key = createHash("sha256").update(ip).digest("hex");
  for (const [id, entry] of attempts)
    if (entry.until < now) attempts.delete(id);
  if (attempts.size >= 10000) return respond(429, "rate");
  const entry = attempts.get(key) || { count: 0, until: now + 600000 };
  if (entry.count >= 5) return respond(429, "rate");
  entry.count++;
  attempts.set(key, entry);
  // Stream limit also protects requests with missing or false Content-Length.
  let input: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return respond(400, "validation");
    const decoder = new TextDecoder();
    let size = 0,
      body = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 24000) {
        await reader.cancel();
        return respond(413, "validation");
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    input = JSON.parse(body);
  } catch {
    return respond(400, "validation");
  }
  const result = await processContact(input, {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  });
  return NextResponse.json(result.body, {
    status: result.status,
    headers: { "Cache-Control": "no-store" },
  });
}
