"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import type { MediaVideo } from "@/lib/portfolio";
import { ratioValue } from "@/lib/portfolio";
import type { AccentColor } from "@/lib/services";
import { Placeholder } from "./Placeholder";
import { SmartImage } from "./SmartImage";

/**
 * Thumbnail → Play. Es wird nie ein Video oder Embed geladen, bevor jemand
 * klickt. Spielt ein Player, stoppen alle anderen (ein Event, kein Store).
 * Unterstützt lokale Dateien, YouTube, Vimeo und direkte Video-URLs.
 */

const ACTIVATE = "nw:video-activate";

function embedUrl(video: MediaVideo): string | null {
  const src = video.src ?? "";
  if (!src) return null;
  if (video.source === "youtube") {
    const id =
      src.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{6,})/)?.[1] ?? (src.includes("/") ? null : src);
    return id
      ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
      : null;
  }
  if (video.source === "vimeo") {
    const id = src.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] ?? (/^\d+$/.test(src) ? src : null);
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1` : null;
  }
  return null;
}

export function VideoPlayer({
  video,
  color,
  sizes = "(min-width: 768px) 30vw, 70vw",
  monogram,
  className = "",
  rounded = "rounded-2xl",
}: {
  video: MediaVideo;
  color: AccentColor;
  sizes?: string;
  monogram?: string;
  className?: string;
  rounded?: string;
}) {
  const id = useId();
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ratio = video.ratio ?? "9/16";
  const hasSource = Boolean(video.src);
  const hex = ARROW_COLORS[color];

  useEffect(() => {
    const onActivate = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) setActive(false);
    };
    window.addEventListener(ACTIVATE, onActivate);
    return () => window.removeEventListener(ACTIVATE, onActivate);
  }, [id]);

  const play = () => {
    if (!hasSource) return;
    window.dispatchEvent(new CustomEvent(ACTIVATE, { detail: id }));
    setActive(true);
  };

  const embed = active ? embedUrl(video) : null;

  return (
    <div
      className={`group relative w-full overflow-hidden bg-black ${rounded} ${className}`}
      style={{ aspectRatio: ratioValue(ratio) }}
    >
      {active && hasSource ? (
        embed ? (
          <iframe
            src={embed}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <video
            ref={videoRef}
            src={video.src}
            poster={video.poster}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <track kind="captions" />
          </video>
        )
      ) : (
        <>
          {video.poster ? (
            <SmartImage
              image={{ src: video.poster, alt: video.title, ratio }}
              color={color}
              sizes={sizes}
              rounded="rounded-none"
              className="absolute inset-0 h-full"
              imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <Placeholder color={color} kind="video" ratio={ratio.replace("/", ":")} monogram={monogram} />
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          />
          <button
            type="button"
            onClick={play}
            disabled={!hasSource}
            aria-label={hasSource ? `${video.title} abspielen` : `${video.title}, Video folgt`}
            className="absolute inset-0 flex items-end justify-between p-4 text-left disabled:cursor-default"
          >
            <span className="min-w-0">
              <span className="block truncate font-heading text-sm font-bold text-white">{video.title}</span>
              {video.duration && (
                <span className="mt-0.5 block text-xs text-white/60">{video.duration}</span>
              )}
            </span>
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-lg transition-transform duration-300 ${
                hasSource ? "group-hover:scale-110" : "opacity-50"
              }`}
              style={{ boxShadow: `0 0 0 6px ${hex}33` }}
            >
              <svg width="14" height="14" viewBox="0 0 100 100" aria-hidden="true" className="ml-0.5">
                <path d={ARROW_PATH} fill="currentColor" transform="rotate(90 50 50)" />
              </svg>
            </span>
          </button>
        </>
      )}
    </div>
  );
}
