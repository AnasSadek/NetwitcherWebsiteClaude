"use client";

import Link from "next/link";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import { getDict } from "@/lib/i18n/dictionary";
import { withLocale, type Locale } from "@/lib/i18n/locale";
import type { PortfolioProject } from "@/lib/portfolio";
import { getCategory, projectKind } from "@/lib/portfolio";
import { BoxiTitle } from "./BoxiTitle";
import { ProjectVisual } from "./ProjectVisual";
import { SmartImage } from "./SmartImage";

function Chevron({ color }: { color: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="transition-transform duration-300 ease-out rtl:-scale-x-100 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5"
    >
      <path d={ARROW_PATH} fill={color} transform="rotate(90 50 50)" />
    </svg>
  );
}

/** Bildzeile unter jedem Werk: Kunde · Titel · Jahr, kein Overlay-Text. */
function Caption({
  project,
  large = false,
}: {
  project: PortfolioProject;
  large?: boolean;
}) {
  const hex = ARROW_COLORS[project.color];
  return (
    <div className="mt-4 flex items-start justify-between gap-4 md:mt-5">
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-heading text-[11px] font-bold uppercase tracking-[0.22em] text-ink-3">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: hex }} />
          {project.client}
        </p>
        <h3
          className={`mt-1.5 font-bold leading-snug tracking-tight text-ink ${
            large ? "text-xl md:text-2xl" : "text-lg md:text-xl"
          }`}
        >
          {project.title}
        </h3>
        <p className="mt-1.5 truncate text-sm text-ink-3">{project.services.join(" · ")}</p>
      </div>
      <span className="shrink-0 pt-0.5 font-heading text-xs font-semibold tabular-nums text-ink-3">
        {project.year}
      </span>
    </div>
  );
}

/** Kompakte Kachel im Raster. Ratio kommt vom Layout (span), nicht vom Bild. */
export function WorkTile({
  project,
  ratioClass,
  sizes,
  locale = "de",
}: {
  project: PortfolioProject;
  ratioClass: string;
  sizes: string;
  locale?: Locale;
}) {
  const kind = projectKind(project);
  const t = getDict(locale);
  return (
    <Link href={withLocale(`/portfolio/${project.slug}`, locale)} className="group block rounded-3xl focus-visible:outline-offset-8">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
        <SmartImage
          image={project.cover}
          color={project.color}
          ratioClass={ratioClass}
          sizes={sizes}
          monogram={project.client.charAt(0)}
          rounded="rounded-2xl md:rounded-3xl"
          imgClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-white/85 backdrop-blur-md rtl:right-auto rtl:left-4">
          {t.portfolio.kindLabels[kind]}
        </span>
        <span
          className="pointer-events-none absolute bottom-4 right-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 rtl:right-auto rtl:left-4"
          aria-hidden="true"
        >
          <svg width="13" height="13" viewBox="0 0 100 100" className="rtl:-scale-x-100">
            <path d={ARROW_PATH} fill="currentColor" transform="rotate(90 50 50)" />
          </svg>
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-ink/10 transition-colors duration-300 group-hover:ring-ink/25 md:rounded-3xl"
        />
      </div>
      <Caption project={project} />
      <span className="sr-only">{t.portfolio.viewProject}</span>
    </Link>
  );
}

/** Featured: eine ganze Bühne. Text links, Komposition rechts, abwechselnd. */
export function FeatureSpread({
  project,
  flip = false,
  priority = false,
  locale = "de",
}: {
  project: PortfolioProject;
  flip?: boolean;
  priority?: boolean;
  locale?: Locale;
}) {
  const hex = ARROW_COLORS[project.color];
  const cats = project.categories.map((c) => getCategory(c).label);
  const t = getDict(locale);
  return (
    <article
      className="relative overflow-hidden rounded-[28px] border border-line bg-white shadow-soft md:rounded-[40px]"
      style={{
        backgroundImage: `radial-gradient(90% 70% at ${flip ? "85%" : "15%"} 0%, ${hex}14, transparent 60%)`,
      }}
    >
      <div
        className="grid gap-10 p-6 sm:p-8 md:p-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-14"
      >
        <div className={`min-w-0 lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
          <p className="flex items-center gap-2 font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-ink-3">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hex }} />
            {project.client}
            <span className="text-ink/25">·</span>
            <span className="text-ink-3">{project.year}</span>
          </p>
          <div className="mt-5">
            <BoxiTitle as="h3" lines={[project.title]} max="2.9rem" min="1.1rem" className="text-ink" locale={locale} />
          </div>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-2 md:text-base">
            {project.description}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.services.map((s) => (
              <li
                key={s}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-2"
              >
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={withLocale(`/portfolio/${project.slug}`, locale)}
              className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 font-heading text-sm font-bold tracking-wide text-white transition-colors hover:bg-ink-2"
            >
              {t.portfolio.viewProject}
              <Chevron color="currentColor" />
            </Link>
            {project.website?.url && (
              <a
                href={project.website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.18em] text-ink-2 transition-colors hover:text-ink"
              >
                {t.portfolio.visitWebsite}
                <Chevron color={hex} />
              </a>
            )}
          </div>
          <p className="mt-8 hidden font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3 lg:block">
            {cats.join(" · ")}
          </p>
        </div>

        <div className={`min-w-0 lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
          <Link
            href={withLocale(`/portfolio/${project.slug}`, locale)}
            aria-label={`${project.client}: ${project.title}`}
            className="group block rounded-3xl transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:outline-offset-8"
          >
            <ProjectVisual project={project} priority={priority} />
          </Link>
        </div>
      </div>
    </article>
  );
}
