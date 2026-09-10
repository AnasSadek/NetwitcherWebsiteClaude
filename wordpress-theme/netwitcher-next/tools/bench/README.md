# Benchmark scripts (feasibility test)

Run from a folder with `playwright-core`, `lighthouse`, `chrome-launcher`, `pixelmatch`, `pngjs` installed; Chromium/Firefox/WebKit paths are set at the top of each script.

| Script | Purpose |
| --- | --- |
| `gzproxy.mjs` | gzip + cache-header reverse proxy in front of PHP's built-in server (8081 → 8080) |
| `lh.mjs`, `runlh.sh` | Lighthouse matrix (pages × site × form factor, N runs, median) |
| `bench-hero.mjs`, `runhero.sh` | hero interaction: FPS/long frames during fast mouse movement, eye update rate, HeadTurn frame loading, mobile emulation |
| `xbrowser.mjs` | Chromium/Firefox/WebKit × 4 viewports, WP vs Next screenshots + pixelmatch diff + hero smoke test |
| `payload.mjs` | transferred bytes per resource type and page |

`results/` holds the raw JSON from the run documented in `docs/07-wordpress-feasibility.md`.
