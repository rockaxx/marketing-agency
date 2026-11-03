export const locales = ["sk", "en"] as const;
export type Locale = (typeof locales)[number];
export type Page =
  "home" | "services" | "pricing" | "about" | "contact" | "privacy";
export const paths: Record<Locale, Record<Page, string>> = {
  sk: {
    home: "",
    services: "sluzby",
    pricing: "cennik",
    about: "o-nas",
    contact: "kontakt",
    privacy: "ochrana-osobnych-udajov",
  },
  en: {
    home: "",
    services: "services",
    pricing: "pricing",
    about: "about",
    contact: "contact",
    privacy: "privacy",
  },
};
export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
export function href(locale: Locale, page: Page = "home") {
  return `/${locale}${paths[locale][page] ? "/" + paths[locale][page] : ""}`;
}
export function pageFromPath(locale: Locale, slug: string) {
  return (Object.keys(paths[locale]) as Page[]).find(
    (p) => paths[locale][p] === slug,
  );
}
