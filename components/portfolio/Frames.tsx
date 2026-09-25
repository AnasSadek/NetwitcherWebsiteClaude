import { getDict } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locale";
import type { MediaImage } from "@/lib/portfolio";
import type { AccentColor } from "@/lib/services";
import { SmartImage } from "./SmartImage";

/** Browser-Rahmen für Website-Screenshots. Hover fährt lange Screens nach unten. */
export function BrowserFrame({
  image,
  color,
  url,
  sizes,
  priority,
  monogram,
  className = "",
  locale = "de",
}: {
  image: MediaImage;
  color: AccentColor;
  url?: string;
  sizes?: string;
  priority?: boolean;
  monogram?: string;
  className?: string;
  locale?: Locale;
}) {
  const t = getDict(locale);
  const host = url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "";
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-white shadow-lift md:rounded-3xl ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-line-2 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="block h-2.5 w-2.5 rounded-full bg-ink/15" />
          <i className="block h-2.5 w-2.5 rounded-full bg-ink/15" />
          <i className="block h-2.5 w-2.5 rounded-full bg-ink/15" />
        </span>
        <span className="mx-auto flex h-6 w-full max-w-xs items-center justify-center rounded-md bg-ink/5 font-heading text-[10px] font-semibold tracking-wide text-ink-3">
          {host || " "}
        </span>
      </div>
      <div className="scroll-preview">
        <SmartImage
          image={image}
          color={color}
          sizes={sizes}
          priority={priority}
          monogram={monogram}
          label={t.portfolio.screenshotFollowsDesktop}
          rounded="rounded-none"
        />
      </div>
    </div>
  );
}

/** Smartphone-Rahmen für 9:16-Screens. */
export function PhoneFrame({
  image,
  color,
  sizes,
  monogram,
  className = "",
  label,
  locale = "de",
}: {
  image: MediaImage;
  color: AccentColor;
  sizes?: string;
  monogram?: string;
  className?: string;
  label?: string;
  locale?: Locale;
}) {
  const resolvedLabel = label ?? getDict(locale).portfolio.screenshotFollowsMobile;
  return (
    <div
      className={`relative rounded-[2rem] border border-ink/80 bg-ink p-1.5 shadow-lift md:rounded-[2.4rem] md:p-2 ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-3 z-10 h-1.5 w-1/4 -translate-x-1/2 rounded-full bg-black/60 md:top-4"
      />
      <SmartImage
        image={image}
        color={color}
        ratio="9/16"
        sizes={sizes}
        monogram={monogram}
        label={resolvedLabel}
        rounded="rounded-[1.6rem] md:rounded-[1.9rem]"
      />
    </div>
  );
}
