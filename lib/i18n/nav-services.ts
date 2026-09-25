/** Kompakte Nav-Variante der Leistungen (nur slug/href/navTitle) fürs
 *  Header-Dropdown und den Footer — unabhängig von der vollständigen
 *  lib/services.ts-Übersetzung, die die eigentlichen /leistungen/[slug]-
 *  Seiten speist. href ist unpräfixiert; Header/Footer hängen bei
 *  locale === "ar" selbst "/ar" davor. */
export type NavService = { slug: string; href: string; navTitle: string };

export const navServicesDe: NavService[] = [
  { slug: "foto-videoproduktion", href: "/leistungen/foto-videoproduktion", navTitle: "Foto- & Videoproduktion" },
  { slug: "social-media-management", href: "/leistungen/social-media-management", navTitle: "Social Media Management" },
  { slug: "performance-marketing", href: "/leistungen/performance-marketing", navTitle: "Performance Marketing / Ads" },
  { slug: "webdesign-ecommerce", href: "/leistungen/webdesign-ecommerce", navTitle: "Webdesign & E-Commerce" },
  { slug: "seo", href: "/leistungen/seo", navTitle: "SEO" },
  { slug: "branding-design", href: "/leistungen/branding-design", navTitle: "Branding & Design" },
  { slug: "softwareentwicklung", href: "/leistungen/softwareentwicklung", navTitle: "Softwareentwicklung" },
  { slug: "technischer-support", href: "/leistungen/technischer-support", navTitle: "Technischer Support" },
  { slug: "druck-printdesign", href: "/leistungen/druck-printdesign", navTitle: "Druck & Printdesign" },
];

export const navServicesAr: NavService[] = [
  { slug: "foto-videoproduktion", href: "/leistungen/foto-videoproduktion", navTitle: "التصوير وإنتاج الفيديو" },
  { slug: "social-media-management", href: "/leistungen/social-media-management", navTitle: "إدارة السوشيال ميديا" },
  { slug: "performance-marketing", href: "/leistungen/performance-marketing", navTitle: "التسويق الرقمي والإعلانات" },
  { slug: "webdesign-ecommerce", href: "/leistungen/webdesign-ecommerce", navTitle: "تصميم المواقع والمتاجر الإلكترونية" },
  { slug: "seo", href: "/leistungen/seo", navTitle: "تحسين محركات البحث SEO" },
  { slug: "branding-design", href: "/leistungen/branding-design", navTitle: "الهوية البصرية والتصميم" },
  { slug: "softwareentwicklung", href: "/leistungen/softwareentwicklung", navTitle: "تطوير البرمجيات" },
  { slug: "technischer-support", href: "/leistungen/technischer-support", navTitle: "الدعم الفني" },
  { slug: "druck-printdesign", href: "/leistungen/druck-printdesign", navTitle: "الطباعة وتصميم المطبوعات" },
];
