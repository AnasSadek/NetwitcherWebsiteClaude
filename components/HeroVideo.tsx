"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { media } from "@/lib/media";

/**
 * Kinoreifer Hero-Hintergrund: lazy geladener, stummer Video-Loop.
 * Fallback (reduced motion / Ladefehler / bis zum Laden): dunkler Gradient mit Neon-Glows.
 */
export function HeroVideo() {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduce) videoRef.current?.pause();
  }, [reduce]);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Gradient-Basis, immer vorhanden */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 500px at 70% 20%, rgba(139,92,246,.22), transparent 65%), radial-gradient(700px 420px at 15% 75%, rgba(15,185,242,.14), transparent 65%), radial-gradient(600px 380px at 85% 85%, rgba(244,104,168,.1), transparent 65%), #06060F",
        }}
      />
      {!reduce && !failed && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            ready ? "opacity-40" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setReady(true)}
          onError={() => setFailed(true)}
          src={media.heroLoop.src}
        />
      )}
      {/* Abdunkelung für Textkontrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/30 to-night" />
    </div>
  );
}
