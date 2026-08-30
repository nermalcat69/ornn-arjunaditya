Build this: a two-line name in a PIXEL typeface on flat bright red that unfolds into a 'molecule' — the letters drift apart into nodes while stair-stepped runs of square pixels grow as BONDS in the spaces between adjacent letters within each word — re-scatters through a few more poses, then folds back into plain typeset text and holds. THE WHOLE ANIMATION IS LETTER POSITIONS: each letter interpolates between keyposes on ONE global ease — zero stagger, one clock, and the bonds are computed every frame from wherever the letters currently are, so their angle, length, birth and death all fall out of the same interpolation with no per-bond state. A BOND IS LEFTOVER SPACE: it lies on the line between its two letters' OPTICAL centers (use actualBoundingBox metrics, not the em box), inset from each letter's real ink edge by a clearance that scales with the free space. BONDS ONLY CONNECT LETTERS WITHIN A WORD — a proximity rule that lets any two close letters bond was tried and is wrong: the moment one word's letters wire into the other's it stops reading as two words and becomes a lattice. DRAW BONDS AS PIXELS ON THE TYPE'S OWN GRID, not as strokes. A smooth round-capped line between two bitmap glyphs reads as a different drawing pasted in; a run of square cells stepped along the line has to stair-step on a diagonal, and that staircase is what makes it look drawn by the same hand as the letters. MEASURE THE CELL, DO NOT DECLARE IT: rasterize a capital at the card's own font size to an offscreen canvas and take the GCD of the ink runs across a few scanlines — that recovers the face's own pixel, and it survives a font swap, a size-adjust change or a different card height, none of which a constant would. Subdivide it (half a font pixel) so a bond has enough steps to describe a diagonal, and keep the bond's THICKNESS a separate constant from its step size — subdividing the grid halves the weight, and a bond wants to match the glyph stem, not become a hairline or a bar. COUNT THE BOND IN CELLS, NOT PIXELS OF FREE SPACE: a free-space threshold feeding a round-capped stroke makes a bond spring into existence at full weight (a 3px stroke with round caps still paints a full-width dot) and blink out just as hard. Counting cells means a bond is born as exactly one square and grows by whole squares as the letters part — it is drawn, not switched on, and the pop is gone by construction rather than by tuning a threshold. Keep the eases as small sampled TABLES rather than analytic curves (the curve has a fast attack and a long uneven tail that a fitted power curve misses badly); reuse the unfold ease for every scatter and give only the refold its own table, and let it approach the typeset position from below and STOP — no spring. A weak damped overshoot was tried and is wrong for a bitmap face: any overshoot lands the glyph on a neighbouring cell and steps back, so what should read as a settle reads as the letter arriving twice. Resample the table finer than the measurement anyway, so the tail interpolates smoothly at the card's own frame rate. VARY THE CYCLE: hold a library of scatter poses and pick a fresh random sequence and length each time round, never the same pose twice running, so the molecule re-forms differently instead of replaying. Give each line in each pose a CONTOUR — an arc, a vee, a rake, a wave, a two-step — rather than independent per-letter noise; that is the whole difference between a row that looks scattered and one that looks placed, and the two lines never take the same contour in the same pose. CONSTRAIN THE POSES AND CHECK THEM, do not sample and hope: clamp each line's shift from its own span so no letter comes near the frame edge, and centre one line's contour above its baseline and the other's below so the lines separate AS they scatter — that way a bigger amplitude pushes them further apart rather than into each other, and the clearance improves as the movement grows. A one-cell pixel TWITCH on the letters adds life while the card is a molecule, but gate it to the scattered state and cut it the instant the fold home begins: a letter that still steps a pixel while it is settling reads as a stutter in the move. Threshold the twitch's wave rather than rounding it — rounding a sine to whole cells sounds like a one-pixel nudge and is not, since a sine is only briefly near zero, so the letter sits at an extreme most of the time and hops diagonally between them. Bow each bond off its straight line by a cell, on a sine envelope that is zero at both ends and drifts slowly per bond, so the chain hangs instead of bracing. Play the timeline CONTINUOUSLY — sample the tables with a fractional tick and lerp between entries — because on a crisp canvas, stepped held frames read as jank rather than as a flipbook. Canvas 2D, two colors, framework-free; letters are fillText in a bitmap face, bonds are filled squares on the measured grid; pauses offscreen / tab-hidden; reduced motion draws the plain typeset name still, because a frozen molecule is an accident and the name is the composition at rest.

The complete, self-contained implementation follows, one file per block. It is framework-agnostic core logic — wire it into your own component and mount it on an element.

### bond-type/params.ts
```ts
export const TICKS = 61;

export const FPS = 32;

export const EASE_MOVE = [
  0, 0.014, 0.044, 0.193, 0.317, 0.545, 0.621, 0.735, 0.777, 0.838, 0.868,
  0.908, 0.924, 0.95, 0.962, 0.979, 0.985, 0.994, 0.996, 1,
];

export const EASE_RETURN = [
  0.0, 0.0115, 0.023, 0.0475, 0.072, 0.1835, 0.295, 0.3645,
  0.434, 0.534, 0.634, 0.667, 0.7, 0.7495, 0.799, 0.8175,
  0.836, 0.862, 0.888, 0.8995, 0.911, 0.9275, 0.944, 0.949,
  0.954, 0.9685, 0.983, 0.985, 0.987, 0.9915, 0.996, 0.998,
  1.0,
];

export const MOVE2_AT = 20;
export const MOVE3_AT = 40;

export const GREEN = "#f5333f";
export const WHITE = "#fdfefd";

export const CAP_H = 56 / 304;

export const FONT_VAR = "--font-mondwest";
export const FONT_WEIGHT = 400;

export const BASELINE_1 = 140 / 304;
export const LINE_PITCH = 67.5 / 304;

export const JITTER_CELLS = 1;

export const JITTER_S = 5.2;

export const JITTER_GATE = 0.975;

export const JITTER_EASE_TICKS = 6;

export const BOND_CELL_SCALE = 0.5;

export const CAP_PIXELS = 9;

export const BOND_AIR_CELLS = 2;

export const BOND_MIN_CELLS = 1;

export const BOND_WEIGHT_CELLS = 2;

export const BOND_BOW_CELLS = 1;

export const BOND_BOW_S = 7;

export const BOND_ON_TICK = 3;

export const BOND_OFF_BEFORE_HOME = 2;

export const LINES = ["Arlan", "Marat"] as const;

export interface Pose {
  gaps: number[][];
  shift: number[];
  dy: number[][];
}

export const POSES: Pose[] = [

  {
    gaps: [[56.3, 58.5, 64.6, 71.0].map((v) => v / 304), [75.3, 74.7, 77.6, 90.2].map((v) => v / 304)],
    shift: [4.5 / 304, -10.2 / 304],
    dy: [[-30.0, -13.0, -6.0, -13.0, -30.0].map((v) => v / 304), [8.0, 19.0, 30.0, 41.0, 52.0].map((v) => v / 304)],
  },

  {
    gaps: [[67.8, 65.9, 65.1, 77.9].map((v) => v / 304), [74.2, 72.5, 94.6, 81.7].map((v) => v / 304)],
    shift: [-3.8 / 304, 12.7 / 304],
    dy: [[-6.0, -30.0, -54.0, -30.0, -6.0].map((v) => v / 304), [48.4, 42.1, 11.6, 17.9, 48.4].map((v) => v / 304)],
  },

  {
    gaps: [[60.6, 60.8, 68.9, 68.0].map((v) => v / 304), [94.9, 92.1, 80.5, 76.9].map((v) => v / 304)],
    shift: [-13.1 / 304, 6.6 / 304],
    dy: [[-54.0, -42.0, -30.0, -18.0, -6.0].map((v) => v / 304), [8, 8, 8, 52, 52].map((v) => v / 304)],
  },

  {
    gaps: [[75.1, 70.3, 60.8, 73.5].map((v) => v / 304), [89.5, 76.7, 87.4, 77.3].map((v) => v / 304)],
    shift: [-4.6 / 304, -2.9 / 304],
    dy: [[-27.0, -6.2, -33.0, -53.8, -27.0].map((v) => v / 304), [30.0, 45.6, 52.0, 45.6, 30.0].map((v) => v / 304)],
  },

  {
    gaps: [[70.2, 74.4, 77.1, 77.5].map((v) => v / 304), [95.8, 91.0, 79.4, 76.2].map((v) => v / 304)],
    shift: [4.9 / 304, -11.4 / 304],
    dy: [[-54, -54, -54, -6, -6].map((v) => v / 304), [52.0, 30.0, 8.0, 30.0, 52.0].map((v) => v / 304)],
  },

  {
    gaps: [[60.2, 76.3, 69.2, 71.3].map((v) => v / 304), [74.3, 81.6, 93.8, 87.6].map((v) => v / 304)],
    shift: [-1.3 / 304, 8.4 / 304],
    dy: [[-30.0, -13.0, -6.0, -13.0, -30.0].map((v) => v / 304), [8.0, 19.0, 30.0, 41.0, 52.0].map((v) => v / 304)],
  },
];

export const SCATTERS_MIN = 2;
export const SCATTERS_MAX = 4;

export const MOVE_TICKS = 20;
export const RETURN_TICKS = 17;

export const HOLD_TICKS = 8;

export const ARRIVE_SPREAD = 0.08;

```

### bond-type/engine.ts
```ts
import {
  ARRIVE_SPREAD,
  BASELINE_1,
  BOND_OFF_BEFORE_HOME,
  BOND_AIR_CELLS,
  BOND_BOW_CELLS,
  BOND_BOW_S,
  BOND_CELL_SCALE,
  BOND_MIN_CELLS,
  BOND_WEIGHT_CELLS,
  BOND_ON_TICK,
  CAP_PIXELS,
  JITTER_CELLS,
  JITTER_EASE_TICKS,
  JITTER_GATE,
  JITTER_S,
  FONT_WEIGHT,
  CAP_H,
  EASE_MOVE,
  EASE_RETURN,
  FPS,
  GREEN,
  HOLD_TICKS,
  LINES,
  LINE_PITCH,
  MOVE_TICKS,
  POSES,
  RETURN_TICKS,
  SCATTERS_MAX,
  SCATTERS_MIN,
  WHITE,
} from "./params";

interface Letter {
  ch: string;

  x: number;
  y: number;

  left: number;
  right: number;
  top: number;
  bottom: number;

  px: number[];
  py: number[];

  line: number;
  slot: number;
}

function edgeDist(hw: number, hh: number, ux: number, uy: number): number {
  const tx = ux !== 0 ? hw / Math.abs(ux) : Infinity;
  const ty = uy !== 0 ? hh / Math.abs(uy) : Infinity;
  return Math.min(tx, ty);
}

function sample(table: number[], t: number): number {
  if (t <= 0) return table[0];
  const i = Math.floor(t);
  if (i >= table.length - 1) return table[table.length - 1];
  return table[i] + (table[i + 1] - table[i]) * (t - i);
}

export class BondType {
  private ctx: CanvasRenderingContext2D | null;
  private raf = 0;
  private t0 = 0;
  private mounted = 0;
  private running = false;
  private dpr = 1;
  private lastTick = -1;

  private letters: Letter[] = [];

  private pairs: [number, number][] = [];

  private seq: number[] = [];
  private cycleTicks = 0;
  private font = "";

  private cell = 1;

  private clock = 0;

  readonly ok: boolean;

  constructor(
    private canvas: HTMLCanvasElement,

    private family: string = "sans-serif",
  ) {
    this.ctx = canvas.getContext("2d");
    this.ok = !!this.ctx;
    if (this.ok) this.resize();
  }

  resize() {
    const c = this.canvas;
    const r = c.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(r.width * this.dpr);
    c.height = Math.round(r.height * this.dpr);
    this.layout();
    this.lastTick = -1;
    if (!this.running) this.renderStill();
  }

  setFont(family: string) {
    this.family = family;
    this.layout();
    if (this.running) {
      if (this.lastTick >= 0) this.render(this.lastTick);
    } else {
      this.renderStill();
    }
  }

  private layout() {
    const ctx = this.ctx;
    if (!ctx) return;
    const H = this.canvas.height;
    const W = this.canvas.width;

    ctx.font = `${FONT_WEIGHT} 100px ${this.family}`;
    const probe = ctx.measureText("H");
    const capAt100 = probe.actualBoundingBoxAscent || 72;
    const size = (CAP_H * H * 100) / capAt100;
    this.font = `${FONT_WEIGHT} ${size}px ${this.family}`;
    ctx.font = this.font;
    this.cell = this.measureCell(size, CAP_H * H) * BOND_CELL_SCALE;

    this.letters = [];
    this.pairs = [];

    LINES.forEach((word, li) => {
      const baseline = (BASELINE_1 + li * LINE_PITCH) * H;
      const total = ctx.measureText(word).width;
      const lineLeft = (W - total) / 2;
      const start = this.letters.length;

      for (let i = 0; i < word.length; i++) {
        const x = lineLeft + ctx.measureText(word.slice(0, i)).width;
        const m = ctx.measureText(word[i]);
        this.letters.push({
          ch: word[i],
          x,
          y: baseline,
          left: -(m.actualBoundingBoxLeft || 0),
          right: m.actualBoundingBoxRight || m.width,
          top: -(m.actualBoundingBoxAscent || size * 0.5),
          bottom: m.actualBoundingBoxDescent || 0,
          px: [],
          py: [],
          line: li,
          slot: i,
        });

        if (i > 0) this.pairs.push([start + i - 1, start + i]);
      }

      const ls = this.letters.slice(start);
      const cx = (l: Letter) => l.x + (l.left + l.right) / 2;
      const typesetCenter = (cx(ls[0]) + cx(ls[ls.length - 1])) / 2;
      POSES.forEach((pose) => {
        const gaps = pose.gaps[li];
        const span = gaps.reduce((a, g) => a + g, 0) * H;
        let x = typesetCenter + pose.shift[li] * H - span / 2;
        ls.forEach((l, i) => {
          if (i > 0) x += gaps[i - 1] * H;
          l.px.push(x - cx(l));
          l.py.push(pose.dy[li][i] * H);
        });
      });
    });
  }

  private measureCell(fontSize: number, capPx: number): number {
    const fallback = Math.max(1, Math.round(capPx / CAP_PIXELS));
    try {
      const w = Math.ceil(fontSize * 4);
      const h = Math.ceil(fontSize * 1.6);
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return fallback;
      o.fillStyle = "#000";
      o.fillRect(0, 0, w, h);
      o.fillStyle = "#fff";
      o.font = `${FONT_WEIGHT} ${fontSize}px ${this.family}`;
      o.textBaseline = "alphabetic";
      o.fillText("HEIL", 4, h * 0.8);
      const runs: number[] = [];

      for (const fy of [0.45, 0.55, 0.65]) {
        const y = Math.floor(h * 0.8 - capPx * fy);
        if (y < 0 || y >= h) continue;
        const d = o.getImageData(0, y, w, 1).data;
        let run = 0;
        for (let x = 0; x < w; x++) {
          if (d[x * 4] > 127) run++;
          else {
            if (run > 0) runs.push(run);
            run = 0;
          }
        }
        if (run > 0) runs.push(run);
      }
      if (!runs.length) return fallback;
      const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
      let g = runs[0];
      for (const r of runs) g = gcd(g, r);

      return g >= 2 ? g : fallback;
    } catch {
      return fallback;
    }
  }

  private newCycle() {
    const n =
      SCATTERS_MIN +
      Math.floor(Math.random() * (SCATTERS_MAX - SCATTERS_MIN + 1));
    const seq: number[] = [];
    let last = -1;
    for (let k = 0; k < n; k++) {
      let p = Math.floor(Math.random() * POSES.length);

      if (p === last) p = (p + 1) % POSES.length;
      seq.push(p);
      last = p;
    }
    this.seq = seq;
    this.cycleTicks = seq.length * MOVE_TICKS + RETURN_TICKS + HOLD_TICKS;
  }

  private arrive(i: number): number {

    const h = Math.sin(i * 12.9898) * 43758.5453;
    return (h - Math.floor(h)) * ARRIVE_SPREAD;
  }

  private offsetAt(l: Letter, i: number, t: number): [number, number] {
    const spread = this.arrive(i);
    const moves = this.seq.length;
    const scatterEnd = moves * MOVE_TICKS;

    if (t < scatterEnd) {
      const k = Math.min(moves - 1, Math.floor(t / MOVE_TICKS));
      const local = t - k * MOVE_TICKS;

      const p = sample(EASE_MOVE, (local / (1 + spread)) * (EASE_MOVE.length - 1) / MOVE_TICKS);
      const from = k === 0 ? [0, 0] : [l.px[this.seq[k - 1]], l.py[this.seq[k - 1]]];
      const to = [l.px[this.seq[k]], l.py[this.seq[k]]];
      return [from[0] + (to[0] - from[0]) * p, from[1] + (to[1] - from[1]) * p];
    }

    const local = t - scatterEnd;
    if (local >= RETURN_TICKS) return [0, 0];
    const p = sample(
      EASE_RETURN,
      (local / (1 + spread)) * (EASE_RETURN.length - 1) / RETURN_TICKS,
    );
    const last = this.seq[moves - 1];
    return [l.px[last] * (1 - p), l.py[last] * (1 - p)];
  }

  private unrest(t: number): number {
    const on = BOND_ON_TICK;

    const offAt = this.seq.length * MOVE_TICKS;
    if (t <= on || t >= offAt) return 0;
    const e = Math.min(t - on, offAt - t) / JITTER_EASE_TICKS;
    const u = Math.min(1, Math.max(0, e));
    return u * u * (3 - 2 * u);
  }

  private jitter(i: number, amount: number): [number, number] {
    if (JITTER_CELLS <= 0 || amount <= 0) return [0, 0];

    if (amount < 0.5) return [0, 0];
    const w = (Math.PI * 2) / JITTER_S;
    const sy = Math.sin(this.clock * w + i * 2.9);
    if (Math.abs(sy) >= JITTER_GATE) {
      return [0, Math.sign(sy) * JITTER_CELLS * this.cell];
    }
    const sx = Math.sin(this.clock * w * 0.73 + i * 1.7);
    if (Math.abs(sx) >= JITTER_GATE) {
      return [Math.sign(sx) * JITTER_CELLS * this.cell, 0];
    }
    return [0, 0];
  }

  private render(t: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    const H = this.canvas.height;
    const W = this.canvas.width;

    ctx.fillStyle = GREEN;
    ctx.fillRect(0, 0, W, H);
    ctx.font = this.font;
    ctx.fillStyle = WHITE;

    const unrest = this.unrest(t);
    const off = this.letters.map((l, i) => {
      const [ox, oy] = this.offsetAt(l, i, t);
      const [jx, jy] = this.jitter(i, unrest);
      return [ox + jx, oy + jy] as [number, number];
    });
    this.letters.forEach((l, i) => {
      ctx.fillText(l.ch, l.x + off[i][0], l.y + off[i][1]);
    });

    const on = BOND_ON_TICK;
    const offAt =
      this.seq.length * MOVE_TICKS + RETURN_TICKS - BOND_OFF_BEFORE_HOME;
    if (t < on || t > offAt) return;

    const cen: [number, number][] = this.letters.map((l, i) => [
      l.x + (l.left + l.right) / 2 + off[i][0],
      l.y + (l.top + l.bottom) / 2 + off[i][1],
    ]);

    ctx.fillStyle = WHITE;
    const cell = this.cell;
    for (const [ia, ib] of this.pairs) {
      const A = this.letters[ia];
      const B = this.letters[ib];
      const dx = cen[ib][0] - cen[ia][0];
      const dy = cen[ib][1] - cen[ia][1];
      const L = Math.hypot(dx, dy);
      if (L < 1) continue;
      const ux = dx / L;
      const uy = dy / L;
      const ea = edgeDist((A.right - A.left) / 2, (A.bottom - A.top) / 2, ux, uy);
      const eb = edgeDist((B.right - B.left) / 2, (B.bottom - B.top) / 2, ux, uy);

      const free = L - ea - eb;
      const air = BOND_AIR_CELLS * cell;
      const usable = free - 2 * air;
      const n = Math.floor(usable / cell);
      if (n < BOND_MIN_CELLS) continue;

      const s0 = ea + air + (usable - n * cell) / 2;

      const bow =
        BOND_BOW_CELLS *
        cell *
        Math.sin(this.clock * ((Math.PI * 2) / BOND_BOW_S) + ia * 1.1);

      const nx = -uy;
      const ny = ux;
      for (let k = 0; k < n; k++) {
        const d = s0 + (k + 0.5) * cell;

        const e = n > 1 ? Math.sin((Math.PI * (k + 0.5)) / n) : 0;
        const px = cen[ia][0] + ux * d + nx * bow * e;
        const py = cen[ia][1] + uy * d + ny * bow * e;

        const w = BOND_WEIGHT_CELLS * cell;
        ctx.fillRect(
          Math.round((px - w / 2) / cell) * cell,
          Math.round((py - w / 2) / cell) * cell,
          w,
          w,
        );
      }
    }
  }

  start() {
    if (this.running || !this.ok) return;
    this.running = true;
    this.t0 = performance.now();

    if (!this.mounted) this.mounted = this.t0;
    if (!this.seq.length) this.newCycle();
    const tick = (now: number) => {
      if (!this.running) return;

      this.clock = (now - this.mounted) / 1000;
      const t = ((now - this.t0) / 1000) * FPS;

      if (t >= this.cycleTicks) {
        this.t0 = now;
        this.newCycle();
        this.lastTick = 0;
        this.render(0);
      } else {
        this.lastTick = t;
        this.render(t);
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  renderStill() {
    if (!this.seq.length) this.newCycle();
    this.render(this.cycleTicks - 1);
  }

  destroy() {
    this.stop();
  }
}

```

### bond-type/BondTypeCard.tsx
```ts
"use client";

import { useEffect, useRef } from "react";
import { BondType } from "./engine";
import { onTransitionChange } from "../../lib/view-transition";
import { FONT_VAR, FONT_WEIGHT, GREEN } from "./params";

export function BondTypeCard({
  bare = false,
  viewTransitionName,
}: {
  bare?: boolean;
  viewTransitionName?: string;
} = {}) {
  void bare;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let engine: BondType | null = null;
    let onScreen = false;
    let hidden = false;
    let inTransition = false;

    const sync = () => {
      if (!engine || reduced) return;
      if (onScreen && !hidden && !inTransition) engine.start();
      else engine.stop();
    };

    const raf = requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      engine = new BondType(canvas);
      if (!engine.ok) return;
      if (reduced) engine.renderStill();
      else sync();

      if (document.fonts?.load) {
        const probe = document.createElement("span");
        probe.style.cssText = "position:absolute;visibility:hidden";
        probe.style.fontFamily = `var(${FONT_VAR})`;
        probe.textContent = "Ag";
        document.body.appendChild(probe);
        const fam = getComputedStyle(probe)
          .fontFamily.split(",")[0]
          .replace(/["']/g, "")
          .trim();
        probe.remove();
        if (fam) {
          document.fonts
            .load(`${FONT_WEIGHT} 1em "${fam}"`)
            .then(() => engine?.setFont(`"${fam}", sans-serif`), () => {});
        }
      }
    });

    const io = new IntersectionObserver(
      (es) => {
        onScreen = es[0]?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0.2 },
    );
    io.observe(canvas);

    const onVis = () => {
      hidden = document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVis);
    const offTransition = onTransitionChange((active) => {
      inTransition = active;
      sync();
    });

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => engine?.resize(), 120);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      offTransition();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(rt);
      engine?.destroy();
    };
  }, []);

  return (
    <div
      data-canvas-card
      role="img"
      aria-label="The name Arlan Marat in a white pixel typeface on bright red. The letters drift apart into a molecule diagram, fine stair-stepped runs of square pixels bonding each letter to the next within its word. The chain re-scatters through a few different shapes, then the letters glide back into the plain typeset name and it starts again with a new sequence."
      style={{
        backgroundColor: GREEN,
        ...(viewTransitionName ? { viewTransitionName } : undefined),
      }}
      className="relative mx-auto aspect-[1344/620] w-full select-none overflow-hidden rounded-[12px] border border-[var(--border-line)]"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

```