import Image from "next/image";
import type { MediaImage, Ratio } from "@/lib/portfolio";
import { ratioValue } from "@/lib/portfolio";
import type { AccentColor } from "@/lib/services";
import { Placeholder } from "./Placeholder";

/**
 * Bild im festen Seitenverhältnis (kein Layout-Shift), lazy, responsive
 * über next/image. Ohne `src` erscheint der neutrale Platzhalter.
 */
export function SmartImage({
  image,
  color,
  ratio,
  ratioClass,
  sizes = "100vw",
  priority = false,
  monogram,
  label,
  className = "",
  imgClassName = "",
  rounded = "rounded-2xl",
}: {
  image: MediaImage;
  color: AccentColor;
  /** Überschreibt das Ratio des Bildes (z. B. für Kacheln). */
  ratio?: Ratio;
  /** Responsive Ratio per Klassen (aspect-[4/5] md:aspect-[16/10]); ersetzt den Inline-Wert. */
  ratioClass?: string;
  sizes?: string;
  priority?: boolean;
  monogram?: string;
  label?: string;
  className?: string;
  imgClassName?: string;
  rounded?: string;
}) {
  const r = ratio ?? image.ratio ?? "16/10";
  return (
    <div
      className={`relative w-full overflow-hidden bg-void-2 ${rounded} ${ratioClass ?? ""} ${className}`}
      style={ratioClass ? undefined : { aspectRatio: ratioValue(r) }}
    >
      {image.src ? (
        image.src.startsWith("http") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt={image.alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
          />
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={`object-cover ${imgClassName}`}
          />
        )
      ) : (
        <Placeholder color={color} ratio={r.replace("/", ":")} monogram={monogram} label={label} />
      )}
    </div>
  );
}
