import type { ImageAsset } from "@/lib/media";

/**
 * Bild-Ausgabe mit AVIF → WebP Fallback, lazy by default.
 * Kein next/image: die Assets sind bereits vorkomprimiert und dimensioniert,
 * so bleibt die Auslieferung ein statischer, cache-freundlicher <picture>-Tag.
 */
export function Media({
  asset,
  className = "",
  sizes,
  priority = false,
}: {
  asset: ImageAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <picture>
      <source srcSet={asset.avif} type="image/avif" sizes={sizes} />
      <source srcSet={asset.webp} type="image/webp" sizes={sizes} />
      <img
        src={asset.webp}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={className}
      />
    </picture>
  );
}
