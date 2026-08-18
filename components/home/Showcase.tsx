import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Media } from "@/components/ui/Media";
import { ButtonLink } from "@/components/Button";
import { media } from "@/lib/media";

/**
 * „Aus dem Studio" — echte Produktionsaufnahmen als redaktioneller Spread.
 * Versetzte Höhen statt gleichförmigem Raster; keine erfundenen Kundennamen,
 * die Labels benennen, was tatsächlich zu sehen ist.
 */

const SHOTS = [
  { asset: media.reels, label: "Reel-Produktion", aspect: "aspect-[4/5]", offset: "" },
  { asset: media.studio, label: "Set & Licht, Studio Berlin", aspect: "aspect-[4/3]", offset: "md:mt-14" },
  { asset: media.product, label: "Produktfotografie", aspect: "aspect-[4/5]", offset: "md:mt-6" },
  { asset: media.studioClose, label: "Kamera am Produkttisch", aspect: "aspect-square", offset: "md:mt-20" },
] as const;

export function Showcase() {
  return (
    <section className="relative py-24 md:py-32" aria-labelledby="showcase">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="showcase" className="font-boxi text-3xl leading-[1.1] text-ink md:text-5xl">
              AUS DEM STUDIO.
            </h2>
            <ButtonLink href="/projekte" variant="ghost">
              Projekte ansehen
            </ButtonLink>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {SHOTS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07} className={s.offset}>
              <figure className="group">
                <div className={`overflow-hidden rounded-card ${s.aspect} shadow-soft`}>
                  <Media
                    asset={s.asset}
                    sizes="(min-width: 768px) 24vw, 46vw"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="mt-3 text-sm font-semibold text-ink-3">
                  {s.label}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-xl text-base leading-relaxed text-ink-2">
            Alles hier ist bei uns entstanden: eigenes Studio, eigenes Licht,
            eigener Schnitt. Konkrete Kundencases zeigen wir dir gern im{" "}
            <Link href="/kontakt#termin" className="font-semibold text-ink underline underline-offset-4 hover:text-violet">
              Erstgespräch
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
