import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";

export const metadata: Metadata = {
  title: "FekraHub – unsere Plattform für Bildungseinrichtungen",
  description:
    "FekraHub ist die von Netwitcher entwickelte Verwaltungsplattform für Schulen und Bildungseinrichtungen: Anmeldungen, Kurse, Kommunikation und Berichte an einem Ort.",
};

const features = [
  { title: "Digitale Anmeldung", text: "Eltern melden Kinder online an – ohne Papierformulare, mit klarem Status für Verwaltung und Familien.", color: "mint" },
  { title: "Kurs- & Klassenverwaltung", text: "Kurse, Klassen, Lehrkräfte und Räume zentral organisiert – inklusive Zuweisungen und Kapazitäten.", color: "violet" },
  { title: "Kommunikation", text: "Ankündigungen und Nachrichten erreichen Eltern zuverlässig – mehrsprachig und nachvollziehbar.", color: "pink" },
  { title: "Berichte & Zeugnisse", text: "Leistungsberichte digital erstellen, freigeben und teilen – mit Rollen und Rechten für jedes Teammitglied.", color: "sun" },
  { title: "Rollen & Rechte", text: "Verwaltung, Lehrkräfte, Eltern: Jede Rolle sieht genau das, was sie braucht – nicht mehr und nicht weniger.", color: "sky" },
  { title: "Sicher & DSGVO-bewusst", text: "Entwickelt und gehostet mit Fokus auf Datenschutz – sensible Schülerdaten bleiben geschützt.", color: "mint" },
] as const;

export default function FekraHubPage() {
  return (
    <>
      <section className="aurora relative overflow-hidden pt-36 pb-20 md:pt-44">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <Reveal>
              <p className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em] text-sky">
                Produkte · FekraHub
              </p>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                FekraHub: Schulverwaltung,{" "}
                <span className="text-gradient">die sich selbst erklärt</span>
              </h1>
              <p className="mt-6 text-base leading-relaxed text-mist md:text-lg">
                FekraHub ist unsere selbst entwickelte Plattform für Schulen und
                Bildungseinrichtungen: Anmeldungen, Kurse, Kommunikation und
                Berichte an einem Ort – gebaut, weil Zettelwirtschaft und
                Excel-Listen wertvolle Zeit kosten, die in den Unterricht gehört.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <ButtonLink href="/kontakt?service=Software">Demo anfragen</ButtonLink>
                <ButtonLink href="/leistungen/softwareentwicklung" variant="secondary">
                  Eigene Lösung entwickeln lassen
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Funktionen"
            title="Alles Wichtige an einem Ort"
            intro="FekraHub deckt den Alltag einer Bildungseinrichtung ab – von der ersten Anmeldung bis zum Zeugnis."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.08}>
                <div className="h-full rounded-2xl border border-line bg-night-700/60 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                  <svg width="24" height="24" viewBox="0 0 100 100" aria-hidden="true" className="mb-4">
                    <path d={ARROW_PATH} fill={ARROW_COLORS[f.color]} />
                  </svg>
                  <h3 className="font-heading text-base font-bold">{f.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-mist">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-night-800 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Warum wir ein eigenes Produkt bauen
            </h2>
            <p className="mt-6 text-base leading-relaxed text-mist">
              FekraHub ist mehr als ein Produkt – es ist unser Beweis, dass wir
              Software nicht nur versprechen, sondern betreiben. Jede Erfahrung aus
              dem echten Plattform-Alltag – Rollenmodelle, Datenmodelle, Support –
              fließt direkt in die individuellen Lösungen, die wir für Kunden
              entwickeln.
            </p>
          </Reveal>
        </div>
      </section>

      <FinalCTA
        title="Interesse an FekraHub – oder an deiner eigenen Plattform?"
        text="Wir zeigen dir FekraHub gern in einer Demo. Und wenn du ein eigenes digitales Werkzeug brauchst: Genau solche Systeme entwickeln wir."
      />
    </>
  );
}
