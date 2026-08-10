import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { Media } from "@/components/ui/Media";
import { BrandStar } from "@/components/brand/Logo";
import { media } from "@/lib/media";

/**
 * Statische Fassung des Films für prefers-reduced-motion und Geräte ohne
 * WebGL. Dieselbe Erzählung, dieselben CTAs — als ruhige Kompositionen mit
 * kurzen Blenden statt Kinematografie.
 */
export function FilmStatic() {
  return (
    <div>
      {/* Szene 1 */}
      <section className="flex min-h-[100dvh] items-center pt-24">
        <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-[6vw]">
          <div className="max-w-2xl">
            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.28em] text-mist">
              Content Studio &amp; Digital Agency · Berlin
            </p>
            <h1 className="mt-6 font-boxi text-5xl leading-[1.02] text-snow md:text-7xl">
              NIEMAND
              <br />
              SCHAUT HIN.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-mist">
              Guter Content ändert das. Foto, Video, Social Media und Ads aus
              einem Team in Berlin.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/kontakt">Projekt starten</ButtonLink>
              <ButtonLink href="/leistungen" variant="ghost">
                Leistungen ansehen
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Szene 2+3: Produktion */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid w-full max-w-[1600px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:px-[6vw]">
          <figure>
            <Media asset={media.studio} sizes="(min-width:1024px) 48vw, 100vw" className="w-full object-cover" />
          </figure>
          <div>
            <h2 className="font-boxi text-3xl leading-[1.06] text-snow md:text-5xl">
              WIR MACHEN
              <br />
              MARKEN SICHTBAR.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-mist">
              Foto, Video, Reels und Creative Direction aus dem eigenen Studio
              in Berlin. Mehr als nur Aufnahme: Idee, Licht, Story, Motion,
              Sound, Schnitt.
            </p>
            <div className="mt-7">
              <ButtonLink href="/kontakt?service=Fotoshooting" variant="studio">
                Studio-Shooting anfragen
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Szene 4+5: Content + Formate */}
      <section className="border-t border-line py-20 md:py-28">
        <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-[6vw]">
          <h2 className="max-w-2xl font-boxi text-3xl leading-[1.08] text-snow md:text-5xl">
            EINE IDEE.
            <br />
            VIELE FORMATE.
          </h2>
          <p className="mt-4 max-w-md text-base text-mist">
            Aus Rohmaterial wird Content, der funktioniert: für Social Media,
            Ads und digitale Kampagnen.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <figure className="aspect-[9/16]">
              <Media asset={media.reels} className="h-full w-full object-cover" />
            </figure>
            <figure className="aspect-[4/5]">
              <Media asset={media.product} className="h-full w-full object-cover" />
            </figure>
            <figure className="aspect-square">
              <Media asset={media.studioClose} className="h-full w-full object-cover" />
            </figure>
            <figure className="aspect-video md:self-end">
              <Media asset={media.performance} className="h-full w-full object-cover" />
            </figure>
          </div>
        </div>
      </section>

      {/* Szene 6+7: Distribution */}
      <section className="border-t border-line bg-night-800 py-20 md:py-28">
        <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-[6vw]">
          <div className="max-w-xl">
            <h2 className="font-boxi text-3xl leading-[1.08] text-snow md:text-5xl">
              GUTER CONTENT MUSS
              <br />
              GESEHEN WERDEN.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-mist">
              Wir produzieren ihn. Und bringen ihn zu den richtigen Menschen:
              Social Media, Meta Ads, TikTok Ads, Google Ads.
            </p>
            <div className="mt-7">
              <ButtonLink href="/kontakt?service=Ads" variant="ghost">
                Kampagne besprechen
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Szene 8+9: Ziel + Handlung */}
      <section className="border-t border-line py-20 md:py-28">
        <div className="mx-auto grid w-full max-w-[1600px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:px-[6vw]">
          <div>
            <h2 className="font-boxi text-3xl leading-[1.08] text-snow md:text-4xl">
              AUFMERKSAMKEIT
              <br />
              BRAUCHT EIN ZIEL.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-mist">
              Webdesign, Landingpages, E-Commerce und Software: das digitale
              Zuhause, in dem aus Aufmerksamkeit Handlung wird.
            </p>
          </div>
          <figure>
            <Media asset={media.performance} sizes="(min-width:1024px) 48vw, 100vw" className="w-full object-cover" />
          </figure>
        </div>
      </section>

      {/* Szene 10 */}
      <section className="border-t border-line py-24 text-center md:py-36">
        <div className="mx-auto max-w-3xl px-5">
          <BrandStar size={96} className="mx-auto mb-10" />
          <h2 className="font-boxi text-3xl leading-[1.1] text-snow md:text-5xl">
            WIR MACHEN NICHT NUR CONTENT.
            <br />
            WIR SORGEN DAFÜR,
            <br />
            DASS ER ETWAS BEWIRKT.
          </h2>
          <p className="mt-5 font-heading text-xs font-bold uppercase tracking-[0.3em] text-mist">
            Content Studio &amp; Digital Agency · Berlin
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/kontakt">Projekt starten</ButtonLink>
            <Link
              href="/kontakt#termin"
              className="font-heading text-sm font-bold text-mist underline-offset-4 transition-colors hover:text-snow hover:underline"
            >
              Erstgespräch buchen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
