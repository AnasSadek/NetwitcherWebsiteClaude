import { Reveal } from "@/components/Reveal";
import type { PortfolioProject } from "@/lib/portfolio";
import { ReelGallery } from "./ReelGallery";

/**
 * Eigener Reels-Abschnitt mit Eyebrow/Überschrift/Intro — anders als die
 * numerierten `screenSections`-Kapitel (FridaEU/ABZiel/Falioun), die unter
 * der fixen "DAS PRODUKT."/"DAS ERLEBNIS."-Überschrift laufen. Nutzt
 * dieselbe `ReelGallery`/`InstagramEmbed`-Karte (offizielles Instagram-
 * Embed, gleiche schwebende, leicht gedrehte Präsentation). Rendert nur,
 * wenn `project.reelsSection` gesetzt ist.
 */
export function ProjectReels({ project }: { project: PortfolioProject }) {
  const { eyebrow, heading, intro, reels } = project.reelsSection!;
  return (
    <section aria-labelledby="reels" className="py-14 md:py-20">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          {eyebrow && (
            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-ink-3">{eyebrow}</p>
          )}
          {heading && (
            <h2 id="reels" className="mt-4 font-boxi text-2xl leading-none text-ink md:text-4xl">
              {heading}
            </h2>
          )}
          {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{intro}</p>}
        </Reveal>

        <div className="mt-10 md:mt-14">
          <ReelGallery reels={reels} color={project.color} />
        </div>
      </div>
    </section>
  );
}
