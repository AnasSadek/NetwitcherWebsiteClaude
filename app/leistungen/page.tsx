import type { Metadata } from "next";
import { FinalCTA } from "@/components/FinalCTA";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Leistungen – Content, Marketing, Web & Design aus Berlin",
  description:
    "Alle Leistungen von Netwitcher Berlin: Content Creation, Foto- & Videoproduktion, Social Media, Performance Marketing, Webdesign, SEO, Branding, Software, Support und Print.",
};

export default function LeistungenPage() {
  return (
    <>
      <section className="aurora relative overflow-hidden pt-36 pb-20 md:pt-44">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            align="left"
            eyebrow="Leistungen"
            title={
              <span className="text-4xl md:text-5xl">
                Alles, was deine Marke <span className="text-gradient">wachsen lässt</span>
              </span>
            }
            intro="Zehn Bereiche, ein Team: Wir verbinden Content-Produktion, Kampagnen und Technik so, dass jeder Baustein auf dasselbe Ziel einzahlt – mehr Sichtbarkeit, mehr Vertrauen, mehr Anfragen. Wähl den Bereich, der dich gerade weiterbringt."
          />
        </div>
      </section>
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ServiceCard key={service.slug} service={service} delay={(i % 3) * 0.08} />
            ))}
          </div>
        </div>
      </section>
      <FinalCTA
        title="Nicht sicher, wo du anfangen sollst?"
        text="Kein Problem – dafür ist das Erstgespräch da. Wir schauen gemeinsam auf dein Unternehmen und sagen dir ehrlich, welcher Hebel bei dir zuerst wirkt: Content, Kampagnen oder Website."
      />
    </>
  );
}
