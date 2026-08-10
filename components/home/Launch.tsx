import { ButtonLink } from "@/components/Button";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/Reveal";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import { media } from "@/lib/media";

/**
 * Kapitel 04 + 05 — Distribution und digitales Ziel, als ein durchlaufender
 * Abschnitt: der produzierte Content geht in Kampagnen (dichter Rhythmus,
 * blau/violett) und landet auf einer Website (ruhiger, türkis).
 *
 * Keine Fake-Dashboards, keine erfundenen Zahlen, keine Chart-Balken.
 * Die „Kampagne" wird über Belegungsflächen und Sequenz gezeigt.
 */

const CHANNELS = [
  { label: "Social Media", note: "Redaktionsplan & Community" },
  { label: "Meta Ads", note: "Facebook & Instagram" },
  { label: "TikTok Ads", note: "Native Creatives" },
  { label: "Google Ads", note: "Suche & Shopping" },
] as const;

export function Launch() {
  return (
    <>
      {/* 04, Distribution: dicht gesetzt */}
      <section className="relative bg-night-800 py-20 md:py-28">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-[6vw]">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <Reveal className="lg:col-span-5">
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.28em] text-sky">
                Distribution
              </p>
              <h2 className="mt-5 font-heading text-3xl font-black leading-[1.03] tracking-tight md:text-5xl">
                Content ist erst
                <br />
                der Anfang.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-mist">
                Wir planen, veröffentlichen und bewerben die Inhalte dort, wo
                deine Zielgruppe sie sieht, mit sauberem Tracking statt
                Bauchgefühl.
              </p>
              <div className="mt-8">
                <ButtonLink href="/kontakt?service=Ads" variant="ghost">
                  Kampagne besprechen
                </ButtonLink>
              </div>
            </Reveal>

            {/* Belegungsflächen: dasselbe Motiv, in Kanalformate ausgespielt */}
            <Reveal className="lg:col-span-7" delay={0.1}>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {CHANNELS.map((c, i) => (
                  <li key={c.label} className="group">
                    <div
                      className="relative overflow-hidden bg-night-700"
                      style={{ aspectRatio: i === 0 ? "9 / 16" : i === 1 ? "4 / 5" : i === 2 ? "9 / 16" : "1 / 1" }}
                    >
                      <Media
                        asset={i % 2 === 0 ? media.product : media.reels}
                        sizes="(min-width: 640px) 18vw, 45vw"
                        className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                        style={{ background: i < 2 ? ARROW_COLORS.sky : ARROW_COLORS.violet }}
                      />
                    </div>
                    <p className="mt-3 font-heading text-sm font-bold tracking-tight">
                      {c.label}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-mist">{c.note}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05, Ziel: ruhiger, mehr Weißraum */}
      <section className="relative py-28 md:py-40">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-[6vw]">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-6 lg:order-2">
              <h2 className=" font-heading text-3xl font-black leading-[1.03] tracking-tight md:text-5xl">
                Traffic braucht
                <br />
                ein Ziel.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-mist">
                Wir bauen Websites, Landingpages und Shops, die zu deinem
                Content und deinen Kampagnen passen, schnell, messbar und
                auf die Anfrage hin gebaut.
              </p>
              <ul className="mt-8 max-w-md divide-y divide-line border-t border-line">
                {[
                  ["Webdesign", "WordPress oder individuell"],
                  ["Landingpages", "Für Kampagnen gebaut"],
                  ["E-Commerce", "Shopify & WooCommerce"],
                ].map(([t, s]) => (
                  <li key={t} className="flex items-baseline justify-between gap-6 py-3.5">
                    <span className="inline-flex items-center gap-2.5 font-heading text-base font-bold tracking-tight">
                      <svg width="12" height="12" viewBox="0 0 100 100" aria-hidden="true">
                        <path d={ARROW_PATH} fill={ARROW_COLORS.mint} transform="rotate(90 50 50)" />
                      </svg>
                      {t}
                    </span>
                    <span className="text-right text-xs text-mist">{s}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ButtonLink href="/leistungen/webdesign-ecommerce" variant="ghost">
                  Webdesign ansehen
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-6 lg:order-1" delay={0.1}>
              <figure className="relative">
                <Media
                  asset={media.performance}
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="aspect-[16/10] w-full object-cover"
                />
                <span aria-hidden="true" className="absolute left-4 top-4 h-5 w-5 border-l border-t border-white/30" />
                <span aria-hidden="true" className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-white/30" />
              </figure>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
