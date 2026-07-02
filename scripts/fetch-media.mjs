/**
 * Lädt die mit Higgsfield generierten Medien nach /public/media und stellt
 * lib/media.ts auf lokale Pfade um. Einmal lokal ausführen: `npm run fetch-media`
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const mediaTs = path.join(root, "lib", "media.ts");
const outDir = path.join(root, "public", "media");

const src = await readFile(mediaTs, "utf8");
const cdnMatch = src.match(/const CDN = "([^"]+)"/);
if (!cdnMatch) {
  console.log("lib/media.ts nutzt bereits lokale Pfade – nichts zu tun.");
  process.exit(0);
}
const entries = [...src.matchAll(/src: `\$\{CDN\}\/([^`]+)`,\s*\n\s*local: "([^"]+)"/g)];

await mkdir(outDir, { recursive: true });
for (const [, file, local] of entries) {
  const url = `${cdnMatch[1]}/${file}`;
  const dest = path.join(root, "public", local);
  process.stdout.write(`↓ ${local} … `);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download fehlgeschlagen (${res.status}): ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log("ok");
}

const rewritten = src.replace(/src: `\$\{CDN\}\/[^`]+`/g, (m, offset) => {
  const after = src.slice(offset);
  const localMatch = after.match(/local: "([^"]+)"/);
  return `src: "${localMatch[1]}"`;
});
await writeFile(mediaTs, rewritten);
console.log("✓ lib/media.ts auf lokale Pfade umgestellt.");
