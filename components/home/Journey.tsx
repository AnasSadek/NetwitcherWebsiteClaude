"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";

/**
 * „Vom Blick zum Klick" — der Weg, den jede Marke bei uns geht.
 * Vier Stationen an einer Linie, die sich beim Erscheinen zeichnet.
 * Die Pfeil-Bullets sind die echten Logo-Arme in Erzählreihenfolge.
 */

const STEPS: { color: keyof typeof ARROW_COLORS; title: string; copy: string }[] = [
  {
    color: "pink",
    title: "Auffallen",
    copy: "Konzept und Produktion: Fotos, Reels und Videos, die im Feed stoppen.",
  },
  {
    color: "sky",
    title: "Verbreiten",
    copy: "Social Media und Ads bringen den Content zu den richtigen Menschen.",
  },
  {
    color: "mint",
    title: "Ankommen",
    copy: "Website, Landingpage oder Shop: ein Ziel, das aus Besuch Absicht macht.",
  },
  {
    color: "violet",
    title: "Bewirken",
    copy: "Anfragen, Termine, Verkäufe. Messbar, nicht gefühlt.",
  },
];

export function Journey() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { rootMargin: "100000px 0px -80px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative bg-paper-2 py-24 md:py-32" aria-labelledby="journey">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="journey" className="font-boxi text-3xl leading-[1.1] text-ink md:text-5xl">
              VOM BLICK
              <br />
              ZUM KLICK.
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-ink-2">
              Kein Bauchladen, ein Weg. Jede Leistung zahlt auf die nächste
              Station ein.
            </p>
          </div>
        </Reveal>

        <div ref={ref} className="relative mt-14">
          {/* Verbindungslinie, zeichnet sich einmal */}
          <div
            aria-hidden="true"
            className="absolute left-[13px] top-4 hidden h-[3px] w-[calc(100%-26px)] origin-left rounded-full brand-sweep md:block"
            style={{
              transform: drawn || reduce ? "scaleX(1)" : "scaleX(0)",
              transition: reduce ? "none" : "transform 1100ms cubic-bezier(0.23,1,0.32,1) 150ms",
            }}
          />
          <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={0.12 + i * 0.14} className="relative">
                <div className="flex items-center gap-3 md:block">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-paper-2">
                    <svg width="22" height="22" viewBox="0 0 100 100" aria-hidden="true">
                      <path d={ARROW_PATH} fill={ARROW_COLORS[s.color]} transform="rotate(90 50 50)" />
                    </svg>
                  </span>
                  <h3 className="font-heading text-xl font-extrabold tracking-tight text-ink md:mt-5">
                    <span className="mr-2 text-sm font-bold text-ink-3">0{i + 1}</span>
                    {s.title}
                  </h3>
                </div>
                <p className="mt-3 max-w-[17rem] text-[15px] leading-relaxed text-ink-2">
                  {s.copy}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
