export const packages = [
  {
    id: "audit",
    price: 199,
    recurring: false,
    name: "SEO Audit",
    features: {
      en: [
        "Website visibility review",
        "Technical SEO overview",
        "Keyword opportunities",
        "Competitor overview",
        "Prioritized recommendations",
      ],
      sk: [
        "Prehľad viditeľnosti webu",
        "Technický SEO prehľad",
        "Príležitosti v kľúčových slovách",
        "Prehľad konkurencie",
        "Odporúčania zoradené podľa priority",
      ],
    },
    cta: { en: "Request an audit", sk: "Mám záujem o audit" },
    note: {
      en: "A clear starting point. Implementation quoted separately.",
      sk: "Jasný východiskový bod. Implementáciu naceníme samostatne.",
    },
  },
  {
    id: "local",
    price: 349,
    recurring: true,
    name: "Local Growth",
    features: {
      en: [
        "Local SEO improvements",
        "Google Business Profile optimization",
        "Basic content support",
        "Monthly performance summary",
        "Ongoing recommendations",
      ],
      sk: [
        "Zlepšenia lokálneho SEO",
        "Optimalizácia Google Business Profile",
        "Základná obsahová podpora",
        "Mesačný prehľad výkonnosti",
        "Priebežné odporúčania",
      ],
    },
    cta: { en: "Request a proposal", sk: "Chcem návrh spolupráce" },
    note: {
      en: "For businesses serving a defined local area.",
      sk: "Pre firmy, ktoré oslovujú zákazníkov vo svojom okolí.",
    },
  },
  {
    id: "content",
    price: 899,
    recurring: true,
    name: "Search & Content Growth",
    features: {
      en: [
        "Ongoing SEO optimization",
        "Content planning and creation",
        "Selected webpage improvements",
        "Competitor monitoring",
        "Monthly reporting",
      ],
      sk: [
        "Priebežná SEO optimalizácia",
        "Plánovanie a tvorba obsahu",
        "Úpravy vybraných stránok",
        "Sledovanie konkurencie",
        "Mesačný reporting",
      ],
    },
    cta: { en: "Discuss your project", sk: "Preberme váš projekt" },
    note: {
      en: "A coordinated approach to search and content.",
      sk: "Prepojený prístup k vyhľadávaniu a obsahu.",
    },
  },
] as const;
