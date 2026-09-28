import { useEffect, useRef, useState, type RefObject } from "react";
import { useShellContext } from "@hilum/designer";
import { useCanvasContext } from "../context/CanvasContext";
import type { Layer } from "../types";

interface MarqueeOverlayProps {
  /** Ref to the frame element this marquee is constrained to. */
  containerRef: RefObject<HTMLDivElement | null>;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Ids of visible layers whose axis-aligned bounds intersect `box`. */
export function layersInBox(layers: readonly Layer<unknown>[], box: Box): string[] {
  const x0 = box.x;
  const y0 = box.y;
  const x1 = box.x + box.w;
  const y1 = box.y + box.h;
  return layers
    .filter(
      (l) =>
        l.isVisible !== false && l.x < x1 && l.x + l.width > x0 && l.y < y1 && l.y + l.height > y0,
    )
    .map((l) => l.id);
}

/**
 * Click-and-drag marquee selection. Listens for pointerdown on the frame
 * background; on drag, paints a translucent rectangle and selects all
 * visible layers whose (unrotated) bounding box intersects it on pointerup.
 * Hold Shift to add to the current selection.
 */
function MarqueeOverlay({ containerRef }: MarqueeOverlayProps) {
  const { state } = useCanvasContext();
  const { setSelectedIds, readOnly, activeTool } = useShellContext();
  const [box, setBox] = useState<Box | null>(null);

  // Gesture state lives in refs so the listeners are subscribed once, not on
  // every box / layer change (which used to reset `start` mid-drag).
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const boxRef = useRef<Box | null>(null);
  const latestRef = useRef({
    layers: state.layers,
    frameSize: state.frameSize,
    setSelectedIds,
    activeTool,
  });
  useEffect(() => {
    latestRef.current = {
      layers: state.layers,
      frameSize: state.frameSize,
      setSelectedIds,
      activeTool,
    };
  });

  useEffect(() => {
    const node = containerRef.current;
    if (!node || readOnly) return;

    // Coordinates in artboard pixels. The frame's client rect is scaled by
    // the canvas zoom, so normalise by the rect and multiply by frame size.
    const toFrame = (e: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const { frameSize } = latestRef.current;
      return {
        x: rect.width ? ((e.clientX - rect.left) / rect.width) * frameSize.width : 0,
        y: rect.height ? ((e.clientY - rect.top) / rect.height) * frameSize.height : 0,
      };
    };

    const update = (next: Box | null) => {
      boxRef.current = next;
      setBox(next);
    };

    const onDown = (e: PointerEvent) => {
      // Only when user pressed directly on the frame background, not a layer.
      if (e.target !== node) return;
      if (e.button !== 0) return;
      if (latestRef.current.activeTool === "hand") return;
      const start = toFrame(e);
      startRef.current = start;
      update({ x: start.x, y: start.y, w: 0, h: 0 });
    };

    const onMove = (e: PointerEvent) => {
      const start = startRef.current;
      if (!start) return;
      const p = toFrame(e);
      update({
        x: Math.min(start.x, p.x),
        y: Math.min(start.y, p.y),
        w: Math.abs(p.x - start.x),
        h: Math.abs(p.y - start.y),
      });
    };

    const onUp = (e: PointerEvent) => {
      const current = boxRef.current;
      const hadGesture = startRef.current !== null;
      startRef.current = null;
      update(null);
      if (!hadGesture || !current) return;
      const ids = layersInBox(latestRef.current.layers, current);
      const { setSelectedIds: select } = latestRef.current;
      if (e.shiftKey) {
        select((prev) => Array.from(new Set([...prev, ...ids])));
      } else {
        select(ids);
      }
    };

    const onCancel = () => {
      startRef.current = null;
      update(null);
    };

    node.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    return () => {
      node.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      startRef.current = null;
      boxRef.current = null;
    };
  }, [containerRef, readOnly]);

  if (!box || (box.w < 2 && box.h < 2)) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        background: "color-mix(in srgb, var(--brand-primary) 10%, transparent)",
        outline: "1px solid var(--brand-primary)",
      }}
      data-marquee
      aria-hidden
    />
  );
}

export { MarqueeOverlay };
export type { MarqueeOverlayProps };
