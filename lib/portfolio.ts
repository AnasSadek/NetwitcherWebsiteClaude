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
  /** Kuratierte Erzähl-Kapitel der Case Study: Titel, optionaler Text und
   *  Bilder (auch reine Text-Kapitel sind erlaubt, `screens: []`). Ist dies
   *  gesetzt, ersetzt es den Screens-Abschnitt der Detailseite; `screens`
   *  dient dann nur noch den Kompositionen. */
  screenSections?: {
    title: string;
    body?: string | string[];
    screens: MediaImage[];
    /** Social-Reels (z. B. Instagram): natives Instagram-Embed
     *  (`blockquote.instagram-media`), Instagram steuert die Darstellung. */
    reels?: { href: string }[];
  }[];
  /** Branche des Kunden, erscheint in den Projekt-Metadaten. */
  industry?: string;
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
  /** Blendet die grosse Naechstes-Projekt-Buehne am Seitenende aus
   *  (z. B. wenn sie inhaltlich mit der Case Study kollidieren wuerde). */
  hideNextProject?: boolean;
};

/* ------------------------------------------------------------------------
   PROJEKTE
   Reihenfolge hier = Reihenfolge im Portfolio.
   Alle drei Kundenprojekte sind Struktur-Platzhalter: Kunde und Kategorie
   stehen, Beschreibungen und Medien werden mit den echten Inhalten ersetzt.
   ------------------------------------------------------------------------ */

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "fekrahub",
    client: "FekraHub",
    title: "Schulmanagement-Plattform",
    description:
      "Ein cloudbasiertes Schulmanagement-System, das speziell für arabischsprachige Schulen in Europa entwickelt wurde und Verwaltung, Lehrkräfte, Schüler und Eltern in einem zentralen digitalen Ökosystem miteinander verbindet.",
    year: "seit 2023",
    categories: ["software"],
    services: ["UI/UX Design", "Webanwendung", "SaaS-Entwicklung", "Produktdesign"],
    industry: "EdTech",
    color: "violet",
    featured: true,
    logo: "/portfolio/fekrahub/logo.png",
    cover: {
      src: "/portfolio/fekrahub/features-01.webp",
      alt: "FekraHub, Übersicht der Schulmanagement-Plattform",
      ratio: "16/10",
    },
    /* Kompositionen (Auftaktbild, Featured-Bühne, Filmstreifen) */
    screens: [
      { src: "/portfolio/fekrahub/features-01.webp", alt: "FekraHub, Dashboard der Plattform", ratio: "16/10" },
      { src: "/portfolio/fekrahub/dashboard-01.webp", alt: "FekraHub, personalisiertes Dashboard für Schüler und Eltern", ratio: "16/10" },
    ],
    /* Kuratierte Bild-Kapitel der Case Study */
    screenSections: [
      {
        title: "Funktionen im Überblick",
        screens: [
          { src: "/portfolio/fekrahub/features-01.webp", alt: "FekraHub, zentrale Funktionen im Überblick", ratio: "16/10" },
          { src: "/portfolio/fekrahub/features-02.webp", alt: "FekraHub, Funktionsübersicht der Plattform", ratio: "16/10" },
          { src: "/portfolio/fekrahub/features-03.webp", alt: "FekraHub, Module der Schulverwaltung", ratio: "16/10" },
          { src: "/portfolio/fekrahub/features-04.webp", alt: "FekraHub, Plattform-Übersicht", ratio: "16/10" },
        ],
      },
      {
        title: "Nahtlose Kommunikation",
        screens: [
          { src: "/portfolio/fekrahub/communication-01.webp", alt: "FekraHub, Kommunikation über alle Kanäle", ratio: "16/10" },
          { src: "/portfolio/fekrahub/communication-02.webp", alt: "FekraHub, Schulmitteilungen", ratio: "16/10" },
          { src: "/portfolio/fekrahub/communication-03.webp", alt: "FekraHub, Nachrichten zwischen Schule und Eltern", ratio: "16/10" },
        ],
      },
      {
        title: "Anwesenheit & Noten",
        screens: [
          { src: "/portfolio/fekrahub/attendance-01.webp", alt: "FekraHub, Anwesenheitserfassung", ratio: "16/10" },
          { src: "/portfolio/fekrahub/attendance-02.webp", alt: "FekraHub, Notenverwaltung", ratio: "16/10" },
          { src: "/portfolio/fekrahub/attendance-03.webp", alt: "FekraHub, Leistungsübersicht", ratio: "16/10" },
          { src: "/portfolio/fekrahub/attendance-04.webp", alt: "FekraHub, Bewertung im Detail", ratio: "16/10" },
        ],
      },
      {
        title: "Dashboards für Schüler & Eltern",
        screens: [
          { src: "/portfolio/fekrahub/dashboard-01.webp", alt: "FekraHub, personalisiertes Schüler-Dashboard", ratio: "16/10" },
          { src: "/portfolio/fekrahub/dashboard-02.webp", alt: "FekraHub, Elternansicht", ratio: "16/10" },
          { src: "/portfolio/fekrahub/dashboard-03.webp", alt: "FekraHub, Schülerprofil", ratio: "16/10" },
          { src: "/portfolio/fekrahub/dashboard-04.webp", alt: "FekraHub, Übersicht für Familien", ratio: "16/10" },
        ],
      },
      {
        title: "Unterricht & Hausaufgaben",
        screens: [
          { src: "/portfolio/fekrahub/lessons-01.webp", alt: "FekraHub, Unterrichtsplanung", ratio: "16/10" },
          { src: "/portfolio/fekrahub/lessons-02.webp", alt: "FekraHub, Hausaufgabenverwaltung", ratio: "16/10" },
          { src: "/portfolio/fekrahub/lessons-03.webp", alt: "FekraHub, Aufgaben im Überblick", ratio: "16/10" },
          { src: "/portfolio/fekrahub/lessons-04.webp", alt: "FekraHub, Stundenplan und Unterricht", ratio: "16/10" },
        ],
      },
      {
        title: "Berichte & Auswertungen",
        screens: [
          { src: "/portfolio/fekrahub/reports-01.webp", alt: "FekraHub, Berichte in Echtzeit", ratio: "16/10" },
          { src: "/portfolio/fekrahub/reports-02.webp", alt: "FekraHub, Auswertungen und Statistiken", ratio: "16/10" },
          { src: "/portfolio/fekrahub/reports-03.webp", alt: "FekraHub, Analyse der Schuldaten", ratio: "16/10" },
        ],
      },
    ],
    story: [
      {
        heading: "Überblick",
        body: "FekraHub ist eine cloudbasierte Schulmanagement-Plattform, die entwickelt wurde, um Verwaltung, Unterricht, Schülerorganisation und die Kommunikation mit Eltern einfacher und effizienter zu gestalten. Die Plattform vereinfacht den Schulalltag und bündelt zentrale Prozesse wie Schülerverwaltung, Anwesenheit, Noten, Hausaufgaben, Stundenpläne, Kommunikation und Berichterstattung an einem Ort.",
      },
      {
        heading: "Die Herausforderung",
        body: "Schulen arbeiten häufig mit voneinander getrennten Lösungen für Anwesenheit, Noten, Hausaufgaben, Stundenpläne, Kommunikation und Schülerverwaltung. Dadurch werden tägliche Abläufe unnötig komplex und wichtige Informationen sind oft nur schwer oder über mehrere Systeme hinweg zugänglich.",
      },
      {
        heading: "Die Lösung",
        body: "Wir haben eine zentrale digitale Plattform entwickelt, die die gesamte Schulgemeinschaft in einem vernetzten System zusammenführt. Die Verwaltung kann schulische Abläufe zentral steuern, Lehrkräfte können Anwesenheiten, Unterricht, Aufgaben und Noten verwalten, während Schüler und Eltern einen eigenen Zugang zu den für sie relevanten Informationen erhalten.",
      },
      {
        heading: "Zentrale Funktionen",
        body: "Schüler- und Personalverwaltung · Anwesenheitserfassung · Noten und Leistungsübersicht · Hausaufgaben- und Unterrichtsverwaltung · Eltern- und Schüler-Dashboards · Schulmitteilungen und Kommunikation · Berichte und Auswertungen",
      },
      {
        heading: "Die Nutzererfahrung",
        body: "Die Plattform wurde auf Basis rollenbasierter Workflows entwickelt. Dadurch sieht jeder Nutzer gezielt die Funktionen und Informationen, die für seine jeweilige Rolle relevant sind, während alle Beteiligten weiterhin Teil desselben zentralen digitalen Systems bleiben.",
      },
      {
        heading: "Das Ergebnis",
        body: "Eine strukturiertere, zugänglichere und stärker vernetzte Schulerfahrung, die fragmentierte Verwaltungsprozesse durch eine einheitliche digitale Plattform ersetzt.",
      },
    ],
    links: [{ label: "Mehr zu FekraHub", href: "/produkte/fekrahub" }],
  },
  {
    slug: "frida-eu",
    client: "FridaEU",
    title: "Digitale E-Commerce-Erfahrung für eine moderne Home-Fragrance-Marke",
    description:
      "FridaEU ist eine Marke für Raumdüfte und duftende Reinigungsprodukte. Ziel war es, ein digitales Einkaufserlebnis zu entwickeln, das Duftentdeckung, Markenstory und Commerce miteinander verbindet.",
    year: 2025,
    categories: ["ecommerce", "web", "design"],
    services: ["E-Commerce", "Markenerlebnis", "Webdesign"],
    color: "sky",
    featured: true,
    logo: "/portfolio/frida-eu/logo.webp",
    cover: {
      src: "/portfolio/frida-eu/device-showcase.webp",
      alt: "FridaEU, Online-Shop auf Laptop, Tablet und Smartphone – echte Screenshots der Website",
      ratio: "16/10",
    },
    screenSections: [
      {
        title: "Social Content & Brand Building",
        body: [
          "Neben dem Online-Shop wurde FridaEU durch kreative Social-Media-Inhalte unterstützt.",
          "Videoformate für Instagram und TikTok verbinden Unterhaltung, Produktinszenierung und Markenkommunikation und stärken die Verbindung zur Community.",
        ],
        screens: [],
        reels: [
          { href: "https://www.instagram.com/reel/DbgOB2qDKIK/" },
          { href: "https://www.instagram.com/reel/DcQcFE9gJEf/" },
          { href: "https://www.instagram.com/reel/DVHBZEmEbrY/" },
          { href: "https://www.instagram.com/reel/DU3kdkXijd2/" },
          { href: "https://www.instagram.com/reel/DbdpUKZD6dM/" },
        ],
      },
      {
        title: "Das Ergebnis",
        body: "FridaEU wurde von einem klassischen Online-Shop zu einer digitalen Markenplattform entwickelt, die Duftentdeckung, E-Commerce und Brand Experience in einer modernen Customer Journey vereint.",
        screens: [],
      },
    ],
    story: [
      {
        heading: "Die Herausforderung",
        body: "Düfte sind emotionale Produkte – online fehlt jedoch das direkte Erlebnis des Geruchs. Die Herausforderung bestand darin, verschiedene Duftwelten verständlich zu präsentieren, Vertrauen aufzubauen und Kunden einfach zum passenden Produkt zu führen.",
      },
      {
        heading: "Die Lösung",
        body: "Wir entwickelten einen modernen E-Commerce-Shop mit starkem visuellen Storytelling und einer klaren Customer Journey. Produkte werden über Duftwelten, Anwendungsbereiche und individuelle Bundles erlebbar gemacht, sodass Kunden einfacher entdecken, vergleichen und kaufen können.",
      },
      {
        heading: "Experience & Features",
        body: "Duftwelten für eine intuitive Produktauswahl · Produktorientiertes Shopping-Erlebnis · Individuell zusammenstellbare Duft-Bundles · Mobile-first Commerce · Brand Storytelling & Social Content Integration · Mehrsprachige Nutzererfahrung",
      },
    ],
    hideNextProject: true,
    links: [{ label: "Website besuchen", href: "https://fridaeu.com" }],
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

/** Medienauswahl für den Filmstreifen im Hero: genau eine Karte je Projekt
 *  (Cover-Bild). `FilmStrip` dupliziert die Liste separat für den
 *  nahtlosen Endlos-Loop — hier bleibt jedes Projekt ein einzelner Eintrag. */
export function stripMedia(): StripItem[] {
  return portfolioProjects.map((p) => ({
    slug: p.slug,
    client: p.client,
    color: p.color,
    ratio: p.cover.ratio ?? "16/10",
    src: p.cover.src,
    alt: p.cover.alt,
    kind: "image",
  }));
}

/** Ratio-String → CSS aspect-ratio-Wert. */
export const ratioValue = (r: Ratio = "16/10") => r.replace("/", " / ");
