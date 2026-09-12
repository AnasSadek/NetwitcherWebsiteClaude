"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, type MotionValue } from "framer-motion";

/**
 * Kopfdrehung als Frame-Sequenz auf einem Canvas.
 *
 * Statt drei Ansichten zu überblenden (Doppelbilder) wird eine aus dem
 * Turnaround-Clip extrahierte Sequenz von Kopf-Crops gezeichnet, gesteuert
 * vom Kopf-Wert -1..1 (links..rechts). Zwischen zwei Nachbarframes wird
 * subframe-genau überblendet; da sich Nachbarn nur minimal unterscheiden,
 * entsteht kein Geisterbild, nur weichere Bewegung.
 *
 *  - Nur der Kopfbereich (Crop mit weicher Kante) liegt auf dem Canvas,
 *    Körper und Hintergrund bleiben das statische Poster darunter.
 *  - Frames werden als ImageBitmap vorab dekodiert (off-main-thread),
 *    von der Mitte nach außen, damit die erste Bewegung sofort flüssig ist.
 *  - Pro Frame höchstens ein Draw (rAF-gedrosselt), nur bei Änderung.
 */
export type HeadTurnManifest = {
  frames: number;
  center: number;
  widths: number[];
  frame: { w: number; h: number };
  crop: { x: number; y: number; w: number; h: number };
  lens: { x: number; y: number }[];
  lensR: number;
};

/** Linsenmitte (Anteile des Gesamtbilds) für einen Kopf-Wert -1..1. */
export function lensAt(m: HeadTurnManifest, v: number) {
  const f = m.center + Math.max(-1, Math.min(1, v)) * m.center;
  const i0 = Math.floor(f), i1 = Math.min(m.frames - 1, i0 + 1), t = f - i0;
  const a = m.lens[i0], b = m.lens[i1];
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function HeadTurn({
  manifest,
  base,
  value,
  tilt,
  tiltOrigin,
  enabled,
}: {
  manifest: HeadTurnManifest;
  /** Ordner der Sequenz, z. B. "/mascot/headturn" */
  base: string;
  value: MotionValue<number>;
  /** Optionale 3D-Neigung des gezeichneten Kopfes (CSS-Transform-String,
   *  z. B. kleines rotateX fürs Nicken). Läuft rein im Compositor — kein
   *  zusätzliches Canvas-Zeichnen. Klein halten: der Matte-Rand muss den
   *  frontalen Poster-Kopf weiterhin vollständig abdecken. */
  tilt?: MotionValue<string>;
  /** Drehpunkt der Neigung (CSS transform-origin), z. B. die Linsenmitte. */
  tiltOrigin?: string;
  enabled: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(ImageBitmap | null)[]>([]);
  const raf = useRef(0);
  const last = useRef(NaN);
  const size = useRef({ w: 0, h: 0, dpr: 1 });

  // Zeichnen: Frame-Index aus dem Wert, Nachbarn überblenden
  const draw = () => {
    raf.current = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const v = Math.max(-1, Math.min(1, value.get()));
    const f = manifest.center + v * manifest.center;
    if (Math.abs(f - last.current) < 0.003) return;
    const i0 = Math.floor(f);
    const i1 = Math.min(manifest.frames - 1, i0 + 1);
    const t = f - i0;
    const list = frames.current;
    // nächster geladener Frame Richtung Mitte, falls der gewünschte noch fehlt
    const nearest = (i: number) => {
      if (list[i]) return i;
      const dir = i < manifest.center ? 1 : -1;
      for (let j = i; j >= 0 && j < manifest.frames; j += dir) if (list[j]) return j;
      return -1;
    };
    const a = nearest(i0), b = nearest(i1);
    if (a < 0) return;
    const { w, h } = size.current;
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.drawImage(list[a]!, 0, 0, w, h);
    if (b >= 0 && b !== a && t > 0.001) {
      ctx.globalAlpha = t;
      ctx.drawImage(list[b]!, 0, 0, w, h);
      ctx.globalAlpha = 1;
    }
    last.current = a === i0 && b === i1 ? f : NaN; // unvollständig gezeichnet → später erneut
  };
  const schedule = () => {
    if (!raf.current) raf.current = requestAnimationFrame(draw);
  };

  useMotionValueEvent(value, "change", () => {
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
        size.current = { w, h, dpr };
        last.current = NaN;
        schedule();
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    // Passende Breite wählen, Frames von der Mitte nach außen dekodieren
    const need = size.current.w;
    const width = manifest.widths.slice().sort((a, b) => a - b).find((wd) => (wd * manifest.crop.w) >= need) ?? Math.max(...manifest.widths);
    const order: number[] = [manifest.center];
    for (let d = 1; d <= manifest.center; d++) order.push(manifest.center - d, manifest.center + d);
    frames.current = new Array(manifest.frames).fill(null);
    let active = 0;
    const queue = order.filter((i) => i >= 0 && i < manifest.frames);
    const pump = () => {
      while (active < 4 && queue.length && !cancelled) {
        const i = queue.shift()!;
        active++;
        fetch(`${base}/${width}/${String(i).padStart(2, "0")}.webp`)
          .then((r) => r.blob())
          .then((blob) => createImageBitmap(blob))
          .then((bmp) => {
            if (cancelled) return bmp.close();
            frames.current[i] = bmp;
            last.current = NaN;
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
      frames.current.forEach((b) => b?.close());
      frames.current = [];
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
