"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/Button";
import { BrandStar } from "@/components/brand/Logo";
import { whatsappHref } from "@/lib/site";

/**
 * Kapitel 07 — Conversion. Ruhig, viel Weißraum, kein Finale-Feuerwerk.
 *
 * Die einzige Stelle, an der die fünf Pfeile zur Marke zusammenlaufen:
 * sie fahren einmal aus ihren Richtungen in den echten Stern. Eine
 * Bewegung, einmal, beim Eintreten — danach steht die Marke still.
 */

// Startversatz je Arm (aus welcher Richtung er kommt) – Stern-Winkel i*72°
const ENTRY = [
  { x: 0, y: -120 },
  { x: 114, y: -37 },
  { x: 70, y: 97 },
  { x: -70, y: 97 },
  { x: -114, y: -37 },
];

export function Conversion() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [assembled, setAssembled] = useState(false);

  useEffect(() => {
    if (reduce) {
      setAssembled(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAssembled(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <section className="relative py-32 md:py-48" aria-labelledby="conversion-title">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        {/* Marke läuft zusammen, eine Bewegung, dann Ruhe */}
        <div ref={ref} className="relative mx-auto mb-14 h-[104px] w-[104px]">
          {/* Der echte Stern erscheint, sobald die Arme angekommen sind */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: assembled ? 1 : 0, transitionDelay: assembled ? "620ms" : "0ms" }}
          >
            <BrandStar size={104} />
          </div>
          {/* Anflug-Arme (nur bis der Stern steht) */}
          {!reduce &&
            ENTRY.map((e, i) => (
              <img
                key={i}
                aria-hidden="true"
                src={`/brand/arrow3d-${["mint", "violet", "pink", "sun", "sky"][i]}.png`}
                alt=""
                width={46}
                height={30}
                className="absolute left-1/2 top-1/2 w-[46px] ease-[cubic-bezier(.22,1,.36,1)]"
                style={{
                  transform: assembled
                    ? "translate(-50%,-50%) scale(.4)"
                    : `translate(calc(-50% + ${e.x}px), calc(-50% + ${e.y}px)) scale(.9)`,
                  opacity: assembled ? 0 : 0.9,
                  transition: `transform 700ms cubic-bezier(.22,1,.36,1) ${i * 55}ms, opacity 300ms linear ${420 + i * 55}ms`,
                }}
              />
            ))}
        </div>

        <h2
          id="conversion-title"
          className="font-heading text-3xl font-black leading-[1.05] tracking-tight md:text-5xl"
        >
          Was willst du als Nächstes produzieren?
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-mist">
          Erzähl uns kurz, was ansteht. Wir sagen dir ehrlich, was sich lohnt
          und was nicht.
        </p>

        {/* Eine primäre Aktion, der Rest als Textlinks */}
        <div className="mt-10 flex flex-col items-center gap-5">
          <ButtonLink href="/kontakt">Erstgespräch buchen</ButtonLink>
          <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-mist">
            <Link
              href="/kontakt?service=Fotoshooting"
              className="underline-offset-4 transition-colors hover:text-snow hover:underline"
            >
              Studio anfragen
            </Link>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 transition-colors hover:text-snow hover:underline"
            >
              WhatsApp schreiben
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
