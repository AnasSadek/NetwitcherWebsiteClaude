import Link from "next/link";
import { BrandStar, BrandWordmark } from "./brand/Logo";
import { site, whatsappHref } from "@/lib/site";
import { getDict } from "@/lib/i18n/dictionary";
import { withLocale, type Locale } from "@/lib/i18n/locale";
import { navServicesAr, navServicesDe } from "@/lib/i18n/nav-services";

export function Footer({ locale = "de" }: { locale?: Locale }) {
  const t = getDict(locale);
  const navServices = locale === "ar" ? navServicesAr : navServicesDe;
  const L = (href: string) => withLocale(href, locale);

  return (
    <footer className="relative bg-deep text-white">
      <div aria-hidden="true" className="brand-sweep h-1.5 w-full" />
      <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href={L("/")} className="flex items-center gap-2.5" aria-label={t.nav.homeAriaLabel}>
              <BrandStar size={42} />
              <BrandWordmark height={14} className="text-white" />
            </Link>
            <p className="mt-4 font-heading text-xs font-bold uppercase tracking-[0.25em] text-sun">
              {t.footer.tagline}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              {t.footer.description}
            </p>
          </div>

          <nav aria-label={t.footer.servicesHeading}>
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-white">
              {t.footer.servicesHeading}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href={L("/studio")} className="text-white/65 transition-colors hover:text-pink">
                  {t.footer.studioLink}
                </Link>
              </li>
              {navServices.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link href={L(s.href)} className="text-white/65 transition-colors hover:text-white">
                    {s.navTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={L("/leistungen")} className="font-semibold text-white underline-offset-4 hover:underline">
                  {t.footer.allServicesLink}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label={t.footer.companyHeading}>
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-white">
              {t.footer.companyHeading}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href={L("/ueber-uns")} className="text-white/65 transition-colors hover:text-white">{t.footer.aboutLink}</Link></li>
              <li><Link href={L("/portfolio")} className="text-white/65 transition-colors hover:text-white">{t.footer.portfolioLink}</Link></li>
              <li><Link href={L("/produkte/fekrahub")} className="text-white/65 transition-colors hover:text-white">{t.footer.productsLink}</Link></li>
              <li><Link href={L("/blog")} className="text-white/65 transition-colors hover:text-white">{t.footer.blogLink}</Link></li>
              <li><Link href={L("/kontakt")} className="text-white/65 transition-colors hover:text-white">{t.footer.contactLink}</Link></li>
              <li><Link href={L("/impressum")} className="text-white/65 transition-colors hover:text-white">{t.footer.imprintLink}</Link></li>
              <li><Link href={L("/datenschutz")} className="text-white/65 transition-colors hover:text-white">{t.footer.privacyLink}</Link></li>
              <li><Link href={L("/agb")} className="text-white/65 transition-colors hover:text-white">{t.footer.termsLink}</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-white">
              {t.footer.contactHeading}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.phoneHref} className="transition-colors hover:text-white" dir="ltr">
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref(t.whatsapp.defaultMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-whatsapp transition-colors hover:text-white"
                >
                  {t.footer.whatsappLink}
                </a>
              </li>
              <li>{t.footer.countryLabel}</li>
            </ul>
            <Link
              href={L("/kontakt#termin")}
              className="mt-6 inline-flex rounded-full bg-sun px-5 py-2.5 font-heading text-xs font-bold tracking-wide text-ink transition-all hover:brightness-105"
            >
              {t.footer.bookIntroCta}
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.legalName} · {t.footer.copyrightCity}
          </p>
          <p className="font-heading uppercase tracking-[0.25em]">{t.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
