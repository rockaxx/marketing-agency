import { headers } from "next/headers";
import { messages } from "@/i18n/messages";
import { Button } from "@/components/site";
export default async function NotFound() {
  const locale = (await headers()).get("x-site-locale") === "en" ? "en" : "sk";
  const t = messages[locale].notFound;
  return (
    <section className="not-found wrap">
      <span className="eyebrow">
        404 / {locale === "sk" ? "STRÁNKA NENÁJDENÁ" : "PAGE NOT FOUND"}
      </span>
      <h1>{t.title}</h1>
      <p>{t.body}</p>
      <Button to={`/${locale}`}>{t.cta}</Button>
    </section>
  );
}
