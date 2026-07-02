import type { Metadata } from "next";
import Link from "next/link";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ARROW_COLORS, ARROW_PATH, STAR_ORDER } from "@/components/arrows";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog – Praxiswissen zu Content, Foto & Marketing",
  description:
    "Der Netwitcher-Blog: ehrliches Praxiswissen zu Content Creation, Produktfotografie, Social Media und Performance Marketing – aus unserem Studio in Berlin.",
};

const dateFmt = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default function BlogPage() {
  return (
    <>
      <section className="aurora relative overflow-hidden pt-36 pb-16 md:pt-44">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            align="left"
            eyebrow="Blog"
            title={
              <span className="text-4xl md:text-5xl">
                Praxiswissen statt <span className="text-gradient">Marketing-Blabla</span>
              </span>
            }
            intro="Was wir im Studio und in Kampagnen jeden Tag lernen, schreiben wir hier auf – konkret, anwendbar und ohne Verkaufsdruck."
          />
        </div>
      </section>
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, i) => {
              const accent = ARROW_COLORS[STAR_ORDER[i % 5]];
              return (
                <Reveal as="article" key={post.slug} delay={(i % 3) * 0.08} className="h-full">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-night-700/60 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
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
                    <h2 className="font-heading text-lg font-bold leading-snug transition-colors group-hover:text-snow">
                      {post.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">{post.excerpt}</p>
                    <p className="mt-5 text-xs text-mist">
                      <time dateTime={post.date}>{dateFmt.format(new Date(post.date))}</time>
                      {" · "}
                      {post.readingTime} Lesezeit
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <FinalCTA
        title="Lieber direkt fragen statt lesen?"
        text="Vieles klärt sich in 20 Minuten Gespräch schneller als in 20 Artikeln. Buch dir ein kostenloses Erstgespräch – wir beantworten deine Fragen konkret für dein Unternehmen."
      />
    </>
  );
}
