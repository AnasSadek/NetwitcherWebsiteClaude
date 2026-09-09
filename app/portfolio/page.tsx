import type { Metadata } from "next";
import { ClientStrip } from "@/components/portfolio/ClientStrip";
import { PortfolioCTA } from "@/components/portfolio/PortfolioCTA";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { ServiceSpectrum } from "@/components/portfolio/ServiceSpectrum";
import { WorkIndex } from "@/components/portfolio/WorkIndex";
import { categoriesInUse, portfolioProjects, stripMedia } from "@/lib/portfolio";
import { site } from "@/lib/site";

const description =
  "Ausgewählte Websites, Social-Media-Kampagnen, Videos, Designs, Software und digitale Erlebnisse von Netwitcher, Digital Agency & Content-Studio Berlin.";

export const metadata: Metadata = {
  title: "Unsere Arbeiten",
  description,
  alternates: { canonical: "/portfolio" },
  openGraph: {
    type: "website",
    title: "Unsere Arbeiten | Netwitcher",
    description,
    url: "/portfolio",
  },
  twitter: { card: "summary_large_image" },
};

export default function PortfolioPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Unsere Arbeiten",
    description,
    url: `${site.url}/portfolio`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: portfolioProjects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${site.url}/portfolio/${p.slug}`,
        name: `${p.client}: ${p.title}`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortfolioHero items={stripMedia()} count={portfolioProjects.length} />
      <div className="mx-auto max-w-[1500px] px-5 pt-14 sm:px-8 md:pt-20">
        <WorkIndex projects={portfolioProjects} categories={categoriesInUse()} />
      </div>
      <div className="mt-24 md:mt-32">
        <ClientStrip projects={portfolioProjects} />
      </div>
      <ServiceSpectrum />
      <PortfolioCTA />
    </>
  );
}
