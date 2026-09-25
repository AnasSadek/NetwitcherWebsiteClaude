import type { Metadata } from "next";
import { ClientStrip } from "@/components/portfolio/ClientStrip";
import { PortfolioCTA } from "@/components/portfolio/PortfolioCTA";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { ServiceSpectrum } from "@/components/portfolio/ServiceSpectrum";
import { WorkIndex } from "@/components/portfolio/WorkIndex";
import { categoriesInUseAr, portfolioProjectsAr, stripMediaAr } from "@/lib/portfolio.ar";
import { site } from "@/lib/site";

const description =
  "مواقع مختارة، حملات سوشيال ميديا، فيديوهات، تصاميم، برمجيات وتجارب رقمية من نتويتشر، وكالتك الرقمية واستوديو المحتوى في برلين.";

export const metadata: Metadata = {
  title: "أعمالنا",
  description,
  alternates: { canonical: "/ar/portfolio" },
  openGraph: {
    type: "website",
    title: "أعمالنا | نتويتشر",
    description,
    url: "/ar/portfolio",
  },
  twitter: { card: "summary_large_image" },
};

export default function PortfolioPageAr() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "أعمالنا",
    description,
    url: `${site.url}/ar/portfolio`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: portfolioProjectsAr.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${site.url}/ar/portfolio/${p.slug}`,
        name: `${p.client}: ${p.title}`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortfolioHero items={stripMediaAr()} count={portfolioProjectsAr.length} locale="ar" />
      <div className="mx-auto max-w-[1500px] px-5 pt-14 sm:px-8 md:pt-20">
        <WorkIndex projects={portfolioProjectsAr} categories={categoriesInUseAr()} locale="ar" />
      </div>
      <div className="mt-24 md:mt-32">
        <ClientStrip projects={portfolioProjectsAr} locale="ar" />
      </div>
      <ServiceSpectrum locale="ar" />
      <PortfolioCTA locale="ar" />
    </>
  );
}
