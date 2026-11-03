# Template provenance

Selected: **Nexto by Kairo UI**, free Next.js + Tailwind agency template.

- Original page: https://www.kairoui.online/template/nexto
- Actual source downloaded: https://www.kairoui.online/r/nexto.json
- Upstream: https://github.com/abdulrahman-sde/kairo-ui
- Upstream license declaration: https://github.com/abdulrahman-sde/kairo-ui#license
- Retrieved: 2026-11-03
- Registry SHA-256: `4F1F9270932947D8817A0293BFFB43AE16F4EA7C3C20C16EC6B5D99FFACFCA6D`

The template page explicitly permits personal and commercial use under MIT. The upstream README also declares MIT. Upstream did not provide a standalone LICENSE file at retrieval (the raw LICENSE URL returned 404); its original README and license statement are retained in `vendor/nexto/UPSTREAM_README.md`. The MIT terms and attribution are retained in `vendor/nexto/LICENSE`. Keep these notices when redistributing source.

The unmodified registry response and every included source file are retained in `vendor/nexto/`. They are reference source, excluded from TypeScript compilation, Tailwind scanning, and deployed public assets.

## Adaptation map

This is an adaptation of actual source, not a screenshot recreation. `src/app/globals.css` retains the downloaded Nexto CSS foundations, with documented agency overrides. The centered Hero composition, circled-arrow pill CTAs, constrained section wrappers, paired section headings, service tiles, numbered connecting process timeline, dark CTA panel, and footer hierarchy were adapted from the original Hero, Services, Process, CTA, Navbar, and Footer source components into localized reusable components.

Changes: warm off-white/cobalt palette; stronger editorial typography; localized navigation/pages; a static three-service grid instead of a horizontally scrolled carousel; honest principles instead of fabricated testimonials/stats; target industries instead of demo client logos; real pricing and contact processing. Original decorative gradient blobs, demo avatars, fictional work, client logos, external logo image, material icon font, claimed years/results, and nonfunctional demo forms are not used by the public website.

Freeframe Agency was investigated first: https://freeframe.dev/templates/agency. Its HTML download requires an account. No account/authentication was bypassed. The brief's specified fallback was used.

## Fonts and assets

- DM Sans Variable, self-hosted through `@fontsource-variable/dm-sans`. SIL Open Font License 1.1; full notice in `public/DM-SANS-LICENSE.txt` and the installed package. Includes Slovak characters and italic cuts. No Google Fonts request at runtime.
- Lucide React icons: ISC license, retained in the installed dependency.
- Brand mark, favicon, underline, and social-sharing layout are original simple code-native graphics. No paid photography, portraits, or third-party demo images are shipped.
