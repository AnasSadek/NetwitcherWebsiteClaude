/**
 * Minimal port of Framer Motion's spring MotionValue for the vanilla theme.
 *
 * Damped harmonic oscillator, integrated per animation frame with fixed
 * sub-steps (semi-implicit Euler, 1 kHz) so the feel matches Framer's
 * closed-form spring for the stiffness/damping/mass presets we use.
 * All springs share one requestAnimationFrame loop; subscribers run once
 * per frame after every spring has advanced.
 */
const springs = new Set();
let raf = 0;
let lastT = 0;
const listeners = new Set();

function tick(now) {
  raf = 0;
  const dt = Math.min(0.064, lastT ? (now - lastT) / 1000 : 1 / 60);
  lastT = now;
  let active = false;
  for (const s of springs) if (s._step(dt)) active = true;
  for (const fn of listeners) fn();
  if (active) raf = requestAnimationFrame(tick);
  else lastT = 0;
}

function kick() {
  if (!raf) raf = requestAnimationFrame(tick);
}

export class Spring {
  constructor(value = 0, { stiffness = 100, damping = 10, mass = 1, restDelta = 0.0005, restSpeed = 0.005 } = {}) {
    this.k = stiffness;
    this.c = damping;
    this.m = mass;
    this.restDelta = restDelta;
    this.restSpeed = restSpeed;
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.moving = false;
    this._subs = new Set();
    springs.add(this);
  }
  get() {
    return this.value;
  }
  /** Animate towards a new target (Framer: motionValue.set on the source). */
  set(target) {
    if (target === this.target && !this.moving) return;
    this.target = target;
    if (!this.moving) {
      this.moving = true;
      kick();
    }
  }
  /** Set instantly, without motion. */
  jump(value) {
    this.value = this.target = value;
    this.velocity = 0;
    this._emit();
  }
  onChange(fn) {
    this._subs.add(fn);
    return () => this._subs.delete(fn);
  }
  _emit() {
    for (const fn of this._subs) fn(this.value);
  }
  _step(dt) {
    if (!this.moving) return false;
    const h = 0.001;
    let t = dt;
    while (t > 0) {
      const s = Math.min(h, t);
      const a = (-this.k * (this.value - this.target) - this.c * this.velocity) / this.m;
      this.velocity += a * s;
      this.value += this.velocity * s;
      t -= s;
    }
    if (Math.abs(this.velocity) < this.restSpeed && Math.abs(this.value - this.target) < this.restDelta) {
      this.value = this.target;
      this.velocity = 0;
      this.moving = false;
    }
    this._emit();
    return this.moving;
  }
}

/** Runs once per animation frame while any spring is moving (useMotionTemplate equivalent). */
export function onFrame(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Force one frame (e.g. after a resize) even if no spring is moving. */
export function requestFrame() {
  kick();
}

export const clamp = (v, lo = -1, hi = 1) => Math.min(hi, Math.max(lo, v));
