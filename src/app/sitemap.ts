import type { MetadataRoute } from "next";
import { locales, paths, href, type Page } from "@/i18n/routing";
import { site } from "@/config/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    (Object.keys(paths[locale]) as Page[]).map((page) => ({
      url: site.url + href(locale, page),
      alternates: {
        languages: {
          sk: site.url + href("sk", page),
          en: site.url + href("en", page),
          "x-default": site.url + href("sk", page),
        },
      },
    })),
  );
}
