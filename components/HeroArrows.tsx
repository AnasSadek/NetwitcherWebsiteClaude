"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Arrow, ARROW_COLORS } from "./arrows";
import { ARROW_TARGETS } from "./arrowTargets";

/**
 * Interaktive Logo-Pfeile im Hero:
 * – schweben in Idle-Loops, folgen der Maus mit Parallax (useSpring)
 * – Hover: Glow + Tooltip mit Kategoriename
 * – Klick/Enter: Navigation zur jeweiligen Service-Kategorie
 * – reduced motion: statischer Stern, Links bleiben bedienbar
 */

// Grundlayout: Stern-Anordnung (Arm i bei Winkel i*72° − 90°), leicht aufgelockert
const LAYOUT = ARROW_TARGETS.map((t, i) => {
  const angle = ((i * 72 - 90) * Math.PI) / 180;
  return {
    ...t,
    x: Math.cos(angle) * 34,
    y: Math.sin(angle) * 34,
    rotation: i * 72,
    parallax: 0.025 + i * 0.011,
    floatDuration: 6 + i * 0.8,
    size: 88 - (i % 2) * 10,
  };
});

function HeroArrow({
  item,
  mx,
  my,
}: {
  item: (typeof LAYOUT)[number];
  mx: ReturnType<typeof useSpring>;
  my: ReturnType<typeof useSpring>;
}) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const px = useTransform(mx, (v: number) => v * item.parallax * 100);
  const py = useTransform(my, (v: number) => v * item.parallax * 100);
  const rot = useTransform(mx, (v: number) => item.rotation + v * 6);

  return (
    <div
      className="absolute"
      style={{ left: `${50 + item.x}%`, top: `${50 + item.y}%` }}
    >
      <div style={{ transform: "translate(-50%, -50%)" }}>
        <motion.div style={reduce ? undefined : { x: px, y: py }}>
        <motion.div
          animate={
            reduce
              ? undefined
              : { y: [0, -12, 0], transition: { duration: item.floatDuration, repeat: Infinity, ease: "easeInOut" } }
          }
        >
          <Link
            href={item.href}
            aria-label={`${item.label} entdecken`}
            className="group relative block rounded-2xl"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
          >
            <motion.div
              style={reduce ? { rotate: item.rotation } : { rotate: rot }}
              animate={{ scale: hovered ? 1.14 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <Arrow
                color={item.color}
                size={item.size}
                style={{
                  filter: hovered
                    ? `drop-shadow(0 0 22px ${ARROW_COLORS[item.color]})`
                    : `drop-shadow(0 0 8px ${ARROW_COLORS[item.color]}55)`,
                  transition: "filter .25s ease",
                }}
              />
            </motion.div>
            <span
              className={`pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-night-800/95 px-3 py-1.5 font-heading text-[11px] font-bold tracking-wide text-snow transition-opacity duration-200 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            >
              {item.label} →
            </span>
          </Link>
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export function HeroArrows({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mx = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const my = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      className={`relative ${className}`}
      role="navigation"
      aria-label="Service-Kategorien über die Logo-Pfeile"
    >
      {/* zentraler Glow hinter dem Stern */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/20 blur-3xl"
      />
      {LAYOUT.map((item) => (
        <HeroArrow key={item.color} item={item} mx={mx} my={my} />
      ))}
    </div>
  );
}
