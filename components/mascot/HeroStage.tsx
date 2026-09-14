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
import { Head3D } from "./Head3D";

// Frontale Linsenmitte in Bühnen-Anteilen (Poster witch-wide, lg-Layout);
// muss mit --eye-x/--eye-y in globals.css übereinstimmen.
const LENS_CTR = { x: 0.4923, y: 0.3936 };
// Geometrische Mitte des Kamera-Kopfs im Poster (Bühnen-Anteile, lg):
// Kopf-BBox x 0.322–0.666, y 0.144–0.530 → Drehpunkt der 3D-Ebene.
const HEAD_BOX = { cx: 0.494, cy: 0.337, w: 0.285 };
// Bewusster Abstand zwischen Kopf und Körper in Ruhelage (px): der Kopf
// schwebt sichtbar über dem Kragen — die Trennung ist Absicht, kein Fehler.
const HEAD_GAP = 12;
// Blickführung: Maximalwinkel (Grad) und Translation (px). Durch die
// weiche Sättigung (tanh) liegen die praktisch erreichten Werte bei
// ≈ 87 % davon — deutlich sichtbare 3D-Drehung, aber kontrolliert.
const ROT = { y: 34, x: 24 };
const TRAVEL = { x: 16, y: 12 };

/**
 * Die WITCH-Bühne: ein hochwertiger Charakter-Render, der auf Menschen
 * reagiert wie eine Figur, nicht wie ein Parallax-Bild.
 *
 * KOPF UND KÖRPER SIND GETRENNT — und der Kopf ist ECHTES 3D:
 * public/mascot/camera-head.glb (aus der freigegebenen Kunden-Referenz
 * multi-view-rekonstruiert) wird in einer eigenen Ebene mit three.js
 * gerendert (components/mascot/Head3D.tsx). Maus X → Yaw, Maus Y →
 * Pitch, dazu eine sekundäre Translation und weiches Zurückfedern in
 * die Mitte. Der Körper (Poster/kopflose Platte) ist zu 100 % statisch:
 * keine Transforms, kein Float, kein Parallax — nichts.
 *
 * Bis zum ersten 3D-Frame (und überall ohne echten Mauszeiger, auf
 * schmalen Viewports, bei reduced motion oder WebGL-Fehlern) steht das
 * Poster mit gemaltem Kopf — zu jedem Zeitpunkt genau EIN Kopf, nie
 * eine kopflose Figur.
 *
 * Dazu: Aufwachen beim ersten Erscheinen und „Magic in Every Click":
 * Klick/Tipp löst den Verschluss aus (Blitz + Sternfunken).
 */

const clamp = (v: number, lo = -1, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const smoothEase = (t: number) => smooth(clamp(t, 0, 1));
// Weiche Sättigung: nahe der Linse fein aufgelöst, am Bildschirmrand ≈ ±0.87.
const soft = (v: number) => Math.tanh(v * 1.35);

/** Ab wann WITCH sich auf Touch-Geräten wieder selbst umschaut (ms). */
const IDLE_AFTER = { touch: 1500 };

const SPRING = {
  eye: { stiffness: 320, damping: 26, mass: 0.6 },
  head: { stiffness: 120, damping: 17, mass: 0.9 },
  body: { stiffness: 55, damping: 18, mass: 1.4 },
  lean: { stiffness: 140, damping: 22 },
  magnet: { stiffness: 220, damping: 22 },
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

type Phase = "asleep" | "waking" | "awake";

export function HeroStage() {
  const reduce = useMediaFlag("(prefers-reduced-motion: reduce)");
  const coarse = useMediaFlag("(pointer: coarse)");
  const wide = useMediaFlag("(min-width: 1024px)");
  const live = !reduce; // Kopplung an Eingaben aktiv
  const pointer = live && !coarse; // echte Maus vorhanden

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
  const lean = useSpring(useTransform(vel, (v) => clamp(v * 0.4, -1.8, 1.8)), SPRING.lean);

  /* ---------------- Kopf: eigene 3D-Ebene, schaut zum Cursor ---------------- */
  // Nur Desktop mit echter Maus: das GLB dreht mit echter Geometrie zum
  // Maus-Ziel. Erst wenn der 3D-Kopf seinen ersten Frame gezeichnet hat,
  // ersetzt die kopflose Platte das Poster — sonst stünde WITCH kurz
  // ohne Kopf.
  const head3d = pointer && wide;
  const [headReady, setHeadReady] = useState(false);
  const onHeadReady = useCallback(() => setHeadReady(true), []);
  // Maus X → Yaw, Maus Y → Pitch (echte Rotation, dominanter Effekt)
  const yawDeg = useTransform(hx, (v) => v * ROT.y);
  const pitchDeg = useTransform(hy, (v) => -v * ROT.x);
  // Sekundär: der Kopf folgt dem Cursor auch positionsgetreu und schwebt
  // in Ruhe mit HEAD_GAP über dem Kragen.
  const headTX = useTransform(hx, (v) => (head3d ? v * TRAVEL.x : 0));
  const headTY = useTransform(hy, (v) => (head3d ? -HEAD_GAP + v * TRAVEL.y : 0));
  const headTilt = useMotionTemplate`translate3d(${headTX}px, ${headTY}px, 0) rotate(${lean}deg)`;

  /* ---------------- Auge: Blick, Versatz mit der Ansicht, Fokus ---------------- */
  // Das Ziel ist bereits relativ zur Linse; hier nur auf eine Ellipse
  // begrenzt, damit Diagonalen nicht überschießen. (Der Glanzpunkt läuft
  // nur im statischen Poster-Modus — der 3D-Kopf bringt echtes Licht mit.)
  const gaze = useTransform([ex, ey], ([x, y]: number[]) => {
    let gx = x / 0.9;
    let gy = y / 0.8;
    const m = Math.hypot(gx, gy);
    if (m > 1) {
      gx /= m;
      gy /= m;
    }
    return [gx, gy] as const;
  });
  const gazeX = useTransform(gaze, (g) => g[0] * 9);
  const gazeY = useTransform(gaze, (g) => g[1] * 7);
  const eyeTransform = useMotionTemplate`translate3d(${gazeX}px, ${gazeY}px, 0)`;

  // Glanzpunkt läuft dem Blick entgegen: verkauft die Glasfläche.
  const glintX = useTransform(gazeX, (v) => v * -0.6);
  const glintY = useTransform(gazeY, (v) => v * -0.6);
  const glintTransform = useMotionTemplate`translate3d(${glintX}px, ${glintY}px, 0)`;

  // Fokus: je näher das Ziel an der Linse, desto kräftiger der Glanzpunkt.
  const focus = useTransform([ex, ey], ([x, y]: number[]) => {
    const d = Math.hypot(x, y * 1.3);
    return 1 - clamp((d - 0.08) / 0.3, 0, 1);
  });
  const glintOpacity = useTransform(focus, [0, 1], [0.4, 0.85]);

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

  /* ---------------- Gemeinsames: Linsenposition, Blickziel, Idle-Timer ---------------- */
  const charRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef({ x: 0, y: 0 });
  const lastRef = useRef({ x: 0, y: 0 });
  const idleTimer = useRef(0);
  const [idle, setIdle] = useState(false);

  // Echte Bildschirmposition der Linse (CSS-Variablen der Kalibrierung).
  const measureLens = useCallback(() => {
    const el = charRef.current;
    if (!el) return lensRef.current;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const fx = parseFloat(cs.getPropertyValue("--eye-x")) / 100 || 0.49;
    const fy = parseFloat(cs.getPropertyValue("--eye-y")) / 100 || 0.4;
    lensRef.current = { x: r.left + r.width * fx, y: r.top + r.height * fy };
    return lensRef.current;
  }, []);

  // Blick auf einen Bildschirmpunkt richten: normiert auf halbe
  // Viewportgröße, weich gesättigt.
  const lookAt = useCallback(
    (clientX: number, clientY: number) => {
      const { x, y } = lensRef.current;
      const nx = soft((clientX - x) / (window.innerWidth / 2));
      const ny = soft((clientY - y) / (window.innerHeight / 2));
      tx.set(nx);
      ty.set(ny);
      lastRef.current = { x: nx, y: ny };
    },
    [tx, ty]
  );

  const armIdle = useCallback((ms: number) => {
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), ms);
  }, []);

  const wake = useCallback(
    (ms: number) => {
      setIdle(false);
      armIdle(ms);
    },
    [armIdle]
  );

  useEffect(() => () => window.clearTimeout(idleTimer.current), []);

  // Ohne jede Eingabe (Touch vor der ersten Berührung) startet das Umschauen sofort.
  useEffect(() => {
    if (!live) return;
    if (!pointer) setIdle(true);
  }, [live, pointer]);

  /* ---------------- Maus: der Kopf schaut zum Cursor im Hero-Bereich ---------------- */
  // Innerhalb der Bühne (plus etwas Rand) folgt der Kopf dem Cursor;
  // verlässt er sie — oder scrollt sie aus dem Bild — kehrt der Kopf über
  // die Federn weich in die neutrale Mitte zurück. Kein Idle-Wandern am
  // Desktop: die Mitte IST der Ruhezustand.
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
        lastRef.current = { x: 0, y: 0 };
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      aim();
    };
    // Beim Scrollen wandert die Bühne unter dem stehenden Cursor weg:
    // Innen/Außen und Blick aus der letzten Cursorposition nachführen.
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

  /* ---------------- Finger: während der Berührung, auch beim Scrollen ---------------- */
  const touching = useRef(false);
  useEffect(() => {
    if (!live) return;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      touching.current = true;
      measureLens();
      lookAt(t.clientX, t.clientY);
      wake(IDLE_AFTER.touch);
    };
    const onMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      measureLens();
      lookAt(t.clientX, t.clientY);
      wake(IDLE_AFTER.touch);
    };
    const onEnd = () => {
      touching.current = false;
      armIdle(IDLE_AFTER.touch);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [live, measureLens, lookAt, wake, armIdle]);

  /* ---------------- Scrollen ohne Maus: dorthin schauen, wo gelesen wird ---------------- */
  // Blickziel = Mitte des Viewports relativ zur Linse, plus ein kurzer
  // Blick in Scrollrichtung (aus der Scrollgeschwindigkeit). Läuft nur
  // nach, wenn kein Finger auf dem Schirm ist (Momentum-Scrollen).
  useEffect(() => {
    if (!live || pointer) return;
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      if (touching.current) return;
      const now = performance.now();
      const dt = Math.max(16, now - lastT);
      const v = ((window.scrollY - lastY) / dt) * 1000; // px/s
      lastY = window.scrollY;
      lastT = now;
      const { y } = measureLens();
      const vh = window.innerHeight;
      const ny = soft((vh / 2 - y) / (vh / 2)) + clamp(v / 2600, -0.3, 0.3);
      const nx = lastRef.current.x * 0.85;
      tx.set(nx);
      ty.set(clamp(ny));
      lastRef.current = { x: nx, y: clamp(ny) };
      wake(IDLE_AFTER.touch);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [live, pointer, measureLens, wake, tx, ty]);

  /* ---------------- Umschauen, wenn niemand interagiert ---------------- */
  // Auf Touch-Geräten bewegt das nur den Glanzpunkt in der Linse (der
  // Charakter selbst steht komplett still); am Desktop übernimmt die
  // nächste Mausbewegung sofort.
  useEffect(() => {
    if (!live || !idle) return;
    let raf = 0;
    let tilt = false;
    const t0 = performance.now();
    const from = { ...lastRef.current };
    const amp = coarse ? 1.15 : 0.6;
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      const ramp = smoothEase(t / 3);
      const wx = (Math.sin(t * 0.35) * 0.5 + Math.sin(t * 0.13 + 1.7) * 0.25) * amp;
      const wy = Math.sin(t * 0.27 + 0.6) * 0.32 * amp - 0.1;
      tx.set(from.x + (wx - from.x) * ramp);
      ty.set(from.y + (wy - from.y) * ramp);
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
  }, [live, idle, coarse, tx, ty]);

  /* ---------------- Aufwachen beim ersten Erscheinen ---------------- */
  // Bis WITCH halb im Bild ist, ist die Linse dunkel. Dann zündet der
  // Glanzpunkt. (Der Körper bleibt dabei unbewegt — die Aufwach-Geste
  // lebt allein im Licht, nicht in einer Körper-Transformation.)
  const [phase, setPhase] = useState<Phase>("asleep");
  useEffect(() => {
    if (reduce) {
      setPhase("awake");
      return;
    }
    const el = charRef.current;
    if (!el || phase !== "asleep") return;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setPhase("waking");
        t = window.setTimeout(() => setPhase("awake"), 1300);
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [reduce, phase]);

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

  const awake = phase === "awake";

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-deep shadow-lift md:rounded-[40px]">
      {/* Bühnen-Glow folgt dem Kopf */}
      <motion.div aria-hidden="true" className="absolute inset-0" style={live ? { background: glow } : undefined} />

      {/* ---------- Der Charakter ---------- */}
      <div
        ref={charRef}
        className="witch-stage @container relative mx-auto aspect-[4/5] w-full max-w-[560px] [perspective:1000px] sm:max-w-[640px] lg:aspect-[16/9] lg:max-w-none"
      >
        {/* GESPERRTE INVARIANTE (siehe CLAUDE.md): Der Körper ist zu 100 %
            STATISCH — das Poster, die kopflose Platte und ALLE ihre
            Vorfahren tragen keinerlei Transforms, Animationen, Parallaxe
            oder cursorgesteuerte Bewegung. Alles, was sich bewegt, gehört
            ausschließlich auf die Kopf-Ebene unten. */}
        <div className="relative h-full w-full">
          <div className="h-full w-full">
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
          </div>

          {/* Gestalteter Unterbau des schwebenden Kopfs: das Poster mit
              oben offenem, natürlich beschattetem Kragen — der Kopf hebt
              sichtbar aus der Kapuze ab, statt aufgesetzt zu wirken */}
          {head3d && (
            <>
              <img
                src="/mascot/witch-body.webp"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                style={{ opacity: headReady ? 1 : 0 }}
              />
              {/* Statischer, subtiler Kontaktschatten im Kapuzenrand —
                  fest positioniert, feste Deckkraft: er verändert die
                  Kapuze in keiner Pose (siehe CLAUDE.md) */}
              {headReady && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(10,6,26,0.9),rgba(10,6,26,0)_68%)]"
                  style={{
                    left: "36%",
                    width: "25%",
                    top: "49.5%",
                    height: "6.5%",
                    opacity: 0.2,
                  }}
                />
              )}
            </>
          )}

          {/* Die KOPF-EBENE: alles, was sich bewegt, lebt hier — Schweben,
              Rückstoß beim Auslösen, Cursor-Verfolgung und Funken.
              Der Körper darunter bleibt pixelstabil. */}
          <div className={`pointer-events-none absolute inset-0 ${live && head3d && headReady ? "animate-float-head" : ""}`}>
            <motion.div
              className="h-full w-full"
              style={{ transformOrigin: `${LENS_CTR.x * 100}% ${LENS_CTR.y * 100}%` }}
              animate={head3d && shot && !reduce ? { scale: [1, 0.992, 1.004, 1] } : { scale: 1 }}
              transition={shot ? { duration: 0.36, ease: easeOut } : undefined}
            >
              {/* Der 3D-Kopf: Box um die Kopfregion des Posters, mit
                  Overscan, damit die rotierte Silhouette nie beschnitten
                  wird. Sichtbar erst ab dem ersten gerenderten Frame. */}
              {head3d && (
                <motion.div
                  className="absolute"
                  style={{
                    left: `${(HEAD_BOX.cx - HEAD_BOX.w / 2) * 100}%`,
                    top: `calc(${HEAD_BOX.cy * 100}% - ${(HEAD_BOX.w / 2) * 100}cqw)`,
                    width: `${HEAD_BOX.w * 100}%`,
                    aspectRatio: "1 / 1",
                    transform: headTilt,
                    opacity: headReady ? 1 : 0,
                  }}
                >
                  <div className="absolute -inset-[18%]">
                    <Head3D yaw={yawDeg} pitch={pitchDeg} enabled={head3d} onReady={onHeadReady} />
                  </div>
                </motion.div>
              )}

              {/* Glanzpunkt in der Poster-Linse — nur solange der gemalte
                  Kopf sichtbar ist (Mobil/Fallback); der 3D-Kopf bringt
                  echtes Licht und echte Reflexe mit. */}
              {!(head3d && headReady) && (
                <motion.div
                  data-witch="eye"
                  aria-hidden="true"
                  className="pointer-events-none absolute aspect-square will-change-transform"
                  style={{
                    left: "var(--eye-x)",
                    top: "var(--eye-y)",
                    width: "var(--eye-s)",
                    marginLeft: "calc(var(--eye-s) / -2)",
                    marginTop: "calc(var(--eye-s) / -2)",
                    transform: live ? eyeTransform : undefined,
                  }}
                >
                  <motion.div
                    className="absolute left-[18%] top-[14%] h-[22%] w-[22%] rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.95),rgba(255,255,255,0)_70%)]"
                    style={live ? { transform: glintTransform, opacity: awake ? glintOpacity : 0.25 } : { opacity: 0.4 }}
                  />
                </motion.div>
              )}

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
            </motion.div>
          </div>

          {/* Auslöser: die ganze Figur ist der Knopf */}
          <button
            type="button"
            onClick={shoot}
            aria-label="WITCH macht ein Foto"
            className="absolute inset-0 z-10 cursor-pointer rounded-[32px] focus-visible:outline-offset-[-6px] md:rounded-[40px]"
          />
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
