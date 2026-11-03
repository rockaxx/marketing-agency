import { ImageResponse } from "next/og";
import { site } from "@/config/site";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: site.colors.background,
        color: site.colors.text,
        padding: 70,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 28,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{site.name}</span>
        <span>SK / EN ↗</span>
      </div>
      <div
        style={{
          fontSize: 82,
          lineHeight: 1.05,
          letterSpacing: -5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span>
          {locale === "sk" ? "Pomáhame firmám" : "Make your business"}
        </span>
        <span style={{ color: site.colors.accent }}>
          {locale === "sk" ? "byť viditeľnejšími." : "easier to find."}
        </span>
      </div>
      <div style={{ fontSize: 23, display: "flex" }}>SEO + CONTENT + LOCAL</div>
    </div>,
    size,
  );
}
