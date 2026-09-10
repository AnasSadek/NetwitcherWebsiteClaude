/**
 * Cross-browser × viewport visual comparison WP vs Next.
 * node xbrowser.mjs <pagesCsv> <browsersCsv> <viewportsCsv>
 * For each combination: screenshot both sites (after instant-scrolling through
 * the page), pixelmatch diff, console/page errors, hero smoke test on desktop.
 * Output: ../bench/shots/<browser>-<vp>-<page>-{wp,next,diff}.png + ../bench/xbrowser.json
 */
import { chromium, firefox, webkit } from "playwright-core";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
const S = new URL("../", import.meta.url).pathname;
const [,, pagesCsv = "/", browsersCsv = "chromium,firefox,webkit", vpsCsv = "desktop-xl,laptop,tablet,mobile"] = process.argv;
const VP = { "desktop-xl": { width: 1920, height: 1080 }, laptop: { width: 1366, height: 768 }, tablet: { width: 820, height: 1180, touch: true }, mobile: { width: 390, height: 844, touch: true } };
const SITES = { wp: "http://127.0.0.1:8080", next: "http://127.0.0.1:3100" };
const launch = {
  chromium: () => chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] }),
  firefox: () => firefox.launch({ executablePath: S + "browsers/firefox-1490/firefox/firefox" }),
  webkit: () => webkit.launch({ executablePath: S + "browsers/webkit-2203/pw_run.sh" }),
};
mkdirSync(S + "bench/shots", { recursive: true });
const results = [];
for (const bname of browsersCsv.split(",")) {
  const browser = await launch[bname]();
  for (const vpName of vpsCsv.split(",")) {
    const vp = VP[vpName];
    for (const page of pagesCsv.split(",")) {
      const shots = {};
      const row = { browser: bname, viewport: vpName, page, errors: {}, hero: {} };
      for (const [site, base] of Object.entries(SITES)) {
        const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: !!vp.touch, isMobile: !!vp.touch && bname !== "firefox", deviceScaleFactor: 1, reducedMotion: "no-preference" });
        const p = await ctx.newPage();
        const errs = [];
        p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
        p.on("console", (m) => m.type() === "error" && errs.push("console: " + m.text().slice(0, 160)));
        p.on("requestfailed", (r) => errs.push("reqfail: " + r.url().slice(-80)));
        try {
          await p.goto(base + page, { waitUntil: "networkidle", timeout: 45000 });
          // freeze CSS animations for a stable diff (float, strip, pulse) – same on both sites
          await p.addStyleTag({ content: "*,*::before,*::after{animation:none!important}" });
          const total = await p.evaluate(() => document.documentElement.scrollHeight);
          for (let y = 0; y < total; y += Math.round(vp.height * 0.7)) { await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y); await p.waitForTimeout(90); }
          await p.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
          if (!vp.touch) { await p.mouse.move(Math.round(vp.width * 0.5), Math.round(vp.height * 0.45)); }
          await p.waitForTimeout(1600);
          row.heroRect = row.heroRect || await p.evaluate(() => { const h = document.querySelector('.witch-stage')?.closest('section'); if (!h) return null; const r = h.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; });
          if (page === "/" && vp.touch) {
            row.hero[site] = { canvas: await p.evaluate(() => !!document.querySelector("canvas:not([hidden])")), headturnReq: await p.evaluate(() => performance.getEntriesByType("resource").filter((e) => /headturn\/\d+\//.test(e.name)).length) };
          }
          if (page === "/" && !vp.touch) {
            const ctx2 = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
            const p2 = await ctx2.newPage();
            await p2.goto(base + page, { waitUntil: "networkidle", timeout: 45000 });
            await p2.waitForTimeout(800);
            const before = await p2.evaluate(() => document.querySelector('[data-witch="eye"]')?.style.transform || "");
            await p2.mouse.move(vp.width * 0.2, vp.height * 0.3); await p2.waitForTimeout(150);
            await p2.mouse.move(vp.width * 0.8, vp.height * 0.7); await p2.waitForTimeout(400);
            const after = await p2.evaluate(() => document.querySelector('[data-witch="eye"]')?.style.transform || "");
            const canvas = await p2.evaluate(() => { const c = document.querySelector("canvas"); return c ? { w: c.width, h: c.height, hidden: c.hidden } : null; });
            const frames = await p2.evaluate(() => performance.getEntriesByType("resource").filter((e) => /headturn\/\d+\//.test(e.name)).length);
            row.hero[site] = { reacts: before !== after && after !== "", canvas, headturnReq: frames };
            await ctx2.close();
          }
          const file = `${S}bench/shots/${bname}-${vpName}-${page.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "_") || "home"}-${site}.png`;
          await p.screenshot({ path: file, fullPage: true });
          shots[site] = file;
        } catch (e) { errs.push("FAILED: " + e.message.slice(0, 200)); }
        row.errors[site] = errs;
        await ctx.close();
      }
      if (shots.wp && shots.next) {
        const a = PNG.sync.read(readFileSync(shots.wp)), b = PNG.sync.read(readFileSync(shots.next));
        const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height);
        const crop = (img) => { const o = new PNG({ width: w, height: h }); PNG.bitblt(img, o, 0, 0, w, h, 0, 0); return o; };
        const ca = crop(a), cb = crop(b), diff = new PNG({ width: w, height: h });
        const n = pixelmatch(ca.data, cb.data, diff.data, w, h, { threshold: 0.12 });
        writeFileSync(shots.wp.replace(/-wp\.png$/, "-diff.png"), PNG.sync.write(diff));
        row.diff = { heightWp: a.height, heightNext: b.height, diffPixels: n, diffPct: +((n / (w * h)) * 100).toFixed(2) };
        // second number: everything except the (continuously animated) hero stage
        if (row.heroRect) {
          const R = row.heroRect; let outside = 0;
          for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; if (diff.data[i] > 200 && diff.data[i + 1] < 100 && !(x >= R.x && x < R.x + R.w && y >= R.y && y < R.y + R.h)) outside++; }
          row.diff.diffPixelsOutsideHero = outside; row.diff.diffPctOutsideHero = +((outside / (w * h - R.w * R.h)) * 100).toFixed(3);
        }
      }
      results.push(row);
      console.log(JSON.stringify(row));
    }
  }
  await browser.close();
}
writeFileSync(S + "bench/xbrowser-" + Date.now() + ".json", JSON.stringify(results, null, 1));
