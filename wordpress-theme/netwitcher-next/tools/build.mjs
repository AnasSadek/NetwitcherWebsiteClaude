#!/usr/bin/env node
/**
 * Builds the theme assets:
 *   src/app.css  → assets/css/app.css   (Tailwind v4 CLI, minified)
 *   src/js/*.js  → assets/js/*.js        (esbuild, ES modules, minified)
 * Uses the binaries from NW_NODE_BIN (a node_modules/.bin with tailwindcss + esbuild).
 */
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const bin = process.env.NW_NODE_BIN;
if (!bin) throw new Error("set NW_NODE_BIN to a node_modules/.bin containing tailwindcss and esbuild");
const watch = process.argv.includes("--watch");

execFileSync(join(bin, "tailwindcss"), ["-i", "src/app.css", "-o", "assets/css/app.css", "--minify", ...(watch ? ["--watch"] : [])], { cwd: root, stdio: "inherit" });
const entries = readdirSync(join(root, "src/js")).filter((f) => /^(site|hero|portfolio|inquiry)\.js$/.test(f)).map((f) => "src/js/" + f);
execFileSync(join(bin, "esbuild"), [...entries, "--bundle", "--format=esm", "--minify", "--target=es2020", "--outdir=assets/js", "--log-level=warning"], { cwd: root, stdio: "inherit" });
console.log("built", entries.length, "bundles + css");
