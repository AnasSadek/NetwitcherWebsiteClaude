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
    /** Social-Reels (z. B. Instagram): leichte Vorschaukarten, der Player
     *  wird erst beim Klick eingebettet — nie fünf schwere Embeds vorab. */
    reels?: { href: string; title: string; label: string; quote: string }[];
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
    title: "E-Commerce-Erlebnis für eine moderne Home-Fragrance-Marke",
    description:
      "Ein conversion-orientiertes E-Commerce-Erlebnis für FridaEU, das Raumdüfte, duftende Reinigungsprodukte und individuell zusammenstellbare Duft-Bundles in einem modernen und ansprechenden Online-Shop vereint.",
    year: 2025,
    categories: ["ecommerce", "web", "design"],
    services: ["E-Commerce", "Markenerlebnis", "Webdesign"],
    color: "sky",
    featured: true,
    logo: "/portfolio/frida-eu/logo.webp",
    cover: {
      src: "/portfolio/frida-eu/cover.webp",
      alt: "FridaEU, Duft-Bundle-Komposition der Home-Fragrance-Marke",
      ratio: "1/1",
    },
    screenSections: [
      {
        title: "Düfte entdecken",
        body: [
          "Anstatt jeden Duft lediglich als einzelnes Produkt zu präsentieren, werden die verschiedenen Düfte in unterschiedliche Duftwelten eingeordnet: Orientalisch – warme, intensive und ausdrucksstarke Düfte · Fruchtig – lebendige und energiegeladene Duftprofile · Frisch & Sauber – leichte Düfte, die das Gefühl eines frisch gereinigten Zuhauses vermitteln · Blumig – sanfte und harmonische Dufterlebnisse.",
          "Diese Struktur macht ein umfangreiches Duftsortiment leichter verständlich und ermöglicht es Kunden, Produkte passend zu ihrer Stimmung und ihren persönlichen Vorlieben zu entdecken.",
        ],
        screens: [
          { src: "/portfolio/frida-eu/duftwelten.webp", alt: "FridaEU, Duftvarianten in verschiedenen Duftwelten", ratio: "1/1" },
        ],
      },
      {
        title: "Produktorientiertes Shopping-Erlebnis",
        body: [
          "Der Online-Shop wurde so aufgebaut, dass die wichtigsten kaufrelevanten Informationen sofort zugänglich sind. Kunden können schnell verschiedene Produktbereiche entdecken: Lufterfrischer · Duftende Reinigungsprodukte · Duft-Bundles · Verschiedene Duftvarianten · Bestseller · Sonderangebote.",
          "Direkte Produktinteraktionen und klare Call-to-Actions verkürzen den Weg von der Produktentdeckung bis zum Kauf.",
        ],
        screens: [
          { src: "/portfolio/frida-eu/shop-01.webp", alt: "FridaEU, Lufterfrischer und Raumdüfte im Sortiment", ratio: "1/1" },
          { src: "/portfolio/frida-eu/shop-02.webp", alt: "FridaEU, duftende Reinigungsprodukte", ratio: "1/1" },
        ],
      },
      {
        title: "Individuell zusammenstellbare Bundles",
        body: [
          "Bundles spielen eine wichtige Rolle innerhalb des Einkaufserlebnisses. Anstatt Kunden ausschließlich vorgefertigte Kombinationen anzubieten, können sie ihre eigenen Duftsets entsprechend ihren persönlichen Vorlieben zusammenstellen.",
          "Dadurch wird aus einem klassischen Produkt-Bundle ein persönlicheres Einkaufserlebnis, das gleichzeitig dazu motiviert, mehrere Düfte der Marke zu entdecken und auszuprobieren.",
        ],
        screens: [
          { src: "/portfolio/frida-eu/hero.webp", alt: "FridaEU, individuell zusammenstellbares Duft-Set", ratio: "1/1" },
        ],
      },
      {
        title: "Brand Storytelling",
        body: [
          "Bei FridaEU geht es um mehr als nur Reinigung. Das Markenerlebnis verbindet Düfte mit dem Gefühl, in ein frisches und einladendes Zuhause zurückzukehren.",
          "Produktvorteile, Duftbeschreibungen, Lifestyle-Inhalte, Anwendungshinweise und Kundenerfahrungen arbeiten gemeinsam daran, diese Markenidee entlang der gesamten Customer Journey zu vermitteln.",
        ],
        screens: [
          { src: "/portfolio/frida-eu/storytelling.webp", alt: "FridaEU, Bildwelt der Marke mit Früchten und Blüten", ratio: "1/1" },
        ],
      },
      {
        title: "Content & Social Media",
        body: [
          "Neben dem E-Commerce-Erlebnis wurde die Marke auch durch aufmerksamkeitsstarken Social Content weiterentwickelt. Für FridaEU entstanden unterschiedliche Videoformate, die Produkte, Duftwelten und die Persönlichkeit der Marke auf unterhaltsame und plattformgerechte Weise vermitteln.",
          "Von humorvollen Storytelling-Formaten über Produktinszenierungen bis hin zu Kampagnen rund um Duft-Bundles wurde Content entwickelt, der die Marke näher an ihre Community bringt und gleichzeitig die Produktentdeckung unterstützt. Die Inhalte wurden insbesondere für Social-Media-Plattformen wie Instagram und TikTok konzipiert und verbinden Markenkommunikation mit Unterhaltung und Produktpräsentation.",
        ],
        screens: [],
        reels: [
          {
            href: "https://www.instagram.com/reel/DbgOB2qDKIK/",
            title: "Video 01",
            label: "Humor & Brand Awareness",
            quote: "Kauf Frida nicht, wenn du lieber unauffällig bleiben möchtest!",
          },
          {
            href: "https://www.instagram.com/reel/DcQcFE9gJEf/",
            title: "Video 02",
            label: "Storytelling & Entertainment",
            quote: "Frida hat um einen dringenden Termin gebeten.",
          },
          {
            href: "https://www.instagram.com/reel/DVHBZEmEbrY/",
            title: "Video 03",
            label: "Product Bundles & Commerce",
            quote: "Wähle dein Paket – ganz nach deinem Geschmack.",
          },
          {
            href: "https://www.instagram.com/reel/DU3kdkXijd2/",
            title: "Video 04",
            label: "Brand Atmosphere & Product Storytelling",
            quote: "Weil jede Ecke in deinem Zuhause ihr eigenes Gefühl verdient.",
          },
          {
            href: "https://www.instagram.com/reel/DbdpUKZD6dM/",
            title: "Video 05",
            label: "Character Content & Brand Personality",
            quote: "Exklusives Interview mit Frida.",
          },
        ],
      },
      {
        title: "Social Proof & Community",
        body: "Bewertungen, Kundenstimmen, Community-Inhalte und reale Produkterfahrungen stärken das Vertrauen potenzieller Kunden. Durch die Integration von Social Content in das Einkaufserlebnis wird der Online-Shop mit der Frida-Community verbunden und die Marke wirkt authentischer und nahbarer.",
        screens: [],
      },
      {
        title: "Mehrsprachiges Erlebnis",
        body: "Mit Kunden in Deutschland und auf dem europäischen Markt spielt die sprachliche Zugänglichkeit eine wichtige Rolle für das digitale Markenerlebnis. Die Plattform unterstützt mehrere Sprachen und ermöglicht FridaEU dadurch, Kunden mit unterschiedlichen sprachlichen Hintergründen ein stärker lokalisiertes Einkaufserlebnis zu bieten.",
        screens: [],
      },
      {
        title: "Mobile-First Commerce",
        body: "Für eine Consumer Brand, bei der Produktentdeckung und Social Content eine zentrale Rolle spielen, ist die mobile Nutzererfahrung besonders wichtig. Der Online-Shop wurde daher auf eine schnelle Produktentdeckung, klare Call-to-Actions und einfache Interaktionen ausgerichtet, damit Kunden auch über ihr Smartphone problemlos Produkte entdecken und kaufen können.",
        screens: [],
      },
      {
        title: "Das Ergebnis",
        body: "FridaEU hat sich zu mehr als einem klassischen Online-Produktkatalog entwickelt. Das digitale Erlebnis verbindet Brand Storytelling, Duftentdeckung, Produktinformationen, Social Proof und E-Commerce zu einer durchgängigen Customer Journey. Das Ergebnis ist eine E-Commerce-Plattform, die nicht nur Produkte verkauft, sondern gleichzeitig eine wiedererkennbare Consumer Brand rund um das Gefühl eines frischen und einladenden Zuhauses aufbaut.",
        screens: [],
      },
    ],
    story: [
      {
        heading: "Überblick",
        body: "FridaEU ist eine Marke für Raumdüfte und Reinigungsprodukte mit einem stetig wachsenden Sortiment aus Lufterfrischern, duftenden Reinigungsprodukten und Duft-Bundles. Unser Ziel war es, ein E-Commerce-Erlebnis zu schaffen, das über die reine Präsentation von Produkten hinausgeht und die Entdeckung verschiedener Düfte zu einer ansprechenden digitalen Shopping Journey macht.",
      },
      {
        heading: "Die Herausforderung",
        body: "Düfte sind emotional und sprechen die Sinne an. Beim Online-Verkauf entsteht dadurch eine besondere Herausforderung: Kunden können einen Duft vor dem Kauf nicht selbst riechen. Die digitale Erfahrung musste daher den Charakter jedes Duftes vermitteln, ein wachsendes Produktsortiment leicht zugänglich machen und Kunden genügend Sicherheit geben, um den passenden Duft für ihr Zuhause auszuwählen. Gleichzeitig sollte der gesamte Einkaufsprozess schnell, übersichtlich und conversion-orientiert bleiben.",
      },
      {
        heading: "Die Lösung",
        body: "Wir haben ein produktorientiertes E-Commerce-Erlebnis entwickelt, das starkes visuelles Storytelling mit einem einfachen und intuitiven Einkaufsprozess verbindet. Die Produkte sind nach klar erkennbaren Duftwelten und Anwendungsbereichen strukturiert. Dadurch werden Kunden von der ersten Begegnung mit der Marke über die Auswahl eines Duftes bis hin zum Kauf mit möglichst wenig Reibung durch die Customer Journey geführt.",
      },
    ],
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
