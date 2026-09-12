/**
 * Fügt die Einzel-Manifeste der Kopfdreh-Strips zu EINEM 2D-Manifest zusammen:
 *
 *   public/mascot/headturn/manifest.json          (horizontal, 61 Frames)
 *   public/mascot/headturn/<dir>/manifest.json    (up, down, up-left, …)
 *   → components/mascot/headturn2.manifest.json
 *
 * Der horizontale Bau liefert die Strips „left" und „right" (Frame-Dateien
 * bleiben im Wurzelordner, Nummern laufen vom Center 30 aus in beide
 * Richtungen). Alle Strips müssen mit derselben --crop-Box gebaut sein.
 */
import fs from "node:fs";
import path from "node:path";

const PUB = path.resolve("../../public/mascot/headturn");
const OUT = path.resolve("../../components/mascot/headturn2.manifest.json");
const DIRS = ["up", "down", "up-left", "up-right", "down-left", "down-right"];

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const H = read(path.join(PUB, "manifest.json"));
const c = H.center;

const strips = {
  right: { dir: "", start: c, step: 1, frames: H.frames - c, lens: H.lens.slice(c) },
  left: { dir: "", start: c, step: -1, frames: c + 1, lens: H.lens.slice(0, c + 1).reverse() },
};

for (const dir of DIRS) {
  const m = read(path.join(PUB, dir, "manifest.json"));
  for (const k of ["x", "y", "w", "h"]) {
    if (Math.abs(m.crop[k] - H.crop[k]) > 1e-6)
      throw new Error(`${dir}: crop.${k} weicht ab (${m.crop[k]} vs ${H.crop[k]}) – alle Strips mit derselben --crop bauen`);
  }
  if (m.center !== 0) throw new Error(`${dir}: center ${m.center}, erwartet 0 (Strip-Modus)`);
  // Frame 0 ist konstruktionsbedingt dieselbe frontale Pose wie das Center
  // des Horizontal-Strips: Linse dort vereinheitlichen, damit das Auge beim
  // Strip-Wechsel nahe der Mitte nicht um Detektions-Rauschen springt.
  const lens = [{ ...H.lens[c] }, ...m.lens.slice(1)];
  strips[dir] = { dir, start: 0, step: 1, frames: m.frames, lens };
}

const out = { widths: H.widths, frame: H.frame, crop: H.crop, lensR: H.lensR, strips };
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(
  "[assemble]",
  Object.entries(strips).map(([k, s]) => `${k}:${s.frames}`).join(" "),
  "→",
  OUT
);
