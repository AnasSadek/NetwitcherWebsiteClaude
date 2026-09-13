/**
 * Kopf-only-Guard: schneidet aus JEDEM gebauten Frame alles weg, was nicht
 * zur Kamera gehört — Kapuzen-/Schulter-/Brust-Pixel der Footage, die der
 * Diff-Matte-Bau zwangsläufig mitnimmt (die Footage-Kapuze bewegt sich in
 * den generierten Clips mit dem Kopf). Ohne den Guard „verformen" diese
 * Pixel beim Posenwechsel sichtbar den statischen Körper darunter.
 *
 * Der Guard ist rein geometrisch und pro Frame:
 *   - Seitlicher Korridor: außerhalb x ∈ [XL, XR] wird nichts gezeichnet.
 *   - Untere Kante: unterhalb der Kamera-Unterkante wird nichts gezeichnet.
 *     Sie besteht aus der Gehäuse-Linie (bot_box) und der tieferen
 *     Objektiv-Ausbuchtung (bot_lens) um die Linsenmitte des Frames
 *     (lensX aus dem Manifest — folgt dem Kopf, auch diagonal).
 *   - Beide Enden pro Strip von der frontalen Geometrie zur End-Pose
 *     linear interpoliert; alle Kanten weich gefedert.
 *
 * Werte kalibriert an Gitter-Overlays der End-Frames (Voll-Bild-Anteile).
 * Nach jedem Neubau der Strips (build.mjs) erneut ausführen:
 *   node head-only-guard.mjs
 * Idempotent: erneutes Anwenden ändert praktisch nichts mehr.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUB = path.resolve("../../public/mascot/headturn");

// Frontale Kamera-Unterkanten (Frame 0 der Speichen / Mitte der Zeile)
const FRONT = { box: 0.528, lens: 0.565 };
// End-Posen je Strip (letzter Frame): Gehäuse-Linie / Objektiv-Ausbuchtung
const END = {
  row: { box: 0.528, lens: 0.545 }, // volle Drehung: Ring etwas höher
  "sp-u": { box: 0.515, lens: 0.515 },
  "sp-ul": { box: 0.53, lens: 0.53 },
  "sp-ur": { box: 0.53, lens: 0.53 },
  "sp-d": { box: 0.593, lens: 0.625 },
  "sp-dl": { box: 0.535, lens: 0.558 },
  "sp-dr": { box: 0.54, lens: 0.57 },
};
const XL = 0.293, XR = 0.695; // seitlicher Korridor (Voll-Bild-x)
const BULGE = 0.078; // halbe Breite der Objektiv-Ausbuchtung (Voll-Bild-x)

const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

async function guardStrip(name, dir) {
  const m = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json")));
  const { crop } = m;
  for (const width of m.widths) {
    for (let i = 0; i < m.frames; i++) {
      const file = path.join(dir, String(width), String(i).padStart(2, "0") + ".webp");
      const img = sharp(file);
      const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const W = info.width, H = info.height;
      // Posen-Fortschritt: Speichen 0→1 über den Strip, Zeile von der Mitte aus
      const t = name === "row" ? Math.abs(i - m.center) / m.center : i / (m.frames - 1);
      const botBox = FRONT.box + (END[name].box - FRONT.box) * t;
      const botLens = FRONT.lens + (END[name].lens - FRONT.lens) * t;
      const lensX = m.lens[i].x;
      const fx = (px) => crop.x + ((px + 0.5) / W) * crop.w;
      const fy = (py) => crop.y + ((py + 0.5) / H) * crop.h;
      // Feder-Breiten in Voll-Bild-Anteilen (10–14 px auf 1600×900-Basis)
      const fY = 10 / 900, fX = 12 / 1600, fB = 14 / 1600;
      for (let py = 0; py < H; py++) {
        const y = fy(py);
        for (let px = 0; px < W; px++) {
          const ai = (py * W + px) * 4 + 3;
          if (data[ai] === 0) continue;
          const x = fx(px);
          // seitlicher Korridor
          let g = smooth((x - XL) / fX) * smooth((XR - x) / fX);
          // untere Kante: Gehäuse-Linie ↔ Objektiv-Ausbuchtung, weich gemischt
          const w = smooth((BULGE + fB - Math.abs(x - lensX)) / fB);
          const bot = botBox * (1 - w) + Math.max(botBox, botLens) * w;
          g *= smooth((bot - y) / fY);
          if (g < 1) data[ai] = Math.round(data[ai] * g);
        }
      }
      await sharp(data, { raw: { width: W, height: H, channels: 4 } })
        .webp({ quality: 82, alphaQuality: 90 })
        .toFile(file + ".tmp");
      fs.renameSync(file + ".tmp", file);
    }
  }
  console.log(`[guard] ${name}: ${m.frames} Frames × ${m.widths.length} Breiten`);
}

await guardStrip("row", PUB);
for (const name of ["sp-u", "sp-d", "sp-ul", "sp-ur", "sp-dl", "sp-dr"]) {
  await guardStrip(name, path.join(PUB, name));
}
console.log("[guard] fertig — Frames enthalten nur noch die Kamera");
