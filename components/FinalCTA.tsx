import Link from "next/link";
import { ButtonLink } from "./Button";
import { Reveal } from "./Reveal";
import { BrandStar } from "./brand/Logo";
import { whatsappHref } from "@/lib/site";

/**
 * Abschluss-CTA für die Unterseiten (die Startseite nutzt <Conversion/>).
 * Ruhig gesetzt: eine primäre Aktion, Rest als Textlinks. Kein Blur-Blob,
 * kein schwebendes Logo, keine drei gleichwertigen Pillen.
 */
export function FinalCTA({
  title = "Was willst du als Nächstes produzieren?",
  text = "Erzähl uns kurz, was ansteht – wir sagen dir ehrlich, was sich lohnt und was nicht.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="border-t border-line py-24 md:py-32" aria-labelledby="final-cta">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <BrandStar size={56} className="mx-auto mb-8" />
          <h2 id="final-cta" className="font-heading text-3xl font-black tracking-tight md:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-mist">{text}</p>
          <div className="mt-9 flex flex-col items-center gap-5">
            <ButtonLink href="/kontakt">Erstgespräch buchen</ButtonLink>
            <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-mist">
              <Link
                href="/kontakt?service=Fotoshooting"
                className="underline-offset-4 transition-colors hover:text-snow hover:underline"
              >
                Studio anfragen
              </Link>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 transition-colors hover:text-snow hover:underline"
              >
                WhatsApp schreiben
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
