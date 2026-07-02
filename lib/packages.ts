import type { AccentColor } from "./services";

export type ContentPackage = {
  name: string;
  color: AccentColor;
  tagline: string;
  forWhom: string;
  includes: string[];
  cta: string;
  highlight?: boolean;
};

export const packagesNote =
  "Alle Pakete werden individuell auf Zielgruppe, Branche und Plattform abgestimmt – du zahlst für Wirkung, nicht für Posten auf einer Liste.";

export const contentPackages: ContentPackage[] = [
  {
    name: "Starter Content",
    color: "mint",
    tagline: "Der professionelle Einstieg",
    forWhom:
      "Für Unternehmen, die endlich Content wollen, der nach Marke aussieht – ohne gleich ein ganzes Marketing-Team aufzubauen.",
    includes: [
      "Content-Konzept & Look-Definition",
      "Studio-Shooting-Tag in Berlin",
      "Produktfotos oder Team-Bilder",
      "Erste Reels für Instagram & TikTok",
      "Bildmaterial für Website & Profile",
    ],
    cta: "Starter anfragen",
  },
  {
    name: "Growth Content",
    color: "sky",
    tagline: "Sichtbarkeit mit System",
    forWhom:
      "Für Marken, die regelmäßig sichtbar sein wollen: monatliche Produktion plus Kanal-Betreuung – Content und Posting aus einer Hand.",
    includes: [
      "Monatlicher Produktions-Slot im Studio",
      "Reels, Posts & Stories nach Redaktionsplan",
      "Social Media Management inklusive",
      "Community Management",
      "Monatlicher Report mit Empfehlungen",
    ],
    cta: "Growth anfragen",
    highlight: true,
  },
  {
    name: "Performance Content",
    color: "violet",
    tagline: "Content, der Kampagnen antreibt",
    forWhom:
      "Für Unternehmen, die Werbung schalten: laufende Creative-Produktion plus Kampagnen-Management auf Meta, TikTok oder Google.",
    includes: [
      "Ad-Creatives aus dem Studio (Video & Static)",
      "Strukturierte Creative-Tests",
      "Kampagnen-Setup & -Optimierung",
      "Conversion-Tracking & Landingpage-Check",
      "Transparentes Performance-Reporting",
    ],
    cta: "Performance anfragen",
  },
  {
    name: "Full-Service Marketing",
    color: "pink",
    tagline: "Dein komplettes Marketing-Team",
    forWhom:
      "Für Unternehmen, die Wachstum ernst meinen: Strategie, Content, Social Media, Ads, Website und SEO – koordiniert von einem Team mit einem Ziel.",
    includes: [
      "Marketing-Strategie & Quartalsplanung",
      "Content-Produktion & Social Media",
      "Performance-Kampagnen",
      "Website-Weiterentwicklung & SEO",
      "Fester Ansprechpartner & Monats-Review",
    ],
    cta: "Full-Service anfragen",
  },
];
