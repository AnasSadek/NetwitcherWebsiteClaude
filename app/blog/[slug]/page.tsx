import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { blogPosts, getPost } from "@/lib/blog";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.seoDescription };
}

const dateFmt = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    datePublished: post.date,
    inLanguage: "de-DE",
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
            <nav aria-label="Brotkrumen" className="mb-8 text-xs text-mist">
              <Link href="/" className="hover:text-snow">Startseite</Link>
              <span aria-hidden="true"> / </span>
              <Link href="/blog" className="hover:text-snow">Blog</Link>
            </nav>
            <p className="mb-4 font-heading text-xs font-bold uppercase tracking-[0.25em] text-mint">
              {post.category}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-mist">
              <time dateTime={post.date}>{dateFmt.format(new Date(post.date))}</time>
              {" · "}
              {post.readingTime} Lesezeit · Netwitcher Team
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
                    <p key={j} className="mb-4 text-base leading-relaxed text-mist">
                      {p}
                    </p>
                  ))}
                </section>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-14 rounded-2xl border border-line bg-night-700/60 p-8 text-center backdrop-blur">
              <h2 className="font-heading text-lg font-bold">
                Diese Themen für dein Unternehmen umsetzen?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Im kostenlosen Erstgespräch übertragen wir das auf deine Marke – konkret und ohne Verpflichtung.
              </p>
              <div className="mt-6">
                <ButtonLink href="/kontakt#termin">Kostenloses Erstgespräch buchen</ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </article>
      <FinalCTA />
    </>
  );
}
