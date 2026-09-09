import type { CSSProperties } from "react";

/**
 * Überschrift in EP Boxi, die sich an ihre Spalte anpasst.
 *
 * EP Boxi ist extrem breit (≈1,1 em pro Versal). Statt fester vw-Grössen wird
 * die Schriftgrösse aus dem längsten Wort und der Containerbreite berechnet
 * (Container-Query-Einheit cqw): nichts wird abgeschnitten, nichts umbricht
 * mitten im Wort, und kurze Titel bleiben gross.
 */
type Line = string | { text: string; sweep?: boolean };

const CHAR_WIDTH = 0.86; // em pro Versal (gemessen ≈0,83, mit Reserve)

export function BoxiTitle({
  as: Tag = "h2",
  lines,
  max = "6rem",
  min = "1.75rem",
  id,
  className = "",
  style,
  fitLines = false,
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
}) {
  const texts = lines.map((l) => (typeof l === "string" ? l : l.text));
  const longest = Math.max(
    1,
    ...(fitLines ? texts.map((t) => t.length) : texts.flatMap((t) => t.split(/\s+/).map((w) => w.length)))
  );
  const fit = (100 / (longest * CHAR_WIDTH)).toFixed(2);
  return (
    <div className="@container w-full">
      <Tag
        id={id}
        lang="de"
        className={`font-boxi leading-[0.94] hyphens-auto [overflow-wrap:anywhere] ${className}`}
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
