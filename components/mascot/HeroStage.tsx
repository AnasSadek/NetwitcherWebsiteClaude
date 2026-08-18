"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { BrandStar } from "@/components/brand/Logo";
import { ARROW_PATH, ARROW_COLORS } from "@/components/arrows";

/**
 * Die WITCH-Bühne: der hochwertige Charakter-Render als Herzstück,
 * zum Leben erweckt über geschichtete Feder-Parallaxe.
 *
 * Ebenen (von hinten nach vorn):
 *   Glow (folgt dem Cursor weich) → Charakter-Render → ECHTES Logo als
 *   leuchtendes Objektiv-Auge (blinzelt) → schwebende Service-Karten.
 *
 * Der Charakter selbst ist ein Render; das Logo im Objektiv und auf der
 * Brust ist NIE Teil des Renders, sondern immer das echte SVG als Overlay —
 * dadurch bleibt die Marke exakt und kann eigenständig leuchten/blinzeln.
 */

export function HeroStage() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [coarse, setCoarse] = useState(false);

  // Zeiger in NDC (-1..1), gefedert — Masse statt Lerp
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const sx = useSpring(tx, { stiffness: 55, damping: 13, mass: 1 });
  const sy = useSpring(ty, { stiffness: 55, damping: 13, mass: 1 });

  // Charakter: dreht sich leicht ZUM Cursor, hebt sich minimal
  const charX = useTransform(sx, (v) => v * 16);
  const charY = useTransform(sy, (v) => v * 9);
  const charR = useTransform(sx, (v) => v * 2.2);
  // Karten: eigene Tiefe, gegenläufig
  const cardX = useTransform(sx, (v) => v * -26);
  const cardY = useTransform(sy, (v) => v * -14);
  const card2X = useTransform(sx, (v) => v * -38);
  const card2Y = useTransform(sy, (v) => v * -20);
  // Glow wandert mit
  const glowX = useTransform(sx, (v) => `${50 + v * 9}%`);
  const glowY = useTransform(sy, (v) => `${44 + v * 7}%`);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const apply = () => setCoarse(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Maus über der ganzen Bühne
  useEffect(() => {
    if (coarse || reduce) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx.set(((e.clientX - r.left) / r.width) * 2 - 1);
      ty.set(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const onLeave = () => {
      tx.set(0);
      ty.set(0);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [coarse, reduce, tx, ty]);

  // Touch: eigenständiges, ruhiges Umschauen + Geräteneigung wo frei verfügbar
  useEffect(() => {
    if (!coarse || reduce) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      tx.set(Math.sin(t * 0.35) * 0.5 + Math.sin(t * 0.13 + 1.7) * 0.25);
      ty.set(Math.sin(t * 0.27 + 0.6) * 0.3);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const D = window.DeviceOrientationEvent as unknown as
      | { requestPermission?: () => Promise<string> }
      | undefined;
    let tiltActive = false;
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tiltActive = true;
      cancelAnimationFrame(raf);
      tx.set(Math.max(-1, Math.min(1, e.gamma / 30)));
      ty.set(Math.max(-1, Math.min(1, (e.beta - 45) / 30)));
    };
    if (D && typeof D.requestPermission !== "function") {
      window.addEventListener("deviceorientation", onTilt, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("deviceorientation", onTilt);
      void tiltActive;
    };
  }, [coarse, reduce, tx, ty]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[32px] bg-deep shadow-lift md:rounded-[40px]"
    >
      {/* Cursor-folgender Bühnen-Glow */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([x, y]) =>
              `radial-gradient(52% 46% at ${x} ${y}, rgba(139,92,246,0.6), transparent 70%), radial-gradient(38% 34% at 76% 70%, rgba(15,185,242,0.22), transparent 72%), radial-gradient(34% 30% at 22% 72%, rgba(244,104,168,0.2), transparent 72%)`
          ),
        }}
      />

      {/* ---------- Der Charakter ---------- */}
      <motion.div
        className="witch-stage relative mx-auto aspect-[4/5] w-full max-w-[560px] sm:max-w-[640px] lg:aspect-[16/9] lg:max-w-none"
        style={reduce ? undefined : { x: charX, y: charY, rotate: charR }}
        animate={
          reduce
            ? undefined
            : { y: [0, -7, 0], transition: { duration: 5.2, repeat: Infinity, ease: "easeInOut" } }
        }
      >
        <picture>
          <source media="(min-width: 1024px)" type="image/avif" srcSet="/mascot/witch-wide.avif" />
          <source media="(min-width: 1024px)" srcSet="/mascot/witch-wide.webp" />
          <source type="image/avif" srcSet="/mascot/witch-portrait.avif" />
          <img
            src="/mascot/witch-portrait.webp"
            alt="WITCH, das Netwitcher-Maskottchen: eine Figur mit Kamera-Kopf im lila Hoodie"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </picture>

        {/* Echtes Logo als leuchtendes Auge — blinzelt eigenständig */}
        <motion.div
          className="absolute"
          style={{
            left: "var(--eye-x)",
            top: "var(--eye-y)",
            width: "var(--eye-s)",
            // KEIN transform hier: framer-motion überschreibt transform beim
            // Animieren von scale. Zentrierung über negative Margins
            // (Margin-Prozente beziehen sich auf die Containerbreite).
            marginLeft: "calc(var(--eye-s) / -2)",
            marginTop: "calc(var(--eye-s) / -2)",
          }}
          animate={
            reduce
              ? undefined
              : {
                  opacity: [1, 1, 0.15, 1, 1],
                  scale: [1, 1, 0.82, 1, 1],
                  transition: {
                    duration: 0.7,
                    times: [0, 0.42, 0.5, 0.58, 1],
                    repeat: Infinity,
                    repeatDelay: 3.8,
                    ease: "easeInOut",
                  },
                }
          }
        >
          <BrandStar
            size={999}
            className="h-auto w-full drop-shadow-[0_0_18px_rgba(139,92,246,0.9)] [filter:drop-shadow(0_0_6px_rgba(255,255,255,0.55))_drop-shadow(0_0_18px_rgba(139,92,246,0.9))]"
          />
        </motion.div>
      </motion.div>

      {/* ---------- Schwebende Service-Karten rechts (Desktop) ---------- */}
      <div className="pointer-events-none absolute inset-y-0 right-10 hidden w-[300px] flex-col justify-center gap-4 lg:flex xl:right-14">
        <motion.div style={reduce ? undefined : { x: cardX, y: cardY }}>
          <Link
            href="/studio"
            className="pointer-events-auto block rounded-card bg-white/10 p-5 backdrop-blur-md transition-colors hover:bg-white/15"
          >
            <svg width="22" height="22" viewBox="0 0 100 100" aria-hidden="true">
              <path d={ARROW_PATH} fill={ARROW_COLORS.pink} />
            </svg>
            <p className="mt-3 font-heading text-base font-extrabold text-white">
              Content & Studio
            </p>
            <p className="mt-1 text-sm leading-snug text-white/65">
              Foto, Video und Reels aus dem Studio Berlin
            </p>
            <span className="mt-3 inline-flex rounded-full bg-white px-3.5 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-ink">
              Go
            </span>
          </Link>
        </motion.div>
        <motion.div style={reduce ? undefined : { x: card2X, y: card2Y }}>
          <Link
            href="/leistungen/performance-marketing"
            className="pointer-events-auto block rounded-card bg-white/10 p-5 backdrop-blur-md transition-colors hover:bg-white/15"
          >
            <svg width="22" height="22" viewBox="0 0 100 100" aria-hidden="true">
              <path d={ARROW_PATH} fill={ARROW_COLORS.sky} />
            </svg>
            <p className="mt-3 font-heading text-base font-extrabold text-white">
              Social & Ads
            </p>
            <p className="mt-1 text-sm leading-snug text-white/65">
              Meta, TikTok und Google, organisch und bezahlt
            </p>
            <span className="mt-3 inline-flex rounded-full bg-white px-3.5 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-ink">
              Go
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Namensschild */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.22em] text-white/85 backdrop-blur-sm lg:bottom-6">
        Witch · Head of Attention
      </div>
    </div>
  );
}
