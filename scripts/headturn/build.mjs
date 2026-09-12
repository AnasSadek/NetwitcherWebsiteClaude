/**
 * WITCH-Kopfdrehung: Video → Frame-Sequenz für den Hero.
 *
 *   cd scripts/headturn && npm i
 *   node build.mjs --left clips/center-to-left.mp4 --right clips/center-to-right.mp4
 *   node build.mjs --sweep clips/left-to-right.mp4
 *
 * Optionen: --frames 61  --widths 1600,960  --out ../../public/mascot/headturn
 *           --crop-bottom 0.64 (Unterkante des Kopf-Crops, Anteil der Bildhöhe)
 *           --lens-bottom 0.56 (Suchbereich der Linsenerkennung endet hier)
 *           --matte-threshold 32 (Differenz zum Poster, ab der ein Pixel zum Kopf zählt)
 *           --matte-fade 0.552,0.568 (Matte blendet zwischen diesen Bildhöhen aus: Kamera-Unterkante)
 *           --matte-close 16 (Radius der Schließung, füllt Löcher in der Kopf-Matte; px @640)
 *           --threshold 60 (Bewegungsschwelle für die automatische Crop-Box)
 *           --poster (schreibt den Center-Frame als neues public/mascot/witch-wide.webp/.avif)
 *           --preview datei.png / --debug datei.png (Kontrollbilder)
 *
 * Was passiert:
 *  1. Alle Frames der Clips extrahieren (ffmpeg, verlustfrei).
 *  2. Reihenfolge links → Mitte → rechts herstellen (Hälften: links rückwärts + rechts).
 *  3. Bewegungsregion (der Kopf) automatisch bestimmen → Crop-Box.
 *  4. Frames nach zurückgelegter Bewegung gleichmäßig neu abtasten (Bogenlängen-
 *     Parametrisierung): gleiche Winkelschritte, Center-Frame exakt in der Mitte.
 *  5. Linsenmitte pro Frame erkennen (dunkler Kreis) → Kalibrierung für das Logo-Auge.
 *  6. Kopf-Crops mit weicher Kante als WebP (Alpha) in mehreren Breiten schreiben
 *     + manifest.json. Der Rest des Bildes bleibt das statische Poster.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import ffmpeg from "ffmpeg-static";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1]?.startsWith("--") || arr[i + 1] === undefined ? true : arr[i + 1]]);
    return acc;
  }, [])
);
const FRAMES = Number(args.frames ?? 61);
const WIDTHS = String(args.widths ?? "1600,960").split(",").map(Number);
const OUT = path.resolve(args.out ?? "../../public/mascot/headturn");
const POSTER = Boolean(args.poster);
const AW = 320, AH = 180; // Analyse-Auflösung

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "headturn-"));
const log = (...a) => console.log("[headturn]", ...a);

function extract(clip, name) {
  const dir = path.join(tmp, name);
  fs.mkdirSync(dir);
  execSync(`"${ffmpeg}" -hide_banner -loglevel error -i "${clip}" -vsync 0 "${dir}/f%04d.png"`);
  return fs.readdirSync(dir).filter((f) => f.endsWith(".png")).sort().map((f) => path.join(dir, f));
}

/* 1 + 2: Frames in Reihenfolge links → Mitte → rechts.
   Strip-Modus (--clip): EIN Clip, Frame 0 = frontale Mitte (Startbild),
   die Sequenz läuft von der Mitte in eine Richtung (z. B. nach oben). */
let ordered, centerIdx;
const STRIP = Boolean(args.clip);
if (args.left && args.right) {
  const L = extract(path.resolve(args.left), "left");
  const R = extract(path.resolve(args.right), "right");
  ordered = [...L.slice().reverse(), ...R.slice(1)];
  centerIdx = L.length - 1;
  log(`halves: ${L.length} left + ${R.length} right frames`);
} else if (STRIP) {
  ordered = extract(path.resolve(args.clip), "strip");
  centerIdx = 0;
  log(`strip: ${ordered.length} frames (frame 0 = center)`);
} else if (args.sweep) {
  ordered = extract(path.resolve(args.sweep), "sweep");
  centerIdx = -1; // wird unten bestimmt
  log(`sweep: ${ordered.length} frames`);
} else {
  console.error("Bitte --left/--right, --clip oder --sweep angeben.");
  process.exit(1);
}
const meta = await sharp(ordered[0]).metadata();
const FW = meta.width, FH = meta.height;
log(`frame size ${FW}x${FH}`);

const gray = async (file, w = AW, h = AH) => sharp(file).resize(w, h, { fit: "fill" }).grayscale().raw().toBuffer();
const small = [];
for (const f of ordered) small.push(await gray(f));

if (centerIdx < 0) {
  // Sweep: der Frame, der dem frontalen Referenz-Render am nächsten kommt
  const ref = await gray(path.resolve("../../public/mascot/witch-wide.webp"));
  let best = Infinity;
  small.forEach((s, i) => {
    let d = 0;
    for (let p = 0; p < s.length; p++) d += Math.abs(s[p] - ref[p]);
    if (d < best) { best = d; centerIdx = i; }
  });
  log(`center frame detected at index ${centerIdx}`);
}

/* 3: Bewegungsregion → Crop-Box (Anteile des Frames) */
const motion = new Float32Array(AW * AH);
const c = small[centerIdx];
for (const s of small) for (let p = 0; p < s.length; p++) motion[p] = Math.max(motion[p], Math.abs(s[p] - c[p]));
// Schwelle hoch genug, dass eine kleine Körperdrift (wenige Graustufen) nicht
// zählt, nur die eigentliche Kopfbewegung. Einzelne Ausreißer werden ignoriert,
// indem pro Zeile/Spalte mindestens 3 bewegte Pixel verlangt werden.
const TH = Number(args.threshold ?? 60);
const rows = new Array(AH).fill(0), cols = new Array(AW).fill(0);
for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) if (motion[y * AW + x] > TH) { rows[y]++; cols[x]++; }
const firstIdx = (arr) => arr.findIndex((v) => v >= 3), lastIdx = (arr) => arr.length - 1 - arr.slice().reverse().findIndex((v) => v >= 3);
const x0 = firstIdx(cols), x1 = lastIdx(cols), y0 = firstIdx(rows), y1 = lastIdx(rows);
const pad = 0.05;
const crop = {
  x: Math.max(0, x0 / AW - pad), y: Math.max(0, y0 / AH - pad * 1.4),
  w: 0, h: 0,
};
crop.w = Math.min(1 - crop.x, (x1 + 1) / AW + pad - crop.x);
crop.h = Math.min(1 - crop.y, (y1 + 1) / AH + pad * 1.4 - crop.y);
// Optional harte Unterkante (Anteil der Bildhöhe): hält den Crop auf dem Kopf,
// auch wenn der Clip eine leichte Körperdrift zeigt. Alles darunter bleibt Poster.
if (args["crop-bottom"]) crop.h = Math.min(crop.h, Number(args["crop-bottom"]) - crop.y);
// Feste Crop-Box (x,y,w,h als Anteile): alle Strips einer 2D-Sequenz teilen
// sich EINE Box, damit der Canvas sie ohne Umrechnung übereinanderlegen kann.
if (args.crop && typeof args.crop === "string") {
  const [cx, cy, cw, ch] = args.crop.split(",").map(Number);
  crop.x = cx; crop.y = cy; crop.w = cw; crop.h = ch;
}
log(`crop ${JSON.stringify(Object.fromEntries(Object.entries(crop).map(([k, v]) => [k, +v.toFixed(4)])))}`);
if (args.analyze) { log("analyze only – Ende."); process.exit(0); }

/* 4: Bogenlängen-Resampling, Center exakt in der Mitte */
const cropIdx = [];
for (let y = Math.floor(crop.y * AH); y < Math.ceil((crop.y + crop.h) * AH); y++)
  for (let x = Math.floor(crop.x * AW); x < Math.ceil((crop.x + crop.w) * AW); x++) cropIdx.push(y * AW + x);
const step = (a, b) => { let s = 0; for (const p of cropIdx) s += Math.abs(a[p] - b[p]); return s / cropIdx.length; };
function resample(indices, n) {
  // indices: Frame-Indizes vom Center weg; n Ausgabe-Frames (ohne Center)
  const cum = [0];
  for (let i = 1; i < indices.length; i++) cum.push(cum[i - 1] + step(small[indices[i]], small[indices[i - 1]]));
  const total = cum[cum.length - 1];
  const out = [];
  for (let k = 1; k <= n; k++) {
    const target = (total * k) / n;
    let j = cum.findIndex((v) => v >= target);
    if (j < 0) j = cum.length - 1;
    out.push(indices[j]);
  }
  return out;
}
let selected, half;
if (STRIP) {
  // Mitte → Richtung: Frame 0 ist die Mitte, danach gleichmäßige Winkelschritte
  half = 0;
  selected = [centerIdx, ...resample(Array.from({ length: ordered.length }, (_, i) => i), FRAMES - 1)];
} else {
  half = Math.floor((FRAMES - 1) / 2);
  const leftSel = resample(Array.from({ length: centerIdx + 1 }, (_, i) => centerIdx - i), half).reverse();
  const rightSel = resample(Array.from({ length: ordered.length - centerIdx }, (_, i) => centerIdx + i), half);
  selected = [...leftSel, centerIdx, ...rightSel];
}
log(`selected ${selected.length} frames, center at ${half}`);

/* 5: Linsenmitte pro Frame: größter zusammenhängender dunkler Fleck im Crop.
   (Das Linsenglas ist fast schwarz; Sucher und Schatten sind kleiner.) */
const DARK = Number(args.dark ?? 26);
function largestDarkBlob(s) {
  // Suche nur im Kopfband (oberhalb --lens-bottom), nie in Kapuzenschatten.
  const yTop = Math.floor(crop.y * AH), yBot = Math.ceil(Math.min(crop.y + crop.h, Number(args["lens-bottom"] ?? 0.56)) * AH), xL = Math.floor(crop.x * AW), xR = Math.ceil((crop.x + crop.w) * AW);
  const seen = new Uint8Array(AW * AH);
  let best = { n: 0, sx: 0, sy: 0 };
  const stack = [];
  for (let y = yTop; y < yBot; y++) for (let x = xL; x < xR; x++) {
    const p0 = y * AW + x;
    if (seen[p0] || s[p0] >= DARK) continue;
    let n = 0, sx = 0, sy = 0;
    stack.push(p0); seen[p0] = 1;
    while (stack.length) {
      const p = stack.pop(); const px = p % AW, py = (p - px) / AW;
      n++; sx += px + 0.5; sy += py + 0.5;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = px + dx, ny = py + dy;
        if (nx < xL || nx >= xR || ny < yTop || ny >= yBot) continue;
        const q = ny * AW + nx;
        if (!seen[q] && s[q] < DARK) { seen[q] = 1; stack.push(q); }
      }
    }
    if (n > best.n) best = { n, sx, sy };
  }
  return { x: best.sx / best.n / AW, y: best.sy / best.n / AH, r: Math.sqrt(best.n / Math.PI) / AW };
}
const lens = selected.map((idx) => largestDarkBlob(small[idx]));
/* 5b: Stabilisierung. KI-Clips lassen den Körper um wenige Pixel driften.
   Für jeden gewählten Frame wird der ganzzahlige Versatz gesucht, mit dem der
   Schulter-/Kapuzenbereich (unterhalb des Kopfes, außerhalb des Crops) wieder
   exakt auf dem Center-Frame liegt. Der Kopf-Crop wird um diesen Versatz
   verschoben: Körper und Naht bleiben ruhig, die Kopfdrehung bleibt erhalten. */
const SW = 640, SH = 360, RANGE = Number(args.stabilize ?? 8);
const stabImgs = [];
for (const idx of selected) stabImgs.push(await gray(ordered[idx], SW, SH));
const refImg = await gray(ordered[centerIdx], SW, SH);
const bodyIdx = [];
{
  const yA = Math.floor(Math.min(0.98, crop.y + crop.h + 0.02) * SH), yB = Math.floor(Math.min(0.98, crop.y + crop.h + 0.26) * SH);
  const xA = Math.floor((crop.x + crop.w * 0.15) * SW), xB = Math.ceil((crop.x + crop.w * 0.85) * SW);
  for (let y = yA; y < yB; y++) for (let x = xA; x < xB; x++) bodyIdx.push(y * SW + x);
}
const shifts = stabImgs.map((img) => {
  let best = { d: Infinity, dx: 0, dy: 0 };
  for (let dy = -RANGE; dy <= RANGE; dy++) for (let dx = -RANGE; dx <= RANGE; dx++) {
    let d = 0;
    for (const p of bodyIdx) {
      const px = p % SW, py = (p - px) / SW;
      d += Math.abs(img[(py + dy) * SW + (px + dx)] - refImg[p]);
    }
    if (d < best.d) best = { d, dx, dy };
  }
  return best;
});
const medN = (arr, k) => arr.map((_, i) => { const w = [arr[Math.max(0, i - 1)][k], arr[i][k], arr[Math.min(arr.length - 1, i + 1)][k]].sort((a, b) => a - b); return w[1]; });
const shX = medN(shifts, "dx"), shY = medN(shifts, "dy");
log(`stabilize: dx ${Math.min(...shX)}..${Math.max(...shX)}, dy ${Math.min(...shY)}..${Math.max(...shY)} (px @${SW})`);
// Linsenkoordinaten in das stabilisierte Bild umrechnen
lens.forEach((l, i) => { l.x -= shX[i] / SW; l.y -= shY[i] / SH; });

/* 5c: Kopf-Matte pro Frame. Nur was sich gegenüber dem Poster deutlich
   verändert (der gedrehte Kopf und die von ihm freigegebene Fläche) kommt aus
   dem Clip; feine Kanten-Splitter durch Kapuzenbewegung werden per Öffnung
   entfernt. So bleibt der Körper das Poster, selbst direkt unter dem Kopf. */
const MATTE_TH = Number(args["matte-threshold"] ?? 32);
const refStab = refImg; // Poster in 640x360
function minMax(src, w, h, r, useMax) {
  const tmp = new Uint8Array(w * h), out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let v = useMax ? 0 : 255;
    for (let k = -r; k <= r; k++) { const xx = Math.min(w - 1, Math.max(0, x + k)); const q = src[y * w + xx]; v = useMax ? Math.max(v, q) : Math.min(v, q); }
    tmp[y * w + x] = v;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let v = useMax ? 0 : 255;
    for (let k = -r; k <= r; k++) { const yy = Math.min(h - 1, Math.max(0, y + k)); const q = tmp[yy * w + x]; v = useMax ? Math.max(v, q) : Math.min(v, q); }
    out[y * w + x] = v;
  }
  return out;
}
function boxBlur(src, w, h, r) {
  const tmp = new Float32Array(w * h), out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let a = 0; for (let k = -r; k <= r; k++) a += src[y * w + Math.min(w - 1, Math.max(0, x + k))]; tmp[y * w + x] = a / (2 * r + 1); }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let a = 0; for (let k = -r; k <= r; k++) a += tmp[Math.min(h - 1, Math.max(0, y + k)) * w + x]; out[y * w + x] = Math.round(a / (2 * r + 1)); }
  return out;
}
const [fadeFromF, fadeToF] = String(args["matte-fade"] ?? "0.552,0.568").split(",").map(Number);
const fadeA = Math.round(fadeFromF * SH), fadeB = Math.round(fadeToF * SH);
const yCut = fadeB;
// Pro Frame: Differenz zum Poster → binär → Öffnung (Splitter weg)
const perFrame = stabImgs.map((img, i) => {
  const dx = shX[i], dy = shY[i];
  const bin = new Uint8Array(SW * SH);
  for (let y = 0; y < yCut; y++) for (let x = 0; x < SW; x++) {
    const sx = Math.min(SW - 1, Math.max(0, x + dx)), sy = Math.min(SH - 1, Math.max(0, y + dy));
    bin[y * SW + x] = Math.abs(img[sy * SW + sx] - refStab[y * SW + x]) > MATTE_TH ? 255 : 0;
  }
  return minMax(minMax(bin, SW, SH, 2, false), SW, SH, 2, true);
});
// Eine gemeinsame Matte für alle Frames: die Vereinigung aller Kopfpositionen.
// Innerhalb dieser Fläche zeigt der Canvas immer den Clip (dessen Hintergrund
// ist ruhig), außerhalb immer das Poster. So kann bei kleinen Winkeln kein
// Rest des frontalen Kopfes neben dem gedrehten stehen bleiben (kein Doppelbild).
const CLOSE = Number(args["matte-close"] ?? 16);
const union = new Uint8Array(SW * SH);
for (const m of perFrame) for (let p = 0; p < union.length; p++) if (m[p] > union[p]) union[p] = m[p];
const closed = minMax(minMax(union, SW, SH, CLOSE, true), SW, SH, CLOSE, false); // Löcher füllen
const grown = minMax(closed, SW, SH, 6, true); // Rand
const softU = boxBlur(boxBlur(grown, SW, SH, 3), SW, SH, 3);
for (let y = 0; y < SH; y++) {
  const f = y < fadeA ? 1 : y >= fadeB ? 0 : 1 - (y - fadeA) / (fadeB - fadeA);
  if (f < 1) for (let x = 0; x < SW; x++) softU[y * SW + x] = Math.round(softU[y * SW + x] * f);
}
const mattes = stabImgs.map(() => softU);
log(`matte coverage center/left/right: ${[half, 0, selected.length - 1].map((i) => (mattes[i].reduce((a, v) => a + v, 0) / 255 / (SW * SH) * 100).toFixed(1) + "%").join(" / ")}`);

// Glätten (gleitender Median über 3), Radius mitteln
const med3 = (arr, k) => arr.map((_, i) => { const w = [arr[Math.max(0, i - 1)][k], arr[i][k], arr[Math.min(arr.length - 1, i + 1)][k]].sort((a, b) => a - b); return w[1]; });
const lensX = med3(lens, "x"), lensY = med3(lens, "y");
const lensR = lens.reduce((a, l) => a + l.r, 0) / lens.length;
log(`lens center: ${(lensX[half] * 100).toFixed(1)}% / ${(lensY[half] * 100).toFixed(1)}%, r ${(lensR * 100).toFixed(1)}%  (left ${(lensX[0] * 100).toFixed(1)}%, right ${(lensX[lensX.length - 1] * 100).toFixed(1)}%)`);

/* 6: Export */
fs.rmSync(OUT, { recursive: true, force: true });
const px = { left: Math.round(crop.x * FW / 2) * 2, top: Math.round(crop.y * FH / 2) * 2 };
px.width = Math.min(FW - px.left, Math.round(crop.w * FW / 2) * 2);
px.height = Math.min(FH - px.top, Math.round(crop.h * FH / 2) * 2);
const FEATHER_BOTTOM = Number(args["feather-bottom"] ?? 0.14); // Anteil der Crop-Höhe
async function feather(w, h) {
  const fx = Math.round(w * 0.06), fy = Math.round(h * 0.06), fb = Math.round(h * FEATHER_BOTTOM);
  const buf = Buffer.alloc(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const ax = Math.min(1, x / fx, (w - 1 - x) / fx), ay = Math.min(1, y / fy, (h - 1 - y) / fb);
    // weiche S-Kurve statt linearer Rampe
    const a = Math.min(ax, ay), sa = a * a * (3 - 2 * a);
    buf[y * w + x] = Math.round(255 * sa);
  }
  return buf;
}
const scale = FW / SW;
const shiftedExtract = (i) => {
  const left = Math.round(px.left + shX[i] * scale), top = Math.round(px.top + shY[i] * scale);
  return { left: Math.max(0, Math.min(FW - px.width, left)), top: Math.max(0, Math.min(FH - px.height, top)), width: px.width, height: px.height };
};
for (const W of WIDTHS) {
  const dir = path.join(OUT, String(W));
  fs.mkdirSync(dir, { recursive: true });
  const cw = Math.round((px.width * W) / FW), ch = Math.round((px.height * W) / FW);
  const edge = await feather(cw, ch);
  let bytes = 0;
  for (let i = 0; i < selected.length; i++) {
    const out = path.join(dir, `${String(i).padStart(2, "0")}.webp`);
    // Matte-Ausschnitt (Poster-Koordinaten = Crop-Position ohne Versatz) hochskalieren
    const mx = Math.round(px.left / FW * SW), my = Math.round(px.top / FH * SH);
    const mw = Math.max(1, Math.round(px.width / FW * SW)), mh = Math.max(1, Math.round(px.height / FH * SH));
    const sub = Buffer.alloc(mw * mh);
    for (let y = 0; y < mh; y++) for (let x = 0; x < mw; x++) sub[y * mw + x] = mattes[i][Math.min(SH - 1, my + y) * SW + Math.min(SW - 1, mx + x)];
    const mu = await sharp(sub, { raw: { width: mw, height: mh, channels: 1 } }).resize(cw, ch, { kernel: "cubic" }).raw().toBuffer({ resolveWithObject: true });
    const muC = mu.info.channels;
    const alpha = Buffer.alloc(cw * ch);
    for (let p = 0; p < alpha.length; p++) alpha[p] = Math.round((mu.data[p * muC] * edge[p]) / 255);
    // Hinweis: kein removeAlpha() in dieser Kette, sharp würde es NACH joinChannel
    // anwenden und die Matte wieder entfernen. Die PNG-Frames sind ohnehin RGB.
    const src = await sharp(ordered[selected[i]]).extract(shiftedExtract(i)).resize(cw, ch).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const sc = src.info.channels; // 3 erwartet, aber nie annehmen
    if (src.info.width !== cw || src.info.height !== ch) throw new Error(`unerwartete Größe ${src.info.width}x${src.info.height}`);
    const rgba = Buffer.alloc(cw * ch * 4);
    for (let p = 0; p < cw * ch; p++) { const q = p * sc; rgba[p * 4] = src.data[q]; rgba[p * 4 + 1] = src.data[q + 1]; rgba[p * 4 + 2] = src.data[q + 2]; rgba[p * 4 + 3] = alpha[p]; }
    const info = await sharp(rgba, { raw: { width: cw, height: ch, channels: 4 } })
      .webp({ quality: 82, alphaQuality: 90, effort: 5 }).toFile(out);
    if (i === 0) { const m = await sharp(out).metadata(); if (!m.hasAlpha) throw new Error("Export ohne Alpha-Kanal, Matte fehlt"); }
    bytes += info.size;
  }
  log(`${W}px: ${selected.length} × ${cw}x${ch}, ${(bytes / 1024).toFixed(0)} KB total`);
}
if (POSTER) {
  const posterOut = path.resolve("../../public/mascot");
  await sharp(ordered[centerIdx]).resize(1600).webp({ quality: 80 }).toFile(path.join(posterOut, "witch-wide.webp"));
  try { await sharp(ordered[centerIdx]).resize(1600).avif({ quality: 55 }).toFile(path.join(posterOut, "witch-wide.avif")); log("poster written (webp + avif)"); }
  catch { fs.copyFileSync(path.join(posterOut, "witch-wide.webp"), path.join(posterOut, "witch-wide.avif")); log("poster written (webp; avif fallback = webp bytes)"); }
}
const manifest = {
  frames: selected.length,
  center: half,
  widths: WIDTHS,
  frame: { w: FW, h: FH },
  crop: { x: px.left / FW, y: px.top / FH, w: px.width / FW, h: px.height / FH },
  lens: lensX.map((x, i) => ({ x: +x.toFixed(4), y: +lensY[i].toFixed(4) })),
  lensR: +lensR.toFixed(4),
};
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest));
fs.writeFileSync(path.join(OUT, "README.md"), `# WITCH Kopfdrehung – Frame-Sequenz\n\nGeneriert von scripts/headturn/build.mjs. Nicht von Hand bearbeiten; bei neuem Clip neu bauen.\n`);
log("done →", OUT);
// Vorschau: Kontaktblatt der gewählten Frames (nur zur Kontrolle, nicht im Repo)
if (args.preview) {
  const tw = 240, th = Math.round((tw * px.height) / px.width);
  const tiles = await Promise.all(selected.map((idx, i) => sharp(ordered[idx]).extract(shiftedExtract(i)).resize(tw, th).png().toBuffer()));
  const cols = 8, rows = Math.ceil(tiles.length / cols);
  await sharp({ create: { width: tw * cols, height: th * rows, channels: 3, background: "#000" } })
    .composite(tiles.map((input, k) => ({ input, left: (k % cols) * tw, top: Math.floor(k / cols) * th }))).png().toFile(path.resolve(args.preview));
  log("preview →", args.preview);
}
if (args.debug) {
  // 9 Frames mit Linsenmarker (roter Kreis) zur Kontrolle der Kalibrierung
  const picks = Array.from({ length: 9 }, (_, k) => Math.round((k * (selected.length - 1)) / 8));
  const tw = 480, th = Math.round((tw * FH) / FW);
  const tiles = [];
  for (const k of picks) {
    const cx = lensX[k] * tw, cy = lensY[k] * th, r = lensR * tw;
    const svg = Buffer.from(`<svg width="${tw}" height="${th}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ff2d55" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="3" fill="#ff2d55"/></svg>`);
    tiles.push(await sharp(ordered[selected[k]]).resize(tw, th).composite([{ input: svg }]).png().toBuffer());
  }
  await sharp({ create: { width: tw * 3, height: th * 3, channels: 3, background: "#000" } })
    .composite(tiles.map((input, k) => ({ input, left: (k % 3) * tw, top: Math.floor(k / 3) * th }))).png().toFile(path.resolve(args.debug));
  log("debug →", args.debug);
  // Matte (640x360) des rechten Endframes zur Kontrolle
  await sharp(Buffer.from(mattes[selected.length - 1]), { raw: { width: SW, height: SH, channels: 1 } }).png().toFile(path.resolve(args.debug).replace(/\.png$/, "-matte.png"));
}
