import { Reveal } from "@/components/Reveal";
import { BrandStar } from "@/components/brand/Logo";
import { getDict } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locale";
import type { StripItem } from "@/lib/portfolio";
import { BoxiTitle } from "./BoxiTitle";
import { FilmStrip } from "./FilmStrip";

/**
 * Knapper Auftakt: eine Zeile Typografie, dann sofort Arbeit.
 * Kein Vollbild-Hero, der die erste Ansicht verschenkt.
 */
export function PortfolioHero({ items, count, locale = "de" }: { items: StripItem[]; count: number; locale?: Locale }) {
  const t = getDict(locale);
  return (
    <header className="relative overflow-hidden pt-28 md:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh]"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, rgba(139,92,246,0.16), transparent 70%), radial-gradient(40% 40% at 90% 10%, rgba(15,185,242,0.10), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-3 font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-ink-3">
                <BrandStar size={18} />
                {locale === "ar" ? "أعمالنا · نتويتشر برلين" : "Portfolio · Netwitcher Berlin"}
              </p>
              <div className="mt-5">
                <BoxiTitle
                  as="h1"
                  lines={locale === "ar" ? [{ text: "أعمال تُرى.", sweep: true }] : ["ARBEIT, DIE", { text: "MAN SIEHT.", sweep: true }]}
                  max="7.5rem"
                  min="2rem"
                  fitLines
                  className="text-ink"
                  locale={locale}
                />
              </div>
            </div>
            <div className="max-w-sm shrink-0 lg:w-[360px] lg:pb-3 lg:text-right rtl:lg:text-left">
              <p className="text-base leading-relaxed text-ink-2 sm:text-lg">
                {locale === "ar"
                  ? "مواقع ومحتوى وحملات وبرمجيات لعلامات تجارية تطمح لأكثر."
                  : "Websites, Content, Kampagnen und Software für Marken, die mehr wollen."}
              </p>
              <p className="mt-4 font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-ink-3">
                {locale === "ar"
                  ? `${count} ${count === 1 ? t.portfolio.projectCountSingular : t.portfolio.projectCountPlural} · مختارة`
                  : `${count} ${count === 1 ? t.portfolio.projectCountSingular : t.portfolio.projectCountPlural} · Auswahl`}
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-10 max-w-[1500px] px-5 sm:px-8 md:mt-14">
        <FilmStrip items={items} locale={locale} />
      </div>
    </header>
  );
}
