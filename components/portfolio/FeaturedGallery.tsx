"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import { getDict } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locale";
import type { PortfolioProject } from "@/lib/portfolio";
import { projectKind } from "@/lib/portfolio";
import { LaptopFrame, LaptopFrameThumb } from "./LaptopFrame";
import { SectionTitle } from "./ProjectSections";

/** Ab dieser Bewegung (px) gilt ein Pointer-Down als Drag, nicht als Klick. */
const DRAG_THRESHOLD = 6;

/**
 * Featured-Galerie: ein grosses Bild oben, darunter ein Thumbnail-Slider
 * mit den restlichen Screens. Klick auf ein Thumbnail tauscht das grosse
 * Bild (sanfter Crossfade); Klick auf das grosse Bild öffnet eine Lightbox.
 * Der Slider läuft nicht automatisch. Desktop: Klick-und-Ziehen (Pointer
 * Events, wie im Portfolio-Filmstreifen) plus Pfeile; Mobile: natives
 * Touch-Scrollen, unverändert.
 */
export function FeaturedGallery({ project, locale = "de" }: { project: PortfolioProject; locale?: Locale }) {
  const items = project.gallery!;
  const hex = ARROW_COLORS[project.color];
  const software = projectKind(project) === "software";
  const laptop = project.galleryFrame === "laptop";
  const t = getDict(locale);

  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, pointerId: -1, startX: 0, startScrollLeft: 0, moved: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      drag.current = { active: true, pointerId: e.pointerId, startX: e.clientX, startScrollLeft: el.scrollLeft, moved: 0 };
    };
    const onPointerMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active || e.pointerId !== d.pointerId) return;
      const deltaX = e.clientX - d.startX;
      d.moved = Math.max(d.moved, Math.abs(deltaX));
      if (d.moved > DRAG_THRESHOLD && !el.hasPointerCapture(e.pointerId)) {
        el.setPointerCapture(e.pointerId);
        setDragging(true);
      }
      el.scrollLeft = d.startScrollLeft - deltaX;
    };
    const endDrag = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active || e.pointerId !== d.pointerId) return;
      d.active = false;
      setDragging(false);
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    const onClickCapture = (e: MouseEvent) => {
      if (drag.current.moved > DRAG_THRESHOLD) {
        e.preventDefault();
        e.stopPropagation();
      }
      drag.current.moved = 0;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const scrollThumbIntoView = (i: number) => {
    const el = trackRef.current;
    const row = el?.firstElementChild as HTMLElement | null;
    const thumb = row?.children[i] as HTMLElement | undefined;
    if (!el || !row || !thumb) return;
    const target = thumb.getBoundingClientRect().left - row.getBoundingClientRect().left;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: Math.max(0, Math.min(target - 24, max)), behavior: "smooth" });
  };

  const select = (i: number) => {
    setActive(i);
    scrollThumbIntoView(i);
  };

  return (
    <section aria-labelledby="produkt" className="py-14 md:py-20">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <SectionTitle
          id="produkt"
          title={software ? t.portfolio.productSectionTitle : t.portfolio.experienceSectionTitle}
          kicker={project.tech?.length ? project.tech.join(" · ") : undefined}
        />
        <Reveal>
          {/* Grosses Bild */}
          <div
            className="relative overflow-hidden rounded-2xl border border-line bg-paper-2 md:rounded-3xl"
            style={{ aspectRatio: "16 / 10" }}
          >
            <AnimatePresence>
              <motion.button
                key={active}
                type="button"
                onClick={() => setLightbox(true)}
                aria-label={t.portfolio.enlargeImage(items[active].image.alt)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={
                  laptop
                    ? "absolute inset-0 flex h-full w-full cursor-zoom-in items-center justify-center px-5 py-8 sm:px-10 sm:py-12 md:px-16 md:py-16"
                    : "absolute inset-0 h-full w-full cursor-zoom-in"
                }
              >
                {items[active].image.src &&
                  (laptop ? (
                    <LaptopFrame
                      image={items[active].image}
                      sizes="(min-width: 1500px) 900px, 90vw"
                      priority={active === 0}
                    />
                  ) : (
                    <Image
                      src={items[active].image.src}
                      alt={items[active].image.alt}
                      fill
                      sizes="(min-width: 1500px) 1400px, 100vw"
                      priority={active === 0}
                      className="object-contain p-2 sm:p-4"
                    />
                  ))}
              </motion.button>
            </AnimatePresence>
          </div>

          {/* Thumbnail-Slider */}
          <div className="relative mt-4 md:mt-6">
            <button
              type="button"
              onClick={() => select(Math.max(active - 1, 0))}
              disabled={active === 0}
              aria-label={t.portfolio.prevImageAria}
              className="absolute -left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white shadow-soft transition-opacity disabled:pointer-events-none disabled:opacity-0 md:flex rtl:left-auto rtl:-right-2"
            >
              <svg width="9" height="9" viewBox="0 0 100 100" aria-hidden="true" className="rtl:-scale-x-100">
                <path d={ARROW_PATH} fill="currentColor" transform="rotate(180 50 50)" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => select(Math.min(active + 1, items.length - 1))}
              disabled={active === items.length - 1}
              aria-label={t.portfolio.nextImageAria}
              className="absolute -right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white shadow-soft transition-opacity disabled:pointer-events-none disabled:opacity-0 md:flex rtl:right-auto rtl:-left-2"
            >
              <svg width="9" height="9" viewBox="0 0 100 100" aria-hidden="true" className="rtl:-scale-x-100">
                <path d={ARROW_PATH} fill="currentColor" />
              </svg>
            </button>

            <div
              ref={trackRef}
              className={`no-scrollbar overflow-x-auto pointer-fine:cursor-grab pointer-fine:select-none ${
                dragging ? "pointer-fine:cursor-grabbing" : ""
              }`}
              style={{ WebkitUserSelect: dragging ? "none" : undefined, userSelect: dragging ? "none" : undefined }}
            >
              <div className="flex w-max gap-3">
                {items.map((it, i) => (
                  <button
                    key={it.image.src ?? i}
                    type="button"
                    draggable={false}
                    onClick={() => select(i)}
                    aria-label={it.label}
                    aria-current={i === active}
                    className="group relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-paper-2 transition-opacity sm:h-24 sm:w-32"
                    style={{
                      outline: i === active ? `2px solid ${hex}` : "2px solid transparent",
                      outlineOffset: 2,
                      opacity: i === active ? 1 : 0.6,
                    }}
                  >
                    {it.image.src &&
                      (laptop ? (
                        <LaptopFrameThumb image={it.image} sizes="140px" />
                      ) : (
                        <Image
                          src={it.image.src}
                          alt=""
                          fill
                          draggable={false}
                          sizes="140px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ))}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-6 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label={t.portfolio.closeAria}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 rtl:right-auto rtl:left-5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="relative h-full max-h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {items[active].image.src && (
              <Image
                src={items[active].image.src}
                alt={items[active].image.alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
