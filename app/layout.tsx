import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { site } from "@/lib/site";
import "./globals.css";

const orbitron = localFont({
  src: "./fonts/orbitron-var.woff2",
  variable: "--font-orbitron",
  weight: "500 900",
  display: "swap",
});

const grotesk = localFont({
  src: "./fonts/space-grotesk-var.woff2",
  variable: "--font-grotesk",
  weight: "300 700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Netwitcher – Digital Agency & Content-Studio Berlin",
    template: "%s | Netwitcher Berlin",
  },
  description:
    "Netwitcher ist deine Digital Agency und dein Content-Studio in Berlin: Produktfotografie, Reels, Videoproduktion, Social Media, Ads, Webdesign und SEO – Content, der Anfragen bringt.",
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
    title: "Netwitcher – Digital Agency & Content-Studio Berlin",
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
    <html lang="de" className={`${orbitron.variable} ${grotesk.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-night-700 focus:px-5 focus:py-3 focus:text-sm"
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
