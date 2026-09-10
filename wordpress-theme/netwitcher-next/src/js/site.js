/**
 * Site-wide behaviour (all pages):
 *  - header: sentinel-based "scrolled" state, services dropdown, mobile menu
 *  - reveal-on-scroll (components/Reveal.tsx)
 *  - journey line (components/home/Journey.tsx)
 */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- Header ---------------- */
const header = document.querySelector("[data-header]");
if (header) {
  const dark = header.hasAttribute("data-dark");
  const scrolledCls = dark
    ? ["border-b", "border-white/10", "bg-void/80", "py-2", "backdrop-blur-xl"]
    : ["border-b", "border-line", "bg-paper/85", "py-2", "shadow-soft", "backdrop-blur-xl"];
  const topCls = ["bg-transparent", "py-4"];
  const sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:24px;height:1px;width:1px;";
  document.body.prepend(sentinel);
  new IntersectionObserver(
    ([e]) => {
      const scrolled = !e.isIntersecting;
      header.classList.remove(...(scrolled ? topCls : scrolledCls));
      header.classList.add(...(scrolled ? scrolledCls : topCls));
    },
    { threshold: 0 }
  ).observe(sentinel);

  // Services dropdown: hover/focus open, like the React state.
  for (const dd of header.querySelectorAll("[data-dropdown]")) {
    const trigger = dd.querySelector("[data-dropdown-trigger]");
    const panel = dd.querySelector("[data-dropdown-panel]");
    let t = 0;
    const open = () => {
      clearTimeout(t);
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add("is-open"));
      trigger.setAttribute("aria-expanded", "true");
    };
    const close = () => {
      panel.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      t = setTimeout(() => (panel.hidden = true), 180);
    };
    dd.addEventListener("mouseenter", open);
    dd.addEventListener("mouseleave", close);
    trigger.addEventListener("focus", open);
    dd.addEventListener("focusout", (e) => {
      if (!dd.contains(e.relatedTarget)) close();
    });
  }

  // Mobile menu
  const toggle = header.querySelector("[data-menu-toggle]");
  const nav = header.querySelector("[data-mobile-nav]");
  if (toggle && nav) {
    let t = 0;
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      clearTimeout(t);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      toggle.classList.toggle("is-open", open);
      if (open) {
        nav.hidden = false;
        requestAnimationFrame(() => nav.classList.add("is-open"));
      } else {
        nav.classList.remove("is-open");
        t = setTimeout(() => (nav.hidden = true), reduce ? 0 : 250);
      }
    });
  }
}

/* ---------------- Reveal ---------------- */
// Once in or above the viewport → shown, forever (also when jumped over via anchor).
const reveals = document.querySelectorAll("[data-reveal]");
if (reveals.length) {
  if (reduce) {
    reveals.forEach((el) => el.classList.add("is-shown"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-shown");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "100000px 0px -60px 0px" }
    );
    const vh = innerHeight;
    reveals.forEach((el) => {
      if (el.getBoundingClientRect().top < vh - 60) el.classList.add("is-shown");
      else io.observe(el);
    });
  }
}

/* ---------------- Journey line ---------------- */
const journey = document.querySelector("[data-journey]");
if (journey) {
  const line = journey.querySelector(".nw-journey-line");
  const draw = () => line.classList.add("is-drawn");
  if (reduce || journey.getBoundingClientRect().top < innerHeight - 80) draw();
  else {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          draw();
          io.disconnect();
        }
      },
      { rootMargin: "100000px 0px -80px 0px" }
    );
    io.observe(journey);
  }
}
