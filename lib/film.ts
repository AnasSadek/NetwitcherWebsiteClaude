/**
 * „From Nothing to Attention" — gemeinsame Zeitleiste des Scroll-Films.
 *
 * Alle Szenenzustände sind reine Funktionen des Scroll-Fortschritts (0..1).
 * Dadurch ist jede Bewegung deterministisch und rückwärts exakt umkehrbar.
 */

export const SCENE = {
  nothing: [0.0, 0.09],
  attention: [0.09, 0.21],
  camera: [0.21, 0.38],
  editing: [0.38, 0.5],
  formats: [0.5, 0.6],
  distribution: [0.6, 0.7],
  audience: [0.7, 0.78],
  website: [0.78, 0.86],
  action: [0.86, 0.92],
  star: [0.92, 1.0],
} as const;

export type SceneName = keyof typeof SCENE;

/** Lokaler Fortschritt 0..1 innerhalb [a,b], außerhalb geklemmt. */
export function seg(p: number, a: number, b: number): number {
  if (p <= a) return 0;
  if (p >= b) return 1;
  return (p - a) / (b - a);
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Starkes Ease-Out — Pendant zu cubic-bezier(0.23,1,0.32,1). */
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

/** Ease-In-Out für Bewegungen auf offener Bühne. */
export const easeInOut = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export const smoothstep = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Zeitbasierte Dämpfung — rahmenratenunabhängig, konvergiert immer. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/** Einmaliger Überschwinger am Ende (für das Einrasten der Pfeile). */
export function settle(t: number, overshoot = 0.12) {
  const x = clamp01(t);
  if (x >= 1) return 1;
  const c = overshoot;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
}

/** Offizielle Markenfarben (Guideline). Nie verändern. */
export const BRAND = {
  mint: "#2de2cc",
  violet: "#845dce",
  pink: "#f266b6",
  sun: "#f7d739",
  sky: "#03bef7",
  night: "#06060f",
  snow: "#f4f4fb",
} as const;

/** Wie viel Scroll-Weg der Film bekommt. */
export const SPINE_VH_DESKTOP = 950;
export const SPINE_VH_MOBILE = 700;
