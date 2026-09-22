import Image from "next/image";
import type { MediaImage } from "@/lib/portfolio";

/**
 * Minimaler Laptop-Bildschirm-Rahmen für Screenshot-Galerien: dunkler
 * Bezel mit Kamera-Punkt, darunter eine schlanke Tastatur-Basis. Das
 * Bild sitzt per `object-fit: contain` im Screen — nie beschnitten,
 * auch wenn das Seitenverhältnis nicht 16:10 entspricht.
 */
export function LaptopFrame({
  image,
  sizes,
  priority,
  className = "",
}: {
  image: MediaImage;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[880px] ${className}`}>
      <div className="relative overflow-hidden rounded-t-[10px] border-[6px] border-b-0 border-ink bg-ink shadow-lift sm:rounded-t-[14px] sm:border-[9px] md:rounded-t-[16px] md:border-[11px]">
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-0 z-10 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-white/25"
        />
        <div className="relative w-full overflow-hidden bg-white" style={{ aspectRatio: "16 / 10" }}>
          {image.src && (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={sizes}
              priority={priority}
              className="object-contain p-2 sm:p-3"
            />
          )}
        </div>
      </div>
      <div className="h-[7px] w-full rounded-b-[6px] bg-gradient-to-b from-ink to-ink/80 sm:h-[10px] sm:rounded-b-[8px] md:h-3" />
      <div className="mx-auto h-[3px] w-1/4 rounded-b-full bg-ink/70 sm:h-1" />
    </div>
  );
}

/** Kompakte Variante für kleine Thumbnails: nur der Screen-Bezel, ohne Basis. */
export function LaptopFrameThumb({
  image,
  sizes,
  className = "",
}: {
  image: MediaImage;
  sizes?: string;
  className?: string;
}) {
  return (
    <div className={`relative h-full w-full overflow-hidden rounded-[8px] border-2 border-ink bg-white ${className}`}>
      {image.src && (
        <Image
          src={image.src}
          alt=""
          fill
          draggable={false}
          sizes={sizes}
          className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
        />
      )}
    </div>
  );
}
