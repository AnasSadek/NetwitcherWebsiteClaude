import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import type { AccentColor } from "@/lib/services";
import { getService } from "@/lib/services";

/**
 * Editorial-Leistungsübersicht statt generischem Karten-Grid.
 * Drei Bänder — MACHEN / BEWEGEN / BAUEN — mit kontrollierter Asymmetrie:
 * riesige EP-Boxi-Nummer + Band-Titel links bzw. rechts versetzt, Services als
 * fließende Liste mit Pfeil-Bullets. Nur kurze Labels, keine Textblöcke.
 */

type Band = {
  title: string;
  lead: string;
  accent: AccentColor;
  slugs: string[];
};

const BANDS: Band[] = [
  {
    title: "Machen",
    lead: "Produktion: die Fotos, Reels und Videos, die deine Marke jeden Monat braucht. Aus dem Studio Berlin.",
    accent: "pink",
    slugs: ["studio", "foto-videoproduktion", "branding-design", "druck-printdesign"],
  },
  {
    title: "Bewegen",
    lead: "Distribution: produzierter Content wird zu Kampagnen, auf den Kanälen, wo deine Kunden sind.",
    accent: "sky",
    slugs: ["social-media-management", "performance-marketing", "seo"],
  },
  {
    title: "Bauen",
    lead: "Digitale Erlebnisse: die Website, der Shop und die Systeme, die aus Aufmerksamkeit Anfragen machen.",
    accent: "mint",
    slugs: ["webdesign-ecommerce", "softwareentwicklung", "technischer-support"],
  },
];

function BandRow({ band, index }: { band: Band; index: number }) {
  const flip = index % 2 === 1; // Band 2 spiegelverkehrt → Asymmetrie
  const hex = ARROW_COLORS[band.accent];
  const items = band.slugs.map((s) => getService(s)).filter(Boolean);

  return (
    <div className="relative border-t border-line py-14 md:py-20">
      <div
        className={`grid items-start gap-y-8 md:grid-cols-12 md:gap-x-10 ${
          flip ? "md:[direction:rtl]" : ""
        }`}
      >
        {/* Titelspalte */}
        <Reveal className={`md:col-span-5 ${flip ? "md:[direction:ltr]" : ""}`}>
          <h3 className="flex items-baseline gap-4">
            <span
              className="font-heading text-5xl font-black leading-none tracking-tight break-words sm:text-6xl lg:text-8xl"
              style={{ color: hex }}
            >
              {band.title}
            </span>
          </h3>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-mist">{band.lead}</p>
        </Reveal>

        {/* Leistungsliste */}
        <div className={`md:col-span-7 ${flip ? "md:[direction:ltr]" : ""}`}>
          <ul className="divide-y divide-line">
            {items.map((s, i) => (
              <Reveal as="li" key={s!.slug} delay={i * 0.05}>
                <Link
                  href={s!.href}
                  className="group flex items-center gap-4 py-4 transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                    className="shrink-0 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    <path d={ARROW_PATH} fill={hex} transform="rotate(90 50 50)" />
                  </svg>
                  <span className="font-heading text-lg font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-1 md:text-2xl">
                    {s!.navTitle}
                  </span>
                  <span className="ml-auto hidden max-w-[16rem] text-right text-xs text-mist md:block">
                    {s!.bullets[0]}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ServiceBands() {
  return (
    <section className="relative py-24 md:py-32" aria-labelledby="leistungen-home">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 id="leistungen-home" className="max-w-xl text-3xl font-black leading-[1.05] tracking-tight md:text-5xl">
                Ein Team. Von der Aufnahme bis zur Anfrage.
              </h2>
            </div>
            <Link
              href="/leistungen"
              className="group inline-flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-widest text-snow"
            >
              Alle Leistungen
              <svg width="11" height="11" viewBox="0 0 100 100" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                <path d={ARROW_PATH} fill="currentColor" transform="rotate(90 50 50)" />
              </svg>
            </Link>
          </div>
        </Reveal>

        <div className="mt-10">
          {BANDS.map((band, i) => (
            <BandRow key={band.title} band={band} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
