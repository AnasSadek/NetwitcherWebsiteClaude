import Link from "next/link";
import { BrandStar, BrandWordmark } from "./brand/Logo";
import { site, whatsappHref, defaultWhatsappText } from "@/lib/site";
import { leistungenServices } from "@/lib/services";

export function Footer() {
  return (
    <footer className="relative bg-deep text-white">
      <div aria-hidden="true" className="brand-sweep h-1.5 w-full" />
      <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label="Netwitcher, Startseite">
              <BrandStar size={42} />
              <BrandWordmark height={14} className="text-white" />
            </Link>
            <p className="mt-4 font-heading text-xs font-bold uppercase tracking-[0.25em] text-sun">
              {site.slogan}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              Digital Agency & Content-Studio in Berlin. Wir produzieren Content,
              der Aufmerksamkeit erzeugt, und Kampagnen, die Kunden bringen.
            </p>
          </div>

          <nav aria-label="Leistungen">
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-white">
              Leistungen
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/studio" className="text-white/65 transition-colors hover:text-pink">
                  Content Creation & Studio
                </Link>
              </li>
              {leistungenServices.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link href={s.href} className="text-white/65 transition-colors hover:text-white">
                    {s.navTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/leistungen" className="font-semibold text-white underline-offset-4 hover:underline">
                  Alle Leistungen
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Unternehmen">
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-white">
              Netwitcher
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/ueber-uns" className="text-white/65 transition-colors hover:text-white">Über uns</Link></li>
              <li><Link href="/projekte" className="text-white/65 transition-colors hover:text-white">Projekte & Cases</Link></li>
              <li><Link href="/produkte/fekrahub" className="text-white/65 transition-colors hover:text-white">Produkte / FekraHub</Link></li>
              <li><Link href="/blog" className="text-white/65 transition-colors hover:text-white">Blog</Link></li>
              <li><Link href="/kontakt" className="text-white/65 transition-colors hover:text-white">Kontakt</Link></li>
              <li><Link href="/impressum" className="text-white/65 transition-colors hover:text-white">Impressum</Link></li>
              <li><Link href="/datenschutz" className="text-white/65 transition-colors hover:text-white">Datenschutzerklärung</Link></li>
              <li><Link href="/agb" className="text-white/65 transition-colors hover:text-white">AGB</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-white">
              Kontakt
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.phoneHref} className="transition-colors hover:text-white">
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref(defaultWhatsappText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-whatsapp transition-colors hover:text-white"
                >
                  WhatsApp schreiben
                </a>
              </li>
              <li>Berlin, Deutschland</li>
            </ul>
            <Link
              href="/kontakt#termin"
              className="mt-6 inline-flex rounded-full bg-sun px-5 py-2.5 font-heading text-xs font-bold tracking-wide text-ink transition-all hover:brightness-105"
            >
              Erstgespräch buchen
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.legalName} · Berlin
          </p>
          <p className="font-heading uppercase tracking-[0.25em]">Magic in Every Click</p>
        </div>
      </div>
    </footer>
  );
}
