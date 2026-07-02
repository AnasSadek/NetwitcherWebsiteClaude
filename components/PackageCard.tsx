import Link from "next/link";
import type { ContentPackage } from "@/lib/packages";
import { ARROW_COLORS, ARROW_PATH } from "./arrows";
import { Reveal } from "./Reveal";

export function PackageCard({
  pkg,
  delay = 0,
}: {
  pkg: ContentPackage;
  delay?: number;
}) {
  const accent = ARROW_COLORS[pkg.color];
  return (
    <Reveal delay={delay} className="h-full">
      <div
        className={`relative flex h-full flex-col rounded-2xl border p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 ${
          pkg.highlight
            ? "border-sky/50 bg-night-600/70 shadow-[0_0_60px_rgba(15,185,242,.12)]"
            : "border-line bg-night-700/60"
        }`}
      >
        {pkg.highlight && (
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet to-sky px-4 py-1.5 font-heading text-[10px] font-bold uppercase tracking-widest text-night">
            Am häufigsten gewählt
          </span>
        )}
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 100 100" aria-hidden="true">
            <path d={ARROW_PATH} fill={accent} />
          </svg>
          <h3 className="font-heading text-lg font-extrabold">{pkg.name}</h3>
        </div>
        <p
          className="mt-2 font-heading text-xs font-bold uppercase tracking-widest"
          style={{ color: accent }}
        >
          {pkg.tagline}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-mist">{pkg.forWhom}</p>
        <ul className="mt-5 flex-1 space-y-2.5">
          {pkg.includes.map((inc) => (
            <li key={inc} className="flex items-start gap-2.5 text-sm text-snow/90">
              <svg
                width="12"
                height="12"
                viewBox="0 0 100 100"
                aria-hidden="true"
                className="mt-1 shrink-0"
              >
                <path d={ARROW_PATH} fill={accent} transform="rotate(90 50 50)" />
              </svg>
              {inc}
            </li>
          ))}
        </ul>
        <Link
          href={`/kontakt?service=${encodeURIComponent(pkg.name)}`}
          className={`mt-7 inline-flex items-center justify-center rounded-full px-6 py-3 font-heading text-xs font-bold tracking-wide transition-all duration-200 hover:-translate-y-0.5 ${
            pkg.highlight
              ? "bg-gradient-to-r from-violet to-sky text-night shadow-glow-violet"
              : "border border-line bg-white/5 text-snow hover:border-white/30"
          }`}
        >
          {pkg.cta}
        </Link>
      </div>
    </Reveal>
  );
}
