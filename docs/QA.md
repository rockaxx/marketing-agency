# Verification — 2026-11-03

Executed against the final production build on Windows with Microsoft Edge (headless Playwright), using Node v23.11.0 and npm 11.11.0. Deployment recommendation remains Node 22 LTS. npm reported a dev-dependency engine warning under the host's odd-numbered Node release; lint, typecheck, tests, and production build nevertheless completed successfully.

| Check | Observed result |
|---|---|
| Dependency installation | Completed; lockfile retained |
| `npm run lint` | Exit 0, no lint errors |
| `npm run typecheck` | Exit 0 |
| `npm test` | 4 tests passed |
| `npm run build` | Exit 0, Next.js 16.4.4, no root-directory warnings after configuration fix |
| `npm run test:smoke` | 17 tests passed against production server |
| `node tests/browser.mjs` | 48 page/viewport combinations passed; all interactions passed |
| `npm audit --omit=dev --audit-level=high` | 0 vulnerabilities reported at execution |

## Coverage

- All 12 localized pages at 375, 768, 1440, and 1920 px. No horizontal overflow, exactly one H1 on each.
- All localized page responses, root redirect even with English Accept-Language, correct HTML language, canonical and alternate metadata, and internal page links.
- Custom localized 404 content with HTTP 404, including unknown locale and nested routes.
- Sitemap with 12 URLs and language alternates; robots sitemap declaration; both generated Open Graph PNGs return real images.
- Mobile drawer opening/navigation/closing, Escape; FAQ accordion; pricing CTA service preselection; header and footer language switches preserve equivalent contact page and service query.
- Form accessible validation for empty required fields; actual valid browser submission to the local API returns the explicit missing-configuration message; no false success.
- API rejects foreign Origin, malformed/missing fields, oversized streamed bodies, honeypot, and implausibly fast submission.
- Unit tests verify email-provider failures and malformed provider success responses cannot produce success. Mocked successful provider acceptance requires an email ID and correct reply-to/text fields.
- axe WCAG 2 A/AA and WCAG 2.1 AA automated checks passed for home at all four widths and the English contact, services, pricing, about, privacy, and 404 views at mobile size. No uncaught browser page errors.
- Desktop/mobile homepage and contact screenshots visually inspected. Representative screenshots and machine-readable browser report are generated under ignored `test-results/`.
- Independent static review findings addressed: footer language switch originally returned home; placeholder brand originally inherited an unsupported registered trademark symbol. Both fixed.
- Browser testing caught local same-origin requests being rejected because Next's bound URL used `0.0.0.0` while the browser used `localhost`; localhost development origin explicitly allowed when no public origin is configured. Regression is covered by the real browser submission and smoke API test.

## Boundaries before launch

No live email was sent: real Resend key, verified sender, and recipient were not supplied. Unit tests mock external provider responses; this is not inbox-delivery evidence. Cloudflare Turnstile is optional and implemented with explicit SPA rendering and server token verification, but not exercised against a configured live widget. The rate limiter is intentionally per-process and not distributed. No Lighthouse score is claimed, and automated axe results are not an accessibility certification. No Vercel deployment or final production-domain verification occurred. Privacy is an editable draft; company details and legal review remain with the founders.

The owned production QA server was stopped after testing. Start the site with `npm run dev` for local work, or `npm start` to inspect the completed production build.
