import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/Reveal";
import { media } from "@/lib/media";

/**
 * Kapitel 02 — Content Studio Berlin.
 *
 * Kein Karten-Grid: ein redaktioneller Studio-Spread. Zwei Aufnahmen
 * unterschiedlicher Höhe, versetzt gesetzt, Typo bricht in die Bildkante.
 * Die Leistungen stehen als Index daneben — lesbar, nicht als Icon-Kacheln.
 */
export function Studio() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-[6vw]">
        {/* Kopf: Typo links, Kennzeichnung rechts */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <h2 className="max-w-2xl font-heading text-3xl font-black leading-[1.02] tracking-tight md:text-6xl">
              Produktion, die nach
              <br />
              deiner Marke aussieht.
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-mist">
              Foto, Reels und Werbecontent aus unserem Studio in Berlin. Geplant,
              produziert und geschnitten im selben Team.
            </p>
          </div>
        </Reveal>

        {/* Spread */}
        <div className="mt-12 grid gap-6 md:grid-cols-12 md:gap-5">
          {/* Große Studio-Totale */}
          <Reveal className="md:col-span-7">
            <figure className="relative overflow-hidden">
              <Media
                asset={media.studio}
                sizes="(min-width: 768px) 58vw, 100vw"
                className="aspect-[16/11] w-full object-cover"
              />
            </figure>
          </Reveal>

          {/* Leistungs-Index */}
          <Reveal className="md:col-span-5 md:pl-4" delay={0.1}>
            <ul className="divide-y divide-line border-t border-line">
              {[
                ["Produktfotografie", "E-Commerce, Food, Beauty"],
                ["Reels & Short Video", "Vertikal, nativ geschnitten"],
                ["Werbevideo", "Für Meta, TikTok & YouTube"],
                ["Social Content", "Monatlich planbar"],
                ["Creative Direction", "Konzept & Shotplan"],
              ].map(([title, sub]) => (
                <li key={title} className="flex items-baseline justify-between gap-6 py-4">
                  <span className="font-heading text-lg font-bold tracking-tight md:text-xl">
                    {title}
                  </span>
                  <span className="text-right text-xs text-mist">{sub}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href="/kontakt?service=Fotoshooting" variant="studio">
                Studio anfragen
              </ButtonLink>
              <Link
                href="/studio"
                className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-mist underline-offset-4 transition-colors hover:text-snow hover:underline"
              >
                Studio ansehen
              </Link>
            </div>
          </Reveal>

          {/* Zwei versetzte Detailaufnahmen */}
          <Reveal className="md:col-span-4 md:mt-4" delay={0.05}>
            <figure>
              <Media
                asset={media.studioClose}
                sizes="(min-width: 768px) 32vw, 100vw"
                className="aspect-[3/4] w-full object-cover"
              />
            </figure>
          </Reveal>

          <Reveal className="md:col-span-8 md:mt-16" delay={0.12}>
            <figure>
              <Media
                asset={media.reels}
                sizes="(min-width: 768px) 64vw, 100vw"
                className="aspect-[16/9] w-full object-cover"
              />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
