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
import { BrandStar } from "@/components/brand/Logo";
import { ARROW_PATH, ARROW_COLORS, STAR_ORDER } from "@/components/arrows";

/**
 * Die WITCH-Bühne: ein hochwertiger Charakter-Render, der auf den Zeiger
 * reagiert wie eine Figur, nicht wie ein Parallax-Bild.
 *
 * Drei Reaktionsgeschwindigkeiten (Sekundärbewegung):
 *   Auge   – schnell: der Blick springt zuerst zum Zeiger
 *   Kopf   – mittel:  Ansichten-Überblendung (links/frontal/rechts), Neigung
 *   Körper – langsam: Versatz, 3D-Kippung, Lehnen in die Bewegungsrichtung
 *
 * Dazu: Fokus-Glanz auf der Linse, wenn der Zeiger nahekommt; ruhiges
 * Umschauen, wenn niemand interagiert; und „Magic in Every Click": ein
 * Klick/Tipp auf WITCH löst den Verschluss aus (Blitz + Sternfunken).
 *
 * Der Charakter ist ein Render; das Logo im Objektiv ist immer das echte
 * SVG als Overlay. Reduced Motion: keine Zeigerkopplung, kein Schweben,
 * nur ein sanfter Blitz beim Klick.
 */

const clamp = (v: number, lo = -1, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const smoothEase = (t: number) => smooth(clamp(t, 0, 1));

// Position der Linse im Bühnen-Koordinatensystem (-1..1), Desktop-Render.
const EYE = { x: -0.02, y: -0.2 };

const SPRING = {
  eye: { stiffness: 320, damping: 26, mass: 0.6 },
  head: { stiffness: 110, damping: 20, mass: 1 },
  body: { stiffness: 55, damping: 18, mass: 1.4 },
  lean: { stiffness: 140, damping: 22 },
  magnet: { stiffness: 220, damping: 22 },
};

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

/** Karte, die dem Zeiger leicht entgegenkommt (nur Maus/Trackpad). */
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
  // Alle drei Flags starten wie auf dem Server (false) und ziehen im Effekt
  // nach: keine Hydration-Abweichung, auch nicht bei Reduced Motion.
  const reduce = useMediaFlag("(prefers-reduced-motion: reduce)");
  const coarse = useMediaFlag("(pointer: coarse)");
  const wide = useMediaFlag("(min-width: 1024px)");
  const stageRef = useRef<HTMLDivElement>(null);
  const live = !reduce; // Zeiger-/Idle-Kopplung aktiv
  const pointer = live && !coarse; // echte Maus über der Bühne möglich

  /* ---------------- Ziel & drei Federn ---------------- */
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const ex = useSpring(tx, SPRING.eye);
  const ey = useSpring(ty, SPRING.eye);
  const hx = useSpring(tx, SPRING.head);
  const hy = useSpring(ty, SPRING.head);
  const bx = useSpring(tx, SPRING.body);
  const by = useSpring(ty, SPRING.body);

  // Lehnen in die Bewegungsrichtung: aus der Kopf-Geschwindigkeit
  const vel = useVelocity(hx);
  const lean = useSpring(useTransform(vel, (v) => clamp(v * 0.55, -2.5, 2.5)), SPRING.lean);

  /* ---------------- Körper: Versatz, 3D-Kippung, Lehnen ---------------- */
  const bodyTX = useTransform(bx, (v) => v * 10);
  const bodyTY = useTransform(by, (v) => v * 6);
  const bodyRX = useTransform(by, (v) => v * -2.5);
  const bodyRY = useTransform(bx, (v) => v * 5);
  const bodyTransform = useMotionTemplate`translate3d(${bodyTX}px, ${bodyTY}px, 0) rotateX(${bodyRX}deg) rotateY(${bodyRY}deg) rotate(${lean}deg)`;

  /* ---------------- Kopf: Ansichten-Überblendung ---------------- */
  // Weiche Fenster statt linearer Mischung: die Drehung „rastet" spürbar.
  const oL = useTransform(hx, (v) => (wide ? smoothEase((v + 0.2) / -0.55) : 0));
  const oR = useTransform(hx, (v) => (wide ? smoothEase((v - 0.2) / 0.55) : 0));
  const oC = useTransform([oL, oR], ([l, r]: number[]) => 1 - Math.max(l, r));

  /* ---------------- Auge: Blick, Versatz mit der Ansicht, Fokus ---------------- */
  // Blickrichtung relativ zur Linse, auf eine Ellipse begrenzt.
  const gaze = useTransform([ex, ey], ([x, y]: number[]) => {
    let gx = (x - EYE.x) / 0.9;
    let gy = (y - EYE.y) / 0.8;
    const m = Math.hypot(gx, gy);
    if (m > 1) {
      gx /= m;
      gy /= m;
    }
    return [gx, gy] as const;
  });
  const gazeX = useTransform(gaze, (g) => g[0] * 9);
  const gazeY = useTransform(gaze, (g) => g[1] * 7);
  // Linse wandert mit der Kopfansicht: Anteil der eigenen Breite
  // (Kalibrierung: 44.5 % / 48.9 % / 58.1 % Container bei 8.6 % Augenbreite).
  const eyeShift = useTransform([oL, oR], ([l, r]: number[]) => -51 * l + 107 * r);
  const eyeRY = useTransform(hx, (v) => (wide ? v * 22 : v * 10));
  const eyeTransform = useMotionTemplate`translate3d(calc(${eyeShift}% + ${gazeX}px), ${gazeY}px, 0) rotateY(${eyeRY}deg)`;

  // Glanzpunkt läuft dem Blick entgegen: verkauft die Glasfläche.
  const glintX = useTransform(gazeX, (v) => v * -0.6);
  const glintY = useTransform(gazeY, (v) => v * -0.6);
  const glintTransform = useMotionTemplate`translate3d(${glintX}px, ${glintY}px, 0)`;

  // Fokus: je näher der Zeiger an der Linse, desto stärker leuchtet sie.
  const focus = useTransform([ex, ey], ([x, y]: number[]) => {
    const d = Math.hypot(x - EYE.x, (y - EYE.y) * 1.3);
    return 1 - clamp((d - 0.1) / 0.35, 0, 1);
  });
  const focusGlow = useTransform(focus, [0, 1], [0, 0.9]);
  const focusScale = useTransform(focus, [0, 1], [1, 1.07]);
  const glintOpacity = useTransform(focus, [0, 1], [0.35, 0.95]);
  const starTransform = useMotionTemplate`scale(${focusScale})`;

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

  /* ---------------- Zeiger über der Bühne ---------------- */
  const rectRef = useRef<DOMRect | null>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!pointer) return;
    const el = stageRef.current;
    if (!el) return;
    const measure = () => (rectRef.current = el.getBoundingClientRect());
    const onEnter = () => {
      measure();
      setHovering(true);
    };
    const onMove = (e: PointerEvent) => {
      const r = rectRef.current ?? measure();
      tx.set(clamp(((e.clientX - r.left) / r.width) * 2 - 1));
      ty.set(clamp(((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const onLeave = () => setHovering(false);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("scroll", measure, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", measure);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [pointer, tx, ty]);

  /* ---------------- Umschauen, wenn niemand interagiert ---------------- */
  // Desktop ohne Zeiger über der Bühne und Touch ohne Neigungssensor:
  // ruhige, nicht periodische Blickwanderung. Auf dem Desktop kehrt WITCH
  // erst kurz zur Mitte zurück, bevor er sich wieder umschaut.
  useEffect(() => {
    if (!live || (pointer && hovering)) return;
    let raf = 0;
    let tilt = false;
    const t0 = performance.now();
    const amp = coarse ? 1 : 0.55;
    const delay = pointer ? 1400 : 0;
    const loop = (now: number) => {
      const t = (now - t0 - delay) / 1000;
      if (t < 0) {
        tx.set(0);
        ty.set(0);
      } else {
        const ramp = smoothEase(t / 2.5);
        tx.set((Math.sin(t * 0.35) * 0.5 + Math.sin(t * 0.13 + 1.7) * 0.25) * amp * ramp);
        ty.set(Math.sin(t * 0.27 + 0.6) * 0.3 * amp * ramp);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      if (!tilt) {
        tilt = true;
        cancelAnimationFrame(raf);
      }
      tx.set(clamp(e.gamma / 30));
      ty.set(clamp((e.beta - 45) / 30));
    };
    const D = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> } | undefined;
    if (coarse && D && typeof D.requestPermission !== "function") {
      window.addEventListener("deviceorientation", onTilt, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, [live, pointer, hovering, coarse, tx, ty]);

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

  const easeOut = [0.23, 1, 0.32, 1] as const;

  return (
    <div
      ref={stageRef}
      className="relative overflow-hidden rounded-[32px] bg-deep shadow-lift md:rounded-[40px]"
    >
      {/* Bühnen-Glow folgt dem Kopf */}
      <motion.div aria-hidden="true" className="absolute inset-0" style={live ? { background: glow } : undefined} />

      {/* ---------- Der Charakter ---------- */}
      <div className="witch-stage relative mx-auto aspect-[4/5] w-full max-w-[560px] [perspective:1000px] sm:max-w-[640px] lg:aspect-[16/9] lg:max-w-none">
        <div className={`h-full w-full ${live ? "animate-float" : ""}`}>
          <motion.div
            className="relative h-full w-full will-change-transform"
            style={live ? { transform: bodyTransform } : undefined}
            animate={shot && !reduce ? { scale: [1, 0.992, 1.004, 1] } : { scale: 1 }}
            transition={{ duration: 0.36, ease: easeOut }}
          >
            <motion.div className="h-full w-full will-change-[opacity]" style={pointer ? { opacity: oC } : undefined}>
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
            </motion.div>

            {/* Seitenansichten: nur Desktop mit Maus, per Kopf-Feder eingeblendet */}
            {pointer && (
              <>
                <motion.picture className="absolute inset-0 hidden will-change-[opacity] lg:block" style={{ opacity: oL }} aria-hidden="true">
                  <source type="image/avif" srcSet="/mascot/witch-wide-left.avif" />
                  <img src="/mascot/witch-wide-left.webp" alt="" className="h-full w-full object-cover" loading="eager" decoding="async" />
                </motion.picture>
                <motion.picture className="absolute inset-0 hidden will-change-[opacity] lg:block" style={{ opacity: oR }} aria-hidden="true">
                  <source type="image/avif" srcSet="/mascot/witch-wide-right.avif" />
                  <img src="/mascot/witch-wide-right.webp" alt="" className="h-full w-full object-cover" loading="eager" decoding="async" />
                </motion.picture>
              </>
            )}

            {/* Echtes Logo als leuchtendes Auge: Blick, Fokus, Blinzeln */}
            <motion.div
              className="absolute will-change-transform"
              style={{
                left: "var(--eye-x)",
                top: "var(--eye-y)",
                width: "var(--eye-s)",
                marginLeft: "calc(var(--eye-s) / -2)",
                marginTop: "calc(var(--eye-s) / -2)",
                transform: live ? eyeTransform : undefined,
              }}
            >
              {/* Fokus-Leuchten hinter dem Stern */}
              <motion.div
                aria-hidden="true"
                className="absolute -inset-[35%] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.85),rgba(139,92,246,0)_65%)]"
                style={live ? { opacity: focusGlow } : { opacity: 0 }}
              />
              {/* Iris: Blinzeln + Verschluss beim Klick */}
              <motion.div
                className="relative"
                animate={
                  reduce
                    ? undefined
                    : shot
                      ? { opacity: [1, 0.1, 1, 1], scale: [1, 0.55, 1.18, 1] }
                      : { opacity: [1, 1, 0.15, 1, 1], scale: [1, 1, 0.82, 1, 1] }
                }
                transition={
                  shot
                    ? { duration: 0.5, times: [0, 0.25, 0.6, 1], ease: easeOut }
                    : { duration: 0.7, times: [0, 0.42, 0.5, 0.58, 1], repeat: Infinity, repeatDelay: 3.8, ease: "easeInOut" }
                }
              >
                <motion.div style={live ? { transform: starTransform } : undefined}>
                  <BrandStar
                    size={999}
                    className="h-auto w-full [filter:drop-shadow(0_0_6px_rgba(255,255,255,0.55))_drop-shadow(0_0_18px_rgba(139,92,246,0.9))]"
                  />
                </motion.div>
              </motion.div>
              {/* Glanzpunkt auf der Linse */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute left-[18%] top-[14%] h-[22%] w-[22%] rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.95),rgba(255,255,255,0)_70%)]"
                style={live ? { transform: glintTransform, opacity: glintOpacity } : { opacity: 0.4 }}
              />
            </motion.div>

            {/* Sternfunken beim Auslösen: fünf Logo-Arme fliegen aus der Linse */}
            {shot > 0 && !reduce && (
              <div
                key={shot}
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{ left: "var(--eye-x)", top: "var(--eye-y)" }}
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

            {/* Auslöser: die ganze Figur ist der Knopf */}
            <button
              type="button"
              onClick={shoot}
              aria-label="WITCH macht ein Foto"
              className="absolute inset-0 z-10 cursor-pointer rounded-[32px] focus-visible:outline-offset-[-6px] md:rounded-[40px]"
            />
          </motion.div>
        </div>
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
