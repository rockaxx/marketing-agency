import { test } from "node:test";
import assert from "node:assert/strict";
import { contactSchema } from "../src/lib/validation";
import { processContact } from "../src/lib/contact";
const valid = {
  locale: "en",
  name: "Alex Smith",
  email: "alex@example.com",
  company: "Example",
  service: "audit",
  description:
    "We need a technical SEO audit for our existing company website.",
  website: "https://example.com",
  budget: "unsure",
  method: "email",
  honeypot: "",
  startedAt: Date.now() - 5000,
  turnstileToken: "",
};
test("validates real inquiry and rejects missing fields and unsafe URL", () => {
  assert.equal(contactSchema("en").safeParse(valid).success, true);
  for (const change of [
    { email: "bad" },
    { name: "" },
    { service: "made-up" },
    { website: "javascript:alert(1)" },
    { description: "short" },
    { budget: "made-up" },
  ])
    assert.equal(
      contactSchema("en").safeParse({ ...valid, ...change }).success,
      false,
    );
});
test("missing email configuration never reports success", async () => {
  const result = await processContact(valid, {}, async () => {
    throw Error("must not send");
  });
  assert.equal(result.status, 503);
  assert.equal(result.body.code, "configuration");
});
test("only confirmed provider acceptance reports success", async () => {
  const env = {
    RESEND_API_KEY: "test",
    CONTACT_FROM_EMAIL: "sender@example.com",
    CONTACT_TO_EMAIL: "owner@example.com",
  };
  const fail = await processContact(
    valid,
    env,
    async () => new Response("{}", { status: 500 }),
  );
  assert.equal(fail.status, 502);
  const malformed = await processContact(
    valid,
    env,
    async () => new Response("{}", { status: 200 }),
  );
  assert.equal(malformed.status, 502);
  const ok = await processContact(valid, env, async (_url, init) => {
    const message = JSON.parse(String(init?.body));
    assert.equal(message.reply_to, valid.email);
    assert.ok(message.text.includes(valid.description));
    return new Response(JSON.stringify({ id: "email-123" }), { status: 200 });
  });
  assert.equal(ok.status, 200);
});
test("bots and invalid submissions are rejected without delivery", async () => {
  const sender = async () => {
    throw Error("must not send");
  };
  assert.equal(
    (await processContact({ ...valid, honeypot: "spam" }, {}, sender)).status,
    400,
  );
  assert.equal(
    (await processContact({ ...valid, startedAt: Date.now() }, {}, sender))
      .status,
    400,
  );
  assert.equal(
    (await processContact({ ...valid, email: "invalid" }, {}, sender)).status,
    400,
  );
});
