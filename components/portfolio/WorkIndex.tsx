"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ARROW_COLORS } from "@/components/arrows";
import { getDict } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locale";
import type { PortfolioCategory, PortfolioProject } from "@/lib/portfolio";
import type { AccentColor } from "@/lib/services";
import { ProjectCard } from "./ProjectCard";

type CategoryChip = { id: PortfolioCategory; label: string; color: AccentColor; count: number };
type Filter = PortfolioCategory | "all";

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

  const categoryLabels = useMemo(() => new Map(categories.map((c) => [c.id, c.label])), [categories]);
  const categoryLabelFor = (p: PortfolioProject) =>
    p.categories
      .map((c) => categoryLabels.get(c))
      .filter((label): label is string => Boolean(label))
      .join(" · ");

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
        <motion.div layout={!reduce} className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:gap-8">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <motion.div
                key={p.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.18 } }}
                transition={{ ...spring, delay: reduce ? 0 : Math.min(i * 0.05, 0.25) }}
              >
                <ProjectCard
                  project={p}
                  locale={locale}
                  reversed={i % 2 === 1}
                  categoryLabel={categoryLabelFor(p)}
                  priority={i === 0}
                />
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
