"use client";

import { useEffect, useRef, useState } from "react";

// The whole site is designed at this width. Every device scales this exact
// layout up or down to fill its screen instead of reflowing to a different
// layout, so desktop, tablet, and phone all look identical.
const DESIGN_WIDTH = 1280;

export function ScaleLock({ children }: { children: React.ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const update = () => {
      const nextScale = window.innerWidth / DESIGN_WIDTH;
      setScale(nextScale);
      setHeight(el.scrollHeight * nextScale);
      setReady(true);
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);
    window.addEventListener("resize", update);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      style={{
        height: height || undefined,
        // `clip` (unlike `hidden`) can never be scrolled — including the
        // browser's own "scroll focused element into view" on click/tab,
        // which otherwise shifts this whole scaled wrapper sideways.
        overflow: "clip",
        opacity: ready ? 1 : 0,
        transition: "opacity 150ms ease-out",
      }}
    >
      <div
        ref={innerRef}
        style={{
          width: DESIGN_WIDTH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
