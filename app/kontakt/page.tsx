import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { site, whatsappHref, defaultWhatsappText } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt – kostenloses Erstgespräch buchen",
  description:
    "Kontaktiere Netwitcher in Berlin: kostenloses Erstgespräch buchen, per WhatsApp schreiben oder Anfrage senden – für Content, Fotoshootings, Social Media, Ads, Websites und mehr.",
};

export default function KontaktPage() {
  return (
    <>
      <section className="aurora relative overflow-hidden pt-36 pb-14 md:pt-44">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            align="left"
            eyebrow="Kontakt"
            title={
              <span className="text-4xl md:text-5xl">
                Lass uns über <span className="text-gradient">dein Wachstum</span> reden
              </span>
            }
            intro="Erzähl uns kurz, was du vorhast – wir melden uns innerhalb eines Werktags mit einer ehrlichen Einschätzung. Kein Verkaufsdruck, keine Warteschleife."
          />
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_.9fr]">
          {/* Formular */}
          <Reveal>
            <div className="rounded-3xl border border-line bg-night-700/40 p-7 backdrop-blur md:p-10">
              <h2 className="mb-7 font-heading text-xl font-bold">Anfrage senden</h2>
              <ContactForm />
            </div>
          </Reveal>

          {/* Direktkontakt + Calendly */}
          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-line bg-night-700/40 p-7 backdrop-blur md:p-8">
                <h2 className="font-heading text-xl font-bold">Direkt erreichen</h2>
                <ul className="mt-6 space-y-4 text-sm">
                  <li>
                    <a
                      href={whatsappHref(defaultWhatsappText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-2xl border border-line bg-white/[.03] px-5 py-4 transition-colors hover:border-whatsapp/50"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-whatsapp/15 text-whatsapp" aria-hidden="true">✆</span>
                      <span>
                        <span className="block font-heading text-sm font-bold">WhatsApp</span>
                        <span className="text-mist">Schnellste Antwort – meist innerhalb weniger Stunden</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${site.email}`}
                      className="group flex items-center gap-4 rounded-2xl border border-line bg-white/[.03] px-5 py-4 transition-colors hover:border-violet/50"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-violet/15 text-violet" aria-hidden="true">✉</span>
                      <span>
                        <span className="block font-heading text-sm font-bold">E-Mail</span>
                        <span className="text-mist">{site.email}</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={site.phoneHref}
                      className="group flex items-center gap-4 rounded-2xl border border-line bg-white/[.03] px-5 py-4 transition-colors hover:border-sky/50"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky/15 text-sky" aria-hidden="true">☎</span>
                      <span>
                        <span className="block font-heading text-sm font-bold">Telefon</span>
                        <span className="text-mist">{site.phone}</span>
                      </span>
                    </a>
                  </li>
                  <li className="flex items-center gap-4 rounded-2xl border border-line bg-white/[.03] px-5 py-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sun/15 text-sun" aria-hidden="true">✦</span>
                    <span>
                      <span className="block font-heading text-sm font-bold">Studio</span>
                      <span className="text-mist">{site.city}, {site.country}</span>
                    </span>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div id="termin" className="scroll-mt-28 rounded-3xl border border-line bg-night-700/40 p-7 backdrop-blur md:p-8">
                <h2 className="font-heading text-xl font-bold">
                  Kostenloses Erstgespräch buchen
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  20–30 Minuten, in denen wir dein Vorhaben verstehen und dir eine
                  ehrliche Einschätzung geben – per Video-Call oder Telefon. Wähl
                  einfach einen Termin, der dir passt:
                </p>
                <a
                  href={site.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet to-sky px-6 py-4 font-heading text-sm font-bold tracking-wide text-night shadow-glow-violet transition-all duration-200 hover:-translate-y-0.5"
                >
                  Termin über Calendly wählen →
                </a>
                <p className="mt-4 text-xs text-mist">
                  Kein Calendly? Schreib uns einfach per WhatsApp oder E-Mail zwei
                  Wunschtermine – wir bestätigen den passenden.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
