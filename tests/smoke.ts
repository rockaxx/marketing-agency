import { test } from "node:test";
import assert from "node:assert/strict";
import { paths, href, locales, type Page } from "../src/i18n/routing";
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
test("root redirects to Slovak without language detection", async () => {
  const res = await fetch(base, {
    redirect: "manual",
    headers: { "Accept-Language": "en-US" },
  });
  assert.ok([307, 308].includes(res.status));
  assert.equal(new URL(res.headers.get("location")!, base).pathname, "/sk");
});
for (const locale of locales)
  for (const page of Object.keys(paths[locale]) as Page[]) {
    test(`${locale}/${page}: rendered content, locale, unique metadata and links`, async () => {
      const res = await fetch(base + href(locale, page));
      assert.equal(res.status, 200);
      const html = await res.text();
      assert.ok(html.includes(`<html lang="${locale}"`));
      assert.ok(
        html.includes(`rel="canonical" href="${base + href(locale, page)}"`),
      );
      assert.ok(
        html.includes('hrefLang="sk"') ||
          html.includes('hrefLang="sk"'.toLowerCase()),
      );
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
      assert.ok(!html.includes("86 projects"));
      for (const match of html.matchAll(/href="(\/[^"?#]*)/g)) {
        const path = match[1];
        if (path.startsWith("/_next")) continue;
        const link = await fetch(base + path, { method: "HEAD" });
        assert.ok(link.ok, `Broken link ${path}: ${link.status}`);
      }
    });
  }
test("localized and unknown-route 404 responses", async () => {
  for (const path of [
    "/sk/missing",
    "/en/missing",
    "/fr",
    "/en/services/missing",
  ]) {
    const res = await fetch(base + path);
    assert.equal(res.status, 404);
    const html = await res.text();
    assert.ok(
      html.includes(
        path.startsWith("/en") ? "A little off the map." : "Trochu mimo mapy.",
      ),
    );
  }
});
test("sitemap includes all 12 pages and alternate URLs; robots exposes sitemap", async () => {
  const sitemap = await (await fetch(base + "/sitemap.xml")).text();
  for (const l of locales)
    for (const p of Object.keys(paths[l]) as Page[])
      assert.ok(sitemap.includes(base + href(l, p)));
  assert.equal((sitemap.match(/<url>/g) || []).length, 12);
  assert.ok(sitemap.includes('hreflang="sk"'));
  const robots = await (await fetch(base + "/robots.txt")).text();
  assert.ok(robots.includes("Disallow: /api/"));
  assert.ok(robots.includes("/sitemap.xml"));
});
test("localized social image is a real PNG", async () => {
  for (const locale of locales) {
    const res = await fetch(`${base}/${locale}/opengraph-image`);
    assert.equal(res.status, 200);
    assert.ok(res.headers.get("content-type")?.includes("image/png"));
    assert.ok((await res.arrayBuffer()).byteLength > 1000);
  }
});
test("contact endpoint rejects foreign origins, invalid payload, oversized body; missing config is explicit", async () => {
  const send = (body: unknown, origin = base) =>
    fetch(base + "/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", origin },
      body: JSON.stringify(body),
    });
  assert.equal((await send({}, "https://untrusted.example")).status, 403);
  assert.equal((await send({})).status, 400);
  assert.equal((await send({ x: "x".repeat(25000) })).status, 413);
  const res = await send({
    locale: "en",
    name: "Alex Example",
    email: "alex@example.com",
    company: "Example",
    service: "audit",
    description: "A real inquiry to evaluate technical website issues.",
    website: "",
    budget: "",
    method: "",
    honeypot: "",
    startedAt: Date.now() - 5000,
    turnstileToken: "",
  });
  assert.equal(res.status, 503);
  assert.equal((await res.json()).code, "configuration");
});
