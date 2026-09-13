/**
 * Baut den „kopflosen Körper" (public/mascot/witch-body.webp) aus
 *
 *   plate-src.webp   – KI-generierte kopflose Variante des Posters
 *                      (Kapuze oben natürlich geschlossen/beschattet)
 *   witch-wide.webp  – das Original-Poster (1600×900)
 *
 * Außerhalb der Kopf-Region bleibt das Ergebnis pixelidentisch mit dem
 * Poster. Die Untergrenze der Ersetzung ist KEINE gerade Linie, sondern
 * eine per dynamischer Programmierung gesuchte Naht: sie verläuft dort,
 * wo sich Poster und Platte am ähnlichsten sind (unterhalb des Kopfs,
 * durch Kapuzen-/Brust-Fleece), damit kein Ton- oder Struktursprung
 * sichtbar wird. So wirkt der offene Kragen gestaltet statt montiert.
 *
 *   node make-plate.mjs
 */
import sharp from "sharp";

const W = 1600, H = 900;
const post = await sharp("../../public/mascot/witch-wide.webp")
  .resize(W, H, { fit: "fill" }).removeAlpha().raw().toBuffer();
const plate = await sharp("plate-src.webp")
  .resize(W, H, { fit: "fill" }).removeAlpha().raw().toBuffer();

// ---------- Kosten (Poster-vs-Platte-Abweichung, geglättet) ----------
const dbuf = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H * 3; i++) dbuf[i] = Math.min(255, Math.abs(post[i] - plate[i]) * 3);
const costR = await sharp(dbuf, { raw: { width: W, height: H, channels: 3 } })
  .blur(4).grayscale().raw().toBuffer({ resolveWithObject: true });
const cost = costR.data, cch = costR.info.channels;

// ---------- Unterkante des Poster-Kopfs je Spalte (muss ersetzt werden) ----------
const x0 = Math.round(0.28 * W), x1 = Math.round(0.72 * W);
const yLo = Math.round(0.44 * H), yHi = Math.round(0.68 * H);
const headBot = new Int32Array(W).fill(yLo);
for (let x = x0; x < x1; x++) {
  let last = yLo;
  for (let y = Math.round(0.30 * H); y < Math.round(0.62 * H); y++) {
    const p = (y * W + x) * 3;
    const dd = Math.abs(post[p] - plate[p]) + Math.abs(post[p + 1] - plate[p + 1]) + Math.abs(post[p + 2] - plate[p + 2]);
    if (dd > 150) last = y;
  }
  headBot[x] = Math.max(yLo, Math.min(yHi - 4, last + 8));
}
for (let it = 0; it < 40; it++)
  for (let x = x0 + 1; x < x1 - 1; x++)
    headBot[x] = Math.max(headBot[x], Math.round((headBot[x - 1] + headBot[x + 1]) / 2));

// ---------- Naht: minimale Abweichung, |Δy| ≤ 2, unterhalb des Kopfs ----------
const NY = yHi - yLo, INF = 1e15;
const dp = new Float64Array((x1 - x0) * NY).fill(INF);
const par = new Int32Array((x1 - x0) * NY).fill(-1);
const id = (x, y) => (x - x0) * NY + (y - yLo);
for (let y = headBot[x0]; y < yHi; y++) dp[id(x0, y)] = cost[(y * W + x0) * cch];
for (let x = x0 + 1; x < x1; x++)
  for (let y = headBot[x]; y < yHi; y++) {
    let best = INF, bp = -1;
    for (let py = Math.max(headBot[x - 1], y - 2); py <= Math.min(yHi - 1, y + 2); py++) {
      const v = dp[id(x - 1, py)] + Math.abs(py - y) * 0.5;
      if (v < best) { best = v; bp = py; }
    }
    dp[id(x, y)] = best + cost[(y * W + x) * cch];
    par[id(x, y)] = bp;
  }
let ey = headBot[x1 - 1], bv = INF;
for (let y = headBot[x1 - 1]; y < yHi; y++) { const v = dp[id(x1 - 1, y)]; if (v < bv) { bv = v; ey = y; } }
const seam = new Int32Array(W);
for (let x = x1 - 1, y = ey; x >= x0; x--) { seam[x] = y; const p2 = par[id(x, y)]; if (p2 >= 0) y = p2; }
for (let x = 0; x < x0; x++) seam[x] = seam[x0];
for (let x = x1; x < W; x++) seam[x] = seam[x1 - 1];

// ---------- Maske über der Naht (weich) + Komposit ----------
const F = 12, xF = 40, yTop = Math.round(0.03 * H);
const m = Buffer.alloc(W * H);
const mx0 = Math.round(0.27 * W), mx1 = Math.round(0.715 * W);
for (let x = 0; x < W; x++) {
  let ex = 0;
  if (x >= mx0 + xF && x <= mx1 - xF) ex = 1;
  else if (x > mx0 - xF && x < mx0 + xF) ex = (x - (mx0 - xF)) / (2 * xF);
  else if (x > mx1 - xF && x < mx1 + xF) ex = ((mx1 + xF) - x) / (2 * xF);
  if (ex <= 0) continue;
  const sy = seam[x];
  for (let y = yTop; y < H; y++) {
    let vy;
    if (y <= sy - F) vy = 1; else if (y >= sy + F) vy = 0; else vy = (sy + F - y) / (2 * F);
    if (y < yTop + 20) vy *= (y - yTop) / 20;
    const v = Math.round(255 * vy * ex);
    if (v > m[y * W + x]) m[y * W + x] = v;
  }
}
const maskR = await sharp(m, { raw: { width: W, height: H, channels: 1 } })
  .blur(3).raw().toBuffer({ resolveWithObject: true });
const mask = maskR.data, mch = maskR.info.channels;
const out = Buffer.alloc(W * H * 4);
for (let i = 0, p3 = 0, p4 = 0; i < W * H; i++, p3 += 3, p4 += 4) {
  const a = mask[i * mch] / 255;
  for (let c = 0; c < 3; c++) out[p4 + c] = Math.round(plate[p3 + c] * a + post[p3 + c] * (1 - a));
  out[p4 + 3] = 255;
}
await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .webp({ quality: 86 }).toFile("../../public/mascot/witch-body.webp");
console.log("[make-plate] → public/mascot/witch-body.webp");
