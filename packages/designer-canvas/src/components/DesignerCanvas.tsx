import {
  useRef,
  useEffect,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@hilum/ui";
import { useShellContext } from "@hilum/designer";
import { useCanvasContext } from "../context/CanvasContext";
import type { PanState } from "../types";

interface DesignerCanvasProps {
  className?: string;
  children?: ReactNode;
}

const MIN_ZOOM = 0.05;
const MAX_ZOOM = 32;
/** Pixels per line for `WheelEvent.DOM_DELTA_LINE` (Firefox mouse wheels). */
const LINE_HEIGHT = 16;
/** Largest per-event zoom delta, so one mouse-wheel notch zooms ~10–40%. */
const MAX_ZOOM_DELTA = 50;

function isEditable(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  return (
    el.isContentEditable ||
    el.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]') !== null
  );
}

/**
 * Pan / zoom viewport. Wraps an inner transform layer that applies the
 * canvas state's pan + zoom. Children (typically `<DesignerFrame>` and
 * overlays) are rendered inside the transform.
 *
 * - Wheel / trackpad scroll pans; Shift+wheel pans horizontally.
 * - Ctrl/Cmd+wheel (and trackpad pinch) zooms.
 * - Drag pans when the `hand` tool is active, while Space is held, or with
 *   the middle mouse button.
 */
function DesignerCanvas({ className, children }: DesignerCanvasProps) {
  const { state, dispatch } = useCanvasContext();
  const { activeTool } = useShellContext();
  const ref = useRef<HTMLDivElement>(null);

  // Latest viewport for the listeners, which subscribe once. Updated
  // optimistically on dispatch so several wheel events between renders
  // accumulate instead of all starting from the same stale value.
  const viewRef = useRef<{ zoom: number; pan: PanState }>({ zoom: state.zoom, pan: state.pan });
  useEffect(() => {
    viewRef.current = { zoom: state.zoom, pan: state.pan };
  }, [state.zoom, state.pan]);

  // Wheel zoom + pan. Subscribed once per node (non-passive, so it can
  // preventDefault page scroll / browser zoom).
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const unit =
        e.deltaMode === 1 ? LINE_HEIGHT : e.deltaMode === 2 ? node.clientHeight || 800 : 1;
      const deltaX = e.deltaX * unit;
      const deltaY = e.deltaY * unit;
      const view = viewRef.current;

      // Pinch-zoom (ctrlKey on macOS trackpad) / Ctrl|Cmd + wheel.
      if (e.ctrlKey || e.metaKey) {
        const d = Math.max(-MAX_ZOOM_DELTA, Math.min(MAX_ZOOM_DELTA, deltaY));
        const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.zoom * Math.exp(-d * 0.01)));
        viewRef.current = { ...view, zoom };
        dispatch({ type: "SET_ZOOM", payload: zoom });
        return;
      }

      // Two-finger / wheel pan. Pan is applied before the zoom scale, so
      // wheel deltas map 1:1 to screen pixels at any zoom. Shift turns a
      // vertical mouse wheel into horizontal panning.
      const [dx, dy] = e.shiftKey && deltaX === 0 ? [deltaY, 0] : [deltaX, deltaY];
      const pan = { x: view.pan.x - dx, y: view.pan.y - dy };
      viewRef.current = { ...view, pan };
      dispatch({ type: "SET_PAN", payload: pan });
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [dispatch]);

  // Space-to-pan (held), like most canvas editors.
  const [spaceHeld, setSpaceHeld] = useState(false);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.key !== " ") return;
      // Only when focus is on the page or the canvas itself — Space must
      // keep activating focused buttons and typing into inputs.
      const active = document.activeElement;
      if (active && active !== document.body && !ref.current?.contains(active)) return;
      if (isEditable(e.target) || isEditable(active)) return;
      e.preventDefault(); // don't scroll the page
      if (!e.repeat) setSpaceHeld(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") setSpaceHeld(false);
    };
    const onBlur = () => setSpaceHeld(false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  const [panning, setPanning] = useState(false);
  const handMode = activeTool === "hand" || spaceHeld;

  // Capture phase so layers, the frame and the marquee never see a pan
  // gesture's pointerdown.
  const onPointerDownCapture = (e: ReactPointerEvent<HTMLDivElement>) => {
    const isPan = (handMode && e.button === 0) || e.button === 1;
    if (!isPan) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const origin = viewRef.current.pan;
    const onMove = (ev: PointerEvent) => {
      const pan = { x: origin.x + (ev.clientX - startX), y: origin.y + (ev.clientY - startY) };
      viewRef.current = { ...viewRef.current, pan };
      dispatch({ type: "SET_PAN", payload: pan });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      setPanning(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    setPanning(true);
  };

  return (
    <div
      ref={ref}
      className={cn("relative flex-1 overflow-hidden bg-canvas select-none", className)}
      style={handMode || panning ? { cursor: panning ? "grabbing" : "grab" } : undefined}
      onPointerDownCapture={onPointerDownCapture}
      data-canvas-root
      data-panning={panning || undefined}
    >
      <div
        className="absolute inset-0 origin-center"
        style={{
          transform: `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom})`,
          transformOrigin: "50% 50%",
          // Let the root's grab cursor win over layer `move` cursors.
          ...(handMode || panning ? { pointerEvents: "none" as const } : {}),
        }}
      >
        {children}
      </div>
    </div>
  );
}

export { DesignerCanvas };
export type { DesignerCanvasProps };
