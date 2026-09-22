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
  /** Featured-Galerie: ein grosses Bild + Thumbnail-Slider darunter (ersetzt
   *  `screenSections`/`screens` auf der Detailseite, wenn gesetzt). Erster
   *  Eintrag ist das Bild, das standardmässig gross angezeigt wird. */
  gallery?: { label: string; image: MediaImage }[];
  /** Eigener Funktionen-Abschnitt (Eyebrow, Überschrift, Intro + Karten mit
   *  Icon/Titel/Beschreibung), rein textbasiert — kein Bild. Rendert direkt
   *  vor `gallery`/`screenSections`/`screens`, wenn gesetzt. */
  features?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items: {
      icon: "users" | "calendar-check" | "book" | "message-circle" | "bar-chart" | "shield-check";
      title: string;
      description: string;
    }[];
  };
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
    title: "Schulmanagement neu gedacht",
    description:
      "Eine cloudbasierte Plattform für arabischsprachige Schulen in Europa, die Verwaltung, Lehrkräfte, Schüler und Eltern in einem zentralen System verbindet.",
    year: "seit 2023",
    categories: ["software"],
    services: ["UI/UX Design", "Webanwendung", "SaaS-Entwicklung"],
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
      {
        src: "/portfolio/fekrahub/hero-devices.webp",
        alt: "FekraHub, Schulmanagement-Plattform auf Laptop, Tablet und Smartphone",
        ratio: "16/10",
      },
    ],
    features: {
      eyebrow: "WARUM FEKRAHUB",
      heading: "ZENTRALE FUNKTIONEN",
      intro: "Alles, was Schulen für einen einfachen, vernetzten Alltag brauchen – in einer Plattform.",
      items: [
        { icon: "users", title: "Schülerverwaltung", description: "Schüler, Klassen und Profile zentral verwalten." },
        { icon: "calendar-check", title: "Anwesenheit & Noten", description: "Anwesenheit erfassen und Leistungen übersichtlich verwalten." },
        { icon: "book", title: "Unterricht & Aufgaben", description: "Unterricht, Hausaufgaben und Lerninhalte einfach organisieren." },
        { icon: "message-circle", title: "Kommunikation", description: "Verwaltung, Lehrkräfte, Eltern und Schüler direkt verbinden." },
        { icon: "bar-chart", title: "Berichte & Auswertungen", description: "Schuldaten übersichtlich auswerten und Berichte erstellen." },
        { icon: "shield-check", title: "Rollen & Zugriffsrechte", description: "Zugriffe passend für Verwaltung, Lehrkräfte und Mitarbeitende steuern." },
      ],
    },
    /* Featured-Galerie: grosses Bild + Thumbnail-Slider darunter */
    gallery: [
      { label: "Anwesenheitsliste", image: { src: "/portfolio/fekrahub/gallery-attendance.webp", alt: "FekraHub, exportierte Anwesenheitsliste als PDF", ratio: "4/3" } },
      { label: "Kommunikation", image: { src: "/portfolio/fekrahub/gallery-messages.webp", alt: "FekraHub, Nachrichten und Dateiversand", ratio: "4/3" } },
      { label: "Kursunterlagen", image: { src: "/portfolio/fekrahub/gallery-course-files.webp", alt: "FekraHub, Kursunterlagen und Materialien", ratio: "4/3" } },
      { label: "Rollen & Berechtigungen", image: { src: "/portfolio/fekrahub/gallery-roles.webp", alt: "FekraHub, Nutzerrollen & Berechtigungen", ratio: "4/3" } },
      { label: "Kalender", image: { src: "/portfolio/fekrahub/gallery-calendar.webp", alt: "FekraHub, Kurskalender mit Filtern", ratio: "4/3" } },
    ],
    story: [
      {
        heading: "Die Herausforderung",
        body: "Viele Schulen nutzen getrennte Systeme für Anwesenheit, Noten, Stundenpläne, Aufgaben und Kommunikation. Das macht den Schulalltag unnötig komplex.",
      },
      {
        heading: "Die Lösung",
        body: "FekraHub bündelt alle wichtigen Schulprozesse in einer zentralen Plattform mit rollenbasierten Zugängen für Verwaltung, Lehrkräfte, Schüler und Eltern.",
      },
      {
        heading: "Zentrale Funktionen",
        body: "Schüler- & Personalverwaltung · Anwesenheit & Noten · Hausaufgaben & Unterricht · Stundenpläne · Eltern- & Schüler-Dashboards · Kommunikation & Berichte",
      },
      {
        heading: "Das Ergebnis",
        body: "Eine übersichtliche, vernetzte Schulplattform, die Verwaltungsprozesse vereinfacht und Informationen für alle Beteiligten zentral zugänglich macht.",
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
