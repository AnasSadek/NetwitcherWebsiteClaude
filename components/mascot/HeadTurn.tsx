"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";

/**
 * Kopfdrehung in ALLE Richtungen als Frame-Sequenzen auf einem Canvas.
 *
 * Acht radiale Strips (rechts, unten-rechts, unten, … im Uhrzeigersinn),
 * jeder aus einem eigenen Turnaround-Clip extrahiert: Frame 0 ist immer die
 * frontale Mitte, danach dreht der Kopf gleichmäßig in die Richtung.
 * Alle Strips teilen sich EINE Crop-Box, deshalb genügt ein Canvas.
 *
 * Zeichnen für ein Blickziel (x, y):
 *   Betrag  → Frame-Index im Strip (echte Zwischenframes, radial keinerlei
 *             Überblendung verschiedener Posen)
 *   Winkel  → die zwei benachbarten Strips, mit steiler „Commit"-Rampe:
 *             gehaltene Positionen liegen praktisch immer auf EINEM Strip,
 *             die kurze Überblendung dazwischen betrifft nur ähnliche Posen
 *             gleicher Auslenkung — kein stehendes Doppelbild.
 *
 *  - Frames werden als ImageBitmap vorab dekodiert (off-main-thread),
 *    horizontal zuerst (häufigste Bewegung), dann vertikal, dann diagonal,
 *    jeweils von der Mitte nach außen.
 *  - Pro Frame höchstens ein Draw (rAF-gedrosselt), nur bei Änderung.
 *  - Fehlt ein Frame noch, fällt das Zeichnen auf den nächsten geladenen
 *    Richtung Mitte zurück (weicher reduzierter Radius statt Sprung).
 */

export const DIR_ORDER = [
  "right",
  "down-right",
  "down",
  "down-left",
  "left",
  "up-left",
  "up",
  "up-right",
] as const;
export type StripName = (typeof DIR_ORDER)[number];

export type HeadTurn2DManifest = {
  widths: number[];
  frame: { w: number; h: number };
  crop: { x: number; y: number; w: number; h: number };
  lensR: number;
  strips: Record<
    StripName,
    { dir: string; start: number; step: number; frames: number; lens: { x: number; y: number }[] }
  >;
};

const clamp = (v: number, lo = -1, hi = 1) => Math.min(hi, Math.max(lo, v));
// Steile Rampe: unter a → 0, über b → 1 (Winkel-„Commit" zwischen Strips)
const commit = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

/** Blickziel → Betrag, benachbartes Strip-Paar und Mischanteil. */
export function gazePose(x: number, y: number) {
  const gx = clamp(x), gy = clamp(y);
  const m = Math.min(1, Math.hypot(gx, gy));
  let a = Math.atan2(gy, gx) / (Math.PI / 4); // 45°-Einheiten, 0 = rechts
  if (a < 0) a += 8;
  const k0 = Math.floor(a) % 8;
  const k1 = (k0 + 1) % 8;
  const t = commit(a - Math.floor(a), 0.32, 0.68);
  return { m, k0, k1, t };
}

function stripLens(s: HeadTurn2DManifest["strips"][StripName], m: number) {
  const f = m * (s.frames - 1);
  const i0 = Math.floor(f), i1 = Math.min(s.frames - 1, i0 + 1), fr = f - i0;
  const a = s.lens[i0], b = s.lens[i1];
  return { x: a.x + (b.x - a.x) * fr, y: a.y + (b.y - a.y) * fr };
}

/** Linsenmitte (Anteile des Gesamtbilds) für ein Blickziel (x, y) ∈ [-1, 1]². */
export function lensAt2D(man: HeadTurn2DManifest, x: number, y: number) {
  const { m, k0, k1, t } = gazePose(x, y);
  const la = stripLens(man.strips[DIR_ORDER[k0]], m);
  const lb = stripLens(man.strips[DIR_ORDER[k1]], m);
  return { x: la.x + (lb.x - la.x) * t, y: la.y + (lb.y - la.y) * t };
}

/** Ladepriorität: horizontal → vertikal → diagonal, je von der Mitte nach außen. */
const LOAD_ORDER: StripName[] = ["right", "left", "up", "down", "up-right", "up-left", "down-right", "down-left"];

export function HeadTurn({
  manifest,
  base,
  valueX,
  valueY,
  enabled,
}: {
  manifest: HeadTurn2DManifest;
  /** Ordner der Sequenzen, z. B. "/mascot/headturn" */
  base: string;
  valueX: MotionValue<number>;
  valueY: MotionValue<number>;
  enabled: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<Map<StripName, (ImageBitmap | null)[]>>(new Map());
  const raf = useRef(0);
  const last = useRef("");
  const size = useRef({ w: 0, h: 0 });

  // Zeichnen: Strip-Paar aus dem Winkel, Frame aus dem Betrag
  const draw = () => {
    raf.current = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { m, k0, k1, t } = gazePose(valueX.get(), valueY.get());
    const { w, h } = size.current;

    // ein Strip: nächstgelegene geladene Frames Richtung Mitte
    const plan = (k: number) => {
      const name = DIR_ORDER[k];
      const s = manifest.strips[name];
      const list = frames.current.get(name);
      if (!list) return null;
      const f = m * (s.frames - 1);
      const want0 = Math.floor(f), want1 = Math.min(s.frames - 1, want0 + 1), fr = f - want0;
      const nearest = (i: number) => {
        for (let j = i; j >= 0; j--) if (list[j]) return j;
        return -1;
      };
      const i0 = nearest(want0), i1 = nearest(want1);
      if (i0 < 0) return null;
      return { name, list, i0, i1, fr, complete: i0 === want0 && i1 === want1 };
    };
    const a = plan(k0);
    const b = t > 0.001 && k1 !== k0 ? plan(k1) : null;
    const sig = a
      ? `${a.name}:${a.i0}:${a.i1}:${a.fr.toFixed(3)}|${b ? `${b.name}:${b.i0}:${b.i1}:${b.fr.toFixed(3)}:${t.toFixed(3)}` : ""}`
      : "";
    if (!a || sig === last.current) return;
    ctx.clearRect(0, 0, w, h);
    const paint = (p: NonNullable<ReturnType<typeof plan>>, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.drawImage(p.list[p.i0]!, 0, 0, w, h);
      if (p.i1 !== p.i0 && p.i1 >= 0 && p.fr > 0.001) {
        ctx.globalAlpha = alpha * p.fr;
        ctx.drawImage(p.list[p.i1]!, 0, 0, w, h);
      }
      ctx.globalAlpha = 1;
    };
    paint(a, 1);
    if (b) paint(b, t);
    // unvollständig gezeichnet → nach dem nächsten Decode erneut
    last.current = a.complete && (!b || b.complete) ? sig : "";
  };
  const schedule = () => {
    if (!raf.current) raf.current = requestAnimationFrame(draw);
  };

  useMotionValueEvent(valueX, "change", () => {
    if (enabled) schedule();
  });
  useMotionValueEvent(valueY, "change", () => {
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

    // Passende Breite wählen, dann alle Strips nach Priorität dekodieren
    const need = size.current.w;
    const width =
      manifest.widths.slice().sort((a, b) => a - b).find((wd) => wd * manifest.crop.w >= need) ??
      Math.max(...manifest.widths);
    frames.current = new Map();
    for (const name of LOAD_ORDER) {
      const s = manifest.strips[name];
      if (s) frames.current.set(name, new Array(s.frames).fill(null));
    }
    // Von der Mitte nach außen über ALLE Strips verschränkt: nach kurzer
    // Ladezeit ist jede Richtung ein Stück weit bespielbar, nicht eine ganz.
    const queue: { name: StripName; i: number; url: string }[] = [];
    const maxFrames = Math.max(...LOAD_ORDER.map((n) => manifest.strips[n]?.frames ?? 0));
    for (let i = 0; i < maxFrames; i++) {
      for (const name of LOAD_ORDER) {
        const s = manifest.strips[name];
        if (!s || i >= s.frames) continue;
        const file = String(s.start + s.step * i).padStart(2, "0");
        const dir = s.dir ? `${s.dir}/` : "";
        queue.push({ name, i, url: `${base}/${dir}${width}/${file}.webp` });
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
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        left: `${manifest.crop.x * 100}%`,
        top: `${manifest.crop.y * 100}%`,
        width: `${manifest.crop.w * 100}%`,
        height: `${manifest.crop.h * 100}%`,
      }}
    />
  );
}
