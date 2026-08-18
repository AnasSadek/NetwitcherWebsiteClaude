import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/Button";
import { BrandStar } from "@/components/brand/Logo";

/**
 * Finale: tiefviolette Bühne, der Stern, ein Satz, ein Klick.
 * Ruhiger als alles davor — der CTA ist unmissverständlich.
 */
export function Finale() {
  return (
    <section className="px-5 pb-24 sm:px-8 md:pb-32" aria-labelledby="finale">
      <div className="stage-glow relative mx-auto max-w-[1500px] overflow-hidden rounded-[40px] bg-deep px-6 py-20 text-center shadow-lift md:py-28">
        <Reveal>
          <BrandStar size={84} className="mx-auto mb-9 drop-shadow-[0_12px_40px_rgba(139,92,246,0.55)]" />
          <h2 id="finale" className="mx-auto max-w-3xl font-boxi text-3xl leading-[1.12] text-white md:text-5xl">
            DEINE MARKE HAT
            <br />
            MAGIE VERDIENT.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-white/70">
            Erzähl uns in drei kurzen Schritten, was ansteht. Antwort innerhalb
            eines Werktags.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/kontakt" variant="light">
              Projekt starten
            </ButtonLink>
            <Link
              href="/kontakt#termin"
              className="font-heading text-sm font-bold text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Erstgespräch buchen
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
