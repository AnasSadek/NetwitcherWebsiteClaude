/**
 * Zerlegt das gelieferte Maskottchen-Bild (mascot-src.webp, 1254×1254,
 * echtes Alpha) in zwei EIGENSTÄNDIGE Ebenen mit gemeinsamem x-Raster:
 *
 *   witch-head.webp  – Kamera-Kopf  (Zeilen 0..634, Inhalt y 49..629)
 *   witch-torso.webp – Hoodie-Körper (Zeilen 634..1254, Inhalt ab y 641)
 *
 * Beide Slices behalten die volle Quellbreite (transparentes Padding),
 * dadurch stimmen Kopf und Körper horizontal automatisch überein und der
 * Kopf hat rundum Luft (Overscan) — er kann sich bewegen, ohne je
 * beschnitten zu werden. Der Design-Spalt der Quelle (11 px) ergibt bei
 * der Render-Größe im Hero ≈ 5 px sichtbaren Abstand.
 *
 *   node slice-mascot.mjs
 */
import sharp from "sharp";

const SRC = "mascot-src.webp";
const CUT = 634; // Mitte des Design-Spalts (Kopf-Inhalt endet 629, Körper beginnt 641)

const meta = await sharp(SRC).metadata();
const W = meta.width, H = meta.height;

await sharp(SRC)
  .extract({ left: 0, top: 0, width: W, height: CUT })
  .webp({ quality: 92, alphaQuality: 95 })
  .toFile("../../public/mascot/witch-head.webp");

await sharp(SRC)
  .extract({ left: 0, top: CUT, width: W, height: H - CUT })
  .webp({ quality: 92, alphaQuality: 95 })
  .toFile("../../public/mascot/witch-torso.webp");

console.log(`[slice] head ${W}×${CUT}, torso ${W}×${H - CUT} → public/mascot/`);
