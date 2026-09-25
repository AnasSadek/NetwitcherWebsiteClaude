import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { site } from "@/lib/site";
import { ar as t } from "@/lib/i18n/dictionary";
import { cairo, tajawal } from "@/lib/i18n/fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "نتويتشر، وكالة رقمية واستوديو محتوى في برلين",
    template: "%s | نتويتشر برلين",
  },
  description:
    "نتويتشر هي وكالتك الرقمية واستوديو المحتوى الخاص بك في برلين: تصوير منتجات، ريلز، إنتاج فيديو، سوشيال ميديا، إعلانات، تصميم مواقع وتحسين محركات البحث — محتوى يجلب لك عملاء حقيقيين.",
  keywords: [
    "إنشاء محتوى برلين",
    "تصوير منتجات برلين",
    "وكالة سوشيال ميديا برلين",
    "إنتاج فيديو برلين",
    "وكالة تسويق رقمي برلين",
    "تصميم مواقع برلين",
    "وكالة SEO برلين",
  ],
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: site.name,
    title: "نتويتشر، وكالة رقمية واستوديو محتوى في برلين",
    description: "محتوى يلفت الانتباه. تسويق يبيع. صور، ريلز، حملات ومواقع من برلين.",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/ar",
    languages: { de: "/", ar: "/ar" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  slogan: site.slogan,
  description:
    "وكالة رقمية واستوديو محتوى في برلين: إنشاء محتوى، تصوير منتجات، إنتاج فيديو، إدارة سوشيال ميديا، تسويق أداء، تصميم مواقع، تحسين محركات بحث، هوية بصرية، تطوير برمجيات وتصميم مطبوعات.",
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
    "إنشاء محتوى",
    "تصوير منتجات",
    "إنتاج فيديو",
    "تسويق السوشيال ميديا",
    "تسويق الأداء",
    "تصميم المواقع",
    "تحسين محركات البحث",
    "الهوية البصرية",
  ],
};

export default function ArabicRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm"
        >
          {t.common.skipToContent}
        </a>
        <Header locale="ar" />
        <main id="main">{children}</main>
        <Footer locale="ar" />
        <WhatsAppButton locale="ar" />
      </body>
    </html>
  );
}
