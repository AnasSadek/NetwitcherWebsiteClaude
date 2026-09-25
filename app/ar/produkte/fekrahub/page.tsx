import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";

export const metadata: Metadata = {
  title: "FekraHub، منصتنا للمؤسسات التعليمية",
  description:
    "FekraHub منصة إدارة طوّرتها نتويتشر للمدارس والمؤسسات التعليمية: التسجيل والدورات والتواصل والتقارير في مكان واحد.",
  alternates: { canonical: "/ar/produkte/fekrahub" },
};

const features = [
  { title: "تسجيل رقمي", text: "يسجّل أولياء الأمور أبناءهم عبر الإنترنت، دون نماذج ورقية، وبحالة واضحة للإدارة والعائلات.", color: "mint" },
  { title: "إدارة الدورات والصفوف", text: "الدورات والصفوف والمعلمون والقاعات منظّمة مركزياً، بما في ذلك التوزيع والسعات.", color: "violet" },
  { title: "التواصل", text: "تصل الإعلانات والرسائل إلى أولياء الأمور بموثوقية، بعدة لغات، وبإمكانية التتبع.", color: "pink" },
  { title: "التقارير والشهادات", text: "إنشاء تقارير الأداء رقمياً واعتمادها ومشاركتها، بأدوار وصلاحيات لكل عضو في الفريق.", color: "sun" },
  { title: "الأدوار والصلاحيات", text: "الإدارة والمعلمون وأولياء الأمور: كل دور يرى بالضبط ما يحتاجه، لا أكثر ولا أقل.", color: "sky" },
  { title: "آمنة ومتوافقة مع GDPR", text: "مطوَّرة ومستضافة مع تركيز على حماية البيانات، بيانات الطلاب الحساسة تبقى محمية.", color: "mint" },
] as const;

export default function FekraHubPageAr() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <Reveal>
              <p className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em] text-sky">
                منتجاتنا · FekraHub
              </p>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                FekraHub: إدارة مدرسية{" "}
                <span className="text-mint">تشرح نفسها بنفسها</span>
              </h1>
              <p className="mt-6 text-base leading-relaxed text-ink-3 md:text-lg">
                FekraHub منصتنا الخاصة المطوَّرة للمدارس والمؤسسات التعليمية:
                التسجيل والدورات والتواصل والتقارير في مكان واحد، بُنيت لأن
                الأوراق وجداول Excel تكلف وقتاً ثميناً يجب أن يذهب للتدريس.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <ButtonLink href="/ar/kontakt?service=Software">طلب عرض تجريبي</ButtonLink>
                <ButtonLink href="/ar/leistungen/softwareentwicklung" variant="ghost">
                  تطوير حل خاص بك
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="الوظائف"
            title="كل ما هو مهم في مكان واحد"
            intro="تغطي FekraHub حياة المؤسسة التعليمية اليومية، من أول تسجيل حتى الشهادة."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.08}>
                <div className="h-full rounded border border-line bg-white p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                  <svg width="24" height="24" viewBox="0 0 100 100" aria-hidden="true" className="mb-4">
                    <path d={ARROW_PATH} fill={ARROW_COLORS[f.color]} />
                  </svg>
                  <h3 className="font-heading text-base font-bold">{f.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-3">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper-2 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              لماذا نبني منتجاً خاصاً بنا
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-3">
              FekraHub أكثر من مجرد منتج. إنه دليلنا على أننا لا نَعد ببرمجيات
              فحسب، بل نشغّلها فعلياً. كل خبرة من واقع تشغيل المنصة الحقيقي —
              نماذج الأدوار، نماذج البيانات، الدعم الفني — تصبّ مباشرة في
              الحلول المخصصة التي نطورها لعملائنا.
            </p>
          </Reveal>
        </div>
      </section>

      <FinalCTA
        title="مهتم بـ FekraHub، أو بمنصتك الخاصة؟"
        text="يسعدنا أن نعرض لك FekraHub في جلسة تجريبية. وإذا كنت تحتاج أداة رقمية خاصة بك: هذا بالضبط ما نطوّره."
        locale="ar"
      />
    </>
  );
}
