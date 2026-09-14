"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { ARROW_PATH, ARROW_COLORS, STAR_ORDER } from "@/components/arrows";

/**
 * Die WITCH-Bühne — Charakter aus EINEM gelieferten Design-Asset
 * (scripts/mascot/mascot-src.webp), zerlegt in zwei unabhängige Ebenen:
 *
 *   public/mascot/witch-torso.webp – Hoodie-Körper. 100 % STATISCH:
 *       keine Transforms, keine Animation, keine animierten Vorfahren.
 *   public/mascot/witch-head.webp  – Kamera-Kopf. Die EINZIGE bewegte
 *       Ebene: folgt der Maus in 2D (Federn = weiches Nachziehen) mit
 *       dezentem 3D-Kippen (rotateX/rotateY um die Linse), schwebt im
 *       Ruhezustand mit ~5 px Abstand über dem Kragen und kehrt beim
 *       Verlassen des Hero-Bereichs weich in die Mitte zurück.
 *
 * Beide Slices behalten die volle Quellbreite (transparenter Overscan) —
 * der Kopf wird bei keiner Auslenkung beschnitten. Kein Canvas, keine
 * Frames, keine Überblendungen: zu jedem Zeitpunkt genau EIN Kopf.
 *
 * Mobil/Touch und prefers-reduced-motion: der Charakter steht komplett
 * still (keine Maus-Verfolgung, kein Schweben).
 */

// Geometrie der Quell-Slices (mascot-src.webp, 1254×1254)
const SRC_W = 1254;
const HEAD_H = 634; // Kopf-Slice-Höhe (Inhalt endet bei y 629)
const TORSO_H = 620; // Körper-Slice-Höhe (Inhalt beginnt bei y 641)
// Linsenmitte innerhalb des Kopf-Slices (für Drehpunkt + Sternfunken)
const LENS = { x: 619 / SRC_W, y: 404 / HEAD_H };
// Maximale Kopf-Auslenkung (px) und 3D-Kippwinkel (deg) bei voller Feder
const TRAVEL = { x: 26, y: 18, rotY: 10, rotX: 7 };

const clamp = (v: number, lo = -1, hi = 1) => Math.min(hi, Math.max(lo, v));
// Weiche Sättigung: volle Auslenkung erst nahe des Bühnenrands
const soft = (v: number) => Math.tanh(v * 1.35);

const SPRING = {
  head: { stiffness: 120, damping: 16, mass: 0.9 },
  body: { stiffness: 60, damping: 20 },
  lean: { stiffness: 160, damping: 18 },
  magnet: { stiffness: 260, damping: 22 },
};

const easeOut = [0.23, 1, 0.32, 1] as const;

function useMediaFlag(query: string) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const apply = () => setOn(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [query]);
  return on;
}

function MagneticCard({
  href,
  color,
  title,
  text,
  parallax,
  enabled,
}: {
  href: string;
  color: string;
  title: string;
  text: string;
  parallax: MotionValue<string>;
  enabled: boolean;
}) {
  const mx = useSpring(useMotionValue(0), SPRING.magnet);
  const my = useSpring(useMotionValue(0), SPRING.magnet);
  const transform = useMotionTemplate`translate3d(${mx}px, ${my}px, 0)`;
  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(clamp(((e.clientX - r.left) / r.width - 0.5) * 16, -8, 8));
    my.set(clamp(((e.clientY - r.top) / r.height - 0.5) * 16, -8, 8));
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };
  return (
    <motion.div style={enabled ? { transform: parallax } : undefined}>
      <motion.div style={enabled ? { transform } : undefined}>
        <Link
          href={href}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="pointer-events-auto block rounded-card bg-white/10 p-5 backdrop-blur-md transition-colors duration-200 hover:bg-white/15"
        >
          <svg width="22" height="22" viewBox="0 0 100 100" aria-hidden="true">
            <path d={ARROW_PATH} fill={color} />
          </svg>
          <p className="mt-3 font-heading text-base font-extrabold text-white">{title}</p>
          <p className="mt-1 text-sm leading-snug text-white/65">{text}</p>
          <span className="mt-3 inline-flex rounded-full bg-white px-3.5 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-ink">
            Go
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function HeroStage() {
  const reduce = useMediaFlag("(prefers-reduced-motion: reduce)");
  const coarse = useMediaFlag("(pointer: coarse)");
  const live = !reduce;
  const pointer = live && !coarse; // echte Maus vorhanden → Kopf folgt

  /* ---------------- Ziel & Federn (weiches Nachziehen, kein Snapping) ---------------- */
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const hx = useSpring(tx, SPRING.head);
  const hy = useSpring(ty, SPRING.head);
  const bx = useSpring(tx, SPRING.body);
  const by = useSpring(ty, SPRING.body);

  // Dezente Beschleunigungs-Neigung: der Kopf lehnt sich in die Bewegung
  const vel = useVelocity(hx);
  const lean = useSpring(useTransform(vel, (v) => clamp(v * 0.35, -1.6, 1.6)), SPRING.lean);

  /* ---------------- Kopf-Transform: Translation + dezentes 3D-Kippen ---------------- */
  const headTX = useTransform(hx, (v) => (pointer ? v * TRAVEL.x : 0));
  const headTY = useTransform(hy, (v) => (pointer ? v * TRAVEL.y : 0));
  const rotY = useTransform(hx, (v) => (pointer ? v * TRAVEL.rotY : 0));
  const rotX = useTransform(hy, (v) => (pointer ? v * -TRAVEL.rotX : 0));
  const headTransform = useMotionTemplate`translate3d(${headTX}px, ${headTY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) rotate(${lean}deg)`;

  /* ---------------- Karten & Glow (gegenläufig, langsam) ---------------- */
  const c1x = useTransform(bx, (v) => v * -26);
  const c1y = useTransform(by, (v) => v * -14);
  const c2x = useTransform(bx, (v) => v * -38);
  const c2y = useTransform(by, (v) => v * -20);
  const card1 = useMotionTemplate`translate3d(${c1x}px, ${c1y}px, 0)`;
  const card2 = useMotionTemplate`translate3d(${c2x}px, ${c2y}px, 0)`;
  const glowX = useTransform(hx, (v) => 50 + v * 9);
  const glowY = useTransform(hy, (v) => 44 + v * 7);
  const glow = useMotionTemplate`radial-gradient(52% 46% at ${glowX}% ${glowY}%, rgba(139,92,246,0.6), transparent 70%), radial-gradient(38% 34% at 76% 70%, rgba(15,185,242,0.22), transparent 72%), radial-gradient(34% 30% at 22% 72%, rgba(244,104,168,0.2), transparent 72%)`;

  /* ---------------- Maus: Kopf jagt dem Cursor im Hero-Bereich nach ---------------- */
  const charRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef({ x: 0, y: 0 });

  // Echte Bildschirmposition der Linse (CSS-Variablen der Kalibrierung)
  const measureLens = useCallback(() => {
    const el = charRef.current;
    if (!el) return lensRef.current;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const fx = parseFloat(cs.getPropertyValue("--eye-x")) / 100 || 0.49;
    const fy = parseFloat(cs.getPropertyValue("--eye-y")) / 100 || 0.39;
    lensRef.current = { x: r.left + r.width * fx, y: r.top + r.height * fy };
    return lensRef.current;
  }, []);

  const lookAt = useCallback(
    (clientX: number, clientY: number) => {
      const { x, y } = lensRef.current;
      tx.set(soft((clientX - x) / (window.innerWidth / 2)));
      ty.set(soft((clientY - y) / (window.innerHeight / 2)));
    },
    [tx, ty]
  );

  // Innerhalb der Bühne (plus etwas Rand) folgt der Kopf dem Cursor;
  // verlässt er sie — oder scrollt sie aus dem Bild — kehrt der Kopf über
  // die Federn WEICH in die neutrale Mitte zurück (kein Schnappen).
  useEffect(() => {
    if (!pointer) return;
    const el = charRef.current;
    if (!el) return;
    const cursor = { x: NaN, y: NaN };
    const PAD = 48;
    measureLens();
    const aim = () => {
      if (Number.isNaN(cursor.x)) return;
      const r = el.getBoundingClientRect();
      const inside =
        cursor.x > r.left - PAD &&
        cursor.x < r.right + PAD &&
        cursor.y > r.top - PAD &&
        cursor.y < r.bottom + PAD;
      if (inside) {
        lookAt(cursor.x, cursor.y);
      } else {
        tx.set(0);
        ty.set(0);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      aim();
    };
    const onScroll = () => {
      measureLens();
      aim();
    };
    const ro = new ResizeObserver(measureLens);
    ro.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, [pointer, measureLens, lookAt, tx, ty]);

  /* ---------------- „Magic in Every Click": der Verschluss ---------------- */
  const [shot, setShot] = useState(0);
  const busy = useRef(false);
  const shoot = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    setShot((n) => n + 1);
    window.setTimeout(() => (busy.current = false), 520);
    window.setTimeout(() => setShot(0), 1600);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-deep shadow-lift md:rounded-[40px]">
      {/* Bühnen-Glow folgt dem Kopf */}
      <motion.div aria-hidden="true" className="absolute inset-0" style={live ? { background: glow } : undefined} />

      {/* ---------- Der Charakter ---------- */}
      <div
        ref={charRef}
        className="witch-stage @container relative mx-auto aspect-[4/5] w-full max-w-[560px] sm:max-w-[640px] lg:aspect-[16/9] lg:max-w-none"
      >
        {/* Hintergrund: charakterfreie Bühne (statisch; object-cover
            beschneidet die 16:9-Datei für das Portrait-Layout mittig) */}
        <img
          src="/mascot/backdrop-wide.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />

        {/* GESPERRTE INVARIANTE (siehe CLAUDE.md): Die Charakter-Box und der
            Körper sind KOMPLETT statisch — keine Transforms, kein Float,
            kein Parallax, keine Cursor-Bewegung, weder direkt noch über
            Eltern-Container. Nur die Kopf-Ebene darin bewegt sich. */}
        <div
          className="absolute bottom-0 left-0 w-full lg:left-[23.9%] lg:w-[50.6%]"
          style={{ aspectRatio: "1 / 1" }}
          role="img"
          aria-label="WITCH, das Netwitcher-Maskottchen: eine Figur mit Kamera-Kopf im lila Hoodie"
        >
          {/* KÖRPER: 100 % statisch */}
          <img
            src="/mascot/witch-torso.webp"
            alt=""
            aria-hidden="true"
            className="absolute left-0 w-full"
            style={{ top: `${(HEAD_H / SRC_W) * 100}%`, height: `${(TORSO_H / SRC_W) * 100}%` }}
            draggable={false}
            fetchPriority="high"
          />

          {/* KOPF-EBENE: die einzige bewegte Ebene. Voller transparenter
              Overscan im Asset + keine überschneidenden Clipping-Container
              → der Kopf bleibt in jeder Richtung vollständig sichtbar. */}
          <div
            className="pointer-events-none absolute left-0 top-0 w-full [perspective:900px]"
            style={{ height: `${(HEAD_H / SRC_W) * 100}%` }}
          >
            <div className={`h-full w-full ${pointer ? "animate-float-head" : ""}`}>
              <motion.div
                className="h-full w-full will-change-transform"
                style={{
                  transform: headTransform,
                  transformOrigin: `${LENS.x * 100}% ${LENS.y * 100}%`,
                }}
              >
                <img
                  src="/mascot/witch-head.webp"
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full select-none"
                  draggable={false}
                  fetchPriority="high"
                />

                {/* Sternfunken beim Auslösen: fliegen aus der Linse und
                    wandern mit dem Kopf */}
                {shot > 0 && !reduce && (
                  <div
                    key={shot}
                    aria-hidden="true"
                    className="absolute"
                    style={{ left: `${LENS.x * 100}%`, top: `${LENS.y * 100}%` }}
                  >
                    {STAR_ORDER.map((c, i) => {
                      const a = -90 + i * 72;
                      return (
                        <motion.svg
                          key={c}
                          width="22"
                          height="22"
                          viewBox="0 0 100 100"
                          className="absolute -left-[11px] -top-[11px]"
                          initial={{ opacity: 1, transform: `rotate(${a}deg) translateY(-14px) scale(0.5)` }}
                          animate={{ opacity: 0, transform: `rotate(${a}deg) translateY(-118px) scale(1.1)` }}
                          transition={{ duration: 0.7, ease: easeOut, delay: 0.04 }}
                        >
                          <path d={ARROW_PATH} fill={ARROW_COLORS[c]} />
                        </motion.svg>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Auslöser: die ganze Figur ist der Knopf */}
        <button
          type="button"
          onClick={shoot}
          aria-label="WITCH macht ein Foto"
          className="absolute inset-0 z-10 cursor-pointer rounded-[32px] focus-visible:outline-offset-[-6px] md:rounded-[40px]"
        />
      </div>

      {/* Blitz */}
      <AnimatePresence>
        {shot > 0 && (
          <motion.div
            key={shot}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[15] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, reduce ? 0.35 : 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.34, times: [0, 0.18, 1], ease: easeOut }}
          />
        )}
      </AnimatePresence>

      {/* ---------- Schwebende Service-Karten rechts (Desktop) ---------- */}
      <div className="pointer-events-none absolute inset-y-0 right-10 z-20 hidden w-[300px] flex-col justify-center gap-4 lg:flex xl:right-14">
        <MagneticCard
          href="/studio"
          color={ARROW_COLORS.pink}
          title="Content & Studio"
          text="Foto, Video und Reels aus dem Studio Berlin"
          parallax={card1}
          enabled={pointer}
        />
        <MagneticCard
          href="/leistungen/performance-marketing"
          color={ARROW_COLORS.sky}
          title="Social & Ads"
          text="Meta, TikTok und Google, organisch und bezahlt"
          parallax={card2}
          enabled={pointer}
        />
      </div>

      {/* Namensschild: reagiert auf den Klick */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 overflow-hidden rounded-full bg-white/10 px-4 py-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.22em] text-white/85 backdrop-blur-sm lg:bottom-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={shot ? "shot" : "name"}
            className="block whitespace-nowrap"
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(6px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(-6px)" }}
            transition={{ duration: 0.18, ease: easeOut }}
          >
            {shot ? "✦ Magic in Every Click" : "Witch · Head of Attention"}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
