"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Arrow, ARROW_COLORS, ARROW_PATH } from "./arrows";
import { ARROW_TARGETS } from "./arrowTargets";

/**
 * Signature-Sektion: Beim Scrollen setzen sich die fünf Pfeile aus einer
 * „explodierten" Anordnung zum Netwitcher-Stern zusammen – und zerfallen
 * beim Zurückscrollen wieder. Jeder Pfeil ist ein Link zur Kategorie.
 */

const EXPLODED = [
  { x: -220, y: -160, r: -80 },
  { x: 240, y: -120, r: 95 },
  { x: 260, y: 140, r: -60 },
  { x: -40, y: 220, r: 120 },
  { x: -260, y: 90, r: 70 },
];

function AssemblyArrow({
  index,
  progress,
}: {
  index: number;
  progress: ReturnType<typeof useTransform<number, number>>;
}) {
  const target = ARROW_TARGETS[index];
  const angle = ((index * 72 - 90) * Math.PI) / 180;
  // Endposition im Stern (Prozent-Offset vom Zentrum, wie im Logo)
  const starX = Math.cos(angle) * 62;
  const starY = Math.sin(angle) * 62;
  const from = EXPLODED[index];

  const x = useTransform(progress, [0, 1], [from.x, starX]);
  const y = useTransform(progress, [0, 1], [from.y, starY]);
  const rotate = useTransform(progress, [0, 1], [index * 72 + from.r, index * 72]);
  const opacity = useTransform(progress, [0, 0.15, 1], [0.25, 0.7, 1]);

  return (
    <motion.div className="absolute left-1/2 top-1/2" style={{ x, y, rotate, opacity }}>
      <Link
        href={target.href}
        aria-label={`${target.label} entdecken`}
        className="group block -translate-x-1/2 -translate-y-1/2 rounded-2xl"
      >
        <Arrow
          color={target.color}
          size={92}
          className="transition-transform duration-300 group-hover:scale-110"
          style={{
            filter: `drop-shadow(0 0 12px ${ARROW_COLORS[target.color]}66)`,
          }}
        />
      </Link>
    </motion.div>
  );
}

export function ArrowAssembly() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "center 45%"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const glowOpacity = useTransform(progress, [0.85, 1], [0, 1]);

  return (
    <div ref={ref}>
      <div className="relative mx-auto h-[420px] max-w-lg" aria-hidden={reduce ? undefined : false}>
        <motion.div
          style={reduce ? { opacity: 1 } : { opacity: glowOpacity }}
          className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/25 blur-3xl"
          aria-hidden="true"
        />
        {reduce ? (
          // Reduced motion: fertiger Stern, sofort sichtbar & klickbar
          ARROW_TARGETS.map((t, i) => {
            const angle = ((i * 72 - 90) * Math.PI) / 180;
            return (
              <div
                key={t.color}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(${Math.cos(angle) * 62}px, ${
                    Math.sin(angle) * 62
                  }px) rotate(${i * 72}deg)`,
                }}
              >
                <Link
                  href={t.href}
                  aria-label={`${t.label} entdecken`}
                  className="block -translate-x-1/2 -translate-y-1/2"
                >
                  <Arrow color={t.color} size={92} />
                </Link>
              </div>
            );
          })
        ) : (
          ARROW_TARGETS.map((t, i) => (
            <AssemblyArrow key={t.color} index={i} progress={progress} />
          ))
        )}
      </div>

      <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {ARROW_TARGETS.map((t) => (
          <li key={t.color}>
            <Link
              href={t.href}
              className="group inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-snow"
            >
              <svg width="14" height="14" viewBox="0 0 100 100" aria-hidden="true">
                <path d={ARROW_PATH} fill={ARROW_COLORS[t.color]} />
              </svg>
              {t.label}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
