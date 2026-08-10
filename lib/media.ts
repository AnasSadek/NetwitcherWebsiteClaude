/**
 * Medien-Manifest — alle Assets liegen lokal im Projekt (keine Remote-Abhängigkeit).
 * Bilder in AVIF + WebP (aus den Higgsfield-Originalen komprimiert, ~99 % kleiner).
 *
 * Herkunft & Zweck siehe docs/05-media-manifest.md
 */

export type ImageAsset = {
  avif: string;
  webp: string;
  width: number;
  height: number;
  alt: string;
};

export const media = {
  /** Studio-Totale: Produktionsumgebung, Hero + Studio-Kapitel. */
  studio: {
    avif: "/media/studio.avif",
    webp: "/media/studio.webp",
    width: 1800,
    height: 1013,
    alt: "Produktfotografie-Setup im Berliner Content-Studio: Softboxen, Kamera auf Stativ, Produkttisch",
  },
  /** Makro-Produktaufnahme: Foto-Kapitel, Hochformat. */
  product: {
    avif: "/media/product.avif",
    webp: "/media/product.webp",
    width: 1100,
    height: 1467,
    alt: "Produktfotografie im Studio: Kosmetikflasche auf reflektierender Fläche mit farbigem Lichtakzent",
  },
  /** Reel-/Videoproduktion hinter den Kulissen. */
  reels: {
    avif: "/media/reels.avif",
    webp: "/media/reels.webp",
    width: 1600,
    height: 900,
    alt: "Reel-Produktion im Studio: vertikales Video wird mit Gimbal und Licht-Setup gefilmt",
  },
  /** Kamera-Nahaufnahme am Produkttisch, Hochformat. */
  studioClose: {
    avif: "/media/studio-close.avif",
    webp: "/media/studio-close.webp",
    width: 1100,
    height: 1467,
    alt: "Cinema-Kamera auf Stativ vor dem Produkttisch im Studio Berlin",
  },
  /** Abstrakte Kampagnen-/Distributionsfläche. */
  performance: {
    avif: "/media/performance.avif",
    webp: "/media/performance.webp",
    width: 1600,
    height: 893,
    alt: "Abstrakte Kampagnenflächen mit Lichtspuren auf dunklem Hintergrund",
  },
} as const satisfies Record<string, ImageAsset>;

/** Studio-Loop fürs Hero-Kapitel (lazy, pausiert offscreen). */
export const heroVideo = {
  mp4: "/media/studio-loop.mp4",
  poster: "/media/studio-loop-poster.avif",
  width: 1280,
  height: 720,
} as const;
