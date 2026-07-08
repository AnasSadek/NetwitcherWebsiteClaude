/**
 * Zentrale Medien-Quellen (mit Higgsfield generiert).
 *
 * Standardmäßig werden die Higgsfield-CDN-URLs verwendet. Führe `npm run fetch-media`
 * aus, um die Dateien nach /public/media zu laden – das Skript stellt diese Konstanten
 * dann automatisch auf lokale Pfade um (empfohlen für Produktion).
 */

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_39Y11T2lLRMNMkZy9mFemYRLqw0";

export const media = {
  heroLoop: {
    src: `${CDN}/hf_20260702_143035_8d3c0321-25df-46e0-80bb-89c17170bc74.mp4`,
    local: "/media/hero-loop.mp4",
    width: 1280,
    height: 720,
  },
  studio: {
    src: `${CDN}/hf_20260702_143041_fc61ab0b-a727-4540-8fe4-4c0708d2046e.png`,
    local: "/media/studio.png",
    width: 2048,
    height: 1152,
    alt: "Content-Studio in Berlin: Produktfotografie-Setup mit Softboxen, Kamera und Neon-Akzentlicht in Lila und Cyan",
  },
  product: {
    src: `${CDN}/hf_20260702_143046_0077f601-7b8a-445a-a699-96106b7a45b3.png`,
    local: "/media/product.png",
    width: 1536,
    height: 2048,
    alt: "High-End-Produktfotografie im Studio: Kosmetikflasche auf reflektierender Fläche mit Cyan- und Magenta-Lichtkanten",
  },
  reels: {
    src: `${CDN}/hf_20260702_143052_4d7c7849-a2d7-4aaa-97cd-9adaa21ee7af.png`,
    local: "/media/reels.png",
    width: 2048,
    height: 1152,
    alt: "Behind the Scenes einer Reel-Produktion: Creator filmt vertikales Video mit Gimbal und Ringlicht im dunklen Studio",
  },
  studioClose: {
    src: `${CDN}/hf_20260708_084652_ccf680f6-667b-4127-9e39-7310d8890cff.png`,
    local: "/media/studio-close.png",
    width: 1152,
    height: 1536,
    alt: "Cinema-Kamera auf Stativ vor einem Produkttisch im Berliner Studio, Neon-Rim-Light in Lila und Cyan",
  },
  performance: {
    src: `${CDN}/hf_20260708_084627_620bb6c9-8c7f-456d-a0b4-d9177e7c9f5e.png`,
    local: "/media/performance.png",
    width: 1376,
    height: 768,
    alt: "Abstrakte Performance-Marketing-Umgebung: schwebende Glas-Dashboards mit leuchtenden Charts in Neonfarben",
  },
  arrowsBg: {
    src: `${CDN}/hf_20260702_143055_998f3ad0-0304-4baf-86ef-92d2fafa4143.png`,
    local: "/media/arrows-bg.png",
    width: 1584,
    height: 672,
    alt: "Abstrakte schwebende Pfeilformen in Türkis, Lila, Pink, Gelb und Blau auf dunklem Hintergrund",
  },
} as const;
