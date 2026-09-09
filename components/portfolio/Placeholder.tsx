import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import type { AccentColor } from "@/lib/services";

/**
 * Neutraler Medien-Platzhalter. Kein Stockfoto, keine erfundene Arbeit:
 * eine ruhige Fläche in der Projektfarbe mit Format-Angabe, die beim
 * Einsetzen der echten Datei einfach verschwindet.
 */
export function Placeholder({
  color = "violet",
  label,
  ratio,
  kind = "image",
  monogram,
  className = "",
}: {
  color?: AccentColor;
  label?: string | false;
  ratio?: string;
  kind?: "image" | "video";
  monogram?: string;
  className?: string;
}) {
  const hex = ARROW_COLORS[color];
  return (
    <div
      aria-hidden="true"
      className={`dot-grid relative h-full w-full overflow-hidden bg-void-3 ${className}`}
      style={{
        backgroundColor: "#1b1140",
        backgroundImage: `radial-gradient(120% 90% at 20% 0%, ${hex}2e, transparent 60%), radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)`,
        backgroundSize: "auto, 22px 22px",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute -right-[12%] -bottom-[14%] h-[70%] w-auto opacity-[0.12]"
        aria-hidden="true"
      >
        <path d={ARROW_PATH} fill={hex} transform="rotate(-30 50 50)" />
      </svg>
      {monogram && (
        <span
          className="absolute left-4 top-4 font-boxi text-[clamp(1.25rem,4cqw,2.5rem)] leading-none text-white/25 sm:left-5 sm:top-5"
        >
          {monogram}
        </span>
      )}
      {label !== false && (
        <span className="absolute bottom-4 left-4 flex items-center gap-2 font-heading text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 sm:bottom-5 sm:left-5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hex }} />
          {label ?? (kind === "video" ? "Video folgt" : "Bild folgt")}
          {ratio && <span className="text-white/30">· {ratio}</span>}
        </span>
      )}
    </div>
  );
}
