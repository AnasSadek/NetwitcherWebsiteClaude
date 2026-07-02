import type { AccentColor } from "./services";

export type CaseStudy = {
  slug: string;
  category: string;
  title: string;
  color: AccentColor;
  challenge: string;
  solution: string;
  result: string;
  services: string[];
};

/**
 * Elegante Platzhalter-Cases nach Branchen – bereit, mit echten Projekten,
 * Kundennamen und Kennzahlen befüllt zu werden.
 */
export const cases: CaseStudy[] = [
  {
    slug: "restaurant-food-content",
    category: "Restaurant & Food Content",
    title: "Vom leeren Feed zum vollen Laden",
    color: "sun",
    challenge:
      "Ein Berliner Restaurant mit starker Küche, aber schwachem Auftritt: Handyfotos im Feed, keine Reels, kaum Reservierungen über Instagram.",
    solution:
      "Food-Shooting im Studio und vor Ort, monatliche Reels-Produktion mit Gerichten und Team, neue Speisekarte im Branding und lokale Meta-Kampagne auf Reservierungen.",
    result:
      "Ergebnis-Platzhalter: Reichweite, Profilbesuche und Reservierungen über Social Media – echte Kennzahlen folgen nach Projektfreigabe.",
    services: ["Food-Fotografie", "Reels", "Printdesign", "Meta Ads"],
  },
  {
    slug: "beauty-cosmetics",
    category: "Beauty & Kosmetik",
    title: "Produktbilder, die den Warenkorb füllen",
    color: "pink",
    challenge:
      "Eine Kosmetikmarke mit hochwertigem Produkt, dessen Fotos den Preis nicht rechtfertigten – hohe Klickzahlen, aber schwache Conversion im Shop.",
    solution:
      "Produktfotografie mit Set-Design und Neon-Akzenten im Studio, UGC-Reels für Ads, überarbeitete Produktseiten und strukturierte Creative-Tests auf Meta und TikTok.",
    result:
      "Ergebnis-Platzhalter: Conversion-Rate der Produktseiten und Cost-per-Purchase der Kampagnen – Kennzahlen folgen nach Projektfreigabe.",
    services: ["Produktfotografie", "UGC-Content", "TikTok Ads", "Shop-Optimierung"],
  },
  {
    slug: "ecommerce-produkte",
    category: "E-Commerce Produkte",
    title: "Ein Shooting, ein kompletter Shop-Relaunch",
    color: "mint",
    challenge:
      "Ein Online-Shop mit wachsendem Sortiment, aber uneinheitlichen Produktbildern aus drei Quellen – die Marke wirkte kleiner, als sie war.",
    solution:
      "Einheitliches Bildkonzept, Produktfotografie-Serie für das gesamte Sortiment im Studio Berlin, schnellere Produktseiten und sauberes Tracking-Setup.",
    result:
      "Ergebnis-Platzhalter: einheitliche Bildwelt über das komplette Sortiment, verbesserte Ladezeiten und messbare Shop-Kennzahlen nach Freigabe.",
    services: ["E-Commerce-Fotografie", "Webdesign", "Speed-Optimierung", "Analytics"],
  },
  {
    slug: "handwerk-lokale-dienstleistungen",
    category: "Handwerk & lokale Dienstleistungen",
    title: "Sichtbar in Berlin, wenn Kunden suchen",
    color: "sky",
    challenge:
      "Ein Handwerksbetrieb mit vollem Auftragsbuch über Empfehlungen – aber ohne digitale Sichtbarkeit für die nächste Wachstumsstufe.",
    solution:
      "Neue Website mit klarer Leistungsstruktur, Local-SEO-Setup mit Google-Business-Profil, Team- und Baustellenfotografie sowie Google Ads auf die stärksten Leistungen.",
    result:
      "Ergebnis-Platzhalter: lokale Rankings, Anrufe über das Google-Profil und Anfragen über die Website – Kennzahlen folgen nach Freigabe.",
    services: ["Webdesign", "Local SEO", "Fotografie", "Google Ads"],
  },
  {
    slug: "b2b-websites",
    category: "B2B Websites",
    title: "Vom PDF-Anhang zur digitalen Vertriebsmaschine",
    color: "violet",
    challenge:
      "Ein B2B-Dienstleister, dessen Website ein Online-Prospekt war: viel Text, keine Struktur, keine messbaren Anfragen – der Vertrieb lief komplett manuell.",
    solution:
      "Neupositionierung der Startseite auf Zielgruppen-Probleme, Referenz- und Prozess-Seiten, professionelle Team-Fotografie und LinkedIn-Content zur Begleitung des Vertriebs.",
    result:
      "Ergebnis-Platzhalter: qualifizierte Anfragen über die Website und Sichtbarkeit des Teams auf LinkedIn – Kennzahlen folgen nach Freigabe.",
    services: ["Webdesign", "Content-Strategie", "Fotografie", "LinkedIn-Content"],
  },
  {
    slug: "social-media-campaigns",
    category: "Social Media Kampagnen",
    title: "Creative-Tests statt Bauchgefühl",
    color: "pink",
    challenge:
      "Eine Marke schaltete seit Monaten dieselben zwei Anzeigen – steigende Klickpreise, sinkende Ergebnisse, keine neuen Impulse.",
    solution:
      "Monatliche Creative-Produktion im Studio (Reels, Statics, UGC), strukturierte A/B-Tests, sauberes Conversion-Tracking und Skalierung der Gewinner-Varianten.",
    result:
      "Ergebnis-Platzhalter: Cost-per-Lead und Return on Ad Spend im Kampagnenverlauf – Kennzahlen folgen nach Freigabe.",
    services: ["Creative-Produktion", "Meta Ads", "Tracking", "Reporting"],
  },
];
