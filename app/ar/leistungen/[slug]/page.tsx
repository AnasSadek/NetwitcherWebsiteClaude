import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import { ServiceIcon } from "@/components/icons";
import { leistungenServicesAr, getServiceAr } from "@/lib/services.ar";
import { site } from "@/lib/site";

/** Per-Slug-Überschreibungen für gemeinsam genutzte Template-Texte (Deliverables-Intro, FAQ-Überschrift, Abschluss-CTA). */
const pageCopyOverrides: Partial<
  Record<string, { deliverablesIntro?: string; faqHeading?: string; ctaTitle?: string; ctaText?: string }>
> = {
  "foto-videoproduktion": {
    deliverablesIntro:
      "من البداية تعرف بالضبط ما الذي ستحصل عليه. نحدد نطاق العمل بوضوح، ثم نخصص كل بند بما يناسب مشروعك وأهدافك.",
    faqHeading: "أسئلة شائعة",
    ctaTitle: "ما الذي ترغب في إنتاجه بعد ذلك؟",
    ctaText: "أخبرنا بإيجاز عما تحتاجه، وسنخبرك بصراحة بما يستحق التنفيذ وما يناسب أهدافك وميزانيتك.",
  },
  "social-media-management": {
    faqHeading: "أسئلة شائعة",
    ctaTitle: "هل أنت مستعد لبناء حضور أقوى على وسائل التواصل؟",
    ctaText: "أخبرنا عن علامتك وأهدافك، وسنقترح عليك خطة محتوى وإدارة تناسب جمهورك ومنصاتك.",
  },
  "performance-marketing": {
    faqHeading: "أسئلة شائعة",
    ctaTitle: "جاهز لتحويل ميزانيتك الإعلانية إلى نتائج؟",
    ctaText:
      "أخبرنا عن أهدافك وميزانيتك، وسنوضح لك أين توجد أفضل فرصة للنمو وكيف يمكن تحويل الإنفاق الإعلاني إلى نتائج قابلة للقياس.",
  },
};

export function generateStaticParams() {
  return leistungenServicesAr.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceAr(slug);
  if (!service) return {};
  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: { canonical: `/ar/leistungen/${slug}` },
  };
}

export default async function ServicePageAr({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceAr(slug);
  if (!service || service.slug === "studio") notFound();

  const accent = ARROW_COLORS[service.color];
  const related = leistungenServicesAr
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);
  const pageCopy = pageCopyOverrides[service.slug];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.seo.description,
    provider: {
      "@type": "ProfessionalService",
      name: site.name,
      address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "DE" },
    },
    areaServed: "Berlin",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `radial-gradient(700px 400px at 80% 0%, ${accent}22, transparent 65%), radial-gradient(500px 300px at 10% 90%, ${accent}11, transparent 65%)`,
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <nav aria-label="مسار التصفح" className="mb-8 text-xs text-ink-3">
              <Link href="/ar" className="hover:text-ink">الصفحة الرئيسية</Link>
              <span aria-hidden="true"> / </span>
              <Link href="/ar/leistungen" className="hover:text-ink">الخدمات</Link>
              <span aria-hidden="true"> / </span>
              <span className="text-ink">{service.navTitle}</span>
            </nav>
            <div className="flex items-start gap-5">
              <span
                className="hidden h-16 w-16 shrink-0 items-center justify-center rounded border border-line bg-ink/5 p-4 sm:inline-flex"
                style={{ color: accent }}
              >
                <ServiceIcon icon={service.icon} className="h-8 w-8" />
              </span>
              <div className="max-w-3xl">
                <p
                  className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em]"
                  style={{ color: accent }}
                >
                  {service.hero.eyebrow}
                </p>
                <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                  {service.hero.headline}
                </h1>
                <p className="mt-6 text-base leading-relaxed text-ink-3 md:text-lg">
                  {service.hero.intro}
                </p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <ButtonLink href={`/ar/kontakt?service=${encodeURIComponent(service.navTitle)}`}>
                    {service.cta}
                  </ButtonLink>
                  <ButtonLink href="/ar/kontakt#termin" variant="ghost">
                    مكالمة تعارف مجانية
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Inhalts-Sektionen */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3">
          {service.sections.map((sec, i) => (
            <Reveal key={sec.heading} delay={i * 0.1}>
              <div className="h-full rounded border border-line bg-white p-8 backdrop-blur">
                <svg width="24" height="24" viewBox="0 0 100 100" aria-hidden="true" className="mb-5">
                  <path d={ARROW_PATH} fill={accent} transform={`rotate(${i * 72} 50 50)`} />
                </svg>
                <h2 className="font-heading text-lg font-bold leading-snug">{sec.heading}</h2>
                <p className="mt-3.5 text-sm leading-relaxed text-ink-3">{sec.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Deliverables */}
      <section className="bg-paper-2 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            title="هذا ما تحصل عليه"
            intro={
              pageCopy?.deliverablesIntro ??
              "لا وعود غامضة. هذا هو النطاق الذي نعمل به. وفي العرض، يُصمَّم كل بند خصيصاً لمشروعك."
            }
          />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
            {service.deliverables.map((d, i) => (
              <Reveal as="li" key={d} delay={(i % 2) * 0.06}>
                <div className="flex items-center gap-3 rounded border border-line bg-white/[.03] px-5 py-3.5 text-sm">
                  <svg width="13" height="13" viewBox="0 0 100 100" aria-hidden="true" className="shrink-0 rtl:-scale-x-100">
                    <path d={ARROW_PATH} fill={accent} transform="rotate(90 50 50)" />
                  </svg>
                  {d}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading title={pageCopy?.faqHeading ?? "جدير بالمعرفة"} />
          <div className="mt-10 space-y-4">
            {service.faq.map((f) => (
              <Reveal key={f.q}>
                <details className="group rounded border border-line bg-white px-6 py-5 backdrop-blur">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-sm font-bold">
                    {f.q}
                    <span aria-hidden="true" className="text-ink-3 transition-transform duration-200 group-open:rotate-45">＋</span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-ink-3">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Verwandte Leistungen */}
      <section className="bg-paper-2 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading title="خدمات ذات صلة" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {related.map((s, i) => (
              <ServiceCard key={s.slug} service={s} delay={i * 0.08} locale="ar" />
            ))}
          </div>
        </div>
      </section>

      <FinalCTA locale="ar" title={pageCopy?.ctaTitle} text={pageCopy?.ctaText} />
    </>
  );
}
