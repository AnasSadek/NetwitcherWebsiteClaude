import type { Metadata } from "next";
import Link from "next/link";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ARROW_COLORS, ARROW_PATH, STAR_ORDER } from "@/components/arrows";
import { blogPostsAr } from "@/lib/blog.ar";

export const metadata: Metadata = {
  title: "المدونة، معرفة عملية عن المحتوى والتصوير والتسويق",
  description:
    "مدونة نتويتشر: معرفة عملية وصادقة عن إنشاء المحتوى وتصوير المنتجات وسوشيال ميديا وتسويق الأداء. من استوديونا في برلين.",
  alternates: { canonical: "/ar/blog" },
};

const dateFmt = new Intl.DateTimeFormat("ar", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default function BlogPageAr() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-16 md:pt-44">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            as="h1"
            align="left"
            eyebrow="المدونة"
            title={
              <span className="text-4xl md:text-5xl">
                معرفة عملية بدل <span className="text-mint">كلام تسويقي فارغ</span>
              </span>
            }
            intro="ما نتعلمه يومياً في الاستوديو وفي الحملات، نكتبه هنا: بشكل ملموس وقابل للتطبيق ودون أي ضغط للبيع."
          />
        </div>
      </section>
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPostsAr.map((post, i) => {
              const accent = ARROW_COLORS[STAR_ORDER[i % 5]];
              return (
                <Reveal as="article" key={post.slug} delay={(i % 3) * 0.08} className="h-full">
                  <Link
                    href={`/ar/blog/${post.slug}`}
                    className="group flex h-full flex-col rounded border border-line bg-white p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span
                        className="font-heading text-[11px] font-bold uppercase tracking-widest"
                        style={{ color: accent }}
                      >
                        {post.category}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 100 100" aria-hidden="true" className="opacity-40 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100">
                        <path d={ARROW_PATH} fill={accent} />
                      </svg>
                    </div>
                    <h2 className="font-heading text-lg font-bold leading-snug transition-colors group-hover:text-ink">
                      {post.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-3">{post.excerpt}</p>
                    <p className="mt-5 text-xs text-ink-3">
                      <time dateTime={post.date}>{dateFmt.format(new Date(post.date))}</time>
                      {" · "}
                      {post.readingTime}
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <FinalCTA
        title="تفضل أن تسأل مباشرة بدل القراءة؟"
        text="أمور كثيرة تتضح في 20 دقيقة حوار أسرع من 20 مقالاً. احجز مكالمة تعارف مجانية، وسنجيب عن أسئلتك بشكل محدد يخص عملك."
        locale="ar"
      />
    </>
  );
}
