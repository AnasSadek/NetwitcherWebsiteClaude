/**
 * Erzeugt charakterfreie Bühnen-Hintergründe aus den alten Postern:
 * die Figur (samt Bodenschatten) wird maskiert und per progressiver
 * normalisierter Faltung aufgefüllt (grob → fein; einmal gefüllte Pixel
 * gelten fortan als bekannt) — der weiche Verlaufs-/Glow-Hintergrund
 * bleibt erhalten, die Figur verschwindet.
 *
 *   backdrop-wide.webp ← witch-wide.webp (16:9; Portrait-Layouts
 *   beschneiden dieselbe Datei per object-cover mittig)
 *
 *   node make-backdrop.mjs
 */
import sharp from "sharp";

async function inpaint(src, out, box) {
  const img = sharp(src);
  const { width: W, height: H } = await img.metadata();
  const rgb = await img.removeAlpha().raw().toBuffer();
  const inBox = Buffer.alloc(W * H); // 1 = Figur (aufzufüllen)
  const x0 = Math.round(box.x0 * W), x1 = Math.round(box.x1 * W);
  const y0 = Math.round(box.y0 * H), y1 = Math.round(box.y1 * H);
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) inBox[y * W + x] = 1;

  const filled = Buffer.from(rgb);
  const known = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) known[i] = inBox[i] ? 0 : 1;

  for (const sigma of [40, 40, 40, 25, 25, 15]) {
    const pre = Buffer.alloc(W * H * 3), wgt = Buffer.alloc(W * H);
    for (let i = 0; i < W * H; i++) {
      if (!known[i]) continue;
      wgt[i] = 255;
      for (let c = 0; c < 3; c++) pre[i * 3 + c] = filled[i * 3 + c];
    }
    const bp = await sharp(pre, { raw: { width: W, height: H, channels: 3 } }).blur(sigma).raw().toBuffer({ resolveWithObject: true });
    const bw = await sharp(wgt, { raw: { width: W, height: H, channels: 1 } }).blur(sigma).raw().toBuffer({ resolveWithObject: true });
    const bpc = bp.info.channels, bwc = bw.info.channels;
    for (let i = 0; i < W * H; i++) {
      if (known[i]) continue;
      const wv = bw.data[i * bwc] / 255;
      if (wv < 0.02) continue;
      for (let c = 0; c < 3; c++) filled[i * 3 + c] = Math.min(255, Math.round(bp.data[i * bpc + c] / wv));
      known[i] = 1;
    }
  }
  // Innenbereich zusätzlich glätten (keine Reststrukturen)
  const smooth = await sharp(filled, { raw: { width: W, height: H, channels: 3 } }).blur(18).raw().toBuffer({ resolveWithObject: true });
  const mBlur = await sharp(Buffer.from(inBox.map((v) => v * 255)), { raw: { width: W, height: H, channels: 1 } }).blur(24).raw().toBuffer({ resolveWithObject: true });
  const outBuf = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i++) {
    const a = mBlur.data[i * mBlur.info.channels] / 255;
    for (let c = 0; c < 3; c++)
      outBuf[i * 3 + c] = Math.round((a * smooth.data[i * smooth.info.channels + c] + (1 - a) * rgb[i * 3 + c]));
  }
  await sharp(outBuf, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 84 }).toFile(out);
  console.log(`[backdrop] ${out} (${W}×${H})`);
}

await inpaint("../../public/mascot/witch-wide.webp", "../../public/mascot/backdrop-wide.webp",
  { x0: 0.24, x1: 0.76, y0: 0.02, y1: 0.99 });
