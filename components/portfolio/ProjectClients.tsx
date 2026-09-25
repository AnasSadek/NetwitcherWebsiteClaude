import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { getDict } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locale";
import { portfolioProjects, type PortfolioProject } from "@/lib/portfolio";
import { portfolioProjectsAr } from "@/lib/portfolio.ar";

/**
 * Kunden-Logowand: leitet sich automatisch aus den Portfolio-Projekten der
 * jeweiligen Sprache ab (alle Projekte mit echtem `logo`-Asset, ausser dem
 * eigenen), damit keine zweite, separat zu pflegende Kundenliste entsteht.
 * Rendert nur, wenn `project.clientsSection` gesetzt ist — aktuell nur bei
 * Netwitcher selbst.
 */
export function ProjectClients({ project, locale = "de" }: { project: PortfolioProject; locale?: Locale }) {
  const t = getDict(locale);
  const { eyebrow, heading, intro } = project.clientsSection!;
  const allProjects = locale === "ar" ? portfolioProjectsAr : portfolioProjects;
  const clients = allProjects.filter((p) => p.logo && p.slug !== project.slug);

  if (!clients.length) return null;

  return (
    <section aria-labelledby="kunden" className="py-14 md:py-20">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          {eyebrow && (
            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-ink-3">{eyebrow}</p>
          )}
          {heading && (
            <h2 id="kunden" className="mt-4 font-boxi text-2xl leading-none text-ink md:text-4xl">
              {heading}
            </h2>
          )}
          {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{intro}</p>}
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-14 md:gap-5 lg:grid-cols-4 xl:grid-cols-6">
          {clients.map((c, i) => (
            <Reveal key={c.slug} delay={Math.min(i * 0.04, 0.3)}>
              <div className="group flex h-28 items-center justify-center rounded-2xl border border-line bg-paper-2/70 p-6 transition-transform duration-300 hover:scale-[1.03] md:h-32">
                <div className="relative h-full w-full">
                  <Image
                    src={c.logo!}
                    alt={t.portfolio.logoAlt(c.client)}
                    fill
                    sizes="(min-width: 1024px) 200px, 33vw"
                    className="object-contain"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
