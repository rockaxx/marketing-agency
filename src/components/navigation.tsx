"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { href, type Locale, pageFromPath, type Page } from "@/i18n/routing";
import { messages } from "@/i18n/messages";
import { site } from "@/config/site";
export function Brand({ locale }: { locale: Locale }) {
  return (
    <Link
      className="brand"
      href={href(locale)}
      aria-label={`${site.name} — ${messages[locale].nav[0]}`}
    >
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>{site.name}</span>
    </Link>
  );
}
const pages: Page[] = ["home", "services", "pricing", "about", "contact"];
export function LanguageSwitch({
  locale,
  page,
}: {
  locale: Locale;
  page?: Page;
}) {
  const pathname = usePathname();
  const resolved =
    page ||
    pageFromPath(locale, pathname.split("/").slice(2).join("/")) ||
    "home";
  const params = useSearchParams();
  const service = params.get("service");
  return (
    <div className="languages" aria-label={messages[locale].switch}>
      {(["sk", "en"] as const).map((l) => (
        <Link
          key={l}
          lang={l}
          href={
            href(l, resolved) +
            (resolved === "contact" && service
              ? `?service=${encodeURIComponent(service)}`
              : "")
          }
          hrefLang={l}
          aria-current={l === locale ? "true" : undefined}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const current =
    pageFromPath(locale, pathname.split("/").slice(2).join("/")) || "home";
  const t = messages[locale];
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 951px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const links = drawer.current?.querySelectorAll<HTMLAnchorElement>("a");
    links?.[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
      if (e.key === "Tab") {
        const list = [button.current, ...Array.from(links || [])].filter(
          Boolean,
        ) as HTMLElement[];
        const first = list[0],
          last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="header-inner wrap">
        <Brand locale={locale} />
        <nav className="desktop-nav" aria-label={t.footer.navigation}>
          {pages.map((p, i) => (
            <Link
              key={p}
              href={href(locale, p)}
              aria-current={current === p ? "page" : undefined}
            >
              {t.nav[i]}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <LanguageSwitch locale={locale} page={current} />
          <Link href={href(locale, "contact")} className="header-cta">
            {t.contact}
            <ArrowUpRight size={16} />
          </Link>
          <button
            ref={button}
            className="menu-toggle"
            aria-label={open ? t.close : t.menu}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <nav
        id="mobile-nav"
        ref={drawer}
        className={`mobile-nav ${open ? "is-open" : ""}`}
        aria-label={t.menu}
        hidden={!open}
      >
        {pages.map((p, i) => (
          <Link
            key={p}
            onClick={() => setOpen(false)}
            href={href(locale, p)}
            aria-current={current === p ? "page" : undefined}
          >
            <span>0{i + 1}</span>
            {t.nav[i]}
            <ArrowUpRight />
          </Link>
        ))}
      </nav>
    </header>
  );
}
