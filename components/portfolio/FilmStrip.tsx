import Link from "next/link";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import type { StripItem } from "@/lib/portfolio";
import { ratioValue } from "@/lib/portfolio";
import { Placeholder } from "./Placeholder";
import { SmartImage } from "./SmartImage";

/**
 * Filmstreifen aus echten Projektmedien in gemischten Formaten.
 * Maus/Trackpad: läuft langsam (CSS, pausiert beim Hover).
 * Touch: normal wischbar. Reduced Motion: steht still, bleibt wischbar.
 */
function Frame({ item, priority }: { item: StripItem; priority?: boolean }) {
  return (
    <Link
      href={`/portfolio/${item.slug}`}
      className="group relative block h-[220px] shrink-0 snap-start overflow-hidden rounded-2xl bg-void-2 sm:h-[280px] lg:h-[340px]"
      style={{ aspectRatio: ratioValue(item.ratio) }}
      aria-label={`${item.client}: ${item.alt}`}
    >
      {item.src ? (
        <SmartImage
          image={{ src: item.src, alt: "", ratio: item.ratio }}
          color={item.color}
          ratio={item.ratio}
          sizes="(min-width: 1024px) 40vw, 80vw"
          priority={priority}
          rounded="rounded-none"
          className="absolute inset-0 h-full"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <Placeholder color={item.color} kind={item.kind} monogram={item.client.charAt(0)} label={false} />
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3.5 pt-10">
        <span className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">
          {item.client}
        </span>
        {item.kind === "video" && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink" aria-hidden="true">
            <svg width="9" height="9" viewBox="0 0 100 100" className="ml-px">
              <path d={ARROW_PATH} fill="currentColor" transform="rotate(90 50 50)" />
            </svg>
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"
        style={{ boxShadow: `inset 0 0 0 0 ${ARROW_COLORS[item.color]}` }}
      />
    </Link>
  );
}

export function FilmStrip({ items }: { items: StripItem[] }) {
  return (
    <div className="fade-x relative -mx-5 sm:-mx-8">
      <div className="no-scrollbar snap-x snap-mandatory overflow-x-auto px-5 sm:px-8 pointer-fine:motion-safe:snap-none pointer-fine:motion-safe:overflow-hidden pointer-fine:motion-safe:px-0">
        <div className="flex w-max gap-3 sm:gap-4 pointer-fine:motion-safe:animate-strip pointer-fine:motion-safe:hover:[animation-play-state:paused] pointer-fine:motion-safe:pr-3 sm:pointer-fine:motion-safe:pr-4">
          {items.map((it, i) => (
            <Frame key={`${it.slug}-${i}`} item={it} priority={i < 3} />
          ))}
          {/* Zweite Kopie nur für den Endloslauf auf Zeigergeräten */}
          <div aria-hidden="true" className="hidden gap-3 sm:gap-4 pointer-fine:motion-safe:flex">
            {items.map((it, i) => (
              <Frame key={`dup-${it.slug}-${i}`} item={it} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
