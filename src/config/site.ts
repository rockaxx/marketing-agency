export const site = {
  name: "AGENCY_NAME",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  location: {
    sk: "Zo Slovenska. Pre firmy po celom svete.",
    en: "Based in Slovakia. Working with businesses worldwide.",
  },
  founders: [] as {
    name: string;
    role: { sk: string; en: string };
    image?: string;
  }[],
  legal: {
    entity: "",
    identification: "",
    address: "",
    controller: "",
    retention: "",
    processors: "",
  },
  colors: {
    background: "#F5F3EE",
    text: "#141414",
    secondary: "#EAE8E2",
    accent: "#3448FF",
    dark: "#171819",
  },
};
