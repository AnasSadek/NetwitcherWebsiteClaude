/**
 * „From Attention to Conversion" – Szenen-Timing & Keyframes der 3D-Story.
 *
 * Der Scroll-Fortschritt p ∈ [0,1] ist in 7 Szenen unterteilt. Alle 3D-Objekte
 * interpolieren ihre Transformationen zwischen Ankerpunkten an den Szenengrenzen.
 */

export const SCENES = {
  attention: [0.0, 0.14],
  chaos: [0.14, 0.28],
  system: [0.28, 0.42],
  studio: [0.42, 0.58],
  campaigns: [0.58, 0.72],
  web: [0.72, 0.86],
  conversion: [0.86, 1.0],
} as const;

/** Ankerzeitpunkte = Szenengrenzen (letzter bei 0.94, damit der Stern vor Scroll-Ende komplett ist). */
export const ANCHORS = [0, 0.14, 0.28, 0.42, 0.58, 0.72, 0.86, 0.94] as const;

export const ARROW_HEX = ["#2EE6C8", "#8B5CF6", "#F468A8", "#F5D33D", "#0FB9F2"] as const;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Fortschritt innerhalb eines Intervalls, geglättet (smoothstep). */
export function phase(p: number, a: number, b: number): number {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/** Ein-/Ausblend-Hüllkurve: 0 → 1 → 1 → 0 über [a,b], Flanken = f·Intervall. */
export function envelope(p: number, a: number, b: number, f = 0.25): number {
  const d = (b - a) * f;
  return phase(p, a, a + d) * (1 - phase(p, b - d, b));
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type Transform = {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
};

/** Deterministischer Pseudozufall (stabil über Renders/SSR). */
export function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const D2R = Math.PI / 180;

/** Stern-Anordnung: Arm i bei Winkel i·72° (oben beginnend), Spitze nach außen. */
function starAnchor(i: number, radius: number, zSpread: number, jitter: number): Transform {
  const a = (90 - i * 72) * D2R;
  const j = (rand(i * 7 + 1) - 0.5) * jitter;
  return {
    pos: [
      Math.cos(a) * radius + j,
      Math.sin(a) * radius * 0.82 + (rand(i * 13 + 2) - 0.5) * jitter,
      (rand(i * 3 + 5) - 0.5) * 2 * zSpread,
    ],
    rot: [jitter * 0.3, jitter * 0.3, -i * 72 * D2R],
    scale: 0.88,
  };
}

/** Chaos: weit verstreut, wild rotiert. */
function chaosAnchor(i: number): Transform {
  const a = rand(i * 17 + 3) * Math.PI * 2;
  const r = 3.4 + rand(i * 23 + 7) * 1.6;
  return {
    pos: [Math.cos(a) * r, (rand(i * 31 + 9) - 0.5) * 4.4, -1 - rand(i * 5 + 11) * 2.5],
    rot: [rand(i * 3) * 4, rand(i * 5) * 4, rand(i * 7) * 6],
    scale: 0.8,
  };
}

/** System: Pfeile als Richtungsgeber in einer Reihe, alle zeigen nach rechts. */
function rowAnchor(i: number): Transform {
  return {
    pos: [-2.6 + i * 1.3, -0.9 + (i % 2) * 0.45 + i * 0.12, 0.4],
    rot: [0, 0, -90 * D2R],
    scale: 0.55,
  };
}

/** Studio: klein an die Ränder geparkt, rahmen die Galerie. */
function edgesAnchor(i: number): Transform {
  const spots: [number, number][] = [
    [-3.4, 1.7],
    [3.4, 1.9],
    [-3.5, -1.6],
    [3.5, -1.7],
    [0, 2.4],
  ];
  return {
    pos: [spots[i][0], spots[i][1], 0.8],
    rot: [0, 0, (spots[i][0] < 0 ? -90 : 90) * D2R],
    scale: 0.42,
  };
}

/** Campaigns: links gestapelt, zeigen auf die Ad-Boards rechts. */
function pointerAnchor(i: number): Transform {
  return {
    pos: [-3.1, 1.5 - i * 0.75, 0.6],
    rot: [0, 0, -90 * D2R],
    scale: 0.5,
  };
}

/** Web: rahmen das UI-Layout an den Ecken. */
function cornerAnchor(i: number): Transform {
  const spots: [number, number, number][] = [
    [-2.9, 1.8, 45],
    [2.9, 1.8, -45],
    [-2.9, -1.8, 135],
    [2.9, -1.8, -135],
    [0, 2.5, 0],
  ];
  return {
    pos: [spots[i][0], spots[i][1], 0.5],
    rot: [0, 0, spots[i][2] * D2R],
    scale: 0.4,
  };
}

/** Conversion: exakter Netwitcher-Stern, frontal, leuchtend.
 *  +36° Gesamtrotation = Original-Logo-Ausrichtung (gelber Arm unten). */
function finalStarAnchor(i: number): Transform {
  const a = (126 - i * 72) * D2R;
  const r = 1.12;
  return {
    pos: [Math.cos(a) * r, Math.sin(a) * r + 0.55, -0.8],
    rot: [0, 0, (36 - i * 72) * D2R],
    scale: 0.7,
  };
}

/** Alle 8 Anker (Szenengrenzen) für Pfeil i. */
export function arrowAnchors(i: number): Transform[] {
  return [
    starAnchor(i, 1.75, 0.5, 0.35), // p = 0     Attention
    starAnchor(i, 1.9, 0.7, 0.55),  // p = .14   → Chaos beginnt
    chaosAnchor(i),                 // p = .28   Chaos-Höhepunkt → System
    rowAnchor(i),                   // p = .42   System → Studio
    edgesAnchor(i),                 // p = .58   Studio → Campaigns
    pointerAnchor(i),               // p = .72   Campaigns → Web
    cornerAnchor(i),                // p = .86   Web → Conversion
    finalStarAnchor(i),             // p = 1     Stern komplett
  ];
}

/** Interpoliert einen Transform-Satz entlang der Anker. */
export function sampleAnchors(anchors: Transform[], p: number): Transform {
  let k = 0;
  while (k < ANCHORS.length - 2 && p > ANCHORS[k + 1]) k++;
  const t = phase(p, ANCHORS[k], ANCHORS[k + 1]);
  const a = anchors[k];
  const b = anchors[k + 1];
  return {
    pos: [lerp(a.pos[0], b.pos[0], t), lerp(a.pos[1], b.pos[1], t), lerp(a.pos[2], b.pos[2], t)],
    rot: [lerp(a.rot[0], b.rot[0], t), lerp(a.rot[1], b.rot[1], t), lerp(a.rot[2], b.rot[2], t)],
    scale: lerp(a.scale, b.scale, t),
  };
}

/** Kamera-Z entlang der Anker (leichte Fahrt pro Szene). */
export const CAMERA_Z = [6.8, 6.9, 7.4, 6.6, 5.9, 6.3, 6.4, 6.3] as const;

export function cameraZ(p: number): number {
  let k = 0;
  while (k < ANCHORS.length - 2 && p > ANCHORS[k + 1]) k++;
  return lerp(CAMERA_Z[k], CAMERA_Z[k + 1], phase(p, ANCHORS[k], ANCHORS[k + 1]));
}
