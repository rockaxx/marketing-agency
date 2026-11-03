import { notFound } from "next/navigation";
import { isLocale, pageFromPath } from "@/i18n/routing";
import {
  Home,
  ServicesPage,
  PricingPage,
  AboutPage,
  ContactPage,
  PrivacyPage,
} from "@/components/site";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/config/site";
type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
  searchParams: Promise<{ service?: string }>;
};
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = pageFromPath(locale, (slug || []).join("/"));
  return page
    ? pageMetadata(locale, page)
    : { title: `404 | ${site.name}`, robots: { index: false } };
}
export default async function Page({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const page = pageFromPath(locale, (slug || []).join("/"));
  if (!page) notFound();
  const content =
    page === "home" ? (
      <Home locale={locale} />
    ) : page === "services" ? (
      <ServicesPage locale={locale} />
    ) : page === "pricing" ? (
      <PricingPage locale={locale} />
    ) : page === "about" ? (
      <AboutPage locale={locale} />
    ) : page === "contact" ? (
      <ContactPage locale={locale} service={(await searchParams).service} />
    ) : (
      <PrivacyPage locale={locale} />
    );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description:
      locale === "sk"
        ? "Nezávislé digitálne marketingové štúdio zo Slovenska."
        : "Independent digital marketing studio based in Slovakia.",
    knowsLanguage: ["sk", "en"],
    ...(site.email ? { email: site.email } : {}),
  };
  return (
    <>
      {content}
      {page === "home" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </>
  );
}
