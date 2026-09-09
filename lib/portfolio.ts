import type { AccentColor } from "./services";

/* ------------------------------------------------------------------------
   PORTFOLIO – zentrale Projektdaten
   ------------------------------------------------------------------------
   Ein neues Projekt = ein Eintrag in `portfolioProjects` + Medien unter
   `public/portfolio/<slug>/`. Listing (/portfolio), Detailseite
   (/portfolio/<slug>), Filter, Sitemap und OG-Bilder aktualisieren sich
   automatisch. Ausführliche Anleitung: docs/06-portfolio.md
   ------------------------------------------------------------------------ */

/** Kategorien für Filter & Navigation. Reihenfolge = Reihenfolge im Filter. */
export const PORTFOLIO_CATEGORIES = [
  { id: "web", label: "Websites", color: "mint" },
  { id: "ecommerce", label: "E-Commerce", color: "mint" },
  { id: "social-video", label: "Social & Video", color: "pink" },
  { id: "photo", label: "Fotografie", color: "sun" },
  { id: "design", label: "Design & Branding", color: "sun" },
  { id: "software", label: "Software & Apps", color: "violet" },
  { id: "ai", label: "KI & Automation", color: "sky" },
] as const satisfies readonly { id: string; label: string; color: AccentColor }[];

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number]["id"];

/** Seitenverhältnisse, in denen Medien dargestellt werden. */
export type Ratio =
  | "16/9"
  | "16/10"
  | "21/9"
  | "3/2"
  | "4/3"
  | "1/1"
  | "4/5"
  | "3/4"
  | "2/3"
  | "9/16";

export type MediaImage = {
  /** Pfad unter /public, z. B. "/portfolio/frida-eu/cover.jpg". Fehlt er, wird
   *  ein neutraler Platzhalter im passenden Format gezeigt. */
  src?: string;
  alt: string;
  ratio?: Ratio;
  caption?: string;
};

export type VideoSource = "local" | "youtube" | "vimeo" | "url";

export type MediaVideo = {
  title: string;
  /** local: Datei unter /public · youtube/vimeo: Video-ID oder URL · url: mp4/webm-URL */
  source: VideoSource;
  src?: string;
  /** Vorschaubild. Wird immer zuerst geladen, das Video erst beim Klick. */
  poster?: string;
  ratio?: Extract<Ratio, "9/16" | "16/9" | "1/1" | "4/5">;
  duration?: string;
};

export type PortfolioProject = {
  slug: string;
  client: string;
  title: string;
  /** Ein bis zwei Sätze. Kein Marketing-Text, eine Einordnung. */
  description: string;
  year: number | string;
  categories: PortfolioCategory[];
  services: string[];
  /** Akzentfarbe aus dem Logo-Stern, prägt Platzhalter, Glows und Details. */
  color: AccentColor;
  /** Featured-Projekte erhalten im Portfolio eine ganze Bühne (Spread). */
  featured?: boolean;
  /** Optionales Kundenlogo (SVG/PNG, einfarbig weiß wirkt am besten). */
  logo?: string;
  cover: MediaImage;
  /** Website-Projekte: Screenshots werden in Browser-/Phone-Rahmen gezeigt. */
  website?: {
    url?: string;
    desktop?: MediaImage;
    mobile?: MediaImage;
  };
  /** Reels, Werbefilme, Social-Videos. 9:16 wird als Reel-Rail dargestellt. */
  videos?: MediaVideo[];
  images?: MediaImage[];
  posters?: MediaImage[];
  socialPosts?: MediaImage[];
  /** Software / Plattformen / Dashboards. */
  screens?: MediaImage[];
  /** Kurze Story in Kapiteln, z. B. Ausgangslage · Ansatz · Umsetzung. */
  story?: { heading: string; body: string }[];
  /** Nur echte, freigegebene Zahlen eintragen. */
  results?: { value: string; label: string }[];
  testimonial?: { quote: string; name: string; role?: string };
  /** Weitere Links (Instagram-Profil, App Store, Live-Plattform …). */
  links?: { label: string; href: string }[];
  /** Technologien für Software-Projekte, bewusst zurückhaltend dargestellt. */
  tech?: string[];
  /** true, solange Texte/Medien noch nicht die echten Projektinhalte sind. */
  placeholder?: boolean;
};

/* ------------------------------------------------------------------------
   PROJEKTE
   Reihenfolge hier = Reihenfolge im Portfolio.
   Alle drei Kundenprojekte sind Struktur-Platzhalter: Kunde und Kategorie
   stehen, Beschreibungen und Medien werden mit den echten Inhalten ersetzt.
   ------------------------------------------------------------------------ */

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "frida-eu",
    client: "FRIDA EU",
    title: "Digitaler Markenauftritt",
    description:
      "Projektbeschreibung folgt: In ein bis zwei Sätzen, was für FRIDA EU entstanden ist und welches Ziel es hatte.",
    year: 2025,
    categories: ["web", "design"],
    services: ["Webdesign", "Branding", "Content"],
    color: "mint",
    featured: true,
    placeholder: true,
    cover: { alt: "FRIDA EU, Titelmotiv des Projekts", ratio: "16/10" },
    website: {
      // url: "https://…",
      desktop: { alt: "FRIDA EU, Website auf dem Desktop", ratio: "16/10" },
      mobile: { alt: "FRIDA EU, Website auf dem Smartphone", ratio: "9/16" },
    },
    images: [
      { alt: "FRIDA EU, Markenanwendung", ratio: "4/5" },
      { alt: "FRIDA EU, Detail des Designsystems", ratio: "1/1" },
      { alt: "FRIDA EU, Bildwelt", ratio: "16/10" },
    ],
    story: [
      {
        heading: "Ausgangslage",
        body: "Platzhalter: Wo stand die Marke, was hat gefehlt, was war das Ziel?",
      },
      {
        heading: "Umsetzung",
        body: "Platzhalter: Was genau wurde entwickelt, gestaltet oder produziert, und warum so?",
      },
    ],
  },
  {
    slug: "abziel",
    client: "ABZIEL",
    title: "Social Media & Reels",
    description:
      "Projektbeschreibung folgt: Kanal, Formate und Ziel der Content-Produktion für ABZIEL.",
    year: 2025,
    categories: ["social-video"],
    services: ["Social Media", "Reels", "Videoproduktion"],
    color: "pink",
    placeholder: true,
    cover: { alt: "ABZIEL, Titelmotiv des Projekts", ratio: "4/5" },
    videos: [
      { title: "Reel 01", source: "local", ratio: "9/16" },
      { title: "Reel 02", source: "local", ratio: "9/16" },
      { title: "Reel 03", source: "local", ratio: "9/16" },
      { title: "Werbefilm", source: "youtube", ratio: "16/9" },
    ],
    socialPosts: [
      { alt: "ABZIEL, Social-Media-Post", ratio: "4/5" },
      { alt: "ABZIEL, Social-Media-Post", ratio: "4/5" },
      { alt: "ABZIEL, Social-Media-Post", ratio: "1/1" },
      { alt: "ABZIEL, Social-Media-Post", ratio: "4/5" },
    ],
    // links: [{ label: "Instagram", href: "https://instagram.com/…" }],
  },
  {
    slug: "rushdia-care",
    client: "Rushdia Care",
    title: "Website & Fotografie",
    description:
      "Projektbeschreibung folgt: Website, Bildwelt und Ziel des Projekts für Rushdia Care.",
    year: 2024,
    categories: ["web", "photo"],
    services: ["Webdesign", "Fotografie", "Texte"],
    color: "sky",
    placeholder: true,
    cover: { alt: "Rushdia Care, Titelmotiv des Projekts", ratio: "16/10" },
    website: {
      desktop: { alt: "Rushdia Care, Website auf dem Desktop", ratio: "16/10" },
      mobile: { alt: "Rushdia Care, Website auf dem Smartphone", ratio: "9/16" },
    },
    images: [
      { alt: "Rushdia Care, Fotografie", ratio: "3/2" },
      { alt: "Rushdia Care, Fotografie", ratio: "4/5" },
      { alt: "Rushdia Care, Fotografie", ratio: "4/5" },
      { alt: "Rushdia Care, Fotografie", ratio: "3/2" },
    ],
  },
  {
    slug: "fekrahub",
    client: "FekraHub",
    title: "Plattform für Schulen",
    description:
      "Unsere eigene Verwaltungsplattform für Schulen: Anmeldungen, Kurse, Kommunikation und Berichte an einem Ort. Entwickelt und betrieben von Netwitcher.",
    year: "seit 2023",
    categories: ["software"],
    services: ["Produktdesign", "Webanwendung", "Plattform", "Betrieb"],
    color: "violet",
    featured: true,
    placeholder: true,
    cover: { alt: "FekraHub, Übersicht der Plattform", ratio: "16/10" },
    screens: [
      { alt: "FekraHub, Dashboard der Verwaltung", ratio: "16/10", caption: "Dashboard" },
      { alt: "FekraHub, Kursverwaltung", ratio: "16/10", caption: "Kurse & Klassen" },
      { alt: "FekraHub, Elternansicht auf dem Smartphone", ratio: "9/16", caption: "Elternansicht" },
      { alt: "FekraHub, Berichte und Zeugnisse", ratio: "16/10", caption: "Berichte" },
    ],
    story: [
      {
        heading: "Warum",
        body: "Zettelwirtschaft und Excel-Listen kosten Zeit, die in den Unterricht gehört. FekraHub bündelt den Alltag einer Bildungseinrichtung, von der ersten Anmeldung bis zum Zeugnis.",
      },
      {
        heading: "Was",
        body: "Digitale Anmeldung, Kurs- und Klassenverwaltung, mehrsprachige Kommunikation mit Eltern, Berichte und Zeugnisse, dazu ein Rollen- und Rechtemodell für Verwaltung, Lehrkräfte und Familien.",
      },
    ],
    links: [{ label: "Mehr zu FekraHub", href: "/produkte/fekrahub" }],
  },
];

/* ------------------------------------------------------------------------
   Helfer
   ------------------------------------------------------------------------ */

export const getProject = (slug: string) =>
  portfolioProjects.find((p) => p.slug === slug);

export const getCategory = (id: PortfolioCategory) =>
  PORTFOLIO_CATEGORIES.find((c) => c.id === id)!;

/** Kategorien, die tatsächlich Projekte enthalten, mit Anzahl. */
export function categoriesInUse() {
  return PORTFOLIO_CATEGORIES.map((c) => ({
    ...c,
    count: portfolioProjects.filter((p) => p.categories.includes(c.id)).length,
  })).filter((c) => c.count > 0);
}

export function adjacentProjects(slug: string) {
  const i = portfolioProjects.findIndex((p) => p.slug === slug);
  const n = portfolioProjects.length;
  return {
    prev: portfolioProjects[(i - 1 + n) % n],
    next: portfolioProjects[(i + 1) % n],
  };
}

/** Wie das Projekt visuell „gedacht" ist – steuert die Komposition. */
export type ProjectKind = "website" | "video" | "software" | "visual";

export function projectKind(p: PortfolioProject): ProjectKind {
  if (p.website) return "website";
  if (p.videos?.length) return "video";
  if (p.screens?.length) return "software";
  return "visual";
}

export type StripItem = {
  slug: string;
  client: string;
  color: AccentColor;
  ratio: Ratio;
  src?: string;
  alt: string;
  kind: "image" | "video";
};

/** Medienauswahl für den Filmstreifen im Hero: Cover + zwei weitere je Projekt. */
export function stripMedia(): StripItem[] {
  const items: StripItem[] = [];
  for (const p of portfolioProjects) {
    const base = { slug: p.slug, client: p.client, color: p.color };
    items.push({ ...base, ratio: p.cover.ratio ?? "16/10", src: p.cover.src, alt: p.cover.alt, kind: "image" });
    const extra: StripItem[] = [];
    p.videos?.slice(0, 1).forEach((v) =>
      extra.push({ ...base, ratio: v.ratio ?? "9/16", src: v.poster, alt: v.title, kind: "video" })
    );
    if (p.website?.mobile)
      extra.push({ ...base, ratio: "9/16", src: p.website.mobile.src, alt: p.website.mobile.alt, kind: "image" });
    [...(p.socialPosts ?? []), ...(p.images ?? []), ...(p.screens ?? [])]
      .slice(0, 2 - extra.length)
      .forEach((m) => extra.push({ ...base, ratio: m.ratio ?? "4/5", src: m.src, alt: m.alt, kind: "image" }));
    items.push(...extra);
  }
  return items;
}

/** Ratio-String → CSS aspect-ratio-Wert. */
export const ratioValue = (r: Ratio = "16/10") => r.replace("/", " / ");
