import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import { getDict } from "@/lib/i18n/dictionary";
import { withLocale, type Locale } from "@/lib/i18n/locale";
import type { PortfolioProject } from "@/lib/portfolio";
import { BoxiTitle } from "./BoxiTitle";
import { SmartImage } from "./SmartImage";

function Chevron({ color }: { color: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="transition-transform duration-300 ease-out rtl:-scale-x-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
    >
      <path d={ARROW_PATH} fill={color} transform="rotate(90 50 50)" />
    </svg>
  );
}

/**
 * Ein Projekt = eine grosse, horizontale Karte: Bild auf der einen, Inhalt
 * auf der anderen Seite. Einziges Kartenformat im Portfolio-Index (ersetzt
 * die frühere Mischung aus Kacheln unterschiedlicher Grösse und Spreads).
 * `reversed` wechselt die Bild-/Inhaltsseite ab — unabhängig von `locale`,
 * damit derselbe visuelle Rhythmus in beiden Sprachen erhalten bleibt; RTL
 * betrifft nur die Textausrichtung/Icons innerhalb der Karte, nicht die
 * Bild-/Inhalt-Reihenfolge selbst.
 */
export function ProjectCard({
  project,
  locale = "de",
  reversed = false,
  categoryLabel,
  priority = false,
}: {
  project: PortfolioProject;
  locale?: Locale;
  reversed?: boolean;
  /** Bereits lokalisiertes Kategorie-Label (aus der vom Aufrufer übergebenen,
   *  sprachrichtigen Kategorienliste) — fehlt es, wird das Label ausgeblendet. */
  categoryLabel?: string;
  priority?: boolean;
}) {
  const t = getDict(locale);
  const hex = ARROW_COLORS[project.color];
  const href = withLocale(`/portfolio/${project.slug}`, locale);
  const hasDescription = Boolean(project.description);
  const hasTags = project.services.length > 0;
  const hasYear = Boolean(project.year);
  // CSS `order` flips visual position under dir="rtl" (order-1 lands on the
  // right instead of the left), which would silently mirror the whole
  // alternating pattern between locales. Countering it here keeps the same
  // physical image/content rhythm in both languages, as requested.
  const flip = locale === "ar" ? !reversed : reversed;

  return (
    <Reveal as="article">
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-[32px] border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lift"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(60% 60% at ${flip ? "100% 0%" : "0% 0%"}, ${hex}12, transparent 70%)`,
          }}
        />
        <div className="relative grid gap-6 p-5 sm:p-6 md:grid-cols-2 md:items-center md:gap-8 md:p-8 lg:gap-12 lg:p-10">
          <div className={`min-w-0 ${flip ? "md:order-2" : "md:order-1"}`}>
            <SmartImage
              image={project.cover}
              color={project.color}
              ratioClass="aspect-[4/3]"
              fit="contain"
              sizes="(min-width: 768px) 45vw, 100vw"
              priority={priority}
              monogram={project.client.charAt(0)}
              rounded="rounded-[20px]"
              className="bg-paper-2"
            />
          </div>

          <div className={`min-w-0 ${flip ? "md:order-1" : "md:order-2"}`}>
            <p className="flex items-center gap-2 font-heading text-[11px] font-bold uppercase tracking-[0.22em] text-ink-3">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: hex }} />
              {project.client}
              {hasYear && (
                <>
                  <span className="text-ink/25">·</span>
                  <span className="tabular-nums">{project.year}</span>
                </>
              )}
            </p>

            <div className="mt-4">
              <BoxiTitle as="h3" lines={[project.title]} max="2.6rem" min="1.3rem" className="text-ink" locale={locale} />
            </div>

            {hasDescription && (
              <p className="mt-4 line-clamp-2 max-w-xl text-[15px] leading-relaxed text-ink-2 md:text-base">
                {project.description}
              </p>
            )}

            {hasTags && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.services.map((s) => (
                  <li key={s} className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-2">
                    {s}
                  </li>
                ))}
              </ul>
            )}

            <span className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 font-heading text-sm font-bold tracking-wide text-white transition-colors group-hover:bg-ink-2">
              {t.portfolio.viewProject}
              <Chevron color="currentColor" />
            </span>

            {categoryLabel && (
              <p className="mt-6 font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3">
                {categoryLabel}
              </p>
            )}
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
