"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Scroll-Reveal-Wrapper: blendet Inhalte beim Erscheinen im Viewport weich ein.
 *
 * Bewusst per eigenem IntersectionObserver statt whileInView: Wer per Anker
 * oder schnellem Sprung ÜBER ein Element hinweg landet, würde es mit
 * whileInView(once) nie zu sehen bekommen. Hier gilt: einmal im oder oberhalb
 * des Viewports gewesen -> sichtbar, für immer.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Bereits passiert (Sprung/Anker)? Sofort zeigen.
    if (el.getBoundingClientRect().top < window.innerHeight - 60) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      // Nach oben unbegrenzt: auch ein Element, ÜBER das man gesprungen ist,
      // schneidet die erweiterte Root-Fläche und wird sichtbar.
      { rootMargin: "100000px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = motion[as];
  return (
    <Comp
      ref={ref as never}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Comp>
  );
}
