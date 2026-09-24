import { ARROW_COLORS } from "@/components/arrows";
import type { AccentColor } from "@/lib/services";
import { InstagramEmbed } from "./InstagramEmbed";

/* Editoriale Reel-Galerie: native Instagram-Embeds als schwebende, leicht
   gedrehte Karten statt eines gleichförmigen Rasters. Ab 1200px bilden bei
   5 Reels 1–3 eine Zeile (Reel 2 mittig, minimal gedreht, leicht angehoben),
   Reel 4–5 rutschen als zweite, kompakter angesetzte Zeile genau unter die
   Lücken der ersten. Bei genau 4 Reels: zwei zentrierte 2er-Zeilen ohne
   Überlappungs-Versatz. Darunter (Tablet/Mobile) bleibt es immer ein
   ruhiges Raster mit sehr dezenter Neigung. Jedes Embed steht genau einmal
   im DOM — nur Position/Neigung passen sich per CSS an. */

const LAYOUT_5: { tilt: number; lift: number; dominant?: boolean; row2?: boolean }[] = [
  { tilt: -3, lift: 25 },
  { tilt: 1, lift: -15, dominant: true },
  { tilt: 3, lift: 20 },
  { tilt: 2, lift: 0, row2: true },
  { tilt: -2, lift: 0, row2: true },
];

/** Zwei zentrierte 2er-Zeilen statt der 3+2-Überlappung der 5er-Galerie. */
const LAYOUT_4: { tilt: number; lift: number; dominant?: boolean; row2?: boolean }[] = [
  { tilt: -2, lift: 15 },
  { tilt: 1, lift: -10 },
  { tilt: -1, lift: -10 },
  { tilt: 2, lift: 15 },
];

export function ReelGallery({ reels, color }: { reels: { href: string }[]; color: AccentColor }) {
  const hex = ARROW_COLORS[color];
  const isQuad = reels.length === 4;
  const layout = isQuad ? LAYOUT_4 : LAYOUT_5;
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[420px] min-[1200px]:block"
        style={{
          backgroundImage: `radial-gradient(38% 70% at 22% 30%, ${hex}14, transparent 70%), radial-gradient(32% 60% at 78% 20%, ${hex}0f, transparent 70%)`,
        }}
      />
      <ul
        className={[
          "relative mx-auto grid grid-cols-1 items-start gap-y-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 min-[1200px]:flex min-[1200px]:flex-wrap min-[1200px]:items-start min-[1200px]:justify-center min-[1200px]:gap-x-8 min-[1200px]:gap-y-0",
          isQuad ? "min-[1200px]:max-w-[780px]" : "min-[1200px]:max-w-[1220px]",
        ].join(" ")}
      >
        {reels.map((v, i) => {
          const cfg = layout[i] ?? { tilt: 0, lift: 0 };
          const dominant = cfg.dominant;
          const row2 = cfg.row2;
          return (
            <li
              key={v.href}
              className={[
                "reel-position-wrapper w-full min-w-0 self-start min-[1200px]:shrink-0",
                dominant
                  ? "min-[1200px]:z-10 min-[1200px]:w-[clamp(362px,28vw,380px)]"
                  : isQuad
                    ? "min-[1200px]:w-[clamp(326px,28vw,360px)]"
                    : "min-[1200px]:w-[clamp(346px,27vw,364px)]",
                row2 ? "min-[1200px]:-mt-12" : "",
              ].join(" ")}
            >
              <div
                style={{ ["--tilt" as string]: `${cfg.tilt}deg`, ["--lift" as string]: `${cfg.lift}px` }}
                className={[
                  "reel-card rounded-[26px] bg-white p-2 shadow-[0_30px_60px_-30px_rgba(21,10,51,0.2)]",
                  "transition-transform duration-[350ms] ease-out will-change-transform",
                  i % 2 === 0 ? "rotate-[0.6deg]" : "-rotate-[0.6deg]",
                  "min-[1200px]:[transform:rotate(var(--tilt))_translateY(var(--lift))]",
                  "min-[1200px]:hover:[transform:rotate(calc(var(--tilt)*0.25))_translateY(var(--lift))_scale(1.02)]",
                ].join(" ")}
              >
                <InstagramEmbed href={v.href} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
