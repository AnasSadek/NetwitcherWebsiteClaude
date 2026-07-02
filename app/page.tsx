import type { Metadata } from "next";
import Image from "next/image";
import { ArrowAssembly } from "@/components/ArrowAssembly";
import { ButtonLink, ArrowLink } from "@/components/Button";
import { CaseCard } from "@/components/CaseCard";
import { FinalCTA } from "@/components/FinalCTA";
import { HeroArrows } from "@/components/HeroArrows";
import { HeroVideo } from "@/components/HeroVideo";
import { PackageCard } from "@/components/PackageCard";
import { ProcessSteps } from "@/components/ProcessSteps";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { TrustChips } from "@/components/TrustChips";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import { cases } from "@/lib/cases";
import { media } from "@/lib/media";
import { contentPackages, packagesNote } from "@/lib/packages";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Content Creation & Digital Marketing Agentur Berlin – Netwitcher",
  description:
    "Content, der auffällt. Marketing, das verkauft. Netwitcher produziert Produktfotos, Reels, Videos, Kampagnen und Webseiten in Berlin – aus Aufmerksamkeit werden echte Anfragen.",
};

const problemCards = [
  {
    color: "mint",
    title: "Sichtbarkeit",
    text: "Content, der sofort auffällt – mit Hooks, starken Bildern und Formaten, die der Algorithmus belohnt.",
  },
  {
    color: "violet",
    title: "Vertrauen",
    text: "Fotos und Videos, die professionell wirken – und deine Marke in der Preisklasse zeigen, in die sie gehört.",
  },
  {
    color: "pink",
    title: "Anfragen",
    text: "Kampagnen, die auf Conversion optimiert sind – mit sauberem Tracking und klaren nächsten Schritten.",
  },
] as const;

const studioBlocks = [
  "Produktfotografie",
  "Food & Beverage Shoots",
  "Beauty & Kosmetik Content",
  "E-Commerce Produktbilder",
  "Reels für Instagram & TikTok",
  "Werbevideos für Ads",
  "Behind-the-Scenes Content",
  "Content für Webseiten & Landingpages",
];

const whyCards = [
  {
    title: "Strategie vor Produktion",
    text: "Kein Shooting ohne Konzept: Erst Zielgruppe und Ziel, dann Kamera. So hat jedes Asset einen Job.",
  },
  {
    title: "Eigenes Studio in Berlin",
    text: "Kurze Wege, schnelle Produktionen, konstante Qualität – ohne Mietstudio-Aufschlag und Terminchaos.",
  },
  {
    title: "Content + Ads aus einer Hand",
    text: "Die Creatives kommen aus demselben Team, das die Kampagnen steuert. Learnings fließen direkt zurück in die Produktion.",
  },
  {
    title: "Mehrsprachiges Zielgruppen-Verständnis",
    text: "Wir sprechen die Sprachen deiner Kunden in Deutschland – kulturell wie sprachlich. Das macht Botschaften präziser.",
  },
  {
    title: "Schnelle Umsetzung",
    text: "Vom Erstgespräch zur ersten Produktion in Tagen statt Monaten – mit klaren Timelines und festen Ansprechpartnern.",
  },
  {
    title: "Design, Technik & Marketing in einem Team",
    text: "Website, Content und Kampagnen greifen ineinander, weil sie am selben Tisch entstehen – ohne Reibungsverluste zwischen drei Dienstleistern.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* 1 · HERO */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
        <HeroVideo />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <Reveal>
              <p className="mb-5 font-heading text-xs font-medium uppercase tracking-[0.3em] text-mint">
                Digital Agency & Content-Studio · Berlin
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Content, der <span className="text-gradient-warm">auffällt</span>.
                <br />
                Marketing, das <span className="text-gradient">verkauft</span>.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-mist md:text-lg">
                Netwitcher ist deine Digital Agency und dein Content-Studio in
                Berlin. Wir produzieren Fotos, Reels, Videos, Kampagnen und
                Webseiten, die nicht nur gut aussehen – sondern aus
                Aufmerksamkeit echte Anfragen machen.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-wrap gap-4">
                <ButtonLink href="/kontakt#termin">
                  Kostenloses Erstgespräch buchen
                </ButtonLink>
                <ButtonLink href="/leistungen" variant="secondary">
                  Unsere Leistungen ansehen
                </ButtonLink>
                <ButtonLink href="/studio" variant="warm">
                  Studio in Berlin entdecken
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10">
                <TrustChips />
              </div>
            </Reveal>
          </div>
          <HeroArrows className="mx-auto hidden h-[440px] w-full max-w-md lg:block" />
        </div>
      </section>

      {/* 2 · PROBLEM / HOOK */}
      <section className="relative py-24 md:py-32" aria-labelledby="hook">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Warum die meisten Posts nichts bringen"
            title={
              <span id="hook">
                Guter Content ist kein Zufall.{" "}
                <span className="text-gradient">Er ist ein System.</span>
              </span>
            }
            intro="Viele Unternehmen posten regelmäßig – aber ohne Strategie, ohne starke Bilder und ohne klare Botschaft. Das Ergebnis: wenig Reichweite, schwache Anfragen und Werbung, die Budget verbrennt. Wir verbinden Strategie, Produktion und Performance, damit dein Content sichtbar wird und deine Kampagnen besser funktionieren."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {problemCards.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.1}>
                <div className="group h-full rounded-2xl border border-line bg-night-700/60 p-8 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                  <svg width="28" height="28" viewBox="0 0 100 100" aria-hidden="true" className="mb-5 transition-transform duration-300 group-hover:rotate-12">
                    <path d={ARROW_PATH} fill={ARROW_COLORS[card.color]} />
                  </svg>
                  <h3 className="font-heading text-xl font-bold">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{card.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · STUDIO BERLIN */}
      <section className="relative overflow-hidden bg-night-800 py-24 md:py-32" aria-labelledby="studio">
        <div className="aurora absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-pink/40 via-violet/30 to-sky/40 opacity-60 blur-xl"
                />
                <Image
                  src={media.studio.src}
                  alt={media.studio.alt}
                  width={media.studio.width}
                  height={media.studio.height}
                  className="relative rounded-3xl border border-line object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  priority={false}
                />
                <div className="absolute bottom-4 left-4 rounded-full border border-line bg-night/80 px-4 py-2 font-heading text-[11px] font-bold uppercase tracking-widest text-sun backdrop-blur">
                  ✦ Neu in Berlin
                </div>
              </div>
            </Reveal>
            <div>
              <SectionHeading
                align="left"
                eyebrow="Produktfotografie · Reels · Werbevideos"
                eyebrowColor="text-pink"
                title={
                  <span id="studio">
                    Unser neues{" "}
                    <span className="text-gradient-warm">Content-Studio</span> in
                    Berlin
                  </span>
                }
                intro="In unserem Studio in Berlin produzieren wir professionelle Produktfotos, Social-Media-Reels, Werbevideos, UGC-Content, Kampagnenmaterial und Markenbilder – schnell, hochwertig und passend zu deiner Zielgruppe."
              />
              <Reveal delay={0.15}>
                <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {studioBlocks.map((block, i) => (
                    <li key={block} className="flex items-center gap-3 rounded-xl border border-line bg-white/[.03] px-4 py-3 text-sm">
                      <svg width="13" height="13" viewBox="0 0 100 100" aria-hidden="true" className="shrink-0">
                        <path d={ARROW_PATH} fill={Object.values(ARROW_COLORS)[i % 5]} transform="rotate(90 50 50)" />
                      </svg>
                      {block}
                    </li>
                  ))}
                </ul>
                <div className="mt-9 flex flex-wrap gap-4">
                  <ButtonLink href="/kontakt?service=Fotoshooting" variant="warm">
                    Studio-Shooting anfragen
                  </ButtonLink>
                  <ArrowLink href="/studio" className="py-3.5">
                    Mehr über das Studio
                  </ArrowLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · LEISTUNGEN */}
      <section className="py-24 md:py-32" aria-labelledby="leistungen-home">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Alles für dein Wachstum – aus einer Hand"
            title={
              <span id="leistungen-home">
                Unsere <span className="text-gradient">Leistungen</span>
              </span>
            }
            intro="Von der ersten Aufnahme bis zur skalierten Kampagne: Zehn Bereiche, ein Team, ein Ziel – mehr Anfragen für dein Unternehmen."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ServiceCard key={service.slug} service={service} delay={(i % 3) * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* 5 · WARUM NETWITCHER */}
      <section className="bg-night-800 py-24 md:py-32" aria-labelledby="warum">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Was uns anders macht"
            title={<span id="warum">Warum Netwitcher?</span>}
            intro="Wir denken Content nicht als Dekoration, sondern als Verkaufswerkzeug. Jede Aufnahme, jedes Reel, jede Anzeige und jede Landingpage hat ein klares Ziel: Aufmerksamkeit gewinnen, Vertrauen aufbauen und Anfragen erzeugen."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyCards.map((card, i) => (
              <Reveal key={card.title} delay={(i % 3) * 0.08}>
                <div className="h-full rounded-2xl border border-line bg-night-700/60 p-7 backdrop-blur transition-colors hover:border-violet/40">
                  <span className="font-heading text-2xl font-extrabold text-gradient">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-heading text-base font-bold">{card.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-mist">{card.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6 · INTERAKTIVE PFEILE */}
      <section className="relative overflow-hidden py-24 md:py-32" aria-labelledby="stern">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Magic in Every Click"
            title={
              <span id="stern">
                Fünf Pfeile. <span className="text-gradient">Ein Ziel: dein Wachstum.</span>
              </span>
            }
            intro="Die fünf Pfeile unseres Logos stehen für die fünf Wege, auf denen wir Marken nach vorn bringen. Scroll, sieh zu, wie sie sich zum Stern verbinden – und klick den Bereich an, der dich weiterbringt."
          />
          <div className="mt-10">
            <ArrowAssembly />
          </div>
        </div>
      </section>

      {/* 7 · PROZESS */}
      <section className="bg-night-800 py-24 md:py-32" aria-labelledby="prozess">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Klar, schnell, transparent"
            title={<span id="prozess">So läuft die Zusammenarbeit</span>}
            intro="Fünf Schritte von der ersten Idee bis zur laufenden Optimierung – du weißt in jeder Phase, was passiert und warum."
          />
          <div className="mt-16">
            <ProcessSteps />
          </div>
        </div>
      </section>

      {/* 8 · PROJEKTE / CASES */}
      <section className="py-24 md:py-32" aria-labelledby="projekte-home">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Branchen, die wir bewegen"
            title={
              <span id="projekte-home">
                Projekte & <span className="text-gradient">Case Studies</span>
              </span>
            }
            intro="Von Food-Content bis B2B-Website: So gehen wir Herausforderungen an. Konkrete Kennzahlen ergänzen wir nach Freigabe unserer Kunden."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((item, i) => (
              <CaseCard key={item.slug} item={item} delay={(i % 3) * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* 9 · PAKETE */}
      <section className="bg-night-800 py-24 md:py-32" aria-labelledby="pakete">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Planbarer Content, planbares Wachstum"
            title={
              <span id="pakete">
                Content-Pakete für <span className="text-gradient">jede Wachstumsphase</span>
              </span>
            }
            intro={packagesNote}
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {contentPackages.map((pkg, i) => (
              <PackageCard key={pkg.name} pkg={pkg} delay={(i % 4) * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* 10 · FINAL CTA */}
      <FinalCTA />
    </>
  );
}
