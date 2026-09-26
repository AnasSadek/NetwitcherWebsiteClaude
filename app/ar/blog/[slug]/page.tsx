import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { blogPostsAr, getPostAr } from "@/lib/blog.ar";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return blogPostsAr.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostAr(slug);
  if (!post) return {};
  return { title: post.title, description: post.seoDescription, alternates: { canonical: `/ar/blog/${slug}` } };
}

const dateFmt = new Intl.DateTimeFormat("ar", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function BlogPostPageAr({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostAr(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    datePublished: post.date,
    inLanguage: "ar",
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="pt-36 pb-20 md:pt-44">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal>
            <nav aria-label="مسار التصفح" className="mb-8 text-xs text-ink-3">
              <Link href="/ar" className="hover:text-ink">الصفحة الرئيسية</Link>
              <span aria-hidden="true"> / </span>
              <Link href="/ar/blog" className="hover:text-ink">المدونة</Link>
            </nav>
            <p className="mb-4 font-heading text-xs font-bold uppercase tracking-[0.25em] text-mint">
              {post.category}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-ink-3">
              <time dateTime={post.date}>{dateFmt.format(new Date(post.date))}</time>
              {" · "}
              {post.readingTime} · فريق نتويتشر
            </p>
          </Reveal>
          <div className="mt-12 space-y-10">
            {post.content.map((block, i) => (
              <Reveal key={i}>
                <section>
                  {block.heading && (
                    <h2 className="mb-4 font-heading text-xl font-bold md:text-2xl">
                      {block.heading}
                    </h2>
                  )}
                  {block.paragraphs.map((p, j) => (
                    <p key={j} className="mb-4 text-base leading-relaxed text-ink-3">
                      {p}
                    </p>
                  ))}
                </section>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-14 rounded border border-line bg-white p-8 text-center backdrop-blur">
              <h2 className="font-heading text-lg font-bold">
                هل تريد تطبيق هذه الأفكار على علامتك؟
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-3">
                لنحوّل هذه الأفكار إلى خطوات عملية تناسب علامتك وأهدافك.
              </p>
              <div className="mt-6">
                <ButtonLink href="/ar/kontakt#termin">احجز مكالمة تعارف مجانية</ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </article>
      <FinalCTA
        locale="ar"
        title="هل تريد تحويل الأفكار إلى نتائج؟"
        text="أخبرنا بما تعمل عليه، وسنساعدك على تحديد الخطوة التالية التي تستحق وقتك وميزانيتك."
      />
    </>
  );
}
