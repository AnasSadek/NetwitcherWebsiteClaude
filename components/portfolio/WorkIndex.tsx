"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ARROW_COLORS } from "@/components/arrows";
import { getDict } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locale";
import type { PortfolioCategory, PortfolioProject } from "@/lib/portfolio";
import type { AccentColor } from "@/lib/services";
import { FeatureSpread, WorkTile } from "./WorkItems";

type CategoryChip = { id: PortfolioCategory; label: string; color: AccentColor; count: number };
type Filter = PortfolioCategory | "all";

/* --------------------------------------------------------------------------
   Rhythmus: Featured-Projekte bekommen eine ganze Bühne, dazwischen laufen
   normale Werke in wechselnden Spalten (7/5 · 5/7 · 4/4/4). Ein einzelnes
   Rest-Werk wird breit gesetzt, zwei Rest-Werke halbieren die Zeile.
   -------------------------------------------------------------------------- */

type Arranged =
  | { type: "spread"; project: PortfolioProject; flip: boolean }
  | { type: "tile"; project: PortfolioProject; span: 12 | 7 | 6 | 5 | 4 };

const ROWS: (7 | 5 | 4)[][] = [
  [7, 5],
  [5, 7],
  [4, 4, 4],
];

function arrange(list: PortfolioProject[], spreads: boolean): Arranged[] {
  const out: Arranged[] = [];
  let run: PortfolioProject[] = [];
  let row = 0;
  let spreadCount = 0;

  const flush = () => {
    while (run.length) {
      let pattern: (12 | 7 | 6 | 5 | 4)[] = ROWS[row % ROWS.length];
      if (run.length === 1) pattern = [12];
      else if (run.length < pattern.length) pattern = [6, 6];
      pattern.forEach((span) => {
        const p = run.shift();
        if (p) out.push({ type: "tile", project: p, span });
      });
      row++;
    }
  };

  for (const p of list) {
    if (spreads && p.featured) {
      flush();
      out.push({ type: "spread", project: p, flip: spreadCount % 2 === 1 });
      spreadCount++;
    } else {
      run.push(p);
    }
  }
  flush();
  return out;
}

const SPAN_CLASS: Record<number, string> = {
  12: "md:col-span-12",
  7: "md:col-span-7",
  6: "md:col-span-6",
  5: "md:col-span-5",
  4: "md:col-span-4",
};
const RATIO_CLASS: Record<number, string> = {
  12: "aspect-[4/5] md:aspect-[21/9]",
  7: "aspect-[4/5] md:aspect-[16/10]",
  6: "aspect-[4/5] md:aspect-[4/3]",
  5: "aspect-[4/5]",
  4: "aspect-[4/5] md:aspect-square",
};
const SIZES: Record<number, string> = {
  12: "(min-width: 1500px) 1400px, 100vw",
  7: "(min-width: 1500px) 820px, (min-width: 768px) 58vw, 100vw",
  6: "(min-width: 1500px) 700px, (min-width: 768px) 50vw, 100vw",
  5: "(min-width: 1500px) 580px, (min-width: 768px) 42vw, 100vw",
  4: "(min-width: 1500px) 460px, (min-width: 768px) 33vw, 100vw",
};

function isFilter(v: string | null, chips: CategoryChip[]): v is Filter {
  return v === "all" || chips.some((c) => c.id === v);
}

function Index({ projects, categories, locale = "de" }: { projects: PortfolioProject[]; categories: CategoryChip[]; locale?: Locale }) {
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const t = getDict(locale);
  const initial = params.get("f");
  const [filter, setFilter] = useState<Filter>(isFilter(initial, categories) ? initial : "all");

  // Filter in der URL halten: /portfolio?f=web lässt sich gezielt verschicken.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (filter === "all") url.searchParams.delete("f");
    else url.searchParams.set("f", filter);
    window.history.replaceState(window.history.state, "", url);
  }, [filter]);

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter, projects]
  );
  const items = useMemo(() => arrange(visible, true), [visible]);

  const chips: { id: Filter; label: string; count: number; color?: AccentColor }[] = [
    { id: "all", label: t.portfolio.allFilter, count: projects.length },
    ...categories,
  ];

  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 32, mass: 0.9 };

  return (
    <section id="arbeiten" aria-labelledby="arbeiten-heading" className="scroll-mt-24">
      <h2 id="arbeiten-heading" className="sr-only">
        {t.nav.portfolio}
      </h2>

      {/* Filterleiste, klebt unter dem Header */}
      <div className="sticky top-[58px] z-30 -mx-5 border-y border-line-2 bg-paper/80 backdrop-blur-xl sm:-mx-8 md:top-[60px]">
        <div className="mx-auto max-w-[1500px]">
          <div
            role="group"
            aria-label={t.portfolio.filterAriaLabel}
            className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-3 sm:px-8"
          >
            {chips.map((c) => {
              const active = filter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(c.id)}
                  className={`group flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-heading text-xs font-bold tracking-wide transition-colors duration-200 ${
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-line text-ink-2 hover:border-ink/30 hover:text-ink"
                  }`}
                >
                  {c.color && (
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: ARROW_COLORS[c.color] }}
                      aria-hidden="true"
                    />
                  )}
                  {c.label}
                  <span className={`tabular-nums ${active ? "text-white/60" : "text-ink-3"}`}>{c.count}</span>
                </button>
              );
            })}
            <span aria-live="polite" className="sr-only">
              {visible.length} {visible.length === 1 ? t.portfolio.projectCountSingular : t.portfolio.projectCountPlural}
            </span>
          </div>
        </div>
      </div>

      <LayoutGroup>
        <motion.div layout={!reduce} className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 md:mt-14 md:grid-cols-12 md:gap-y-16">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((it, i) => (
              <motion.div
                key={it.project.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
                transition={{ ...spring, delay: reduce ? 0 : Math.min(i * 0.04, 0.24) }}
                className={it.type === "spread" ? "md:col-span-12" : SPAN_CLASS[it.span]}
              >
                {it.type === "spread" ? (
                  <FeatureSpread project={it.project} flip={it.flip} priority={i === 0} locale={locale} />
                ) : (
                  <WorkTile project={it.project} ratioClass={RATIO_CLASS[it.span]} sizes={SIZES[it.span]} locale={locale} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {visible.length === 0 && (
        <p className="mt-16 text-center text-ink-3">{t.portfolio.emptyCategory}</p>
      )}
    </section>
  );
}

export function WorkIndex(props: { projects: PortfolioProject[]; categories: CategoryChip[]; locale?: Locale }) {
  return (
    <Suspense fallback={<div className="mt-14 min-h-[60vh]" aria-hidden="true" />}>
      <Index {...props} />
    </Suspense>
  );
}
