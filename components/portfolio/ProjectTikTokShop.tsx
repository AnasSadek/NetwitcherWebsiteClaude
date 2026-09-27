"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { ARROW_COLORS } from "@/components/arrows";
import { FeatureIcon } from "@/components/icons";
import type { AccentColor } from "@/lib/services";
import type { PortfolioProject } from "@/lib/portfolio";

/** M/K-Kompaktformat, abgeschnitten (nicht gerundet): 15.767.048 -> "15.7M",
 *  435.826 -> "435K". Passt exakt zu den vorgegebenen Beispielwerten. */
function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${Math.floor(value / 100_000) / 10}M`;
  if (value >= 1_000) return `${Math.floor(value / 1000)}K`;
  return String(value);
}

const ACCENT_CYCLE: AccentColor[] = ["sky", "pink", "sky", "pink", "sky", "pink"];

/**
 * TikTok-Shop-Reichweite/Traffic-Abschnitt: Intro, KPI-Karten (nur
 * Impressionen/Klicks/CTR), eine eigene horizontale Traffic-Quellen-
 * Visualisierung und eine kurze Ergebnis-Aussage. Bewusst ohne Umsatz-,
 * Bestell- oder Kundenzahlen. Rendert nur, wenn `project.tiktokShopSection`
 * gesetzt ist, direkt vor `ProjectServices`.
 */
export function ProjectTikTokShop({ project }: { project: PortfolioProject }) {
  const section = project.tiktokShopSection!;
  const { eyebrow, heading, period, intro, kpis, traffic, summary } = section;
  const reduce = useReducedMotion();
  const maxImpressions = Math.max(...traffic.sources.map((s) => s.impressions));

  // Eigener IntersectionObserver statt framer-motions whileInView: whileInView
  // kann das Antriggern verpassen, wenn das Element beim Mounten bereits (z. B.
  // durch schnelles Scrollen/einen Anker) im Viewport liegt. Gleiches Muster
  // wie Reveal.tsx, inkl. Sofort-Check für bereits sichtbare Elemente.
  const barsRef = useRef<HTMLDivElement>(null);
  const [barsShown, setBarsShown] = useState(false);
  useEffect(() => {
    const el = barsRef.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight - 60) {
      setBarsShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setBarsShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "100000px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="tiktok-shop" className="py-14 md:py-20">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          {eyebrow && (
            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-ink-3">{eyebrow}</p>
          )}
          {heading && (
            <h2 id="tiktok-shop" className="mt-4 font-boxi text-2xl leading-none text-ink md:text-4xl">
              {heading}
            </h2>
          )}
          {period && <p className="mt-3 text-sm font-semibold text-ink-3">{period}</p>}
          {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{intro}</p>}
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:mt-14 lg:grid-cols-3 lg:gap-6">
          {kpis.map((kpi, i) => {
            const hex = ARROW_COLORS[ACCENT_CYCLE[i % ACCENT_CYCLE.length]];
            const big = kpi.unit === "percent" ? `${kpi.value}%` : formatCompact(kpi.value);
            const supporting = kpi.unit === "percent" ? null : kpi.value.toLocaleString("en-US");
            return (
              <Reveal key={kpi.label} delay={Math.min(i * 0.06, 0.3)}>
                <div className="group relative h-full overflow-hidden rounded-[26px] border border-line bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lift sm:p-6">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ backgroundImage: `radial-gradient(120% 90% at 0% 0%, ${hex}14, transparent 65%)` }}
                  />
                  <div className="relative">
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: `${hex}1f`, color: hex }}
                    >
                      <FeatureIcon icon={kpi.icon} />
                    </span>
                    <div className="mt-4 font-boxi text-2xl leading-none text-ink sm:text-3xl md:text-4xl">
                      {big}
                    </div>
                    <p className="mt-2 text-sm font-semibold text-ink">{kpi.label}</p>
                    {supporting && <p className="mt-1 text-xs text-ink-3">{supporting}</p>}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-14 md:mt-20">
            {traffic.heading && (
              <h3 className="font-boxi text-xl leading-none text-ink md:text-2xl">{traffic.heading}</h3>
            )}
            {traffic.intro && <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2">{traffic.intro}</p>}
          </div>
        </Reveal>

        <div
          ref={barsRef}
          className="mt-8 space-y-5 rounded-[26px] border border-line bg-white p-6 shadow-soft md:mt-10 md:p-8"
        >
          {traffic.sources.map((source, i) => {
            const hex = ARROW_COLORS[ACCENT_CYCLE[i % ACCENT_CYCLE.length]];
            const pct = Math.max(4, (source.impressions / maxImpressions) * 100);
            return (
              <div key={source.label}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="font-heading text-sm font-bold text-ink">{source.label}</span>
                  <span className="text-xs text-ink-3">
                    {formatCompact(source.impressions)} {traffic.impressionsUnit} · {formatCompact(source.clicks)}{" "}
                    {traffic.clicksUnit}
                  </span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-paper-2">
                  <motion.div
                    className="h-full origin-left rounded-full rtl:origin-right"
                    style={{ width: `${pct}%`, backgroundColor: hex }}
                    initial={reduce ? false : { scaleX: 0 }}
                    animate={{ scaleX: reduce || barsShown ? 1 : 0 }}
                    transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 rounded-[26px] border border-line bg-paper-2/60 p-6 md:mt-16 md:p-8">
            {summary.label && (
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-ink-3">
                {summary.label}
              </p>
            )}
            <p className="mt-3 text-lg leading-relaxed text-ink md:text-xl">{summary.body}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
