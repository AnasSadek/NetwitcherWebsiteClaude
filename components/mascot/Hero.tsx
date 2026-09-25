import { ButtonLink } from "@/components/Button";
import { withLocale, type Locale } from "@/lib/i18n/locale";
import { HeroStage } from "./HeroStage";

/**
 * Hero: WITCH auf der tiefvioletten Bühne, snows-artig komponiert.
 * Ein einziges h1: mobil über der Bühne (Tinte auf Papier), ab lg als
 * Overlay auf der Bühne (weiß auf Tiefviolett) — dieselben Elemente,
 * nur umpositioniert und umgefärbt.
 */
export function Hero({ locale = "de" }: { locale?: Locale }) {
  const L = (href: string) => withLocale(href, locale);
  return (
    <section
      className="bg-paper pt-20 md:pt-24"
      aria-label={locale === "ar" ? "نتويتشر، وكالة رقمية في برلين" : "Netwitcher, Digital Agency Berlin"}
    >
      <div className="mx-auto w-full max-w-[1560px] px-4 pb-10 sm:px-6 lg:pb-14">
        <div className="relative">
          {/* Copy: mobil oben, ab lg Overlay auf der Bühne. Die
              Bildkomposition (Maskottchen) ist fixe Grafik und bleibt
              unverändert — für Deutsch hält dir="ltr" die Textbox bewusst
              physisch links, wo im Rendering der freie Raum ist. Für
              Arabisch tauschen Textbox und Service-Karten (siehe
              HeroStage) bewusst die Seiten: Text rechts, Karten links,
              Charakter bleibt exakt mittig — daher hier dir="rtl", was
              die Textbox über die normale flex-start-Logik automatisch
              rechts positioniert, plus passend gespiegeltes Padding. */}
          <div
            dir={locale === "ar" ? "rtl" : "ltr"}
            className={`relative z-10 mx-auto mb-6 max-w-xl text-center lg:pointer-events-none lg:absolute lg:inset-0 lg:z-20 lg:mx-0 lg:mb-0 lg:flex lg:max-w-none lg:items-center ${
              locale === "ar" ? "lg:text-right" : "lg:text-left"
            }`}
          >
            <div
              dir={locale === "ar" ? "rtl" : "ltr"}
              className={`lg:max-w-xl ${locale === "ar" ? "lg:pr-12 xl:pr-16" : "lg:pl-12 xl:pl-16"}`}
            >
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-ink-3 lg:text-white/70">
                {locale === "ar" ? "وكالة رقمية · برلين" : "Digital Agency · Berlin"}
              </p>
              <h1 className="mt-4 font-boxi text-[9.5vw] leading-[1.05] text-ink sm:text-5xl lg:mt-5 lg:text-[3.1rem] lg:text-white xl:text-[3.7rem]">
                {locale === "ar" ? (
                  <>
                    نصنع <span className="bg-clip-text text-transparent brand-sweep">السحر</span>
                    <br />
                    لعلامتك التجارية.
                  </>
                ) : (
                  <>
                    WIR MACHEN
                    <br />
                    <span className="bg-clip-text text-transparent brand-sweep">MAGIE</span> AUS
                    <br />
                    DEINER MARKE.
                  </>
                )}
              </h1>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-2 sm:text-lg lg:mx-0 lg:mt-5 lg:max-w-sm lg:text-white/75">
                {locale === "ar"
                  ? "محتوى وحملات ومواقع وبرمجيات من فريق واحد. سحرٌ في كل نقرة."
                  : "Content, Kampagnen, Websites und Software aus einem Team. Magic in Every Click."}
              </p>
              <div className="pointer-events-auto mt-6 flex flex-wrap items-center justify-center gap-3 lg:mt-8 lg:justify-start">
                <ButtonLink
                  href={L("/kontakt")}
                  className="lg:!bg-white lg:!text-ink lg:hover:!bg-paper-2"
                >
                  {locale === "ar" ? "ابدأ مشروعك" : "Projekt starten"}
                </ButtonLink>
                <ButtonLink
                  href={L("/leistungen")}
                  variant="ghost"
                  className="lg:!border-white/25 lg:!text-white lg:hover:!border-white/60 lg:hover:!bg-white/10"
                >
                  {locale === "ar" ? "ماذا نقدم" : "Was wir können"}
                </ButtonLink>
              </div>
            </div>
          </div>

          <HeroStage locale={locale} />
        </div>
      </div>
    </section>
  );
}
