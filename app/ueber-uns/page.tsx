import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { StarMark, ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import { ARROW_TARGETS } from "@/components/arrowTargets";

export const metadata: Metadata = {
  title: "Über uns – das Team hinter Netwitcher",
  description:
    "Netwitcher ist ein Berliner Studio für Content, Design, Technik und Marketing. Lerne das Team kennen, das Content als Verkaufswerkzeug denkt – nicht als Dekoration.",
};

const werte = [
  {
    title: "Ehrlichkeit vor Verkauf",
    text: "Wenn eine Leistung dir nichts bringt, sagen wir das – auch wenn wir sie im Angebot haben. Langfristige Kunden sind uns wichtiger als schnelle Abschlüsse.",
  },
  {
    title: "Ergebnisse vor Ästhetik",
    text: "Schön ist Pflicht, wirksam ist das Ziel. Wir messen unsere Arbeit an Anfragen, Verkäufen und Sichtbarkeit – nicht an Design-Preisen.",
  },
  {
    title: "Tempo mit Substanz",
    text: "Eigenes Studio, kurze Wege, eingespieltes Team: Wir liefern schnell, ohne dass Strategie und Qualität hinten runterfallen.",
  },
  {
    title: "Verständnis für Vielfalt",
    text: "Berlin ist mehrsprachig – wir auch. Wir verstehen Zielgruppen in Deutschland kulturell wie sprachlich und bauen Botschaften, die wirklich ankommen.",
  },
];

export default function UeberUnsPage() {
  return (
    <>
      <section className="aurora relative overflow-hidden pt-36 pb-20 md:pt-44">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_.8fr]">
            <Reveal>
              <p className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em] text-mint">
                Über uns
              </p>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Wir sind das Studio, das{" "}
                <span className="text-gradient">Content wie Vertrieb</span> denkt.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist md:text-lg">
                Netwitcher ist eine Digital Agency und ein Content-Studio aus Berlin.
                Wir haben Netwitcher gegründet, weil wir zu oft dasselbe gesehen haben:
                Unternehmen mit starken Produkten, deren Auftritt ihnen nicht gerecht
                wird – und Agenturen, die schöne Bilder liefern, aber keine Anfragen.
                Wir machen beides: Content, der auffällt, und Systeme, die daraus
                Kunden machen.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <ButtonLink href="/kontakt#termin">Lern uns kennen – kostenloses Erstgespräch</ButtonLink>
                <ButtonLink href="/studio" variant="secondary">Unser Studio in Berlin</ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="relative mx-auto flex h-72 w-72 items-center justify-center">
                <div aria-hidden="true" className="absolute inset-0 rounded-full bg-violet/15 blur-3xl" />
                <StarMark size={220} className="animate-float motion-reduce:animate-none" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Der Stern als Team-Philosophie */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Fünf Pfeile, ein Team"
            title={
              <>
                Warum unser Logo ein <span className="text-gradient">Stern aus Pfeilen</span> ist
              </>
            }
            intro="Jeder Pfeil steht für eine Disziplin – Webdesign, Strategie, Content, Fotografie, Social Media. Einzeln sind sie Werkzeuge. Zusammengesetzt ergeben sie den Stern: Marketing, das aus einem Guss funktioniert. Genau so arbeiten wir."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {ARROW_TARGETS.map((t, i) => (
              <Reveal key={t.color} delay={i * 0.07}>
                <div className="h-full rounded-2xl border border-line bg-night-700/60 p-6 text-center backdrop-blur transition-all duration-300 hover:-translate-y-1">
                  <svg width="34" height="34" viewBox="0 0 100 100" aria-hidden="true" className="mx-auto mb-4">
                    <path d={ARROW_PATH} fill={ARROW_COLORS[t.color]} transform={`rotate(${i * 72} 50 50)`} />
                  </svg>
                  <h3 className="font-heading text-sm font-bold leading-snug">{t.label}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Werte */}
      <section className="bg-night-800 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Wofür wir stehen"
            title="Vier Prinzipien, an denen du uns messen kannst"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {werte.map((wert, i) => (
              <Reveal key={wert.title} delay={(i % 2) * 0.08}>
                <div className="h-full rounded-2xl border border-line bg-night-700/60 p-8 backdrop-blur">
                  <span className="font-heading text-2xl font-extrabold text-gradient">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-heading text-lg font-bold">{wert.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{wert.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Berlin & Studio */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em] text-sun">
              Made in Berlin
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Berlin ist unser Zuhause – und unser Wettbewerbsvorteil
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mist">
              Mit unserem eigenen Content-Studio in Berlin produzieren wir dort, wo
              deine Zielgruppe lebt: schnell, flexibel und nah dran an Trends, die
              anderswo erst Monate später ankommen. Von hier aus betreuen wir
              Unternehmen in ganz Deutschland – vom lokalen Restaurant bis zur
              E-Commerce-Marke.
            </p>
            <div className="mt-9">
              <ButtonLink href="/studio" variant="warm">Studio entdecken</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCTA
        title="Klingt nach dem richtigen Team?"
        text="Dann lass uns reden. Im Erstgespräch lernst du uns kennen, wir dein Unternehmen – und du bekommst eine ehrliche Einschätzung, was für dich funktioniert."
      />
    </>
  );
}
