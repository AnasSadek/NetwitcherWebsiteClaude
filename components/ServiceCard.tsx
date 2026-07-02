import Link from "next/link";
import type { Service } from "@/lib/services";
import { ARROW_COLORS, ARROW_PATH } from "./arrows";
import { ServiceIcon } from "./icons";
import { Reveal } from "./Reveal";

const accentText: Record<Service["color"], string> = {
  mint: "text-mint",
  violet: "text-violet",
  pink: "text-pink",
  sun: "text-sun",
  sky: "text-sky",
};

const accentBorder: Record<Service["color"], string> = {
  mint: "hover:border-mint/50",
  violet: "hover:border-violet/50",
  pink: "hover:border-pink/50",
  sun: "hover:border-sun/50",
  sky: "hover:border-sky/50",
};

export function ServiceCard({
  service,
  delay = 0,
}: {
  service: Service;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={service.href}
        className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-night-700/60 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 ${accentBorder[service.color]}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-25"
          style={{ backgroundColor: ARROW_COLORS[service.color] }}
        />
        <div className="mb-5 flex items-center justify-between">
          <span
            className={`inline-flex h-13 w-13 items-center justify-center rounded-xl border border-line bg-white/5 p-3 transition-transform duration-300 group-hover:scale-110 ${accentText[service.color]}`}
          >
            <ServiceIcon icon={service.icon} />
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="opacity-40 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100"
          >
            <path d={ARROW_PATH} fill={ARROW_COLORS[service.color]} />
          </svg>
        </div>
        <h3 className="text-lg font-bold leading-snug">{service.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">
          {service.teaser}
        </p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {service.bullets.slice(0, 4).map((b) => (
            <li
              key={b}
              className="rounded-full border border-line px-2.5 py-1 text-[11px] text-mist"
            >
              {b}
            </li>
          ))}
        </ul>
        <span
          className={`mt-6 inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-widest ${accentText[service.color]}`}
        >
          {service.cta}
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </Reveal>
  );
}
