import type { Metadata } from "next";
import { CaseCard } from "@/components/CaseCard";
import { FinalCTA } from "@/components/FinalCTA";
import { SectionHeading } from "@/components/SectionHeading";
import { casesAr } from "@/lib/cases.ar";

export const metadata: Metadata = {
  title: "مشاريعنا ودراسات الحالة، محتوى ومواقع وحملات",
  description:
    "هكذا نعمل في نتويتشر: دراسات حالة من قطاعات الطعام والتجميل والتجارة الإلكترونية والحرف وB2B: التحدي والحل والنتيجة لكل مشروع. من برلين، لكل ألمانيا.",
  alternates: { canonical: "/ar/projekte" },
};

export default function ProjektePageAr() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-16 md:pt-44">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            as="h1"
            align="left"
            eyebrow="المشاريع ودراسات الحالة"
            title={
              <span className="text-4xl md:text-5xl">
                أعمال يمكن <span className="text-mint">قياسها</span>
              </span>
            }
            intro="ستة قطاعات، ستة أوضاع بداية نموذجية، ستة طرق للوصول إلى النتيجة. هذه الحالات توضح كيف نفكر ونعمل. سنضيف أسماء العملاء الحقيقيين والأرقام بعد موافقة عملائنا."
          />
        </div>
      </section>
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {casesAr.map((item, i) => (
              <CaseCard key={item.slug} item={item} delay={(i % 3) * 0.08} locale="ar" />
            ))}
          </div>
        </div>
      </section>
      <FinalCTA
        title="مشروعك قد يكون التالي."
        text="سواء كان مطعماً أو متجراً أو حرفة أو B2B: أخبرنا بوضعك الحالي، وسنُريك كيف سنتعامل معه. مجاناً وبلا التزام."
        locale="ar"
      />
    </>
  );
}
