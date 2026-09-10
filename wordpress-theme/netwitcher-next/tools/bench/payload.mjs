/** Static payload comparison per page: HTML + JS + CSS + fonts + images, raw and gzip (what the browser actually transfers). */
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";
const pages = ["/", "/portfolio/", "/portfolio/frida-eu/", "/leistungen/webdesign-ecommerce/", "/kontakt/", "/blog/"];
const sites = { wp: "http://127.0.0.1:8081", next: "http://127.0.0.1:3100" };
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const out = [];
for (const page of pages) for (const [site, base] of Object.entries(sites)) {
  const ctx = await b.newContext({ viewport: { width: 1366, height: 768 } });
  const p = await ctx.newPage();
  await p.goto(base + page, { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const res = performance.getEntriesByType("resource");
    const all = [{ name: nav.name, type: "document", t: nav.transferSize, e: nav.encodedBodySize, d: nav.decodedBodySize }, ...res.map((x) => ({ name: x.name, type: x.initiatorType, t: x.transferSize, e: x.encodedBodySize, d: x.decodedBodySize }))];
    const cls = (x) => /headturn\/\d+\//.test(x.name) ? "headturn" : /\.(js|mjs)(\?|$)/.test(x.name) ? "js" : /\.css(\?|$)/.test(x.name) ? "css" : /\.(woff2?|ttf)(\?|$)/.test(x.name) ? "font" : /\.(avif|webp|png|jpe?g|svg)(\?|$)/.test(x.name) ? "image" : x.type === "document" ? "html" : "other";
    const sum = {};
    for (const x of all) { const k = cls(x); sum[k] = sum[k] || { transfer: 0, decoded: 0, n: 0 }; sum[k].transfer += x.t; sum[k].decoded += x.d; sum[k].n++; }
    const total = all.reduce((a, x) => a + x.t, 0);
    const initial = all.filter((x) => cls(x) !== "headturn").reduce((a, x) => a + x.t, 0);
    return { requests: all.length, totalTransfer: total, initialTransfer: initial, sum, domNodes: document.getElementsByTagName("*").length, htmlDecoded: nav.decodedBodySize };
  });
  out.push({ page, site, ...r });
  console.log(page, site, "req", r.requests, "transfer", (r.totalTransfer / 1024).toFixed(0) + "kB", "initial(w/o headturn)", (r.initialTransfer / 1024).toFixed(0) + "kB", "js", ((r.sum.js?.transfer || 0) / 1024).toFixed(0) + "kB", "css", ((r.sum.css?.transfer || 0) / 1024).toFixed(0) + "kB", "html", ((r.sum.html?.transfer || 0) / 1024).toFixed(0) + "kB", "dom", r.domNodes);
  await ctx.close();
}
writeFileSync("../bench/payload.json", JSON.stringify(out, null, 1));
await b.close();
