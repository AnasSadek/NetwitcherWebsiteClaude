"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ButtonLink } from "@/components/Button";
import { FilmStatic } from "./FilmStatic";
import { SPINE_VH_DESKTOP, SPINE_VH_MOBILE } from "@/lib/film";

/**
 * „From Nothing to Attention" — die Hülle des Scroll-Films.
 *
 * Alles Kommerzielle (Headlines, CTAs, Service-Labels) ist echtes DOM und wird
 * serverseitig gerendert; der Canvas ist reine Bühne dahinter und lädt lazy.
 * prefers-reduced-motion und WebGL-Fehler fallen auf eine statische Fassung
 * derselben Erzählung zurück.
 */

const FilmCanvas = dynamic(() => import("./FilmCanvas"), { ssr: false });

class CanvasBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Overlay, dessen Sichtbarkeit direkt am Scroll hängt — dadurch umkehrbar. */
function Panel({
  progress,
  range,
  className = "",
  interactiveRange,
  hold,
  children,
}: {
  progress: MotionValue<number>;
  /** [einblenden ab, voll, voll bis, ausgeblendet] */
  range: [number, number, number, number];
  className?: string;
  /** In diesem Bereich sind CTAs klickbar. */
  interactiveRange?: [number, number];
  /** "start": schon bei p=0 sichtbar. "end": bleibt bei p=1 sichtbar. */
  hold?: "start" | "end";
  children: ReactNode;
}) {
  // Explizite stückweise lineare Abbildung — robust gegenüber Re-Renders.
  const map = (v: number, out: number[]) => {
    if (v <= range[0]) return out[0];
    if (v >= range[3]) return out[3];
    for (let i = 0; i < 3; i++) {
      if (v <= range[i + 1]) {
        const span = range[i + 1] - range[i];
        const f = span > 0 ? (v - range[i]) / span : 1;
        return out[i] + (out[i + 1] - out[i]) * f;
      }
    }
    return out[3];
  };
  const o = hold === "start" ? [1, 1, 1, 0] : hold === "end" ? [0, 1, 1, 1] : [0, 1, 1, 0];
  const yy = hold === "start" ? [0, 0, 0, -20] : hold === "end" ? [28, 0, 0, 0] : [28, 0, 0, -20];
  const opacity = useTransform(progress, (v) => map(v, o));
  const y = useTransform(progress, (v) => map(v, yy));
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const [a, b] = interactiveRange ?? [range[0], range[3]];
    const update = (v: number) => {
      if (ref.current) ref.current.style.pointerEvents = v >= a && v <= b ? "auto" : "none";
    };
    update(progress.get());
    return progress.on("change", update);
  }, [progress, interactiveRange, range]);
  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={`absolute inset-0 z-10 flex ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Film() {
  const reduce = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  const [glFailed, setGlFailed] = useState(false);
  const [inView, setInView] = useState(true);
  const [mounted, setMounted] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapper,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Canvas pausieren, sobald der Film aus dem Viewport ist
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "200px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (reduce || glFailed) {
    return <FilmStatic />;
  }

  const p = scrollYProgress;

  return (
    <div
      ref={wrapper}
      className="relative"
      style={{ height: `${mobile ? SPINE_VH_MOBILE : SPINE_VH_DESKTOP}vh` }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Bühne */}
        {mounted && (
          <CanvasBoundary onError={() => setGlFailed(true)}>
            <FilmCanvas progress={p} mobile={mobile} active={inView} />
          </CanvasBoundary>
        )}

        {/* ------ Szene 1: Niemand schaut hin ------ */}
        <Panel
          progress={p}
          range={[0, 0.001, 0.055, 0.09]}
          interactiveRange={[0, 0.08]}
          hold="start"
          className="items-center"
        >
          <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-[6vw]">
            <div className="max-w-2xl">
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.28em] text-mist">
                Content Studio &amp; Digital Agency · Berlin
              </p>
              <h1 className="mt-6 font-boxi text-[13vw] leading-[1.02] text-snow sm:text-6xl md:text-7xl xl:text-[5.2rem]">
                NIEMAND
                <br />
                SCHAUT HIN.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-mist">
                Guter Content ändert das. Foto, Video, Social Media und Ads aus
                einem Team in Berlin.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <ButtonLink href="/kontakt">Projekt starten</ButtonLink>
                <ButtonLink href="/leistungen" variant="ghost">
                  Leistungen ansehen
                </ButtonLink>
              </div>
            </div>
          </div>
        </Panel>

        {/* Scroll-Hinweis, verschwindet mit der ersten Bewegung */}
        <Panel progress={p} range={[0, 0.001, 0.01, 0.035]} hold="start" className="items-end justify-center pb-8">
          <p className="text-xs tracking-wide text-mist/80">
            Scroll, um Aufmerksamkeit zu erzeugen
          </p>
        </Panel>

        {/* ------ Szene 2: Aufmerksamkeit entsteht ------ */}
        <Panel
          progress={p}
          range={[0.1, 0.125, 0.18, 0.215]}
          interactiveRange={[0.11, 0.2]}
          className="items-center justify-end"
        >
          <div className="w-full max-w-[1600px] px-5 sm:px-8 lg:px-[6vw]">
            <div className="ml-auto max-w-md text-right">
              <h2 className="font-boxi text-4xl leading-[1.05] text-snow md:text-6xl">
                WIR MACHEN
                <br />
                MARKEN SICHTBAR.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-mist">
                Foto. Video. Reels. Creative Direction.
              </p>
              <div className="mt-7 flex justify-end">
                <ButtonLink href="/kontakt?service=Fotoshooting" variant="studio">
                  Studio-Shooting anfragen
                </ButtonLink>
              </div>
            </div>
          </div>
        </Panel>

        {/* ------ Szene 3: Kamera ------ */}
        <Panel progress={p} range={[0.225, 0.25, 0.34, 0.375]} className="items-start justify-center pt-[12vh]">
          <h2 className="font-boxi text-3xl text-snow md:text-5xl">
            MEHR ALS NUR AUFNAHME.
          </h2>
        </Panel>

        {/* ------ Szene 4: Schnitt ------ */}
        <Panel progress={p} range={[0.395, 0.42, 0.47, 0.5]} className="items-start justify-start pt-[14vh]">
          <div className="max-w-[1600px] px-5 sm:px-8 lg:px-[6vw]">
            <h2 className="max-w-xl font-boxi text-3xl leading-[1.08] text-snow md:text-5xl">
              AUS ROHMATERIAL
              <br />
              WIRD CONTENT,
              <br />
              DER FUNKTIONIERT.
            </h2>
          </div>
        </Panel>

        {/* ------ Szene 5: Formate ------ */}
        <Panel progress={p} range={[0.505, 0.525, 0.575, 0.6]} className="items-start justify-center pt-[10vh]">
          <div className="text-center">
            <h2 className="font-boxi text-4xl leading-[1.05] text-snow md:text-6xl">
              EINE IDEE.
              <br />
              VIELE FORMATE.
            </h2>
            <p className="mt-4 text-sm text-mist md:text-base">
              Content für Social Media, Ads und digitale Kampagnen.
            </p>
          </div>
        </Panel>

        {/* ------ Szene 6: Distribution ------ */}
        <Panel
          progress={p}
          range={[0.61, 0.635, 0.685, 0.71]}
          interactiveRange={[0.62, 0.7]}
          className="items-center"
        >
          <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-[6vw]">
            <div className="max-w-xl">
              <h2 className="font-boxi text-3xl leading-[1.08] text-snow md:text-5xl">
                GUTER CONTENT MUSS
                <br />
                GESEHEN WERDEN.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-mist">
                Wir produzieren ihn. Und bringen ihn zu den richtigen Menschen:
                Social Media, Meta Ads, TikTok Ads, Google Ads.
              </p>
              <div className="mt-7">
                <ButtonLink href="/kontakt?service=Ads" variant="ghost">
                  Kampagne besprechen
                </ButtonLink>
              </div>
            </div>
          </div>
        </Panel>

        {/* ------ Szene 7: Zielgruppe ------ */}
        <Panel progress={p} range={[0.715, 0.735, 0.765, 0.785]} className="items-end justify-center pb-[10vh]">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-mist">
            Relevanz statt Reichweite
          </p>
        </Panel>

        {/* ------ Szene 8: Digitales Ziel ------ */}
        <Panel progress={p} range={[0.79, 0.81, 0.845, 0.865]} className="items-center justify-end">
          <div className="w-full max-w-[1600px] px-5 sm:px-8 lg:px-[6vw]">
            <div className="ml-auto max-w-sm text-right">
              <h2 className="font-boxi text-3xl leading-[1.08] text-snow md:text-4xl">
                AUFMERKSAMKEIT
                <br />
                BRAUCHT EIN ZIEL.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-mist">
                Webdesign. Landingpages. E-Commerce. Software.
              </p>
            </div>
          </div>
        </Panel>

        {/* ------ Szene 9: Handlung ------ */}
        <Panel progress={p} range={[0.868, 0.885, 0.905, 0.92]} className="items-center justify-center">
          <div className="text-center">
            <p className="inline-block border border-mint/60 px-4 py-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-mint">
              Anfrage gesendet
            </p>
            <h2 className="mt-6 font-boxi text-3xl leading-[1.08] text-snow md:text-5xl">
              AUS AUFMERKSAMKEIT
              <br />
              WIRD HANDLUNG.
            </h2>
          </div>
        </Panel>

        {/* ------ Szene 10: Netwitcher ------ */}
        <Panel
          progress={p}
          range={[0.945, 0.97, 0.99, 1]}
          interactiveRange={[0.94, 1]}
          hold="end"
          className="items-start justify-center"
        >
          <div className="px-5 pt-[46vh] text-center md:pt-[44vh]">
            <h2 className="font-boxi text-3xl leading-[1.1] text-snow md:text-5xl">
              WIR MACHEN NICHT NUR CONTENT.
              <br />
              WIR SORGEN DAFÜR,
              <br />
              DASS ER ETWAS BEWIRKT.
            </h2>
            <p className="mt-5 font-heading text-xs font-bold uppercase tracking-[0.3em] text-mist">
              Content Studio &amp; Digital Agency · Berlin
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/kontakt">Projekt starten</ButtonLink>
              <Link
                href="/kontakt#termin"
                className="font-heading text-sm font-bold text-mist underline-offset-4 transition-colors hover:text-snow hover:underline"
              >
                Erstgespräch buchen
              </Link>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
