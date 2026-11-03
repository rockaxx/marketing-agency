import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { messages } from "@/i18n/messages";
import { Header } from "@/components/navigation";
import { Footer } from "@/components/site";
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <a className="skip-link" href="#main">
        {messages[locale].skip}
      </a>
      <Suspense>
        <Header locale={locale} />
      </Suspense>
      <main id="main">{children}</main>
      <Suspense>
        <Footer locale={locale} />
      </Suspense>
    </>
  );
}
