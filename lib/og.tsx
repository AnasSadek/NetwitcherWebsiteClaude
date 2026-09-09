import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { ARROW_COLORS } from "@/components/arrows";
import type { AccentColor } from "@/lib/services";

/**
 * Gemeinsame OG-Karte für Portfolio & Case Studies: dunkle Bühne, der
 * Netwitcher-Stern, Titel in EP Boxi. WhatsApp, LinkedIn & Co. zeigen
 * damit eine markenkonforme Vorschau, sobald ein Link geteilt wird.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const ARM =
  "M546.76 440.83L546.76 472.71C546.76 483.87 534.27 490.47 525.05 484.18L464.39 442.82C459.67 439.60 453.46 439.60 448.74 442.81L388.00 484.20C378.78 490.49 366.29 483.88 366.29 472.72L366.29 440.83C366.29 436.24 368.56 431.94 372.36 429.35L448.74 377.31C453.46 374.09 459.67 374.09 464.39 377.31L540.70 429.35C544.49 431.94 546.76 436.24 546.76 440.83Z";
const STAR: [number, string][] = [
  [0, "#F5D33D"],
  [72, "#0FB9F2"],
  [144, "#2EE6C8"],
  [216, "#8B5CF6"],
  [288, "#F468A8"],
];

function Star({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      {STAR.map(([rot, fill]) => (
        <g key={rot} transform={`translate(100 100) rotate(${rot}) translate(0 65.5) scale(0.46)`}>
          <path transform="translate(-456.53 -432.29)" d={ARM} fill={fill} />
        </g>
      ))}
    </svg>
  );
}

async function loadFont() {
  return readFile(path.join(process.cwd(), "public/fonts/epboxi-display.woff"));
}

export async function ogCard({
  eyebrow,
  title,
  meta,
  color = "violet",
}: {
  eyebrow: string;
  title: string;
  meta?: string;
  color?: AccentColor;
}) {
  const font = await loadFont();
  const hex = ARROW_COLORS[color];
  const up = (s: string) => s.toUpperCase();
  // EP Boxi ist ~1,1 em breit pro Versal: Grösse aus dem längsten Wort ableiten.
  const longest = Math.max(...title.split(/\s+/).map((w) => w.length), 1);
  const titleSize = Math.min(100, Math.floor(1040 / (longest * 0.86)));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#0b0620",
          backgroundImage: `radial-gradient(circle at 15% 0%, ${hex}55 0%, transparent 55%), radial-gradient(circle at 100% 100%, rgba(139,92,246,0.45) 0%, transparent 60%)`,
          color: "#fff",
          fontFamily: "EP Boxi",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Star size={56} />
          <div style={{ fontSize: 26, letterSpacing: 6, color: "rgba(255,255,255,0.7)" }}>{up(eyebrow)}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: titleSize,
              lineHeight: 0.98,
              letterSpacing: -1,
              maxWidth: 1000,
            }}
          >
            {up(title)}
          </div>
          {meta && (
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, letterSpacing: 5, color: "rgba(255,255,255,0.6)" }}>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: hex }} />
              {up(meta)}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "EP Boxi", data: font, weight: 700, style: "normal" }],
    }
  );
}
