import Link from "next/link";
import type { CaseStudy } from "@/lib/cases";
import { ARROW_COLORS, ARROW_PATH } from "./arrows";
import { Reveal } from "./Reveal";

export function CaseCard({ item, delay = 0 }: { item: CaseStudy; delay?: number }) {
  const accent = ARROW_COLORS[item.color];
  return (
    <Reveal as="article" delay={delay} className="h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-night-700/60 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
        <div
          className="relative flex h-36 items-end overflow-hidden p-6"
          style={{
            background: `radial-gradient(400px 160px at 20% 0%, ${accent}33, transparent 70%), linear-gradient(160deg, #12122688, #0B0B1A)`,
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="absolute -right-6 -top-6 opacity-15 transition-transform duration-500 group-hover:rotate-12"
          >
            <path d={ARROW_PATH} fill={accent} />
          </svg>
          <p
            className="font-heading text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            {item.category}
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <h3 className="text-lg font-bold leading-snug">{item.title}</h3>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              <span className="font-heading text-[11px] font-bold uppercase tracking-widest text-snow">Herausforderung · </span>
              <span className="text-mist">{item.challenge}</span>
            </p>
            <p>
              <span className="font-heading text-[11px] font-bold uppercase tracking-widest text-snow">Lösung · </span>
              <span className="text-mist">{item.solution}</span>
            </p>
            <p>
              <span className="font-heading text-[11px] font-bold uppercase tracking-widest text-snow">Ergebnis · </span>
              <span className="italic text-mist">{item.result}</span>
            </p>
          </div>
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {item.services.map((s) => (
              <li key={s} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-mist">
                {s}
              </li>
            ))}
          </ul>
          <Link
            href={`/kontakt?service=${encodeURIComponent(item.category)}`}
            className="group/link inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-widest transition-colors"
            style={{ color: accent }}
          >
            Ähnliches Projekt starten
            <span aria-hidden="true" className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
