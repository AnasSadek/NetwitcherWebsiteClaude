"use client";

import { useEffect, useRef } from "react";

/* Instagram-Embed-Skript: einmal pro Seite geladen, danach für jedes
   neu gemountete Embed erneut verarbeitet (auch nach Next.js-Client-
   Navigation, wenn das Skript schon im Dokument steht). */
declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const EMBED_SRC = "https://www.instagram.com/embed.js";
let embedJs: Promise<boolean> | null = null;

function loadEmbedJs(): Promise<boolean> {
  if (!embedJs) {
    embedJs = new Promise<boolean>((resolve) => {
      if (window.instgrm) return resolve(true);
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${EMBED_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(true));
        existing.addEventListener("error", () => resolve(false));
        window.setTimeout(() => resolve(Boolean(window.instgrm)), 4000);
        return;
      }
      const s = document.createElement("script");
      s.src = EMBED_SRC;
      s.async = true;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
      window.setTimeout(() => resolve(Boolean(window.instgrm)), 4000);
    });
  }
  return embedJs;
}

/**
 * Natives Instagram-Embed (offizielles `blockquote.instagram-media`),
 * direkt beim Mounten eingebunden. Instagram übernimmt Profil, Reel,
 * Bedienelemente und Footer vollständig selbst — keine eigene Vorschau,
 * kein Klick-Zwischenschritt. `embed.js` wird nur einmal pro Seite
 * geladen; `Embeds.process()` läuft nach jedem Mount erneut, damit auch
 * Client-Side-Navigationen korrekt initialisieren.
 */
export function InstagramEmbed({ href }: { href: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const url = href.replace(/\/+$/, "");

  useEffect(() => {
    let dead = false;
    (async () => {
      const ok = await loadEmbedJs();
      if (dead || !ok) return;
      window.instgrm?.Embeds.process();
    })();
    return () => {
      dead = true;
    };
  }, [href]);

  return (
    <div ref={ref} className="w-full">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={`${url}/?utm_source=ig_embed`}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: 12,
          margin: 0,
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          display: "block",
        }}
      >
        <a href={`${url}/`} target="_blank" rel="noopener noreferrer">
          Beitrag auf Instagram ansehen
        </a>
      </blockquote>
    </div>
  );
}
