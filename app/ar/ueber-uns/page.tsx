import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import { BrandStar } from "@/components/brand/Logo";
import type { AccentColor } from "@/lib/services";

export const metadata: Metadata = {
  title: "من نحن. الفريق وراء نتويتشر",
  description:
    "نتويتشر استوديو برليني للمحتوى والتصميم والتقنية والتسويق. تعرف على الفريق الذي يرى المحتوى كأداة للنمو والمبيعات، لا مجرد ديكور.",
  alternates: { canonical: "/ar/ueber-uns" },
};

const arrowTargetsAr: { color: AccentColor; label: string }[] = [
  { color: "mint", label: "تصميم مواقع ومتاجر إلكترونية" },
  { color: "violet", label: "استراتيجية وتسويق رقمي" },
  { color: "pink", label: "إنشاء المحتوى" },
  { color: "sun", label: "الاستوديو والتصوير" },
  { color: "sky", label: "وسائل التواصل والإعلانات" },
];

const werte = [
  {
    title: "الصدق قبل البيع",
    text: "إذا كانت خدمة ما لن تفيدك، نخبرك بذلك، حتى لو كانت ضمن عروضنا. علاقات العمل طويلة الأمد أهم لنا من الصفقات السريعة.",
  },
  {
    title: "النتائج قبل الاستعراض",
    text: "الجمال واجب، والفعالية هي الهدف. نقيس عملنا بالطلبات والمبيعات والظهور، لا بجوائز التصميم.",
  },
  {
    title: "سرعة دون التنازل عن الجودة",
    text: "استوديو خاص، مسارات قصيرة، فريق متناغم: ننجز بسرعة دون أن تتراجع الاستراتيجية أو الجودة.",
  },
  {
    title: "فهم للتنوع",
    text: "برلين متعددة اللغات، ونحن كذلك. نفهم الجمهور في ألمانيا ثقافياً ولغوياً، ونصنع رسائل تصل فعلاً.",
  },
];

export default function UeberUnsPageAr() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_.8fr]">
            <Reveal>
              <p className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em] text-mint">
                من نحن
              </p>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                نحن استوديو يرى{" "}
                <span className="text-mint">المحتوى كأداة للنمو والمبيعات</span>.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-3 md:text-lg">
                نتويتشر وكالة رقمية واستوديو محتوى من برلين. أسسنا نتويتشر لأننا رأينا
                نفس المشكلة مراراً: شركات لديها منتجات قوية لا يعكسها حضورها الرقمي،
                ووكالات تقدم صوراً جميلة لكنها لا تجلب طلبات حقيقية. نحن نقدم الاثنين
                معاً: محتوى يلفت الانتباه، وأنظمة تحوّله إلى عملاء.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <ButtonLink href="/ar/kontakt#termin">تعرف علينا، مكالمة تعارف مجانية</ButtonLink>
                <ButtonLink href="/ar/studio" variant="ghost">استوديونا في برلين</ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="relative mx-auto flex h-72 w-72 items-center justify-center">
                <BrandStar size={220} className="" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Der Stern als Team-Philosophie */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            title={
              <>
                لماذا يتكوّن شعارنا من <span className="text-mint">خمسة أسهم</span>؟
              </>
            }
            intro="كل سهم يمثل تخصصاً: تصميم مواقع، استراتيجية، محتوى، تصوير، وسائل التواصل الاجتماعي. منفردة هي أدوات. ومجتمعة تشكّل النجمة: تسويق يعمل كمنظومة واحدة. وهكذا نعمل بالضبط."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {arrowTargetsAr.map((t, i) => (
              <Reveal key={t.color} delay={i * 0.07}>
                <div className="h-full rounded border border-line bg-white p-6 text-center backdrop-blur transition-all duration-300 hover:-translate-y-1">
                  <svg width="34" height="34" viewBox="0 0 100 100" aria-hidden="true" className="mx-auto mb-4">
                    <path d={ARROW_PATH} fill={ARROW_COLORS[t.color]} transform={`rotate(${i * 72} 50 50)`} />
                  </svg>
                  <h3 className="font-heading text-sm font-bold leading-snug">{t.label}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Werte */}
      <section className="bg-paper-2 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            title="أربعة مبادئ نحاسب أنفسنا عليها"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {werte.map((wert, i) => (
              <Reveal key={wert.title} delay={(i % 2) * 0.08}>
                <div className="h-full rounded border border-line bg-white p-8 backdrop-blur">
                  <span className="font-heading text-2xl font-extrabold text-mint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-heading text-lg font-bold">{wert.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-3">{wert.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Berlin & Studio */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em] text-sun">
              صُنع في برلين
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              برلين موطننا... وميزة تنافسية حقيقية.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-3">
              من استوديو المحتوى الخاص بنا في برلين، ننتج حيث يعيش جمهورك: بسرعة
              ومرونة، وبقرب من الاتجاهات التي تحتاج أشهرًا لتصل إلى أماكن أخرى.
              ومن هنا، نخدم شركات في جميع أنحاء ألمانيا، من المطعم المحلي إلى
              علامة التجارة الإلكترونية.
            </p>
            <div className="mt-9">
              <ButtonLink href="/ar/studio" variant="studio">اكتشف الاستوديو</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCTA
        title="هل يبدو أننا الفريق المناسب لك؟"
        text="إذن لنتحدث. في مكالمة التعارف، ستتعرف علينا وسنتعرف على عملك، وستحصل على تقييم صادق لما يناسبك فعلاً."
        locale="ar"
      />
    </>
  );
}
