"use client";

import { useEffect, useRef } from "react";
import { BondType } from "./engine";
import { onTransitionChange } from "../../lib/view-transition";
import { FONT_VAR, FONT_WEIGHT, GREEN } from "./params";

export function BondTypeCard({
  viewTransitionName,
}: {
  viewTransitionName?: string;
} = {}) {
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
      aria-label="The name Arjun Aditya in a white pixel typeface on bright red. The letters drift apart into a molecule diagram, fine stair-stepped runs of square pixels bonding each letter to the next within its word. The chain re-scatters through a few different shapes, then the letters glide back into the plain typeset name and it starts again with a new sequence."
      style={{
        backgroundColor: GREEN,
        ...(viewTransitionName ? { viewTransitionName } : undefined),
      }}
      className="relative mx-auto aspect-[1344/620] w-full select-none overflow-hidden rounded-[12px]"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
