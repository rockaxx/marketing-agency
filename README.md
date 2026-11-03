# AGENCY_NAME — bilingual marketing studio

Complete Slovak/English agency website, adapted from the free MIT-licensed **Kairo UI Nexto** source. See [TEMPLATE_SOURCE.md](TEMPLATE_SOURCE.md) for download evidence, licensing, and adaptation details.

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, self-hosted DM Sans, Lucide, React Hook Form, Zod, and a server-side Resend integration. No database, accounts, billing, advertising pixels, or analytics SDKs.

## Run locally

Use Node.js 22 LTS (22.13+), or a supported newer LTS release, with npm.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. `/` redirects to `/sk` regardless of browser language. Missing email configuration is allowed for development; an attempted valid inquiry returns an explicit configuration message and HTTP 503, never a false success.

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Run `npm run typecheck` after an initial build or dev startup so Next generates route types.

## Pages and localization

| Page          | Slovak                        | English        |
| ------------- | ----------------------------- | -------------- |
| Home          | `/sk`                         | `/en`          |
| Services      | `/sk/sluzby`                  | `/en/services` |
| Pricing       | `/sk/cennik`                  | `/en/pricing`  |
| About         | `/sk/o-nas`                   | `/en/about`    |
| Contact       | `/sk/kontakt`                 | `/en/contact`  |
| Privacy draft | `/sk/ochrana-osobnych-udajov` | `/en/privacy`  |

Unknown routes return HTTP 404 with localized custom content. Header and footer switches keep the equivalent page and contact `service` query. An explicit, typed dictionary provides localization without client translation widgets or locale detection. `src/i18n/routing.ts` is the route registry; only locale-correct slugs resolve. All main content renders on the server. Client code is limited to navigation, form, and optional bot verification.

## Customize

- `src/config/site.ts`: agency name, palette, verified public email, location copy, optional founders, legal details, base URL.
- `src/config/services.ts`: service descriptions, audiences, deliverables, expectations, inquiry selections.
- `src/config/pricing.ts`: package names, starting prices, billing cadence, inclusions, limitations, CTA text.
- `src/i18n/messages.ts`: all localized page copy, navigation, FAQs, legal draft, field labels, validation and submission messages.
- `src/app/globals.css`: retained Nexto foundations and responsive agency overrides.
- `public/icon.svg`: brand favicon. Update its mark/colors when final branding is selected.

No personal profiles are public until `site.founders` is populated. No contact address/email/social link is invented. If founders are configured, names/roles render; portraits remain optional and need a licensed local asset and a deliberate component extension. Package names are editable. Prices start at €199 one-time, €349/month, and €899/month; exact scope, fees, and tax treatment are agreed in a proposal.

## Environment

| Variable                         | Purpose                                                                                                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Absolute production HTTPS origin. Controls canonical, hreflang, sitemap, structured data, and sharing URLs. Local fallback is `http://localhost:3000`. Set **before building**. |
| `NEXT_PUBLIC_CONTACT_EMAIL`      | Optional verified public email; shown as secondary contact method. Leave empty until verified.                                                                                  |
| `RESEND_API_KEY`                 | Server-only Resend API key.                                                                                                                                                     |
| `CONTACT_FROM_EMAIL`             | Verified Resend sender, e.g. a mailbox on your verified domain.                                                                                                                 |
| `CONTACT_TO_EMAIL`               | Actual business inbox receiving inquiries.                                                                                                                                      |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional Cloudflare Turnstile site key.                                                                                                                                         |
| `TURNSTILE_SECRET_KEY`           | Matching server-only secret; configure both Turnstile keys together.                                                                                                            |

Never prefix private keys with `NEXT_PUBLIC_`. Keep `.env.local` out of version control. Changing a public variable requires a rebuild.

## Contact flow

Pricing links preselect `audit`, `local`, or `content`. Other service links use `social`, `consultation`, or `other`. Shared Zod validation runs in browser and server. Required fields: name, email, company, service, description (20–5,000 characters). Optional website accepts only full HTTP(S) URLs. Descriptions are sent as plain text; no user HTML is rendered in the email.

`POST /api/contact` checks JSON content type, origin, a streamed 24 KB limit, a honeypot, elapsed form time (2 seconds minimum / 24 hours maximum), and a basic 5-attempts/10-minutes limiter. On Vercel, only the platform-overwritten IP header is used; local development shares one bucket. Expired limiter records are discarded; record count is bounded. This in-memory limiter is per process and resets on restart/cold start. It is **not distributed protection**. For public traffic, configure the optional Turnstile integration and/or Vercel firewall controls without adding a database service. Ensure hostname permissions in Turnstile and update the privacy notice if enabled.

Provider calls time out. Success requires a successful Resend HTTP response **and an email ID**. This confirms provider acceptance, not delivery to the recipient's inbox. Failed delivery returns 502, missing/partial configuration 503, invalid/spam submissions 400, oversized bodies 413, and rate limiting 429. Form keeps entered values on failure and supports retries. No inquiry bodies or secrets are logged or stored in a database.

## Deploy on Vercel

1. Push this folder to your Git repository and import it into Vercel as a Next.js project. Use Node 22 LTS, install `npm ci`, build `npm run build`; leave output-directory override unset.
2. Configure production/preview environment variables above. Verify your sending domain in Resend; set a real receiving inbox. Do not use the example domain.
3. Fill final agency identity, privacy contact, business identification, registered address, processor information, retention/deletion policy, and effective date. The visible privacy pages are explicitly editable drafts, not verified legal advice.
4. Set final domain in `NEXT_PUBLIC_SITE_URL`, then build/deploy. Preview builds can use a separate explicit preview origin. No hosting credentials are included here.
5. Verify both locales, root redirect, navigation, production sitemap/canonicals, social images, and a real inquiry reaching the receiving inbox. Validate sender authentication and reply-to behavior.

The repository is deployment-ready but not deployed automatically: the requested Next.js/Vercel architecture is retained rather than converted to a different host runtime.

## Deploy on Netlify

The tracked `netlify.toml` sets the repository root as base, `npm run build` as the build command, `.next` as the publish directory, Node 22, and the maintained Next.js adapter. Keep the app's server rendering and route handler; do not deploy the repository root or add a static SPA catch-all redirect.

1. Import `rockaxx/marketing-agency` from GitHub and use branch `main`. Leave the package directory unset; this is a single application at the repository root.
2. Set `NEXT_PUBLIC_SITE_URL` in Netlify environment variables to the actual HTTPS site URL, for example `https://sparkly-klepon-2e15ce.netlify.app`. Add the Resend variables only when testing real email delivery.
3. Trigger a new deployment of the latest commit. The build log should run `next build` and the Next.js adapter, with generated server/edge functions. A green deploy alone does not prove that the application was built.
4. If the deployed file browser lists `src/`, `tests/`, `vendor/`, and `package.json` at the public root, it published source files instead of the Next.js build. Confirm that builds are enabled, that the latest commit contains `netlify.toml`, and that the resolved publish directory is `.next`, then use **Clear cache and deploy site** (or the equivalent retry without cache action).
5. Open `/`, `/sk`, `/en`, and a contact page. `/` should redirect to `/sk`. For visual demos without email credentials, the contact endpoint deliberately returns an explicit configuration error.

Netlify setup follows its [Next.js adapter documentation](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/). A successful local Next.js build is not evidence of a successful hosted Netlify adapter build.

## QA

With a fresh server running and no Resend credentials:

```powershell
npm run test:smoke
node tests/browser.mjs
```

Browser QA uses installed Microsoft Edge through Playwright. Other hosts may change `channel: 'msedge'` or install the matching browser. `TEST_BASE_URL` can target another local origin; set `NEXT_PUBLIC_SITE_URL` to the same origin before building if testing canonical equality. Smoke tests and browser submissions share the local rate-limit bucket; restart the server between repeated suites if it reaches five attempts.

The browser script checks all 12 localized pages at 375, 768, 1440, and 1920 px, screenshots representative pages, checks overflow, runs automated axe WCAG A/AA rules, exercises navigation/Escape, FAQ, pricing preselection, language switches, validation, and explicit missing-configuration behavior. Artifacts are in ignored `test-results/`. Automated accessibility checks do not establish full accessibility certification. Full QA evidence and boundaries are recorded in `docs/QA.md`.

The four core contact tests run without credentials and mock only external delivery: validation, spam rejection, missing configuration, provider errors, and provider acceptance. A live Resend delivery test, production domain/hosting verification, and final legal review require the founders' real configuration.
