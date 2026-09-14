/**
 * Fügt die Zeilen-Manifeste der 2D-Kopfdrehung zu EINEM Manifest zusammen:
 *
 *   public/mascot/headturn/manifest.json        (Center-Zeile, 61 Frames)
 *   public/mascot/headturn/up/manifest.json     (Up-Zeile)
 *   public/mascot/headturn/down/manifest.json   (Down-Zeile)
 *   → components/mascot/headturn2d.manifest.json
 *
 * Alle Zeilen müssen mit derselben --crop-Box gebaut sein.
 */
import fs from "node:fs";
import path from "node:path";

const PUB = path.resolve("../../public/mascot/headturn");
const OUT = path.resolve("../../components/mascot/headturn2d.manifest.json");

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const C = read(path.join(PUB, "manifest.json"));

const rows = { center: { dir: "", frames: C.frames, center: C.center, lens: C.lens } };
for (const name of ["up", "down"]) {
  const m = read(path.join(PUB, name, "manifest.json"));
  for (const k of ["x", "y", "w", "h"]) {
    if (Math.abs(m.crop[k] - C.crop[k]) > 1e-6)
      throw new Error(`${name}: crop.${k} weicht ab (${m.crop[k]} vs ${C.crop[k]}) – alle Zeilen mit derselben --crop bauen`);
  }
  rows[name] = { dir: name, frames: m.frames, center: m.center, lens: m.lens };
}

const out = { widths: C.widths, frame: C.frame, crop: C.crop, lensR: C.lensR, rows };
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(
  "[assemble-rows]",
  Object.entries(rows).map(([k, r]) => `${k}:${r.frames}`).join(" "),
  "→",
  OUT
);
