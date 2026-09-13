"use client";

import { useEffect, useRef } from "react";
import { motion, type MotionValue } from "framer-motion";

/**
 * Kopf als VIDEO-ZUSTANDSMASCHINE auf einem Pose-Graphen.
 *
 * Es wird zu JEDEM ZeitPUNKT GENAU EIN echter Video-Frame gezeichnet —
 * niemals zwei Posen übereinander, keine Alpha-Mischung, kein Subframe-
 * Blending. Bewegung entsteht, indem der Kopf entlang echter Footage-
 * Bahnen scrubbt (wie ein Video, das vor- und zurückgespult wird).
 *
 * Der Pose-Graph ist ein STERN (alle Kanten sind eigene Clips mit
 * gemeinsamer Crop-Box):
 *
 *        UL      U      UR          Speichen      (je 17 Frames)
 *          \     |     /
 *           \    |    /
 *   L ————————— C ————————— R      Zeile „row"   (61 Frames)
 *           /    |    \
 *          /     |     \
 *        DL      D      DR
 *
 * Alle Bahnen treffen sich NUR in der frontalen Mitte C — und dort zeigen
 * alle Clips nachweislich dieselbe Pose (Frame-Diff ≈ 3–4/255). Jeder
 * Übergang zwischen zwei Posen läuft deshalb durch identische Frames:
 * kein Pose-Sprung, kein „zweiter Kopf", nirgends. (Die früheren
 * Rand-Bögen UL–U–UR / DL–D–DR sind bewusst entfernt: ihre Bogen-Clips
 * zeigten am Knoten U/D sichtbar andere Posen als die Speichen.)
 *
 * Maus-Ziel → nächster Punkt auf dem Graphen; der Kopf fährt mit begrenzter
 * Geschwindigkeit über die Kanten dorthin (kürzester Weg über die Knoten).
 */

export type HeadStrip = {
  dir: string;
  frames: number;
  center: number;
  lens: { x: number; y: number }[];
};

export type HeadGraphManifest = {
  widths: number[];
  frame: { w: number; h: number };
  crop: { x: number; y: number; w: number; h: number };
  lensR: number;
  strips: Record<string, HeadStrip>;
};

type NodeName = "C" | "L" | "R" | "U" | "D" | "UL" | "UR" | "DL" | "DR";
type EdgeDef = { a: NodeName; b: NodeName; strip: string; from: number; to: number };

const EDGES = {
  "C-L": { a: "C", b: "L", strip: "row", from: 30, to: 0 },
  "C-R": { a: "C", b: "R", strip: "row", from: 30, to: 60 },
  "C-U": { a: "C", b: "U", strip: "sp-u", from: 0, to: 16 },
  "C-D": { a: "C", b: "D", strip: "sp-d", from: 0, to: 16 },
  "C-UL": { a: "C", b: "UL", strip: "sp-ul", from: 0, to: 16 },
  "C-UR": { a: "C", b: "UR", strip: "sp-ur", from: 0, to: 16 },
  "C-DL": { a: "C", b: "DL", strip: "sp-dl", from: 0, to: 16 },
  "C-DR": { a: "C", b: "DR", strip: "sp-dr", from: 0, to: 16 },
} as const satisfies Record<string, EdgeDef>;
type EdgeName = keyof typeof EDGES;

const NODES: NodeName[] = ["C", "L", "R", "U", "D", "UL", "UR", "DL", "DR"];
const edgeLen = (e: EdgeName) => Math.abs(EDGES[e].to - EDGES[e].from);

// Kürzeste Knoten-Distanzen (in Frames) + erster Kantenschritt (Floyd-Warshall,
// einmalig auf dem winzigen Graphen)
const nodeDist: Record<string, number> = {};
const nextEdge: Record<string, EdgeName> = {};
{
  for (const x of NODES) for (const y of NODES) nodeDist[`${x}:${y}`] = x === y ? 0 : Infinity;
  for (const name of Object.keys(EDGES) as EdgeName[]) {
    const { a, b } = EDGES[name];
    const l = edgeLen(name);
    if (l < nodeDist[`${a}:${b}`]) {
      nodeDist[`${a}:${b}`] = l;
      nodeDist[`${b}:${a}`] = l;
      nextEdge[`${a}:${b}`] = name;
      nextEdge[`${b}:${a}`] = name;
    }
  }
  for (const k of NODES)
    for (const i of NODES)
      for (const j of NODES) {
        const alt = nodeDist[`${i}:${k}`] + nodeDist[`${k}:${j}`];
        if (alt < nodeDist[`${i}:${j}`]) {
          nodeDist[`${i}:${j}`] = alt;
          nextEdge[`${i}:${j}`] = nextEdge[`${i}:${k}`];
        }
      }
}

type Loc = { edge: EdgeName; t: number }; // t: 0 = Knoten a, 1 = Knoten b

/** Maus-Ziel (x, y ∈ [-1,1], y>0 = unten) → nächster Punkt auf dem Graphen. */
function targetLoc(x: number, y: number): Loc {
  const ax = Math.abs(x), ay = Math.abs(y);
  const m = Math.min(1, Math.hypot(x, y));
  if (ay < 0.32 || m < 0.15) return { edge: x < 0 ? "C-L" : "C-R", t: Math.min(1, ax) };
  const v = y < 0 ? "U" : "D";
  if (ax < 0.28) return { edge: `C-${v}` as EdgeName, t: Math.min(1, ay) };
  const d = `${v}${x < 0 ? "L" : "R"}`;
  return { edge: `C-${d}` as EdgeName, t: m };
}

/** Frame-Index (Datei) an einer Graph-Position. */
const frameAt = (loc: Loc) => {
  const e = EDGES[loc.edge];
  return Math.round(e.from + Math.min(1, Math.max(0, loc.t)) * (e.to - e.from));
};

export function HeadTurn({
  manifest,
  base,
  x,
  y,
  lensX,
  lensY,
  tilt,
  tiltOrigin,
  enabled,
  onFirstDraw,
}: {
  manifest: HeadGraphManifest;
  /** Ordner der Sequenzen, z. B. "/mascot/headturn" */
  base: string;
  /** Maus-Ziel (ungefedert): x ∈ [-1,1] links..rechts, y ∈ [-1,1] oben..unten */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Ausgang: Linsenmitte des aktuellen Frames in % des Gesamtbilds */
  lensX: MotionValue<number>;
  lensY: MotionValue<number>;
  /** Chase-Translation des Kopf-Canvas (klein; Matte-Rand deckt weiter ab) */
  tilt?: MotionValue<string>;
  tiltOrigin?: string;
  enabled: boolean;
  /** Einmalig nach dem ersten gezeichneten Frame — ab dann deckt der
      Canvas-Kopf den Poster-Kopf ab und der Unterbau darf wechseln. */
  onFirstDraw?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<Map<string, (ImageBitmap | null)[]>>(new Map());
  const size = useRef({ w: 0, h: 0 });
  const lastDrawn = useRef("");
  const announced = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let raf = 0;

    // Canvas-Größe an den Container koppeln (DPR-gekappt)
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
      if (w !== size.current.w || h !== size.current.h) {
        canvas.width = w;
        canvas.height = h;
        size.current = { w, h };
        lastDrawn.current = "";
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    // ---------- Frames dekodieren: Center-Zeile zuerst, dann Speichen, Zeilen ----------
    const need = size.current.w;
    const width =
      manifest.widths.slice().sort((a, b) => a - b).find((wd) => wd * manifest.crop.w >= need) ??
      Math.max(...manifest.widths);
    frames.current = new Map();
    const queue: { strip: string; i: number }[] = [];
    const centerOut = (strip: string) => {
      const s = manifest.strips[strip];
      frames.current.set(strip, new Array(s.frames).fill(null));
      const order = [s.center];
      for (let d2 = 1; d2 <= Math.max(s.center, s.frames - 1 - s.center); d2++) {
        if (s.center - d2 >= 0) order.push(s.center - d2);
        if (s.center + d2 < s.frames) order.push(s.center + d2);
      }
      for (const i of order) queue.push({ strip, i });
    };
    centerOut("row");
    centerOut("sp-u");
    centerOut("sp-d");
    centerOut("sp-ul");
    centerOut("sp-ur");
    centerOut("sp-dl");
    centerOut("sp-dr");
    let active = 0;
    const pump = () => {
      while (active < 4 && queue.length && !cancelled) {
        const job = queue.shift()!;
        active++;
        const dir = manifest.strips[job.strip].dir;
        fetch(`${base}/${dir ? `${dir}/` : ""}${width}/${String(job.i).padStart(2, "0")}.webp`)
          .then((r) => r.blob())
          .then((blob) => createImageBitmap(blob))
          .then((bmp) => {
            if (cancelled) return bmp.close();
            const list = frames.current.get(job.strip);
            if (list) list[job.i] = bmp;
            lastDrawn.current = ""; // ggf. besseren Frame nachzeichnen
          })
          .catch(() => undefined)
          .finally(() => {
            active--;
            pump();
          });
      }
    };
    pump();

    // ---------- Zeichnen: GENAU EIN Frame, nie zwei ----------
    const draw = (loc: Loc) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const e = EDGES[loc.edge];
      const list = frames.current.get(e.strip);
      if (!list) return;
      let idx = frameAt(loc);
      if (!list[idx]) {
        // nächster geladener Frame Richtung Kanten-Anfang (Mitte)
        const dir2 = e.to > e.from ? -1 : 1;
        let j = idx;
        while (j >= 0 && j < list.length && !list[j]) j += dir2;
        if (j < 0 || j >= list.length || !list[j]) {
          for (j = 0; j < list.length && !list[j]; j++);
          if (j >= list.length) return;
        }
        idx = j;
      }
      const key = `${e.strip}:${idx}:${size.current.w}`;
      if (key === lastDrawn.current) return;
      const { w, h } = size.current;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(list[idx]!, 0, 0, w, h);
      if (!announced.current) {
        announced.current = true;
        onFirstDraw?.();
      }
      lastDrawn.current = key;
      const l = manifest.strips[e.strip].lens[idx];
      if (l) {
        lensX.set(l.x * 100);
        lensY.set(l.y * 100);
      }
    };

    // ---------- Mover: über die Kanten zum Ziel fahren ----------
    const cur: Loc = { edge: "C-R", t: 0 }; // Start: frontale Mitte
    let last = performance.now();
    const nodeAt = (loc: Loc): NodeName | null =>
      loc.t <= 0.0001 ? EDGES[loc.edge].a : loc.t >= 0.9999 ? EDGES[loc.edge].b : null;

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const tgt = targetLoc(
        Math.max(-1, Math.min(1, x.get())),
        Math.max(-1, Math.min(1, y.get()))
      );

      // Restdistanz (in Frames) und nächster Fahrschritt bestimmen
      let moveTowardT: number; // Ziel-t auf der AKTUELLEN Kante
      let dist: number;
      if (tgt.edge === cur.edge) {
        moveTowardT = tgt.t;
        dist = Math.abs(tgt.t - cur.t) * edgeLen(cur.edge);
      } else {
        const { a, b } = EDGES[cur.edge];
        const { a: ta, b: tb } = EDGES[tgt.edge];
        const enter = (n: NodeName) =>
          n === ta ? tgt.t * edgeLen(tgt.edge) : n === tb ? (1 - tgt.t) * edgeLen(tgt.edge) : Infinity;
        const via = (exitNode: NodeName, exitT: number) => {
          let best = Infinity;
          for (const entry of [ta, tb]) {
            const c = exitT * edgeLen(cur.edge) + nodeDist[`${exitNode}:${entry}`] + enter(entry);
            if (c < best) best = c;
          }
          return best;
        };
        const costA = via(a, cur.t);
        const costB = via(b, 1 - cur.t);
        moveTowardT = costA <= costB ? 0 : 1;
        dist = Math.min(costA, costB);
      }

      if (dist > 0.01) {
        // Geschwindigkeit: zügig bei großer Distanz, weich auslaufend
        const v = Math.min(130, Math.max(26, dist * 7)); // Frames/s
        const dT = (v * dt) / Math.max(1, edgeLen(cur.edge));
        if (cur.t < moveTowardT) cur.t = Math.min(moveTowardT, cur.t + dT);
        else cur.t = Math.max(moveTowardT, cur.t - dT);

        // Knoten erreicht → auf die nächste Kante des Weges wechseln
        const n = nodeAt(cur);
        if (n && tgt.edge !== cur.edge) {
          const { a: ta2, b: tb2 } = EDGES[tgt.edge];
          const entry = (["C", ta2, tb2] as NodeName[])
            .filter((e2) => e2 === ta2 || e2 === tb2)
            .sort(
              (p, q) =>
                nodeDist[`${n}:${p}`] +
                (p === ta2 ? tgt.t : 1 - tgt.t) * edgeLen(tgt.edge) -
                (nodeDist[`${n}:${q}`] + (q === ta2 ? tgt.t : 1 - tgt.t) * edgeLen(tgt.edge))
            )[0];
          if (n === entry) {
            cur.edge = tgt.edge;
            cur.t = EDGES[tgt.edge].a === n ? 0 : 1;
          } else {
            const hop = nextEdge[`${n}:${entry}`];
            if (hop) {
              cur.edge = hop;
              cur.t = EDGES[hop].a === n ? 0 : 1;
            }
          }
        }
      }
      draw(cur);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      ro.disconnect();
      cancelAnimationFrame(raf);
      for (const list of frames.current.values()) list.forEach((b) => b?.close());
      frames.current = new Map();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, base, manifest]);

  if (!enabled) return null;
  return (
    <motion.canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute will-change-transform"
      style={{
        left: `${manifest.crop.x * 100}%`,
        top: `${manifest.crop.y * 100}%`,
        width: `${manifest.crop.w * 100}%`,
        height: `${manifest.crop.h * 100}%`,
        transform: tilt,
        transformOrigin: tiltOrigin,
      }}
    />
  );
}
