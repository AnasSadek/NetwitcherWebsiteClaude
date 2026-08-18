"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/Button";
import { BrandStar } from "@/components/brand/Logo";

/**
 * Hero: WITCH, der Kamera-Kopf, auf einer tiefvioletten Lichtbühne.
 *
 * Der Blick folgt der Maus über die GESAMTE Hero-Fläche (nicht nur über dem
 * Canvas). Auf Touch-Geräten schaut die Figur selbständig umher und reagiert,
 * wo verfügbar, auf Geräteneigung. Copy und CTAs sind SSR-DOM links davon.
 */

const MascotScene = dynamic(() => import("./MascotScene"), { ssr: false });

class GLBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Statischer Ersatz: echtes Logo, ruhige Bühne. */
function StaticStage() {
  return (
    <div className="flex h-full items-center justify-center">
      <BrandStar size={190} className="drop-shadow-[0_20px_60px_rgba(139,92,246,0.5)]" />
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const target = useRef({ x: 0, y: 0 });
  const [coarse, setCoarse] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarse(mq.matches);
    const apply = () => setCoarse(mq.matches);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Maus über der ganzen Hero-Sektion → Blickziel in NDC
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      target.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  // Touch: Geräteneigung, sofern ohne Permission-Dialog verfügbar (Android).
  useEffect(() => {
    if (!coarse) return;
    const D = window.DeviceOrientationEvent as unknown as
      | { requestPermission?: () => Promise<string> }
      | undefined;
    if (!D || typeof D.requestPermission === "function") return; // iOS: kein Dialog-Zwang
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      target.current.x = Math.max(-1, Math.min(1, e.gamma / 28));
      target.current.y = Math.max(-1, Math.min(1, (e.beta - 45) / 28));
    };
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => window.removeEventListener("deviceorientation", onTilt);
  }, [coarse]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-paper pt-24 md:pt-28"
      aria-label="Netwitcher – Digital Agency Berlin"
    >
      <div className="mx-auto grid min-h-[calc(100dvh-6rem)] w-full max-w-[1500px] items-center gap-4 px-5 pb-8 sm:px-8 lg:grid-cols-[minmax(0,46%)_minmax(0,54%)] lg:gap-2 lg:pb-14">
        {/* ---------- Copy ---------- */}
        <div className="relative z-10 order-2 mx-auto w-full max-w-xl pt-4 text-center lg:order-1 lg:mx-0 lg:pt-0 lg:text-left">
          <p className="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-ink-3">
            Digital Agency · Berlin
          </p>
          <h1 className="mt-4 font-boxi text-[9.5vw] leading-[1.04] text-ink sm:text-5xl lg:mt-5 lg:text-[3.6rem] xl:text-[4.1rem]">
            WIR MACHEN
            <br />
            <span className="bg-clip-text text-transparent brand-sweep">MAGIE</span> AUS
            <br />
            DEINER MARKE.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-2 sm:text-lg lg:mx-0 lg:mt-6">
            Content, Kampagnen, Websites und Software aus einem Team. Magic in
            Every Click.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:mt-9 lg:justify-start">
            <ButtonLink href="/kontakt">Projekt starten</ButtonLink>
            <ButtonLink href="/leistungen" variant="ghost">
              Was wir können
            </ButtonLink>
          </div>
          <ul className="mt-7 flex flex-wrap lg:mt-10 items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-ink-3 lg:justify-start">
            {["Content & Studio", "Social & Ads", "Web & Software"].map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: ["#f468a8", "#0fb9f2", "#2ee6c8"][i] }}
                />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Die Bühne ---------- */}
        <div className="relative order-1 lg:order-2">
          <div className="relative mx-auto aspect-square w-full max-w-[300px] sm:aspect-[4/4.4] sm:max-w-[420px] lg:aspect-[4/4.6] lg:max-w-[560px]">
            {/* Tiefviolette Bühnenkarte */}
            <div className="stage-glow absolute inset-0 rounded-[36px] bg-deep shadow-lift" />
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[36px] opacity-60"
              style={{
                background:
                  "radial-gradient(120% 90% at 50% 108%, rgba(21,10,51,0.55), transparent 55%)",
              }}
            />
            {/* Charakter */}
            <div className="absolute inset-0">
              {mounted && !reduce ? (
                <GLBoundary fallback={<StaticStage />}>
                  <MascotScene
                    target={target}
                    coarse={coarse}
                    reduce={!!reduce}
                    dpr={[1, coarse ? 1.5 : 2]}
                  />
                </GLBoundary>
              ) : (
                <StaticStage />
              )}
            </div>
            {/* Namensschild */}
            <div className="absolute bottom-3 left-1/2 lg:bottom-5 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.22em] text-white/85 backdrop-blur-sm">
              Witch · Head of Attention
            </div>
          </div>
        </div>
      </div>

      {/* Marken-Basislinie */}
      <div aria-hidden="true" className="brand-sweep h-1.5 w-full" />
    </section>
  );
}
