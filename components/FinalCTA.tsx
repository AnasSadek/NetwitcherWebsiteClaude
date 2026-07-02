import { ButtonLink } from "./Button";
import { Reveal } from "./Reveal";
import { StarMark } from "./arrows";
import { whatsappHref, defaultWhatsappText } from "@/lib/site";

export function FinalCTA({
  title = "Bereit für Content, der verkauft?",
  text = "Erzähl uns kurz, was du vorhast – wir zeigen dir, welche Inhalte, Kampagnen und digitalen Schritte für dein Wachstum am meisten Sinn machen. Kostenlos, ehrlich und ohne Agentur-Sprech.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32" aria-labelledby="final-cta">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <StarMark size={64} className="mx-auto mb-8 animate-float motion-reduce:animate-none" />
          <h2 id="final-cta" className="text-3xl font-extrabold tracking-tight md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mist md:text-lg">
            {text}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/kontakt#termin">Kostenloses Erstgespräch buchen</ButtonLink>
            <ButtonLink href={whatsappHref(defaultWhatsappText)} variant="whatsapp" external>
              WhatsApp schreiben
            </ButtonLink>
            <ButtonLink href="/kontakt?service=Fotoshooting" variant="secondary">
              Studio-Shooting anfragen
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
