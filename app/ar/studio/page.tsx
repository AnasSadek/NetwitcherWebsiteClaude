import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import { Media } from "@/components/ui/Media";
import { media } from "@/lib/media";
import { getServiceAr } from "@/lib/services.ar";

const studio = getServiceAr("studio")!;

export const metadata: Metadata = {
  title: studio.seo.title,
  description: studio.seo.description,
  alternates: { canonical: "/ar/studio" },
};

const studioAngebote = [
  { title: "تصوير المنتجات", text: "صور مقصوصة للتجارة الإلكترونية، مشاهد نمط حياة ولقطات تفصيلية بتصميم ديكور احترافي — صور تُبرر سعر منتجك.", color: "sun" },
  { title: "تصوير الطعام والمشروبات", text: "أطباق ومشروبات ومكونات بإضاءة وملمس مدروسين — محتوى يفتح الشهية ويجلب الحجوزات.", color: "pink" },
  { title: "محتوى التجميل ومستحضرات العناية", text: "ملمس ولون وتطبيق: محتوى تجميل بمستوى العلامات الكبرى، منتج للفيد والمتجر والإعلانات.", color: "violet" },
  { title: "صور منتجات للتجارة الإلكترونية", text: "سلاسل صور موحدة لكامل مجموعتك — متناسقة وقابلة للتوسع ومحسّنة لمتجرك.", color: "mint" },
  { title: "ريلز لإنستغرام وتيك توك", text: "مصمَّمة عمودياً، مخطط لها بجملة افتتاحية قوية، ومونتاج أصلي — ريلز تحقق انتشاراً عضوياً بدل شرائه.", color: "sky" },
  { title: "فيديوهات إعلانية", text: "فيديوهات أداء قصيرة برسالة واضحة ودعوة لاتخاذ إجراء — بالضبط ما تحتاجه حملات Meta وTikTok.", color: "violet" },
  { title: "محتوى من خلف الكواليس", text: "لمحات حقيقية عن فريقك وإنتاجك — محتوى يبني الثقة ويجعل علامتك أقرب لجمهورها.", color: "pink" },
  { title: "محتوى للمواقع وصفحات الهبوط", text: "صور رئيسية وصور فريق وعناصر بصرية للمنتج تحوّل موقعك من قالب جاهز إلى هوية علامة حقيقية.", color: "mint" },
] as const;

export default function StudioPageAr() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(800px 450px at 75% 10%, rgba(244,104,168,.16), transparent 65%), radial-gradient(600px 400px at 15% 80%, rgba(245,211,61,.1), transparent 65%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em] text-pink">
                {studio.hero.eyebrow} · استوديو برلين
              </p>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                {studio.hero.headline}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-ink-3 md:text-lg">
                {studio.hero.intro}
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <ButtonLink href="/ar/kontakt?service=Fotoshooting" variant="studio">
                  طلب جلسة تصوير في الاستوديو
                </ButtonLink>
                <ButtonLink href="/ar/kontakt#termin" variant="ghost">
                  مكالمة تعارف مجانية
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded bg-gradient-to-tr from-pink/40 via-violet/25 to-sun/40 opacity-60 blur-xl"
                />
                <Media
                  asset={media.studio}
                  className="relative rounded border border-line object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Was im Studio entsteht */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrowColor="text-pink"
            title={
              <>
                مكان واحد. <span className="text-sun">كل الصيغ.</span>
              </>
            }
            intro="من صورة المنتج حتى فيديو الحملة: ننتج في مكان تتوفر فيه الإضاءة والتقنية والفريق مسبقاً. هذا ما يجعلنا سريعين والجودة ثابتة."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {studioAngebote.map((item, i) => (
              <Reveal key={item.title} delay={(i % 4) * 0.07}>
                <div className="group h-full rounded border border-line bg-white p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                  <svg width="22" height="22" viewBox="0 0 100 100" aria-hidden="true" className="mb-4 transition-transform duration-300 group-hover:rotate-12">
                    <path d={ARROW_PATH} fill={ARROW_COLORS[item.color]} />
                  </svg>
                  <h3 className="font-heading text-sm font-bold leading-snug">{item.title}</h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-ink-3">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bild-Duo: Produkt + Reels */}
      <section className="bg-paper-2 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-stretch gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <Reveal>
              <figure className="relative h-full overflow-hidden rounded border border-line">
                <Media asset={media.product} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                <figcaption className="absolute bottom-4 right-4 rounded border border-line bg-white/80 px-4 py-2 font-heading text-[11px] font-bold uppercase tracking-widest text-mint backdrop-blur">
                  تصوير المنتجات
                </figcaption>
              </figure>
            </Reveal>
            <div className="flex flex-col gap-6">
              <Reveal delay={0.1}>
                <figure className="relative overflow-hidden rounded border border-line">
                  <Media asset={media.reels} className="w-full object-cover transition-transform duration-700 hover:scale-105" />
                  <figcaption className="absolute bottom-4 right-4 rounded border border-line bg-white/80 px-4 py-2 font-heading text-[11px] font-bold uppercase tracking-widest text-sky backdrop-blur">
                    ريلز وإنتاج فيديو
                  </figcaption>
                </figure>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="flex flex-1 flex-col justify-center rounded border border-line bg-white p-8 backdrop-blur">
                  <h2 className="font-heading text-xl font-bold text-ink">
                    أرسل منتجك، واستلم المحتوى
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-2">
                    لا داعي للحضور إلى برلين لجلسة التصوير: أرسل لنا منتجك، ونتولى نحن
                    تصميم الديكور والإنتاج والمعالجة وإعادة الشحن. خلال أيام قليلة
                    ستجد في بريدك محتوى جاهزاً للحملات.
                  </p>
                  <div className="mt-6">
                    <ButtonLink href="/ar/kontakt?service=Fotoshooting" variant="studio">
                      طلب جلسة تصوير في الاستوديو
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Inhaltliche Sektionen aus dem Servicedatensatz */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3">
          {studio.sections.map((sec, i) => (
            <Reveal key={sec.heading} delay={i * 0.1}>
              <div className="h-full rounded border border-line bg-white p-8 backdrop-blur">
                <svg width="24" height="24" viewBox="0 0 100 100" aria-hidden="true" className="mb-5">
                  <path d={ARROW_PATH} fill={ARROW_COLORS.pink} transform={`rotate(${i * 72} 50 50)`} />
                </svg>
                <h2 className="font-heading text-lg font-bold leading-snug">{sec.heading}</h2>
                <p className="mt-3.5 text-sm leading-relaxed text-ink-3">{sec.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper-2 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading title="جدير بالمعرفة" />
          <div className="mt-10 space-y-4">
            {studio.faq.map((f) => (
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

      <FinalCTA
        title="منتجك يستحق صوراً أفضل."
        text="أخبرنا بما تبيعه، وسنُريك كيف يبدو في الإضاءة الصحيحة. المكالمة الأولى وفكرة المفهوم مجانيتان."
        locale="ar"
      />
    </>
  );
}
