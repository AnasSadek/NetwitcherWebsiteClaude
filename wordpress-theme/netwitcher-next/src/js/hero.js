/**
 * WITCH hero – vanilla port of components/mascot/HeroStage.tsx + HeadTurn.tsx.
 *
 * Same model: one gaze target, three springs (eye fast / head medium / body
 * slow), lean from head velocity, focus glow, idle look-around, touch follow,
 * scroll gaze on touch devices, device tilt, wake-up on first appearance,
 * shutter click with flash + star sparks, magnetic cards, and the head-turn
 * frame sequence drawn on a canvas (desktop with a mouse only).
 *
 * All continuous values are written once per animation frame from a single
 * loop (see spring.js), only when they changed; discrete moments are CSS
 * animations toggled by classes (see src/app.css, .nw-hero).
 */
import { Spring, onFrame, requestFrame, clamp } from "./spring.js";

const root = document.querySelector("[data-hero]");
if (root) init(root);

function init(stage) {
  const q = (name) => stage.querySelector(`[data-witch="${name}"]`);
  const el = {
    glow: q("glow"),
    char: q("char"),
    body: q("body"),
    pose: q("pose"),
    canvas: q("headturn"),
    eye: q("eye"),
    focus: q("focus"),
    star: q("star"),
    glint: q("glint"),
    sparks: q("sparks"),
    trigger: q("trigger"),
    flash: q("flash"),
    card1: q("card1"),
    card2: q("card2"),
  };
  const manifest = JSON.parse(stage.querySelector("[data-headturn-manifest]").textContent);
  const base = stage.dataset.headturnBase;

  const smooth = (t) => t * t * (3 - 2 * t);
  const smoothEase = (t) => smooth(clamp(t, 0, 1));
  const soft = (v) => Math.tanh(v * 1.35);
  const IDLE_AFTER = { mouse: 3200, touch: 1500 };
  const SPRING = {
    eye: { stiffness: 320, damping: 26, mass: 0.6 },
    head: { stiffness: 110, damping: 20, mass: 1 },
    body: { stiffness: 55, damping: 18, mass: 1.4 },
    lean: { stiffness: 140, damping: 22 },
    magnet: { stiffness: 220, damping: 22 },
  };

  /* ---------------- media flags ---------------- */
  const mq = {
    reduce: matchMedia("(prefers-reduced-motion: reduce)"),
    coarse: matchMedia("(pointer: coarse)"),
    wide: matchMedia("(min-width: 1024px)"),
  };
  let live, pointer, wide, headTurn;
  const flags = () => {
    live = !mq.reduce.matches;
    pointer = live && !mq.coarse.matches;
    wide = mq.wide.matches;
    headTurn = pointer && wide;
  };
  flags();

  /* ---------------- target + springs ---------------- */
  let tx = 0, ty = 0;
  const ex = new Spring(0, SPRING.eye), ey = new Spring(0, SPRING.eye);
  const hx = new Spring(0, SPRING.head), hy = new Spring(0, SPRING.head);
  const bx = new Spring(0, SPRING.body), by = new Spring(0, SPRING.body);
  const lean = new Spring(0, SPRING.lean);
  const setTarget = (x, y) => {
    tx = x; ty = y;
    for (const s of [ex, hx, bx]) s.set(x);
    for (const s of [ey, hy, by]) s.set(y);
  };
  // useVelocity(hx): sampled per frame
  let prevHX = 0, prevT = 0;

  /* ---------------- lens geometry ---------------- */
  const lens = { x: 0, y: 0 };
  const last = { x: 0, y: 0 };
  const measureLens = () => {
    const r = el.char.getBoundingClientRect();
    const cs = getComputedStyle(el.char);
    const fx = parseFloat(cs.getPropertyValue("--eye-x")) / 100 || 0.49;
    const fy = parseFloat(cs.getPropertyValue("--eye-y")) / 100 || 0.4;
    lens.x = r.left + r.width * fx;
    lens.y = r.top + r.height * fy;
    return lens;
  };
  const lookAt = (cx, cy) => {
    const nx = soft((cx - lens.x) / (innerWidth / 2));
    const ny = soft((cy - lens.y) / (innerHeight / 2));
    setTarget(nx, ny);
    last.x = nx; last.y = ny;
  };
  const lensAt = (v) => {
    const f = manifest.center + clamp(v) * manifest.center;
    const i0 = Math.floor(f), i1 = Math.min(manifest.frames - 1, i0 + 1), t = f - i0;
    const a = manifest.lens[i0], b = manifest.lens[i1];
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  };
  const lensCenter = manifest.lens[manifest.center];

  /* ---------------- idle / wake ---------------- */
  let idle = false, idleTimer = 0, idleRaf = 0, tiltBound = false;
  const armIdle = (ms) => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => setIdle(true), ms);
  };
  const wake = (ms) => { setIdle(false); armIdle(ms); };
  const onTilt = (e) => {
    if (e.gamma == null || e.beta == null) return;
    cancelAnimationFrame(idleRaf);
    setTarget(clamp(e.gamma / 30), clamp((e.beta - 45) / 30));
  };
  function setIdle(on) {
    if (on === idle) return;
    idle = on;
    cancelAnimationFrame(idleRaf);
    if (tiltBound) { removeEventListener("deviceorientation", onTilt); tiltBound = false; }
    if (!on || !live) return;
    const t0 = performance.now();
    const from = { x: last.x, y: last.y };
    const amp = mq.coarse.matches ? 1.15 : 0.6;
    const loop = (now) => {
      const t = (now - t0) / 1000;
      const ramp = smoothEase(t / 3);
      const wx = (Math.sin(t * 0.35) * 0.5 + Math.sin(t * 0.13 + 1.7) * 0.25) * amp;
      const wy = Math.sin(t * 0.27 + 0.6) * 0.32 * amp - 0.1;
      setTarget(from.x + (wx - from.x) * ramp, from.y + (wy - from.y) * ramp);
      idleRaf = requestAnimationFrame(loop);
    };
    idleRaf = requestAnimationFrame(loop);
    const D = window.DeviceOrientationEvent;
    if (mq.coarse.matches && D && typeof D.requestPermission !== "function") {
      addEventListener("deviceorientation", onTilt, { passive: true });
      tiltBound = true;
    }
  }

  /* ---------------- input: mouse ---------------- */
  const cursor = { x: NaN, y: NaN };
  const onPointerMove = (e) => {
    if (!pointer) return;
    if (e.pointerType && e.pointerType !== "mouse") return;
    cursor.x = e.clientX; cursor.y = e.clientY;
    lookAt(e.clientX, e.clientY);
    wake(IDLE_AFTER.mouse);
  };
  const onMouseScroll = () => {
    measureLens();
    if (!Number.isNaN(cursor.x)) lookAt(cursor.x, cursor.y);
  };
  const onMouseOut = (e) => { if (!e.relatedTarget) armIdle(IDLE_AFTER.mouse); };

  /* ---------------- input: touch ---------------- */
  let touching = false;
  const onTouchStart = (e) => {
    const t = e.touches[0]; if (!t) return;
    touching = true; measureLens(); lookAt(t.clientX, t.clientY); wake(IDLE_AFTER.touch);
  };
  const onTouchMove = (e) => {
    const t = e.touches[0]; if (!t) return;
    measureLens(); lookAt(t.clientX, t.clientY); wake(IDLE_AFTER.touch);
  };
  const onTouchEnd = () => { touching = false; armIdle(IDLE_AFTER.touch); };

  /* ---------------- input: scroll without a mouse ---------------- */
  let lastY = scrollY, lastT = performance.now();
  const onTouchScroll = () => {
    if (touching) return;
    const now = performance.now();
    const dt = Math.max(16, now - lastT);
    const v = ((scrollY - lastY) / dt) * 1000;
    lastY = scrollY; lastT = now;
    const { y } = measureLens();
    const vh = innerHeight;
    const ny = clamp(soft((vh / 2 - y) / (vh / 2)) + clamp(v / 2600, -0.3, 0.3));
    const nx = last.x * 0.85;
    setTarget(nx, ny);
    last.x = nx; last.y = ny;
    wake(IDLE_AFTER.touch);
  };

  const ro = new ResizeObserver(() => { measureLens(); requestFrame(); });
  ro.observe(el.char);

  function bind() {
    removeEventListener("pointermove", onPointerMove);
    removeEventListener("scroll", onMouseScroll);
    removeEventListener("scroll", onTouchScroll);
    document.removeEventListener("mouseout", onMouseOut);
    for (const [n, f] of [["touchstart", onTouchStart], ["touchmove", onTouchMove], ["touchend", onTouchEnd], ["touchcancel", onTouchEnd]]) removeEventListener(n, f);
    if (!live) { setIdle(false); return; }
    measureLens();
    if (pointer) {
      addEventListener("pointermove", onPointerMove, { passive: true });
      addEventListener("scroll", onMouseScroll, { passive: true });
      document.addEventListener("mouseout", onMouseOut);
      armIdle(IDLE_AFTER.mouse);
    } else {
      addEventListener("scroll", onTouchScroll, { passive: true });
      setIdle(true);
    }
    for (const [n, f] of [["touchstart", onTouchStart], ["touchmove", onTouchMove], ["touchend", onTouchEnd], ["touchcancel", onTouchEnd]]) addEventListener(n, f, { passive: true });
  }

  /* ---------------- head turn (canvas frame sequence) ---------------- */
  const ht = { frames: [], w: 0, h: 0, last: NaN, raf: 0, cancelled: true, ro: null };
  const htDraw = () => {
    ht.raf = 0;
    const ctx = el.canvas.getContext("2d");
    const v = clamp(hx.get());
    const f = manifest.center + v * manifest.center;
    if (Math.abs(f - ht.last) < 0.003) return;
    const i0 = Math.floor(f), i1 = Math.min(manifest.frames - 1, i0 + 1), t = f - i0;
    const list = ht.frames;
    const nearest = (i) => {
      if (list[i]) return i;
      const dir = i < manifest.center ? 1 : -1;
      for (let j = i; j >= 0 && j < manifest.frames; j += dir) if (list[j]) return j;
      return -1;
    };
    const a = nearest(i0), b = nearest(i1);
    if (a < 0) return;
    const { w, h } = ht;
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.drawImage(list[a], 0, 0, w, h);
    if (b >= 0 && b !== a && t > 0.001) {
      ctx.globalAlpha = t;
      ctx.drawImage(list[b], 0, 0, w, h);
      ctx.globalAlpha = 1;
    }
    ht.last = a === i0 && b === i1 ? f : NaN;
  };
  const htSchedule = () => { if (!ht.raf) ht.raf = requestAnimationFrame(htDraw); };
  function htStart() {
    if (!ht.cancelled) return;
    ht.cancelled = false;
    el.canvas.hidden = false;
    const fit = () => {
      const r = el.canvas.getBoundingClientRect();
      const dpr = Math.min(2, devicePixelRatio || 1);
      const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
      if (w !== ht.w || h !== ht.h) {
        el.canvas.width = w; el.canvas.height = h;
        ht.w = w; ht.h = h; ht.last = NaN;
        htSchedule();
      }
    };
    fit();
    ht.ro = new ResizeObserver(fit);
    ht.ro.observe(el.canvas);
    const need = ht.w;
    const width = manifest.widths.slice().sort((a, b) => a - b).find((wd) => wd * manifest.crop.w >= need) ?? Math.max(...manifest.widths);
    const order = [manifest.center];
    for (let d = 1; d <= manifest.center; d++) order.push(manifest.center - d, manifest.center + d);
    ht.frames = new Array(manifest.frames).fill(null);
    const queue = order.filter((i) => i >= 0 && i < manifest.frames);
    let active = 0;
    const pump = () => {
      while (active < 4 && queue.length && !ht.cancelled) {
        const i = queue.shift();
        active++;
        fetch(`${base}/${width}/${String(i).padStart(2, "0")}.webp`)
          .then((r) => r.blob())
          .then((blob) => createImageBitmap(blob))
          .then((bmp) => {
            if (ht.cancelled) return bmp.close();
            ht.frames[i] = bmp; ht.last = NaN; htSchedule();
          })
          .catch(() => undefined)
          .finally(() => { active--; pump(); });
      }
    };
    pump();
  }
  function htStop() {
    if (ht.cancelled) return;
    ht.cancelled = true;
    ht.ro?.disconnect();
    cancelAnimationFrame(ht.raf); ht.raf = 0;
    ht.frames.forEach((b) => b?.close());
    ht.frames = [];
    el.canvas.hidden = true;
  }
  hx.onChange(() => { if (headTurn) htSchedule(); });

  /* ---------------- magnetic cards ---------------- */
  for (const card of [el.card1, el.card2]) {
    if (!card) continue;
    const wrap = card.querySelector("[data-magnet-wrap]");
    const a = card.querySelector("[data-magnet]");
    const mx = new Spring(0, SPRING.magnet), my = new Spring(0, SPRING.magnet);
    let lastStr = "";
    const apply = () => {
      const s = `translate3d(${mx.get().toFixed(2)}px, ${my.get().toFixed(2)}px, 0)`;
      if (s !== lastStr) { wrap.style.transform = pointer ? s : ""; lastStr = s; }
    };
    mx.onChange(apply); my.onChange(apply);
    a.addEventListener("pointermove", (e) => {
      if (!pointer) return;
      const r = a.getBoundingClientRect();
      mx.set(clamp(((e.clientX - r.left) / r.width - 0.5) * 16, -8, 8));
      my.set(clamp(((e.clientY - r.top) / r.height - 0.5) * 16, -8, 8));
    });
    a.addEventListener("pointerleave", () => { mx.set(0); my.set(0); });
  }

  /* ---------------- per-frame render ---------------- */
  const prev = {};
  const put = (node, prop, value) => {
    const k = prop + (node.dataset.witch || "");
    if (prev[k] === value) return;
    prev[k] = value;
    node.style[prop] = value;
  };
  let awake = false;
  const render = () => {
    if (!live) return;
    const now = performance.now();
    const hxv = hx.get();
    // lean from head velocity (useVelocity → transform → spring)
    if (prevT) {
      const dt = Math.max(1, now - prevT) / 1000;
      const vel = (hxv - prevHX) / dt;
      lean.set(clamp(vel * 0.4, -1.8, 1.8));
    }
    prevHX = hxv; prevT = now;

    const bxv = bx.get(), byv = by.get();
    put(el.pose, "transform", `translate3d(${(bxv * 10).toFixed(2)}px, ${(byv * 6).toFixed(2)}px, 0) rotateX(${(byv * -2.5).toFixed(2)}deg) rotateY(${(bxv * 5).toFixed(2)}deg) rotate(${lean.get().toFixed(3)}deg)`);

    // eye: lens offset with the turn + gaze ellipse + slight tilt
    let gx = ex.get() / 0.9, gy = ey.get() / 0.8;
    const m = Math.hypot(gx, gy);
    if (m > 1) { gx /= m; gy /= m; }
    const gazeX = gx * 9, gazeY = gy * 7;
    let ldx = 0, ldy = 0;
    if (headTurn) {
      const l = lensAt(hxv);
      ldx = (l.x - lensCenter.x) * 100; ldy = (l.y - lensCenter.y) * 100;
    }
    const eyeRY = wide ? hxv * 16 : hxv * 10;
    put(el.eye, "transform", `translate3d(calc(${ldx.toFixed(3)}cqw + ${gazeX.toFixed(2)}px), calc(${ldy.toFixed(3)}cqh + ${gazeY.toFixed(2)}px), 0) rotateY(${eyeRY.toFixed(2)}deg)`);
    put(el.glint, "transform", `translate3d(${(gazeX * -0.6).toFixed(2)}px, ${(gazeY * -0.6).toFixed(2)}px, 0)`);

    // focus: the closer the target to the lens, the brighter
    const d = Math.hypot(ex.get(), ey.get() * 1.3);
    const focus = 1 - clamp((d - 0.08) / 0.3, 0, 1);
    put(el.focus, "opacity", awake ? (focus * 0.9).toFixed(3) : "0");
    put(el.star, "transform", `scale(${(1 + focus * 0.07).toFixed(4)})`);
    put(el.glint, "opacity", awake ? (0.35 + focus * 0.6).toFixed(3) : "0.25");

    // cards + glow (counter-moving, slow)
    if (el.card1) put(el.card1, "transform", `translate3d(${(bxv * -26).toFixed(2)}px, ${(byv * -14).toFixed(2)}px, 0)`);
    if (el.card2) put(el.card2, "transform", `translate3d(${(bxv * -38).toFixed(2)}px, ${(byv * -20).toFixed(2)}px, 0)`);
    const glowX = 50 + hxv * 9, glowY = 44 + hy.get() * 7;
    put(el.glow, "background", `radial-gradient(52% 46% at ${glowX.toFixed(2)}% ${glowY.toFixed(2)}%, rgba(139,92,246,0.6), transparent 70%), radial-gradient(38% 34% at 76% 70%, rgba(15,185,242,0.22), transparent 72%), radial-gradient(34% 30% at 22% 72%, rgba(244,104,168,0.2), transparent 72%)`);
  };
  onFrame(render);

  /* ---------------- phases: asleep → waking → awake ---------------- */
  const setPhase = (p) => {
    stage.classList.remove("is-asleep", "is-waking", "is-awake");
    stage.classList.add("is-" + p);
    awake = p === "awake";
    requestFrame();
  };
  if (mq.reduce.matches) setPhase("awake");
  else {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setPhase("waking");
      setTimeout(() => setPhase("awake"), 1300);
    }, { threshold: 0.45 });
    io.observe(el.char);
  }

  /* ---------------- "Magic in Every Click": the shutter ---------------- */
  let busy = false, shotTimer = 0;
  const shoot = () => {
    if (busy) return;
    busy = true;
    setTimeout(() => (busy = false), 520);
    clearTimeout(shotTimer);
    stage.classList.remove("is-shot");
    void stage.offsetWidth; // restart CSS animations
    stage.classList.add("is-shot");
    if (!mq.reduce.matches) {
      el.sparks.replaceChildren();
      ["#2EE6C8", "#8B5CF6", "#F468A8", "#F5D33D", "#0FB9F2"].forEach((c, i) => {
        const a = -90 + i * 72;
        const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        s.setAttribute("width", "22"); s.setAttribute("height", "22"); s.setAttribute("viewBox", "0 0 100 100");
        s.setAttribute("class", "absolute -left-[11px] -top-[11px]");
        s.dataset.witch = "spark";
        s.style.setProperty("--a", a + "deg");
        s.innerHTML = `<path d="M50 14 L74 38 A9 9 0 0 1 76.5 44 L79 66 A7 7 0 0 1 68 72.5 L52 56 A3 3 0 0 0 48 56 L32 72.5 A7 7 0 0 1 21 66 L23.5 44 A9 9 0 0 1 26 38 Z" fill="${c}"/>`;
        el.sparks.appendChild(s);
      });
    }
    shotTimer = setTimeout(() => {
      stage.classList.remove("is-shot");
      el.sparks.replaceChildren();
    }, 1600);
  };
  el.trigger.addEventListener("click", shoot);

  /* ---------------- (re)configure on media changes ---------------- */
  const configure = () => {
    flags();
    bind();
    if (headTurn) htStart(); else htStop();
    if (!live) {
      for (const n of [el.pose, el.eye, el.glint, el.star, el.glow, el.card1, el.card2]) n && (n.style.cssText = n === el.eye ? el.eye.style.cssText.replace(/transform:[^;]*;?/, "") : "");
      el.focus.style.opacity = "0";
      el.glint.style.opacity = "0.4";
    }
    requestFrame();
  };
  for (const m of Object.values(mq)) m.addEventListener("change", configure);
  configure();
}
