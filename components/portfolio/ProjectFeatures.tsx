import { Reveal } from "@/components/Reveal";
import { ARROW_COLORS } from "@/components/arrows";
import { FeatureIcon } from "@/components/icons";
import type { PortfolioProject } from "@/lib/portfolio";
import type { AccentColor } from "@/lib/services";

/** Zyklus durch die Marken-Akzentfarben (kein Gelb/Sonne — passt nicht zu den
 *  cyan/blau/violett/pink/mint-Tönen der FekraHub-Bildsprache), so gestreut,
 *  dass in einem 3er-Raster keine Farbe direkt übereinander wiederholt. */
const ACCENT_CYCLE: AccentColor[] = ["sky", "mint", "violet", "pink", "sky", "mint"];

/**
 * Reiner Text-/Icon-Abschnitt (kein Bild): Eyebrow, Überschrift, Intro und
 * ein responsives Karten-Raster. Rendert nur, wenn `project.features`
 * gesetzt ist — aktuell nur bei FekraHub, direkt vor der Produkt-Galerie.
 */
export function ProjectFeatures({ project }: { project: PortfolioProject }) {
  const { eyebrow, heading, intro, items } = project.features!;

  return (
    <section aria-labelledby="funktionen" className="py-14 md:py-20">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          {eyebrow && (
            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-ink-3">{eyebrow}</p>
          )}
          <h2 id="funktionen" className="mt-4 font-boxi text-2xl leading-none text-ink md:text-4xl">
            {heading ?? "ZENTRALE FUNKTIONEN"}
          </h2>
          {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{intro}</p>}
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 md:gap-6 lg:grid-cols-3">
          {items.map((item, i) => {
            const hex = ARROW_COLORS[ACCENT_CYCLE[i % ACCENT_CYCLE.length]];
            return (
              <Reveal key={item.title} delay={Math.min(i * 0.06, 0.3)}>
                <div className="group relative h-full overflow-hidden rounded-[26px] border border-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lift">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ backgroundImage: `radial-gradient(120% 90% at 0% 0%, ${hex}16, transparent 65%)` }}
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
      </div>
    </section>
  );
}
