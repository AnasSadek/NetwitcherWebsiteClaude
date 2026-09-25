import localFont from "next/font/local";
import { ButtonLink } from "@/components/Button";
import { BrandStar } from "@/components/brand/Logo";
import { de as t } from "@/lib/i18n/dictionary";
import "./globals.css";

/**
 * Eigenständiger Root-Fallback ausserhalb von app/(de) und app/ar: greift
 * nur, wenn Next.js einen Pfad KEINER der beiden Locale-Baumstrukturen
 * zuordnen kann (z. B. völlig unbekannte Top-Level-Segmente) — der
 * Normalfall „Route existiert nicht" innerhalb einer Locale wird bereits
 * von app/(de)/not-found.tsx bzw. app/ar/not-found.tsx abgefangen. Braucht
 * eigenes <html>/<body>, weil hier (anders als früher) kein gemeinsames
 * Root-Layout mehr existiert — siehe Next.js "multiple root layouts".
 */
const epboxi = localFont({
  src: "./fonts/epboxi-display.woff2",
  variable: "--font-epboxi",
  weight: "700",
  display: "swap",
});
const oxanium = localFont({
  src: "./fonts/oxanium.woff2",
  variable: "--font-oxanium",
  weight: "400 800",
  display: "swap",
});
const nunito = localFont({
  src: "./fonts/nunito-sans.woff2",
  variable: "--font-nunito",
  weight: "300 800",
  display: "swap",
});

export default function GlobalNotFound() {
  return (
    <html lang="de" dir="ltr" className={`${epboxi.variable} ${oxanium.variable} ${nunito.variable}`}>
      <body>
        <section className="flex min-h-screen items-center justify-center bg-paper px-4 text-center">
          <div className="mx-auto max-w-xl">
            <BrandStar size={72} className="mx-auto mb-8" />
            <h1 className="font-heading text-5xl font-extrabold tracking-tight text-ink">{t.notFound.title}</h1>
            <p className="mt-4 text-lg font-bold text-ink">{t.notFound.heading}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-3">{t.notFound.body}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/">{t.notFound.homeCta}</ButtonLink>
              <ButtonLink href="/leistungen" variant="ghost">{t.notFound.servicesCta}</ButtonLink>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
