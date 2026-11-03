import { contactSchema } from "./validation";
type Env = Partial<
  Record<
    | "RESEND_API_KEY"
    | "CONTACT_FROM_EMAIL"
    | "CONTACT_TO_EMAIL"
    | "TURNSTILE_SECRET_KEY"
    | "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
    string
  >
>;
const result = (status: number, code: string) => ({ status, body: { code } });
export async function processContact(
  input: unknown,
  env: Env,
  send: typeof fetch = fetch,
) {
  const locale =
    typeof input === "object" &&
    input &&
    "locale" in input &&
    input.locale === "en"
      ? "en"
      : "sk";
  const parsed = contactSchema(locale).safeParse(input);
  if (!parsed.success) return result(400, "validation");
  const data = parsed.data;
  if (
    data.honeypot ||
    Date.now() - data.startedAt < 2000 ||
    Date.now() - data.startedAt > 86_400_000
  )
    return result(400, "spam");
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL || !env.CONTACT_TO_EMAIL)
    return result(503, "configuration");
  if (
    Boolean(env.TURNSTILE_SECRET_KEY) !==
    Boolean(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
  )
    return result(503, "configuration");
  try {
    if (env.TURNSTILE_SECRET_KEY) {
      const check = await send(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: new URLSearchParams({
            secret: env.TURNSTILE_SECRET_KEY,
            response: data.turnstileToken,
          }),
          signal: AbortSignal.timeout(10000),
        },
      );
      const verification = await check.json();
      if (!check.ok || verification.success !== true)
        return result(400, "spam");
    }
    const text = [
      `Language: ${data.locale}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Company: ${data.company}`,
      `Service: ${data.service}`,
      `Website: ${data.website || "—"}`,
      `Budget: ${data.budget || "—"}`,
      `Contact preference: ${data.method || "—"}`,
      "",
      data.description,
    ].join("\n");
    const response = await send("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: data.email,
        subject: `Website inquiry: ${data.service}`,
        text,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return result(502, "delivery");
    const accepted = await response.json();
    return typeof accepted.id === "string" && accepted.id.length > 0
      ? result(200, "sent")
      : result(502, "delivery");
  } catch {
    return result(502, "delivery");
  }
}
