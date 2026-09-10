import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { site } from "@/lib/site";
import "./globals.css";

// EP Boxi Bold – der offizielle Netwitcher-Display-Font, für Deutsch
// nachgerüstet: Ä/Ö/Ü wurden aus den Original-Outlines + quadratischen
// Punkten (Geometrie des Punkt-Glyphs) komponiert. Nur Versalien.
const epboxi = localFont({
  src: "./fonts/epboxi-display.woff2",
  variable: "--font-epboxi",
  weight: "700",
  display: "swap",
});

// Oxanium – umlautsicherer Zweit-Display-Font für gemischt gesetzte
// Überschriften der Unterseiten (EP-Boxi ist reine Versalschrift).
const oxanium = localFont({
  src: "./fonts/oxanium.woff2",
  variable: "--font-oxanium",
  weight: "400 800",
  display: "swap",
});

// Nunito Sans – lizenzfreier Ersatz für den Marken-Body-Font „Ballega".
const nunito = localFont({
  src: "./fonts/nunito-sans.woff2",
  variable: "--font-nunito",
  weight: "300 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Netwitcher, Digital Agency & Content-Studio Berlin",
    template: "%s | Netwitcher Berlin",
  },
  description:
    "Netwitcher ist deine Digital Agency und dein Content-Studio in Berlin: Produktfotografie, Reels, Videoproduktion, Social Media, Ads, Webdesign und SEO, Content, der Anfragen bringt.",
  keywords: [
    "Content Creation Berlin",
    "Produktfotografie Berlin",
    "Social Media Agentur Berlin",
    "Video Produktion Berlin",
    "Digital Marketing Agentur Berlin",
    "Webdesign Berlin",
    "SEO Agentur Berlin",
  ],
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: site.name,
    title: "Netwitcher, Digital Agency & Content-Studio Berlin",
    description:
      "Content, der auffällt. Marketing, das verkauft. Fotos, Reels, Kampagnen und Webseiten aus Berlin.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  slogan: site.slogan,
  description:
    "Digital Agency und Content-Studio in Berlin: Content Creation, Produktfotografie, Videoproduktion, Social Media Management, Performance Marketing, Webdesign, SEO, Branding, Softwareentwicklung und Printdesign.",
  url: site.url,
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressCountry: "DE",
  },
  areaServed: ["Berlin", "Deutschland"],
  sameAs: [site.instagram, site.linkedin, site.tiktok],
  knowsAbout: [
    "Content Creation",
    "Produktfotografie",
    "Videoproduktion",
    "Social Media Marketing",
    "Performance Marketing",
    "Webdesign",
    "SEO",
    "Branding",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${epboxi.variable} ${oxanium.variable} ${nunito.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm"
        >
          Zum Inhalt springen
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
