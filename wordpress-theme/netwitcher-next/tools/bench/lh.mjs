/** Lighthouse runner: node lh.mjs <url> <label> <desktop|mobile> [runs] → median JSON to ../bench/lh-<label>-<mode>.json */
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { writeFileSync } from "node:fs";
const [,, url, label, mode = "mobile", runsArg = "3"] = process.argv;
const runs = +runsArg;
const chrome = await chromeLauncher.launch({ chromePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"] });
const results = [];
for (let i = 0; i < runs; i++) {
  const r = await lighthouse(url, { port: chrome.port, output: "json", logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"], formFactor: mode, screenEmulation: mode === "desktop" ? { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false } : { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false }, throttling: mode === "desktop" ? { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } : { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 }, throttlingMethod: "simulate" });
  const a = r.lhr.audits, c = r.lhr.categories;
  results.push({
    perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100), bp: Math.round(c["best-practices"].score * 100), seo: Math.round(c.seo.score * 100),
    fcp: Math.round(a["first-contentful-paint"].numericValue), lcp: Math.round(a["largest-contentful-paint"].numericValue), tbt: Math.round(a["total-blocking-time"].numericValue), cls: +a["cumulative-layout-shift"].numericValue.toFixed(3), si: Math.round(a["speed-index"].numericValue), tti: Math.round(a["interactive"].numericValue),
    bytes: Math.round(a["total-byte-weight"].numericValue), jsBytes: Math.round((a["network-requests"].details?.items || []).filter((x) => x.resourceType === "Script").reduce((s, x) => s + (x.transferSize || 0), 0)), requests: (a["network-requests"].details?.items || []).length, unusedJs: Math.round(a["unused-javascript"]?.details?.overallSavingsBytes || 0), mainThread: Math.round(a["mainthread-work-breakdown"].numericValue), bootup: Math.round(a["bootup-time"].numericValue),
  });
}
await chrome.kill();
const med = (k) => { const v = results.map((r) => r[k]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
const out = { url, label, mode, runs, median: Object.fromEntries(Object.keys(results[0]).map((k) => [k, med(k)])), all: results };
writeFileSync(new URL(`../bench/lh-${label}-${mode}.json`, import.meta.url), JSON.stringify(out, null, 1));
console.log(label, mode, JSON.stringify(out.median));
