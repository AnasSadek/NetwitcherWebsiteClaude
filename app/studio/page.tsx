import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/Button";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import { media } from "@/lib/media";
import { getService } from "@/lib/services";

const studio = getService("studio")!;

export const metadata: Metadata = {
  title: studio.seo.title,
  description: studio.seo.description,
};

const studioAngebote = [
  { title: "Produktfotografie", text: "E-Commerce-Freisteller, Lifestyle-Szenen und Detailaufnahmen mit Set-Design – Bilder, die den Preis deines Produkts rechtfertigen.", color: "sun" },
  { title: "Food & Beverage Shoots", text: "Gerichte, Drinks und Zutaten, inszeniert mit Licht und Textur – Content, der Appetit macht und Reservierungen bringt.", color: "pink" },
  { title: "Beauty & Kosmetik Content", text: "Texturen, Swatches, Anwendung: Beauty-Content mit dem Look großer Marken – produziert für Feed, Shop und Ads.", color: "violet" },
  { title: "E-Commerce Produktbilder", text: "Einheitliche Bildserien für dein komplettes Sortiment – konsistent, skalierbar und shop-optimiert angeliefert.", color: "mint" },
  { title: "Reels für Instagram & TikTok", text: "Vertikal gedacht, mit Hook geplant, nativ geschnitten – Reels, die organische Reichweite holen statt sie zu kaufen.", color: "sky" },
  { title: "Werbevideos für Ads", text: "Kurze Performance-Videos mit klarer Botschaft und CTA – das Material, das Meta- und TikTok-Kampagnen wirklich brauchen.", color: "violet" },
  { title: "Behind-the-Scenes Content", text: "Echte Einblicke in dein Team und deine Produktion – der Content, der Vertrauen aufbaut und Marken nahbar macht.", color: "pink" },
  { title: "Content für Webseiten & Landingpages", text: "Header-Bilder, Team-Fotos und Produktvisuals, die deine Website vom Template zum Markenauftritt machen.", color: "mint" },
] as const;

export default function StudioPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(800px 450px at 75% 10%, rgba(244,104,168,.16), transparent 65%), radial-gradient(600px 400px at 15% 80%, rgba(245,211,61,.1), transparent 65%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em] text-pink">
                {studio.hero.eyebrow} · Studio Berlin
              </p>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                {studio.hero.headline}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-mist md:text-lg">
                {studio.hero.intro}
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <ButtonLink href="/kontakt?service=Fotoshooting" variant="warm">
                  Studio-Shooting anfragen
                </ButtonLink>
                <ButtonLink href="/kontakt#termin" variant="secondary">
                  Kostenloses Erstgespräch
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-pink/40 via-violet/25 to-sun/40 opacity-60 blur-xl"
                />
                <Image
                  src={media.studio.src}
                  alt={media.studio.alt}
                  width={media.studio.width}
                  height={media.studio.height}
                  className="relative rounded-3xl border border-line object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Was im Studio entsteht */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Was im Studio entsteht"
            eyebrowColor="text-pink"
            title={
              <>
                Ein Ort. <span className="text-gradient-warm">Alle Formate.</span>
              </>
            }
            intro="Vom Produktbild bis zum Kampagnenvideo: Wir produzieren dort, wo Licht, Technik und Team schon bereitstehen – das macht uns schnell und die Qualität konstant."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {studioAngebote.map((item, i) => (
              <Reveal key={item.title} delay={(i % 4) * 0.07}>
                <div className="group h-full rounded-2xl border border-line bg-night-700/60 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                  <svg width="22" height="22" viewBox="0 0 100 100" aria-hidden="true" className="mb-4 transition-transform duration-300 group-hover:rotate-12">
                    <path d={ARROW_PATH} fill={ARROW_COLORS[item.color]} />
                  </svg>
                  <h3 className="font-heading text-sm font-bold leading-snug">{item.title}</h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-mist">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bild-Duo: Produkt + Reels */}
      <section className="bg-night-800 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-stretch gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <Reveal>
              <figure className="relative h-full overflow-hidden rounded-3xl border border-line">
                <Image
                  src={media.product.src}
                  alt={media.product.alt}
                  width={media.product.width}
                  height={media.product.height}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <figcaption className="absolute bottom-4 left-4 rounded-full border border-line bg-night/80 px-4 py-2 font-heading text-[11px] font-bold uppercase tracking-widest text-mint backdrop-blur">
                  Produktfotografie
                </figcaption>
              </figure>
            </Reveal>
            <div className="flex flex-col gap-6">
              <Reveal delay={0.1}>
                <figure className="relative overflow-hidden rounded-3xl border border-line">
                  <Image
                    src={media.reels.src}
                    alt={media.reels.alt}
                    width={media.reels.width}
                    height={media.reels.height}
                    className="w-full object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(min-width: 1024px) 55vw, 100vw"
                  />
                  <figcaption className="absolute bottom-4 left-4 rounded-full border border-line bg-night/80 px-4 py-2 font-heading text-[11px] font-bold uppercase tracking-widest text-sky backdrop-blur">
                    Reels & Video-Produktion
                  </figcaption>
                </figure>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="flex flex-1 flex-col justify-center rounded-3xl border border-line bg-night-700/60 p-8 backdrop-blur">
                  <h2 className="font-heading text-xl font-bold">
                    Produkt einsenden, Content zurückbekommen
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-mist">
                    Du musst für ein Shooting nicht nach Berlin kommen: Sende uns dein
                    Produkt, wir übernehmen Set-Design, Produktion, Nachbearbeitung und
                    Rückversand. Innerhalb weniger Tage hast du kampagnenfertigen
                    Content im Postfach.
                  </p>
                  <div className="mt-6">
                    <ButtonLink href="/kontakt?service=Fotoshooting" variant="warm">
                      Studio-Shooting anfragen
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Inhaltliche Sektionen aus dem Servicedatensatz */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3">
          {studio.sections.map((sec, i) => (
            <Reveal key={sec.heading} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-line bg-night-700/60 p-8 backdrop-blur">
                <svg width="24" height="24" viewBox="0 0 100 100" aria-hidden="true" className="mb-5">
                  <path d={ARROW_PATH} fill={ARROW_COLORS.pink} transform={`rotate(${i * 72} 50 50)`} />
                </svg>
                <h2 className="font-heading text-lg font-bold leading-snug">{sec.heading}</h2>
                <p className="mt-3.5 text-sm leading-relaxed text-mist">{sec.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-night-800 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading eyebrow="Häufige Fragen" eyebrowColor="text-pink" title="Gut zu wissen" />
          <div className="mt-10 space-y-4">
            {studio.faq.map((f) => (
              <Reveal key={f.q}>
                <details className="group rounded-2xl border border-line bg-night-700/60 px-6 py-5 backdrop-blur">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-sm font-bold">
                    {f.q}
                    <span aria-hidden="true" className="text-mist transition-transform duration-200 group-open:rotate-45">＋</span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-mist">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA
        title="Dein Produkt verdient bessere Bilder."
        text="Erzähl uns, was du verkaufst – wir zeigen dir, wie es im richtigen Licht aussieht. Erstgespräch und Konzeptidee sind kostenlos."
      />
    </>
  );
}
