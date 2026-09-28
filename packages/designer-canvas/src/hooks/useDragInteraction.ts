import { useCallback, useEffect, useRef, useState } from "react";
import { useShellContext } from "@hilum/designer";
import { useCanvasContext } from "../context/CanvasContext";
import { useOptionalCanvasHistory } from "../context/CanvasHistory";

interface UseDragInteractionParams {
  layerId: string;
  /** Pixel scale — typically `1 / zoom`. */
  scale?: number;
}

/**
 * Pointer-driven drag. Returns props to spread on the draggable element.
 * Hold Shift for axis-locked movement.
 *
 * If the layer is part of the selection, every selected (unlocked) layer
 * moves together. Callers that change the selection in the same pointerdown
 * handler (e.g. shift-click) pass the new selection as `ids`, since the
 * context value is only updated on the next render.
 *
 * Each gesture is wrapped in a history transaction, so one drag is one undo
 * step.
 */
export function useDragInteraction({ layerId, scale = 1 }: UseDragInteractionParams) {
  const { state, dispatch } = useCanvasContext();
  const { selectedIds } = useShellContext();
  const history = useOptionalCanvasHistory();
  const [dragging, setDragging] = useState(false);

  // Latest values for the window listeners, which live for a whole gesture.
  const latestRef = useRef({ scale, dispatch, history });
  useEffect(() => {
    latestRef.current = { scale, dispatch, history };
  });

  // Ends the active gesture (removes listeners, commits the transaction).
  const endRef = useRef<(() => void) | null>(null);
  useEffect(() => () => endRef.current?.(), []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent, ids?: readonly string[]) => {
      if (state.readOnly) return;
      const layer = state.layers.find((l) => l.id === layerId);
      if (!layer || layer.isLocked) return;

      // A gesture that never saw its pointerup — close it first.
      endRef.current?.();

      // If layer is part of selection, drag all selected. Otherwise drag just this one.
      const selection = ids ?? selectedIds;
      const targets = selection.includes(layerId) ? selection : [layerId];
      const initial = new Map<string, { x: number; y: number }>();
      for (const id of targets) {
        const l = state.layers.find((x) => x.id === id);
        if (l && !l.isLocked) initial.set(id, { x: l.x, y: l.y });
      }
      const pointerX = e.clientX;
      const pointerY = e.clientY;

      const onMove = (ev: PointerEvent) => {
        const { scale: s, dispatch: d } = latestRef.current;
        let dx = (ev.clientX - pointerX) * s;
        let dy = (ev.clientY - pointerY) * s;
        if (ev.shiftKey) {
          // Axis-lock to the larger delta.
          if (Math.abs(dx) > Math.abs(dy)) dy = 0;
          else dx = 0;
        }
        const updates: Array<{ id: string; updates: { x: number; y: number } }> = [];
        initial.forEach((origin, id) => {
          updates.push({ id, updates: { x: origin.x + dx, y: origin.y + dy } });
        });
        d({ type: "UPDATE_LAYERS", payload: updates });
      };

      const end = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        endRef.current = null;
        latestRef.current.history?.commitTransaction();
        setDragging(false);
      };

      latestRef.current.history?.beginTransaction();
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
      endRef.current = end;
      setDragging(true);

      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // Synthetic / already-released pointers can't be captured; the
        // window listeners still track the gesture.
      }
    },
    [state, selectedIds, layerId],
  );

  return { dragging, onPointerDown };
}

import type * as React from "react";
