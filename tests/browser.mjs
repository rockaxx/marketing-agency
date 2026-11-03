import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const routes = [
  "/sk",
  "/en",
  "/sk/sluzby",
  "/en/services",
  "/sk/cennik",
  "/en/pricing",
  "/sk/o-nas",
  "/en/about",
  "/sk/kontakt",
  "/en/contact",
  "/sk/ochrana-osobnych-udajov",
  "/en/privacy",
];
const results = [];
for (const width of [375, 768, 1440, 1920]) {
  await page.setViewportSize({ width, height: 1000 });
  for (const route of routes) {
    await page.goto(base + route);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("h1").count(), 1);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    assert.equal(overflow, false, `${route} overflows at ${width}`);
    results.push({ route, width, overflow });
    if (
      (width === 375 || width === 1440) &&
      ["/sk", "/en", "/en/contact", "/en/services", "/en/pricing"].includes(
        route,
      )
    )
      await page.screenshot({
        path: `test-results/${route.replaceAll("/", "-").slice(1)}-${width}.png`,
        fullPage: true,
      });
  }
  await page.goto(base + "/en");
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  assert.deepEqual(
    axe.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target),
    })),
    [],
    `Accessibility violations ${width}`,
  );
}
await page.setViewportSize({ width: 375, height: 812 });
await page.goto(base + "/en");
await page.getByRole("button", { name: "Open navigation" }).click();
await page
  .locator("#mobile-nav")
  .getByRole("link", { name: "Services" })
  .click();
await page.waitForURL("**/en/services");
assert.equal(
  await page
    .getByRole("button", { name: "Open navigation" })
    .getAttribute("aria-expanded"),
  "false",
);
await page.getByRole("button", { name: "Open navigation" }).click();
await page.keyboard.press("Escape");
assert.equal(
  await page
    .getByRole("button", { name: "Open navigation" })
    .getAttribute("aria-expanded"),
  "false",
);
await page.goto(base + "/en");
const faq = page.locator("details").first();
await faq.locator("summary").click();
assert.equal(await faq.getAttribute("open"), "");
await page.goto(base + "/en/pricing");
await page
  .getByRole("link", { name: "Request a proposal", exact: true })
  .click();
await page.waitForURL("**/en/contact?service=local");
assert.equal(await page.locator("#service").inputValue(), "local");
await page
  .locator(".header-actions")
  .getByRole("link", { name: "SK", exact: true })
  .click();
await page.waitForURL("**/sk/kontakt?service=local");
assert.equal(await page.locator("#service").inputValue(), "local");
await page
  .locator("footer")
  .getByRole("link", { name: "EN", exact: true })
  .click();
await page.waitForURL("**/en/contact?service=local");
assert.equal(await page.locator("#service").inputValue(), "local");
await page.goto(base + "/en/contact");
await page
  .getByRole("button", { name: "Send your inquiry", exact: true })
  .click();
assert.ok((await page.locator("[role=alert]").count()) >= 5);
assert.equal(await page.locator("#name").getAttribute("aria-invalid"), "true");
await page.locator("#name").fill("Alex Example");
await page.locator("#email").fill("alex@example.com");
await page.locator("#company").fill("Example");
await page.locator("#service").selectOption("audit");
await page
  .locator("#description")
  .fill("We would like a technical SEO audit of our existing website.");
await page.waitForTimeout(2100);
await page
  .getByRole("button", { name: "Send your inquiry", exact: true })
  .click();
await page
  .getByRole("alert")
  .filter({ hasText: "Email delivery is not configured yet." })
  .waitFor();
assert.equal(await page.getByText("Inquiry sent.", { exact: true }).count(), 0);
for (const route of [
  "/en/contact",
  "/en/services",
  "/en/pricing",
  "/en/about",
  "/en/privacy",
  "/en/missing",
]) {
  await page.goto(base + route);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  assert.deepEqual(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    [],
    route,
  );
}
assert.deepEqual(errors, []);
await writeFile(
  "test-results/browser-report.json",
  JSON.stringify(
    {
      viewports: results,
      browserErrors: errors,
      interactions:
        "mobile navigation, Escape, FAQ, pricing preselection, equivalent-language page, validation, missing email configuration",
      accessibility: "axe WCAG 2 A/AA and WCAG 2.1 AA automated rules passed",
    },
    null,
    2,
  ),
);
console.log(
  `PASS: ${results.length} viewport/page checks, interactions, accessibility, no browser errors.`,
);
await browser.close();
