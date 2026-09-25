import type { CSSProperties } from "react";
import type { Locale } from "@/lib/i18n/locale";

/**
 * Überschrift in EP Boxi (Deutsch) bzw. Cairo (Arabisch), die sich an ihre
 * Spalte anpasst.
 *
 * EP Boxi ist extrem breit (≈1,1 em pro Versal). Statt fester vw-Grössen wird
 * die Schriftgrösse aus dem längsten Wort und der Containerbreite berechnet
 * (Container-Query-Einheit cqw): nichts wird abgeschnitten, nichts umbricht
 * mitten im Wort, und kurze Titel bleiben gross. Cairo (Arabisch) ist
 * proportional und deutlich schmaler pro Zeichen als EP Boxis Versalien —
 * bekommt daher einen eigenen, grosszügigeren CHAR_WIDTH-Faktor.
 */
type Line = string | { text: string; sweep?: boolean };

const CHAR_WIDTH_DE = 0.86; // em pro Versal (gemessen ≈0,83, mit Reserve)
const CHAR_WIDTH_AR = 0.62; // Cairo Bold: proportional, schmaler als EP Boxi

export function BoxiTitle({
  as: Tag = "h2",
  lines,
  max = "6rem",
  min = "1.75rem",
  id,
  className = "",
  style,
  fitLines = false,
  locale = "de",
}: {
  as?: "h1" | "h2" | "h3" | "p";
  lines: Line[];
  /** Obergrenze, z. B. "6rem" oder "7vw" */
  max?: string;
  /** Untergrenze: darunter darf hyphens/overflow-wrap eingreifen */
  min?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  /** true: ganze Zeilen passen (Hero) · false: nur das längste Wort (Fließtitel) */
  fitLines?: boolean;
  locale?: Locale;
}) {
  const isAr = locale === "ar";
  const texts = lines.map((l) => (typeof l === "string" ? l : l.text));
  const longest = Math.max(
    1,
    ...(fitLines ? texts.map((t) => t.length) : texts.flatMap((t) => t.split(/\s+/).map((w) => w.length)))
  );
  const charWidth = isAr ? CHAR_WIDTH_AR : CHAR_WIDTH_DE;
  const fit = (100 / (longest * charWidth)).toFixed(2);
  return (
    <div className="@container w-full">
      <Tag
        id={id}
        lang={locale}
        dir={isAr ? "rtl" : "ltr"}
        className={`font-boxi ${isAr ? "leading-[1.25]" : "leading-[0.94] hyphens-auto"} [overflow-wrap:anywhere] ${className}`}
        style={{ fontSize: `clamp(${min}, ${fit}cqw, ${max})`, ...style }}
      >
        {lines.map((l, i) => {
          const text = typeof l === "string" ? l : l.text;
          const sweep = typeof l !== "string" && l.sweep;
          return (
            <span key={i} className="block">
              {sweep ? <span className="brand-sweep bg-clip-text text-transparent">{text}</span> : text}
            </span>
          );
        })}
      </Tag>
    </div>
  );
}
