/**
 * Portfolio behaviour (dark stage):
 *  - WorkIndex (components/portfolio/WorkIndex.tsx): category filter, ?f= URL
 *    sync, re-arranged 7/5 · 5/7 · 4/4/4 rhythm and a FLIP layout transition
 *    driven by the shared spring (Framer: layout + AnimatePresence popLayout).
 *  - VideoPlayer (components/portfolio/VideoPlayer.tsx): thumbnail → media,
 *    one active player at a time via a window event.
 *  FilmStrip is pure CSS, BoxiTitle is computed server-side, DarkStage is
 *  html[data-stage="dark"] from header.php.
 */
import { Spring } from "./spring.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- WorkIndex ---------------- */
const ROWS = [[7, 5], [5, 7], [4, 4, 4]];
const SPAN_CLASS = { 12: "md:col-span-12", 7: "md:col-span-7", 6: "md:col-span-6", 5: "md:col-span-5", 4: "md:col-span-4" };
const RATIO_CLASS = {
  12: "aspect-[4/5] md:aspect-[21/9]",
  7: "aspect-[4/5] md:aspect-[16/10]",
  6: "aspect-[4/5] md:aspect-[4/3]",
  5: "aspect-[4/5]",
  4: "aspect-[4/5] md:aspect-square",
};
const SIZES = {
  12: "(min-width: 1500px) 1400px, 100vw",
  7: "(min-width: 1500px) 820px, (min-width: 768px) 58vw, 100vw",
  6: "(min-width: 1500px) 700px, (min-width: 768px) 50vw, 100vw",
  5: "(min-width: 1500px) 580px, (min-width: 768px) 42vw, 100vw",
  4: "(min-width: 1500px) 460px, (min-width: 768px) 33vw, 100vw",
};
const CHIP_ON = ["border-white", "bg-white", "text-ink"];
const CHIP_OFF = ["border-white/12", "text-white/70", "hover:border-white/30", "hover:text-white"];
const SPRING = { stiffness: 260, damping: 32, mass: 0.9 };

/** Same rhythm as arrange() in WorkIndex.tsx, on DOM items. */
function arrange(list, spreads) {
  const out = [];
  let run = [];
  let row = 0;
  let spreadCount = 0;
  const flush = () => {
    while (run.length) {
      let pattern = ROWS[row % ROWS.length];
      if (run.length === 1) pattern = [12];
      else if (run.length < pattern.length) pattern = [6, 6];
      pattern.forEach((span) => {
        const el = run.shift();
        if (el) out.push({ type: "tile", el, span });
      });
      row++;
    }
  };
  for (const el of list) {
    if (spreads && el.hasAttribute("data-featured")) {
      flush();
      out.push({ type: "spread", el, flip: spreadCount % 2 === 1 });
      spreadCount++;
    } else run.push(el);
  }
  flush();
  return out;
}

const index = document.querySelector("[data-work-index]");
if (index) {
  const grid = index.querySelector("[data-work-grid]");
  const items = [...grid.querySelectorAll("[data-work-item]")];
  const chips = [...index.querySelectorAll("[data-work-filter]")];
  const live = index.querySelector("[data-work-count]");
  const empty = index.querySelector("[data-work-empty]");
  const ids = chips.map((c) => c.dataset.workFilter);
  let filter = chips.find((c) => c.getAttribute("aria-pressed") === "true")?.dataset.workFilter ?? "all";
  let running = [];

  const stop = () => {
    for (const fn of running) fn();
    running = [];
  };

  const applyItem = (it) => {
    const el = it.el;
    el.className = "nw-work-item " + (it.type === "spread" ? "md:col-span-12" : SPAN_CLASS[it.span]);
    if (it.type === "tile") {
      const box = el.querySelector("[data-work-ratio]");
      if (box) box.className = box.className.replace(/aspect-\S+|md:aspect-\S+/g, "").replace(/\s+/g, " ").trim() + " " + RATIO_CLASS[it.span];
      const img = el.querySelector("[data-work-img]");
      if (img) img.sizes = SIZES[it.span];
    }
  };

  /** Spring-driven tween 0 → 1 (Framer's layout spring), optional delay; returns a cancel fn. */
  const tween = (onFrame, done, delay = 0) => {
    const s = new Spring(0, SPRING);
    let t = 0;
    const off = s.onChange((v) => {
      onFrame(v);
      if (!s.moving && v === 1) finish();
    });
    const finish = () => {
      clearTimeout(t);
      off();
      s.jump(1);
      done();
    };
    t = setTimeout(() => s.set(1), delay * 1000);
    return finish;
  };

  const setFilter = (next, animate) => {
    filter = next;
    stop();
    const visible = items.filter((el) => next === "all" || el.dataset.cats.split(" ").includes(next));
    const arranged = arrange(visible, true);
    const showing = new Set(arranged.map((a) => a.el));
    const before = new Map();
    const gridRect = grid.getBoundingClientRect();
    for (const el of items) if (!el.hidden) before.set(el, el.getBoundingClientRect());

    // Exit (popLayout): the leaving tile is taken out of the flow at its old
    // position and fades out; the grid re-flows immediately underneath it.
    for (const el of items) {
      if (showing.has(el) || el.hidden) continue;
      if (!animate) {
        el.hidden = true;
        continue;
      }
      const r = before.get(el);
      el.style.cssText = `position:absolute;top:${r.top - gridRect.top}px;left:${r.left - gridRect.left}px;width:${r.width}px;height:${r.height}px;pointer-events:none`;
      requestAnimationFrame(() => el.classList.add("is-exiting"));
      const t = setTimeout(() => cleanup(), 180);
      const cleanup = () => {
        clearTimeout(t);
        el.classList.remove("is-exiting");
        el.style.cssText = "";
        el.hidden = true;
      };
      running.push(cleanup);
    }

    for (const it of arranged) {
      applyItem(it);
      it.el.hidden = false;
    }
    empty.hidden = visible.length > 0;
    live.textContent = `${visible.length} ${visible.length === 1 ? "Projekt" : "Projekte"}`;

    if (animate) {
      arranged.forEach((it, i) => {
        const el = it.el;
        const last = el.getBoundingClientRect();
        const first = before.get(el);
        if (!first) {
          // Enter: opacity 0, y 24, scale .98 → 1, staggered like the source.
          el.style.opacity = "0";
          el.style.transform = "translateY(24px) scale(0.98)";
          running.push(
            tween(
              (v) => {
                el.style.opacity = String(v);
                el.style.transform = `translateY(${24 * (1 - v)}px) scale(${0.98 + 0.02 * v})`;
              },
              () => (el.style.cssText = ""),
              Math.min(i * 0.04, 0.24)
            )
          );
          return;
        }
        const dx = first.left - last.left;
        const dy = first.top - last.top;
        const sx = first.width / last.width;
        const sy = first.height / last.height;
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.002 && Math.abs(sy - 1) < 0.002) return;
        el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
        running.push(
          tween(
            (v) => {
              const u = 1 - v;
              el.style.transform = `translate(${dx * u}px, ${dy * u}px) scale(${sx + (1 - sx) * v}, ${sy + (1 - sy) * v})`;
            },
            () => (el.style.transform = ""),
            Math.min(i * 0.04, 0.24)
          )
        );
      });
    }

    for (const c of chips) {
      const on = c.dataset.workFilter === next;
      c.setAttribute("aria-pressed", String(on));
      c.classList.remove(...(on ? CHIP_OFF : CHIP_ON));
      c.classList.add(...(on ? CHIP_ON : CHIP_OFF));
      const n = c.querySelector("[data-work-chip-count]");
      n.classList.toggle("text-ink/50", on);
      n.classList.toggle("text-white/35", !on);
    }

    // Keep the filter in the URL: /portfolio?f=web can be sent around.
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("f");
    else url.searchParams.set("f", next);
    window.history.replaceState(window.history.state, "", url);
  };

  // The server already rendered ?f=; only correct a state it could not know (e.g. bfcache / edited URL).
  const initial = new URL(window.location.href).searchParams.get("f");
  const wanted = initial && ids.includes(initial) ? initial : "all";
  if (wanted !== filter) setFilter(wanted, false);
  else setFilter(filter, false);

  for (const c of chips) c.addEventListener("click", () => setFilter(c.dataset.workFilter, !reduce));
}

/* ---------------- VideoPlayer ---------------- */
const ACTIVATE = "nw:video-activate";

function embedUrl(source, src) {
  if (!src) return null;
  if (source === "youtube") {
    const id = src.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{6,})/)?.[1] ?? (src.includes("/") ? null : src);
    return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1` : null;
  }
  if (source === "vimeo") {
    const id = src.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] ?? (/^\d+$/.test(src) ? src : null);
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1` : null;
  }
  return null;
}

document.querySelectorAll("[data-video]").forEach((el, i) => {
  const id = `nw-video-${i}`;
  const button = el.querySelector("[data-video-play]");
  const thumbs = [...el.querySelectorAll("[data-video-thumb]")];
  let media = null;

  const deactivate = () => {
    if (!media) return;
    media.remove();
    media = null;
    thumbs.forEach((t) => (t.hidden = false));
  };
  const activate = () => {
    const { videoSource, videoSrc, videoPoster, videoTitle } = el.dataset;
    if (!videoSrc || media) return;
    const embed = embedUrl(videoSource, videoSrc);
    if (embed) {
      media = document.createElement("iframe");
      media.src = embed;
      media.title = videoTitle;
      media.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      media.allowFullscreen = true;
      media.className = "absolute inset-0 h-full w-full";
    } else {
      media = document.createElement("video");
      media.src = videoSrc;
      if (videoPoster) media.poster = videoPoster;
      media.controls = true;
      media.autoplay = true;
      media.playsInline = true;
      media.preload = "metadata";
      media.className = "absolute inset-0 h-full w-full object-cover";
      const track = document.createElement("track");
      track.kind = "captions";
      media.append(track);
    }
    thumbs.forEach((t) => (t.hidden = true));
    el.append(media);
    media.focus?.();
  };

  window.addEventListener(ACTIVATE, (e) => {
    if (e.detail !== id) deactivate();
  });
  button.addEventListener("click", () => {
    if (!el.dataset.videoSrc) return;
    window.dispatchEvent(new CustomEvent(ACTIVATE, { detail: id }));
    activate();
  });
});
