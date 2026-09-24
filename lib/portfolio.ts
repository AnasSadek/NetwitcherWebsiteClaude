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
  /** Zeigt das Auftaktbild (Composition aus `screens[0]`) vollständig via
   *  `object-fit: contain` statt beschnitten via `cover` — für Bilder,
   *  deren Seitenverhältnis nicht in das Standard-16/10-Raster passt. */
  heroContain?: boolean;
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
  /** Zeigt die `gallery`-Screenshots (grosses Bild + Thumbnails) innerhalb
   *  eines Laptop-Bildschirm-Rahmens statt als plane Screenshots. */
  galleryFrame?: "laptop";
  /** Zeigt das Cover-Bild in der Portfolio-Hero-Filmrolle vollständig via
   *  `object-fit: contain` statt beschnitten via `cover` — für Cover-Bilder,
   *  deren Seitenverhältnis nicht exakt in die Kachel passt. */
  stripFit?: "contain";
  /** Eigener Funktionen-Abschnitt (Eyebrow, Überschrift, Intro + Karten mit
   *  Icon/Titel/Beschreibung), rein textbasiert — kein Bild. Rendert direkt
   *  vor `gallery`/`screenSections`/`screens`, wenn gesetzt. */
  features?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    /** Eigener Akzentfarben-Zyklus (Hex) für die Karten, z. B. eine
     *  Markenfarbe ausserhalb der 5 Logo-Stern-Farben. Fehlt er, wird der
     *  Standard-Zyklus aus den Logo-Stern-Farben verwendet. */
    accentColors?: string[];
    items: {
      icon:
        | "users"
        | "calendar-check"
        | "book"
        | "message-circle"
        | "bar-chart"
        | "shield-check"
        | "inbox"
        | "calendar"
        | "sliders"
        | "map-pin"
        | "list-checks"
        | "package";
      title: string;
      description: string;
    }[];
  };
  /** Eigener Leistungen-Abschnitt (Eyebrow, Überschrift, Intro-Absätze,
   *  Karten mit Icon/Titel/Beschreibung, optionale Abschluss-Aussage) —
   *  unabhängig von `features`: rendert am Seitenende, nach dem übrigen
   *  Projektinhalt und vor Next-Project/CTA. */
  servicesSection?: {
    eyebrow?: string;
    heading?: string;
    intro?: string | string[];
    /** Eigener Akzentfarben-Zyklus (Hex). Fehlt er, wird `color` des
     *  Projekts einheitlich für alle Karten verwendet. */
    accentColors?: string[];
    items: {
      icon:
        | "shopping-bag"
        | "share"
        | "video"
        | "target"
        | "trending-up"
        | "shopping-cart"
        | "laptop"
        | "monitor"
        | "app-window"
        | "search";
      title: string;
      description: string;
    }[];
    closingStatement?: string;
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
  /** Blendet die "DAS PRODUKT."-Anzeige der `screens` im Inhaltsbereich aus
   *  (z. B. wenn `screens` nur fuer das Auftaktbild dient und keine zweite,
   *  redundante Anzeige derselben Komposition gewuenscht ist). */
  hideScreensShowcase?: boolean;
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
      src: "/portfolio/fekrahub/hero-image-fekrahub.webp",
      alt: "FekraHub, Übersicht der Schulmanagement-Plattform",
      ratio: "16/10",
    },
    /* Kompositionen (Auftaktbild, Featured-Bühne, Filmstreifen) */
    screens: [
      {
        src: "/portfolio/fekrahub/hero-image-fekrahub.webp",
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
    servicesSection: {
      eyebrow: "UNSERE LEISTUNGEN",
      heading: "VON DER IDEE ZUR DIGITALEN PLATTFORM",
      intro:
        "Für FekraHub haben wir Markenauftritt, digitale Produktentwicklung und Content miteinander verbunden – von der Website bis zur leistungsfähigen Web Application und visuellen Kommunikation.",
      accentColors: ["#0FB9F2", "#8B5CF6", "#0FB9F2"],
      items: [
        {
          icon: "monitor",
          title: "Webdesign & Entwicklung",
          description: "Konzeption und Entwicklung einer modernen Website, die FekraHub klar positioniert und die Plattform verständlich präsentiert.",
        },
        {
          icon: "app-window",
          title: "Software / Web Application",
          description: "Entwicklung einer zentralen Web Application für Schulverwaltung, Kommunikation, Unterricht und digitale Prozesse.",
        },
        {
          icon: "video",
          title: "Videoproduktion",
          description: "Produktion visueller Inhalte und Videos, die Funktionen, Vorteile und Anwendungsmöglichkeiten von FekraHub verständlich vermitteln.",
        },
      ],
      closingStatement:
        "Design, Technologie und Content greifen bei FekraHub ineinander – für eine digitale Plattform, die nicht nur leistungsfähig funktioniert, sondern auch klar kommuniziert und professionell präsentiert wird.",
    },
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
    servicesSection: {
      eyebrow: "UNSERE LEISTUNGEN",
      heading: "VON E-COMMERCE BIS PERFORMANCE MARKETING",
      intro: [
        "Für FridaEU haben wir nicht nur einen Online-Shop entwickelt, sondern ein ganzheitliches digitales Ökosystem aufgebaut, das Marke, Content, Commerce und Performance Marketing miteinander verbindet.",
        "Von der technischen E-Commerce-Basis über Social Content bis hin zu Paid Ads und Social Commerce begleiten wir die Marke entlang der gesamten digitalen Customer Journey.",
      ],
      items: [
        {
          icon: "shopping-bag",
          title: "E-Commerce Online Shop",
          description: "Ein conversion-orientierter Online-Shop, der Produktentdeckung, Markenwelt und einen einfachen Kaufprozess miteinander verbindet.",
        },
        {
          icon: "share",
          title: "Social Media Marketing",
          description: "Strategische Social-Media-Kommunikation für mehr Sichtbarkeit, Markenbindung und eine aktive Community.",
        },
        {
          icon: "video",
          title: "Video & Reels Produktion",
          description: "Kreative Videoformate und Reels, die Produkte emotional inszenieren und Aufmerksamkeit in sozialen Netzwerken erzeugen.",
        },
        {
          icon: "target",
          title: "Meta Ads",
          description: "Performance-Kampagnen auf Facebook und Instagram mit Fokus auf Reichweite, Produktentdeckung und Conversions.",
        },
        {
          icon: "trending-up",
          title: "TikTok Ads",
          description: "Plattformgerechte Kampagnen, die kreative Inhalte mit performance-orientierter Ausspielung verbinden.",
        },
        {
          icon: "shopping-cart",
          title: "TikTok Shop",
          description: "Aufbau und Integration von Social Commerce, damit Produkte direkt dort entdeckt und gekauft werden können, wo Content konsumiert wird.",
        },
      ],
      closingStatement:
        "Nicht einzelne Maßnahmen, sondern ein vernetztes System: Shop, Content, Social Media und Paid Ads greifen ineinander und machen FridaEU digital sichtbar, erlebbar und kaufbar.",
    },
  },
  {
    slug: "abziel",
    client: "ABZIEL",
    title: "Social Media & Reels",
    description:
      "ABZiel verbindet Bildung, Integration und berufliche Entwicklung in einer starken digitalen Marke. Mit einem modernen Webauftritt, strategischem Social Media Marketing und performance-orientierten Kampagnen machen wir Angebote sichtbar, schaffen Vertrauen und bringen Menschen gezielt mit den passenden Bildungs- und Coachingangeboten zusammen.",
    year: 2025,
    categories: ["social-video"],
    services: ["Webdesign", "Social Media Marketing", "Performance Marketing"],
    color: "sky",
    stripFit: "contain",
    logo: "/portfolio/abziel/logo.png",
    cover: {
      src: "/portfolio/abziel/hero-abziel.webp",
      alt: "ABZiel, Website auf Laptop, Tablet und Smartphone",
      ratio: "16/9",
    },
    /* Kompositionen (Auftaktbild) */
    screens: [
      {
        src: "/portfolio/abziel/hero-abziel.webp",
        alt: "ABZiel, Website auf Laptop, Tablet und Smartphone",
        ratio: "16/9",
      },
    ],
    heroContain: true,
    screenSections: [
      {
        title: "Social Content & Sichtbarkeit",
        body: [
          "Neben dem neuen Webauftritt wird ABZiel durch kreative Social-Media-Inhalte sichtbar gemacht.",
          "Kurze, aufmerksamkeitsstarke Reels vermitteln Bildungs- und Coachingangebote verständlich und stärken die Verbindung zur Zielgruppe auf Instagram.",
        ],
        screens: [],
        reels: [
          { href: "https://www.instagram.com/reel/DMN4j9Wqxvm/" },
          { href: "https://www.instagram.com/reel/DWy6YdfjOSL/" },
          { href: "https://www.instagram.com/reel/DWg4J9GCsat/" },
          { href: "https://www.instagram.com/reel/DUgi9cvDPwy/" },
          { href: "https://www.instagram.com/reel/DbYulPnMAxo/" },
        ],
      },
    ],
    servicesSection: {
      eyebrow: "UNSERE LEISTUNGEN",
      heading: "DIGITALE SICHTBARKEIT, DIE VERBINDET",
      intro:
        "Für ABZiel haben wir Webdesign, Social Media und Performance Marketing zu einem ganzheitlichen digitalen Auftritt verbunden – mit dem Ziel, Bildungsangebote sichtbar zu machen, Vertrauen aufzubauen und neue Zielgruppen effektiv zu erreichen.",
      accentColors: ["#0F85C0", "#292952", "#AA2422", "#0F85C0"],
      items: [
        {
          icon: "share",
          title: "Social Media Marketing",
          description: "Strategische Inhalte und laufende Kommunikation, die ABZiel sichtbar machen und eine starke Verbindung zur Zielgruppe schaffen.",
        },
        {
          icon: "monitor",
          title: "Webdesign & Entwicklung",
          description: "Konzeption und Entwicklung eines modernen Webauftritts, der Angebote verständlich präsentiert und Nutzer gezielt zur Kontaktaufnahme führt.",
        },
        {
          icon: "target",
          title: "Meta Ads",
          description: "Performance-Kampagnen auf Facebook und Instagram zur gezielten Ansprache neuer Interessenten und zur Steigerung relevanter Anfragen.",
        },
        {
          icon: "trending-up",
          title: "TikTok Ads",
          description: "Kreative, plattformgerechte Kampagnen, die Aufmerksamkeit schaffen und neue Zielgruppen über TikTok erreichen.",
        },
      ],
      closingStatement:
        "Website, Content und Performance Marketing greifen bei ABZiel ineinander – für mehr Sichtbarkeit, mehr Vertrauen und eine stärkere digitale Verbindung zwischen Bildungsangeboten und den Menschen, die sie brauchen.",
    },
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
    slug: "umzugly",
    client: "Umzugly",
    title: "Umzüge digital planen und verwalten",
    description:
      "Eine digitale Plattform, die den gesamten Umzugsprozess von der Anfrage und Datenerfassung bis zur Terminplanung und internen Verwaltung in einem zentralen System verbindet.",
    year: 2025,
    categories: ["software"],
    services: ["UI/UX Design", "Webanwendung", "Buchungsprozess", "SaaS-Entwicklung"],
    industry: "Moving & Logistics",
    color: "pink",
    heroContain: true,
    galleryFrame: "laptop",
    logo: "/portfolio/umzugly/logo.webp",
    cover: {
      src: "/portfolio/umzugly/image-Umzugly.png",
      alt: "Umzugly, Übersicht der Umzugsplattform",
      ratio: "16/9",
    },
    /* Kompositionen (Auftaktbild, Featured-Bühne, Filmstreifen) */
    screens: [
      {
        src: "/portfolio/umzugly/image-Umzugly.png",
        alt: "Umzugly, Umzugsplattform auf Laptop, Tablet und Smartphone",
        ratio: "16/9",
      },
    ],
    features: {
      eyebrow: "WARUM UMZUGLY",
      heading: "ZENTRALE FUNKTIONEN",
      intro: "Ein digitaler Workflow für Anfrage, Planung und Verwaltung.",
      accentColors: ["#E30613", "#F2684B", "#E30613", "#F4718C", "#E30613", "#F2684B"],
      items: [
        { icon: "inbox", title: "Umzugsanfragen", description: "Alle Anfragen und Status zentral verwalten." },
        { icon: "calendar", title: "Terminplanung", description: "Umzugstermine übersichtlich im Kalender organisieren." },
        { icon: "sliders", title: "Flexible Preislogik", description: "Leistungen und Preise individuell konfigurieren." },
        { icon: "map-pin", title: "Einsatzgebiet & Distanz", description: "Servicegebiete und Entfernungen flexibel festlegen." },
        { icon: "list-checks", title: "Geführter Anfrageprozess", description: "Kunden Schritt für Schritt durch den Umzug führen." },
        { icon: "package", title: "Zusatzleistungen", description: "Services wie Verpackung, Montage oder Reinigung erfassen." },
      ],
    },
    /* Featured-Galerie: grosses Bild + Thumbnail-Slider darunter */
    gallery: [
      { label: "Anfrageverwaltung", image: { src: "/portfolio/umzugly/gallery-request-overview.jpg", alt: "Umzugly, Übersicht aller Umzugsanfragen mit Status", ratio: "4/3" } },
      { label: "Umzugsdetails", image: { src: "/portfolio/umzugly/gallery-moving-details.jpg", alt: "Umzugly, geführte Erfassung von Auszugsort und Umzugsdetails", ratio: "4/3" } },
      { label: "Terminkalender", image: { src: "/portfolio/umzugly/gallery-calendar.jpg", alt: "Umzugly, interner Kalender mit Umzugsterminen", ratio: "4/3" } },
      { label: "Zusatzleistungen", image: { src: "/portfolio/umzugly/gallery-additional-services.jpg", alt: "Umzugly, Auswahl von Zusatzleistungen wie Verpackung und Montage", ratio: "4/3" } },
      { label: "Preiskonfiguration", image: { src: "/portfolio/umzugly/gallery-pricing-config.jpg", alt: "Umzugly, Konfiguration von Preisen und Leistungen", ratio: "4/3" } },
      { label: "Einzugsort", image: { src: "/portfolio/umzugly/gallery-destination.jpg", alt: "Umzugly, Erfassung des Einzugsorts im Anfrageprozess", ratio: "4/3" } },
      { label: "Zusatzleistungen (Einzug)", image: { src: "/portfolio/umzugly/gallery-move-in-services.jpg", alt: "Umzugly, Auswahl von Zusatzleistungen für den Einzug", ratio: "4/3" } },
      { label: "Servicegebiet", image: { src: "/portfolio/umzugly/gallery-service-area.jpg", alt: "Umzugly, Einstellung von Servicegebiet und maximaler Entfernung", ratio: "4/3" } },
      { label: "Anpassen", image: { src: "/portfolio/umzugly/gallery-customization.jpg", alt: "Umzugly, Anpassen von Kontaktformular und Dankesseite", ratio: "4/3" } },
      { label: "Terminwahl", image: { src: "/portfolio/umzugly/gallery-date-selection.jpg", alt: "Umzugly, Terminwahl und Zahlungsquelle im Anfrageprozess", ratio: "4/3" } },
      { label: "Kontaktdaten", image: { src: "/portfolio/umzugly/gallery-contact.jpg", alt: "Umzugly, Erfassung der Kontaktdaten", ratio: "4/3" } },
      { label: "E-Mail-Bestätigung", image: { src: "/portfolio/umzugly/gallery-email-verification.jpg", alt: "Umzugly, Bestätigung der E-Mail-Adresse per Code", ratio: "4/3" } },
    ],
    story: [
      {
        heading: "Die Herausforderung",
        body: "Umzugsanfragen enthalten viele variable Informationen – von Adressen und Wohnungsdetails bis zu Zusatzleistungen und Terminen. Diese Daten effizient zu erfassen und intern zu verwalten, wird schnell komplex.",
      },
      {
        heading: "Die Lösung",
        body: "Wir entwickelten eine digitale Plattform, die Kunden Schritt für Schritt durch ihre Umzugsanfrage führt und Unternehmen gleichzeitig eine zentrale Oberfläche für Anfragen, Termine und Konfigurationen bietet.",
      },
      {
        heading: "Zentrale Funktionen",
        body: "Digitale Anfrage · Umzugsdetails · Zusatzleistungen · Terminplanung · Preis- und Leistungskonfiguration · Verwaltungsdashboard",
      },
      {
        heading: "Das Ergebnis",
        body: "Ein durchgängiger digitaler Workflow, der die Anfrage für Kunden vereinfacht und die interne Bearbeitung von Umzügen übersichtlicher und effizienter macht.",
      },
    ],
    servicesSection: {
      eyebrow: "UNSERE LEISTUNGEN",
      heading: "DIGITALES PRODUKT TRIFFT CONTENT",
      intro:
        "Für Umzugly haben wir Produktentwicklung und Content miteinander verbunden – mit einer individuellen WebApp für digitale Umzugsprozesse und aufmerksamkeitsstarken Reels für die Markenkommunikation.",
      accentColors: ["#E30613"],
      items: [
        {
          icon: "laptop",
          title: "WebApp",
          description: "Konzeption und Entwicklung einer digitalen WebApp, die Umzugsanfragen, Terminplanung und interne Prozesse in einem zentralen System vereint.",
        },
        {
          icon: "video",
          title: "Reels",
          description: "Kurze, dynamische Videoformate, die Umzugly sichtbar machen, Leistungen verständlich präsentieren und Aufmerksamkeit in sozialen Netzwerken schaffen.",
        },
      ],
      closingStatement:
        "Technologie und Content greifen bei Umzugly ineinander: Die WebApp vereinfacht den Prozess, während Reels die Marke nach außen sichtbar und verständlich machen.",
    },
  },
  {
    slug: "falioun-academy",
    client: "Falioun Academy",
    title: "Content & Performance Marketing",
    description:
      "Falioun Academy verbindet praxisnahe Weiterbildung mit echter Zukunftsperspektive. Mit einem intensiven Solar-Installer-Programm, realem Praxistraining und professionellen Planungstools werden Teilnehmer Schritt für Schritt auf den Einstieg in die Solarbranche vorbereitet – vom ersten technischen Verständnis bis zur professionellen Installation und Wartung.",
    year: 2025,
    categories: ["social-video"],
    services: ["Videoproduktion", "Performance Marketing"],
    color: "sun",
    heroContain: true,
    logo: "/portfolio/falioun-academy/logo.webp",
    cover: {
      src: "/portfolio/falioun-academy/hero-falioun.webp",
      alt: "Falioun Academy, Solar-Installer-Ausbildung",
      ratio: "16/9",
    },
    /* Kompositionen (Auftaktbild) */
    screens: [
      {
        src: "/portfolio/falioun-academy/hero-falioun.webp",
        alt: "Falioun Academy, Solar-Installer-Ausbildung",
        ratio: "16/9",
      },
    ],
    screenSections: [
      {
        title: "Social Content & Sichtbarkeit",
        body: [
          "Kurze, dynamische Reels zeigen Training, Praxis und Karrierechancen bei Falioun Academy authentisch und verständlich.",
          "Der Content macht das Ausbildungsangebot erlebbar und schafft Aufmerksamkeit für den Einstieg in die Solarbranche.",
        ],
        screens: [],
        reels: [
          { href: "https://www.instagram.com/reel/DV3rZmljuPk/" },
          { href: "https://www.instagram.com/reel/DQUIAuTABPu/" },
          { href: "https://www.instagram.com/reel/DO9L71Nitst/" },
        ],
      },
    ],
    servicesSection: {
      eyebrow: "UNSERE LEISTUNGEN",
      heading: "CONTENT UND PERFORMANCE FÜR MEHR SICHTBARKEIT",
      intro:
        "Für Falioun Academy haben wir visuelle Inhalte und performance-orientierte Kampagnen miteinander verbunden, um das Ausbildungsangebot verständlich zu präsentieren, Aufmerksamkeit zu schaffen und gezielt neue Teilnehmer zu erreichen.",
      accentColors: ["#E4141C", "#D1A61E"],
      items: [
        {
          icon: "video",
          title: "Videoproduktion",
          description: "Produktion dynamischer Videoformate und Reels, die Training, Praxis und Karrierechancen authentisch und verständlich vermitteln.",
        },
        {
          icon: "target",
          title: "Werbekampagnen & Meta Ads",
          description: "Gezielte Performance-Kampagnen auf Facebook und Instagram, um relevante Zielgruppen zu erreichen und qualifizierte Interessenten für die Academy zu gewinnen.",
        },
      ],
      closingStatement:
        "Starker Content trifft auf gezielte Performance: Videos machen das Angebot erlebbar, während Meta Ads die richtigen Menschen genau dort erreichen, wo Aufmerksamkeit entsteht.",
    },
  },
  {
    slug: "louic",
    client: "LOUIC",
    title: "Google Ads Kampagne",
    description:
      "LOUIC steht für schnelle, zuverlässige Abschlepp- und Transportservices rund um die Uhr. Mit 24/7-Erreichbarkeit, erfahrenen Fahrern und flexiblen Lösungen sorgt LOUIC dafür, dass Kunden bei Pannen, Unfällen oder Fahrzeugtransporten schnell und sicher weiterkommen.",
    year: 2025,
    categories: ["social-video"],
    services: ["Google Ads", "Performance Marketing"],
    color: "sun",
    heroContain: true,
    hideScreensShowcase: true,
    logo: "/portfolio/louic/logo.png",
    cover: {
      src: "/portfolio/louic/hero-louic.webp",
      alt: "LOUIC Autotransporter, Abschleppfahrzeug im Einsatz",
      ratio: "16/9",
    },
    /* Kompositionen (Auftaktbild) */
    screens: [
      {
        src: "/portfolio/louic/hero-louic.webp",
        alt: "LOUIC Autotransporter, Abschleppfahrzeug im Einsatz",
        ratio: "16/9",
      },
    ],
    servicesSection: {
      eyebrow: "UNSERE LEISTUNGEN",
      heading: "SICHTBAR, WENN SCHNELLE HILFE GEFRAGT IST",
      intro:
        "Für LOUIC setzen wir auf gezielte Google Ads, um Menschen genau in dem Moment zu erreichen, in dem sie aktiv nach Abschleppdienst, Pannenhilfe oder Fahrzeugtransport suchen.",
      accentColors: ["#F5C518"],
      items: [
        {
          icon: "search",
          title: "Google Ads",
          description: "Gezielte Suchkampagnen, die LOUIC genau dann sichtbar machen, wenn Menschen akut nach Abschleppdienst, Pannenhilfe oder Fahrzeugtransport suchen.",
        },
      ],
      closingStatement:
        "Mit Google Ads wird LOUIC im entscheidenden Moment gefunden – genau dann, wenn schnelle Hilfe gefragt ist.",
    },
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
  fit?: "contain";
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
    fit: p.stripFit,
  }));
}

/** Ratio-String → CSS aspect-ratio-Wert. */
export const ratioValue = (r: Ratio = "16/10") => r.replace("/", " / ");
