import { Reveal } from "@/components/Reveal";
import { ARROW_COLORS } from "@/components/arrows";
import { FeatureIcon } from "@/components/icons";
import type { PortfolioProject } from "@/lib/portfolio";

/**
 * Kaufland-Marktplatz-Performance-Abschnitt: Intro, KPI-Karten (nur
 * Sichtbarkeit/Qualität/Positionierung), eine kompakte 3-Indikatoren-
 * Visualisierung (BuyBox-Ring, Suchposition, Retourenquote) und eine kurze
 * Ergebnis-Aussage. Bewusst ohne Umsatz-, Bestell- oder Conversion-Daten.
 * Rendert nur, wenn `project.kauflandSection` gesetzt ist, nach der
 * TikTok-Shop-Sektion und vor `ProjectServices`.
 */
export function ProjectKaufland({ project }: { project: PortfolioProject }) {
  const section = project.kauflandSection!;
  const { eyebrow, heading, period, intro, kpis, visual, secondaryHeading, secondaryText, summary } = section;
  const hex = ARROW_COLORS[project.color];

  return (
    <section aria-labelledby="kaufland" className="py-14 md:py-20">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          {eyebrow && (
            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-ink-3">{eyebrow}</p>
          )}
          {heading && (
            <h2 id="kaufland" className="mt-4 font-boxi text-2xl leading-none text-ink md:text-4xl">
              {heading}
            </h2>
          )}
          {period && <p className="mt-3 text-sm font-semibold text-ink-3">{period}</p>}
          {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{intro}</p>}
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:mt-14 lg:grid-cols-4 lg:gap-6">
          {kpis.map((kpi, i) => (
            <Reveal key={kpi.label} delay={Math.min(i * 0.06, 0.3)}>
              <div className="group relative h-full overflow-hidden rounded-[26px] border border-line bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lift sm:p-6">
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
                    <FeatureIcon icon={kpi.icon} />
                  </span>
                  <div className="mt-4 font-boxi text-2xl leading-none text-ink sm:text-3xl md:text-4xl">
                    {kpi.value}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink">{kpi.label}</p>
                  {kpi.supporting && <p className="mt-1 text-xs leading-relaxed text-ink-3">{kpi.supporting}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-8 grid gap-8 rounded-[26px] border border-line bg-white p-6 shadow-soft sm:grid-cols-3 md:mt-10 md:gap-6 md:p-10">
            {/* BuyBox: echter Prozentwert -> Ring-Füllung ist hier zulässig. */}
            <div className="flex flex-col items-center text-center">
              <div className="relative h-28 w-28">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: `conic-gradient(${hex} 0 ${visual.buyBoxPct}%, #f2eeff 0)` }}
                />
                <div className="absolute inset-[10px] flex items-center justify-center rounded-full bg-white">
                  <span className="font-boxi text-xl text-ink">{visual.buyBoxDisplay}</span>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-ink">{visual.buyBoxLabel}</p>
            </div>

            {/* Suchposition: bewusst KEIN proportionaler Balken (keine
                Prozentzahl) — reine Zahl mit Icon-Badge, wie Retourenquote. */}
            <div className="flex flex-col items-center text-center">
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: `${hex}1f`, color: hex }}
              >
                <FeatureIcon icon="search" className="h-6 w-6" />
              </span>
              <div className="mt-4 font-boxi text-3xl text-ink">{visual.searchPositionDisplay}</div>
              <p className="mt-4 text-sm font-semibold text-ink">{visual.searchPositionLabel}</p>
            </div>

            {/* Retourenquote: bewusst KEIN proportionaler Balken (0,6 % wäre
                als Balken kaum sichtbar/irreführend) — reine Zahl. */}
            <div className="flex flex-col items-center text-center">
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: `${hex}1f`, color: hex }}
              >
                <FeatureIcon icon="percent" className="h-6 w-6" />
              </span>
              <div className="mt-4 font-boxi text-3xl text-ink">{visual.returnRateDisplay}</div>
              <p className="mt-4 text-sm font-semibold text-ink">{visual.returnRateLabel}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-14 text-center md:mt-20">
            {secondaryHeading && (
              <h3 className="font-boxi text-xl leading-none text-ink md:text-2xl">{secondaryHeading}</h3>
            )}
            {secondaryText && (
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-2">{secondaryText}</p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-[26px] border border-line bg-paper-2/60 p-6 md:mt-14 md:p-8">
            {summary.label && (
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-ink-3">
                {summary.label}
              </p>
            )}
            <p className="mt-3 text-lg leading-relaxed text-ink md:text-xl">{summary.body}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
