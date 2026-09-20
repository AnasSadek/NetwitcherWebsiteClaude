"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import type { StripItem } from "@/lib/portfolio";
import { ratioValue } from "@/lib/portfolio";
import { Placeholder } from "./Placeholder";
import { SmartImage } from "./SmartImage";

/** Ab dieser Bewegung (px) gilt ein Pointer-Down als Drag, nicht als Klick. */
const DRAG_THRESHOLD = 6;

/**
 * Filmstreifen aus echten Projektmedien in gemischten Formaten.
 * Touch: native Wisch-/Snap-Gesten (unverändert). Maus/Trackpad: dieselbe
 * Spur lässt sich zusätzlich per Klick-und-Ziehen scrollen (Pointer Events),
 * 1:1 zur Mausbewegung, mit echten Rändern am ersten/letzten Projekt.
 */
function Frame({ item, priority }: { item: StripItem; priority?: boolean }) {
  return (
    <Link
      href={`/portfolio/${item.slug}`}
      draggable={false}
      className="group relative block h-[220px] shrink-0 snap-start overflow-hidden rounded-2xl bg-paper-2 sm:h-[280px] lg:h-[340px]"
      style={{ aspectRatio: ratioValue(item.ratio), WebkitUserDrag: "none" } as React.CSSProperties}
      aria-label={`${item.client}: ${item.alt}`}
    >
      {item.src ? (
        <SmartImage
          image={{ src: item.src, alt: "", ratio: item.ratio }}
          color={item.color}
          ratio={item.ratio}
          sizes="(min-width: 1024px) 40vw, 80vw"
          priority={priority}
          draggable={false}
          rounded="rounded-none"
          className="absolute inset-0 h-full"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <Placeholder color={item.color} kind={item.kind} monogram={item.client.charAt(0)} label={false} />
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3.5 pt-10">
        <span className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">
          {item.client}
        </span>
        {item.kind === "video" && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink" aria-hidden="true">
            <svg width="9" height="9" viewBox="0 0 100 100" className="ml-px">
              <path d={ARROW_PATH} fill="currentColor" transform="rotate(90 50 50)" />
            </svg>
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-ink/10"
        style={{ boxShadow: `inset 0 0 0 0 ${ARROW_COLORS[item.color]}` }}
      />
    </Link>
  );
}

export function FilmStrip({ items }: { items: StripItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, pointerId: -1, startX: 0, startScrollLeft: 0, moved: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      // Touch/Pen: native Scroll-/Snap-Gesten unverändert lassen.
      if (e.pointerType !== "mouse") return;
      // Pointer erst NACH Überschreiten der Drag-Schwelle capturen (siehe
      // onPointerMove) — sonst wird der Klick auf den Link darunter
      // unterdrückt, auch bei einem normalen, bewegungslosen Klick.
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

    // Klick unterdrücken, wenn die Geste tatsächlich ein Drag war (Capture-
    // Phase, bevor Next.js' Link-Handler die Navigation auslöst).
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

  return (
    <div className="fade-x relative -mx-5 sm:-mx-8">
      <div
        ref={trackRef}
        className={`no-scrollbar snap-x snap-mandatory overflow-x-auto px-5 sm:px-8 pointer-fine:snap-none pointer-fine:cursor-grab pointer-fine:select-none ${
          dragging ? "pointer-fine:cursor-grabbing" : ""
        }`}
        style={{ WebkitUserSelect: dragging ? "none" : undefined, userSelect: dragging ? "none" : undefined }}
      >
        <div className="flex w-max gap-3 pr-3 sm:gap-4 sm:pr-4">
          {items.map((it, i) => (
            <Frame key={it.slug} item={it} priority={i < 3} />
          ))}
        </div>
      </div>
    </div>
  );
}
