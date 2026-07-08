"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ButtonLink } from "@/components/Button";
import { StarMark } from "@/components/arrows";
import { whatsappHref } from "@/lib/site";

const StoryScene = dynamic(() => import("@/components/three/StoryScene"), {
  ssr: false,
  loading: () => null,
});

/* ------------------------------------------------------------------ */
/* Szenen-Overlays: minimale deutsche Labels, die Visuals erzählen     */
/* ------------------------------------------------------------------ */

function Overlay({
  progress,
  range,
  align = "center",
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  align?: "center" | "left" | "bottomleft" | "bottom";
  children: React.ReactNode;
}) {
  const [a, b] = range;
  const fade = 0.22 * (b - a);
  // Szene 1 (a=0) ist beim Laden sofort sichtbar
  const opacity = useTransform(
    progress,
    a === 0 ? [0, b - fade, b] : [a, a + fade, b - fade, b],
    a === 0 ? [1, 1, 0] : [0, 1, 1, 0]
  );
  const y = useTransform(progress, [a, a + fade], a === 0 ? [0, 0] : [28, 0]);
  const alignCls =
    align === "center"
      ? "items-center justify-center text-center"
      : align === "left"
        ? "items-center justify-start pl-[6vw] text-left"
        : align === "bottom"
          ? "items-end justify-center pb-[9vh] text-center"
          : "items-end justify-start pb-[12vh] pl-[6vw] text-left";
  return (
    <motion.div
      style={{ opacity, y }}
      className={`pointer-events-none absolute inset-0 flex px-5 ${alignCls}`}
    >
      <div className="pointer-events-auto max-w-3xl">{children}</div>
    </motion.div>
  );
}

function Label({ children, color = "text-mist" }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className={`inline-block rounded-full border border-line bg-night/70 px-4 py-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur ${color}`}
    >
      {children}
    </span>
  );
}

function SceneTitle({ children, size = "md" }: { children: React.ReactNode; size?: "md" | "lg" }) {
  return (
    <h2
      className={`font-heading font-extrabold tracking-tight drop-shadow-[0_2px_20px_rgba(6,6,15,.9)] ${
        size === "lg" ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl"
      }`}
    >
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* Statischer Fallback (reduced motion / kein WebGL)                   */
/* ------------------------------------------------------------------ */

function StaticStory() {
  const blocks = [
    { title: "Viele Inhalte. Wenig Wirkung.", labels: ["Aufmerksamkeit ohne Richtung"] },
    { title: "Ein System statt Zufall.", labels: ["Content", "Attention", "Trust", "Campaign", "Lead"] },
    { title: "Studio Berlin", labels: ["Produktfotografie", "Reels", "Video Production", "Content Creation"] },
    { title: "Kampagnen, die liefern.", labels: ["Meta Ads", "TikTok Ads", "Google Ads", "Performance Marketing"] },
    { title: "Digitale Erlebnisse.", labels: ["Webdesign", "E-Commerce", "Landingpages"] },
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="aurora absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[92svh] max-w-4xl flex-col items-center justify-center px-5 pt-28 text-center">
        <StarMark size={140} />
        <h1 className="mt-10 font-heading text-4xl font-extrabold tracking-tight md:text-6xl">
          Content. Kampagnen. <span className="text-gradient">Conversion.</span>
        </h1>
        <p className="mt-4 font-heading text-xs font-medium uppercase tracking-[0.3em] text-mist">
          Netwitcher · Studio Berlin
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/kontakt#termin">Erstgespräch buchen</ButtonLink>
          <ButtonLink href="/studio" variant="warm">Studio entdecken</ButtonLink>
        </div>
      </div>
      <div className="relative mx-auto max-w-4xl space-y-16 px-5 pb-24 text-center">
        {blocks.map((block) => (
          <div key={block.title}>
            <h2 className="font-heading text-2xl font-extrabold md:text-3xl">{block.title}</h2>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {block.labels.map((label) => (
                <Label key={label}>{label}</Label>
              ))}
            </div>
          </div>
        ))}
        <div>
          <h2 className="font-heading text-3xl font-extrabold md:text-4xl">
            Aus Aufmerksamkeit werden <span className="text-gradient">Anfragen</span>.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/kontakt">Projekt starten</ButtonLink>
            <ButtonLink href="/kontakt#termin" variant="secondary">Erstgespräch buchen</ButtonLink>
            <ButtonLink href="/kontakt?service=Fotoshooting" variant="warm">Studio anfragen</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Haupt-Story: 700vh-Scroll, fixe 3D-Bühne, Szenen-Overlays           */
/* ------------------------------------------------------------------ */

export function Story() {
  const reduce = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setWebgl(!!(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (reduce || webgl === false) {
    return <StaticStory />;
  }

  return (
    <section ref={containerRef} className="relative" style={{ height: "700vh" }} aria-label="Von Aufmerksamkeit zu Conversion">
      <div className="sticky top-0 h-screen overflow-hidden">
        {webgl && <StoryScene progress={progressRef} mouse={mouseRef} />}

        {/* Szene 1 · Attention */}
        <Overlay progress={scrollYProgress} range={[0, 0.13]}>
          <p className="mb-5 font-heading text-[11px] font-medium uppercase tracking-[0.35em] text-mint">
            Netwitcher · Studio Berlin
          </p>
          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight drop-shadow-[0_2px_20px_rgba(6,6,15,.9)] sm:text-5xl md:text-7xl">
            Content. Kampagnen.
            <br />
            <span className="text-gradient">Conversion.</span>
          </h1>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/kontakt#termin">Erstgespräch buchen</ButtonLink>
            <ButtonLink href="/studio" variant="secondary">Studio entdecken</ButtonLink>
          </div>
          <p className="mt-12 animate-pulse font-heading text-[10px] uppercase tracking-[0.3em] text-mist">
            Scrollen ↓
          </p>
        </Overlay>

        {/* Szene 2 · Chaos */}
        <Overlay progress={scrollYProgress} range={[0.15, 0.27]}>
          <SceneTitle>
            Viele Inhalte. <span className="text-mist">Wenig Wirkung.</span>
          </SceneTitle>
          <div className="mt-5"><Label>Aufmerksamkeit ohne Richtung</Label></div>
        </Overlay>

        {/* Szene 3 · System */}
        <Overlay progress={scrollYProgress} range={[0.29, 0.41]}>
          <SceneTitle>
            Ein <span className="text-gradient">System</span> statt Zufall.
          </SceneTitle>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {["Content", "Attention", "Trust", "Campaign", "Lead"].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-3">
                <Label color="text-snow">{step}</Label>
                {i < arr.length - 1 && <span aria-hidden="true" className="text-violet">→</span>}
              </span>
            ))}
          </div>
        </Overlay>

        {/* Szene 4 · Studio Berlin */}
        <Overlay progress={scrollYProgress} range={[0.44, 0.57]} align="bottomleft">
          <SceneTitle size="lg">
            <span className="text-gradient-warm">Studio</span> Berlin
          </SceneTitle>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Produktfotografie", "Reels", "Video Production", "Content Creation"].map((label) => (
              <Label key={label} color="text-pink">{label}</Label>
            ))}
          </div>
          <div className="mt-6">
            <ButtonLink href="/studio" variant="warm" className="!px-5 !py-2.5 !text-xs">
              Studio ansehen
            </ButtonLink>
          </div>
        </Overlay>

        {/* Szene 5 · Campaigns */}
        <Overlay progress={scrollYProgress} range={[0.6, 0.71]} align="bottomleft">
          <SceneTitle>Kampagnen, die liefern.</SceneTitle>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Meta Ads", "TikTok Ads", "Google Ads", "Performance Marketing"].map((label) => (
              <Label key={label} color="text-sky">{label}</Label>
            ))}
          </div>
        </Overlay>

        {/* Szene 6 · Web */}
        <Overlay progress={scrollYProgress} range={[0.74, 0.85]} align="bottomleft">
          <SceneTitle>Digitale Erlebnisse.</SceneTitle>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Webdesign", "E-Commerce", "Landingpages"].map((label) => (
              <Label key={label} color="text-mint">{label}</Label>
            ))}
          </div>
        </Overlay>

        {/* Szene 7 · Conversion */}
        <Overlay progress={scrollYProgress} range={[0.88, 1]} align="bottom">
          <SceneTitle size="lg">
            Aus Aufmerksamkeit werden <span className="text-gradient">Anfragen</span>.
          </SceneTitle>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/kontakt">Projekt starten</ButtonLink>
            <ButtonLink href="/kontakt#termin" variant="secondary">Erstgespräch buchen</ButtonLink>
            <ButtonLink href={whatsappHref()} variant="whatsapp" external>WhatsApp</ButtonLink>
          </div>
          <p className="mt-6">
            <Link href="/kontakt?service=Fotoshooting" className="text-sm text-mist underline-offset-4 hover:text-snow hover:underline">
              Studio anfragen →
            </Link>
          </p>
        </Overlay>
      </div>
    </section>
  );
}
