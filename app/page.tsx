import type { Metadata } from "next";
import Link from "next/link";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Story } from "@/components/story/Story";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import { ServiceIcon } from "@/components/icons";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Content Creation & Digital Marketing Agentur Berlin – Netwitcher",
  description:
    "Content. Kampagnen. Conversion. Netwitcher ist die visuelle Digital Agency mit eigenem Content-Studio in Berlin: Produktfotografie, Reels, Video, Social Media, Ads und Webdesign.",
};

const accentText: Record<string, string> = {
  mint: "text-mint",
  violet: "text-violet",
  pink: "text-pink",
  sun: "text-sun",
  sky: "text-sky",
};

export default function HomePage() {
  return (
    <>
      {/* Cinematische Scroll-Story: From Attention to Conversion */}
      <Story />

      {/* Kompaktes Leistungs-Grid – kurze Labels, keine Textblöcke */}
      <section className="relative py-24 md:py-32" aria-labelledby="leistungen-home">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Leistungen"
            title={
              <span id="leistungen-home">
                Alles aus <span className="text-gradient">einer Hand</span>
              </span>
            }
          />
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 5) * 0.06} className="h-full">
                <Link
                  href={service.href}
                  className="group flex h-full flex-col items-start gap-4 rounded-2xl border border-line bg-night-700/60 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/25"
                >
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white/5 p-2.5 transition-transform duration-300 group-hover:scale-110 ${accentText[service.color]}`}
                  >
                    <ServiceIcon icon={service.icon} className="h-6 w-6" />
                  </span>
                  <span className="font-heading text-sm font-bold leading-snug">
                    {service.navTitle}
                  </span>
                  <span
                    className={`mt-auto inline-flex items-center gap-1.5 font-heading text-[10px] font-bold uppercase tracking-widest ${accentText[service.color]}`}
                  >
                    <svg width="10" height="10" viewBox="0 0 100 100" aria-hidden="true">
                      <path d={ARROW_PATH} fill={ARROW_COLORS[service.color]} transform="rotate(90 50 50)" />
                    </svg>
                    Mehr
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA
        title="Bereit für den nächsten Schritt?"
        text="Erzähl uns kurz, was du vorhast – wir zeigen dir den direktesten Weg von Aufmerksamkeit zu Anfragen."
      />
    </>
  );
}
