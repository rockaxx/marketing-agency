import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Check,
  Search,
  MapPin,
  PenLine,
  CarFront,
  Store,
  ShoppingBag,
  Building2,
  Cpu,
  Plus,
} from "lucide-react";
import { messages } from "@/i18n/messages";
import { href, type Locale, type Page } from "@/i18n/routing";
import { packages } from "@/config/pricing";
import { services } from "@/config/services";
import { site } from "@/config/site";
import { Brand, LanguageSwitch } from "./navigation";
import { ContactForm } from "./form";
type L = { locale: Locale };
export function Button({
  children,
  to,
  light = false,
}: {
  children: React.ReactNode;
  to: string;
  light?: boolean;
}) {
  return (
    <Link href={to} className={`pill ${light ? "pill-light" : ""}`}>
      <span className="arrow-circle">
        <ArrowUpRight size={18} />
      </span>
      {children}
    </Link>
  );
}
export function SectionHead({
  label,
  title,
  accent,
  body,
}: {
  label: string;
  title: string;
  accent?: string;
  body?: string;
}) {
  return (
    <div className="nexto-section-head">
      <div>
        <span className="eyebrow">{label}</span>
        <h2>
          {title}
          {accent && (
            <>
              <br />
              <em>{accent}</em>
            </>
          )}
        </h2>
      </div>
      {body && <p className="section-lede">{body}</p>}
    </div>
  );
}
export function PageHero({
  label,
  title,
  accent,
  body,
}: {
  label: string;
  title: string;
  accent?: string;
  body: string;
}) {
  return (
    <section className="page-hero wrap">
      <span className="eyebrow">
        <span className="status-dot" />
        {label}
      </span>
      <h1>
        {title}
        {accent && (
          <>
            <br />
            <em>{accent}</em>
          </>
        )}
      </h1>
      <p>{body}</p>
    </section>
  );
}
export function FinalCTA({ locale }: L) {
  const t = messages[locale].cta;
  return (
    <section className="cta-section wrap">
      <div className="cta-panel">
        <div>
          <span className="eyebrow">{t.label}</span>
          <h2>{t.title}</h2>
          <p>{t.body}</p>
        </div>
        <div className="cta-action">
          <span className="big-arrow" aria-hidden="true">
            ↗
          </span>
          <Button to={href(locale, "contact")} light>
            {t.button}
          </Button>
        </div>
      </div>
    </section>
  );
}
export function Footer({ locale }: L) {
  const t = messages[locale];
  const pages: Page[] = ["home", "services", "pricing", "about", "contact"];
  return (
    <footer className="wrap site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Brand locale={locale} />
          <p>{t.footer.description}</p>
          <span className="footer-location">
            <span className="status-dot" />
            {site.location[locale]}
          </span>
        </div>
        <div>
          <h2>{t.footer.navigation}</h2>
          {pages.map((p, i) => (
            <Link href={href(locale, p)} key={p}>
              {t.nav[i]}
            </Link>
          ))}
        </div>
        <div>
          <h2>{t.footer.services}</h2>
          {services.slice(0, 3).map((s) => (
            <Link key={s.id} href={`${href(locale, "services")}#${s.id}`}>
              {s.title[locale]}
            </Link>
          ))}
          {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <Link href={href(locale, "privacy")}>{t.footer.legal}</Link>
        <LanguageSwitch locale={locale} />
        <a href="#top">{t.footer.top} ↑</a>
      </div>
    </footer>
  );
}
export function PricingCards({ locale }: L) {
  const t = messages[locale].pricing;
  return (
    <>
      <div className="pricing-grid">
        {packages.map((p, i) => (
          <article
            className={`price-card ${i === 1 ? "featured" : ""}`}
            key={p.id}
          >
            {i === 1 && <span className="price-ribbon">{t.featured}</span>}
            <span className="card-index">
              0{i + 1} /{" "}
              {p.recurring
                ? locale === "sk"
                  ? "SPOLUPRÁCA"
                  : "RETAINER"
                : locale === "sk"
                  ? "JEDNORAZOVO"
                  : "ONE-OFF"}
            </span>
            <h3>{p.name}</h3>
            <p className="price">
              <small>{t.from}</small> €{p.price}
              <span>{p.recurring ? t.monthly : t.once}</span>
            </p>
            <p className="price-note">{p.note[locale]}</p>
            <ul>
              {p.features[locale].map((f) => (
                <li key={f}>
                  <Check size={16} />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              to={`${href(locale, "contact")}?service=${p.id}`}
              light={i === 1}
            >
              {p.cta[locale]}
            </Button>
          </article>
        ))}
      </div>
      <p className="pricing-disclaimer">{t.note}</p>
    </>
  );
}
export function Process({ locale }: L) {
  const t = messages[locale].process;
  return (
    <section className="nexto-section wrap" id="process">
      <SectionHead {...t} />
      <div className="nexto-process-timeline">
        {t.items.map(([title, body], i) => (
          <div className="nexto-process-step" key={title}>
            <div className="nexto-process-node-row">
              <span className="nexto-process-node">0{i + 1}</span>
              {i < 3 && (
                <span className="nexto-process-connector" aria-hidden="true">
                  <span />
                  <ArrowRight size={14} />
                </span>
              )}
            </div>
            <div className="nexto-process-card">
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export function Principles({ locale, about = false }: L & { about?: boolean }) {
  const t = messages[locale].why;
  return (
    <section
      className={`principles-section ${about ? "about-principles" : ""}`}
    >
      <div className="wrap principles-layout">
        <div>
          <span className="eyebrow">
            {about ? messages[locale].about.values : t.label}
          </span>
          <h2>
            {t.title}
            <br />
            <em>{t.accent}</em>
          </h2>
          <p className="section-lede">{t.body}</p>
          <div className="principles-art" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <i>↗</i>
          </div>
        </div>
        <div className="principles-list">
          {t.items.map(([title, body], i) => (
            <article key={title}>
              <span className="mono">0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Home({ locale }: L) {
  const t = messages[locale];
  const icons = [Search, PenLine, MapPin];
  const selected = [services[0], services[2], services[1]];
  const industriesIcons = [CarFront, Store, ShoppingBag, Building2, Cpu];
  return (
    <>
      <section className="hero wrap">
        <div className="hero-topline">
          <span className="mono">
            {locale === "sk"
              ? "NEZÁVISLÉ DIGITÁLNE ŠTÚDIO"
              : "INDEPENDENT DIGITAL STUDIO"}
          </span>
          <span className="mono">
            {locale === "sk" ? "SLOVENSKO ↗ CELÝ SVET" : "SLOVAKIA ↗ WORLDWIDE"}
          </span>
        </div>
        <div className="hero-content">
          <span className="eyebrow">
            <span className="status-dot" />
            {t.hero.eyebrow}
          </span>
          <h1>
            {t.hero.title}
            <br />
            <em>{t.hero.accent}</em>
            <svg
              className="hero-underline"
              viewBox="0 0 700 20"
              aria-hidden="true"
            >
              <path d="M4 14 Q320 -1 695 9" />
            </svg>
          </h1>
          <p>{t.hero.body}</p>
          <div className="hero-actions">
            <Button to={href(locale, "contact")}>{t.hero.primary}</Button>
            <Link href={href(locale, "services")} className="text-link">
              {t.hero.secondary}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="hero-note">
            <span className="mini-mark" aria-hidden="true">
              ↗
            </span>
            {t.hero.note}
          </div>
        </div>
        <div className="hero-bottom">
          <span className="hero-disciplines">
            SEO <span>+</span> {locale === "sk" ? "OBSAH" : "CONTENT"}{" "}
            <span>+</span> {locale === "sk" ? "LOKÁLNE" : "LOCAL"}
          </span>
          <a href="#what-we-do" className="scroll-link">
            {t.hero.scroll}
            <ArrowDown size={15} />
          </a>
        </div>
      </section>
      <section className="nexto-section wrap" id="what-we-do">
        <SectionHead {...t.intro} />
        <div className="service-grid">
          {selected.map((s, i) => {
            const Icon = icons[i];
            return (
              <Link
                className={`service-tile service-tile-${i}`}
                href={`${href(locale, "services")}#${s.id}`}
                key={s.id}
              >
                <div className="tile-top">
                  <Icon size={30} strokeWidth={1.5} />
                  <span className="mono">0{i + 1}</span>
                </div>
                <h3>{t.intro.categories[i]}</h3>
                <p>{s.short[locale]}</p>
                <div className="tile-bottom">
                  {t.intro.more}
                  <span>
                    <ArrowUpRight size={19} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <Principles locale={locale} />
      <Process locale={locale} />
      <section className="nexto-section pricing-section">
        <div className="wrap">
          <SectionHead {...t.pricing} />
          <PricingCards locale={locale} />
          <Link
            href={href(locale, "pricing")}
            className="text-link pricing-more"
          >
            {t.pricing.all}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="nexto-section wrap industries">
        <SectionHead {...t.industries} />
        <div className="industry-grid">
          {t.industries.items.map((item, i) => {
            const Icon = industriesIcons[i];
            return (
              <div key={item} className="industry">
                <Icon size={32} strokeWidth={1.3} />
                <span>{item}</span>
                <small className="mono">0{i + 1}</small>
              </div>
            );
          })}
        </div>
      </section>
      <section className="nexto-section wrap faq-section">
        <div>
          <span className="eyebrow">{t.faq.label}</span>
          <h2>
            {t.faq.title}
            <br />
            <em>{t.faq.accent}</em>
          </h2>
        </div>
        <div className="faq-list">
          {t.faq.items.map(([q, a], i) => (
            <details key={q} name="faq">
              <summary>
                <span className="mono">0{i + 1}</span>
                <h3>{q}</h3>
                <Plus size={20} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <FinalCTA locale={locale} />
    </>
  );
}
export function ServicesPage({ locale }: L) {
  const t = messages[locale].services;
  return (
    <>
      <PageHero {...t} />
      <nav className="service-index wrap" aria-label={t.label}>
        {services.map((s, i) => (
          <a key={s.id} href={`#${s.id}`}>
            <span className="mono">0{i + 1}</span>
            {s.title[locale]}
            <ArrowDown size={16} />
          </a>
        ))}
      </nav>
      <div className="wrap services-detail">
        {services.map((s, i) => (
          <section key={s.id} id={s.id} className="service-detail">
            <div>
              <span className="eyebrow">
                0{i + 1} / {t.label}
              </span>
              <h2>{s.title[locale]}</h2>
              <p className="service-intro">{s.short[locale]}</p>
              <Button to={`${href(locale, "contact")}?service=${s.inquiry}`}>
                {t.cta}
              </Button>
            </div>
            <div>
              <h3>{t.audience}</h3>
              <p>{s.audience[locale]}</p>
              <h3>{t.includes}</h3>
              <ul>
                {s.includes[locale].map((v) => (
                  <li key={v}>
                    <Check size={16} />
                    {v}
                  </li>
                ))}
              </ul>
              <h3>{t.expect}</h3>
              <p>{s.expect[locale]}</p>
            </div>
          </section>
        ))}
      </div>
      <div className="wrap services-pricing">
        <Link href={href(locale, "pricing")} className="text-link">
          {t.pricing}
          <ArrowUpRight size={20} />
        </Link>
      </div>
      <FinalCTA locale={locale} />
    </>
  );
}
export function PricingPage({ locale }: L) {
  const t = messages[locale].pricing;
  return (
    <>
      <PageHero
        label={locale === "sk" ? "CENNÍK" : "PRICING"}
        title={t.pageTitle}
        body={t.pageBody}
      />
      <section className="wrap pricing-page-cards" aria-label={t.pageTitle}>
        <PricingCards locale={locale} />
      </section>
      <section className="nexto-section wrap scope-grid">
        {t.details.map(([title, body], i) => (
          <article key={title}>
            <span className="mono">0{i + 1}</span>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>
      <section className="wrap custom-proposal">
        <div>
          <span className="eyebrow">
            {locale === "sk" ? "NA MIERU" : "BUILT AROUND YOU"}
          </span>
          <h2>{t.custom}</h2>
          <p>{t.customBody}</p>
        </div>
        <Button to={`${href(locale, "contact")}?service=other`}>
          {t.customCta}
        </Button>
      </section>
      <FinalCTA locale={locale} />
    </>
  );
}
export function AboutPage({ locale }: L) {
  const t = messages[locale].about;
  return (
    <>
      <PageHero {...t} />
      <section className="wrap about-statement">
        <span className="about-number" aria-hidden="true">
          02<span>↗</span>
        </span>
        <h2>{t.statement}</h2>
        <span className="mono">
          {locale === "sk" ? "SLOVENSKO / SK + EN" : "SLOVAKIA / SK + EN"}
        </span>
      </section>
      <section className="wrap nexto-section about-story">
        <div>
          <span className="eyebrow">{t.approach}</span>
          <h2>{t.approach}</h2>
          <p>{t.approachBody}</p>
        </div>
        <div>
          <article>
            <h3>{t.collab}</h3>
            <p>{t.collabBody}</p>
          </article>
          <article>
            <h3>{t.measurement}</h3>
            <p>{t.measurementBody}</p>
          </article>
        </div>
      </section>
      <Principles locale={locale} about />
      {site.founders.length > 0 && (
        <section className="wrap nexto-section">
          <h2>{t.founders}</h2>
          {site.founders.map((f) => (
            <article key={f.name}>
              <h3>{f.name}</h3>
              <p>{f.role[locale]}</p>
            </article>
          ))}
        </section>
      )}
      <FinalCTA locale={locale} />
    </>
  );
}
export function ContactPage({ locale, service }: L & { service?: string }) {
  const t = messages[locale].form;
  return (
    <>
      <PageHero {...t} />
      <section className="wrap contact-layout">
        <aside>
          <span className="eyebrow">
            {locale === "sk" ? "ČO BUDE ĎALEJ" : "WHAT HAPPENS NEXT"}
          </span>
          <h2>{t.aside}</h2>
          <ol>
            {t.steps.map((s, i) => (
              <li key={s}>
                <span className="mono">0{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p>{t.noPressure}</p>
          <div className="contact-location">
            <span className="status-dot" />
            {site.location[locale]}
          </div>
          {site.email && (
            <div className="direct-contact">
              <h3>{t.emailLink}</h3>
              <a href={`mailto:${site.email}`}>
                {site.email}
                <ArrowUpRight size={18} />
              </a>
            </div>
          )}
        </aside>
        <div>
          <ContactForm locale={locale} service={service} />
          {site.email && (
            <a className="contact-fallback" href={`mailto:${site.email}`}>
              {t.emailLink} {site.email}
            </a>
          )}
        </div>
      </section>
    </>
  );
}
export function PrivacyPage({ locale }: L) {
  const t = messages[locale].privacy;
  const legal = [
    site.legal.entity,
    site.legal.identification,
    site.legal.address,
    site.legal.controller,
  ].filter(Boolean);
  return (
    <>
      <PageHero {...t} />
      <article className="wrap privacy-content">
        {t.sections.map(([title, body], i) => (
          <section key={title}>
            <span className="mono">0{i + 1}</span>
            <div>
              <h2>{title}</h2>
              <p>
                {i === 0 && legal.length === 4
                  ? legal.join(" · ")
                  : i === 4 && site.legal.retention
                    ? site.legal.retention
                    : i === 3 && site.legal.processors
                      ? site.legal.processors
                      : body}
              </p>
            </div>
          </section>
        ))}
      </article>
    </>
  );
}
