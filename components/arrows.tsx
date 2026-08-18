import type { AccentColor } from "@/lib/services";

/**
 * Die fünf Pfeile des Netwitcher-Logos als wiederverwendbares SVG-System.
 * Eine Pfeilform (abgerundeter Chevron), fünffach um je 72° rotiert = Logo-Stern.
 */

export const ARROW_COLORS: Record<AccentColor, string> = {
  mint: "#2EE6C8",
  violet: "#8B5CF6",
  pink: "#F468A8",
  sun: "#F5D33D",
  sky: "#0FB9F2",
};

/** Reihenfolge im Stern (oben beginnend, im Uhrzeigersinn) wie im Original-Logo. */
export const STAR_ORDER: AccentColor[] = ["mint", "violet", "pink", "sun", "sky"];

/**
 * Ein Logo-Arm: nach oben zeigender, abgerundeter Chevron in einem 100×100-Raster,
 * Spitze bei (50,18), Schenkel laufen zu den Seiten aus – wie im Original-Logo.
 */
export const ARROW_PATH =
  "M50 14 L74 38 A9 9 0 0 1 76.5 44 L79 66 A7 7 0 0 1 68 72.5 L52 56 A3 3 0 0 0 48 56 L32 72.5 A7 7 0 0 1 21 66 L23.5 44 A9 9 0 0 1 26 38 Z";

export function Arrow({
  color,
  size = 48,
  rotation = 0,
  className,
  style,
}: {
  color: AccentColor;
  size?: number;
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        d={ARROW_PATH}
        fill={ARROW_COLORS[color]}
        transform={rotation ? `rotate(${rotation} 50 50)` : undefined}
      />
    </svg>
  );
}

/**
 * Der komplette Netwitcher-Stern: fünf Arme, je 72° versetzt,
 * jeder Arm vom Zentrum nach außen verschoben (wie im Logo mit Lücke in der Mitte).
 */
export function StarMark({
  size = 40,
  className,
  spin = false,
}: {
  size?: number;
  className?: string;
  spin?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={className}
      style={
        spin
          ? { transition: "transform .6s cubic-bezier(.22,1,.36,1)" }
          : undefined
      }
    >
      {STAR_ORDER.map((color, i) => (
        <g key={color} transform={`rotate(${i * 72} 100 100)`}>
          <g transform="translate(50 8) scale(1)">
            <path d={ARROW_PATH} fill={ARROW_COLORS[color]} />
          </g>
        </g>
      ))}
    </svg>
  );
}
