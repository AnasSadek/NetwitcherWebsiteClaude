import Link from "next/link";
import { StarMark } from "./arrows";
import { site, whatsappHref, defaultWhatsappText } from "@/lib/site";
import { leistungenServices } from "@/lib/services";

export function Footer() {
  return (
    <footer className="border-t border-line bg-night-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label="Netwitcher – Startseite">
              <StarMark size={42} />
              <span className="font-heading text-lg font-extrabold tracking-wider">
                NETWITCHER
              </span>
            </Link>
            <p className="mt-4 font-heading text-xs font-medium uppercase tracking-[0.25em] text-sun">
              {site.slogan}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
              Digital Agency & Content-Studio in Berlin. Wir produzieren Content,
              der Aufmerksamkeit erzeugt – und Kampagnen, die Kunden bringen.
            </p>
          </div>

          <nav aria-label="Leistungen">
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-snow">
              Leistungen
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/studio" className="text-mist transition-colors hover:text-pink">
                  Content Creation & Studio
                </Link>
              </li>
              {leistungenServices.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link href={s.href} className="text-mist transition-colors hover:text-snow">
                    {s.navTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/leistungen" className="text-snow underline-offset-4 hover:underline">
                  Alle Leistungen →
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Unternehmen">
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-snow">
              Netwitcher
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/ueber-uns" className="text-mist transition-colors hover:text-snow">Über uns</Link></li>
              <li><Link href="/projekte" className="text-mist transition-colors hover:text-snow">Projekte & Cases</Link></li>
              <li><Link href="/produkte/fekrahub" className="text-mist transition-colors hover:text-snow">Produkte / FekraHub</Link></li>
              <li><Link href="/blog" className="text-mist transition-colors hover:text-snow">Blog</Link></li>
              <li><Link href="/kontakt" className="text-mist transition-colors hover:text-snow">Kontakt</Link></li>
              <li><Link href="/impressum" className="text-mist transition-colors hover:text-snow">Impressum</Link></li>
              <li><Link href="/datenschutz" className="text-mist transition-colors hover:text-snow">Datenschutzerklärung</Link></li>
              <li><Link href="/agb" className="text-mist transition-colors hover:text-snow">AGB</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-snow">
              Kontakt
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-mist">
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-snow">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.phoneHref} className="transition-colors hover:text-snow">
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref(defaultWhatsappText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-whatsapp transition-colors hover:text-snow"
                >
                  WhatsApp schreiben
                </a>
              </li>
              <li>Berlin, Deutschland</li>
            </ul>
            <Link
              href="/kontakt#termin"
              className="mt-6 inline-flex rounded-full bg-gradient-to-r from-pink to-sun px-5 py-2.5 font-heading text-xs font-bold tracking-wide text-night transition-transform hover:-translate-y-0.5"
            >
              Termin buchen
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-xs text-mist sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.legalName} · Berlin
          </p>
          <p className="font-heading uppercase tracking-[0.25em]">
            Magic in Every Click ✦
          </p>
        </div>
      </div>
    </footer>
  );
}
