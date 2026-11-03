import type { Metadata } from "next";
import { headers } from "next/headers";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/dm-sans/wght-italic.css";
import "./globals.css";
import { site } from "@/config/site";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  icons: { icon: "/icon.svg" },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await headers()).get("x-site-locale") === "en" ? "en" : "sk";
  return (
    <html
      lang={locale}
      style={
        {
          "--bg-page": site.colors.background,
          "--text-main": site.colors.text,
          "--secondary": site.colors.secondary,
          "--accent": site.colors.accent,
          "--dark": site.colors.dark,
        } as React.CSSProperties
      }
    >
      <body id="top">{children}</body>
    </html>
  );
}
