"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/Button";
import { Media } from "@/components/ui/Media";
import { ARROW_COLORS } from "@/components/arrows";
import { media, heroVideo } from "@/lib/media";

/**
 * Kapitel 01 — „Das Studio arbeitet bereits."
 *
 * Editoriale Asymmetrie statt zentriertem Gradient-Hero:
 * links große Typo + CTAs, rechts eine bildfüllende Produktionsaufnahme,
 * die über die Grid-Kante hinausläuft.
 *
 * EINE Bewegungsidee: ein echter Marken-Pfeil fährt als „Art-Direction-Cursor"
 * einmal über die Aufnahme; wo er vorbeikommt, wird aus dem rohen Frame
 * (entsättigt, Crop-Marken) der fertige, farbige Kampagnen-Frame.
 * Kein Orbit, kein Float, kein Partikel.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState(0); // 0 = roh, 1 = fertig
  const [videoOk, setVideoOk] = useState(false);

  // Der Reveal läuft einmal beim Eintreten – nicht scroll-gekoppelt,
  // damit die Bewegung eine Aussage hat und nicht am Rad klebt.
  useEffect(() => {
    if (reduce) {
      setReveal(1);
      return;
    }
    const el = frameRef.current;
    if (!el) return;
    let raf = 0;
    let start = 0;
    const DURATION = 1500;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const tick = (t: number) => {
          if (!start) start = t;
          const p = Math.min(1, (t - start) / DURATION);
          // cinematic ease-out – Bewegung mit Masse
          setReveal(1 - Math.pow(1 - p, 3));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-24">
      <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,46%)_minmax(0,54%)] lg:gap-6 lg:pl-[6vw] lg:pr-0">
        {/* Typo-Spalte */}
        <div className="relative z-10 max-w-xl">
          <p className="font-heading text-[11px] font-bold uppercase tracking-[0.28em] text-mist">
            Content Studio &amp; Digital Agency · Berlin
          </p>

          <h1 className="mt-6 font-heading text-[2.6rem] font-black leading-[0.98] tracking-tight sm:text-6xl xl:text-[4.4rem]">
            Content, der
            <br />
            <span className="relative inline-block">
              Anfragen bringt.
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-[3px] bg-sun transition-[width] duration-[900ms] ease-out"
                style={{ width: `${reveal * 100}%` }}
              />
            </span>
          </h1>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-mist">
            Produktfotografie, Reels, Werbevideos, Social Ads und Websites.
            Aus einem Team in Berlin.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/kontakt">Projekt anfragen</ButtonLink>
            <ButtonLink href="/studio" variant="ghost">
              Studio entdecken
            </ButtonLink>
          </div>
        </div>

        {/* Produktions-Frame: bricht rechts aus dem Raster */}
        <div ref={frameRef} className="relative lg:-mr-[4vw]">
          <figure className="relative aspect-[4/3] overflow-hidden bg-night-800 sm:aspect-[16/10]">
            {/* Basis: Studio-Still (immer da, trägt das Design auch ohne Video) */}
            <Media
              asset={media.studio}
              priority
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Studio-Loop als progressive Verbesserung */}
            {!reduce && (
              <video
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  videoOk ? "opacity-100" : "opacity-0"
                }`}
                src={heroVideo.mp4}
                poster={heroVideo.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                onCanPlay={() => setVideoOk(true)}
                onError={() => setVideoOk(false)}
                aria-hidden="true"
              />
            )}

            {/* Roh-Zustand: entsättigt + abgedunkelt, wird vom Pfeil „freigegeben" */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-night/70 backdrop-grayscale transition-opacity duration-300"
              style={{
                opacity: 1 - reveal,
                clipPath: `inset(0 0 0 ${reveal * 100}%)`,
              }}
            />

            {/* Der Art-Direction-Pfeil: eine Bewegung, präzise */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 w-[2px] bg-sun/80"
              style={{
                left: `${reveal * 100}%`,
                opacity: reveal > 0.02 && reveal < 0.99 ? 1 : 0,
                transition: "opacity .3s",
              }}
            />
            <img
              aria-hidden="true"
              src="/brand/arrow3d-sun.png"
              alt=""
              width={90}
              height={58}
              className="absolute top-1/2 w-[70px] -translate-x-1/2 -translate-y-1/2 md:w-[90px]"
              style={{
                left: `${reveal * 100}%`,
                opacity: reveal > 0.02 && reveal < 0.99 ? 1 : 0,
                transition: "opacity .3s",
                filter: `drop-shadow(0 0 22px ${ARROW_COLORS.sun}66)`,
              }}
            />

            {/* Produktionsdetails: Crop-Marken (dezent, nur zwei Ecken) */}
            <span aria-hidden="true" className="absolute left-4 top-4 h-5 w-5 border-l border-t border-white/35" />
            <span aria-hidden="true" className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-white/35" />

          </figure>

        </div>
      </div>
    </section>
  );
}
