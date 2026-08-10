"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { media } from "@/lib/media";

/**
 * Kapitel 03 — „Ein Shooting. Viele Formate."
 *
 * Motion-Design-Kapitel ohne fliegende Objekte: EIN Bild bleibt liegen,
 * nur der Bildausschnitt (aspect-ratio) reframed sich scroll-getaktet
 * durch 9:16 → 4:5 → 1:1 → 16:9. Die Bewegung IST die Aussage:
 * eine Produktion bedient das ganze Content-System.
 */

const FORMATS = [
  { ratio: "9 / 16", label: "9:16", use: "Reels, TikTok, Stories" },
  { ratio: "4 / 5", label: "4:5", use: "Feed und Social Ads" },
  { ratio: "1 / 1", label: "1:1", use: "Grid und Katalog" },
  { ratio: "16 / 9", label: "16:9", use: "Website und YouTube" },
] as const;

export function Formats() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);

  // Fortschritt, während die Sektion durchs Fenster läuft. useScroll läuft
  // außerhalb des Render-Zyklus; gesetzt wird nur, wenn der Index kippt.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduce) return;
    const next = Math.min(
      FORMATS.length - 1,
      Math.floor(Math.min(0.999, Math.max(0, (p - 0.15) / 0.6)) * FORMATS.length)
    );
    setIndex((cur) => (cur === next ? cur : next));
  });

  const active = FORMATS[Math.min(index, FORMATS.length - 1)];

  return (
    <section ref={sectionRef} className="relative py-24 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div>
          <h2 className="max-w-lg font-heading text-3xl font-black leading-[1.03] tracking-tight md:text-5xl">
            Ein Shooting.
            <br />
            Viele Formate.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-mist">
            Wir produzieren direkt mit dem Einsatz im Kopf: dasselbe Motiv wird
            zum Reel, zur Anzeige, zum Shop-Bild und zum Website-Header.
          </p>

          {/* Format-Index, zeigt, wo wir gerade sind */}
          <ul className="mt-9 max-w-sm">
            {FORMATS.map((f, i) => {
              const on = i === Math.min(index, FORMATS.length - 1);
              return (
                <li
                  key={f.label}
                  className={`flex items-baseline justify-between gap-4 border-t py-3 transition-colors duration-300 ${
                    on ? "border-sun/70" : "border-line"
                  }`}
                >
                  <span
                    className={`font-heading text-lg font-bold tracking-tight transition-colors duration-300 ${
                      on ? "text-snow" : "text-mist/50"
                    }`}
                  >
                    {f.label}
                  </span>
                  <span
                    className={`text-right text-xs transition-colors duration-300 ${
                      on ? "text-mist" : "text-mist/40"
                    }`}
                  >
                    {f.use}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Der reframende Rahmen */}
        <div className="relative mx-auto w-full max-w-[380px]">
          <figure
            className="relative overflow-hidden bg-night-800 transition-[aspect-ratio] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
            style={{ aspectRatio: reduce ? "4 / 5" : active.ratio }}
          >
            <Media
              asset={media.product}
              sizes="(min-width: 1024px) 380px, 90vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 border-l border-t border-white/40" />
            <span aria-hidden="true" className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-white/40" />
          </figure>
        </div>
      </div>
    </section>
  );
}
