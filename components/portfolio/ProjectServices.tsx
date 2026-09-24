import { Reveal } from "@/components/Reveal";
import { ARROW_COLORS } from "@/components/arrows";
import { FeatureIcon } from "@/components/icons";
import type { PortfolioProject } from "@/lib/portfolio";

/**
 * Eigener Leistungen-Abschnitt (kein Bild): Eyebrow, Überschrift, Intro,
 * ein responsives Karten-Raster und eine optionale Abschluss-Aussage.
 * Rendert nur, wenn `project.servicesSection` gesetzt ist — unabhängig
 * von `ProjectFeatures`, am Seitenende vor Next-Project/CTA.
 */
export function ProjectServices({ project }: { project: PortfolioProject }) {
  const { eyebrow, heading, intro, items, closingStatement, accentColors } = project.servicesSection!;
  const brandHex = ARROW_COLORS[project.color];
  const accents = accentColors ?? [brandHex];
  const introParagraphs = Array.isArray(intro) ? intro : intro ? [intro] : [];
  /** Bei einer einzelnen Karte: eine grosse, zentrierte Karte statt eines
   *  2-Spalten-Rasters mit leerer zweiter Spalte. Bei wenigen Karten
   *  (z. B. 2) wirkt ein volles 3er-Raster unausgewogen — dann zentriert
   *  und auf 2 Spalten begrenzt statt über die volle Breite gestreckt. Bei
   *  4 Karten passen 4 Spalten balanciert in eine Zeile (Tablet weiterhin
   *  2 Spalten). Ab 3 (ausser 4) das gewohnte 3er-Raster. */
  const gridClass =
    items.length === 1
      ? "mx-auto mt-10 grid max-w-md gap-5 md:mt-14"
      : items.length <= 2
        ? "mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2 md:mt-14 md:gap-6"
        : items.length === 4
          ? "mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 md:gap-6 lg:grid-cols-4"
          : "mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 md:gap-6 lg:grid-cols-3";

  return (
    <section aria-labelledby="leistungen" className="py-14 md:py-20">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          {eyebrow && (
            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-ink-3">{eyebrow}</p>
          )}
          {heading && (
            <h2 id="leistungen" className="mt-4 font-boxi text-2xl leading-none text-ink md:text-4xl">
              {heading}
            </h2>
          )}
          {introParagraphs.map((p, i) => (
            <p key={i} className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              {p}
            </p>
          ))}
        </Reveal>

        <div className={gridClass}>
          {items.map((item, i) => {
            const hex = accents[i % accents.length];
            return (
              <Reveal key={item.title} delay={Math.min(i * 0.06, 0.3)}>
                <div className="group relative h-full overflow-hidden rounded-[26px] border border-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lift">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ backgroundImage: `radial-gradient(120% 90% at 0% 0%, ${hex}14, transparent 65%)` }}
                  />
                  <div className="relative">
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: `${hex}1f`, color: hex }}
                    >
                      <FeatureIcon icon={item.icon} />
                    </span>
                    <h3 className="mt-4 font-boxi text-lg leading-snug text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-3">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {closingStatement && (
          <Reveal delay={0.3}>
            <p className="mx-auto mt-12 max-w-3xl text-center text-lg leading-relaxed text-ink-2 md:mt-16 md:text-xl">
              {closingStatement}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
