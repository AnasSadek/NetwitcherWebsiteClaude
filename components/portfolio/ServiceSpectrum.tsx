import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import { getDict } from "@/lib/i18n/dictionary";
import { withLocale, type Locale } from "@/lib/i18n/locale";
import { categoriesInUse, type PortfolioCategory } from "@/lib/portfolio";
import type { AccentColor } from "@/lib/services";

/**
 * „Das ganze Spektrum": alle Leistungen als typografisches Register.
 * Jede Zeile führt entweder in den passenden Portfolio-Filter (wenn es
 * Projekte gibt) oder auf die Leistungsseite. Keine leeren Versprechen.
 */
type Row = {
  label: string;
  group: string;
  color: AccentColor;
  category: PortfolioCategory;
  href: string;
};

const ROWS_DE: Row[] = [
  { label: "Social Media", group: "Content", color: "pink", category: "social-video", href: "/leistungen/social-media-management" },
  { label: "Videoproduktion", group: "Content", color: "pink", category: "social-video", href: "/leistungen/foto-videoproduktion" },
  { label: "Reels & Werbefilme", group: "Content", color: "pink", category: "social-video", href: "/studio" },
  { label: "Fotografie", group: "Studio", color: "sun", category: "photo", href: "/studio" },
  { label: "Grafikdesign", group: "Design", color: "sun", category: "design", href: "/leistungen/branding-design" },
  { label: "Poster & Print", group: "Design", color: "sun", category: "design", href: "/leistungen/druck-printdesign" },
  { label: "Branding", group: "Design", color: "sun", category: "design", href: "/leistungen/branding-design" },
  { label: "Websites", group: "Web", color: "mint", category: "web", href: "/leistungen/webdesign-ecommerce" },
  { label: "E-Commerce", group: "Web", color: "mint", category: "ecommerce", href: "/leistungen/webdesign-ecommerce" },
  { label: "Individuelle Software", group: "Software", color: "violet", category: "software", href: "/leistungen/softwareentwicklung" },
  { label: "Webanwendungen", group: "Software", color: "violet", category: "software", href: "/leistungen/softwareentwicklung" },
  { label: "Plattformen", group: "Software", color: "violet", category: "software", href: "/leistungen/softwareentwicklung" },
  { label: "Automatisierung", group: "KI", color: "sky", category: "ai", href: "/leistungen/softwareentwicklung" },
  { label: "KI-Lösungen", group: "KI", color: "sky", category: "ai", href: "/leistungen/softwareentwicklung" },
];

const ROWS_AR: Row[] = [
  { label: "سوشيال ميديا", group: "المحتوى", color: "pink", category: "social-video", href: "/leistungen/social-media-management" },
  { label: "إنتاج الفيديو", group: "المحتوى", color: "pink", category: "social-video", href: "/leistungen/foto-videoproduktion" },
  { label: "ريلز وأفلام إعلانية", group: "المحتوى", color: "pink", category: "social-video", href: "/studio" },
  { label: "التصوير الفوتوغرافي", group: "الاستوديو", color: "sun", category: "photo", href: "/studio" },
  { label: "التصميم الجرافيكي", group: "التصميم", color: "sun", category: "design", href: "/leistungen/branding-design" },
  { label: "مطبوعات وبوسترات", group: "التصميم", color: "sun", category: "design", href: "/leistungen/druck-printdesign" },
  { label: "الهوية البصرية", group: "التصميم", color: "sun", category: "design", href: "/leistungen/branding-design" },
  { label: "مواقع إلكترونية", group: "الويب", color: "mint", category: "web", href: "/leistungen/webdesign-ecommerce" },
  { label: "متاجر إلكترونية", group: "الويب", color: "mint", category: "ecommerce", href: "/leistungen/webdesign-ecommerce" },
  { label: "برمجيات مخصصة", group: "البرمجيات", color: "violet", category: "software", href: "/leistungen/softwareentwicklung" },
  { label: "تطبيقات ويب", group: "البرمجيات", color: "violet", category: "software", href: "/leistungen/softwareentwicklung" },
  { label: "منصات رقمية", group: "البرمجيات", color: "violet", category: "software", href: "/leistungen/softwareentwicklung" },
  { label: "الأتمتة", group: "الذكاء الاصطناعي", color: "sky", category: "ai", href: "/leistungen/softwareentwicklung" },
  { label: "حلول الذكاء الاصطناعي", group: "الذكاء الاصطناعي", color: "sky", category: "ai", href: "/leistungen/softwareentwicklung" },
];

export function ServiceSpectrum({ locale = "de" }: { locale?: Locale }) {
  const t = getDict(locale);
  const rows = locale === "ar" ? ROWS_AR : ROWS_DE;
  const counts = new Map(categoriesInUse().map((c) => [c.id, c.count]));
  return (
    <section className="py-24 md:py-32" aria-labelledby="spektrum">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="spektrum" className="font-boxi text-3xl leading-[1.05] text-ink md:text-5xl">
              {locale === "ar" ? (
                <>الطيف الكامل من خدماتنا.</>
              ) : (
                <>
                  DAS GANZE
                  <br />
                  SPEKTRUM.
                </>
              )}
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-ink-2">
              {locale === "ar"
                ? "من أول ريل حتى منصتك الخاصة. كل شيء من فريق واحد، كل شيء من برلين."
                : "Vom ersten Reel bis zur eigenen Plattform. Alles aus einem Team, alles aus Berlin."}
            </p>
          </div>
        </Reveal>

        <ol className="mt-12 grid gap-x-12 border-t border-line md:mt-16 md:grid-cols-2">
          {rows.map((r, i) => {
            const n = counts.get(r.category) ?? 0;
            const href = n > 0 ? `${withLocale("/portfolio", locale)}?f=${r.category}#arbeiten` : withLocale(r.href, locale);
            const hex = ARROW_COLORS[r.color];
            return (
              <Reveal as="li" key={r.label} delay={Math.min(i * 0.03, 0.2)} className="border-b border-line">
                <Link
                  href={href}
                  className="group flex items-center gap-4 py-4 transition-colors md:gap-6 md:py-5"
                >
                  <span className="w-7 shrink-0 font-heading text-xs font-semibold tabular-nums text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-heading text-xl font-bold tracking-tight text-ink-2 transition-colors group-hover:text-ink md:text-2xl">
                    {r.label}
                  </span>
                  <span className="hidden font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-ink-3 sm:block">
                    {n > 0 ? `${n} ${n === 1 ? t.portfolio.projectCountSingular : t.portfolio.projectCountPlural}` : r.group}
                  </span>
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-transparent"
                    style={{ ["--hex" as string]: hex }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 100 100"
                      aria-hidden="true"
                      className="transition-transform duration-300 rtl:-scale-x-100 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                    >
                      <path d={ARROW_PATH} fill={hex} transform="rotate(90 50 50)" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
