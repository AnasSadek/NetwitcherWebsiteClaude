"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, type MotionValue } from "framer-motion";

/**
 * Kopfdrehung in 2D (Yaw × Pitch) als Frame-Zeilen auf einem Canvas.
 *
 * Drei ZEILEN aus echten Turnaround-Clips, alle mit derselben Crop-Box:
 *   up     – Kopf nach OBEN geneigt, dreht links ↔ rechts (41 Frames)
 *   center – Kopf waagerecht, dreht links ↔ rechts (61 Frames)
 *   down   – Kopf nach UNTEN geneigt, dreht links ↔ rechts (41 Frames)
 *
 * Maus-X (Yaw) wählt den Frame INNERHALB der Zeile: echte Zwischenframes,
 * subframe-genau überblendet — horizontal nie zwei verschiedene Posen
 * gleichzeitig. Maus-Y (Pitch, mit Commit-Rampe + Feder geformt) blendet
 * zwischen Center-Zeile und Up- bzw. Down-Zeile: gehaltene Positionen
 * liegen praktisch immer auf EINER Zeile (echtes Hoch-/Runterschauen),
 * die kurze Überblendung dazwischen ist ein Durchgangszustand der Feder.
 *
 *  - Frames werden als ImageBitmap vorab dekodiert (off-main-thread),
 *    Center-Zeile zuerst, dann Up/Down, jeweils von der Mitte nach außen.
 *  - Pro Frame höchstens ein Draw (rAF-gedrosselt), nur bei Änderung.
 *  - Fehlt ein Frame noch, fällt das Zeichnen auf den nächsten geladenen
 *    Richtung Zeilenmitte zurück (weicher reduzierter Radius statt Sprung).
 */

export type RowName = "up" | "center" | "down";

export type HeadRow = {
  /** Unterordner der Zeile ("" = Wurzel für die Center-Zeile) */
  dir: string;
  frames: number;
  center: number;
  lens: { x: number; y: number }[];
};

export type HeadTurn2DManifest = {
  widths: number[];
  frame: { w: number; h: number };
  crop: { x: number; y: number; w: number; h: number };
  lensR: number;
  rows: Record<RowName, HeadRow>;
};

const clamp = (v: number, lo = -1, hi = 1) => Math.min(hi, Math.max(lo, v));

function rowLens(r: HeadRow, yaw: number) {
  const f = r.center + clamp(yaw) * r.center;
  const i0 = Math.floor(f), i1 = Math.min(r.frames - 1, i0 + 1), t = f - i0;
  const a = r.lens[i0], b = r.lens[i1];
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Linsenmitte (Anteile des Gesamtbilds) für Yaw ∈ [-1,1], Pitch ∈ [-1,1]. */
export function lensAt2D(man: HeadTurn2DManifest, yaw: number, pitch: number) {
  const p = clamp(pitch);
  const c = rowLens(man.rows.center, yaw);
  if (Math.abs(p) < 1e-4) return c;
  const r = rowLens(p < 0 ? man.rows.up : man.rows.down, yaw);
  const w = Math.abs(p);
  return { x: c.x + (r.x - c.x) * w, y: c.y + (r.y - c.y) * w };
}

export function HeadTurn({
  manifest,
  base,
  yaw,
  pitch,
  tilt,
  tiltOrigin,
  enabled,
}: {
  manifest: HeadTurn2DManifest;
  /** Ordner der Sequenzen, z. B. "/mascot/headturn" */
  base: string;
  yaw: MotionValue<number>;
  /** Geformter Pitch (-1 = oben … 1 = unten), Commit + Feder in HeroStage. */
  pitch: MotionValue<number>;
  /** Optionale Zusatz-Transformation des Kopf-Canvas (Chase-Translation).
   *  Klein halten: der Matte-Rand muss den Poster-Kopf weiter abdecken. */
  tilt?: MotionValue<string>;
  tiltOrigin?: string;
  enabled: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<Map<RowName, (ImageBitmap | null)[]>>(new Map());
  const raf = useRef(0);
  const last = useRef("");
  const size = useRef({ w: 0, h: 0 });

  const draw = () => {
    raf.current = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const y = clamp(yaw.get());
    const p = clamp(pitch.get());
    const pitched: RowName | null = p < -0.001 ? "up" : p > 0.001 ? "down" : null;
    const wP = Math.abs(p);
    const { w, h } = size.current;

    // Zeichenplan einer Zeile: gewünschte Frames, nächste geladene als Ersatz
    const plan = (name: RowName) => {
      const r = manifest.rows[name];
      const list = frames.current.get(name);
      if (!list) return null;
      const f = r.center + y * r.center;
      const want0 = Math.floor(f), want1 = Math.min(r.frames - 1, want0 + 1), t = f - want0;
      const nearest = (i: number) => {
        if (list[i]) return i;
        const dir = i < r.center ? 1 : -1;
        for (let j = i; j >= 0 && j < r.frames; j += dir) if (list[j]) return j;
        return -1;
      };
      const i0 = nearest(want0), i1 = nearest(want1);
      if (i0 < 0) return null;
      return { list, i0, i1, t, complete: i0 === want0 && i1 === want1 };
    };
    const baseP = plan("center");
    const topP = pitched ? plan(pitched) : null;
    if (!baseP && !topP) return;
    const sig = `${baseP ? `${baseP.i0}:${baseP.i1}:${baseP.t.toFixed(3)}` : ""}|${pitched ?? ""}:${wP.toFixed(3)}|${topP ? `${topP.i0}:${topP.i1}:${topP.t.toFixed(3)}` : ""}`;
    if (sig === last.current) return;

    ctx.clearRect(0, 0, w, h);
    const paint = (pl: NonNullable<ReturnType<typeof plan>>, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.drawImage(pl.list[pl.i0]!, 0, 0, w, h);
      if (pl.i1 !== pl.i0 && pl.i1 >= 0 && pl.t > 0.001) {
        ctx.globalAlpha = alpha * pl.t;
        ctx.drawImage(pl.list[pl.i1]!, 0, 0, w, h);
      }
      ctx.globalAlpha = 1;
    };
    // Center als Basis, geneigte Zeile mit ihrem Gewicht darüber:
    // Ergebnis = wP·Zeile + (1−wP)·Center — exakt, kein Durchscheinen.
    if (baseP) paint(baseP, 1);
    if (topP && wP > 0.001) paint(topP, baseP ? wP : 1);
    last.current = (baseP?.complete ?? true) && (topP?.complete ?? true) ? sig : "";
  };
  const schedule = () => {
    if (!raf.current) raf.current = requestAnimationFrame(draw);
  };

  useMotionValueEvent(yaw, "change", () => {
    if (enabled) schedule();
  });
  useMotionValueEvent(pitch, "change", () => {
    if (enabled) schedule();
  });

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;

    // Canvas-Größe an den Container koppeln (DPR-gekappt)
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
      if (w !== size.current.w || h !== size.current.h) {
        canvas.width = w;
        canvas.height = h;
        size.current = { w, h };
        last.current = "";
        schedule();
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    // Passende Breite wählen; Center-Zeile zuerst laden (häufigster Fall),
    // dann Up/Down verschränkt — jeweils von der Zeilenmitte nach außen.
    const need = size.current.w;
    const width =
      manifest.widths.slice().sort((a, b) => a - b).find((wd) => wd * manifest.crop.w >= need) ??
      Math.max(...manifest.widths);
    frames.current = new Map();
    const queue: { name: RowName; i: number; url: string }[] = [];
    const enqueue = (name: RowName) => {
      const r = manifest.rows[name];
      frames.current.set(name, new Array(r.frames).fill(null));
      const order: number[] = [r.center];
      for (let d = 1; d <= r.center; d++) order.push(r.center - d, r.center + d);
      for (const i of order) {
        if (i < 0 || i >= r.frames) continue;
        const dir = r.dir ? `${r.dir}/` : "";
        queue.push({ name, i, url: `${base}/${dir}${width}/${String(i).padStart(2, "0")}.webp` });
      }
    };
    enqueue("center");
    // up/down verschränkt hinter der Center-Zeile
    {
      const r0 = queue.length;
      enqueue("up");
      const upPart = queue.splice(r0);
      enqueue("down");
      const downPart = queue.splice(r0);
      for (let i = 0; i < Math.max(upPart.length, downPart.length); i++) {
        if (upPart[i]) queue.push(upPart[i]);
        if (downPart[i]) queue.push(downPart[i]);
      }
    }
    let active = 0;
    const pump = () => {
      while (active < 4 && queue.length && !cancelled) {
        const job = queue.shift()!;
        active++;
        fetch(job.url)
          .then((r) => r.blob())
          .then((blob) => createImageBitmap(blob))
          .then((bmp) => {
            if (cancelled) return bmp.close();
            const list = frames.current.get(job.name);
            if (list) list[job.i] = bmp;
            last.current = "";
            schedule();
          })
          .catch(() => undefined)
          .finally(() => {
            active--;
            pump();
          });
      }
    };
    pump();

    return () => {
      cancelled = true;
      ro.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
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
