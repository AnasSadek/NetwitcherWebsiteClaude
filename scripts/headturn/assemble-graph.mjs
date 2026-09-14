/**
 * Fügt die Strip-Manifeste der Kopf-Videobahnen zu EINEM Graph-Manifest
 * zusammen. Strips (alle mit derselben --crop-Box gebaut):
 *
 *   public/mascot/headturn/manifest.json        → "row"   (Center-Zeile, 61)
 *   public/mascot/headturn/sp-… manifest.json   → Speichen (Mitte → außen, 17)
 *
 * Der Graph ist ein Stern: alle Bahnen treffen sich nur in der frontalen
 * Mitte, wo alle Clips dieselbe Pose zeigen. (Die früheren up/down-Bögen
 * sind entfernt — ihre Mitte passte sichtbar nicht zu den Speichen-Enden.)
 *
 * → components/mascot/headturn-graph.manifest.json
 * Die Kanten des Pose-Graphen (welcher Strip welchen Knoten verbindet)
 * definiert die Komponente; hier stehen nur die Strip-Rohdaten.
 */
import fs from "node:fs";
import path from "node:path";

const PUB = path.resolve("../../public/mascot/headturn");
const OUT = path.resolve("../../components/mascot/headturn-graph.manifest.json");

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const C = read(path.join(PUB, "manifest.json"));

const strips = { row: { dir: "", frames: C.frames, center: C.center, lens: C.lens } };
for (const name of ["sp-u", "sp-d", "sp-ul", "sp-ur", "sp-dl", "sp-dr"]) {
  const m = read(path.join(PUB, name, "manifest.json"));
  for (const k of ["x", "y", "w", "h"]) {
    if (Math.abs(m.crop[k] - C.crop[k]) > 1e-6)
      throw new Error(`${name}: crop.${k} weicht ab – alle Strips mit derselben --crop bauen`);
  }
  strips[name] = { dir: name, frames: m.frames, center: m.center, lens: m.lens };
}

const out = { widths: C.widths, frame: C.frame, crop: C.crop, lensR: C.lensR, strips };
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(
  "[assemble-graph]",
  Object.entries(strips).map(([k, s]) => `${k}:${s.frames}`).join(" "),
  "→",
  OUT
);
