import type { Metadata } from "next";
import { site } from "@/config/site";
import { messages } from "@/i18n/messages";
import { href, type Locale, type Page } from "@/i18n/routing";
export function pageMetadata(locale: Locale, page: Page): Metadata {
  const t = messages[locale];
  const descriptions = {
    home: t.hero.body,
    services: t.services.body,
    pricing: t.pricing.pageBody,
    about: t.about.body,
    contact: t.form.body,
    privacy: t.privacy.body,
  };
  const title = `${t.nav[["home", "services", "pricing", "about", "contact", "privacy"].indexOf(page)]} | ${site.name}`;
  const url = site.url + href(locale, page);
  return {
    title,
    description: descriptions[page],
    alternates: {
      canonical: url,
      languages: {
        sk: site.url + href("sk", page),
        en: site.url + href("en", page),
        "x-default": site.url + href("sk", page),
      },
    },
    openGraph: {
      type: "website",
      title,
      description: descriptions[page],
      url,
      siteName: site.name,
      locale: locale === "sk" ? "sk_SK" : "en_GB",
      alternateLocale: locale === "sk" ? "en_GB" : "sk_SK",
      images: [
        {
          url: `${site.url}/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: site.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descriptions[page],
      images: [`${site.url}/${locale}/opengraph-image`],
    },
  };
}
