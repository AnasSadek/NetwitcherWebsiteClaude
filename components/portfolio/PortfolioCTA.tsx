import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { BrandStar } from "@/components/brand/Logo";
import { ARROW_PATH } from "@/components/arrows";
import { whatsappHref } from "@/lib/site";
import { BoxiTitle } from "./BoxiTitle";

/**
 * Schluss-CTA des Portfolios. Führt in den bestehenden Anfrage-Dialog
 * (/kontakt), optional mit vorausgewähltem Thema.
 */
export function PortfolioCTA({ service }: { service?: string }) {
  const href = service ? `/kontakt?service=${encodeURIComponent(service)}` : "/kontakt";
  const wa = whatsappHref(
    "Hallo Netwitcher! Ich habe euer Portfolio gesehen und würde gern über ein Projekt sprechen."
  );
  return (
    <section className="relative overflow-hidden py-28 md:py-40" aria-labelledby="portfolio-cta">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 100%, rgba(139,92,246,0.20), transparent 70%), radial-gradient(30% 40% at 15% 80%, rgba(244,104,168,0.10), transparent 70%), radial-gradient(30% 40% at 85% 85%, rgba(15,185,242,0.10), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <BrandStar size={64} className="mx-auto mb-10 drop-shadow-[0_12px_40px_rgba(139,92,246,0.35)]" />
          <BoxiTitle
            as="h2"
            id="portfolio-cta"
            lines={["GEFÄLLT DIR,", "WAS DU SIEHST?"]}
            max="4.5rem"
            min="2rem"
            className="text-center text-ink"
          />
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-ink-2">
            Dann lass uns etwas machen, das man sich merkt.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={href}
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ink px-8 py-4 font-heading text-sm font-bold tracking-wide text-white transition-colors hover:bg-ink-2 sm:w-auto"
            >
              Projekt starten
              <svg width="11" height="11" viewBox="0 0 100 100" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                <path d={ARROW_PATH} fill="currentColor" transform="rotate(90 50 50)" />
              </svg>
            </Link>
            <Link
              href="/kontakt#termin"
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-ink/20 px-8 py-4 font-heading text-sm font-bold tracking-wide text-ink transition-colors hover:border-ink/50 hover:bg-ink/5 sm:w-auto"
            >
              Erstgespräch buchen
            </Link>
          </div>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-block text-sm text-ink-3 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Oder direkt per WhatsApp schreiben
          </a>
        </Reveal>
      </div>
    </section>
  );
}
