import type { Metadata } from "next";
import { CaseCard } from "@/components/CaseCard";
import { FinalCTA } from "@/components/FinalCTA";
import { SectionHeading } from "@/components/SectionHeading";
import { cases } from "@/lib/cases";

export const metadata: Metadata = {
  title: "Projekte & Case Studies – Content, Websites & Kampagnen",
  description:
    "So arbeitet Netwitcher: Case Studies aus Food, Beauty, E-Commerce, Handwerk und B2B – Herausforderung, Lösung und Ergebnis pro Projekt. Aus Berlin, für ganz Deutschland.",
};

export default function ProjektePage() {
  return (
    <>
      <section className="aurora relative overflow-hidden pt-36 pb-16 md:pt-44">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            align="left"
            eyebrow="Projekte & Case Studies"
            title={
              <span className="text-4xl md:text-5xl">
                Arbeit, die man <span className="text-gradient">messen kann</span>
              </span>
            }
            intro="Sechs Branchen, sechs typische Ausgangslagen, sechs Wege zum Ergebnis. Die Cases zeigen, wie wir denken und arbeiten – konkrete Kundennamen und Kennzahlen ergänzen wir nach Freigabe unserer Kunden."
          />
        </div>
      </section>
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((item, i) => (
              <CaseCard key={item.slug} item={item} delay={(i % 3) * 0.08} />
            ))}
          </div>
        </div>
      </section>
      <FinalCTA
        title="Dein Projekt könnte das nächste sein."
        text="Egal ob Restaurant, Shop, Handwerk oder B2B: Erzähl uns deine Ausgangslage – wir zeigen dir, wie wir sie angehen würden. Kostenlos und unverbindlich."
      />
    </>
  );
}
