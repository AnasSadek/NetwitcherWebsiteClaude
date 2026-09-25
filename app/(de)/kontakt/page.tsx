import type { Metadata } from "next";
import { InquiryFlow } from "@/components/contact/InquiryFlow";
import { site, whatsappHref, defaultWhatsappText } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt und Anfrage",
  description:
    "Erzähl uns in drei kurzen Schritten, was ansteht: Content, Fotoshooting, Social Media, Ads, Website, SEO, Branding oder Software. Antwort innerhalb eines Werktags. Aus Berlin.",
};

export default function KontaktPage() {
  return (
    <>
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <header className="max-w-2xl">
            <h1 className="font-heading text-4xl font-black leading-[1.03] tracking-tight md:text-6xl">
              Lass uns loslegen.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-3">
              Drei kurze Schritte, danach wissen wir genug für eine ehrliche
              Einschätzung. Kein Fragebogen, kein Verkaufsdruck.
            </p>
          </header>

          <div className="mt-16 grid gap-14 border-t border-line pt-12 lg:grid-cols-[minmax(0,58%)_minmax(0,42%)] lg:gap-20 md:mt-20">
            {/* Anfrage-Dialog */}
            <InquiryFlow />

            {/* Direkter Weg, bewusst schmal und ruhig */}
            <aside>
              <h2 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-ink">
                Lieber direkt?
              </h2>
              <ul className="mt-6 divide-y divide-line border-y border-line text-sm">
                <li>
                  <a
                    href={whatsappHref(defaultWhatsappText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-4 py-4 transition-colors"
                  >
                    <span className="font-heading font-bold text-whatsapp">WhatsApp</span>
                    <span className="text-right text-ink-3 transition-colors group-hover:text-ink">
                      Meist Antwort am selben Tag
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="group flex items-baseline justify-between gap-4 py-4 transition-colors"
                  >
                    <span className="font-heading font-bold">E-Mail</span>
                    <span className="text-right text-ink-3 transition-colors group-hover:text-ink">
                      {site.email}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={site.phoneHref}
                    className="group flex items-baseline justify-between gap-4 py-4 transition-colors"
                  >
                    <span className="font-heading font-bold">Telefon</span>
                    <span className="text-right text-ink-3 transition-colors group-hover:text-ink">
                      {site.phone}
                    </span>
                  </a>
                </li>
                <li className="flex items-baseline justify-between gap-4 py-4">
                  <span className="font-heading font-bold">Studio</span>
                  <span className="text-right text-ink-3">
                    {site.city}, {site.country}
                  </span>
                </li>
              </ul>

              <div id="termin" className="mt-12 scroll-mt-32">
                <h2 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-ink">
                  Erstgespräch
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink-3">
                  20-30 Minuten per Video-Call oder Telefon. Wir hören zu, ordnen
                  ein und sagen dir, was sich lohnt und was nicht. Kostenlos.
                </p>
                <a
                  href={site.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2.5 rounded border border-ink/20 px-7 py-3.5 font-heading text-sm font-bold tracking-wide text-ink transition-colors hover:border-ink/60 hover:bg-ink/5"
                >
                  Erstgespräch buchen
                </a>
                <p className="mt-4 text-xs leading-relaxed text-ink-3">
                  Passt kein Termin? Schick uns zwei Wunschzeiten per WhatsApp, wir
                  bestätigen den passenden.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
