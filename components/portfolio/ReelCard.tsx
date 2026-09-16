"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ARROW_COLORS } from "@/components/arrows";
import type { AccentColor } from "@/lib/services";

/* Instagram-Embed-Skript: einmal pro Seite, erst nach der ersten
   Interaktion. Vorher geht KEINE Anfrage an Instagram raus. */
declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}
let embedJs: Promise<boolean> | null = null;
function loadEmbedJs(): Promise<boolean> {
  if (!embedJs) {
    embedJs = new Promise<boolean>((resolve) => {
      if (window.instgrm) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
      // Sicherheitsnetz, falls weder load noch error feuern
      window.setTimeout(() => resolve(Boolean(window.instgrm)), 4000);
    });
  }
  return embedJs;
}

/**
 * Instagram-Reel als Teil der Case Study.
 *
 * Ruhezustand: leichte Vorschaukarte (echtes Markenmotiv als Poster,
 * Play-Button, Titel, Kurzbeschreibung) — null Instagram-Anfragen.
 * Klick: das offizielle Embed (blockquote + embed.js) wird dynamisch
 * geladen und ersetzt die Karte; schlägt das Skript fehl, springt ein
 * direktes iframe auf /embed/captioned/ ein. Der Instagram-Link unter
 * der Karte bleibt als letzter Fallback immer erreichbar.
 */
export function ReelCard({
  href,
  title,
  label,
  quote,
  poster,
  color,
}: {
  href: string;
  title: string;
  label: string;
  quote: string;
  poster?: string;
  color: AccentColor;
}) {
  const [mode, setMode] = useState<"idle" | "embed" | "iframe">("idle");
  const boxRef = useRef<HTMLDivElement>(null);
  const hex = ARROW_COLORS[color];
  const url = href.replace(/\/+$/, "");

  useEffect(() => {
    if (mode !== "embed") return;
    let dead = false;
    (async () => {
      const ok = await loadEmbedJs();
      if (dead) return;
      if (!ok) return setMode("iframe");
      window.instgrm?.Embeds.process();
      // Wurde die blockquote nach kurzer Zeit nicht durch den Player
      // ersetzt, auf das direkte iframe ausweichen.
      window.setTimeout(() => {
        if (dead) return;
        const done = boxRef.current?.querySelector("iframe.instagram-media, iframe.instagram-media-rendered");
        if (!done) setMode("iframe");
      }, 4500);
    })();
    return () => {
      dead = true;
    };
  }, [mode]);

  return (
    <figure>
      <div
        ref={boxRef}
        className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-soft md:rounded-3xl"
        style={mode === "idle" ? { aspectRatio: "9 / 16" } : { minHeight: "min(640px, 120vw)" }}
      >
        {mode === "embed" && (
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={`${url}/?utm_source=ig_embed`}
            data-instgrm-version="14"
            style={{ background: "#fff", border: 0, margin: 0, padding: 0, width: "100%" }}
          >
            <a href={`${url}/`}> </a>
          </blockquote>
        )}
        {mode === "iframe" && (
          <iframe
            src={`${url}/embed/captioned/`}
            title={`${title} · ${label}`}
            allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
            allowFullScreen
            scrolling="no"
            className="h-[min(640px,120vw)] w-full border-0 bg-white"
          />
        )}
        {mode === "idle" && (
          <button
            type="button"
            onClick={() => setMode("embed")}
            aria-label={`${title} abspielen: ${label}`}
            className="group absolute inset-0 h-full w-full text-left"
          >
            {poster ? (
              <Image
                src={poster}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            ) : (
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(90% 60% at 50% 110%, ${hex}1f, transparent 70%), radial-gradient(70% 40% at 20% -10%, ${hex}14, transparent 70%)`,
                }}
              />
            )}
            {/* Scrim für Lesbarkeit auf dem Motiv */}
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />

            <span className="absolute left-5 right-5 top-5 block md:left-6 md:top-6">
              <span className="block font-heading text-[10px] font-bold uppercase tracking-[0.3em] text-white/75">
                {title}
              </span>
              <span className="mt-1.5 block font-heading text-sm font-bold leading-snug text-white md:text-base">
                {label}
              </span>
            </span>
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lift backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" className="ml-0.5">
                <path d="M4 2.5v11l9-5.5z" fill="#150a33" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2.5 text-center">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-ink-3 underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          Auf Instagram ansehen
        </a>
      </figcaption>
    </figure>
  );
}
