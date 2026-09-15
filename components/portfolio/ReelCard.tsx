"use client";

import { useState } from "react";
import { ARROW_COLORS } from "@/components/arrows";
import type { AccentColor } from "@/lib/services";

/**
 * Leichte Vorschaukarte für ein Instagram-Reel (9:16).
 *
 * Aus Performance-Gründen wird NIE ein Instagram-Embed vorab geladen:
 * die Karte ist reine Typografie im Portfolio-Look. Erst ein Klick
 * bettet den Instagram-Player (iframe auf /embed/) ein; darunter steht
 * immer der direkte Link zum Reel als Fallback.
 */
export function ReelCard({
  href,
  title,
  label,
  quote,
  color,
}: {
  href: string;
  title: string;
  label: string;
  quote: string;
  color: AccentColor;
}) {
  const [playing, setPlaying] = useState(false);
  const hex = ARROW_COLORS[color];
  const embed = `${href.replace(/\/+$/, "")}/embed/`;

  return (
    <figure>
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-void-2 md:rounded-3xl"
        style={{ aspectRatio: "9 / 16" }}
      >
        {playing ? (
          <iframe
            src={embed}
            title={`${title} · ${label}`}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0 bg-black"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${title} abspielen: ${label}`}
            className="group absolute inset-0 flex h-full w-full flex-col justify-between p-5 text-left transition-colors hover:bg-white/[0.03] md:p-6"
            style={{
              backgroundImage: `radial-gradient(90% 60% at 50% 110%, ${hex}2e, transparent 70%), radial-gradient(70% 40% at 20% -10%, ${hex}1f, transparent 70%)`,
            }}
          >
            <span className="block">
              <span className="block font-heading text-[10px] font-bold uppercase tracking-[0.3em] text-white/45">
                {title}
              </span>
              <span className="mt-2 block font-heading text-sm font-bold leading-snug text-white md:text-base">
                {label}
              </span>
            </span>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 2.5v11l9-5.5z" fill="#fff" />
              </svg>
            </span>
            <span className="block text-sm leading-snug text-white/65">„{quote}"</span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-3">
        <span className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
          {title} · Instagram Reel
        </span>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-white/45 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Auf Instagram ansehen
        </a>
      </figcaption>
    </figure>
  );
}
