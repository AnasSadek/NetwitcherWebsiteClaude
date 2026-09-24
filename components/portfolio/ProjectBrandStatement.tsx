import { Reveal } from "@/components/Reveal";
import type { PortfolioProject } from "@/lib/portfolio";

/**
 * Grosse, zentrierte Marken-Aussage vor dem finalen CTA/Next-Project —
 * rendert nur, wenn `project.brandStatement` gesetzt ist (aktuell nur bei
 * Netwitcher selbst).
 */
export function ProjectBrandStatement({ project }: { project: PortfolioProject }) {
  const { heading, body } = project.brandStatement!;
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[900px] px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="font-boxi text-3xl leading-[0.95] text-ink md:text-6xl">{heading}</h2>
          {body && <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-2 md:text-xl">{body}</p>}
        </Reveal>
      </div>
    </section>
  );
}
