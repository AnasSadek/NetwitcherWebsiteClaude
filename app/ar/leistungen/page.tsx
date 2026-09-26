import type { Metadata } from "next";
import { FinalCTA } from "@/components/FinalCTA";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { servicesAr } from "@/lib/services.ar";

export const metadata: Metadata = {
  title: "خدماتنا، محتوى وتسويق ومواقع وتصميم من برلين",
  description:
    "جميع خدمات نتويتشر برلين: إنشاء محتوى، تصوير وإنتاج فيديو، سوشيال ميديا، تسويق أداء، تصميم مواقع، SEO، هوية بصرية، برمجيات، دعم فني وطباعة.",
  alternates: { canonical: "/ar/leistungen" },
};

export default function LeistungenPageAr() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            as="h1"
            align="left"
            eyebrow="خدماتنا"
            title={
              <span className="text-4xl md:text-5xl">
                كل ما تحتاجه علامتك <span className="text-mint">للنمو</span>
              </span>
            }
            intro="عشرة مجالات، فريق واحد: نجمع بين إنتاج المحتوى والحملات والتقنية بحيث يخدم كل عنصر نفس الهدف — ظهور أكبر، ثقة أعلى، طلبات أكثر. اختر المجال الذي يدفع عملك للأمام الآن."
          />
        </div>
      </section>
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesAr.map((service, i) => (
              <ServiceCard key={service.slug} service={service} delay={(i % 3) * 0.08} locale="ar" />
            ))}
          </div>
        </div>
      </section>
      <FinalCTA
        title="لست متأكداً من أين تبدأ؟"
        text="لا مشكلة، لهذا وُجدت مكالمة التعارف. سننظر معاً في عملك ونخبرك بصراحة أي رافعة تعمل معك أولاً: المحتوى أم الحملات أم الموقع."
        locale="ar"
      />
    </>
  );
}
