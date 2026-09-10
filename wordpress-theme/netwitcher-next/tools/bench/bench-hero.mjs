/**
 * Hero interaction benchmark for one URL.
 * Measures: transfer (bytes, requests, JS bytes), load timings, HeadTurn frame
 * loading, animation FPS + long frames during fast mouse movement, input→
 * visual latency (pointermove → eye transform change), and mobile behaviour.
 */
import { chromium, devices } from "playwright-core";
const [,, url, label = "site", mode = "desktop"] = process.argv;
const exe = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const b = await chromium.launch({ executablePath: exe, args: ["--no-sandbox", "--enable-gpu-rasterization", "--ignore-gpu-blocklist"] });
const ctx = await b.newContext(mode === "mobile" ? { ...devices["Pixel 7"] } : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const reqs = [];
p.on("response", async (r) => {
  try {
    const h = r.headers();
    const buf = await r.body().catch(() => null);
    reqs.push({ url: r.url(), type: r.request().resourceType(), size: buf ? buf.length : 0, enc: h["content-encoding"] || "" });
  } catch {}
});
const t0 = Date.now();
await p.goto(url, { waitUntil: "load" });
const loadMs = Date.now() - t0;
await p.waitForLoadState("networkidle");
const nav = await p.evaluate(() => {
  const n = performance.getEntriesByType("navigation")[0];
  const paint = Object.fromEntries(performance.getEntriesByType("paint").map((e) => [e.name, Math.round(e.startTime)]));
  return { ttfb: Math.round(n.responseStart), dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), fcp: paint["first-contentful-paint"], transfer: Math.round(n.transferSize), domNodes: document.getElementsByTagName("*").length };
});
const sum = (f) => reqs.filter(f).reduce((a, r) => a + r.size, 0);
const byType = {};
for (const r of reqs) byType[r.type] = (byType[r.type] || 0) + r.size;
const initial = { requests: reqs.length, bytes: reqs.reduce((a, r) => a + r.size, 0), js: sum((r) => r.type === "script"), css: sum((r) => r.type === "stylesheet"), img: sum((r) => r.type === "image"), font: sum((r) => r.type === "font"), doc: sum((r) => r.type === "document"), headturnFrames: reqs.filter((r) => /headturn\/\d+\/\d+\.webp/.test(r.url)).length, headturnBytes: sum((r) => /headturn\/\d+\/\d+\.webp/.test(r.url)) };

let motion = null;
if (mode === "desktop") {
  // wake the character + let head-turn frames load
  await p.mouse.move(700, 450);
  await p.waitForTimeout(2500);
  const framesAfterIdle = reqs.filter((r) => /headturn\/\d+\/\d+\.webp/.test(r.url)).length;
  // fast mouse sweep for 4 s while sampling rAF
  const sampler = p.evaluate(() => new Promise((res) => {
    const eye = document.querySelector('[data-witch="eye"]');
    const dts = []; const changes = []; let last = performance.now(); let lastT = eye ? eye.style.transform : ""; let lastChange = performance.now();
    const loop = (now) => { dts.push(now - last); last = now; if (eye && eye.style.transform !== lastT) { changes.push(now - lastChange); lastChange = now; lastT = eye.style.transform; } if (now - start < 4000) requestAnimationFrame(loop); else res({ dts, changes }); };
    const start = performance.now(); requestAnimationFrame(loop);
  }));
  const tStart = Date.now();
  let i = 0;
  while (Date.now() - tStart < 3900) {
    const x = 200 + (Math.sin(i / 7) * 0.5 + 0.5) * 1000, y = 150 + (Math.cos(i / 5) * 0.5 + 0.5) * 600;
    await p.mouse.move(x, y, { steps: 3 });
    i++;
  }
  const { dts, changes } = await sampler;
  dts.shift();
  const fps = 1000 / (dts.reduce((a, b) => a + b, 0) / dts.length);
  const long = dts.filter((d) => d > 20).length, veryLong = dts.filter((d) => d > 34).length;
  const p95 = dts.slice().sort((a, b) => a - b)[Math.floor(dts.length * 0.95)];
  const maxDt = Math.max(...dts);
  // input latency: pointermove at t → first eye transform change after t
  const lat = [];
  for (let k = 0; k < 8; k++) {
    const tx = 300 + k * 120, ty = 300 + (k % 2) * 200;
    const t = await p.evaluate(() => new Promise((res) => { const eye = document.querySelector('[data-witch="eye"]'); const base = eye.style.transform; const t0 = performance.now(); const chk = (now) => { if (eye.style.transform !== base) res(now - t0); else if (now - t0 < 500) requestAnimationFrame(chk); else res(null); }; window.__lat = () => requestAnimationFrame(chk); res(0); }));
    await p.evaluate(() => window.__lat());
    await p.mouse.move(tx, ty);
    await p.waitForTimeout(250);
    lat.push(await p.evaluate(() => new Promise((res) => { const eye = document.querySelector('[data-witch="eye"]'); const base = eye.style.transform; const t0 = performance.now(); const chk = (now) => { if (eye.style.transform !== base) res(Math.round(now - t0)); else if (now - t0 < 400) requestAnimationFrame(chk); else res(null); }; requestAnimationFrame(chk); window.__go = true; })));
  }
  const canvas = await p.evaluate(() => { const c = document.querySelector('canvas'); return c ? { hidden: c.hidden, w: c.width, h: c.height, visible: getComputedStyle(c).display !== "none" } : null; });
  const framesAfterSweep = reqs.filter((r) => /headturn\/\d+\/\d+\.webp/.test(r.url)).length;
  motion = { fps: +fps.toFixed(1), frames: dts.length, longFrames: long, veryLongFrames: veryLong, p95FrameMs: +p95.toFixed(1), maxFrameMs: +maxDt.toFixed(1), eyeUpdatesPerSec: +(changes.length / 4).toFixed(1), canvas, headturnFramesLoaded: framesAfterSweep, framesAfterIdle };
} else {
  await p.touchscreen.tap(200, 500);
  await p.evaluate(() => scrollTo({ top: 300, behavior: "instant" }));
  await p.waitForTimeout(1500);
  const sampler = await p.evaluate(() => new Promise((res) => { const dts = []; let last = performance.now(); const start = last; const loop = (now) => { dts.push(now - last); last = now; if (now - start < 2500) requestAnimationFrame(loop); else res(dts); }; requestAnimationFrame(loop); }));
  sampler.shift();
  motion = { fps: +(1000 / (sampler.reduce((a, b) => a + b, 0) / sampler.length)).toFixed(1), longFrames: sampler.filter((d) => d > 20).length, headturnFramesLoaded: reqs.filter((r) => /headturn\/\d+\/\d+\.webp/.test(r.url)).length, canvasPresent: await p.evaluate(() => !!document.querySelector("canvas:not([hidden])")) };
}
const out = { label, url, mode, loadMs, nav, initial, byType, motion };
console.log(JSON.stringify(out, null, 1));
await b.close();
